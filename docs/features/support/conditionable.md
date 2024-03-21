# Conditionable

Conditionable is a trait that provides a way to conditionally call a closure
based on a condition.

### Usage

To use the `Conditionable` trait, you can use the following pattern:

```php
namespace App;

use Mantle\Support\Traits\Conditionable;

class Example_Class {
  use Conditionable;

  public function __construct(
    public int $number = 1,
  ) {}

  public function double(): static {
    $this->number *= 2;

    return $this;
  }

  // Your class code here.
}
```

Then you can conditionally call a closure like this:

```php
$instance = new Example_Class();

// If the number is greater than 10, call the closure and double the number.
$instance->when( $instance->number > 10, function() {
  $this->number *= 2;
});
```

The closure will only be called if the condition is true. You can also pass
a second closure to be called if the condition is false:

```php
$instance = new Example_Class();

// If the number is greater than 10, call the first closure and double the number.
// If the number is less than or equal to 10, call the second closure and triple the number.
$instance->when( $instance->number > 10, function() {
  $this->number *= 2;
}, function() {
  $this->number *= 3;
});
```