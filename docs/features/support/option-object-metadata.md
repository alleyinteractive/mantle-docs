# Option / Object Metadata

When working with WordPress, you may need to retrieve and manipulate options or
object meta data. Out of the box, the data will come back as `mixed`. You can
and should check the type of the data before using it. This can be cumbersome
and error-prone.

Mantle includes a `option` helper function that can be used to retrieve an
option's value in a type-safe manner. It can also update the option's value and
manipulate it in various ways. Mantle also includes `post_meta`, `term_meta`,
`user_meta`, and `comment_meta` helper functions that can be used to retrieve
and manipulate object meta data in a type-safe manner.

## Usage for Options

The `option` function can be used to retrieve an option's value and does not
require the rest of the framework to do so:

```php
use function Mantle\Support\Helpers\option;

// Set the value of an option.
update_option( 'option_name', 'option_value' );

// Get the value of an option as a string.
option( 'option_name' )->string();

// Get the value of an option as an integer.
option( 'option_name' )->integer();

// Get the value of an option as a boolean.
option( 'option_name' )->boolean();

// Get the value of an option as an array.
option( 'option_name' )->array();
```

## Usage for Object Metadata

The `post_meta`, `term_meta`, `user_meta`, and `comment_meta` functions can be
used to retrieve object meta data and do not require the rest of the framework
to do so:

```php
use function Mantle\Support\Helpers\post_meta;
use function Mantle\Support\Helpers\term_meta;
use function Mantle\Support\Helpers\user_meta;
use function Mantle\Support\Helpers\comment_meta;

// Retrieve post meta data.
post_meta( 1234, 'meta_key' )->string(); // string
post_meta( 1234, 'meta_key' )->boolean(); // bool
post_meta( 1234, 'meta_key' )->integer(); // int

// Retrieve term meta data.
term_meta( 1234, 'meta_key' )->string(); // string
term_meta( 1234, 'meta_key' )->boolean(); // bool
```

Meta data can also be updated and deleted:

```php
use function Mantle\Support\Helpers\post_meta;

// Update post meta data.
$meta = post_meta( 1234, 'meta_key' );

if ( $meta->is_empty() ) {
  $meta->set( 'meta_value' );
}

// Delete post meta data.
post_meta( 1234, 'meta_key' )->delete();
```

## Methods

The following methods are shared between the `option` helper and all the object
meta data helpers.

### `array()`

Get the value of the option as an array.

```php
use function Mantle\Support\Helpers\option;

$value = option( 'option_name' )->array(); // array
```

