---
title: "Testing: Pest"
sidebar_label: Pest
description: Write Mantle tests using Pest's expressive, function-based syntax.
---
# Testing: Pest

## Introduction

Mantle's Testing Framework supports writing tests with [Pest](https://pestphp.com/) through the [alleyinteractive/pest-plugin-wordpress](https://github.com/alleyinteractive/pest-plugin-wordpress) package. Every feature of the testing framework is available in Pest tests: requests, factories, users, remote request fakes, assertions, and more. Pest tests using Mantle can be run with or without the rest of the framework.

```php
use function Pest\PestPluginWordPress\fetchPost;

it( 'displays a single post', function () {
	fetchPost( [ 'post_title' => 'Hello Pest' ] )
		->assertOk()
		->assertSee( 'Hello Pest' )
		->assertQueryTrue( 'is_single', 'is_singular' );
} );
```

:::note
The plugin requires PHP 8.3+ and supports Pest 4 and Pest 5.
:::

## Installation

Install the plugin via Composer:

```bash
composer require alleyinteractive/pest-plugin-wordpress --dev
```

### Using the Mantle Framework

On a Mantle application, run the `pest:install` command to create a `tests/Pest.php` file and an example test:

```bash
wp mantle pest:install
```

You can generate new Pest tests with the `pest:test` command. The name is relative to the `tests/` directory:

```bash
wp mantle pest:test Feature/PostTest
```

### Without the Mantle Framework

Pest can be used on any WordPress plugin or theme through [Mantle Testkit](./testkit.md). If you don't have Pest set up already, create a `tests` folder and run `pest --init`:

```bash
./vendor/bin/pest --init
```

Open the `tests/Pest.php` file it created and bind your tests to the Testkit test case, then install WordPress:

```php
use Mantle\Testkit\TestCase;

uses( TestCase::class )->in( __DIR__ );

\Mantle\Testing\install();
```

You can customize the installation with the [Installation Manager](./installation-manager.md) instead of calling `install()` directly. For example, to install WordPress using SQLite:

```php
use Mantle\Testkit\TestCase;

uses( TestCase::class )->in( __DIR__ );

\Mantle\Testing\manager()
	->with_sqlite()
	->install();
```

### Running Tests

Run your tests with the Pest binary:

```bash
./vendor/bin/pest
```

## Writing Tests

Pest binds each test closure to the test case configured in `tests/Pest.php`, so `$this` inside a test is a Mantle test case. Any method you would call in a class-based test works the same way in Pest:

```php
it( 'creates a published post', function () {
	$post = static::factory()->post->create_and_get();

	$this->assertEquals( 'publish', $post->post_status );

	$this->get( $post )->assertOk();
} );
```

The plugin also provides namespaced functions that wrap the most common methods, which lets you write tests without `$this` and pairs well with Pest's [expectations](https://pestphp.com/docs/expectations). Import the functions you need with `use function`:

```php
use function Pest\PestPluginWordPress\factory;

it( 'creates a post', function () {
	$post = factory()->post->create_and_get();

	expect( $post )
		->toBeInstanceOf( WP_Post::class )
		->post_status->toBe( 'publish' );
} );
```

### Hooks and Shared Setup

Pest's `beforeEach()` and `afterEach()` hooks are also bound to the test case, which makes them a good place for setup shared across the tests in a file:

```php
use function Pest\PestPluginWordPress\factory;
use function Pest\PestPluginWordPress\get;

beforeEach( function () {
	$this->category = factory()->category->create_and_get( [ 'name' => 'News' ] );
} );

it( 'loads the category archive', function () {
	get( get_term_link( $this->category ) )
		->assertOk()
		->assertQueryTrue( 'is_archive', 'is_category' )
		->assertQueriedObjectId( $this->category->term_id );
} );
```

You can also apply Mantle traits such as `Refresh_Database` to every test from `tests/Pest.php`:

```php
use Mantle\Testing\Concerns\Refresh_Database;
use Mantle\Testkit\TestCase;

uses( TestCase::class, Refresh_Database::class )->in( __DIR__ );
```

### Datasets

Pest's [datasets](https://pestphp.com/docs/datasets) work with Mantle's request testing to run the same test against several inputs:

```php
use function Pest\PestPluginWordPress\get;

it( 'loads core pages', function ( string $path ) {
	get( $path )->assertOk();
} )->with( [
	'homepage' => '/',
	'feed'     => '/feed/',
	'sitemap'  => '/wp-sitemap.xml',
] );
```

## HTTP Requests

