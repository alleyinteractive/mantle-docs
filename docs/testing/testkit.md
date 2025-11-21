---
title: "Testing: Mantle Testkit"
sidebar_label: Testkit
description: Mantle Testkit is a standalone package for using the Mantle Testing Framework on non-Mantle based projects.
---

# Testing: Mantle Testkit

Mantle Testkit is a standalone package for using the
[Mantle Testing Framework](./index.mdx) on non-Mantle based projects.
That means that you can use the great features of the Mantle Testing Framework
on your existing projects/plugins/themes without needing to do any more refactoring.

This document acts as a guide to transitioning your project to using
[Mantle Testkit](./testkit.md) for use of the Mantle Testing Library outside of Mantle.

:::info
Testkit should only be used on projects that do not use or define a Mantle
application.
:::

## Getting Started

This guide assumes that you are working within a `wp-content/`-rooted WordPress
project.

### Install `mantle-framework/testkit` as a dependency

```bash
composer require --dev mantle-framework/testkit
```

### Change Test Case

Unit Tests should extend themselves from Testkit's `Mantle\Testkit\TestCase` class
in place of core's `WP_UnitTestCase` class.

```diff
use Mantle\Testkit\TestCase;

-abstract class ExampleTest extends WP_UnitTestCase {
+abstract class ExampleTest extends TestCase {

	public function test_example() {
		$this->go_to( home_url( '/' ) );
		$this->assertQueryTrue( 'is_home', 'is_archive' );
	}

	public function test_factory() {
		$post = static::factory()->post->create_and_get(); // WP_Post.

		// ...
	}
}
```

### Adjusting Unit Test Bootstrap

Commonly unit tests live inside of plugins or themes. For this use case, we're
going to adjust a theme's unit test bootstrap file to load the test framework.
Mantle will already be loaded from PHPUnit.

```php title="tests/bootstrap.php"
/**
 * Testing using Mantle Framework
 */

// Install Mantle Testing Framework normally with no modifications.
\Mantle\Testing\install();
```

If you need to customize the installation of the Testing Framework (e.g.,
setting the theme, adding plugins, etc.), you can use the Installation Manager:

```php title="tests/bootstrap.php"
/**
 * Testing using Mantle Framework
 */

\Mantle\Testing\manager()
	->before( ... )
	->after( ... )
	->theme( 'twentytwenty' )
	->loaded( function() {
		// The loaded callback is fired on 'muplugins_loaded'.
		// You can use this callback to load the main file of a plugin, theme, etc.

		// Setup any dependencies once WordPress is loaded...
	}
);
```

For more information, read more about the [Installation Manager](./installation-manager.md).

### Running Tests

Run your tests using `./vendor/bin/phpunit` or add a Composer script to allow
for `composer phpunit`. You do not need any additional bash script to run the tests.
