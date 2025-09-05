---
title: URI Manipulation
description: Manipulate and work with URIs using Mantle's fluent URI class and helpers
sidebar_position: 2
---

# URI Manipulation

## Introduction

Mantle provides a fluent interface for working with URIs through the `Uri` class. This class allows you to create, parse, and manipulate various components of a URI including scheme, host, path, query parameters, and fragments. The `Uri` class is built on top of the League URI package and provides a more friendly interface for common URI operations.

Whether you need to build complex URLs, modify query parameters, or generate redirect responses, the `Uri` class makes these operations straightforward and expressive.

## Creating URI Instances

### Using the Helper Function

The simplest way to create a URI instance is using the `uri()` helper function:

```php
use function Mantle\Support\Helpers\uri;

// Create a URI from a string
$uri = uri('https://example.com/path?query=value');

// Get the current request URI
$current = uri();
```

### Using the Uri Class Directly

You can also use the `Uri` class directly to create instances:

```php
use Mantle\Support\Uri;

// Create a URI from a string
$uri = new Uri('https://example.com/path?query=value');

// Alternative static constructor
$uri = Uri::of('https://example.com/path?query=value');

// Get the current request URI
$current = Uri::current();
```

## Retrieving URI Components

Once you have a URI instance, you can access its individual components:

```php
$uri = uri('https://user:pass@example.com:8080/path/to/page?query=value#fragment');

$scheme = $uri->scheme();          // 'https'
$user = $uri->user();              // 'user'
$userWithPass = $uri->user(true);  // 'user:pass'
$password = $uri->password();      // 'pass'
$host = $uri->host();              // 'example.com'
$port = $uri->port();              // 8080
$path = $uri->path();              // '/path/to/page'
$segments = $uri->path_segments(); // Collection: ['path', 'to', 'page']
$query = $uri->query();            // Uri_Query_String instance
$queryParams = $uri->query()->all(); // ['query' => 'value']
$fragment = $uri->fragment();      // 'fragment'
```

:::tip
The `path()` method always returns a path with a leading slash, and empty paths are returned as a single `/`.
:::

## Modifying URIs

The `Uri` class provides a fluent interface for modifying components. Each modification method returns a new instance, so the original URI remains unchanged:

```php
use Mantle\Support\Uri;

$uri = uri('https://example.com/path');

// Change the scheme
$secureUri = $uri->with_scheme('https');

// Change the host
$newHost = $uri->with_host('mantle-framework.com');

// Change the path
$newPath = $uri->with_path('/new/path');

// Add a port
$withPort = $uri->with_port(8080);

// Add user credentials
$withAuth = $uri->with_user('username', 'password');

// Add a fragment
$withFragment = $uri->with_fragment('section-1');
```

### Working with Query Parameters

The `Uri` class provides several methods to work with query parameters:

```php
use function Mantle\Support\Helpers\uri;

$uri = uri('https://example.com/search?term=php');

// Add or merge query parameters
$withFilters = $uri->with_query(['category' => 'framework', 'sort' => 'desc']);
// https://example.com/search?term=php&category=framework&sort=desc

// Replace all query parameters
$newQuery = $uri->replace_query(['page' => 1, 'limit' => 20]);
// https://example.com/search?page=1&limit=20

// Add query parameters only if they don't exist
$withDefaults = $uri->with_query_if_missing(['term' => 'default', 'page' => 1]);
// https://example.com/search?term=php&page=1

// Remove specific query parameters
$withoutTerm = $uri->without_query('term');
// https://example.com/search

// Remove all query parameters
$withoutQuery = $uri->without_query();
// https://example.com/search

// Push a value onto a list parameter
$uri = uri('https://example.com/search?tags[]=php');
$withMoreTags = $uri->push_onto_query('tags', ['framework', 'web']);
// https://example.com/search?tags[]=php&tags[]=framework&tags[]=web
```

## Additional Features

### Creating Redirect Responses

The `Uri` class can generate redirect HTTP responses:

```php
use function Mantle\Support\Helpers\uri;

// Create a redirect response with default 302 status
$response = uri('https://example.com/destination')->redirect();

// Create a redirect with a specific status code and headers
$response = uri('https://example.com/destination')->redirect(
	301,
	['X-Redirect-Source' => 'application']
);
```

### Converting to String

URIs can be converted to strings in several ways:

```php
use function Mantle\Support\Helpers\uri;

$uri = uri('https://example.com/path?query=value#fragment');

// Using the value() method
$string = $uri->value();

// Using the __toString() method
$string = (string) $uri;

// Decode the URI components
$decoded = $uri->decode();
```

### Debugging

The `Uri` class provides a `dump()` method for debugging:

```php
// Dump the URI string and continue
$uri->dump();
```

### Conditional Methods

The `Uri` class includes the `Conditionable` trait, which allows for conditional modifications:

```php
use function Mantle\Support\Helpers\uri;

$uri = uri('https://example.com/path');

$result = $uri->when($condition, function ($uri) {
	return $uri->with_path('/conditional/path');
}, function ($uri) {
	return $uri->with_path('/default/path');
});
```

## Practical Examples

### Building an API URL

```php
$apiUrl = uri('https://api.example.com')
	->with_path('/v1/products')
	->with_query([
		'category' => 'electronics',
		'limit' => 20,
		'page' => 1,
		'sort' => 'price',
		'order' => 'asc',
	]);

// Make an API request using the built URL
$response = http()->get($apiUrl);
```

### Generating Pagination URLs

```php
$baseUrl = uri()->without_query('page');

$pagination = [
	'current' => $current_page,
	'next' => $baseUrl->with_query(['page' => $current_page + 1])->value(),
	'prev' => $current_page > 1
		? $baseUrl->with_query(['page' => $current_page - 1])->value()
		: null,
];
```

### Preserving Selected Filters

```php
$current = uri();
$availableFilters = ['category', 'price', 'color', 'size'];

// Keep existing filters and update only the ones that changed
$updatedUri = $current->with_query([
	'category' => $new_category,
	'page' => 1, // Reset to page 1 when filters change
]);
```
```php
use function Mantle\Support\Helpers\uri;

$apiUrl = uri('https://api.example.com')
	->with_path('/v1/products')
	->with_query([
		'category' => 'electronics',
		'limit' => 20,
		'page' => 1,
		'sort' => 'price',
		'order' => 'asc',
	]);

// Make an API request using the built URL
$response = http()->get($apiUrl);
```

### Generating Pagination URLs

```php
use function Mantle\Support\Helpers\uri;

$baseUrl = uri()->without_query('page');

$pagination = [
	'current' => $current_page,
	'next' => $baseUrl->with_query(['page' => $current_page + 1])->value(),
	'prev' => $current_page > 1
		? $baseUrl->with_query(['page' => $current_page - 1])->value()
		: null,
];
```

### Preserving Selected Filters

```php
use function Mantle\Support\Helpers\uri;

$current = uri();
$availableFilters = ['category', 'price', 'color', 'size'];

// Keep existing filters and update only the ones that changed
$updatedUri = $current->with_query([
	'category' => $new_category,
	'page' => 1, // Reset to page 1 when filters change
]);
```

## The uri() Helper Function

Mantle provides a convenient `uri()` helper function to quickly create `Uri` instances:

```php
/**
 * Create a new Uri object from the given URI string.
 * If no URI is provided, it will capture the current request URI.
 *
 * @param string|null $uri The URI to create the Uri object from. Defaults to the current request URI.
 */
function uri( ?string $uri = null ): Uri {
	return $uri ? Uri::of( $uri ) : Uri::current();
}
```

This helper function simplifies the process of creating URI instances and makes your code more readable.