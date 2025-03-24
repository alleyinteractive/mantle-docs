---
sidebar_label: HTML
---

# HTML Parsing, Assertions, and Manipulation

The `HTML` class provides methods to query, manipulate, and assert against HTML
strings and documents. It is built on top of the [`DomCrawler` component from
Symfony](https://symfony.com/doc/current/components/dom_crawler.html), which
provides a powerful and flexible way to work with HTML.

## Usage

The HTML class can be instantiated with the `HTML` class or by using the `html()` helper function.

```php
use Mantle\Support\HTML;

use function Mantle\Support\Helpers\html_string;

$html = new HTML( '<div id="test">Hello World</div>' );

// Or using the helper function.
$html = html_string( '<div id="test">Hello World</div>' );
```

The HTML class supports being passed a HTML string, document, `DOMDocument`,
`DOMNode`, or `DOMNodeList`. It will parse the HTML using `DOMDocument`.

### Filtering

The HTML class provides methods to filter nodes based on various criteria, such as
ID, class name, tag name, and custom selectors.

#### Query Selector

```php
use function Mantle\Support\Helpers\html_string;

$html = <<<'HTML'
<div id="test">
    <p class="example">Hello World</p>
    <p class="example">Hello Universe</p>
</div>
HTML;

$elements = html_string( $html )->get_by_selector( '.example' );

foreach ( $elements as $element ) {
    echo $element->text(); // Outputs: Hello World, Hello Universe
}
```

You can also retrieve the first element that matches a specific selector using
the `first_by_selector` method.

```php
$element = html_string( $html )->first_by_selector( '.example' );
echo $element->text(); // Outputs: Hello World
```

#### XPath

```php
use function Mantle\Support\Helpers\html_string;

$html = <<<'HTML'
<div id="test">
    <p class="example">Hello World</p>
    <p class="example">Hello Universe</p>
</div>
HTML;

// Multiple elements.
$elements = html_string( $html )->get_by_xpath( '//p[@class="example"]' );

// Single element.
$element = html_string( $html )->first_by_xpath( '//p[@class="example"]' );
```

#### ID / Tag / Test ID

You can also retrieve elements by their ID, tag name, or test ID using the
`first_by_id`, `first_by_tag`, and `first_by_testid` methods respectively.

```php
use function Mantle\Support\Helpers\html_string;

$html = <<<'HTML'
<div id="test">
    <p class="example">Hello World</p>
    <p class="example">Hello Universe</p>
</div>
HTML;

// Retrieve by ID.
$element = html_string( $html )->first_by_id( 'test' );

// Retrieve by tag name.
$element = html_string( $html )->first_by_tag( 'p' );

// Retrieve by test ID.
$element = html_string( $html )->first_by_testid( 'test' );
```

There are also `get_by_*` versions of these methods that return all matching
elements.

```php
use function Mantle\Support\Helpers\html_string;

$html = <<<'HTML'
<div id="test">
    <p class="example">Hello World</p>
    <p class="example">Hello Universe</p>
</div>
HTML;

// Retrieve all elements by tag name.
$elements = html_string( $html )->get_by_tag( 'p' );

// Retrieve all elements by test ID.
$elements = html_string( $html )->get_by_testid( 'test' );
```

### Traversing and Looping

The HTML class is iterable, allowing you to loop through the nodes it contains.

```php
use function Mantle\Support\Helpers\html_string;

$html = <<<'HTML'
<div id="test">
    <p class="example">Hello World</p>
    <p class="example">Hello Universe</p>
</div>
HTML;

$elements = html_string( $html )->get_by_selector( '.example' );

foreach ( $elements as $element ) {
  // $element is a instanceof the `HTML` class.
  echo $element->text(); // Outputs: Hello World, Hello Universe
}
```

Access node by its position on the list:

```php
$crawler->filter( 'body > p' )->eq( 0 );
```

Get the first or last node of the current selection:

```php
$crawler->filter( 'body > p' )->first();
$crawler->filter( 'body > p' )->last();
```

Get the nodes of the same level as the current selection:

```php
$crawler->filter( 'body > p' )->siblings();
```

Get the same level nodes after or before the current selection:

```php
$crawler->filter( 'body > p' )->nextAll();
$crawler->filter( 'body > p' )->previousAll();
```

Get all the child or ancestor nodes:

```php
$crawler->filter( 'body' )->children();
$crawler->filter( 'body > p' )->ancestors();
```

Get all the direct child nodes matching a CSS selector:

```php
$crawler->filter( 'body' )->children( 'p.lorem' );
```

Get the first parent (heading toward the document root) of the element that matches the provided selector:

```php
$crawler->closest( 'p.lorem' );
```

### Accessing Node Values

You can access the text content of a node using the `tag_name()`, `text()`, or
`innerText()` methods.

```php
use function Mantle\Support\Helpers\html_string;

$html = <<<'HTML'
<div id="test">
    <p class="example">Hello World</p>
    <p class="example">Hello Universe</p>
</div>
HTML;

$element = html_string( $html )->first_by_selector( '.example' );

// Tag name.
echo $element->tag_name(); // Outputs: 'p'.

// Text content.
echo $element->text(); // Outputs: 'Hello World'.
```

You can also retrieve the attributes of a node using the `get_attribute()` method.

```php
use function Mantle\Support\Helpers\html_string;

$html = <<<'HTML'
<div id="test" class="example">
    <p class="example" data-example="1234">Hello World</p>
</div>
HTML;

$html = html_string( $html );

// Get attribute value.
$html->first_by_id( 'test' )->get_attribute( 'class' ); // Outputs: 'example'.
$html->first_by_selector( '.example' )->get_attribute( 'data-example' ); // Outputs: '1234'.
$html->first_by_selector( '.example' )->get_data( 'example' ); // Outputs: '1234'.
```

### Modifying Node Values

You can modify the attributes, classes, and content of nodes using the
`modify()` method of the HTML class as well as other methods to mutate the
element's contents, attributes, etc.

```php
use Mantle\Support\HTML;

use function Mantle\Support\Helpers\html_string;

$html = <<<'HTML'
<div id="test">
    <p class="example">Hello World</p>
    <p class="example">Hello Universe</p>
</div>
HTML;

$html = html_string( $html );

$html->filter( 'p' )->modify( function ( HTML $node ) {
  // Add a class to all <p> elements.
  $node->add_class( 'modified' );
} );

// You can also replace the entire contents of a node.
$html->filter( 'p' )->modify(
  fn ( HTML $node ) => "<span>New content</span>"
);
```

## Methods

The following methods are included with HTML:

### Retrieving Nodes

#### `filter/get_by_selector`

```php
use function Mantle\Support\Helpers\html_string;

$html = <<<'HTML'
<div id="test">
    <p class="example">Hello World</p>
    <p class="example">Hello Universe</p>
</div>
HTML;

$elements = html_string( $html )->filter( '.example' );
$elements = html_string( $html )->get_by_selector( '.example' );
```

#### `first_by_id`

```php
use function Mantle\Support\Helpers\html_string;

$html = <<<'HTML'
<div id="test">
    <p class="example">Hello World</p>
    <p class="example">Hello Universe</p>
</div>
HTML;

$element = html_string( $html )->first_by_id( 'test' );
```

#### `first_by_selector`

```php
use function Mantle\Support\Helpers\html_string;

$html = <<<'HTML'
<div id="test">
    <p class="example">Hello World</p>
    <p class="example">Hello Universe</p>
</div>
HTML;

$element = html_string( $html )->first_by_selector( '.example' );
```

#### `first_by_tag`

```php
use function Mantle\Support\Helpers\html_string;

$html = <<<'HTML'
<div id="test">
    <p class="example">Hello World</p>
    <p class="example">Hello Universe</p>
</div>
HTML;

$element = html_string( $html )->first_by_tag( 'p' );
```

#### `first_by_testid`

```php
use function Mantle\Support\Helpers\html_string;

$html = <<<'HTML'
<div id="test">
    <p class="example" data-testid="example">Hello World</p>
    <p class="example">Hello Universe</p>
</div>
HTML;

$element = html_string( $html )->first_by_testid( 'example' );
```

#### `first_by_xpath`

```php
use function Mantle\Support\Helpers\html_string;

$html = <<<'HTML'
<div id="test">
    <p class="example">Hello World</p>
    <p class="example">Hello Universe</p>
</div>
HTML;

$element = html_string( $html )->first_by_xpath( '//p[@class="example"]' );
```

#### `get_by_tag`

```php
use function Mantle\Support\Helpers\html_string;

$html = <<<'HTML'
<div id="test">
    <p class="example">Hello World</p>
    <p class="example">Hello Universe</p>
</div>
HTML;

$elements = html_string( $html )->get_by_tag( 'p' );
```

#### `get_by_testid`

```php
use function Mantle\Support\Helpers\html_string;

$html = <<<'HTML'
<div id="test">
    <p class="example" data-testid="example">Hello World</p>
    <p class="example">Hello Universe</p>
</div>
HTML;

$elements = html_string( $html )->get_by_testid( 'example' );
```

#### `get_by_xpath`

```php
use function Mantle\Support\Helpers\html_string;

$html = <<<'HTML'
<div id="test">
    <p class="example">Hello World</p>
    <p class="example">Hello Universe</p>
</div>
HTML;

$elements = html_string( $html )->get_by_xpath( '//p[@class="example"]' );
```

### Modifying Nodes

modify( callable $callback ): static
set_attribute( string $name, string $value ): static
set_data
remove_attribute
remove_data
get_data
add_class
remove_class
has_class
has_any_class
remove
prepend
append
after
before
next_until
previous_until
wrap
wrap_all
wrap_inner

### Node Information

tag_name
empty
has_nodes
dump
function dd

### Assertions
assertElementExists( string $expression, ?string $message = null )
assertElementExistsById( string $id )
assertElementExistsByClassName( string $classname )
assertElementMissing( string $expression, ?string $message = null )
assertElementMissingById( string $id )
assertElementMissingByClassName( string $classname )
assertElementExistsByTagName( string $type )
assertElementMissingByTagName( string $type )
assertElementExistsByQuerySelector( string $selector )
assertQuerySelectorExists( string $selector )
assertElementMissingByQuerySelector( string $selector )
assertQuerySelectorMissing( string $selector )
assertElementCount( string $expression, int $expected )
assertQuerySelectorCount( string $selector, int $expected )
assertElementExistsByTestId( string $test_id )
assertElementMissingByTestId( string $test_id )
assertElement( string $expression, callable $assertion, bool $pass_any = false )
assertQuerySelector( string $selector, callable $assertion, bool $pass_any = false )
assertContains( string $needle, ?int $count = null )
assertNotContains( string $needle )