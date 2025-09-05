---
title: "Testing: Remote Requests"
sidebar_label: Remote Requests
description: Mocking remote requests in unit tests.
---

# Testing: Remote Requests

## Introduction

Remote request mocks are a very common use case to test against when unit
testing. Mantle gives you the ability to mock specific requests and fluently
generate a response.

By default Mantle won't mock any HTTP request but will actively notify you when
one is being made inside a unit test. To prevent any non-mocked requests from
being made, see [preventing stray requests](#preventing-stray-requests).

:::note
This only supports requests made via the [`WP_Http`
API](https://developer.wordpress.org/reference/functions/wp_remote_request/)
(`wp_remote_request()`, `wp_remote_get()`, `wp_remote_post()`, etc.)
:::

## Faking Requests

Intercept all remote requests with a specified response code and body using the
`$this->fake_request()` method.

```php
namespace App\Tests;

class ExampleRequestTest extends Test_Case {
  /**
   * Example test.
   */
  public function test_example() {
    $this->fake_request()
      ->with_response_code( 404 )
      ->with_body( 'test body' );

    // You can now make a remote request and it will return a 404.
    $response = wp_remote_get( 'https://example.com/' );
  }
}
```

The `$this->fake_request()` method returns a `Mantle\Testing\Mock_Http_Response` object
that can allow you to fluently build a response. See [generating responses](#generating-responses)
for more information about building a response.

### Faking a Specific Endpoint

You can specify a specific endpoint to fake by passing a URL to the
`$this->fake_request()` method.

```php
namespace App\Tests;

class ExampleRequestTest extends Test_Case {
  /**
   * Example test.
   */
  public function test_example() {
    $this->fake_request( 'https://example.com/path' )
      ->with_response_code( 404 )
      ->with_body( 'test body' );

    // You can now make a remote request to `https://example.com/path` and it will
    // return a 404.
    $response = wp_remote_get( 'https://example.com/path' );
  }
}
```

You can also use wildcards in the URL to match multiple endpoints. The following
example will match any request to `https://example.com/*`.

```php
namespace App\Tests;

class ExampleRequestTest extends Test_Case {
  /**
   * Example test.
   */
  public function test_example() {
    $this->fake_request( 'https://example.com/*' )
      ->with_response_code( 404 )
      ->with_body( 'test body' );

    // You can now make a remote request to `https://example.com/` and it will
    // return a 404.
    $response = wp_remote_get( 'https://example.com/test' );
  }
}
```

### Faking Multiple Endpoints

Faking a specific endpoint, `testing.com` will return a 404 while `github.com`
will return a 500.

```php
namespace App\Tests;

class ExampleRequestTest extends Test_Case {
  /**
   * Example test.
   */
  public function test_example() {
    $this->fake_request( 'https://testing.com/*' )
      ->with_response_code( 404 )
      ->with_body( 'test body' );

    $this->fake_request( 'https://github.com/*' )
      ->with_response_code( 500 )
      ->with_body( 'fake body' );
  }
}
```

Depending on your preferred style, you can also pass an array of URLs and
responses to be faked using the `mock_http_response()` helper:

```php
namespace App\Tests;

use function Mantle\Testing\mock_http_response;

class ExampleRequestTest extends Test_Case {
  /**
   * Example test.
   */
  public function test_example() {
    $this->fake_request( [
      'https://github.com/*'  => mock_http_response()->with_body( 'github' ),
      'https://twitter.com/*' => mock_http_response()->with_body( 'twitter' ),
    ] );
  }
}
```

### Faking With a Callback

If you require more complicated logic to determine the response, you can use a
closure that will be invoked when a request is being faked. It should return a
mocked HTTP response:

```php
namespace App\Tests;

use function Mantle\Testing\mock_http_response;

class ExampleRequestTest extends Test_Case {
  /**
   * Example test.
   */
  public function test_example() {
    $this->fake_request(
      function( string $url, array $request_args ) {
        if ( false === strpos( $url, 'alley.co' ) ) {
          return;
        }

        return $this->mock_response()
          ->with_response_code( 123 )
          ->with_body( 'alley!' );
      }
    );
  }
}
```

The `fake_request()` method also supports typehinting a
`Mantle\Http_Client\Request` object as the first argument, which allows you to
use the request object to determine the response:

```php
namespace App\Tests;

use Mantle\Http_Client\Request;
use function Mantle\Testing\mock_http_response;

