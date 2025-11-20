---
title: "Testing: WordPress State"
sidebar_label: WordPress State
description: During unit tests, the testing framework exposes some helper methods to allow you to modify or inspect the state of WordPress.
---

# Testing: WordPress State

## Introduction

During unit tests, the testing framework exposes some helper methods to allow
you to modify or inspect the state of WordPress. These methods are available on
the default `Test_Case` included with the framework or Testkit. Many of these
methods are used between tests to reset the state of WordPress.

## Preserving Globals

By default, the testing framework will preserve select global variables between
tests. This means that if a test modifies a global variable that manages the
registered post types, the modified state will be reset before the next test
runs.

Let's look at an example:

```php
namespace App\Tests;

use App\Tests\TestCase;

class ExampleTest extends TestCase {
  public static function setUpBeforeClass(): void {
    parent::setUpBeforeClass();

    register_post_type( 'custom', [
      'label' => 'Custom',
    ] );
  }

  public function test_post_type_exists() {
    // The post type 'custom' was registered in setUpBeforeClass. We know it exists for this test case.
    $this->assertTrue( post_type_exists( 'custom' ) );
  }
}
```

In another test case, the `custom` post type will not exist because the
framework resets the registered post types between tests.

```php
namespace App\Tests;

use App\Tests\TestCase;

class AnotherExampleTest extends TestCase {
  public function test_post_type_does_not_exist() {
    // The post type 'custom' does not exist in this test case.
    $this->assertFalse( post_type_exists( 'custom' ) );
  }
}
```

The framework will create a copy of the globals before all tests run and another
after the test's `setUpBeforeClass` method is called. For each test run, the
local copy is restored before the test's `setUp` method is called. After all
tests have run, the original copy is restored.

The following globals are preserved between tests:

- `wp_meta_keys`: Custom meta keys registered via `register_meta()`.
- `wp_post_statuses`: Post statuses registered via `register_post_status()`.
- `wp_post_types`: Post types registered via `register_post_type()`.
- `wp_taxonomies`: Taxonomies registered via `register_taxonomy()`.

If you'd like to disable the global preservation for a specific test case, you
can use the `Mantle\Testing\Attributes\DisableGlobalPreservation` attribute on
your test class or method.

## Updating the Post Modified Time

The `update_post_modified` method can be used to update the `post_modified` time
for a post. This method accepts the post ID and the new timestamp to use.

```php
namespace App\Tests;

class Example_Test extends TestCase {
  public function test_update_post_modified() {
    $post_id = $this->factory()->post->create();

    $this->update_post_modified( $post_id, '2019-01-01 00:00:00' );

    $post = get_post( $post_id );

    $this->assertEquals( '2019-01-01 00:00:00', $post->post_modified );
  }
}
```

## Reset Post Statuses

The `reset_post_statuses` method can be used to reset the post statuses to their
default values.

```php
namespace App\Tests;

class Example_Test extends TestCase {
  public function test_reset_post_statuses() {
    register_post_status( 'custom', [
      'label' => 'Custom',
    ] );

    $this->reset_post_statuses();

    $this->assertFalse( get_post_status_object( 'custom' ) );
  }
}
```

## Reset Post Types

The `reset_post_types` method can be used to reset the post types to their
default values.

```php
namespace App\Tests;

class Example_Test extends TestCase {
  public function test_reset_post_types() {
    register_post_type( 'custom', [
      'label' => 'Custom',
    ] );

    $this->reset_post_types();

    $this->assertFalse( get_post_type_object( 'custom' ) );
  }
}
```

## Reset Taxonomies

The `reset_taxonomies` method can be used to reset the taxonomies to their
default values.

```php
namespace App\Tests;

class Example_Test extends TestCase {
  public function test_reset_taxonomies() {
    register_taxonomy( 'custom', 'post', [
      'label' => 'Custom',
    ] );

    $this->reset_taxonomies();

    $this->assertFalse( get_taxonomy( 'custom' ) );
  }
}
```

## Flushing Cache

The `flush_cache` method can be used to flush the WordPress object cache. This
method is called automatically between tests.

```php
namespace App\Tests;

class Example_Test extends TestCase {
  public function test_flush_cache() {
    wp_cache_set( 'foo', 'bar' );

    $this->flush_cache();

    $this->assertFalse( wp_cache_get( 'foo' ) );
  }
}
```

## Deleting User

The `delete_user` method can be used to delete a user. This method accepts the
user ID to delete.

```php
namespace App\Tests;

class Example_Test extends TestCase {
  public function test_delete_user() {
    $user_id = $this->factory()->user->create();

    $this->delete_user( $user_id );

    $this->assertFalse( get_user_by( 'id', $user_id ) );
  }
}
```

## Setting Front Page / Blog Page

The `set_show_posts_on_front()` and `set_show_page_on_front()` methods can be
used to set the front page display settings. This mirrors what is controlled in
WordPress via `Settings > Reading`.

```php
namespace App\Tests;

class Example_Test extends Test_Case {
  public function test_front_page_shows_posts() {
    $this->set_show_posts_on_front();

    $this->assertEquals( 'posts', get_option( 'show_on_front' ) );

    // Create a post.
    $post = static::factory()->post->create_and_get();

    // Verify that the front page shows the latest posts.
    $this->get( '/' )->assertSee( $post->post_title );
  }

  public function test_front_page_shows_a_specific_page() {
    $page = $this->factory()->page->create_and_get();

    $this->set_show_page_on_front( front: $page );

    // Verify that the front page shows the specific page.
    $this->get( '/' )->assertQueriedObject( $page );
  }

  public function test_front_page_shows_a_specific_page_with_separate_posts_page(): void {
    $page       = $this->factory()->page->create_and_get();
    $posts_page = $this->factory()->page->create_and_get();

    $this->set_show_page_on_front( front: $page, posts: $posts_page );

    // Verify that the front page shows the specific page.
    $this->get( '/' )
      ->assertQueriedObject( $page )
      ->assertQueryTrue( 'is_front_page', 'is_page', 'is_singular' );

    // Verify that the posts page shows the latest posts.
    $this->get( get_permalink( $posts_page ) )
      ->assertQueriedObject( $posts_page )
      ->assertQueryTrue( 'is_home' ); // is_home is true for the posts page.
  }
}
```
