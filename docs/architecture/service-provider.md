# Service Provider

Service providers act as the key method of extending the framework and
bootstrapping essential services. Core application functionality will be defined
and encapsulated entirely in a service provider. Your own application, as well
as all core Mantle services, are bootstrapped via Service Providers.

But, what do we mean by "bootstrapped"? In general, we mean registering things,
including registering service container bindings, event listeners, middleware,
and even routes. Service providers are the central place to configure your
application.

### What would be a service provider?

A good example of what should be a service provider would be a feature in your
application. For example, a network of sites have a feature to syndicated content
between sites. The feature could be wrapped into a single service provider which
would bootstrap and setup all required services. The service provider would be the
starting point for that feature.

### Registering a Service Provider

The application stores service providers in the `config/app.php` file includes
with Mantle. There is a `providers` array of classes in that file that include
all providers the application will initialize on each request.

```php
// Inside of config/app.php...
'providers' => [

	// Add provider here...
	App\Providers\App_Service_Provider::class,
],
```

:::tip Automatic Registration
Mantle will automatically register service providers via [Automatic Registration with WordPress Events](#automatic-registration-with-wordpress-events).
:::

## Writing a Service Provider

Service providers extend the `Mantle\Support\Service_Provider` class and
include a `register` and `boot` method. The `register` method is used to
register application services with the application container. The `boot` method
is used to boot provider, setup any classes, register any WordPress hooks, etc.
The `boot` method should always call the parent boot method via `parent::boot();`.

A service provider can be generated for you by running the following command:

```bash
./bin/mantle make:provider <name>
```

### Service Provider Structure

```php
namespace App;

use Mantle\Support\Service_Provider;

/**
 * Example_Provider Service Provider
 */
class Example_Provider extends Service_Provider {

	/**
	 * Register the service provider.
	 */
	public function register() {
		// Register the provider.
		$this->app->singleton(
			'binding-to-register',
			function( $app ) {
				return new Essential_Service( $app );
			}
		);
	}

	/**
	 * Boot the service provider.
	 */
	public function boot() {
		parent::boot();

		// Boot the provider.
	}
}
```

## Automatic Registration with WordPress Events

Service providers are the heart of your application. They can register services
and add event listeners that are fired when specific events/actions happen in
WordPress. Mantle supports automatic registration of event listeners using PHP
attributes:

```php
use Mantle\Support\Attributes\Action;

class Example_Provider extends Service_Provider {
	#[Action('wp_loaded')]
	public function handle_loaded_event() {
		// Called on wp_loaded at priority 10.
	}

	#[Action('admin_screen', 20)]
	public function handle_admin_screen_event() {
		// Called on admin_screen at priority 20.
	}
}
```

The service provider also supports magic methods via
[Hookable](../features/support/hookable.md) that automatically register provider
methods with WordPress actions and filters. The service provider will
automatically register hooks for the provider by checking for methods that use
the format of `on_{hook}` and `on_{action}_at_{priority}` as method names. Both
actions and filters are supported using the same method naming convention.

```php
use Mantle\Support\Attributes\Action;

class Example_Provider extends Service_Provider {
	#[Action('wp_loaded')]
	public function register_services(): void {
		// Register any services here on wp_loaded.
	}

	public function on_wp_loaded() {
		// Called on wp_loaded at priority 10.
	}

	public function on_admin_screen_at_99() {
		// Called on admin_screen at priority 99.
	}
}
```

See [Hookable](../features/support/hookable.md) for more information.

## Conditional Loading of a Service Provider

A service provider can be conditionally loaded using a [validator attribute](../features/types.md#validator-attribute)
on the service provider class. If the service provider uses a validator attribute,
the provider will only be loaded if the validator's `validate` method passes.

```php
namespace App;

use Mantle\Support\Service_Provider;
use Mantle\Types\Attributes\Environment;

/**
 * Example Provider that only loads in production environment.
 */
#[Environment('production')]
class Example_Provider extends Service_Provider {
	// Provider code...
}
```

For more information on creating custom validator attributes, see
[Validator Attribute](../features/types.md#validator-attribute).