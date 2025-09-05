---
title: "Testing: HTTP Tests"
sidebar_label: HTTP Tests
description: Mantle provides a fluent HTTP Request interface to make it easier to write feature/integration tests using PHPUnit and WordPress.
---
# Testing: HTTP Tests

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
method asserts that the given string is present in the response body. All HTTP
methods are available to use including `get`, `post`, `put`, `patch`, `delete`
and `options`.

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

Requests can have cookies included with them using the `with_cookie` and
`with_cookies` methods:

```php
$this->with_cookie( 'session', 'cookie-value' )->get( '/endpoint' );

// Pass multiple cookies.
$this->with_cookies( [
  'key'     => 'value',
  'another' => 'value',
] )
  ->get( '/example' );
```

### Request Headers

Request headers can be set for requests using the `with_header` and
`with_headers` methods:

```php
$this->with_header( 'api-key', '<value>' )->get( '/example' );

$this->with_headers( [
  'API-Key' => '<value>',
  'X-Nonce' => 'nonce',
] )
  ->get( '/example' );
```

The `with_header`/`with_headers` methods can be used to set headers for any
request but will only be used for that request you are chaining them to. If you
want to set headers for all requests, you can use the `add_default_header`
method to set a default header that will be used for all requests:

```php
$this->add_default_header( 'X-Header-Name', 'header-value' );

$this->add_default_header( [
  'X-Header-Name' => 'header-value',
  'X-Another-Header' => 'another-value',
] );
```

You can remove the default headers using the `flush_default_headers` method:

```php
$this->flush_default_headers();
```

### Request Referrer

The request referrer can be passed using the `from` method:

```php
$this->from( 'https://wordpress.org/' )->get( '/example' );
```

### ✨ Experimental ✨: Request Hosts

By default, core and Mantle's testing framework will use the `WP_TESTS_DOMAIN`
constant as the host for all requests. There is an experimental feature that
allows you to set the host relative to the value of the `home_url()`
function/`home` option. This can be useful to make the request match the home
URL you have setup in your test environment.

To enable this feature, you can set the `MANTLE_EXPERIMENTAL_TESTING_USE_HOME_URL_HOST`
environment variable to `true` or you can call the `with_experimental_testing_url_host()`
method on the [installation manager](./installation-manager.md#using-the-experimental-feature-for-home-url-in-testing) in your bootstrap file.

Example of a test that would previously have failed:

```php
class Example_Test extends TestCase {
  public function test_example() {
    update_option( 'home', 'https://alley.com' );

    $this->get( '/about/' );

    // Without this feature flag, the HTTP_HOST would be `example.org'.
    $this->assertEquals( 'alley.com', $_SERVER['HTTP_HOST'] );
    $this->assertEquals( 'on', $_SERVER['HTTPS'] );
  }
}
```

### HTTPS Request

Requests will be made "unsecure" by default. The means that the `HTTPS` server
variable will not be set. You can force the request to be made over HTTPS by
using the `with_https` method:

```php
$this->with_https()->get( '/example' );
```

You can also make all requests use HTTPS by setting the site's home URL to
include `https://` and opt-in to the experimental feature to use the home URL
host as the request host when testing.

### Fetching Posts

You can also use the `fetch_post()` method which combines post creation and HTTP
request in one step. This method creates a post with the given attributes and
then makes a GET request to its permalink:

```php
$this->fetch_post( [
	'post_title' => 'Hello World',
	'post_content' => 'This is the content.',
] )
	->assertOk()
	->assertSee( 'Hello World' );
```

This is equivalent to:

```php
$post = static::factory()->post->create_and_get( [
	'post_title' => 'Hello World',
	'post_content' => 'This is the content.',
] );

$this->get( $post->permalink() )
	->assertOk()
	->assertSee( 'Hello World' );
```

## Testing Responses

After making a request, you can make assertions against the response using the
`Mantle\Testing\Test_Response` object returned by the request methods. The class
has various methods to make assertions against the response with some more
specific to the type of response (HTML, JSON, etc.).

