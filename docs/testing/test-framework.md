# Testing Framework

Mantle provides a PHPUnit test framework to make it easier to test your code
with WordPress. It is focused on making testing your application faster and
easier, allowing unit testing to become top of mind when building your site.
Mantle includes many convenient helpers to allow you to expressively test your
applications.

With Mantle, your application's tests live in your `tests` directory. Tests
should extend from the `App\Tests\Test_Case` test case, which include booting
and the use of your Mantle application inside of your test case. Unit tests can
be run using Composer:

```bash
composer run phpunit
```

Test cases can be generated using `wp-cli`:

```bash
wp mantle make:test <Namespace\Test_Name>
```

## Setting up the Test Framework

Mantle's Test Framework provides a special bootstrapper and installer for
WordPress. It is common in WordPress to use a _separate_ WordPress codebase when
running unit tests. In Mantle, you use the same codebase and a separate
database. As long as your test suite isn't writing to any files, a singular
codebase is a preferable setup, especially if you want to use xdebug to step
through your test.

The Mantle Test Framework will work out of the box defining a set of constants
to install WordPress. The default set of constants can be overridden using a
test config in your WordPress root directory, named `wp-tests-config.php`. See
[the sample config in the Mantle
Framework](https://github.com/alleyinteractive/mantle-framework/blob/main/src/mantle/testing/wp-tests-config-sample.php)
to get started. This config is similar to `wp-config.php` and defines many of
the same constants. Most importantly, it defines the database information, which
*must* be different from your environment's database. If you reuse the same
database, your data could be lost!

The default configuration will install WordPress using a `localhost` database
named `wordpress_unit_tests` with the username/password pair of `root/root`. All
constants can be overridden using the `wp-tests-config.php` file or your unit
test's bootstrap file.

Lastly, see this repository's [`tests/bootstrap.php`
file](https://github.com/alleyinteractive/mantle/blob/main/tests/bootstrap.php)
for examples of how to load the Mantle Test Framework in your project.

### Why This Instead of WordPress Core's Test Suite?

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

### Drop-in Support for Core Test Suite (and use of Mantle Testing Framework outside of Mantle)

The Mantle Test Framework supports legacy support for core's test suite methods,
including `go_to()` and `factory()` among others. Projects are able to switch to
the Mantle Test Framework without needing to rewrite any existing unit tests.
See the [Mantle Test Kit](./testkit.md) for more information.

## Running Tests

Running tests locally can be done in seconds. If you're working on a plugin/theme in an existing WordPress installation Mantle will use that installation to run tests against. (Be sure to read ahead to [Generating a wp-tests-config.php](#generating-a-wp-tests-config-php)) If you're working on a standalone project not located inside a WordPress project then Mantle will automatically install WordPress for you at `/tmp/wordpress`.

### Generating a `wp-tests-config.php`

When running WordPress inside an existing installation Mantle will attempt to use the existing installation with some default configuration values:

```
DB_NAME: wordpress_unit_tests
DB_USER: root
DB_PASSWORD: root
DB_HOST: localhost
DB_CHARSET: utf8
```

For most local developers this configuration will be correct and Mantle's unit
tests will be able to be run. For others, you will need to create a
`wp-tests-config.php` in your WordPress installation. You can copy [this
file](https://github.com/alleyinteractive/mantle-framework/blob/HEAD/src/mantle/testing/wp-tests-config-sample.php)
to the root of your WordPress installation and customize as needed.

If you are using the Mantle Framework in your application, you can run `wp
mantle test-config` to automatically generate this file for you.