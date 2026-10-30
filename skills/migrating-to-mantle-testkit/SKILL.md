---
name: migrating-to-mantle-testkit
description: Use when moving a WordPress plugin, theme, or wp-content-rooted site off WordPress core's PHPUnit test suite (WP_UnitTestCase, bin/install-wp-tests.sh, WP_TESTS_DIR, wp-phpunit/wp-phpunit, yoast/phpunit-polyfills) onto Mantle Testkit (mantle-framework/testkit), or upgrading an old Testkit 0.x setup to 1.x and PHPUnit 10+.
---

# Migrating to Mantle Testkit

## Overview

Mantle Testkit replaces core's test suite with Mantle's testing framework. It installs WordPress itself, so `vendor/bin/phpunit` is the only command needed. Most core test idioms (`go_to()`, `$this->factory`, `assertQueryTrue()`, `@expectedDeprecated`) keep working, so the migration is mostly plumbing plus PHPUnit 10+ cleanup.

**Scope:** change only test infrastructure (dependencies, `tests/`, PHPUnit config, CI). Leave plugin/theme source code alone. If a test fails because of a bug in the code under test, report it to the user; do not fix it inside the migration.

Docs: https://mantle.alley.com/docs/testing/testkit (append `.md` to any docs URL for Markdown).

## Steps

### 1. Dependencies

```bash
composer require --dev mantle-framework/testkit:^1.0
```

Then `composer remove --dev` whichever of `wp-phpunit/wp-phpunit`, `yoast/phpunit-polyfills`, and `phpunit/phpunit` are listed. Testkit pulls in PHPUnit 10–13 and requires PHP 8.3+. Testkit conflicts with `alleyinteractive/mantle-framework`: a project that already defines a Mantle application uses that instead. Some projects already require Testkit 0.x without using it; bump that constraint the same way. Add a `"phpunit": "phpunit"` Composer script and replace `.phpunit.result.cache` with `.phpunit.cache` in `.gitignore`, along with any `.distignore`/`.deployignore` entries.

If Composer refuses to resolve because an unrelated dev package (old coding standards, for example) has a security advisory, don't bump that package as part of this migration. Tell the user and let them choose between a separate bump and `config.audit.ignore`.

Delete `bin/install-wp-tests.sh` and any wrapper scripts that call it.

### 2. `tests/bootstrap.php`

Replace the whole file (the `WP_TESTS_DIR` lookup, `includes/functions.php`, `tests_add_filter( 'muplugins_loaded', ... )`, and `includes/bootstrap.php`):

```php
<?php
\Mantle\Testing\manager()
	->maybe_rsync_plugin()
	->loaded( fn () => require_once __DIR__ . '/../my-plugin.php' )
	->install();
```

| Project type | Rsync call |
| --- | --- |
| Plugin | `->maybe_rsync_plugin()` |
| Theme | `->maybe_rsync_theme()` (and `->theme( 'slug' )` to activate it) |
| `wp-content/`-rooted site | `->maybe_rsync_wp_content()` |

Carry over anything else the old bootstrap did: extra `tests_add_filter()` callbacks go in `->loaded()` (fires on `muplugins_loaded`) or `->init()`; constants go before the chain; `WP_TESTS_MULTISITE` becomes `->with_multisite()` or `WP_MULTISITE=1`. Dependency plugins use `->install_plugin( 'slug' )` plus `->plugins( [ 'slug/slug.php' ] )`. Other options: https://mantle.alley.com/docs/testing/installation-manager.

### 3. PHPUnit config

PHPUnit 10+ rejects the old attributes. Rewrite `phpunit.xml.dist`:

```xml
<?xml version="1.0"?>
<phpunit
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:noNamespaceSchemaLocation="./vendor/phpunit/phpunit/phpunit.xsd"
	bootstrap="tests/bootstrap.php"
	backupGlobals="false"
	colors="true"
	cacheDirectory=".phpunit.cache"
>
	<testsuites>
		<testsuite name="Feature">
			<directory suffix="Test.php">tests/Feature</directory>
		</testsuite>
	</testsuites>
</phpunit>
```

