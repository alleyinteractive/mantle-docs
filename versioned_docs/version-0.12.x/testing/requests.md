# HTTP Tests

## Introduction

Mantle provides a fluent HTTP Request interface to make it easier to write
feature/integration tests using PHPUnit and WordPress. This library is a
derivative work of Laravel's testing framework, customized to work with
WordPress.

In short, this library allows one to mimic a request to WordPress, and it sets
up WordPress' global state as if it were handling that request (e.g. sets up
superglobals and other WordPress-specific globals, sets up and executes the main
query, loads the appropriate template file, etc.). It then creates a new
`Test_Response` object which stores the details of the HTTP response, including
headers and body content. The response object allows the developer to make
assertions against the observable response data, for instance asserting that
some content is present in the response body or that some header was set.

For example, here's a simple test that asserts that a given post's title is
present on the page:

```php
namespace Tests\Feature;

use Tests\TestCase;

class Example_Test extends TestCase {
  /**
   * A basic test example.
   *
   * @return void
   */
  public function test_basic_test() {
    $post = static::factory()->post->create_and_get( [
      'post_title' => 'Hello World',
    ] );

    $this->get( $post->permalink() )
      ->assertOk()
      ->assertSee( 'Hello World' );
  }
}
```

The `get` method makes a `GET` requests to the given URI, and the `assertSee`
method asserts that the given string is present in the response body.

## Making Requests

As a basic example, here we create a post via its factory, then request it and
assert we see the post's name (title):

```php
$post = static::factory()->post->create_and_get();

$this->get( $post )
     ->assertSee( $post->post_title );
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
$this
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

You can also use other methods to assert if the response has/does not have an
element by class or ID.

```php
$this->get( '/example' )
  ->assertOk()

  // By class name.
  ->assertElementExistsByClass( 'example-class' )
  ->assertElementMissingByClass( 'invalid-class' )

  // By element ID.
  ->assertElementExistsById( 'example-id' )
  ->assertElementMissingById( 'invalid-id' )

  // By tag name.
  ->assertElementExistsByTagName( 'div' )
  ->assertElementMissingByTagName( 'script' );
```

### Query Assertions

Mantle supports making assertions against the global WordPress query and its
related queried object/ID.

You may use `assertQueryTrue()` to assert the given WP_Query `is_` functions
(`is_single()`, `is_archive()`, etc.) return true and all others return false.

```php
$this->get( static::factory()->post->create_and_get() )
  ->assertQueryTrue( 'is_single', 'is_singular' );

