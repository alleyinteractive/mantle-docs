# Testing Hooks

## Introduction

Mantle provides an interface for testing WordPress hooks in declarative and
assertive formats.

## Declaring Hook Usage

Inside your unit test you can declare the hook(s) you expect to fire and
optionally specifying the amount of times and their return values. This is done
via the `$this->expectApplied()` method.

Once declared, you can then run the subsequent function that will apply the
WordPress filter and Mantle will handle the assertions.

```php
$this->expectApplied( 'action_to_check' )
	->twice()
	->with( 'value_to_check', 'secondary_value_to_check' );
```

### Defining Count

Define how many times a hook was applied. You can specify the number of times
directly with `times()` or use `once()`, `twice()`, or `never()` instead.

```php
$this->expectApplied( 'action_to_check' )->once();
$this->expectApplied( 'action_to_check' )->twice();
$this->expectApplied( 'action_to_check' )->never();

// Perform the do_action() calls...
```

### Defining Arguments

Define the arguments that you expect to be passed to the filter. These would be
the arguments passed to `do_action()`/`apply_filters()`/etc. at the start of the
hook.

```php
$this->expectApplied( 'filter_to_check' )
	->once()
	->with( 'value_to_check' );

apply_filters( 'filter_to_check', 'value_to_check' );
```

### Defining Return Value

Define the expected return value for the filter. Return values can be specified
using `andReturn(mixed $value)` or with some helper functions.

* `andReturn(mixed $value)`: Returns with the value of `$value`.
* `andReturnNull()`: Returns `null`.
* `andReturnFalse()`: Returns `false.`
* `andReturnTrue()`: Returns `true`.

```php
$this->expectApplied( 'falsey_filter_to_check' )
	->once()
	->andReturnFalse();

add_filter( 'falsey_filter_to_check', '__return_false' );
apply_filters( 'falsey_filter_to_check', true );
```

## Asserting Hook Usage

Hooks can be asserted against after they have already been applied. This can be
done using the `$this->assertHookApplied()` method and can be used
interchangeably with `expectApplied()`.

```php
// Assert that 'the_hook' was applied twice.
$this->assertHookApplied( 'the_hook', 2 );

// Assert that 'my_custom_hook' was not applied.
$this->assertHookNotApplied( 'my_custom_hook' );
```
