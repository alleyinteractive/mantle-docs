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