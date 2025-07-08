# Models

<div className="lead">
Models provide a fluent way to interface with objects in WordPress. Models can
be either a post type, a term, or a subset of a post type. They represent a data
object inside of your application. Models can also allow dynamic registration of
a post type, REST API fields, and more. To make life easier for developers,
Mantle models were designed with uniformity and simplicity in mind.
</div>

:::tip
The Mantle Framework is not required to use Mantle models or the
[query builder](./query-builder.md). You can require the package in your
application with Composer and use the models and query builder in your application.

```bash
composer require mantle-framework/database
```
:::

## Supported Model Types

The common data structures in WordPress are supported as models:

Data Type | Model Class
--------- | -----------
Attachment | `Mantle\Database\Model\Attachment`
Comment | `Mantle\Database\Model\Comment`
Post | `Mantle\Database\Model\Post`
Site | `Mantle\Database\Model\Site`
Term | `Mantle\Database\Model\Term`
User | `Mantle\Database\Model\User`

## Generating a Model

Models can be generated through the command:

```bash
bin/mantle make:model <name> --model_type=<model_type> [--registrable] [--object_name] [--label_singular] [--label_plural]
```

## Defining a Model

Models live in the `app/models` folder under the `App\Models` namespace.

### Example Post Model

```php
/**
 * Example_Model class file.
 *
 * @package App\Models
 */

namespace App\Models;

use Mantle\Database\Model\Post;

/**
 * Example_Model Model.
 */
class Example_Model extends Post {
  /**
   * Post Type
   *
   * @var string
   */
  public static $object_name = 'example-model';
}
```

### Example Term Model

```php
/**
 * Example_Model class file.
 *
 * @package App\Models
 */

namespace App\Models;

use Mantle\Database\Model\Term;

/**
 * Example_Model Model.
 */
class Example_Model extends Term {
  /**
   * Term Type
   *
   * @var string
   */
  public static $object_name = 'example-model';
}
```

## Creating a Dynamic Model

A dynamic model is a model that is not defined in the application but is
created on the fly. This is useful for creating a model for a post type that
isn't defined in the application.

Once the dynamic model is created, it can be used like any other model in the
application.

```php
use Mantle\Database\Model\Post;

$model = Post::for( 'my-custom-post-type' );

// Create a new instance of the model.
$instance = $model->create( [ 'title' => 'Example Title' ] );

// Query the model.
$results = $model->where( 'post_status', 'publish' )->get();
```

## Interacting with Models

