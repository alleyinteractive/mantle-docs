# Support Helpers

## Array

### `data_get`

The `data_get` helper retrieves a value from an array or object using "dot"
notation. If the specified key does not exist, it will return `null` or a
default value if provided.

```php
use function Mantle\Support\Helpers\data_get;

$data = [
	'user' => [
		'name' => 'John Doe',
		'email' => 'example@example.com'
	]
];

$email = data_get( $data, 'user.email' ); // returns 'example@example.com
```

### `data_set`

The `data_set` helper sets a value in an array or object using "dot" notation.
If the specified key does not exist, it will be created.

```php
use function Mantle\Support\Helpers\data_set;

$data = [
	'user' => [
		'name' => 'John Doe',
	],
];

data_set( $data, 'user.email', 'example@example.com' );
```

### `data_fill`

The `data_fill` helper is used to set a value in an array or object using "dot"
notation. If the specified key does not exist, it not be created.

```php
use function Mantle\Support\Helpers\data_fill;

$data = [
	'user' => [
		'name' => 'John Doe',
	],
];

data_fill( $data, 'user.email', 'example@example.com' );
```

### `head`

The `head` helper retrieves the first element of an array. If the array is
empty, it will return `null`.

```php
use function Mantle\Support\Helpers\head;

$array = [ 'apple', 'banana', 'cherry' ];

$first = head( $array ); // returns 'apple'
```

### `last`

The `last` helper retrieves the last element of an array. If the array is
empty, it will return `null`.

```php
use function Mantle\Support\Helpers\last;

$array = [ 'apple', 'banana', 'cherry' ];
$last = last( $array ); // returns 'cherry'
```

### `value`

The `value` helper retrieves the value of a variable or calls a callback if
the variable is a closure. This is useful for lazy evaluation.

```php
use function Mantle\Support\Helpers\value;

$value = value( 'Hello, World!' ); // returns 'Hello, World!'
$value = value( fn () => { return 'Hello, World!'; } ); // returns 'Hello, World!'
```

## Core Objects

### `get_comment_object`

Nullable wrapper for `get_comment()`.

```php
use function Mantle\Support\Helpers\get_comment_object;

$comment = get_comment_object( 1 ); // returns a comment object or null if not found
```

### `get_post_object`

Nullable wrapper for `get_post()`.

```php
use function Mantle\Support\Helpers\get_post_object;

$post = get_post_object( 1 ); // returns a post object or null if not found
```

### `get_site_object`

Nullable wrapper for `get_site()`.

```php
use function Mantle\Support\Helpers\get_site_object;

$site = get_site_object( 1 ); // returns a site object or null if not found
```

### `get_term_object`

Nullable wrapper for `get_term()`.

```php
use function Mantle\Support\Helpers\get_term_object;

$term = get_term_object( 1 ); // returns a term object or null if not found
```

### `get_term_object_by`

Nullable wrapper for `get_term_by()`.

```php
use function Mantle\Support\Helpers\get_term_object_by;

$term = get_term_object_by( 'slug', 'example-slug', 'category' ); // returns a term object or null if not found
```

### `get_user_object`

Nullable wrapper for `get_user()`.

```php
use function Mantle\Support\Helpers\get_user_object;

$user = get_user_object( 1 ); // returns a user object or null if not found
```

### `get_user_object_by`

Nullable wrapper for `get_user_by()`.

```php
use function Mantle\Support\Helpers\get_user_object_by;

$user = get_user_object_by( 'login', 'exampleuser' ); // returns a user object or null if not found
```

## Environment

### `is_hosted_env`

The `is_hosted_env` helper checks if the application is running in a hosted
environment. Checks if the site is a `production` environment.

```php
use function Mantle\Support\Helpers\is_hosted_env;

if ( is_hosted_env() ) {
	// The application is running in a hosted environment
}
```

### `is_local_env`

The `is_local_env` helper checks if the application is running in a local
environment. Checks if the site is a `local` environment.

```php
use function Mantle\Support\Helpers\is_local_env;

if ( is_local_env() ) {
	// The application is running in a local environment
}
```

## General

### `backtickit`

The `backtickit` helper is a simple utility to wrap a string in backticks (`\``).

```php
use function Mantle\Support\Helpers\backtickit;

$wrapped = backtickit( 'example' ); // returns '`example`'
```

### `blank`

The `blank` helper checks if a value is "blank". A value is considered blank
if it is `null`, an empty string, or an empty array.

```php
use function Mantle\Support\Helpers\blank;

blank( null ); // returns true
blank( '' ); // returns true
blank( [] ); // returns true
blank( 'example' ); // returns false
```

### `class_basename`

The `class_basename` helper retrieves the class name of a given object or
class name without the namespace.

```php
use function Mantle\Support\Helpers\class_basename;

class_basename( \Mantle\Support\Helpers\ExampleClass::class ); // returns 'ExampleClass'
```

