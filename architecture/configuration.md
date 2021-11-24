# Configuration

[[toc]]

# Introduction

Mantle provides a configuration interface to allow easy control over the
application and how it differs on each environment. The application ships with a
few configuration files in the `config/` folder.

## Getting Configuration

Configuration is possible through the `config()` helper function, the `Config`
alias, and `Mantle\Facade\Config` facade. Each method supports a "dot"
syntax which includes the name of the file and the option you wish to access.

```php
config( 'app.providers' );

Config::get( 'app.providers' );

Mantle\Facade\Config::get( 'app.providers' );
```

## Environment Configuration

It is often helpful to have different configuration values based on the
environment where the application is running. For example, you may wish to use a
different cache driver locally than you do on your production server.

To make this a simple, Mantle utilizes the
[DotEnv](https://github.com/vlucas/phpdotenv) PHP library. In a fresh Mantle
installation, the root directory of your application will contain a
`.env.example` file that defines many common environment variables. This file
should be copied to `.env` for use.

::: details Deploying your site to a server?
See [Environment File Location](#environment-file-location) for where the `.env` should be placed.
:::

Mantle's default `.env` file contains some common configuration values that may
differ based on whether your application is running locally or on a production
web server. These values are then retrieved from various Mantle configuration
files within the config directory using Mantle's `environment()` function.

If you are developing with a team, you may wish to continue including a
`.env.example` file with your application. By putting placeholder values in the
example configuration file, other developers on your team can clearly see which
environment variables are needed to run your application.

::: tip
Any variable in your .env file can be overridden by external environment
variables such as server-level or system-level environment variables.
:::

### Environment File Location

For most WordPress installations, all files static files will be exposed to the
web server and accessible by the end user. Placing a `.env` file in your
plugin's folder is not sure since that file can be accessed by anybody on the
internet with an unique interest in your site.

Mantle supports placing the `.env` file in more secure locations in you
WordPress application. For WordPress VIP users, the `.env` file can be placed
inside your [private
directory](https://docs.wpvip.com/technical-references/vip-codebase/private-directory/)
(`/wp-content/private`). Mantle will also check in the `wp-content/private` and
`WPCOM_VIP_PRIVATE_DIR` folder for `.env` files.

### Environment File Security

Your `.env` file should not be committed to your application's source control,
since each developer / server using your application could require a different
environment configuration. Furthermore, this would be a security risk in the
event an intruder gains access to your source control repository, since any
sensitive credentials would get exposed. See [Environment File
Location](#environment-file-location) for more information.

### Environment Variable Types

All variables in your .env files are typically parsed as strings, so some
reserved values have been created to allow you to return a wider range of types
from the env() function:

| `.env` Value | `environment()` Value |
| ------------ | --------------------- |
| true | (bool) true |
| (true) | (bool) true |
| false | (bool) false |
| (false) | (bool) false |
| empty | (string) '' |
| (empty) | (string) '' |
| null | (null) null |
| (null) | (null) null |

If you need to define an environment variable with a value that contains spaces,
you may do so by enclosing the value in double quotes:

```
APP_NAME="My Application"
```

### Retrieving Environment Configuration

All of the variables listed in this file will be loaded into the `$_ENV` PHP
super-global when your application receives a request. However, you may use the
env helper to retrieve values from these variables in your configuration files.
In fact, if you review the Mantle configuration files, you will notice many of
the options are already using this helper:

```php
'debug' => environment( 'APP_DEBUG', defined( 'WP_DEBUG' ) && WP_DEBUG ),
```

The second value passed to the env function is the "default value". This value
will be returned if no environment variable exists for the given key.

## File-based Environment-specific Configuration

For situations when environment variables aren't supported, environment-specific
configuration is possible by including a configuration file in a child folder
named after the respective environment to apply the configuration for.

::: warning
`.env`-based configuration is preferred for simplicity versus file-based PHP files.
:::

The following is an example of a configuration value that is
only loaded on the `local` environment.

```
├── README.md
├── config
│   ├── app.php
│   ├── local
│   │   └── app.php
```

```php
// Located in config/local/app.php.
return [
	'providers' => App\Providers\Local_Service_Provider::class,
];
```
