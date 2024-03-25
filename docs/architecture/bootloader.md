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
we're doing in `alleyinteractive/mantle`):

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