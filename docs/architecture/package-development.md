---
title: Package Development
description: Build reusable Composer packages that integrate with a Mantle application.
---

# Package Development

## Introduction

Packages are the primary way of adding reusable functionality to a Mantle
application. A package is a Composer package that includes one or more [service
providers](./service-provider.md) that register its routes, views, and other
services with the application.

## Package Discovery

Mantle will automatically register the service providers of any package
installed via Composer that declares them in the `extra.mantle` section of its
`composer.json` file:

```json
{
	"extra": {
		"mantle": {
			"providers": [
				"Vendor\\Package\\Package_Service_Provider"
			]
		}
	}
}
```

The list of discovered packages is cached. It can be rebuilt by running the
`package:discover` command, which is run automatically by Composer after the
application's dependencies are installed or updated:

```bash
bin/mantle package:discover
```

### Opting Out of Package Discovery

An application can disable discovery for a package by listing the package's name
in the `extra.mantle.dont-discover` section of the application's
`composer.json` file:

```json
{
	"extra": {
		"mantle": {
			"dont-discover": [
				"vendor/package"
			]
		}
	}
}
```

## Service Providers

A package's service provider is the connection point between the package and
the application. It is responsible for binding services into the [service
container](./index.md#service-container) and registering the package's routes,
views, and assets. See [Service Providers](./service-provider.md) for more
information about writing a service provider.

### Routes

To register a package's routes, call the `load_routes_from()` method from the
service provider's `boot()` method:

```php
namespace Vendor\Package;

use Mantle\Support\Service_Provider;

class Package_Service_Provider extends Service_Provider {
	public function boot(): void {
		$this->load_routes_from( __DIR__ . '/../routes/web.php' );
	}
}
```

### Views

To register a package's views, call the `load_views_from()` method with the path
to the views and an alias for the package. Views can then be referenced by
prefixing the view's name with `@` and the alias:

```php
public function boot(): void {
	$this->load_views_from( __DIR__ . '/../resources/views', 'package' );
}
```

```php
return view( '@package/dashboard' );
```

## Publishing Assets

Packages may need to publish files such as configuration, views, or assets into
the application. Register the files to publish with the `publishes()` method
from the service provider's `boot()` method. The method accepts an array of
source paths mapped to their destination in the application and an optional tag
(or array of tags) to group the files by:

```php
public function boot(): void {
	$this->publishes(
		[
			__DIR__ . '/../config/package.php' => base_path( 'config/package.php' ),
		],
		'package-config',
	);

	$this->publishes(
		[
			__DIR__ . '/../resources/views' => base_path( 'views/vendor/package' ),
		],
		'package-views',
	);
}
```

Users of the package can then publish the files with the `vendor:publish`
command. Files are only overwritten when the `--force` option is passed.

```bash
# List all the tags that can be published.
wp mantle vendor:publish --list

# Publish the files for one or more tags.
wp mantle vendor:publish --tags=package-config

# Publish all the files from a specific service provider.
wp mantle vendor:publish --providers="Vendor\Package\Package_Service_Provider"

# Publish everything.
wp mantle vendor:publish --all
```

:::note
The `vendor:publish` command is not available when running `bin/mantle` outside
of WordPress. Run it through `wp mantle` instead.
:::
