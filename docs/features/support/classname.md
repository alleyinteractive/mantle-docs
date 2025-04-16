---
description: A classname helper function for generating CSS class names based on various conditions and inputs.
---

# Classname

Mantle provides a `classname` helper function designed to simplify the generation of CSS class
names. This function operates similarly to the popular NPM `classnames` package,
allowing you to dynamically construct class names based on various conditions
and inputs.

## Usage

The `classname` function can be used to generate a class name based on the
provided arguments. The function accepts any number of arguments and will
concatenate them together to form a single class name. The function will ignore
any arguments that are `null`, `false`, or an empty string.

```php
use function Mantle\Support\Helpers\classname;

classname( 'class1', 'class2', 'class3' ); // 'class1 class2 class3'
classname( 'class1', null, 'class3' ); // 'class1 class3'
classname( 'class1', false, 'class3' ); // 'class1 class3'
classname(
  'foo',
  [
    'a-bunch',
    'of-class-names',
    'that-are-valid',
  ],
  // Conditionally add a class name.
  [
    'false' => false,
    'valid' => true,
  ],
); // 'foo a-bunch of-class-names that-are-valid valid'
classname(
  'example',
  [
    'callable-based' => fn () => true,
  ],
); // 'example callable-based'
```

The `the_classnames` method will echo the class names directly to the output
buffer.

```php
use function Mantle\Support\Helpers\the_classnames;

?>
<div class="<?php the_classnames( 'class1', 'class2', 'class3' ); ?>">
  <!-- Your content here -->
</div>
<?php
```