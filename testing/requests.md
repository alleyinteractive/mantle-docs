# HTTP Tests

[[toc]]

## Introduction

Mantle provides a fluent HTTP Request interface to make it easier to write
feature/integration tests using PHPUnit and WordPress. This library is a
derivative work of Laravel's testing framework, customized to work with
WordPress. In short, this library allows one to mimic a request to WordPress,
and it sets up WordPress' global state as if it were handling that request (e.g.
sets up superglobals and other WordPress-specific globals, sets up and executes
the main query, loads the appropriate template file, etc.). It then creates a
new `Test_Response` object which stores the details of the HTTP response,
including headers and body content. The response object allows the developer to
make assertions against the observable response data, for instance asserting
that some content is present in the response body or that some header was set.

Request methods are HTTP verbs, `get()`, `post()`, `put()`, etc.

## Making Requests

As a basic example, here we create a post via its factory, then request it and
assert we see the post's name (title):

```php
$post = factory( Post::class )->create();

$this->get( $post )
     ->assertSee( $post->name() );
```

In this example, here we request a non-existing resource and assert that it
yields a 404 Not Found response:

```php
$this->get( '/this/resource/does/not/exist/' )
     ->assertNotFound();
```

Lastly, here's an example of POSTing some data to an endpoint, and after
following a redirect, asserting that it sees a success message:

```php
$this->following_redirects()
     ->post( '/profile/', [ 'some_data' => 'hello' ] )
     ->assertSee( 'Success!' );
```

### Request Cookies

Requests can have cookies included with them:

```php
$this
  ->with_cookie( 'session', 'cookie-value' );
  ->get( '/endpoint' );

// Pass multiple cookies.
$this->
  ->with_cookies( [
    'key'     => 'value',
    'another' => 'value',
  ] )
  ->get( '/example' );
```

### Request Headers

Request headers can be set for requests:

```php
$this
  ->with_header( 'api-key', '<value>' )
  ->get( '/example' );

$this
  ->with_headers( [
    'API-Key' => '<value>',
    'X-Nonce' => 'nonce',
  ] )
  ->get( '/example' );
```

### Request Referrer

The request referrer can be passed using the `from` method:

```php
$this->from( 'https://wordpress.org/' )->get( '/example' );
```

### Asserting HTML Responses

HTML responses can be tested against using various methods to assert the
response, including `assertSee()`, `assertElementExists()`, and
`assertElementMissing()`.

The `assertElementExists()` and `assertElementMissing()` methods use
[DOMXPath](https://www.php.net/manual/en/class.domxpath.php) to validate if a
element exists on the page.

```php
$this->get( '/example' )
  ->assertOk()
  ->assertSee( 'mantle' )
  ->assertElementExists( '//script[@data-testid="example-script"]' );
```

## Testing JSON APIs

Mantle includes several helpers for testing JSON APIs and their responses. For
example, `assertJsonPath()` can be used to easily check the response back from a
JSON API. This supports both custom routes and the WordPress REST API.
JSON-requests can also be made via helper functions `json()`, `get_json()`,
`post_json()`, and `put_json()`.

The `assertJsonPath()` supports passing in a XPath to compare a specific element
inside a JSON response. In the example below, we'll be retrieving the `id`
element from the JSON object returned and comparing the value against an
expected value.

```php
$post_id = static::factory()->post->create();

$this->get( rest_url( "/wp/v2/posts/{$post_id}" ) )
  ->assertJsonPath( 'id', $post_id );
```

### Asserting Exact JSON Matches

As previously mentioned, the `assertJsonPath()` method may be used to assert
that a specific JSON. There are also times when you wish to match the JSON
response exactly. Using `assertJsonMissing()` Mantle will compare the response
back and assert if the JSON returned matches the expected value.


```php
$this->get( rest_url( '/mantle/v1/example' ) )
  ->assertJsonMissing( [
    'key' => 'value',
    // ...
  ] );
```

`assertJsonMissingExact()` can also be used to assert that the response does not
contain the exact JSON fragment.

```php
$this->get( rest_url( '/mantle/v1/example' ) )
  ->assertOk()
  ->assertJsonMissingExact( [
    'invalid' => 'value',
  ] );
```

## Available Assertions

`Mantle\Testing\Test_Response` provides many assertions to confirm aspects of the response
return as expected.

### HTTP Status Assertions

* `assertSuccessful()` - Assert 2xx
* `assertOk()` - Assert 200
* `assertStatus( $status )`
* `assertCreated()` - Assert 201
* `assertNoContent( $status = 204 )`
* `assertNotFound()` - Assert 404
* `assertForbidden()` - Assert 403
* `assertUnauthorized()` - Assert 401
* `assertRedirect( $uri = null )` - Asserts that the response is 301 or 302, and
  also runs `assertLocation()` with the `$uri`
* `assertElementExists( string $expression )` - Assert that a given XPath exists
  in the response.
* `assertElementMissing( string $expression )` - Assert that a given XPath does
  not exist in the response.

### JSON Assertions

* `assertJsonPath()` - Assert that the expected value and type exists at the
  given path in the response.
* `assertJsonPathExists()` -- Assert that a specific JSON path exists.
* `assertJsonPathMissing()` -- Assert that a specific JSON path is missing.
* `assertExactJson()` - Assert that the response has the exact given JSON.
* `assertJsonFragment()` - Assert that the response contains the given JSON
  fragment.
* `assertJsonMissing()` - Assert that the response does not contain the given
  JSON fragment.
* `assertJsonMissingExact()` - Assert that the response does not contain the
  exact JSON fragment.
* `assertJsonCount()` - Assert that the response JSON has the expected count of
  items at the given key.

### Header Assertions

* `assertLocation( $uri )`
* `assertHeader( $header_name, $value = null )`
* `assertHeaderMissing( $header_name )`

### Content Body Assertions

* `assertSee( $value )` - Assert the given string exists in the body content
* `assertSeeInOrder( array $values )` - Assert the given strings exist in the
  body content in the given order
* `assertSeeText( $value )` - Similar to `assertSee()` but strips all HTML tags
  first
* `assertSeeTextInOrder( array $values )` - Similar to `assertSeeInOrder()` but
  strips all HTML tags first
* `assertDontSee( $value )`
* `assertDontSeeText( $value )`

### WordPress Query Assertions

* `assertQueryTrue( ...$prop )` - Assert the given WP_Query `is_` functions
  (`is_single()`, `is_archive()`, etc.) return true and all others return false
* `assertQueriedObjectId( int $id )` - Assert the given ID matches the result of
  `get_queried_object_id()`
* `assertQueriedObject( $object )` - Assert that the type and ID of the given
  object match that of `get_queried_object()`
