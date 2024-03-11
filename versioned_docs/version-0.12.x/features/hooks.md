# Hooks and Events

WordPress' hooks are the most flexible way of integrating with WordPress. Mantle
aims to make these a bit more flexible for the 21st century. Mantle provides a
simple observer pattern implementation, allowing you to listen for various
events that occur within WordPress and Mantle.

Events can be your traditional WordPress hooks (`pre_get_posts`, `init`, etc.)
or event objects: standalone classes used to define a specific event. This
provides a great way to decouple various aspects of your application. One
example would be an 'order shipped' event. An event called
`App\Events\Order_Shipped` is instantiated and dispatched whenever an order is
shipped. Underneath, this utilizes the traditional WordPress hook system with an
action fired using the class' full name.

This flexible organization of WordPress events as well as [safety guards on top
of type-hints](#using-hooks-safely-with-type-hint-declarations) allows you to
have the most flexibility possible when managing events in your application.

## Registering Events & Listeners

The `App\Providers\Event_Service_Provider` included with Mantle provides a
convenient place to register all your application's event listeners. The
`listen` property contains an array of all events (keys) and their listeners
(values). Here's an example for an `Order_Shipped` event:

```php
use App\Events\Order_Shipped;
use App\Listeners\Send_Ship_Notification;
use App\Listeners\Modify_Orders_Page;

/**
 * The event listener mappings for the application.
 *
 * @var array
 */
protected $listen = [
	Order_Shipped::class => [
		Send_Ship_Notification::class,
	],
	'pre_get_posts' => [
		Modify_Orders_Page::class,
	],
];
```

### Generating Events and Listeners

Events can be manually written or generated for you:

```
wp mantle make:event
```

Listeners can also be automatically generated for you:

```
wp mantle make:listener <name> [<event>]
```

The `make:listener` command supports passing a specific event to automatically
listen for.

### Manually Registering Events

Event listeners can be registered via the `Event_Service_Provider` or by
individual service providers. They can also register listeners on a class or
closure basis:

```php
/**
 * Register any other events for your application.
 *
 * @return void
 */
public function boot() {
	Event::listen( 'init', function () {
		// ...
	});
}
```

### Event Discovery

Instead of registering events and listeners manually in the
`Event_Service_Provider` Mantle can automatically discover listeners in your
application. When discovery is enabled (it is by default), Mantle will
automatically find and discover event listeners by scanning your application's
`listeners` directory. Here's an example of a listener that will automatically
listen for an `Order_Shipped` event:

```php
use App\Events\Order_Shipped;

class Order_Listener {
	/**
	 * Handle the event.
	 *
	 * @param Order_Shipped $event
	 * @return void
	 */
	public function handle( Order_Shipped $event ) {
		//
	}
}
```

You can also listen for multiple events in the same listener and specify
priority using the `_at_%PRIORITY%` syntax:

```php
use App\Events\Order_Shipped;
use App\Events\Order_Received;
use App\Events\Order_Cancellation;

class Order_Listener {
	/**
	 * Handle the event.
	 *
	 * @param Order_Shipped $event
	 * @return void
	 */
	public function handle( Order_Shipped $event ) {
		//
	}

	/**
	 * Handle the event.
	 *
	 * @param Order_Received $event
	 * @return void
	 */
	public function handle_order_received( Order_Received $event ) {
		//
	}

	/**
	 * Handle the event at 20 priority.
	 *
	 * @param Order_Cancellation $event
	 * @return void
	 */
	public function handle_handle_cancellation_at_20( Order_Cancellation $event ) {
		//
	}
}
```

Listeners can also automatically listen for WordPress events using PHP
Attributes or naming the function after the action using the `on_{hook}`
function name:

```php
use Mantle\Support\Attributes\Action;
use WP_Query;

class Customer_Listener {
	/**
	 * Handle the callback to the 'attribute-based' action.
	 */
	#[Action('attribute-based')]
	public function handle_special_action_callback( $event ) {
		// ...
	}

	/**
	 * Handle the callback to the 'attribute-based' action at 20 priority.
	 */
	#[Action('attribute-based', 20)]
	public function handle_special_action_callback_20( $event ) {
		// ...
	}

	/**
	 * Handle the query.
	 *
	 * @param WP_Query $event
	 * @return void
	 */
	public function on_pre_get_posts( WP_Query $query ) {
		//
	}

	/**
	 * Handle the redirect.
	 *
	 * @param mixed redirect
	 * @return void
	 */
	public function on_parse_redirect_at_20( $redirect ) {
		//
	}
}
```

#### Caching Discovery

Event discovery is enabled by default and can be disabled via the
`should_discover_events()` method in `Event_Service_Provider`. For performance,
it is ideal to cache the events that are discovered since the Reflection service
is used. To cache the events, run the following command on deployment:

	wp mantle event:cache
## Using Hooks Safely with Type-hint Declarations

WordPress' actions/filters are extended by Mantle to allow for safe use of
type/return declarations with a fatal error. Mantle provides a wrapper on top
of `add_action()` and `add_filter()` (these can be used interchangeable with
`Event::listen( ... )`).

### Problem With Type Declarations in Core

Here's an example of a hook with a type-hint that will throw a fatal error (and
potentially bring down your whole site!):


```php
use WP_Post;

add_filter(
  'my_custom_filter',
  function ( array $posts ): array {
    return array_map( fn ( WP_Post $post ) => $post->ID, $posts );
  },
);

// Elsewhere in your application a plugin adds this filter at a slightly higher priority:
add_filter(
  'my_custom_filter',
  function ( array $posts ): array {
    if ( another_function() ) {
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
* `Mantle\Facade\Event::listen()`
* `Event::listen()`

### Handling Type Declaration Being Translated

By default, Mantle will attempt to translate type declarations without any need
for customization to prevent errors.

For example, an action is listened for that expects a `string` and has a  `int`
passed. Mantle will properly translate it to a `string`. Type declaring a
`Collection` will have an array automatically translate to a collection and so
on. For the edge cases where a method type declares an object and needs manual
intervention, Mantle will fire a filter that will allow the translation to be
properly handled:

```php
add_filter( 'mantle-typehint-resolve:Custom_Class', function ( $param ) {
	return new Custom_Class( $param );
} );
```

## Find a Hook's Usage in the Codebase

Quickly calculate the usage of a specific WordPress hook throughout your code
base. Mantle will read all specified files in a specific path to find all uses
of a specific action/filter along with their respective line number.

On initial scan of the file system, the results can be a bit slow to build a
cache of all files on the site. By default Mantle will ignore all `test` and
`vendor/` files. The default search path is the `wp-content/` folder of your
installation.

```
wp mantle hook-usage <hook> [--search-path] [--format]
```
