# Assets and Blocks

Mantle provides a fluent wrapper on-top of WordPress' enqueue system. It relies
on the [wp-asset-manager](https://github.com/alleyinteractive/wp-asset-manager)
package to provide a number of flexible methods for asset registration.

Mantle includes a `Asset_Service_Provider` class for managing asset and block
registration. Assets can be registered in any of your service providers, too.
You can use the `Asset` facade or the `asset()` helper method to quickly access
the API.

:::info

Mantle's front-end asset and block system aims to be as flexible as possible and inline
with Alley's [create-wordpress-plugin](https://github.com/alleyinteractive/create-wordpress-plugin) project.
:::

## Installation

A fresh installation of Mantle will include a `package.json` and depends on
**Node 16**. You can get started by running:

```bash
npm install
```

Mantle is configured to have a development mode and a build mode to make it easy
to develop and build your application.

```bash
# Development mode
npm run dev

# Build mode
npm run build
```

## Configuration

Mantle's build system is powered by Webpack and configured via the
`webpack.config.js` file. Out of the box, you will be able to build standalone
entries as well as WordPress blocks using either JavaScript or TypeScript.

## Standalone Entries

Mantle is configured to read entries from the `entries` directory. You can
create a new entry by creating a new folder in the `entries` directory and
adding an `index.js`/`index.ts` file. For example, if you wanted to create an
entry for your application's homepage, you could create a `entries/home`
directory and add an `index.ts` file.

Once you have created an entry, you can register and enqueue it via
[Registering Assets](#registering-assets).

:::tip What is a webpack entry?

A webpack entry is a file that webpack will use to start building your
application. It is the entry point to your application. For example, you could
have an entry point for your application's homepage and another for articles.

:::

## WordPress Blocks

Mantle is designed to make it easy to build WordPress blocks and works with
Alley's standard practice of building and defining WordPress blocks. To get
started, you can use Alley's Create Block package to define a new block:

```bash
npx @alleyinteractive/create-block
```

Without providing any options the tool will prompt the user through several
options for creating a block.

Once the block is created, the block will be automatically registered and loaded
by Mantle via the `Asset_Service_Provider`'s `load_blocks` method.

## Registering Assets

Assets can be enqueued in a fluent-basis on top of the existing WordPress API
using the `asset()` helper method. Mantle will read the Webpack manifest and
automatically determine the URL for the asset.

To get us started, let's enqueue a script from our `entries` directory:

```php
asset()->script( '/example-entry/index.js' );
```

Mantle will take it from there and register the asset with WordPress as well as
all dependencies from `@wordpress/dependency-extraction-webpack-plugin`.

Scripts can also be made to load with `async` and/or `defer`:

```php
asset()
	->script( '/example-entry/index.js' )
	->async()
	->defer();
```

Styles can be enqueued in the same way:

```php
asset()->style( '/example-entry/index.css' );
```

### Registering Non-Webpack Assets

Mantle also provides a way to register non-Webpack assets that don't come from
the Webpack manifest. This is useful for registering assets from plugins or
other sources.

```php
asset()->script( 'example-handle', '/path/to/example.js' );

asset()->style( 'example-handle', '/path/to/example.css' );
```

The version and other dependencies of the asset can also be specified with the
`version()` and `dependencies()` method:

```php
asset()
	->script( 'example-handle', '/path/to/example.js' )
	->version( '1.0' )
	->dependencies( [ 'unicorn-js' ] );
```

### Asset Conditions

Mantle also provides a way to conditionally enqueue assets. By default, all
assets registered will be enqueued on all pages. However, you can specify
conditions for when the asset should be enqueued via Alley's `wp-asset-manager`
plugin (which Mantle depends on).

```php
asset()
	->script( 'example-handle', '/path/to/example.js' )
	->condition( 'home' );
```

For more information, checkout the [wp-asset-manager
documentation](https://github.com/alleyinteractive/wp-asset-manager/#conditions).
The `Asset_Service_Provider` included with Mantle has a
`on_am_asset_conditions`` method that can be used to register/manipulate
conditions.

```php
namespace App\Providers;

use Mantle\Assets\Asset_Service_Provider as Service_Provider;

class Asset_Service_Provider extends Service_Provider {
	// ...

	/**
	 * Filter the asset conditions for the site.
	 *
	 * @param array $conditions Conditions to filter.
	 * @return array
	 */
	public function on_am_asset_conditions( array $conditions ): array {
		$conditions['podcast-page'] = is_singular( 'podcast' ) || is_post_type_archive( 'podcast' );

		return $conditions;
	}
}
```

We can now use the `podcast-page` condition in our asset registration:

```php
asset()
	->script( 'example-handle', '/path/to/example.js' )
	->condition( 'podcast-page' );
```