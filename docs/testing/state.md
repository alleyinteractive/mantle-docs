---
title: "Testing: WordPress State"
sidebar_label: WordPress State
description: During unit tests, the testing framework exposes some helper methods to allow you to modify or inspect the state of WordPress.
---

# WordPress State

## Introduction

During unit tests, the testing framework exposes some helper methods to allow
you to modify or inspect the state of WordPress. These methods are available on
the default `Test_Case` included with the framework or Testkit. Many of these
methods are used between tests to reset the state of WordPress.

## Setting Permalink Structure

The WordPress permalink structure can be quickly changed using the `set_permalink_structure`
method. This method accepts a string that represents the permalink structure to
use. The method will automatically flush the rewrite rules after setting the
structure.

By default the permalink structure of `/%year%/%monthnum%/%day%/%postname%/` is used.

```php
namespace App\Tests;

use App\Tests\Test_Case;

class Example_Test extends Test_Case {
  public function test_permalink_structure() {
    $this->set_permalink_structure( '/%postname%/' );

    // ...
  }
}
```

## Updating the Post Modified Time

The `update_post_modified` method can be used to update the `post_modified` time
for a post. This method accepts the post ID and the new timestamp to use.

```php
namespace App\Tests;

use App\Tests\Test_Case;

class Example_Test extends Test_Case {
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

use App\Tests\Test_Case;

class Example_Test extends Test_Case {
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

use App\Tests\Test_Case;

class Example_Test extends Test_Case {
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

use App\Tests\Test_Case;

class Example_Test extends Test_Case {
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

use App\Tests\Test_Case;

class Example_Test extends Test_Case {
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

use App\Tests\Test_Case;

class Example_Test extends Test_Case {
  public function test_delete_user() {
    $user_id = $this->factory()->user->create();

    $this->delete_user( $user_id );

    $this->assertFalse( get_user_by( 'id', $user_id ) );
  }
}
```
