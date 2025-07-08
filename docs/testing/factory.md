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
* Co-Authors Plus guest authors (if available)
* Byline Manager profiles (if available)

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
use Mantle\Testkit\TestCase as Testkit_Test_Case;

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
use Mantle\Testkit\TestCase as Testkit_Test_Case;

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
use Mantle\Testkit\TestCase as Testkit_Test_Case;

use function Mantle\Testing\block_factory;

class ExampleTests extends Testkit_Test_Case {
  public function test_post_with_block() {
    // Create a post with a heading and paragraph block.
    $post = static::factory()->post->create_and_get( [
      'post_content' => block_factory()->blocks( [
        block_factory()->heading( 'Example Heading' ),
        block_factory()->paragraph( 'Example Paragraph' ),
      ] ),
    ] );

    // ...
  }
}
```

The Block Factory works with the [Block Faker](../models/model-factory.mdx#generating-blocks-in-factories)
to make it possible to generate blocks in tests with ease.

### Generating Paragraph Blocks

The Block Factory's `block_factory()->paragraph()` method can be used to generate a paragraph block
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

The Block Factory's `block_factory()->paragraphs()` method can be used to generate multiple
paragraph blocks with the specified content or default lorem ipsum content:

```php
use function Mantle\Testing\block_factory;

$blocks = block_factory()->paragraphs( 3 );
```

### Generating Heading Blocks

The Block Factory's `block_factory()->heading()` method can be used to generate a heading block
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

The Block Factory's `block_factory()->image()` method can be used to generate an image block with
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

use function Mantle\Testing\block_factory;

Block_Factory::register_preset(
  name: 'article_3_up',
  preset: block_factory()->blocks( [
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
  name: 'content_with_video',
  preset: fn ( Block_Factory $factory ) => $factory->blocks( [
    $factory->block( 'vendor/block-name', '', [
      'attribute' => 'value',
    ] ),
    $factory->heading(),
    $factory->paragraph(),
  ] ),
);
```

The preset callback will forward any arguments passed to the preset method:

```php
use function Mantle\Testing\block_factory;

Block_Factory::register_preset(
  name: 'content_with_video',
  preset: fn ( Block_Factory $factory, string $url ) => $factory->blocks( [
    $factory->block( 'vendor/block-name', '', [
      'attribute' => 'value',
      'url'       => $url, // The passed argument.
    ] ),
    $factory->heading(),
    $factory->paragraph(),
  ] ),
);
```

## Generating Co-Authors Plus Guest Authors

The factory supports the generation of [Co-Authors Plus](https://wordpress.org/plugins/co-authors-plus/)
Guest Authors if the plugin is available:

```php
use Mantle\Testkit\TestCase as Testkit_Test_Case;

class ExampleTests extends Testkit_Test_Case {
  public function test_create_guest_author(): void {
		$author = static::factory()->cap_guest_author->create_and_get();

		$this->assertInstanceOf( stdClass::class, $author );
		$this->assertNotEmpty( $author->display_name );
		$this->assertNotEmpty( get_post_meta( $author->ID, 'cap-first_name', true ) );
		$this->assertNotEmpty( get_post_meta( $author->ID, 'cap-last_name', true ) );
	}
}
```

You can also pass along data to the factory to override the default values:

```php
use Mantle\Testkit\TestCase as Testkit_Test_Case;

class ExampleTests extends Testkit_Test_Case {
  public function test_create_guest_author(): void {
    $author = static::factory()->cap_guest_author->create_and_get( [
      'display_name' => 'John Doe',
      'first_name'   => 'John',
      'last_name'    => 'Doe',
    ] );

    $this->assertInstanceOf( stdClass::class, $author );
    $this->assertSame( 'John Doe', $author->display_name );
    $this->assertSame( 'John', get_post_meta( $author->ID, 'cap-first_name', true ) );
    $this->assertSame( 'Doe', get_post_meta( $author->ID, 'cap-last_name', true ) );
  }
}
```

A guest author can be linked to a WordPress user and inherit data from that user:

```php
use Mantle\Testkit\TestCase as Testkit_Test_Case;

class ExampleTests extends Testkit_Test_Case {
  public function test_create_guest_author_linked(): void {
		$user   = static::factory()->user->create_and_get();
		$author = static::factory()->cap_guest_author->with_linked_user( $user->ID )->create_and_get();

    // ...
  }
}
```

You can create content with a guest author as the author of a post (supports
passing a guest author or a WordPress user):

```php
use Mantle\Testkit\TestCase as Testkit_Test_Case;

class ExampleTests extends Testkit_Test_Case {
  public function test_create_post_with_guest_author(): void {
    $author = static::factory()->cap_guest_author->create_and_get();
    $post   = static::factory()->post->with_cap_authors( $author )->create_and_get();

    // ...
  }
}
```

## Generating Byline Manager Profiles

The factory supports the generation of [Byline Manager](https://github.com/alleyinteractive/byline-manager)
profiles posts with bylines:

```php
use Mantle\Testkit\TestCase as Testkit_Test_Case;

class ExampleTests extends Testkit_Test_Case {
  public function test_create_byline_manager_profile(): void {
    $profile = static::factory()->byline_manager_profile->create_and_get();

    $this->assertInstanceOf( WP_Post::class, $profile );

    // ...
  }
}
```

You can also pass along data to the factory to override the default values:

```php
use Mantle\Testkit\TestCase as Testkit_Test_Case;

class ExampleTests extends Testkit_Test_Case {
  public function test_create_byline_manager_profile(): void {
    $profile = static::factory()->byline_manager_profile->create_and_get( [
      'display_name' => 'John Doe',
    ] );

    // ...
  }
}
```

A profile can be linked to a WordPress user and inherit data from that user:

```php
use Mantle\Testkit\TestCase as Testkit_Test_Case;

class ExampleTests extends Testkit_Test_Case {
  public function test_create_byline_manager_profile_linked(): void {
    $user    = static::factory()->user->create_and_get();
    $profile = static::factory()->byline_manager_profile->with_linked_user( $user->ID )->create_and_get();

    // ...
  }
}
```

You can create content with a byline manager profile as the author of a post.
This method supports a Byline Manager profile, WordPress user, or a string
byline (with no linked user or profile):

```php
use Mantle\Testkit\TestCase as Testkit_Test_Case;

class ExampleTests extends Testkit_Test_Case {
  public function test_create_post_with_byline_manager_profile(): void {
    $profile = static::factory()->byline_manager_profile->create_and_get();
    $post    = static::factory()->post->with_byline( $profile )->create_and_get();

    // ...
  }

  public function test_create_post_with_byline_manager_profile_and_text_byline(): void {
    $profile = static::factory()->byline_manager_profile->with_linked_user( $user->ID )->create_and_get();
    $post    = static::factory()->post->with_byline( $profile, $user, 'Another Person' )->create_and_get();

    // ...
  }
}
```