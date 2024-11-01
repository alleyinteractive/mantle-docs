---
slug: /architecture
---

# Architecture

## Introduction

Mantle is a modern PHP framework that is designed to be simple, flexible, and
extensible. It includes a powerful service container with dependency injection.

## Service Container

The service container is a powerful tool for managing class dependencies and
performing dependency injection with ease. Most function calls are performed
through the service container and support dynamic dependency injection without
any need to configure it.

Here's an example of the container with no class resolution needed:

```php
use Mantle\Http\Controller;

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

use Mantle\Http\Controller;

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

You can bind a class to the container by using the `bind` method. This will
allow you to resolve an instance of the class when it is being instantiated
through the container.

```php
$this->app->bind( Example_Service::class, function( $app ) {
	return new Example_Service();
});
```

Every time that `Example_Service` is resolved from the container, a new instance
of `Example_Service` will be created and resolved through the closure.

You may also use the `bind_if` method to only bind the class if it has not
already been bound.

```php
$this->app->bind_if( Example_Service::class, function( $app ) {
	return new Example_Service();
});
```

#### Singleton

You can also bind a singleton instance of a class to the container that will
return the same instance every time it is resolved.

```php
$this->app->singleton( Example_Service::class, function( $app ) {
	return new Example_Service();
});
```

You may also use the `singleton_if` method to only bind the singleton if it has
not already been bound.

```php
$this->app->singleton_if( Example_Service::class, function( $app ) {
	return new Example_Service();
});
```

#### Interfaces

You can bind an interface to a concrete class in the container. This will allow
you to resolve the interface and get an instance of the concrete class. A common
pattern for this is to declare a feature with an interface and then bind the
implementation of the interface in the container.

```php
$this->app->bind( Example_Interface::class, Example_Service::class );
```

You can then type-hint the interface in your classes and the container will
resolve the concrete class.

```php
class Example_Controller extends Controller {
	public function __construct( Example_Interface $service ) {
		$this->service = $service;
	}
}
```

### Resolving from the Container

#### Using `make`

You can resolve a class from the container by using the `make` method. This will
return an instance of the class with all of its dependencies resolved.

```php
$service = $this->app->make( Example_Service::class );
```

If the class has dependencies, they will be resolved and injected into the
instance. If the class has dependencies that are not resolvable via the container,
you can pass them as an array of parameters to the `make_with` method.

```php
$service = $this->app->make_with( Example_Service::class, [ 'param' => 'value' ] );
```

You can also use the `app` helper function to resolve a class from the container.

```php
app( Example_Service::class );
```

You can also use the `App` facade to resolve a class from the container.

```php
use Mantle\Facade\App;

App::make( Example_Service::class );
```

#### Automatic Resolution

When a class is type-hinted in a constructor, the container will automatically
resolve the class and its dependencies.

```php
class Example_Controller extends Controller {
	public function __construct( Example_Service $service ) {
		$this->service = $service;
	}
}
```

## Facades

Facades are a static interface to the instances available from the service
container. Instead of determining the underlying class or resolving it through
the application, a facade will provide a single-line interface to call a
singleton object from the container.

```php
use Mantle\Facade\Config;

echo Config::get( 'app.attribute' ); // Mantle\Contracts\Config\Repository
```

In this example, the config facade is a wrapper for the `config` singleton instance of `Mantle\Contracts\Config\Repository` instantiated from the service container.

## Aliases

Aliases provide a root namespace level way of interfacing with classes in the
framework. When combined with facades, they can provide a simple way of
interfacing with singleton objects deep in the framework.


```php
Log::info( 'My log message!' );

// Can be rewritten as...
app()['log']->info( 'My log message!' );
```
