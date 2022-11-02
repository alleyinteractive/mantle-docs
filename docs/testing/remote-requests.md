# Remote Requests

## Introduction

Remote request mocks are a very common use case to test against when unit
testing. Mantle gives you the ability to mock specific requests and fluently
generate a response.

By default Mantle won't mock any HTTP request but will actively notify you when
one is being made inside a unit test.

::: warning
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

You can also pass an array with a set of responses (or a callback):

```php
use Mantle\Testing\Mock_Http_Response;

$this->fake_request(
  [
    'https://github.com/*'  => Mock_Http_Response::create()->with_body( 'github' ),
    'https://twitter.com/*' => Mock_Http_Response::create()->with_body( 'twitter' ),
  ]
);
```

### Faking With a Callback

If you require more complicated logic to determine the response, you can use a
closure that will be invoked when a request is being faked. It should return a
mocked HTTP response:

```php
$this->fake_request(
  function( string $url, array $request_args ) {
    if ( false === strpos( $url, 'alley.co' ) ) {
      return;
    }

    return Mock_Http_Response::create()
      ->with_response_code( 123 )
      ->with_body( 'alley!' );
  }
);
```

### Faking Response Sequences

Sometimes a single URL should return a series of fake responses in a specific
order. This can be accomplished via `Mock_Http_Sequence` to build the response
sequence:

```php
$this->fake_request(
  [
    'https://github.com/*' => Mock_Http_Sequence::create()
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
$this->fake_request(
  [
    'https://github.com/*' => Mock_Http_Sequence::create()
      ->push( Mock_Http_Response::create()->with_json( [ 1, 2, 3 ] )
      ->push( Mock_Http_Response::create()->with_json( [ 4, 5, 6 ] )
      ->when_empty( Mock_Http_Response::create()->with_json( [ 4, 5, 6 ] )
  ],
);
```

## Generating a Response

`Mantle\Testing\Mock_Http_Response` exists to help you fluently build
a WordPress-style remote response.

```php
use Mantle\Testing\Mock_Http_Response;

// 404 response.
Mock_Http_Response::create()
  ->with_response_code( 404 )
  ->with_body( 'test body' );

// JSON response.
Mock_Http_Response::create()
  ->with_json( [ 1, 2, 3 ] );

// Redirect response.
Mock_Http_Response::create()
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

Requests can also be asserted against using a callback that is passed the `Mantle\Http_Client\Request` object:

```php
use Mantle\Facade\Http;
use Mantle\Http_Client\Request;

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
```