$this->get( '/' )
  ->assertQueryTrue( 'is_home', 'is_front_page );
```

You may use `assertQueriedObjectId()` to assert the given ID matches the result
of `get_queried_object_id()`. `assertQueriedObject()` can be used to assert that
the type and ID of the given object match that of `get_queried_object()`.

```php
$this->get( static::factory()->post->create_and_get() )
  ->assertQueriedObjectId( $post->ID )
  ->assertQueriedObject( $post );
```

### Debugging Responses

After making a test request, you may use the `dump` or `dump_headers` methods to dump the
response body or headers to the console.

```php
$this->get( '/example' )
  ->dump()
  ->dump_headers();
```

Alternatively, you may use the `dd` or `dd_headers` methods to print the response body or
headers and end the test.

```php
$this->get( '/example' )->dd();

$this->get( '/example' )->dd_headers();
```

You can use the `dumpJson()`/`ddJson()` methods to dump the JSON response body
from a (optional) specific path.

```php
$this->get( '/example' )
  ->dumpJson()
  ->dumpJson( 'data' );

$this->get( '/example' )->ddJson();
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

For more information see [JSON Assertions](#json-assertions).

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

## Before/After Callbacks

You may use `before_request()` and `after_request()` to register callbacks to be
run before and after each test request. These callbacks are useful for
registering and unregistering hooks, filters, and other WordPress functionality
that may be required for your tests.

```php
namespace App\Tests;

class Example_Callback_Test extends Test_Case {
  protected function setUp(): void {
    parent::setUp();

    $this->before_request( function() {
      // Register hooks, filters, etc. that should apply to HTTP requests.
    } );

    $this->after_request( function() {
      // Unregister hooks, filters, etc.
    } );
  }

  public function test_example_callbacks() {
    // ...
  }
}
```

## Available Assertions

`Mantle\Testing\Test_Response` provides many assertions to confirm aspects of the response
return as expected.

### HTTP Status Assertions

#### assertSuccessful

Assert that a response has a (>= 200 and < 300) HTTP status code.

```php
$response->assertSuccessful();
```

#### assertOk

Assert that a response has a 200 HTTP status code.

```php
$response->assertOk();
```

#### assertStatus

Assert that a response has a given HTTP status code.

```php
$response->assertStatus( $status );
```

#### assertCreated

Assert that a response has a 201 HTTP status code.

```php
$response->assertCreated();
```

#### assertNoContent

Assert that a response has a given status code (default to 204) and no content.

```php
$response->assertNoContent( $status = 204 );
```

#### assertNotFound

Assert that a response has a 404 HTTP status code.

```php
$response->assertNotFound();
```

#### assertForbidden

Assert that a response has a 403 HTTP status code.

```php
$response->assertForbidden();
```

#### assertUnauthorized

Assert that a response has a 401 HTTP status code.

```php
$response->assertUnauthorized();
```

#### assertRedirect

Assert that a response has a redirect to a given URI and has a 301 or 302 HTTP
status code.

```php
$response->assertRedirect( $uri = null );
```

### Element Assertions

#### assertElementExists

Assert that a given XPath exists in the response.

```php
$response->assertElementExists( string $expression );
```

#### assertElementMissing

Assert that a given XPath does not exist in the response.

```php
$response->assertElementMissing( string $expression );
```

#### assertElementExistsByClass

Assert that a given class exists in the response.

```php
$response->assertElementExistsByClass( string $class );
```

#### assertElementMissingByClass

Assert that a given class does not exist in the response.

```php
$response->assertElementMissingByClass( string $class );
```

#### assertElementExistsById

Assert that a given ID exists in the response.

```php
$response->assertElementExistsById( string $id );
```

#### assertElementMissingById

Assert that a given ID does not exist in the response.

```php
$response->assertElementMissingById( string $id );
```

#### assertElementExistsByTagName

Assert that a given tag name exists in the response.

```php
$response->assertElementExistsByTagName( string $tag_name );
```

#### assertElementMissingByTagName

Assert that a given tag name does not exist in the response.

```php
$response->assertElementMissingByTagName( string $tag_name );
```

### Header Assertions

#### assertLocation

Assert that the response has a `Location` header matching the given URI.

```php
$response->assertLocation( $uri );
```

#### assertHeader

Assert that the response has a given header and optionally the given value.

```php
$response->assertHeader( $header_name, $value = null );
```

#### assertHeaderMissing

Assert that the response does not have a given header and optional value.

```php
$response->assertHeaderMissing( $header_name );
$response->assertHeaderMissing( $header_name, $value );
```

### JSON Assertions

#### assertJsonPath

Assert that the expected value and type exists at the given path in the response.

```php
$response->assertJsonPath( string $path, $expect );
```

#### assertJsonPathMatches

Assert that the value at the given path matches the given regular expression.

```php
$response->assertJsonPathMatches( string $path, string $pattern );
```

### assertJsonPathNotMatches

Assert that the value at the given path does not match the given regular expression.

```php
$response->assertJsonPathNotMatches( string $path, string $pattern );
```

#### assertJsonPathExists

Assert that a specific JSON path exists.

```php
$response->assertJsonPathExists( string $path );
```

#### assertJsonPathMissing

Assert that a specific JSON path is missing.

```php
$response->assertJsonPathMissing( string $path );
```

#### assertJsonPathEmpty

Assert that a specific JSON path is empty.

```php
$response->assertJsonPathEmpty( string $path );
```

#### assertJsonPathNotEmpty

Assert that a specific JSON path is not empty.

```php
$response->assertJsonPathNotEmpty( string $path );
```

#### assertJsonPathContains

Assert that the value at the given path contains the given value.

```php
$response->assertJsonPathContains( string $path, $value );
```

#### assertJsonPathNotContains

Assert that the value at the given path does not contain the given value.

```php
$response->assertJsonPathNotContains( string $path, $value );
```

#### assertExactJson

Assert that the response has the exact given JSON.

```php
$response->assertExactJson( array $data );
```

#### assertJsonFragment

Assert that the response contains the given JSON fragment.

```php
$response->assertJsonFragment( array $data);
```

#### assertJsonMissing

Assert that the response does not contain the given JSON fragment.

```php
$response->assertJsonMissing( array $data );
```

#### assertJsonMissingExact

Assert that the response does not contain the exact JSON fragment.

```php
$response->assertJsonMissingExact( array $data );
```

#### assertJsonCount

Assert that the response JSON has the expected count of items at the given key.

```php
$response->assertJsonCount( int $count, string $key = null );
```

#### assertJsonStructure

Assert that the response has a given JSON structure.

```php
$response->assertJsonStructure( array $structure = null);
```

#### assertJsonPathCallback

Assert that the given callback returns true for the value at the given path.

```php
$response->assertJsonPathCallback( string $path, callable $callback );
```

#### assertIsJson

Assert that the response has a valid JSON structure and `content-type` header
with `application/json`.

```php
$response->assertIsJson();
```

#### assertIsNotJson

Assert that the response does not have a valid JSON structure or `content-type`
header with `application/json`.

```php
$response->assertIsNotJson();
```

### Content Body Assertions

#### assertSee

Assert the given string exists in the body content

```php
$response->assertSee( $value );
```

#### assertSeeInOrder

Assert the given strings exist in the body content in the given order

```php
$response->assertSeeInOrder( array $values );
```

#### assertSeeText

Similar to `assertSee()` but strips all HTML tags first

```php
$response->assertSeeText( $value );
```

#### assertSeeTextInOrder

Similar to `assertSeeInOrder()` but strips all HTML tags first

```php
$response->assertSeeTextInOrder( array $values );
```

#### assertDontSee

Assert the given string does not exist in the body content.

```php
$response->assertDontSee( $value );
```

#### assertDontSeeText

Similar to `assertDontSee()` but strips all HTML tags first.

```php
$response->assertDontSeeText( $value );
```


### WordPress Query Assertions

#### assertQueryTrue

Assert the given `WP_Query`'s `is_` functions (`is_single()`, `is_archive()`, etc.) return true and all others return false

```php
$response->assertQueryTrue( ...$prop );
```

#### assertQueriedObjectId

Assert the given ID matches the result of `get_queried_object_id()`.

```php
$response->assertQueriedObjectId( int $id );
```

#### assertQueriedObject

Assert that the type and ID of the given object match that of `get_queried_object()`.

```php
$response->assertQueriedObject( $object );
```
