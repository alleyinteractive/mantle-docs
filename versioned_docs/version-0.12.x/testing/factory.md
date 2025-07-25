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
Factory](../models/model-factory.mdx) documentation.
:::

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

For more information on how to generate content with factories, see the
[Model Factory: Generated Content](../models/model-factory.mdx#generating-content) documentation.
