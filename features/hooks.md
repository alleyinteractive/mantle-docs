# WordPress Hooks

[[toc]]

WordPress' hooks are the most flexible way of integrating with WordPress. Mantle
aims to make these a bit more flexible for the 21st century.

## Using Hooks with Type Declarations

WordPress' actions/filters are extended to allow for safe use of type/return
declarations with a fatal error. Mantle providers a wrapper on-top of `add_action()`
and `add_filter()`.


### Problem With Type Declarations in Core

Here's an example of a hook with a type-hint that will throw a fatal error (and
bring down your whole site):


```php
use WP_Post;

add_filter(
  'my_custom_filter',
  function ( array $posts ): array {
    return array_map( fn ( WP_Post $post ) => $post->ID, $posts );
  },
);

// Else where in your application a plugin adds this filter at a slightly higher priority:
add_filter(
  'my_custom_filter',
  function ( array $posts ): array {
    if ( another_function() {
      return null;
    }

    return $posts;
  },
  8,
);

// Run the filter and get a fatal error.
$posts = apply_filters( 'my_custom_filter', $posts );
```

The above example throws a fatal error because the type declaration `array` is
defined on your first callback. The second callback can return `null` which is
not an array. Once WordPress reaches the first callback you'll be met with a
fatal error that `$posts` is not an array.

## Wrapper on Core Actions/Filters

To alleviate the above problem from happening, Mantle provides a wrapper on the
callback function for actions/filters. The wrapper will ensure that the
type-hint on the callback matches what is being passed to it. In the above
example, Mantle would have caught that `$posts` is not an array and would have
converted it to an array before invoking the type-hinted callback.

Here's an example of a safe type-hinted callback:

```php
use WP_Query;
use function Mantle\Framework\Helpers\add_action;

add_action(
	'pre_get_posts',
	function( WP_Query $query ) {
		// $query will always be an instance of WP_Query.
	}
);
```

```php
use Mantle\Support\Collection;
use function Mantle\Framework\Helpers\add_filter;

add_filter(
	'the_posts',
	function( array $posts ) {
		// $posts will always be an array.
	}
);

// Also supports translating between a Arrayable and an array.
add_filter(
	'the_posts',
	function( Collection $posts ) {
		// $posts will always be a Collection.
		return $posts->to_array();
	}
);

apply_filters( 'the_filter_to_apply', [ 1, 2, 3 ] );
```

Mantle's wrapper on top of actions/filters can be accessed by using these helper
methods:

* `Mantle\Framework\Helpers\add_action()`
* `Mantle\Framework\Helpers\add_filter()`

### Handling Type Declaration being translated

<!-- to come -->

## Find a Hook's Usage in the Codebase

Quickly calculate the usage of a specific WordPress hook throughout your code
base. Mantle will read all specified files in a specific path to find all uses
of a specific action/filter along with their respective line number.

On initial scan of the file system, the results can be a bit slow to build a
cache of all files on the site. By default Mantle will ignore all `test` and
`vendor/` files. The default search path is the `wp-content/` folder of your
installation.

	wp mantle hook-usage <hook> [--search-path] [--format]