# Bootloader

The Mantle Bootloader class is responsible for instantiating the
application/container and load the framework given the current context. It
removes the need for boilerplate code to be included in projects but still
allows for the flexibility to do so if they so choose. This works well to
support running Mantle as apart of a `alleyinteractive/mantle`-based plugin OR
in isolation in a larger codebase.

The core of the bootloader is this:

```php
bootloader()->boot();
```

Running that line of code will instantiate the application and loading the
framework given the current content.

You can also use the bootloader with your own custom application instance (like
[we're doing in `alleyinteractive/mantle`](https://github.com/alleyinteractive/mantle/blob/main/bootstrap/app.php)):

```php
use Mantle\Application\Application;

$application = new Application();

// Perform some bindings, override some contracts, etc.

// Boot the application with your custom instance and custom bindings.
bootloader( $application )->boot();
```

Mantle is flexible enough to require no application bindings or allow you to
override all of them. It's up to you.

The bootloader will attempt to boot the relevant application kernel given the
current context. The kernel will then boot and setup the application.

## Supported Contexts

### Web

The web context will boot the HTTP application kernel
(`Mantle\Framework\Http\Kernel`) which can be overridden by an application
binding. The HTTP kernel will send the current request through [Mantle
Routing](/docs/basics/requests) on the `parse_request` WordPress action.

### Console

Using the `bin/mantle` console application included with Mantle OR running a
command via WP-CLI will boot the console kernel (`Mantle\Framework\Console`)
which can also be overridden by an application binding.

If we're running in WP-CLI mode, the application will register a `wp mantle`
command that will proxy the request to the console application. If we're running
the `bin/mantle` console application, the application will handle the request
fully and then terminate.

## Providing Configuration

Configuration can be provided in a number of ways. Mantle has a set of defaults
that be overridden by configuration passed directly to the bootloader or by
placing configuration files in the `config` directory [see
example](https://github.com/alleyinteractive/mantle/tree/main/config).

```php
bootloader()
  ->with_config( [
    'app' => [
      'namespace' => 'Custom\\Namespace',
    ],
  ] )
  ->boot();
```

In the above example, we're overriding the default application namespace with
`Custom\\Namespace`. All other configuration within 'app' will be merged with
the [framework's default
configuration](https://github.com/alleyinteractive/mantle-framework/blob/1.x/config/app.php).

## Registering Custom Service Providers

You can pass a custom service provider to the bootloader's configuration that
will be merged and loaded with the default service providers.

```php
bootloader()
  ->with_providers( [
      Custom\ServiceProvider::class,
  ] )
  ->boot();
```

## Providing Kernels

You can also provide your own application kernel to the bootloader. This is
useful if you want to override the default kernel or provide your own
functionality. This is optional and Mantle will use the default kernel if none
is provided.

```php
bootloader()
  ->with_kernel(
    console: Custom\Console\Kernel::class,
    http: Custom\Http\Kernel::class,
  )
  ->boot();
```

The console kernel must implement `Mantle\Contracts\Console\Kernel` and the HTTP kernel
must implement `Mantle\Contracts\Http\Kernel`.

## Registering Routes

Routes can be loaded and registered via the bootloader. Mantle supports a number
of different ways to register routes with the most common being passing a file
path to the bootloader to load routes from.

```php
bootloader()
  ->with_routes(
      web: __DIR__ . '/../routes/web.php',
		  rest_api: __DIR__ . '/../routes/rest-api.php',
  )
  ->boot();
```

Mantle also supports passing a closure to the bootloader to register routes
dynamically:

```php
use Mantle\Contracts\Http\Routing\Router;

bootloader()
  ->with_routes( function ( Router $router ): void {
    $router->get( '/example', function () {
      return 'Hello, World!';
    } );
  } )
  ->boot();
```

## Registering Custom Bindings

Custom container bindings can be registered via the bootloader. This is useful
for overriding default Mantle bindings or providing your own functionality.

```php
bootloader()
  ->bind( 'example', function () {
    return new Example();
  } )
  ->boot();
```