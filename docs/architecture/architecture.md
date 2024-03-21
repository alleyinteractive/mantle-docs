# Architecture

## Service Container

The service container is a powerful tool for managing class dependencies and
performing dependency injection with ease. Most function calls are performed
through the service container and support dynamic dependency injection without
any need to configure it.

Here's an example of the container with no class resolution needed:

```php
use \Mantle\Http\Controller;

class Example_Service {

}

// Then you can instantiate the service from the container as a dependency.
class Example_Controller extends Controller {
	public function __construct( Example_Service $service ) {
		$this->service = $service;
	}
}
```

In the above example, the `Example_Service` class is automatically resolved
because it is type-hinted in the constructor of the `Example_Controller` class.
It has no dependencies, so it is automatically resolved and injected into the
controller.

Most classes in the framework are resolved through the service container and can
be type-hinted in the same manner. For example, we can type-hint the `Request`
class in a controller's constructor and the service container will automatically
resolve it.

```php
namespace App\Http\Controllers;

use \Mantle\Http\Controller;

class Example_Controller extends Controller {
	public function index( Request $request ) {
		// ...
	}
}
```

Most users will not need to interface with the container directly or register
anything with it. But it is available to you if you need it. For more
information about the service container and the underlying concept of Dependency
Injection, read this document on
[Understanding Dependency Injection](https://php-di.org/doc/understanding-di.html).

### Binding to the Container

#### Binding

#### Singleton

#### Interfaces

### Resolving from the Container

#### Using `make`

#### Automatic Resolution

## Facades

Facades are a static interface to the instances available from the service
container. Instead of determining the underlying class or resolving it through
the application, a facade will provide a single-line interface to call a
singleton object from the container.

```php
use Mantle\Facade\Config;

echo Config::get( 'app.attribute' );
```

In this example, the config facade is a wrapper for the `config` singleton instance of `Mantle\Config\Repository` in the application's service container.

## Aliases
Aliases provide a root namespace level way of interfacing with classes in the
framework. When combined with facades, they can provide a simple way of
interfacing with singleton objects deep in the framework.


```php
Log::info( 'My log message!' );

// Can be rewritten as...
app()['log']->info( 'My log message!' );
```
