# Cache

Mantle provides a fluent API for various caching back-ends. Internally is uses
calls to [WordPress's object cache](https://developer.wordpress.org/reference/classes/wp_object_cache/).

## Cache Usage

The cache cache instance can be retrieved using the `Mantle\Facade\Cache`
facade, or by type-hinting the `Mantle\Contracts\Cache\Factory` contract for
your class' dependencies. The cache repository does implement PSR-16.

### Retrieving Data from the Cache

The `get` method can be used to retrieve data from the cache. It supports a
second argument to respond with a default value. Otherwise, it will return
`null` if the cache key doesn't exist.

```php
$value = Cache::get( 'key' );
$another = Cache::get( 'my-key', default: '123' );
```

You can also use `get_multiple` to retrieve multiple cache keys at once.

```php
$values = Cache::get_multiple( [ 'key1', 'key2' ] );
```

### Checking for Item Existence

The `has` method can be used to check for a cache key's existence.

```php
if ( Cache::has( 'key' ) ) {
	// ...
}
```

### Storing Data in the Cache

The `set` method can be used to store data in the cache. By default it will be
stored indefinitely unless `$seconds` is passed to specify the cache duration.

```php
Cache::set( 'key', 'value', $seconds );
```

You can also pass a `DateTimeInterface` object to specify the expiration time.

```php
Cache::set( 'key', 'value', now()->addMinutes( 10 ) );
Cache::set( 'key', 'value', new DateTime( '2022-01-01' ) );
```

The `set_multiple` method can be used to store multiple cache keys at once.

```php
Cache::set_multiple( [ 'key1' => 'value1', 'key2' => 'value2' ], $ttl );
```

The `remember` method can be used to store data in the cache and pass a closure
to set a default value if the cache item does not exist.

```php
Cache::remember( 'key', $seconds, function() {
	return 'the expensive function';
} );
```

The `remember_forever` method can be used to store data in the cache indefinitely.

```php
Cache::remember_forever( 'key', function() {
	return 'the expensive function';
} );
```

### Incrementing / Decrementing Values

The increment and decrement methods may be used to adjust the value of integer
items in the cache. Both of these methods accept an optional second argument
indicating the amount by which to increment or decrement the item's value:

```php
Cache::increment( 'key' );
Cache::increment( 'key', $amount );
Cache::decrement( 'key' );
Cache::decrement( 'key', $amount );
```

:::tip
The data should already be stored as an integer in the cache.
:::

### Deleting Items from the Cache

The `delete` method can be used to remove an item from the cache:

```php
Cache::delete( 'key' );
```

The `delete_multiple` method can be used to remove multiple items from the cache:

```php
Cache::delete_multiple( [ 'key1', 'key2' ] );
```

### Helpers

The cache API includes a `cache()` helper which can be used to store and
retrieve data via the cache. When the `cache` function is called with a single
string argument it will return the value of the given cache key.

```php
$value = cache( 'key-to-get' );
```

If you provide an array of key / value pairs and an expiration time to the
function, it will store values in the cache for the specified duration:

```php
cache( [ 'key' => 'value' ], $seconds );
```

When the cache function is called without any arguments, it returns an instance
of the `Mantle\Contracts\Cache\Factory` implementation, allowing you to call
other caching methods:

```php
cache()->remember( 'posts', $seconds, function() {
	return Posts::popular()->get();
} );
```

## Stale While Revalidate (SWR)

Commonly used in React, Stale While Revalidate (SWR) is a caching strategy that
allows you to show stale data while fetching new data in the background. This
can be useful for improving the perceived performance of your application. The
application will use stale data for a short period of time while fetching new
data in the background. The user does not have to wait for the new data to be
fetched before seeing the page.

Using SWR with Mantle, you can use the `flexible` or `swr` methods to retrieve
data from the cache and reuse it for a period of stale time before it is updated
in the background. The cache will return the stale data and then update the
cache with the new data after the response is sent to the user.

```php
// The cache will return the stale data for 1 hour before
// updating the cache. The stale data will be used for
// 1 day before it is removed from the cache.
$data = Cache::flexible(
	key: 'cache-key',
	stale: now()->addHour(),
	expire: now()->addDay(),
	callback: function() {
		return 'the expensive function';
	},
);
```

## Cache Tags

Cache providers can support adding tags to a cache key to allow for simpler
cache keys.

```php
Cache::tags( [ 'users' ] )->get( $user_id );
Cache::tags( 'posts' )->get( $post_id );
```

The tags method will return a cache factory allowing you the ability to store
child cache keys in the same interface as the cache API.

```php
Cache::tags( [ 'users' ] )->put( 'hello', $world, $seconds );
Cache::tags( [ 'users' ] )->remember( 'name', $seconds, function() {
	return 'smith';
} );
```

Cache tags can use any normal cache method, such as `get`, `put`, `remember`,
`delete`, `increment`, `decrement`, and `flexible`.

```php
Cache::tags( [ 'users' ] )->delete( 'hello' );

Cache::tags( 'example' )->flexible(
	key: 'cache-key',
	stale: now()->addHour(),
	expire: now()->addDay(),
	callback: fn () => wp_remote_get( 'https://example.com' ),
);
```