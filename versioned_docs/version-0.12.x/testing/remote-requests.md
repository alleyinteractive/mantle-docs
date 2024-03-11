# Remote Requests

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

Intercept all remote requests with a specified response code and body.

```php
$this->fake_request()
  ->with_response_code( 404 )
  ->with_body( 'test body' );
```

### Faking Multiple Endpoints

Faking a specific endpoint, `testing.com` will return a 404 while `github.com`
will return a 500.

```php
$this->fake_request( 'https://testing.com/*' )
  ->with_response_code( 404 )
  ->with_body( 'test body' );

$this->fake_request( 'https://github.com/*' )
  ->with_response_code( 500 )
  ->with_body( 'fake body' );
```

You can also pass an array with a set of responses (or a callback) using the
`Mantle\Testing\Mock_Http_Response` class and `mock_http_response` helper:

```php
use function Mantle\Testing\mock_http_response;

$this->fake_request(
  [
    'https://github.com/*'  => mock_http_response()->with_body( 'github' ),
    'https://twitter.com/*' => mock_http_response()->with_body( 'twitter' ),
  ]
);
```

### Faking With a Callback

If you require more complicated logic to determine the response, you can use a
closure that will be invoked when a request is being faked. It should return a
mocked HTTP response:

```php
use function Mantle\Testing\mock_http_sequence;

$this->fake_request(
  function( string $url, array $request_args ) {
    if ( false === strpos( $url, 'alley.co' ) ) {
      return;
    }

    return mock_http_sequence()
      ->with_response_code( 123 )
      ->with_body( 'alley!' );
  }
);
```

### Faking Response Sequences

Sometimes a single URL should return a series of fake responses in a specific
order. This can be accomplished via `Mock_Http_Sequence` class and
`mock_http_sequence` helper to build the response sequence:

```php
use function Mantle\Testing\mock_http_sequence;

$this->fake_request(
  [
    'https://github.com/*' => mock_http_sequence()
      ->push_status( 200 )
      ->push_status( 400 )
      ->push_status( 500 )
  ],
);
```

Any request made in the above example will use a response in the defined
sequence. When all the responses in a sequence have been consumed, further
requests will throw an exception. You can also specify a default response that
will be returned when there are no responses left in the sequence:

```php
use function Mantle\Testing\mock_http_response;
use function Mantle\Testing\mock_http_sequence;

$this->fake_request(
  [
    'https://github.com/*' => Mock_Http_Sequence()
      ->push( mock_http_response()->with_json( [ 1, 2, 3 ] )
      ->push( mock_http_response()->with_json( [ 4, 5, 6 ] )
      ->when_empty( mock_http_response()->with_json( [ 4, 5, 6 ] )
  ],
);
```

## Generating a Response

`Mantle\Testing\Mock_Http_Response` class and `mock_http_response()` helper
exists to help you fluently build a WordPress-style remote response.

```php
use function Mantle\Testing\mock_http_response;

// 404 response.
mock_http_response()
  ->with_response_code( 404 )
  ->with_body( 'test body' );

// JSON response.
mock_http_response()
  ->with_json( [ 1, 2, 3 ] );

// Redirect response.
mock_http_response()
  ->with_redirect( 'https://wordpress.org/' );
```

## Asserting Requests

All remote requests can be asserted against, even if they're not being faked by
the test case. Mantle will log if an actual remote request is being made
during a unit test.

```php
$this->assertRequestSent( 'https://alley.com/' );
$this->assertRequestNotSent( 'https://anothersite.com/' );
$this->assertNoRequestSent();
$this->assertRequestCount( int $number );
```

Requests can also be asserted against using a callback that is passed the
`Mantle\Http_Client\Request` object:

```php
use Mantle\Facade\Http;
use Mantle\Http_Client\Request;
use Tests\Test_Case;

class Example_Test extends Test_Case {
  public function test_example() {
    Http::with_basic_auth( 'user', 'pass' )
      ->get( 'https://example.com/basic-auth/' );

    $this->assertRequestSent( fn ( Request $request ) => $request
      ->has_header( 'Authorization', 'Basic dXNlcjpwYXNz' )
      && 'https://example.com/basic-auth/' === $request->url()
      && 'GET' === $request->method()
    );

    $this->assertRequestNotSent( fn ( Request $request ) => $request
      ->has_header( 'Content-Type', 'application-json' )
      && 'https://example.com/get/' === $request->url()
      && 'GET' === $request->method()
    );

  }
}
```

## Preventing Stray Requests

If you would like to ensure that all requests are faked during a unit test, you
can use the `$this->prevent_stray_requests()` method. This will throw an exception if
any requests are made that are not faked.

```php
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