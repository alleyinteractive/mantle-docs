# Singleton

A singleton is a class that can only be instantiated once. It is often used to
manage global state in a program. This can be useful for allowing a single global
instance of a class to be shared across the entire program.

:::note

If you are working with the Mantle Framework you should use the
[Container's `singleton` method](../../architecture/index.md) to create a
singleton instance of a class.
:::

## Usage

To create a singleton class, you can use the following pattern:

```php
namespace App;

use Mantle\Support\Traits\Singleton;

class Example_Class {
  use Singleton;

  protected function __construct() {
    // Your constructor code here
  }
}
```

Then you can instantiate the class like this:

```php
$instance = Example_Class::instance();
```

The `instance` method will always return the same instance of the class.