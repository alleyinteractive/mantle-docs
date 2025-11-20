---
title: "Testing: Installation Manager"
sidebar_label: Installation Manager
description: The Installation Manager is a class used to install WordPress for testing.
---

# Testing: Installation Manager

## Introduction

The Installation Manager is a class used to manage the installation of
WordPress.

Mantle aims to remove the need to install any external dependencies such as core
testing suites, WordPress VIP MU plugins, or other testing tools. The
Installation Manager should be capable of handling all of that and letting you
focus on writing tests. The only thing you should need to do to test your
plugin/theme/site is run `composer phpunit`.

## Supported Use Cases

The Installation Manager supports two main use cases:

1. Installing WordPress for testing in an existing WordPress installation. The existing
   installation's code will be used but the Installation Manager will handle
   setting up the database and other configuration needed for testing.

   The [Modifying the WordPress Installation](#modifying-the-wordpress-installation) section will cover how
   to customize the WordPress installation for your specific testing needs.
2. Installing WordPress for testing in a temporary directory and rsync-ing your project to live
   within it for testing.

   The [Rsync-ing](#rsync-ing) section will cover how to rsync your project for testing purposes and
   the [Modifying the WordPress Installation](#modifying-the-wordpress-installation) section will cover how to
   customize the WordPress installation for your specific testing needs after the rsync process.

## Modifying the WordPress Installation

The Installation Manager supports fluent methods for modifying the WordPress
installation before/after the installation process. It also has helpers to aid
in the setup process for projects to make it easier to get testing.

### Registering a Before Callback

Before callbacks are registered using the `before()` method. The callback will
be executed before the WordPress installation is started.

```php
\Mantle\Testing\manager()
  ->before( function() {
    // Do something before the installation.
  } )
  ->install();
```

### Registering an After Callback

After callbacks are registered using the `after()` method. The callback will be
executed after the WordPress installation is finished.

```php
\Mantle\Testing\manager()
  ->after( function() {
    // Do something after the installation.
  } )
  ->install();
```

### Registering a Loaded Callback

Loaded callbacks are registered using the `loaded()` method. The callback will
be executed after the WordPress installation is finished and during the
`muplugins_loaded` WordPress hook.

```php
\Mantle\Testing\manager()
  ->loaded( function() {
    // Do something after the installation such as loading
    // your plugin's main file.
  } )
  ->install();
```

### Enabling Multisite

Multisite can be enabled using the `with_multisite()` method. This will configure
WordPress to use Multisite during the installation process.

```php
\Mantle\Testing\manager()
  ->with_multisite()
  ->install();
```

### Registering a `init` Callback

Callbacks can be registered to run during the `init` WordPress hook using the `init()` method.

```php
\Mantle\Testing\manager()
  ->init( function() {
    // Do something during the init hook.
  } )
  ->install();
```

### Changing the Active Theme

The active theme can be changed using the `with_theme()` method. The method accepts
the theme name and will switch to the active theme on the `muplugins_loaded`
hook:

```php
\Mantle\Testing\manager()
  ->with_theme( 'my-theme-name' )
  ->install();
```

Calling `with_theme()` will also set the `WP_DEFAULT_THEME` environmental variable
to the theme.

### Changing the Active Plugins

The active plugins can be changed using the `with_plugins()` method. The method
accepts an array of plugin file paths (mirrors the `active_plugins` option) and
will switch to the active plugins on the `muplugins_loaded` hook:

```php
\Mantle\Testing\manager()
  ->with_plugins( [
    'my-plugin/my-plugin.php',
    'my-other-plugin/my-other-plugin.php',
  ] )
  ->install();
```

### Changing an Option

The `with_option()` method can be used to set an option in the WordPress
database. The method accepts the option name and value:

```php
\Mantle\Testing\manager()
  ->with_option( 'my_option', 'my_value' )
  ->install();
```

### Changing the Site/Home URL

The `with_url()` method can be used to set the site and home URLs in the
WordPress. Both are optional.

```php
\Mantle\Testing\manager()
  ->with_url(
    home: 'https://example.com',
    site: 'https://example.com'
  )
  ->install();
```

### Using the Experimental Feature for Home URL in Testing

Mantle is switching to use the site's home URL for testing as the request host
rather than the hard-coded value of the `WP_TESTS_DOMAIN` constant. This is a
more accurate representation of how WordPress is used in production. In the next
major version of Mantle, this will be the default behavior.

To enable this feature, you can use the `with_experimental_testing_url_host()` method:

```php
\Mantle\Testing\manager()
  ->with_experimental_testing_url_host()
  ->install();
```

You can customize the [site and home URLs](#changing-the-sitehome-url) via the
Installation Manger.

:::note Heads up!
This feature will be made the default behavior in the next major version of
Mantle.
:::

:::tip Enable via a Environmental Variable
You can also set the default behavior by setting the
`MANTLE_EXPERIMENTAL_TESTING_USE_HOME_URL_HOST` environmental variable to `true`.
:::

### Enabling Debug Mode

Debug mode can be enabled using the `with_debug()` method. This will configure
the Installation Manager to set the `MANTLE_TESTING_DEBUG` environmental variable
to `'1'` during the installation process. You will see more verbose output from
the installation script.

This can be helpful when debugging issues with the installation or rsync
process.

```php
\Mantle\Testing\manager()
  ->with_debug()
  ->install();
```

## Rsync-ing

The Installation Manager can manage the entire rsync process without you needing
to manually execute a shell script before running your unit tests.

### Overriding the Default Installation

By default, Mantle will install WordPress to a temporary directory. This will
default to `/tmp/wordpress` or another temporary directory if that isn't
available. The default installation will also make some assumptions about the
default configuration of WordPress, such as the database name, username, and
password.

The following are the default values and the environmental variables that can be
used to override them:

| Variable/Setting | Default Value | Environmental Variable Name |
| --- | --- | --- |
| Installation Path | `/tmp/wordpress` | `WP_CORE_DIR` |
| `DB_NAME` | `wordpress_unit_tests` | `WP_DB_NAME` |
| `DB_USER` | `root` | `WP_DB_USER` |
| `DB_PASSWORD` | `root` | `WP_DB_PASSWORD` |
| `DB_HOST` | `localhost` | `WP_DB_HOST` |
| WordPress Version | `latest` | `WP_VERSION` |
| Skip Database Creation | `false` | `WP_SKIP_DB_CREATE` |
| PHPUnit Path | `vendor/bin/phpunit` | `WP_PHPUNIT_PATH` |

Mantle uses `getenv()` to retrieve the environmental variables and will fallback
to the default values if the environmental variable isn't set.

### Rsync-ing a `wp-content/`-rooted Project

If you're working on a project that is rooted in the `wp-content/` directory (a
WordPress VIP site for example), you can use the `maybe_rsync()` to rsync the
entire project over to a working WordPress installation.

```php
\Mantle\Testing\manager()
	->maybe_rsync()
	->install();
```

Your project will then be rsynced to the `wp-content/` directory within the
WordPress installation.

### Rsync-ing a Plugin

Plugins can be rsync'd to live within a WordPress installation by using the
`maybe_rsync_plugin()`. Within your `tests/bootstrap.php` file, you can use the
following code:

```php
\Mantle\Testing\manager()
	->maybe_rsync_plugin()
	->install();
```

By default, the Installation Manager will set the default name of your plugin.
If you'd like to customize it, you can pass the name to the
`maybe_rsync_plugin()` method:

```php
\Mantle\Testing\manager()
  ->maybe_rsync_plugin( 'my-plugin-name' )
  ->install();
```

The installation manager will place the plugin in the
`wp-content/plugins/<my-plugin-name>` directory within the WordPress
installation.

:::note
Plugins normally don't need to be rsync'd. Mantle will automatically install
WordPress if not found and use the installation without rsyncing the plugin.
:::

### Rsync-ing a Theme

Themes can be rsynced to live within a WordPress installation by using the
`maybe_rsync_theme()`. Within your `tests/bootstrap.php` file, you can use the
following code:

```php
Mantle\Testing\manager()
	->maybe_rsync_theme()
	->install();
```

By default, the Installation Manager will set the default name of the theme. If
you'd like to customize it, you can pass the name to the `maybe_rsync_theme()`
method:

```php
Mantle\Testing\manager()
	->maybe_rsync_theme( 'my-theme-name' )
	->install();
```

The installation manager will place the theme in the
`wp-content/themes/<my-theme-name>` directory within the WordPress installation.

### Including WordPress VIP MU Plugins

Mantle can automatically install the built-version of [WordPress VIP's MU
Plugins](https://github.com/Automattic/vip-go-mu-plugins-built) to your testing
installation.

```php
Mantle\Testing\manager()
	->maybe_rsync_wp_content()
	->with_vip_mu_plugins()
	->install();
```

If your project does include a `mu-plugins` folder, it will be ignored and will
not be rsync'd to the testing installation.

You can also set the `MANTLE_INSTALL_VIP_MU_PLUGINS` environmental variable to
`true` to automatically include the WordPress VIP MU Plugins in your testing
installation.

### Including Memcache Object Cache Drop-In

If your project uses the [Memcache Object Cache Drop-In](https://raw.githubusercontent.com/Automattic/wp-memcached/HEAD/object-cache.php),
you can include it in your testing installation for parity with your production environment.

```php
Mantle\Testing\manager()
	->maybe_rsync_wp_content()
	->with_object_cache()
	->install();
```

You can also set the `MANTLE_INSTALL_OBJECT_CACHE` environmental variable to
`true` to automatically include the Memcache Object Cache Drop-In in your testing
installation.

:::note

If your testing environment does not include the `Memcache` extension, the
Memcache Object Cache Drop-In will not be installed to prevent a fatal error. If
you want to force the installation of the Memcache Object Cache Drop-In, you set
the `MANTLE_REQUIRE_OBJECT_CACHE` environmental variable to `true`.

:::

### Including Redis Object Cache Drop-In

If your project uses Redis for object caching, you can include the
[wp-redis object-cache.php](https://github.com/pantheon-systems/wp-redis/blob/HEAD/object-cache.php)
file instead.

```php
Mantle\Testing\manager()
  ->maybe_rsync_wp_content()
  ->with_object_cache( 'redis' )
  ->install();
```

You can also set the `MANTLE_INSTALL_OBJECT_CACHE` environmental variable to
`redis` and Mantle will automatically include the Redis Object Cache Drop-In for you.

### Installing Additional Plugins

If you'd like to install additional plugins to the testing installation, you can
use the `install_plugin()` method. This method accepts an string of the plugin
name and a version or URL to a zip file.

```php
\Mantle\Testing\manager()
  // Install the plugins after rsyncing to WP_CORE_DIR.
  ->install_plugin( 'akismet' )
  ->install_plugin( 'byline-manager', 'https://github.com/alleyinteractive/byline-manager/archive/refs/heads/production.zip' )
  // Tell WordPress to activate the plugins.
  ->plugins( [
    'akismet/akismet.php',
    'byline-manager/byline-manager.php',
  ] )
  ->install();
```

### Using SQLite for the Database

Mantle can automatically configure WordPress to use SQLite for the database
instead of MySQL for testing. This can be a big leap in performance for your
average project. This is powered by the
[db.php drop-in](https://github.com/aaemnnosttv/wp-sqlite-db).
To enable SQLite, you can use the `with_sqlite()` method:

```php
\Mantle\Testing\manager()
  ->with_sqlite()
  ->install();
```

You can also set the `MANTLE_USE_SQLITE` environmental variable to `true` to use
SQLite for testing by default.

By default, Mantle will use MySQL for the database. SQLite will work well for
most use-cases but there are some limitations. For example, if you're creating
database tables or performing complex SQL queries, you may run into issues and
are better off not using SQLite.

### Disabling Object Cache for Local Development

If you're working on a local development environment and don't want to use an
object cache when testing, you can use the `without_local_object_cache()` method:

```php
\Mantle\Testing\manager()
  ->without_local_object_cache()
  ->install();
```

### Excluding Files from Rsync

If you'd like to exclude files from being rsync'd to the testing installation,
you can use the `exclusions()` method. This method accepts an array of files
that will be passed to `rsync` and be excluded from the rsync process.

```php
\Mantle\Testing\manager()
  ->exclusions( [
    'vendor/',
    'node_modules/',
  ] )
  ->install();
```

## Performing the Installation

The installation process can be started by calling the `install()` method on the
Installation Manager.

```php
\Mantle\Testing\manager()->install();

// Or, if you're using the helper function.
\Mantle\Testing\install();
```

## About the Installation Script

The Installation Manager uses a installation script located in the
[mantle-ci repository](https://github.com/alleyinteractive/mantle-ci/blob/HEAD/install-wp-tests.sh).
The script provides a fast way of installing WordPress for testing purposes. It
also supports caching the installation between runs to speed up the process. For
more information, see the documentation in the script.