class ExampleRequestTest extends Test_Case {
  /**
   * Example test.
   */
  public function test_example() {
    $this->fake_request(
      function( Request $request ) {
        if ( 'alley.com' !== $request->host() ) {
          return;
        }

        return mock_http_response()
          ->with_response_code( 123 )
          ->with_body( 'alley!' );
      }
    );
  }
}
```

If the callback returns an empty value (null/false), the request will not be
faked and the next matching fake will be used, or an actual request will be made
if no matching fake is found.

### Faking Response Sequences

Sometimes a single URL should return a series of fake responses in a specific
order. This can be accomplished via `Mantle\Testing\Mock_Http_Sequence` class
and `mock_http_sequence` helper to build the response sequence.

In the following example, the first request to `github.com` will return a 200,
the second a 400, and the third a 500:

```php
namespace App\Tests;

use function Mantle\Testing\mock_http_sequence;

class ExampleRequestTest extends Test_Case {
  /**
   * Example test.
   */
  public function test_example() {
    $this->fake_request(
      [
        'https://github.com/*' => mock_http_sequence()
          // Push a status code.
          ->push_status( 200 )

          // Push a JSON response.
          ->push_json( [ 1, 2, 3 ] )

          // Push a response with a body.
          ->push_body( 'test body' )

          // Push a entire response object.
          ->push( mock_http_response()->with_status( 204 ) )
      ],
    );
  }
}
```

Any request made in the above example will use a response in the provided
sequence. There are various helpers such as `push_status`, `push_json`,
`push_body`, etc. that can be used to help create a response. You can also pass
a `Mantle\Testing\Mock_Http_Response` object to the `push` method to push a
specific response.

When all the responses in a sequence have been consumed, further requests will
throw an exception because there are no remaining responses that can be
returned. You can also specify a default response that will be returned when
there are no responses left in the sequence:

```php
namespace App\Tests;

use function Mantle\Testing\mock_http_response;
use function Mantle\Testing\mock_http_sequence;