```php
namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase {
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

All available assertions are listed in the
[Available Assertions](#available-assertions) section. The following sections will
provide examples of how to use some of the most common assertions with some examples
for specific types of responses.

## Testing HTML Responses

HTML responses can be tested against using various methods to assert the
response, including `assertSee()`, `assertElementExists()`, `assertElementMissing()`, `assertQuerySelectorExists()`, and `assertQuerySelectorMissing()`.

The `assertElementExists()` and `assertElementMissing()` methods use
[DOMXPath](https://www.php.net/manual/en/class.domxpath.php) to validate if a
element exists on the page. The `assertQuerySelectorExists()` and
`assertQuerySelectorMissing()` methods use the
[Symfony CSS Selector](https://symfony.com/doc/current/components/css_selector.html)
to validate if a element exists on the page.

```php
$this->get( '/example' )
  ->assertOk()
  ->assertSee( 'mantle' )
  ->assertElementExists( '//script[@data-testid="example-script"]' )
  ->assertQuerySelectorExists( 'script[data-testid="example-script"]' );
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

For more information see [Element Assertions](#element-assertions).

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

#### assertContent

Assert that a response has a given status code (default to 200) and content.

```php
$response->assertContent( mixed $value );
```

Also supports passing a callable to assert the content, which will be
executed with the response body as the first argument. This is useful for
making custom assertions against the response body. The callable should
return `true` if the assertion passes, or `false` if it fails.

```php
$response->assertContent( function( string $body ) {
  return str_contains( $body, 'Hello World' );
} );
```

#### assertNoContent

Assert that a response has a given status code (default to 204) and no content.

```php
$response->assertNoContent( int $status = 204 );
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

Element assertions are used to assert the presence, absence, etc. of elements in
the response body. These assertions use
[DOMXPath](https://www.php.net/manual/en/class.domxpath.php) and support query
selectors via the `symfony/css-selector` package.


:::tip Are you looking to assert against a HTML string that is not a response?

If you are looking to assert against a HTML string that is not a response, you
can use the [HTML String](./helpers.md#html-string) helper to make assertions.
:::

#### assertQuerySelectorExists

Assert that a given CSS selector exists in the response.

```php
$response->assertQuerySelectorExists( string $selector );
```

#### assertQuerySelectorMissing

Assert that a given CSS selector does not exist in the response.

```php
$response->assertQuerySelectorMissing( string $selector );
```

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

#### assertElementCount

Assert that the response has the expected number of elements matching the given
XPath expression.

```php
$response->assertElementCount( string $expression, int $expected );
```

#### assertQuerySelectorCount

Assert that the response has the expected number of elements matching the given
CSS selector.

```php
$response->assertQuerySelectorCount( string $selector, int $expected );
```

#### assertElementExistsByTestId

Assert that an element with the given `data-testid` attribute exists in the response.

```php
$response->assertElementExistsByTestId( string $test_id );
```

#### assertElementMissingByTestId

Assert that an element with the given `data-testid` attribute does not exist in the response.

```php
$response->assertElementMissingByTestId( string $test_id );
```

#### assertElement

Assert that the given element exists in the response and passes the given
assertion. This can be used to make custom assertions against the element that
cannot be expressed in a simple XPath expression or query selector.

```php
$response->assertElement( string $expression, callable $assertion, bool $pass_any = false );
```

If `$pass_any` is `true`, the assertion will pass if any of the elements pass
the assertion. Otherwise, all elements must pass the assertion. Let's take a
look at an example:

```php
use DOMElement;

$response->assertElement(
  '//div',
  fn ( DOMElement $element ) => $this->assertEquals( 'Hello World', $element->textContent )
    && $this->assertNotEmpty( $element->getAttribute( 'class' ) ) );
  },
);
```

#### assertQuerySelector

Assert that the given CSS selector exists in the response and passes the given
assertion. Similar to `assertElement`, this can be used to make custom
assertions against the element that cannot be expressed in a simple XPath
expression or query selector.

```php
$response->assertQuerySelector( string $selector, callable $assertion, bool $pass_any = false );
```

Let's take a look at an example:

```php
use DOMElement;

$response->assertQuerySelector(
  'div > p',
  fn ( DOMElement $element ) => $this->assertEquals( 'Hello World', $element->textContent )
    && $this->assertNotEmpty( $element->getAttribute( 'class' ) ) );
  },
);
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
