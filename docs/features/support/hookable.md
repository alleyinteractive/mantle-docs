# Hookable

Hookable is a trait that will automatically register methods on your class with
WordPress action/filter hooks. This allows you to define your hooks in a more
fluent way keeping the action/filter registration close to the method that
implements the hook. Underneath it calls the core `add_action`/`add_filter`
methods.

## Usage With Method Names

To use the `Hookable` trait, you can use the following pattern:

```php
namespace App;

use Mantle\Support\Traits\Hookable;

/**
 * Example Class
 */
class Example_Class {
  use Hookable;

  public function __construct() {
    $this->register_hooks();

    // Your constructor code here.
  }

  // This method is called on the 'example_action' action at 10 priority.
  public function action__example_action( $args ) {
    // Your action code here.
  }

  // This method is called on the 'example_filter' filter at 10 priority.
  public function filter__example_filter( $args ) {
    // Your filter code here.
  }

  // This method is called on 'pre_get_posts' action at 20 priority.
  public function action__pre_get_posts_at_20( $query ) {
    // Your action code here.
  }

  // This method is called on 'template_redirect` filter at 20 priority.
  public function filter__template_redirect_at_20( $template ) {
    // Your filter code here.
  }
}
```

Out of the box, the `Hookable` trait will implement a constructor that will
automatically call the `register_hooks` method. You can override this with your
own constructor if you need to and call `register_hooks` manually.

## Usage With Attributes

You can also use attributes to define the hook name and priority:

```php
namespace App;

use Mantle\Support\Attributes\Action;
use Mantle\Support\Attributes\Filter;
use Mantle\Support\Traits\Hookable;

/**
 * Example Class
 */
class Example_Class {
  use Hookable;

  #[Action( 'example_action', 10 )]
  public function example_action( $args ) {
    // Your action code here.
  }

  #[Filter( 'example_filter', 10 )]
  public function example_filter( $args ) {
    // Your filter code here.
  }

  #[Action( 'pre_get_posts', 20 )]
  public function pre_get_posts_at_20( $query ) {
    // Your action code here.
  }

  #[Filter( 'template_redirect', 20 )]
  public function template_redirect_at_20( $template ) {
    // Your filter code here.
  }
}
```

When using attribute actions/filters, the method name does not matter. You can
name your methods whatever you like.

## Using Your Own Constructor

Hookable will automatically implement the class' constructor for you. If you
need to implement your own constructor, you can call `register_hooks` manually
in your own constructor:

```php
namespace App;

use Mantle\Support\Attributes\Action;
use Mantle\Support\Attributes\Filter;
use Mantle\Support\Traits\Hookable;

/**
 * Example Class
 */
class Example_Class {
  use Hookable;

  public function __construct() {
    $this->register_hooks();

    // Your constructor code here.
  }

  #[Action( 'example_action', 10 )]
  public function example_action( $args ) {
    // Your action code here.
  }

  #[Filter( 'example_filter', 10 )]
  public function example_filter( $args ) {
    // Your filter code here.
  }

  #[Action( 'pre_get_posts', 20 )]
  public function pre_get_posts_at_20( $query ) {
    // Your action code here.
  }

  #[Filter( 'template_redirect', 20 )]
  public function template_redirect_at_20( $template ) {
    // Your filter code here.
  }
}
```