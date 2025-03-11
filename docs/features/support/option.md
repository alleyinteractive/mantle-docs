# Option

Mantle includes a `option` helper function that can be used to retrieve an
option's value in a type-safe manner. It can also update the option's value and
manipulate it in various ways.

## Usage

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

## Methods

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