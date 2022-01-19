# Assets

[[toc]]

Mantle provides a fluent wrapper on-top of WordPress' enqueue system. It relies
on the [wp-asset-manager](https://github.com/alleyinteractive/wp-asset-manager)
package to provide a number of flexible methods for asset registration.

Mantle includes a `Asset_Service_Provider` class for managing asset
registration. Assets can be registered in any of your service providers, too.
You can use the `Asset` facade or the `asset()` helper method to quickly access
the API:

## Registering Assets

Assets can be enqueued in a fluent-basis on top of the existing WordPress API:

```php
asset()->script( 'example-handle', mix( '/js/app.js' ) );
```

Assets can also be made to load with `async` and/or `defer`:

```php
asset()
	->script( 'example-handle', mix( '/js/app.js' ) )
	->async()
	->defer();
```

The location the asset appears can also be controlled:

```php
asset()
	->script( 'example-handle', mix( '/js/app.js' ) )
	->header();

asset()
	->script( 'example-footer', mix( '/js/footer.js' ) )
	->footer();
```

You can also specify the asset's version and dependencies:

```php
asset()
	->style( 'example-styles', mix( '/css/app.css' ) )
	->version( '1.0' )
	->dependencies( [ 'unicorn-css' ] );
```

## Laravel Mix

Mantle includes [Laravel Mix](https://laravel.com/docs/8.x/mix) by default to manage assets.