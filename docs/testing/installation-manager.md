# Installation Manager

## Introduction

The Installation Manager is a class used to install WordPress for testing. It
supports installing WordPress in a temporary directory and `rsync`ing your
project to live within it for testing.

## Overriding the Default Installation

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

## Rsyncing

The Installation Manager can manage the entire rsync process without you needing
to manually execute a shell script before running your unit tests.

### Rsyncing a Plugin

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
Plugins normally don't need to be rsynced. Mantle will automatically install
WordPress if not found and use the installation without rsyncing the plugin.
:::

### Rsyncing a Theme

Themes can be rsynced to live within a WordPress installation by using the
`maybe_rsync_theme()`. Within your `tests/bootstrap.php` file, you can use the
following code:

```php
\Mantle\Testing\manager()
  ->maybe_rsync_theme()
  ->install();
```

By default, the Installation Manager will set the default name of the theme. If
you'd like to customize it, you can pass the name to the `maybe_rsync_theme()`
method:

```php
\Mantle\Testing\manager()
  ->maybe_rsync_theme( 'my-theme-name' )
  ->install();
```

The installation manager will place the theme in the
`wp-content/themes/<my-theme-name>` directory within the WordPress installation.

### Rsyncing a `wp-content/`-rooted Project

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

## Registering Before/After/Loaded Callbacks

The Installation Manager supports before, after, and loaded callbacks during the
installation process. These callbacks can be used to perform any additional
setup or teardown tasks that are needed for your project before tests are run.

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
be executed after the WordPress installation is finished and during the `muplugins_loaded` WordPress hook.

```php
\Mantle\Testing\manager()
  ->loaded( function() {
    // Do something after the installation such as loading
    // your plugin's main file.
  } )
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