Keep existing `<php>` constants and env vars. Remove `convert*ToExceptions`, `printerClass`, `<listeners>`, `beStrictAbout*` attributes PHPUnit no longer accepts, and `<groups><exclude>` entries for `ms-required`/`ms-excluded` (step 5). `vendor/bin/phpunit --migrate-configuration` handles most of this.

### 4. Test files

PHPUnit 10+ loads one class per file and the file name must match the class name, so `test-*.php` / `class-test-*.php` files must be renamed.

- Move tests to `tests/Feature/<Name>Test.php` with a PSR-4 namespace, and add `"autoload-dev": { "psr-4": { "Vendor\\Plugin\\Tests\\": "tests/" } }` to `composer.json`. Rename with `git mv` so history follows the files. `alleyinteractive/wp-to-psr-4` can do the renames.
- Add a base class every test extends:

```php
<?php
namespace Vendor\Plugin\Tests;

use Mantle\Testkit\TestCase as Testkit_TestCase;

abstract class TestCase extends Testkit_TestCase {}
```

- Replace `extends WP_UnitTestCase` with the base class. Testkit also defines a `WP_UnitTestCase` alias of its `TestCase`, so unconverted classes still run during a staged migration. Finish the switch anyway.
- **Changing a test's namespace changes how its unqualified names resolve, and nothing errors until runtime.** Tests that used to sit in the plugin's namespace (or the global one) called plugin functions and constants unqualified. Under `Vendor\Plugin\Tests\Feature`, each one needs a `use function` / `use const` import. Global classes need a leading `\` or a `use`. `catch ( Exception $e )` quietly stops catching anything, so make it `\Exception`. String callables that are already fully qualified (`'\Vendor\fn'`) are fine.
- `setUp()` / `tearDown()` need `: void` and must call the parent. Core-polyfill `set_up()` / `tear_down()` also still work.
- Declare properties that tests assign dynamically. PHP 8.2+ deprecations show up in the run summary.

### 5. Compatibility reference

Works unchanged: `$this->factory->post`, `self::factory()`, `go_to()`, `assertQueryTrue()`, `assertWPError()`, `assertEqualSets()`, `assertEqualSetsWithIndex()`, `assertEqualFields()`, `assertDiscardWhitespace()`, `setExpectedDeprecated()`, `setExpectedIncorrectUsage()`, `skipWithoutMultisite()`, `skipWithMultisite()`, `set_permalink_structure()`, `reset_post_types()`, `reset_taxonomies()`, `delete_user()`, `rand_str()`, `rand_long_str()`, `strip_ws()`, `tests_add_filter()`, `reset_phpmailer_instance()`, `tests_retrieve_phpmailer_instance()`. Prefer `static::factory()` in new code.

Needs changes:

| Core idiom | Testkit replacement |
| --- | --- |
| `wpSetUpBeforeClass( $factory )` / `wpTearDownAfterClass()` | **Never called — fixtures silently won't exist.** Create them in `setUp()` (rolled back after every test). |
| `WP_UnitTest_Factory` type hints | Remove them, or use `Mantle\Database\Factory\Factory_Container` |
| `assertSameSets()` / `assertSameSetsWithIndex()` | Not provided: `assertEqualsCanonicalizing()` or sort both sides and `assertSame()` |
| `get_echo( $callable, $args )` (global function) | `capture( fn () => $callable( ...$args ) )` with `use function Mantle\Support\Helpers\capture;` |
| `xml_to_array()`, `xml_find()`, `mask_input_value()`, and other core `includes/utils.php` helpers | Not provided. Feed/XML checks: `$this->get( '/feed/' )` then `SimpleXMLElement` (namespaced tags via `->children( 'dc', true )`). |
| `@dataProvider name` | `#[DataProvider( 'name' )]` (`PHPUnit\Framework\Attributes\DataProvider`); provider must be `public static` |
| `@group name` | `#[Group( 'name' )]` |
| `@group ms-required` / `ms-excluded` | `$this->skipWithoutMultisite()` / `$this->skipWithMultisite()` at the top of the test |
| `@expectedDeprecated fn` / `@expectedIncorrectUsage fn` | Docblocks still work on PHPUnit 10–11. For 12+, `#[Expected_Deprecation( 'fn' )]` / `#[Expected_Incorrect_Usage( 'fn' )]` from `Mantle\Testing\Attributes` |
| `@ticket`, `@covers` | `@covers` → `#[CoversClass]` / `#[CoversFunction]`; drop `@ticket` |