The request functions mirror the [HTTP testing](./requests.mdx) methods and return a `Test_Response` with all of the [available assertions](./requests.mdx#available-assertions):

```php
use function Pest\PestPluginWordPress\factory;
use function Pest\PestPluginWordPress\get;

it( 'loads the homepage', function () {
	get( '/' )
		->assertOk()
		->assertSee( get_bloginfo( 'name' ) );
} );

it( 'returns a 404 for a missing page', function () {
	get( '/this-page-does-not-exist/' )->assertNotFound();
} );

it( 'returns a post from the REST API', function () {
	$post_id = factory()->post->create();

	get( rest_url( "wp/v2/posts/{$post_id}" ) )
		->assertOk()
		->assertJsonPath( 'id', $post_id );
} );
```

`fetchPost()` creates a post with the factory and requests its permalink in one call:

```php
use function Pest\PestPluginWordPress\fetchPost;

it( 'renders the post title', function () {
	fetchPost( [ 'post_title' => 'Example Title' ] )
		->assertOk()
		->assertElementExists( '//h1[contains(., "Example Title")]' );
} );
```

Use `withHeader()`, `from()`, and `request()` to build a request fluently before sending it:

```php
use function Pest\PestPluginWordPress\from;
use function Pest\PestPluginWordPress\request;
use function Pest\PestPluginWordPress\withHeader;

it( 'sends a custom header', function () {
	withHeader( 'X-Custom-Header', 'value' )
		->get( '/' )
		->assertOk();
} );

it( 'loads with a referrer', function () {
	from( 'https://example.com/' )
		->get( '/' )
		->assertOk();
} );

it( 'requests JSON', function () {
	request()
		->with_headers( [ 'Accept' => 'application/json' ] )
		->get( rest_url( 'wp/v2/posts' ) )
		->assertOk()
		->assertIsJson();
} );
```

## Users and Authentication

`actingAs()` authenticates as a user for the rest of the test. It accepts a user object, user ID, or a role name, which creates a new user with that role. See [Users and Authentication](./users.md) for more information.

```php
use function Pest\PestPluginWordPress\actingAs;
use function Pest\PestPluginWordPress\assertAuthenticated;
use function Pest\PestPluginWordPress\assertNotAuthenticated;
use function Pest\PestPluginWordPress\get;

it( 'starts as a guest', function () {
	assertNotAuthenticated();
} );

it( 'allows editors into the admin', function () {
	$user = actingAs( 'editor' );

	assertAuthenticated( $user );

	expect( current_user_can( 'edit_others_posts' ) )->toBeTrue();
} );
```

## Remote Requests

`fakeRequest()` fakes responses to remote requests made with the `WP_Http` API. It accepts the same arguments as `$this->fake_request()`, so you can fake a single URL, a set of URLs, or use a callback. See [Remote Requests](./remote-requests.md) for all of the ways to build a response.

```php
use function Pest\PestPluginWordPress\fakeRequest;
use function Pest\PestPluginWordPress\preventStrayRequests;

beforeEach( function () {
	preventStrayRequests();
} );

it( 'fetches the latest release', function () {
	fakeRequest( 'https://api.github.com/repos/*' )
		->with_json( [ 'tag_name' => 'v1.0.0' ] );

	$response = wp_remote_get( 'https://api.github.com/repos/alleyinteractive/mantle/releases/latest' );

	expect( json_decode( wp_remote_retrieve_body( $response ), true ) )
		->tag_name->toBe( 'v1.0.0' );

	$this->assertRequestSent( 'https://api.github.com/repos/alleyinteractive/mantle/releases/latest' );
} );

it( 'fakes multiple endpoints', function () {
	fakeRequest( [
		'https://github.com/*'  => mock_http_response()->with_body( 'github' ),
		'https://example.com/*' => mock_http_response()->with_status( 404 ),
	] );

	expect( wp_remote_retrieve_response_code( wp_remote_get( 'https://example.com/missing' ) ) )
		->toBe( 404 );
} );
```

`preventStrayRequests()` causes any remote request that isn't faked to fail, and `allowStrayRequests()` turns that back off. See [preventing stray requests](./remote-requests.md#preventing-stray-requests) for more information.

## Available Functions

All functions live in the `Pest\PestPluginWordPress` namespace.

| Function | Equivalent Method | Description |
| --- | --- | --- |
| `get( $uri, $headers )` | `$this->get()` | Make a `GET` request. |
| `post( $uri, $data, $headers )` | `$this->post()` | Make a `POST` request. |
| `put( $uri, $data, $headers )` | `$this->put()` | Make a `PUT` request. |
| `patch( $uri, $data, $headers )` | `$this->patch()` | Make a `PATCH` request. |
| `delete( $uri, $data, $headers )` | `$this->delete()` | Make a `DELETE` request. |
| `options( $uri, $data, $headers )` | `$this->options()` | Make an `OPTIONS` request. |
| `head( $uri, $headers )` | `$this->head()` | Make a `HEAD` request. |
| `fetchPost( $arguments )` | | Create a post and request its permalink. |
| `request()` | `$this->with_headers( [] )` | Start a fluent request. |
| `withHeader( $name, $value )` | `$this->with_header()` | Start a request with a header. |
| `from( $url )` | `$this->with_header( 'referer', $url )` | Start a request with a referrer. |
| `factory()` | `static::factory()` | Get the [factory](./factory.md) container. |
| `actingAs( $user )` | `$this->acting_as()` | Authenticate as a user. |
| `assertAuthenticated( $user )` | `$this->assertAuthenticated()` | Assert a user is authenticated. |
| `assertNotAuthenticated()` | `$this->assertNotAuthenticated()` | Assert no user is authenticated. |
| `fakeRequest( $url_or_callback, $response, $method )` | `$this->fake_request()` | Fake a remote request. |
| `preventStrayRequests( $response )` | `$this->prevent_stray_requests()` | Fail any remote request that isn't faked. |
| `allowStrayRequests()` | `$this->allow_stray_requests()` | Allow remote requests that aren't faked. |

For anything not covered by a function, use `$this` inside the test closure.
