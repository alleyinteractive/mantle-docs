# Testkit

[[toc]]

Mantle Testkit is a standalone package for use of the [Mantle Testing
Framework](./test-framework.md) on non-Mantle based projects. That means that
you can use the great features of the Mantle Testing Framework on your existing
projects/plugins/themes without needing to do any more refactoring.

Testkit should only be used on projects that do not use or define a Mantle
application. The project can still utilize [other components from
Mantle](https://github.com/mantle-framework) outside of testkit.

This document acts as a guide to transitioning your project to using [Mantle
Testkit](./testkit.md) for use of the Mantle Testing Library outside of Mantle.

::: tip Want to see a `/wp-content/`-rooted project that is using Mantle?

If you're interested in seeing a `/wp-content/`-rooted project that is setup to
use Mantle, checkout
[`alleyinteractive/create-mantle-app`](https://github.com/alleyinteractive/create-mantle-app).
:::
## Getting Started

This guide assumes that we are in a `wp-content/` rooted WordPress project.

### Install `mantle-framework/testkit` as a dependency

```bash
composer require --dev mantle-framework/testkit
```

### Change Test Case

Unit Tests should extend themselves from Testkit's `Test_Case` class
in place of core's `WP_UnitTestCase` class.

```php
use Mantle\Testkit\Test_Case as Testkit_Test_Case;

class Test_Case extends Testkit_Test_Case {

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

::: tip
The callback to `install()` is optional.
:::

```php
/**
 * Theme Testing using Mantle Framework
 */

namespace App\Tests;

// Install Mantle Testing Framework normally.
\Mantle\Testing\install();

// Install Mantle Testing Framework with some callbacks.
\Mantle\Testing\manager()
	->before( ... )
	->after( ... )
	->loaded( function() {
		// The loaded callback is fired on 'wp_loaded'.
		// You can use this callback to load the main file of a plugin, theme, etc.

		// Setup any dependencies once WordPress is loaded, such as themes.
		switch_theme( 'twentytwenty' );
	}
);
```

### Running Tests

Run your tests using `./vendor/bin/phpunit` or add a Composer script to allow
for `composer phpunit`.
