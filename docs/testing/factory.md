---
title: Testing Factory
sidebar_label: Factory
description: Mantle supports a WordPress-core backwards compatible factory that can be used in tests to quickly generate posts, terms, sites, and more.
---
# Testing Factory

Mantle supports a WordPress-core backwards compatible factory that can be used
in tests to quickly generate posts, terms, sites, and more.

The factory supports the creation of the following types of content:

* attachment
* category
* comment
* page
* post
* tag
* term
* user
* blog (if mulitisite)
* network (if multisite)

:::note

The testing factory used by the testing framework is the same factory used by
Mantle's database factory.

For more information on the database factory, see the [Database
Factory](/docs/models/model-factory) documentation.
:::

## Generating Content

All factories function in the same manner and be used to generate one or many
pieces of content:

```php
use Mantle\Testkit\Test_Case as Testkit_Test_Case;

class ExampleTests extends Testkit_Test_Case {

  public function test_factory() {
    static::factory()->post->create_and_get(); // WP_Post
    static::factory()->post->create(); // int
    static::factory()->post->create_many( 10 ); // int[]

    // Supports overriding attributes for a factory.
    static::factory()->post->create( [ 'title' => 'Example Title' ] );

    static::factory()->tag->create_and_get(); // WP_Term
    static::factory()->tag->create(); // int
  }
}
```

For more information on how to generate content with factories, see the
[Model Factory: Generated Content](/docs/models/model-factory#generating-content) documentation.

Factories for custom post types/taxonomies can be instantiated by calling the
relevant post type/taxonomy name when retrieving the factory:

```php
use Mantle\Testkit\Test_Case as Testkit_Test_Case;

class ExampleTests extends Testkit_Test_Case {

  public function test_factory() {
    static::factory()->custom_post_type->create_and_get(); // WP_Post
    static::factory()->custom_post_type->create(); // int
    static::factory()->custom_post_type->create_many( 10 ); // int[]

    static::factory()->custom_taxonomy->create_and_get(); // WP_Term
    static::factory()->custom_taxonomy->create(); // int
  }
}
```

## Generating Blocks

Generating blocks is a common use case when testing WordPress sites that depend
on blocks in different contexts for testing. The `block_factory()` method can be
used to generate blocks for testing:

```php
use Mantle\Testkit\Test_Case as Testkit_Test_Case;

use function Mantle\Testing\block_factory;

class ExampleTests extends Testkit_Test_Case {
  public function test_post_with_block() {
    $post = static::factory()->post->create_and_get( [
      'post_content' => block_factory()->blocks( [
        block_factory()->heading( 'Example Heading' ),
        block_factory()->paragraph( 'Example Paragraph' ),
      ] ),
    ] );

    $block = block_factory()->create_block( 'core/paragraph' );

    $this->assertNotEmpty( $block );
  }
}
```

The Block Factory works with the [Block Faker](../models/model-factory.mdx#generating-blocks-in-factories)
to make it possible to generate blocks in tests with ease.

### Generating Paragraph Blocks

The Block Factory's `paragraph` method can be used to generate a paragraph block
with the specified content or default lorem ipsum content:

```php
use function Mantle\Testing\block_factory;

$block = block_factory()->paragraph();
```

Which would produce the following block:

```html
<!-- wp:paragraph -->
<p>Dolores esse et quam dolores perspiciatis. Ut et et dolor voluptate quia ipsam distinctio. Saepe eum placeat dolor saepe ut cum officia.</p>
<!-- /wp:paragraph -->
```

The text can be overridden by passing a string to the `paragraph` method:

```php
use function Mantle\Testing\block_factory;

$block = block_factory()->paragraph( 'Example Paragraph' );
```

Which would produce the following block:

```html
<!-- wp:paragraph -->
<p>Example Paragraph</p>
<!-- /wp:paragraph -->
```

You can also specify the number of sentences to generate for the paragraph:

```php
use function Mantle\Testing\block_factory;

$block = block_factory()->paragraph( sentences: 5 );
```

### Generating Multiple Paragraph Blocks

The Block Factory's `paragraphs` method can be used to generate multiple
paragraph blocks with the specified content or default lorem ipsum content:

```php
use function Mantle\Testing\block_factory;

$blocks = block_factory()->paragraphs( 3 );
```

### Generating Heading Blocks

The Block Factory's `heading` method can be used to generate a heading block
with the specified content or default lorem ipsum content:

```php
use function Mantle\Testing\block_factory;

$block = block_factory()->heading();
```

Which would produce the following block:

```html
<!-- wp:heading -->
<h2>Dolores esse et quam dolores perspiciatis.</h2>
<!-- /wp:heading -->
```

The text can be overridden by passing a string to the `heading` method:

```php
use function Mantle\Testing\block_factory;

$block = block_factory()->heading( 'Example Heading' );
```

Which would produce the following block:

```html
<!-- wp:heading -->
<h2>Example Heading</h2>
<!-- /wp:heading -->
```

You can also specify the heading level to generate:

```php
use function Mantle\Testing\block_factory;

$block = block_factory()->heading( level: 3 );
```

### Generating Image Blocks

The Block Factory's `image` method can be used to generate an image block with
a default image from picsum.photos:

```php
use function Mantle\Testing\block_factory;

$block = block_factory()->image();
```

Which would produce the following block:

```html
<!-- wp:image -->
<figure class="wp-block-image"><img src="https://picsum.photos/620/383"/></figure>
<!-- /wp:image -->
```

### Generating a Custom Block

The Block Factory's `block` method can be used to generate a custom block
with the specified block name and attributes:

```php
use function Mantle\Testing\block_factory;

$block = block_factory()->block(
  'vendor/block-name',
  'Inner content (if any).',
  [
    'attribute' => 'value',
  ],
);
```

### Generating Sets of Blocks

The Block Factory's `blocks` method can be used to generate a set of blocks:

```php
use function Mantle\Testing\block_factory;

$blocks = block_factory()->blocks( [
  block_factory()->heading( 'Example Heading' ),
  block_factory()->paragraph( 'Example Paragraph' ),
] );
```

Which would produce the following blocks:

```html
<!-- wp:heading {"level":2} -->
<h2>Example Heading</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Example Paragraph</p>
<!-- /wp:paragraph -->
```

### Using Block Presets

Block presets can be used to generate blocks with a specific set of attributes.
This can be useful when a project has a common set of blocks that are used
across multiple tests. For example, a media website may have a post with a
common template of a custom block, a heading, and a paragraph. A block preset
can be created to generate this set of blocks:

```php
use Mantle\Testing\Block_Factory;

Block_Factory::register_preset(
  'article_3_up',
  block_factory()->blocks( [
    block_factory()->block( 'vendor/block-name', '', [
      'attribute' => 'value',
    ] ),
    block_factory()->heading(),
    block_factory()->paragraph(),
  ] ),
);
```

The block preset can then be used in tests:

```php
use function Mantle\Testing\block_factory;

$blocks = block_factory()->preset( 'article_3_up' );

// You can also use a magic method to call it directly.
$blocks = block_factory()->article_3_up();
```

Presets can also be a callable function that returns a set of blocks. The
callable will be passed an instance of the Block Factory:

```php
use Mantle\Testing\Block_Factory;

Block_Factory::register_preset(
  'content_with_video',
  fn ( Block_Factory $factory ) => $factory->blocks( [
    $factory->block( 'vendor/block-name', '', [
      'attribute' => 'value',
    ] ),
    $factory->heading(),
    $factory->paragraph(),
  ] ),
);
```