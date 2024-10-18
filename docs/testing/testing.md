# Testing: Getting Started

## Introduction

Mantle provides a PHPUnit test framework to make it easier to test your code
with WordPress. It is focused on making testing your application faster and
easier, allowing unit testing to become top of mind when building your site.
Mantle includes many convenient helpers to allow you to expressively test your
applications.

With Mantle, your application's tests live in your `tests` directory. Tests
should extend from the `App\Tests\Test_Case` test case, which include booting
and the use of your Mantle application inside of your test case. By default,
your application's `tests` directory contains two directories: `Feature` and
`Unit`. Unit tests are tests that focus on a very small, isolated portion of
your code. In fact, most unit tests probably focus on a single method. Tests
within your "Unit" test directory do not boot your Mantle application and
therefore are unable to access your application's database or other framework
services. The tests within "Unit" extend from the base PHPUnit test case and
cannot use the rest of the testing framework.

Feature tests may test a larger portion of your code, including how several
objects interact with each other or even a full HTTP request to a JSON endpoint.
**Generally, most of your tests should be feature tests. These types of tests
provide the most confidence that your system as a whole is functioning as
intended.**

After installing a Mantle application, unit tests can be run directly or via
Composer:

```bash
vendor/bin/phpunit

composer phpunit
```

:::tip Interested in using the testing framework outside of a Mantle application?

[Mantle Testkit](./testkit.md) is a standalone package that can be used to run
Mantle's testing framework in any WordPress project. [Learn more about Mantle Testkit](./testkit.md).
:::

## Creating Tests

To create a new test case, use the `make:test` command. By default, the tests
will be placed in the `tests` directory.

```bash
bin/mantle make:test Namespace\Test_Name>

wp mantle make:test <Namespace\Test_Name>
```

## Why This Instead of WordPress Core's Test Suite?

We hope nobody interprets Mantle's Test Framework as a slight against WordPress
Core's test suite. We :heart: WordPress Core's test suite and Mantle's Test
Framework is unequivocally a derivative work of it.

WordPress Core's test suite ("wordpress-develop", if you will) is a wonderful
test suite for testing WordPress itself. We, and many others in the WordPress
community, have been repurposing it for years to help us run plugin and theme
tests. That's worked fine, but it's not optimal. Mantle's Test Framework tries
to incorporate the best parts of WordPress Core's test suite, but remove the
unnecessary bits. Without having to worry about older versions of PHP, that also
allows Mantle's Test Framework to use the latest versions of PHPUnit itself.

## Drop-in Support for Core Test Suite

The Mantle Test Framework includes support for WordPress core's test suite
methods, including `go_to()` and `$this->factory()` among others. Projects are
able to switch to the Mantle Test Framework without needing to rewrite any
existing unit tests. See the [Mantle Test Kit](./testkit.md) for more
information.

## Using the Testing Framework

The testing framework is flexible enough to support running tests in a variety
of environments. The most common use case is running tests in an existing
WordPress project. For example, you could run tests within a plugin that is
located within a larger WordPress project. This would fall under the
[Running Tests Within a WordPress Project](#running-tests-within-a-wordpress-project)
guide for using an existing WordPress project to run tests against.

The framework also supports running tests within an isolated project. For
example, a standalone plugin/theme that is not located inside a WordPress
project. This would fall under the [Running Tests in a Standalone
Project](#running-tests-in-a-standalone-project) guide for using an isolated
project to run tests against.

Mantle's Test Framework provides a special bootstrapper and installer for
WordPress. It is common in WordPress to use a _separate_ WordPress codebase when
running unit tests. In Mantle, you use the same codebase and a separate
database. As long as your test suite isn't writing to any files, a singular
codebase is a preferable setup, especially if you want to use XDebug to step
through your test or want to rely on your IDE to discover testing framework
methods.

### Running Tests Within a WordPress Project

When running tests within a WordPress project, Mantle will use the existing
WordPress installation to run tests against. This is the most common use case
for Mantle's Test Framework. While the codebase will be used, the database will
not be. Mantle will attempt to [use a default
configuration](https://github.com/alleyinteractive/mantle-ci/blob/main/wp-tests-config-sample.php)
to connect to locally. The default configuration will install WordPress using a
`localhost` database named `wordpress_unit_tests` with the username/password
pair of `root/root`. This can be overridden by defining your own
`wp-tests-config.php` file in the root of your WordPress project.

:::tip Mantle can generate a `wp-tests-config.php` file for you

You can generate your own config file by running `bin/mantle test-config`.
:::

### Running Tests in a Standalone Project

A standalone project that isn't located within an existing WordPress project can
be used to run tests against. Mantle will automatically install WordPress for
you without needing to run any manual bash script in your continuous integration
process. **This means that you only have to run `composer test` instead of having
to run a bash script to setup WordPress, rsync it to a temporary folder, and
then run your tests.**

Internally, Mantle will run a
[shell script](https://github.com/alleyinteractive/mantle-ci/blob/HEAD/install-wp-tests.sh)
that will install WordPress for you at a temporary directory. For plugins, this
is more than enough to provide a WordPress installation to run tests against.
Your tests and project would remain where it is currently and the rest of
WordPress would be installed within a temporary directory.

Themes or more integrated projects will need to [rsync your
project](#rsyncing-your-project-to-a-wordpress-installation) to the temporary
directory to run tests against.

### Rsyncing Your Project to a WordPress Installation

Mantle can rsync your project to within a working WordPress installation without needing to run any
rsync command yourself. This is useful for themes or more integrated projects
that need to run tests against a fully integrated WordPress installation. Within
your `tests/bootstrap.php` file, you can use the [Installation Manager](./installation-manager.md)
to rsync your project to the WordPress installation:

```php
// Rsync a plugin to live as a plugin within a WordPress installation.
\Mantle\Testing\manager()
	->maybe_rsync_plugin()
	->install();

// Rsync a theme to live as a theme within a WordPress installation.
\Mantle\Testing\manager()
	->maybe_rsync_theme()
	->install();
```

For more information, read more about the [Installation Manager](./installation-manager.md).

## Migrating to Mantle Testing Framework 1.x and PHPUnit 10.x

Mantle's Test Framework 1.x upgrades the PHPUnit version to 10.x. This is a
major upgrade and may require some changes to your existing tests. The most
common change is the need for projects to use PSR-4 file/class naming
conventions. This is a breaking change from PHPUnit 9.x that allowed for classic
WordPress-style file/class naming conventions in your tests.

Mantle 1.x does support PHPUnit 9.x if you want to continue using that version
of PHPUnit and not migrate your codebase. For more information, see the
[1.x CHANGELOG note about the PHPUnit 10 Migration](https://github.com/alleyinteractive/mantle-framework/blob/1.x/CHANGELOG.md#phpunit-10-migration) for more information.