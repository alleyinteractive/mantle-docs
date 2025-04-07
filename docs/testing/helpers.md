---
title: "Testing: Helpers"
sidebar_label: Helpers
description: Helpers to make it easier to write tests for your project.
---

# Helpers

Mantle provides some testing helpers to make it easier to write tests for your
project.

## HTML String

The `Mantle\Testing\html_string` helper is used to create a DOMDocument object
from an HTML string. This can be useful when you need to test a function that
returns HTML output and want to make assertions about the generated HTML. You
can use the same methods as the [Element Assertions](./requests.md#element-assertions)
feature to make assertions about the HTML string.

```php
use Mantle\Testing\html_string;

html_string(
  '
	<div>
		<section>Example Section</section>
		<div class="test-class">Example Div By Class</div>
		<div id="test-id">Example Div By ID</div>
		<ul>
			<li>Item 1</li>
			<li>Item 2</li>
			<li data-testid="test-item">Item 3</li>
		</ul>
	</div>
  '
)
  ->assertContains( 'Example Section' )
  ->assertElementExists( '//section' )
  ->assertQuerySelectorExists( 'section' )
  ->assertElementExistsById( 'test-id' )
  ->assertElementExistsByTestId( 'test-item' );
```

The HTML string helper returns a [HTML](../features/support/html.mdx) object.

## Getting Output

`\Mantle\Testing\Utils::get_echo()` is a replacement for the core WordPress test suite's [`get_echo()` function](https://github.com/WordPress/wordpress-develop/blob/cf5898957e68d4d9fa63b5e89e2bee272391aa92/tests/phpunit/includes/utils.php#L432-L436). It takes a callable, starts an output buffer, calls the given callable, and returns the contents of the output buffer. Example:

```php
use Mantle\Testing\Utils;

$demo   = Utils::get_echo( fn ( $subject ) => echo "Hello {$subject}!", 'world' );
$title  = Utils::get_echo( 'the_title' );
$method = Utils::get_echo( [ 'My_Class', 'method_that_outputs' ] );
```