class ExampleRequestTest extends Test_Case {
  /**
   * Example test.
   */
  public function test_example() {
    $this->fake_request(
      [
        'https://github.com/*' => mock_http_sequence()
          ->push_status( 200 )
          ->push_status( 400 )
          ->push_status( 500 )
          ->when_empty( mock_http_response()->with_json( [ 4, 5, 6 ] )
      ],
    );
  }
}
```

### Faking a Specific HTTP Method

By default, a HTTP request will be faked regardless of the method used. If you
want to fake a request only when a specific method is used, you can pass the
`method` argument to the `$this->fake_request()` method:

```php
namespace App\Tests;

class ExampleRequestTest extends Test_Case {
  /**
   * Example test.
   */
  public function test_example() {
    $this->fake_request( 'https://example.com/', method: 'GET' )
      ->with_response_code( 200 )
      ->with_body( 'test body' );

    $this->fake_request( 'https://example.com/', method: 'POST' )
      ->with_response_code( 201 )
      ->with_body( 'test created' );

    // You can now make a remote request and it will return the first fake.
    $response = wp_remote_get( 'https://example.com/' );

    // You can now make a remote request and it will return the second fake.
    $response = wp_remote_post( 'https://example.com/' );
  }
}
```

### Snapshot Testing Remote Requests

Mantle provides the ability to use [snapshot
testing](/docs/testing/snapshot-testing) with HTTP request mocking. This allows
you to record the response of a real remote request and use it for mocking a
request instead of having to manually create the response.

This is especially useful when working with external APIs where you want to test
against real responses without making actual HTTP requests during your test
suite runs. The snapshot is placed in the `__http_snapshots__` directory
relative to the test file.

```php
namespace App\Tests;

use Tests\Test_Case;

class Example_Test extends Test_Case {
  public function test_snapshot_testing() {
    // This will create a snapshot of the response from 'https://alley.com/wp-json/*'
    // The first time the test runs, it will record the response.
    // On subsequent runs, it will use the recorded snapshot.
    $this->fake_request( 'https://alley.com/wp-json/*' )->with_snapshot();

    // Make the request that will use the snapshot
    $response = wp_remote_get( 'https://alley.com/wp-json/wp/v2/posts' );
  }
}
```

#### Customizing Snapshot IDs

By default, Mantle generates a unique snapshot ID based on the test name, HTTP
method, URL, and a hash of the request headers and body. You can customize the
snapshot ID if needed:

```php
namespace App\Tests;

use Tests\Test_Case;

class Example_Test extends Test_Case {
  public function test_custom_snapshot_id() {
    $this->fake_request( 'https://api.example.com/posts' )
        ->with_snapshot( 'custom-snapshot-name' );

    $response = wp_remote_get( 'https://api.example.com/posts' );
  }
}
```

#### Updating Snapshots

When an API response changes and you want to update your snapshots, you can run
your tests with the `--update-snapshots` flag:

```bash
./vendor/bin/phpunit -d --update-snapshots
```

This will update all the snapshots used in your tests to match the current responses

### Generating Responses

`Mantle\Testing\Mock_Http_Response` class, and the
`$this->mock_response()`/`mock_http_response()` helpers exists to help you
fluently build a mock remote response. The following methods are available to
build a response and can be chained together:

#### `with_status( int $status )` / `with_response_code( int $status )`

Create a response with a specific status code.

```php
use function Mantle\Testing\mock_http_response;

mock_http_response()->with_status( 200 );
```

#### `with_body( string $body )`

Create a response with a specific body.

```php
use function Mantle\Testing\mock_http_response;

mock_http_response()->with_body( 'test body' );
```

#### `with_json( $payload )`

Create a response with a JSON body and set the `Content-Type` header to
`application/json`.

```php
use function Mantle\Testing\mock_http_response;

mock_http_response()->with_json( [ 1, 2, 3 ] );
```

You can also pass an array to the `$response` argument of `fake_request()` to
create a response with a JSON body:

```php
use function Mantle\Testing\mock_http_response;

// A request to `https://example.com/` will return a JSON response with the body `[1,2,3]`.
$this->fake_request( 'https://example.com/', [ 1, 2, 3 ] );
```

#### `with_xml( string $payload )`

Create a response with an XML body and set the `Content-Type` header to
`application/xml`.

```php
use function Mantle\Testing\mock_http_response;

mock_http_response()->with_xml( '<xml></xml>' );
```

#### `with_header( string $key, string $value )`

Create a response with a specific header.

```php
use function Mantle\Testing\mock_http_response;

mock_http_response()->with_header( 'Content-Type', 'application/json' );
```

#### `with_headers( array $headers )`

Create a response with specific headers.

```php
use function Mantle\Testing\mock_http_response;

mock_http_response()->with_headers( [ 'Content-Type' => 'application/json' ] );
```

#### `with_cookie( \WP_Http_Cookie $cookie )`

Create a response with a specific cookie.

```php
use function Mantle\Testing\mock_http_response;

$cookie = new \WP_Http_Cookie();
$cookie->name = 'test';
$cookie->value = 'value';

mock_http_response()->with_cookie( $cookie );
```

#### `with_redirect( string $url, int $code = 301 )`

Create a response with a specific redirect.

```php
use function Mantle\Testing\mock_http_response;

mock_http_response()->with_redirect( 'https://wordpress.org/' );
```

#### `with_temporary_redirect( string $url )`

Create a response with a specific temporary redirect.

```php
use function Mantle\Testing\mock_http_response;

mock_http_response()->with_temporary_redirect( 'https://wordpress.org/' );
```

#### `with_file( string $path )`

Create a response with a file as the response body. The appropriate
`Content-Type` header will be set based on the file extension.

```php
use function Mantle\Testing\mock_http_response;

$this->fake_request( 'https://example.com/file' )
  ->with_file( '/path/to/file' );

// Use the `mock_http_response` helper if you'd like.
mock_http_response()->with_file( '/path/to/file' );
```

#### `with_filename( string $filename )`

Create a response with a specific filename.

```php
use function Mantle\Testing\mock_http_response;

$this->fake_request( 'https://example.com/file' )
  ->with_filename( 'test.txt' );

// Use the `mock_http_response` helper if you'd like.
mock_http_response()->with_filename( 'test.txt' );
```

#### `with_image( ?string $filename = null )`

Create a response with an image as the response body. The image will be a JPEG
image by default.

```php
use function Mantle\Testing\mock_http_response;

$this->fake_request( 'https://example.com/image' )
  ->with_image();

// Use the `mock_http_response` helper if you'd like.
mock_http_response()->with_image();
```

## Asserting Requests

All remote requests can be asserted against, even if they're not being faked by
the test case. Mantle will always log if an actual remote request is being made
during a unit test.

### Assertions

#### `assertRequestSent( string|callable|null $url_or_callback = null, int $expected_times = null )`

Assert that a request was sent to a specific URL.

```php
namespace App\Tests;

class ExampleRequestTest extends Test_Case {
  /**
   * Example test.
   */
  public function test_example() {
    Http::get( 'https://example.com/' );

    $this->assertRequestSent( 'https://example.com/' );
  }
}
```

Sometimes you may want to assert that a request was sent with specific mix of
headers/methods/body requirements. This can be done using a callback that is
passed the `Mantle\Http_Client\Request` object:

```php
use Mantle\Facade\Http;
use Mantle\Http_Client\Request;
use Tests\Test_Case;

class Example_Test extends Test_Case {
  public function test_example() {
    Http::with_basic_auth( 'user', 'pass' )
      ->get( 'https://example.com/basic-auth/' );

    // Assert that a request was sent with an authorization header,
    // is a GET request and to a specific URL.
    $this->assertRequestSent( fn ( Request $request ) => $request
      ->has_header( 'Authorization', 'Basic dXNlcjpwYXNz' )
      && 'https://example.com/basic-auth/' === $request->url()
      && 'GET' === $request->method()
    );

    // Assert that a request was not sent with a specific header,
    $this->assertRequestNotSent( fn ( Request $request ) => $request
      ->has_header( 'Content-Type', 'application-json' )
      && 'https://example.com/get/' === $request->url()
      && 'GET' === $request->method()
    );
  }
}
```

#### `assertRequestNotSent( string|callable|null $url_or_callback = null )`

Assert that a request was not sent to a specific URL.

```php
namespace App\Tests;

use Tests\Test_Case;

class ExampleRequestTest extends Test_Case {
  /**
   * Example test.
   */
  public function test_example() {
    Http::get( 'https://example.com/' );

    $this->assertRequestNotSent( 'https://example.com/not-sent/' );
  }
}
```

#### `assertNoRequestSent()`

Assert that no requests were sent.

```php
namespace App\Tests;

use Tests\Test_Case;

class ExampleRequestTest extends Test_Case {
  /**
   * Example test.
   */
  public function test_example() {
    $this->assertNoRequestSent();
  }
}
```

#### `assertRequestCount( int $number )`

Assert that a specific number of requests were sent.

```php
namespace App\Tests;

use Tests\Test_Case;

class ExampleRequestTest extends Test_Case {
  /**
   * Example test.
   */
  public function test_example() {
    Http::get( 'https://example.com/' );

    $this->assertRequestCount( 1 );
  }
}
```

## Preventing Stray Requests

If you would like to ensure that all requests are faked during a unit test, you
can use the `$this->prevent_stray_requests()` method. This will throw an
`RuntimeException` instance if any requests are made that do not have a
corresponding fake.

```php
namespace App\Tests;

use Tests\Test_Case;

class Example_Test extends Test_Case {
  protected function setUp(): void {
    parent::setUp();

    $this->prevent_stray_requests();
  }