### `class_uses_recursive`

The `class_uses_recursive` helper returns all traits used by a class, its parent
classes and trait of their traits.

```php
use function Mantle\Support\Helpers\class_uses_recursive;

class_uses_recursive( \Mantle\Support\Helpers\ExampleClass::class ); // returns an array of trait names
```

### `classname`

See [Classname](./classname.md);

### `collect`

Returns a [Collection](./collections.mdx) instance containing the given value.

```php
use function Mantle\Support\Helpers\collect;

$collection = collect( [ 1, 2, 3 ] ); // returns a Collection instance
```

### `defer`

The `defer()` helper function can be used to defer the execution of a function
until the end of the request lifecycle. This can be useful for deferring
functions that should be executed after the response has been sent to the user.

```php
use function Mantle\Support\Helpers\defer;

defer( function() {
  // Your deferred function code here.
} );
```

### `filled`

The `filled` helper checks if a value is "filled". A value is considered
filled if it is not `null`, an empty string, or an empty array.

```php
use function Mantle\Support\Helpers\filled;

filled( null ); // returns false
filled( '' ); // returns false
filled( [] ); // returns false
filled( 'example' ); // returns true
```

### `get_callable_fqn`

The `get_callable_fqn` helper retrieves the fully qualified name of a callable
or a closure. This is useful for debugging or logging purposes.

### `html_string`

Returns a [HTML instance](./html.mdx) containing the given value.

```php
use function Mantle\Support\Helpers\html_string;

$html = html_string( '<div id="test">Hello World</div>' );
```

### `object_get`

The `object_get` helper retrieves a value from an object using "dot" notation.
If the specified key does not exist, it will return `null` or a default value if
provided.

```php
use function Mantle\Support\Helpers\object_get;

$object = (object) [
  'user' => (object) [
	  'name' => 'John Doe',
  ]
];

$name = object_get( $object, 'user.name' ); // returns 'John Doe'
```

### `retry`

The `retry` helper attempts to execute a given callback a specified number of
times until it succeeds or the maximum number of attempts is reached. If the
callback fails, it will wait for a specified delay before retrying.

```php
use function Mantle\Support\Helpers\retry;

retry(
  times: 5
  callback: function() {
    // Your code that may fail
  },
  sleep: 100 // milliseconds
```

### `stringable`

Returns an instance of `Mantle\Support\Str` which contains all the Laravel
string helper methods you might be familiar with. You can reference those
[here](https://laravel.com/docs/11.x/helpers#strings).

```php
use function Mantle\Support\Helpers\stringable;

stringable( 'example string' )->title(); // Example String
```

### `tap`

The `tap` helper allows you to pass a value to a callback and then return the
original value. This is useful for performing side effects on a value without
modifying it.

```php
use function Mantle\Support\Helpers\tap;

$value = tap(
  new Example(),
  function ( Example $example ) {
    $example->doSomething();
  },
);
```

### `throw_if`

The `throw_if` helper throws an exception if the given condition passes. This
is useful for validating conditions before executing code.

```php
use function Mantle\Support\Helpers\throw_if;

throw_if( $value_to_check, \Exception::class, 'Invalid value!' );
```

### `throw_unless`

The `throw_unless` helper throws an exception if the given condition fails.
This is useful for validating conditions before executing code.

```php
use function Mantle\Support\Helpers\throw_unless;

throw_unless( $value_to_check, \Exception::class, 'Invalid value!' );
```

### `trait_uses_recursive`

The `trait_uses_recursive` helper returns all traits used by a trait and its traits.

```php
use function Mantle\Support\Helpers\trait_uses_recursive;

trait_uses_recursive( \Mantle\Support\Helpers\ExampleTrait::class ); // returns an array of trait names
```

### `with`

The `with` helper returns the given value, optionally passed through the given callback.

```php
use function Mantle\Support\Helpers\with;

$value = with( 'example', function( $value ) {
    return strtoupper( $value );
} ); // returns 'EXAMPLE'
```

## Testing

### `capture`

The `capture()` helper is a simple wrapper around `ob_start()` and `ob_get_clean()`. It captures the output of a callable and returns it as a string. This can be useful when you want to test the output of a function or method that echoes content. Example:

```php
use function Mantle\Support\Helpers\capture;

$output = capture( fn () => the_title() );
```

### `block_factory`

The `block_factory()` helper creates a new instance of a block factory. This can be useful for testing or creating blocks dynamically.

For more information see [the documentation](../../testing/factory.md#generating-content).

```php
use function Mantle\Testing\block_factory;

$block = block_factory()->block(
  name: 'example/block-name',
  attributes: [ 'example' => 'value' ],
);

$heading   = block_factory()->heading( 'Example Heading' );
$paragraph = block_factory()->paragraph( 'Example Paragraph' );
```