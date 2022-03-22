# HTTP Client

[[toc]]

## Introduction

Mantle provides a fluent and expressive wrapper around the [WordPress HTTP
API](https://developer.wordpress.org/plugins/http-api/) allowing you to quickly
make HTTP requests with external services. The HTTP Client combined with support
for [testing and faking Remote Requests](../testing/remote-requests.md) provides
you a full solution for making and testing external HTTP requests end-to-end.

::: details Future Plans
In the future, the HTTP Client will be abstracted to support the Guzzle HTTP Client
and multipart requests. This also allows parallel requests to be made.
:::

## Making Requests

Making requests with the HTTP Client can be done using any HTTP verb such as
`get`, `head`, `post`, `put`, `delete` and `patch`. Requests can be made using
the `Http` facade class or by instantiating `Mantle\Http\Client\Http_Client`
directly:

```php
use Mantle\Facade\Http;

$response = Http::get( 'https://example.org/' );
```

### Responses

The `get` method (and all other HTTP verb methods) return an instance of
`Mantle\Http\Client\Response`, which provides a flexible wrapper on top of the
raw WordPress HTTP API response.

```php
$response->body()
$response->client_error(): bool
$response->collect( $key = null ): \Mantle\Support\Collection
$response->cookie( string $name ): ?\WP_HTTP_Cookie
$response->cookies(): array
$response->dd()
$response->dump()
$response->failed(): bool
$response->forbidden(): bool
$response->header( string $header )
$response->headers(): array
$response->is_json(): bool
$response->is_xml(): bool
$response->json( $key = null, $default = null )
$response->object()
$response->ok(): bool
$response->redirect(): bool
$response->response(): array
$response->server_error(): bool
$response->status(): int
$response->successful(): bool
$response->unauthorized(): bool
$response->xml( string $xpath = null, $default = null )
```

The `Mantle\Http\Client\Response` object also implements the `ArrayAccess`,
allowing you to access JSON/XML response properties directly on the response.

```php
return Http::get( 'https://httpbin.org/json' )['slideshow'];
```

### Request Data

Many HTTP requests include some sort of a payload for `POST`, `PUT`, `PATCH`,
and `DELETE` methods. These methods access an array of data as their second
argument. By default these will be sent using JSON:

```php
use Mantle\Facade\Http;

Http::post( 'http://example.org/endpoint', [
  'name' => 'Mantle',
] );
```

#### Sending a Body

Requests can also be made using a form body or a raw body:

```php
use Mantle\Facade\Http;

Http::as_form()->post( 'http://example.org/endpoint', [
  'name' => 'Mantle',
] );

Http::with_body( 'raw-body' )->post( 'http://example.org/endpoint' );
```

#### GET Request Query Parameters

When making `GET` requests, you can either pass a URL with a query string
directly or pass an array of key / value pairs as the second argument:

```php
use Mantle\Facade\Http;

// The actual URL will be https://example.org/query?name=mantle
Http::get( 'https://example.org/query', [
  'name' => 'mantle',
] );
```

### Headers

Headers can be added to a request using the `with_header()` and `with_headers()`
methods:

```php
Http::with_headers( [
  'X-Api-Key' => 'password',
] )->post( 'https://example.org' );

Http::with_header( 'X-Special-Header', 'value' )->post( 'https://example.org' );
```

The `accept` method can be used to specify the content type that your
application is expecting in response:

```php
Http::accept( 'text/plain' )->post( 'https://example.org' );
Http::accept_json()->post( 'https://example.org' );
```

### Authentication

You can specify basic authentication and bearer token credentials with built-in
helper methods:

```php
Http::with_basic_auth( 'username', 'password' )->post( 'https://example.org' );

// Passed as Authorization: Bearer <value>
Http::with_token( '<value>' )->post( 'https://example.org' );
```

### Timeout

The `timeout` method may be used to specify a maximum number of seconds to wait
for a response. The default is 5 seconds:

```php
Http::with_timeout( 10 )->post(...);
```

### Retries

If you would like HTTP client to automatically retry the request if a client or
server error occurs, you may use the `retry` method. The `retry` method accepts
the maximum number of times the request should be attempted and the number of
milliseconds that Mantle should wait in between attempts:

```php
Http::retry( 3 )->post(...);
```

## Base API Client

The HTTP Client can be used as a basis for a API Client for an external service.
For example, if you are making requests to `https://httpbin.org` and want to
include built-in authentication, you could create a reusable API client by
returning `Mantle\Http\Client\Http_Client`:

```php
use Mantle\Http\Client\Http_Client;

$client = Http_Client::create()
  ->base_url( 'https://httpbin.org' )
  ->with_token( '<token>' );

// Requests can now be made without specifying the base URL:
$response = $client->post( '/example-endpoint', [
  'name' => 'Mantle Http Client',
] );
```

### Middleware

Requests can have middleware applied to them to allow the request and the
response to be modified. One use case is to calculate a checksum header based on
body of the request and pass that along with the request:

```php
use Closure;
use Mantle\Http\Client\Http_Client;

$client = Http_Client::create()
  ->base_url( 'https://api.github.com' )
  ->middleware( function ( Http_Client $client, Closure $next ) {
    $client->with_header( 'Authorization', md5( $client->url() . $client->body() ) );

    // You can also run the callback and then modify the response.
    return $next( $client );
  } );
```