  public function test_example() {
    $this->fake_request( 'https://alley.com/*' )
      ->with_response_code( 200 )
      ->with_body( 'alley!' );

    // An 'alley!' response is returned.
    Http::get( 'https://alley.com/' );

    // An exception is thrown because the request was not faked.
    Http::get( 'https://github.com/' );
  }
}
```

Stray requests can be re-enabled by calling `$this->allow_stray_requests()`.

```php
namespace App\Tests;

use Tests\Test_Case;

class Example_Test extends Test_Case {
  protected function setUp(): void {
    parent::setUp();

    $this->prevent_stray_requests();
  }

  public function test_example() {
    $this->fake_request( 'https://alley.com/*' )
      ->with_response_code( 200 )
      ->with_body( 'alley!' );

    Http::get( 'https://alley.com/' );

    $this->allow_stray_requests();

    // An exception is not thrown because stray requests are allowed.
    Http::get( 'https://github.com/' );
  }
}
```

You can also use the `Mantle\Testing\Concerns\Prevent_Remote_Requests` trait to
prevent stray requests in all tests in a test case.

```php
namespace App\Tests;

use Tests\Test_Case;

use Mantle\Testing\Concerns\Prevent_Remote_Requests;

class Example_Test extends Test_Case {
  use Prevent_Remote_Requests;

  public function test_example() {
    $this->fake_request( 'https://alley.com/*' )
      ->with_response_code( 200 )
      ->with_body( 'alley!' );

    // An 'alley!' response is returned.
    Http::get( 'https://alley.com/' );

    // An exception is thrown because the request was not faked.
    Http::get( 'https://github.com/' );
  }
}
```

## Ignoring Stray Requests

There may be cases where you want to ignore stray requests for a specific test
while still preventing them in other tests. You can use the
`$this->ignore_stray_requests()` method to ignore any stray requests matching a
specific URL pattern.

```php
namespace App\Tests;

use Mantle\Testing\Concerns\Prevent_Remote_Requests;
use Tests\Test_Case;

class Example_Test extends Test_Case {
  use Prevent_Remote_Requests;

  public function test_example() {
    $this->ignore_stray_request( 'https://alley.com/*' );

    $this->fake_request( 'https://alley.com/*' )
      ->with_response_code( 200 )
      ->with_body( 'alley!' );
  }
}
```