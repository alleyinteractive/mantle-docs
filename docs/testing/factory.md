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

## Generating Content

All factories function in the same manner and be used to generate one or many
pieces of content:

```php
use Mantle\Testkit\Test_Case as Testkit_Test_Case;

class Test_Case extends Testkit_Test_Case {

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

### Generating Posts/Terms with Meta

Posts and terms can be generated with meta by calling the `with_meta` method on
the factory:

```php
use Mantle\Testkit\Test_Case as Testkit_Test_Case;

class Test_Case extends Testkit_Test_Case {

  public function test_factory() {
    $post_id = static::factory()->post->with_meta(
      [
        'key' => 'value',
      ]
    )->create();

    // ...

    $term_id = static::factory()->tag->with_meta(
      [
        'key' => 'value',
      ]
    )->create();

    // ...
  }
}
```

### Generating Posts with Terms

Posts can be generated with terms by calling the `with_terms` method on the
factory:

```php
use Mantle\Testkit\Test_Case as Testkit_Test_Case;

class Test_Case extends Testkit_Test_Case {

  public function test_factory() {
    $post_id = static::factory()->post->with_terms(
      [
        // Pass in slugs.
        'category' => [ 'cat1', 'cat2' ],

        // Or pass in term IDs.
        'post_tag' => static::factory()->tag->create(),
      ]
    )->create();

    // ...
  }
}
```

## Generating Post with Thumbnail

Posts can be generated with a thumbnail by calling the `with_thumbnail` method
on the post factory:

```php
use Mantle\Testkit\Test_Case as Testkit_Test_Case;

class Test_Case extends Testkit_Test_Case {

  public function test_factory() {
    $post = static::factory()->post->with_thumbnail()->create_and_get();

    // ...
  }
}
```

### Generating an Ordered Set of Posts

Mantle includes a helper to create an ordered set of posts that are evenly
spaced out. This can be useful when trying to populate a page with a set of
posts and want to verify the order of the posts on the page.

```php
use Mantle\Testkit\Test_Case as Testkit_Test_Case;

class Test_Case extends Testkit_Test_Case {

  public function test_create_ordered_set() {
    $post_ids = static::factory()->post->create_ordered_set( 10 );
  }
}
```

The above post IDs are evenly spaced an hour apart starting from a month ago.
The start date and the separation can also be adjusted:

```php
use Carbon\Carbon;
use Mantle\Testkit\Test_Case as Testkit_Test_Case;

class Test_Case extends Testkit_Test_Case {

  public function test_create_ordered_set() {
    $post_ids = static::factory()->post->create_ordered_set(
      10,
      [],
      // Start creating the post a year ago.
      Carbon::now()->subYear(),
      // Spread them out by a day.
      DAY_IN_SECONDS,
    );
  }
}
```