Optional follow-ups once the suite is green (not required): HTTP tests (`$this->get( '/' )->assertOk()`), `Prevent_Remote_Requests` on the base class, `Mantle\Testing\Attributes\*`.

### 6. CI

Remove the `install-wp-tests.sh` step and any `WP_TESTS_DIR`, `WP_DEVELOP_DIR`, or core-suite checkout. On GitHub Actions, replace the deprecated `alleyinteractive/.github/.github/workflows/php-tests.yml` reusable workflow, or a hand-rolled job, with:

```yaml
- uses: alleyinteractive/action-test-php@v1.1.0
  with:
    php-version: ${{ matrix.php }}
    wordpress-version: ${{ matrix.wordpress }}
    skip-wordpress-install: 'true'
    test-command: composer phpunit
```

- `skip-wordpress-install` stops the action from installing WordPress, because Mantle does that itself.
- The action still starts MySQL and passes the DB credentials, so no extra env is needed.
- Without `test-command`, the action runs `composer test`, which often includes phpcs and phpstan.
- If `composer.lock` is not committed, also set `cache-dependency-path: composer.json`.
- Other CI systems only need a MySQL service and `composer install && vendor/bin/phpunit`.

The PHP 8.3 floor applies to **every** job that runs `composer install`, linting included, so raise or drop the older PHP rows everywhere. Leave the WordPress version rows alone unless one fails.

### 7. Verify

Run `vendor/bin/phpunit`. It needs MySQL at `localhost` with `root`/`root` and the `wordpress_unit_tests` database (override with `WP_DB_*`). Without MySQL, run `MANTLE_USE_SQLITE=true vendor/bin/phpunit`, which works for most suites but not custom tables or complex SQL. If the project has multisite tests, also run with `WP_MULTISITE=1`. Set `MANTLE_TESTING_DEBUG=1` to debug installation. WordPress installs to `/tmp/wordpress` (`WP_CORE_DIR`) by default. If other projects share that directory, point `WP_CORE_DIR` somewhere else.

Count the tests before you start (`grep -r "function test" tests | wc -l`, plus data-provider rows) and compare with PHPUnit's `Tests:` total. A drop usually means a file was not renamed to `*Test.php` or a data provider lost its attribute.

When a test still fails, trace it to its cause before you report it. If the cause is in the code under test (stale static caches, missing registrations) and not in the harness, the suite is migrated. Leave the test failing, and tell the user which test fails, the root cause with `file:line`, and why the harness isn't involved.

## Common Mistakes

- **Keeping `test-*.php` names.** PHPUnit 10+ ignores the class or errors. Rename to `*Test.php`.
- **Leaving `wpSetUpBeforeClass()` in place.** No error, just missing fixtures and confusing failures.
- **Fixing plugin bugs, bumping unrelated dependencies, or rewriting tests that pass.** Keep the diff to the harness and list everything else for the user.
- **Calling a run with fewer tests "passing".** Check the count.
- **Switching whole projects to SQLite to make CI pass.** SQLite is a local fallback. CI should use MySQL.
