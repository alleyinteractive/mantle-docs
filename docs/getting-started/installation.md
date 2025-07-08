# Installation

## Requirements

Mantle has two system requirements to run:

* PHP to be at least running 8.2. Mantle supports PHP 8.2 to 8.4 as of Mantle v1.4.
* WordPress to be at least 6.5.

## How Can I Use Mantle?

Mantle supports two different modes of operation:

1. **This is the most common setup:** As a plugin/theme framework for a
   WordPress site. It normally lives in `wp-content/plugins/mantle.` and uses
    [`alleyinteractive/mantle`](https://github.com/alleyinteractive/mantle) as
    the starter package for this mode.
2. In isolation in an existing code base. The Mantle framework provides all it's
   own default configuration and service providers and doesn't require most of
   the code in `alleyinteractive/mantle` to function. This mode is useful for
    integrating Mantle into an existing code base and using one of its features
    like queueing or routing without setting up the rest of the application.

    For more information on this mode, see the [Using Mantle Without a Starter
    Template](#using-without-a-starter-template) section.

## Installing Mantle on a Site with Mantle Installer

Mantle sites should live in `wp-content/plugins/{site-slug}/` inside a WordPress
project. The Mantle Installer can install Mantle on a new or existing WordPress
application. The installer can be installed via a PHP PHAR or globally using
Composer (PHAR is recommended).

### Via PHAR 📦

Download the latest PHAR release of the Mantle installer from the [latest
releases
page](https://github.com/alleyinteractive/mantle-installer/releases/latest). You
can use the PHAR directly or move to a `$PATH` directory. Here's a quick example
of how to do all of that:

```bash
# Download the latest PHAR release.
gh release download --clobber -p '*.phar' -R alleyinteractive/mantle-installer
chmod +x mantle-installer.phar

# Optionally move it to a directory in your PATH for global usage.
sudo mv mantle-installer.phar /usr/local/bin/mantle
```

:::note
This example uses the `gh` CLI from GitHub to download the latest release. You
can also download the PHAR manually from the [latest release
page](https://github.com/alleyinteractive/mantle-installer/releases/latest).
:::

From here, you can run the `mantle` command from anywhere on your system:

```
Mantle Installer

Usage:
  command [options] [arguments]

Options:
  -h, --help            Display help for the given command. When no command is given display help for the list command
      --silent          Do not output any message
  -q, --quiet           Only errors are displayed. All other output is suppressed
  -V, --version         Display this application version
      --ansi|--no-ansi  Force (or disable --no-ansi) ANSI output
  -n, --no-interaction  Do not ask any interactive question
  -v|vv|vvv, --verbose  Increase the verbosity of messages: 1 for normal output, 2 for more verbose output and 3 for debug

Available commands:
  completion  Dump the shell completion script
  help        Display help for a command
  list        List commands
  new         Create a new Mantle application
```

### Via Composer 🛠 ️

Download the Mantle installer using [Composer](https://getcomposer.org/).

```bash
composer global require alleyinteractive/mantle-installer
```

Once installed the `mantle new` command will create a fresh Mantle installation
wherever you specify. It can also install WordPress for you or install Mantle
into an existing WordPress installation.

```bash
mantle new my-site
```

<!-- :::info Looking to contribute to Mantle?

You can install Mantle and the Mantle Framework linked to each other for easy
local development. Both will be cloned as Git repositories. Mantle Framework
will be locally checked out to `plugins/mantle-framework`.

```bash
mantle new my-site --setup-dev
```

::: -->

### Manual Installation

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

## Starter Template for `wp-content`-based Projects

[Alley's
`create-wordpress-project`](https://github.com/alleyinteractive/create-wordpress-project)
starter template can be used as a starting point for using Mantle on a
`wp-content`-rooted project. `create-wordpress-project` includes a configuration
script to help you setup your project and install plugins and themes. It also
supports installing Mantle as a plugin out of the box.

## Using Without a Starter Template

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

For example, if you want to use [Mantle's Queue feature](../features/queue.md)
in an existing code base, you can do so by booting the framework and then using
the `dispatch()` helper (see the [queue documentation](/docs/features/queue) for
more information).

```php
// Boot the application.
bootloader()->boot();

// Dispatch an anonymous job.
dispatch( function () {
  // Do something expensive here.
} );
```

Calling the bootloader is all you need to use Mantle in isolation -- no other
files or directories need to be created. If you want to enhance your experience,
you can copy files down from
[alleyinteractive/mantle](https://github.com/alleyinteractive/mantle) as needed
to your code base.