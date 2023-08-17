---
title: Testkit
---

# Mantle Testkit

Mantle Testkit is a standalone package for using the [Mantle Testing
Framework](./testing.md) on non-Mantle based projects. That means that you can
use the great features of the Mantle Testing Framework on your existing
projects/plugins/themes without needing to do any more refactoring.

This document acts as a guide to transitioning your project to using [Mantle
Testkit](./testkit.md) for use of the Mantle Testing Library outside of Mantle.

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

Unit Tests should extend themselves from Testkit's `Test_Case` class
in place of core's `WP_UnitTestCase` class.

```php
use Mantle\Testkit\Test_Case as Testkit;

class Test_Case extends Testkit {

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

```php
/**
 * Testing using Mantle Framework
 */

// Install Mantle Testing Framework normally.
\Mantle\Testing\install();

// Install Mantle Testing Framework with some callbacks.
\Mantle\Testing\manager()
	->before( ... )
	->after( ... )
	->theme( 'twentytwenty' )
	->loaded( function() {
		// The loaded callback is fired on 'wp_loaded'.
		// You can use this callback to load the main file of a plugin, theme, etc.

		// Setup any dependencies once WordPress is loaded...
	}
);
```

For more information, read more about the [Installation Manager](./installation-manager.md).

### Running Tests

Run your tests using `./vendor/bin/phpunit` or add a Composer script to allow
for `composer phpunit`.
