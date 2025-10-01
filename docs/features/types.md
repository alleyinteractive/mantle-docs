# Types

The types package is an extension to the
[`alleyinteractive/wp-type-extensions`](https://github.com/alleyinteractive/wp-type-extensions)
package.

The feature pattern is used by Mantle and throughout Alley projects to define
features on a project. It provides a consistent way to register and manage
features that promotes modularity and reusability.

Lets look at an example of a feature:

```php
use Alley\WP\Types\Feature;

class My_Custom_Type_Feature extends Feature {
  public function boot(): void {
    // Register custom types here.
  }
}
```

The `My_Custom_Type_Feature` class extends the `Feature` interface, which
requires the implementation of a `boot()` method. This method is called when
the feature is initialized.

Features can be booted in a group using the `Group` class:

```php
use Alley\WP\Features\Group;

$group = new Group(
  new My_Custom_Type_Feature(),
);

$group->boot();
```

For more information about the `wp-type-extensions` project, see
[the project's README](https://github.com/alleyinteractive/wp-type-extensions/blob/main/README.md).

## Hookable Feature

The `Hookable_Feature` class implements the `Feature` interface and uses the
[Hookable trait](./support/hookable.md) to provide a convenient way to register
WordPress hooks within a feature.

```php
use Mantle\Support\Attributes\Action;
use Mantle\Types\Hookable_Feature;

class Example_Feature extends Hookable_Feature {
  #[Action('init')]
  public function register_custom_type(): void {
    // Register custom types here.
  }
}
```

You can then use the feature normally within a feature group.

```php
use Alley\WP\Features\Group;

$group = new Group(
  new Example_Feature(),
);

$group->boot();
```

The Hookable trait will add the `register_custom_type` method as a callback
for the `init` action when the feature is booted.

## Validator Group

The `Validator_Group` class allows you boot features in a group with run-time
validation. For example, you can add all the possible features to be booted to a
validator group, and then only the features that pass validation will be booted.

Validation is done using attributes that implement the `Mantle\Types\Validator`
interface. Features that include the attribute will only be booted if the
attribute's `validate` method returns true. Features that do not include any
validator attributes will always be booted.

Let's look at an example custom validator attribute:

```php
use Alley\WP\Types\Feature;

#[\Attribute]
class Example_Validator implements \Mantle\Types\Validator {
  public function validate(): bool {
    return wp_rand(0, 1) === 1;
  }
}
```

You can then use the validator attribute on a feature:

```php
use Mantle\Support\Attributes\Action;
use Mantle\Types\Hookable_Feature;

#[Example_Validator]
class Example_Feature extends Hookable_Feature {
  #[Action('init')]
  public function register_custom_type(): void {
    // Register custom types here.
  }
}
```

To put it all together, the validator group will be used to selectively boot the
features:

```php
use Mantle\Types\Validator_Group;

$group = new Validator_Group(
  new Example_Feature(),
  new \Alley\WP\Features\Quick_Feature( function (): void {
    // This feature will always be booted because it has no validators.
  } ),
);

$group->boot();
```

The `Example_Feature` will only be booted if the `Example_Validator` returns
true.

### Available Validators

The following validator attributes are available:

#### `CLI`

The `Mantle\Types\Attributes\CLI` validator attribute will only allow the
feature to be booted if the current request is from the command line interface
(CLI).

```php
use Alley\WP\Types\Feature;
use Mantle\Types\Attributes\CLI;

#[CLI]
class CLI_Only_Feature extends Feature {
  public function boot(): void {
    // This feature will only be booted when running in the CLI.
  }
}
```

#### `Environment`

The `Mantle\Types\Attributes\Environment` validator attribute will only allow
the feature to be booted if the current environment matches one of the specified
environments.

One or more environment names can be passed to the attribute.

```php
use Alley\WP\Types\Feature;
use Mantle\Types\Attributes\Environment;

#[Environment('production', 'staging')]
class Production_Staging_Feature extends Feature {
  public function boot(): void {
    // This feature will only be booted in the 'production' or 'staging' environments.
  }
}