Setting/updating data with a model can be done using the direct attribute name
you wish to update or a handy alias (see [Core Object](#core-object)).

```php
$post->content = 'Content to set.';

// is the same as...
$post->post_content = 'Content to set.';

// Save the post.
$post->save();
```

### Field Aliases

#### Post Aliases


Alias | Field
----- | -----
`content` | `post_content`
`date` | `post_date`
`date_gmt` | `post_date_gmt`
`modified` | `post_modified`
`modified_gmt` | `post_modified_gmt`
`description` | `post_excerpt`
`id` | `ID`
`title` | `post_title`
`name` | `post_title`
`slug` | `post_name`
`status` | `post_status`

#### Term Aliases

Alias | Field
----- | -----
`id` | `term_id`

### Saving/Updating Models

The `save()` method on the model will store the data for the respective model.
It also supports an array of attributes to set for the model before saving.

```php
$post->content = 'Content to set.';
$post->save();

$post->save( [ 'content' => 'Fresher content' ] );
```

### Deleting Models

The `delete()` method on the model will delete the model. On `Post` models, the
delete method will attempt to trash the post if the post type supports it. You
can pass `$force = true` to bypass that.

```php
// Force to delete it.
$post->delete( true );

$term->delete();
```

### Interacting with Dates

Post models support setting both the published and modified dates. The dates are
expected to be datetime strings.

```php
$post->created = '2021-01-01 12:00:00';
$post->modified = '2021-01-01 12:00:00';

// Save the post.
$post->save();
```

You can also retrieve and set the dates as `Carbon`/`DateTimeInterface` objects
using the `dates` attribute.

```php
use Carbon\Carbon;

// Retrieve the created date.
$created = $post->dates->created; // Carbon\Carbon
$created_gmt = $post->dates->created_gmt; // Carbon\Carbon

// Retrieve the modified date.
$modified = $post->dates->modified; // Carbon\Carbon
$modified_gmt = $post->dates->modified_gmt; // Carbon\Carbon

// Set the created date as a Carbon object.
$post->dates->created = now()->subDay();

// Set the created date as a string.
$post->dates->created = '2021-01-01 12:00:00';

// Save the post.
$post->save();
```

You can get/set the published date using the `created` attribute and the
modified date using the `modified` attribute.

### Interacting with Meta

The `Post`, `Term`, and `User` model types support setting meta easily. Models
support a fluent way of setting meta using the `meta` attribute. The meta will
be queued for saving and saved once you call the `save()` method on the model:

```php
use App\Models\Post;

$model = Post::factory()->create();

// Retrieve meta value.
$value = $model->meta->meta_key; // mixed

// Update a meta value as an attribute.
$model->meta->meta_key = 'meta-value';
$model->save();

// Delete a meta key.
unset( $model->meta->meta_key );
$model->save();
```

The same syntax is supported for interacting with meta as an array (no
preference to use one over the other):

```php
use App\Models\Post;

$model = Post::factory()->create();

// Retrieve meta value.
$value = $model->meta['meta_key']; // mixed

// Update a meta value as an attribute.
$model->meta['meta_key'] = 'meta-value';
$model->save();

// Delete a meta key.
unset( $model->meta['meta_key'] );
$model->save();
```

When interacting with the `meta` attribute, the meta will not be saved until the
model is saved. This allows you to set multiple meta values before saving the
model.

You can also interact with meta directly using the `get_meta`, `set_meta`, and
`delete_meta` methods:

```php
use App\Models\Post;

$model = Post::factory()->create();

// Meta will be stored immediately unless the model hasn't been saved yet
// (allows you to set meta before saving the post).
$model->set_meta( 'meta-key', 'meta-value' );
$model->delete_meta( 'meta-key' );
$value = $model->get_meta( 'meta-key' ); // mixed

// Meta can also be saved directly with the save() method.
$model->save( [ 'meta' => [ 'meta-key' => 'meta-value' ] ] );
```

:::note

These methods will automatically update the model's meta without needing to call
the `save()` method. If a model is not saved yet an exception will be thrown.
:::

### Interacting with Terms

The `Post` model support interacting with terms through
[relationships](./model-relationships.md) or through the model directly. The
model supports multiple methods to make setting terms on a post simple:

```php
use App\Models\Post;

$category = Category::whereName( 'Example Category' )->first();

// Save the category to a post.
$post = new Post( [ 'title' => 'Example Post' ] );

// Also supports an array of IDs or WP_Term objects.
$post->terms->category = [ $category ];

$post->save();

// Read the tags from a post.
$post->terms->post_tag // Term[]
```

Terms can also be set when creating a post (specifying the taxonomy is
optional):

```php
use App\Models\Post;

$post = new Post( [
  'title' => 'Example Title',
  'terms' => [ $category ],
] );

$post = new Post( [
  'title' => 'Example Title',
  'terms' => [
    'category' => [ $category ],
    'post_tag' => [ $tag ],
  ],
] );
```

Models also support simpler `get_terms`/`set_terms` methods for function based
setting of a post's terms:

```php
use App\Models\Post;

$post = Post::find( 1234 );

// Set the terms on a model.
$post->set_terms( [ $terms ], 'category' );

// Read the terms on a model.
$post->get_terms( 'category' ); // Term[]
```

## Core Object

To promote a uniform interface of data across models, all models implement
`Mantle\Contracts\Database\Core_Object`. This provides a consistent set of
methods to invoke on any model you may come across. A developer shouldn't have
to check the model type before retrieving a field. This helps promote
interoperability between model types in your application.

The `core_object()` method will retrieve the WordPress core object that the
model represents (`WP_Post` for a post, `WP_Term` for a term, and so on).

```php
id(): int
name(): string
slug(): string
description(): string
parent(): ?Core_Object
permalink(): ?string
core_object(): object|null
```

## Events

In the spirit of interoperability, you can listen to model events in a uniform
way across all model types. Currently only `Post` and `Term` models support
events. Model events can be registered inside or outside a model. One common
place to register events is in the `boot` method of a model:

```php
namespace App\Models;

use Mantle\Database\Model\Post as Base_Post;

class Post extends Base_Post {
  protected static function boot() {
    static::created( function( $post ) {
      // Fired after the model is created.
    } );
  }
}
```

### Supported Events

#### created

Fired after a model is created and exists in the database.

```php
use App\Models\Post;

Post::created( function( $post ) {
  // Fired after the model is created.
} );
```

#### updating

Fired before a model is updated.

```php
use App\Models\Post;

Post::updating( function( $post ) {
  // Fired before the model is updated.
} );
```

#### updated

Fired after a model is updated.

```php
use App\Models\Post;

Post::updated( function( $post ) {
  // Fired after the model is updated.
} );
```

#### deleting

Fired before a model is deleted.

```php
use App\Models\Post;

Post::deleting( function( $post ) {
  // Fired before the model is deleted.
} );
```

#### deleted

Fired after a model is deleted.

```php
use App\Models\Post;

Post::deleted( function( $post ) {
  // Fired after the model is deleted.
} );
```

#### trashing

Fired before a model is trashed.

```php
use App\Models\Post;

Post::trashing( function( $post ) {
  // Fired before the model is trashed.
} );
```

#### trashed

Fired after a model is trashed.

```php
use App\Models\Post;

Post::trashed( function( $post ) {
  // Fired after the model is trashed.
} );
```

:::note

Events do require the Mantle Framework to be instantiated if you are using models in isolation.
:::

## Query Scopes

A scope provides a way to add a constraint to a model's query easily.

### Global Scope

Using a global scope, a model can become a subset of a parent model. For example, a
`User` model can be used to define a user object while an `Admin` model can
describe an admin user. Underneath they are both user objects but the `Admin`
model allows for an easier interface to retrieve a subset of data.

In the example below, the `Admin` model extends itself from `User` but includes
a meta query in all requests to the model (`is_admin = 1`).

```php
use App\Models\User;
use Mantle\Database\Query\Post_Query_Builder;

class Admin extends User {
  protected static function boot() {
    static::add_global_scope(
      'scope-name',
      function( Post_Query_Builder $query ) {
        return $query->whereMeta( 'is_admin', '1' );
      }
    )
  }
}
```

Global Scopes can also extend from a class to allow for reusability.

```php
use App\Models\User;
use Mantle\Contracts\Database\Scope;
use Mantle\Database\Model\Model;

class Admin extends User {

  protected static function boot() {
    parent::boot();

    static::add_global_scope( new Test_Scope() );
  }
}

class Admin_Scope implements Scope {
  public function apply( Builder $builder, Model $model ) {
    return $builder->whereMeta( 'is_admin', '1' );
  }
}
```

### Local Scope

Local Scopes allow you to define a commonly used set of constraints that you may
easily re-use throughout your application. For example, you can retrieve all
posts that are in a specific category. To add a local scope to the application,
prefix a model method with `scope`.

Scopes can also accept parameters passed to the scope method. The parameters
will be passed down to the scope method after the query builder argument.

```php
use Mantle\Database\Model\Post as Base_Post;
use Mantle\Database\Query\Post_Query_Builder;

class Post extends Base_Post {
  public function scopeActive( Post_Query_Builder $query ) {
    return $query->whereMeta( 'active', '1' );
  }

  public function scopeOfType( Post_Query_Builder $query, string $type ) {
    return $query->whereMeta( 'type', $type );
  }
}
```

#### Using a Local Scope

To use a local scope, you may call the scope methods with querying the model
without the `scope` prefix. Scopes can be chained in the query, too.

```php
Posts::active()->get();

Posts::ofType( 'type-to-query' )->get();
```

## Querying Models

The query builder provides a fluent interface to query models. The query builder
is a powerful tool to query models in a uniform way. You can call a query
builder method on the model itself or call the `query()` method to create a new
query builder instance.

```php
use App\Models\Post;

// Query the model.
$results = Post::query()->where( 'post_status', 'publish' )->get();

// Or use the model directly.
$query = Post::where( 'post_status', 'publish' );
```

For more information on querying models, see [Querying Models](./query-builder.md).