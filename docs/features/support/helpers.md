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

### `defer`

### `filled`

### `get_callable_fqn`

### `html_string`

### `object_get`

### `preg_replace_array`

### `retry`

### `stringable`

### `tap`

### `throw_if`

### `throw_unless`

### `trait_uses_recursive`

### `transform`

### `validate_file`

### `with`
