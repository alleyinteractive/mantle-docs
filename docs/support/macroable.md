# Macroable

Macros allow you to add methods to classes from outside the class. This is
useful when you want to add functionality to a class without modifying the
class itself.

Many classes within Mantle use this trait to allow for the addition of
functionality to the class from outside the class.

## Usage

To use the `Macroable` trait, you can use the following pattern:

```php
namespace App;

use Mantle\Support\Traits\Macroable;

class Example_Class {
  use Macroable;

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

Then you can register a macro like this:

```php
Example_Class::macro('thirty', function() {
  // Return an instance of your class with your specific customizations.
  return new Example_Class( 30 );
});
```

Then you can call the macro like this:

```php
$instance = Example_Class::thirty();
```

Macros can also be used to add functionality to already instantiated objects:

```php
$instance = new Example_Class();

$instance->macro('triple', function() {
  $this->number *= 3;

  return $this;
});
```

Then you can call the macro like this:

```php
$instance = new Example_Class();

// Double it with the class method.
$instance->double();

// Call the macro.
$instance->triple();

// The number should now be 6.
echo $instance->number; // 6
```