For more information about array methods and getting values from arrays, see the
[array section](#array-retrieval-and-manipulation).

### `boolean()`

Get the value of the option as a boolean.

```php
use function Mantle\Support\Helpers\option;

$value = option( 'option_name' )->boolean(); // bool
```

### `collect()` and `collection()`

Get the value of the option as a [collection](./collections.mdx).

```php
use function Mantle\Support\Helpers\option;

$value = option( 'option_name' )->collect(); // Mantle\Support\Collection
```

### `date()`

Get the value of the option as a Carbon date instance.

```php
use function Mantle\Support\Helpers\option;

$value = option( 'option_name' )->date(); // Carbon\Carbon
```

It also supports passing a format and/or timezone:

```php
use function Mantle\Support\Helpers\option;

$value = option( 'option_name' )->date( format: 'Y-m-d H:i:s', timezone: 'UTC' ); // Carbon\Carbon
```

### `dd()`

Dump the value of the option and end the script execution.

```php
use function Mantle\Support\Helpers\option;

option( 'option_name' )->dd();
```

### `dump()`

Dump the value of the option and continue script execution.

```php
use function Mantle\Support\Helpers\option;

option( 'option_name' )->dump();
```

### `float()`

Get the value of the option as a float.

```php
use function Mantle\Support\Helpers\option;

$value = option( 'option_name' )->float(); // float
```

### `int()` and `integer()`

Get the value of the option as an integer.

```php
use function Mantle\Support\Helpers\option;

$value = option( 'option_name' )->int(); // int

// or
$value = option( 'option_name' )->integer(); // int
```

### `is_empty()`

Check if the value of the option is empty.

```php
use function Mantle\Support\Helpers\option;

if ( option( 'option_name' )->is_empty() ) {
  // The option is empty.
}
```

## `is_not_null()`

Check if the value of the option is not `null`.

```php
use function Mantle\Support\Helpers\option;

if ( option( 'option_name' )->is_not_null() ) {
  // The option is not null.
}
```

## `is_type( string $type )`

Check if the value of the option is of a specific type.

```php
use function Mantle\Support\Helpers\option;

if ( option( 'option_name' )->is_type( 'string' ) ) {
  // The option is a string.
}
```

## `is_not_type()`

Check if the value of the option is not of a specific type.

```php
use function Mantle\Support\Helpers\option;

if ( option( 'option_name' )->is_not_type( 'string' ) ) {
  // The option is not a string.
}
```

## `is_array()`

Check if the value of the option is an array.

```php
use function Mantle\Support\Helpers\option;

if ( option( 'option_name' )->is_array() ) {
  // The option is an array.
}
```

## `is_not_array()`

Check if the value of the option is not an array.

```php
use function Mantle\Support\Helpers\option;

if ( option( 'option_name' )->is_not_array() ) {
  // The option is not an array.
}
```

## `is_object()`

Check if the value of the option is an object.

```php
use function Mantle\Support\Helpers\option;

if ( option( 'option_name' )->is_object() ) {
  // The option is an object.
}
```

## `is_not_object()`

Check if the value of the option is not an object.

```php
use function Mantle\Support\Helpers\option;

if ( option( 'option_name' )->is_not_object() ) {
  // The option is not an object.
}
```

### `object()`

Get the value of the option as an object.

```php
use function Mantle\Support\Helpers\option;

$value = option( 'option_name' )->object(); // object
```

### `string()`

Get the value of the option as a string.

```php
use function Mantle\Support\Helpers\option;

$value = option( 'option_name' )->string(); // string
```

### `stringable()`

Get the value of the option as a [Stringable](./stringable.md) object.

```php
use function Mantle\Support\Helpers\option;

$value = option( 'option_name' )->stringable(); // Mantle\Support\Stringable
```

### `throw()`

Throw an exception if the option is not able to be cast to the specified type.
For example, if you try to cast an array to a string, an exception will be
thrown.

```php
use function Mantle\Support\Helpers\option;

$value = option( 'option_name' )->throw()->string(); // string
```

### `throw_if()`

Throw an exception if the option is not able to be cast to the specified type
based on a condition.

```php
use function Mantle\Support\Helpers\option;

$value = option( 'option_name' )
  ->throw_if( 'production' !== wp_get_environment_type() )
  ->string(); // string
```

### `value()`

Get the value of the option. Will return with a type of `mixed`.

```php
use function Mantle\Support\Helpers\option;

$value = option( 'option_name' )->value(); // mixed
```

### Array Retrieval and Manipulation

The `array()` method can be used to retrieve an option's value as an array. You
can also use the following methods to get properties from the option's value
(which is assumed to be an array):

```php
use function Mantle\Support\Helpers\option;

update_option(
  'example_option',
  [
    'key' => 'value',
    'nested' => [
      'key' => 'value',
    ],
  ]
);

$value = option( 'example_option' )->array(); // array
$sub   = option( 'example_option' )->get( 'key' ); // string: value

// Supports dot notation.
$sub = option( 'example_option' )->get( 'nested.key' ); // string: value

// Check if a key exists.
$has = option( 'example_option' )->has( 'key' ); // bool: true
```

### Updating Option Value

The `option` helper can also be used to update an option's value:

```php
use function Mantle\Support\Helpers\option;

// Update the value of an option.
option( 'option_name' )->set( 'new_value' );
```

### Deleting Option

The `option` helper can also be used to delete an option:

```php
use function Mantle\Support\Helpers\option;

// Delete an option.
option( 'option_name' )->delete();
```