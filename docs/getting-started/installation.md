# Installation

## Requirements

Mantle has two system requirements to run: PHP to be at least running 8.0 and
WordPress to be at least 5.9. Mantle supports PHP 8 to 8.2.

## How Can I Use Mantle?

Mantle supports two different modes of operation:

1. **This is the most common setup:** As a plugin/theme framework for a
   WordPress site. It normally lives in `wp-content/plugins/mantle.` and uses
    [`alleyinteractive/mantle`](https://github.com/alleyinteractive/mantle) as
    the starter package for this mode.
2. In isolation in an existing code base. The Mantle framework provides all it's
   own default configuration and service providers and doesn't require most of
   the code in `alleyinteractive/mantle` to function. This mode is useful for
    integrating Mantle into an existing code base and using one of it's features
    like queue or routing without setting up the rest of the application.

    For more information on this mode, see the [Using Mantle in
    Isolation](#using-mantle-in-isolation) section.

## Installing Mantle on a Site

Mantle sites should live in `wp-content/plugins/{site-slug}/` inside a WordPress
project.

### Via Mantle Installer

The Mantle Installer can install Mantle on a new or existing WordPress
application. Download the Mantle installer using
[Composer](https://getcomposer.org/).

```bash
composer global require alleyinteractive/mantle-installer
```

Once installed the `mantle new` command will create a fresh Mantle installation
wherever you specify. It can also install WordPress for you or install Mantle
into an existing WordPress installation.

```bash
mantle new my-site
```

:::info Looking to contribute to Mantle?

You can install Mantle and the Mantle Framework linked to each other for easy
local development. Both will be cloned as Git repositories. Mantle Framework
will be locally checked out to `plugins/mantle-framework`.

```bash
mantle new my-site --setup-dev
```

:::

### Via Composer Create-Project

Alternatively, you can install a Mantle site using Composer, replacing `my-site`
with your site's slug.

```bash
cd wp-content/plugins/

composer create-project alleyinteractive/mantle my-site \
  --remove-vcs \
  --stability=dev \
  --no-cache \
  --no-interaction
```

## Use `create-mantle-app`

The [`create-mantle-app`](https://github.com/alleyinteractive/create-mantle-app)
can be used as a GitHub template for a starter template for your next
application. It is a `/wp-content/`-rooted application template that already has
Mantle installed as a plugin.

## Configuration

Mantle should be loaded through a `mu-plugin`, `client-mu-plugin`, or another
initialization script as a plugin. To ensure that all features work correctly,
Mantle should be loaded before the `muplugins_loaded` action is fired.

## Using Mantle in Isolation

Mantle supports the use of the framework and its features in complete isolation,
without the need of the starter code in `alleyinteractive/mantle`. Using the
Application Bootloader, you can instantiate the Mantle
framework in one line and use it's features in any code base.

```php
bootloader()->boot();
```

:::tip
For more information on the Bootloader, see the [Bootloader documentation](/docs/architecture/bootloader).
:::

For example, if you want to use Mantle's Queue feature in an existing code base,
you can do so by booting the framework and then using the `dispatch()` helper
(see the [queue documentation](/docs/features/queue) for more information).

```php
// Boot the application.
bootloader()->boot();

// Dispatch an anonymous job.
dispatch( function () {
  // Do something expensive here.
} );
```