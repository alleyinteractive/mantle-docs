---
title: Relationships
description: Define, store, and query relationships between Mantle models.
---

# Model Relationships

## Introduction

Data in an application will often have a relationship with other data. In
Mantle, data represented as models can have relationships with other models with
ease.

## Defining Relationships

Relationships are defined as methods on the model. Since, like models
themselves, relationships also serve as powerful query builders, defining
relationships as methods provides powerful method chaining and querying
capabilities. For example, we may chain additional constraints on a sponsor's
posts relationship:

```php
$sponsor->posts()->whereMeta( 'active', '1' )->get();
```

Relationships can exist between posts as well as between posts and terms.
Relationships between posts use post meta (or an [internal
taxonomy](#post-to-post-relationships)) while relationships between posts and
terms use a taxonomy query.

### Which Side Stores the Relationship?

The difference between "has" and "belongs to" relationships is which model
stores the reference to the other. Consider a `post -> sponsor` relationship
where each post can have one sponsor and a sponsor can have many posts. The
sponsor's ID is stored in a `sponsor_id` meta key on each post:

| Model | Relationship | Stores the meta? |
| --- | --- | --- |
| `Post` | `belongs_to( Sponsor::class )` | Yes, the post stores `sponsor_id`. |
| `Sponsor` | `has_many( Post::class )` | No, it queries posts by their `sponsor_id`. |

Put another way: the model with the meta key **belongs to** the other model, and
the other model **has one** or **has many** of it.

By default, the meta key is derived from the snake-cased class name of the model
without the meta key, followed by `_id`. A `Sponsor` model will use `sponsor_id`
and a `Blog_Post` model will use `blog_post_id`.

### Has One / Has Many

A has one or has many relationship is defined on the model whose ID is stored on
the other models. Continuing the example, the sponsor's ID is stored on one or
many posts:

```php
use Mantle\Database\Model\Post;

class Sponsor extends Post {
	public function posts() {
		// Queries posts with a 'sponsor_id' meta value matching this sponsor's ID.
		return $this->has_many( Post::class );
	}

	public function featured_post() {
		return $this->has_one( Post::class )->whereMeta( 'featured', '1' );
	}
}
```

The meta key and the key it is compared against can be customized by passing
the `$foreign_key` and `$local_key` arguments:

```php
// Query posts by their 'related_sponsor' meta value.
return $this->has_many( Post::class, foreign_key: 'related_sponsor' );
```

#### Storing

Saving a model through the relationship will set the proper meta value on it.
Unsaved models will be saved automatically.

```php
$sponsor->posts()->save( $post );

$sponsor->posts()->save_many( [ $post_a, $post_b ] );

$sponsor->posts()->remove( $post );
```

### Belongs To / Belongs To Many

A belongs to relationship is defined on the model that stores the meta value. In
the `post -> sponsor` example, the post stores its sponsor's ID:

```php
use Mantle\Database\Model\Post as Base_Post;

class Post extends Base_Post {
	public function sponsor() {
		// Uses the 'sponsor_id' meta value on this post to find the sponsor.
		return $this->belongs_to( Sponsor::class );
	}
}
```

The meta key can be customized with the `$local_key` argument. Mantle uses this
for the `thumbnail` relationship that is included on every post model, which
uses the WordPress `_thumbnail_id` meta key to retrieve the post's featured
image:

```php
use Mantle\Database\Model\Attachment;

public function thumbnail() {
	return $this->belongs_to( Attachment::class, local_key: '_thumbnail_id' );
}
```

```php
$post = Post::find( 123 );

echo $post->thumbnail?->url();
```

A belongs to many relationship works the same way but stores each related ID as
a separate meta value on the model, allowing a post to belong to many sponsors.

```php
public function sponsors() {
	return $this->belongs_to_many( Sponsor::class );
}
```

#### Storing

Associating a model through the relationship will set the meta value on the
current model. Dissociating will remove it.

```php
$post->sponsor()->associate( $sponsor );

$post->sponsor()->dissociate();
```

For belongs to many relationships, `associate()` will add an additional meta
value rather than replacing the existing one.

### Post-to-Post Relationships

Posts can define relationships between other posts using meta keys by default.
However, this can result in poor query performance when querying against the
relationship. Mantle supports defining relationships between posts using an
internal taxonomy. This will result in better query performance when loading the
post's relationships.

```php
class Sponsor extends Post {
	public function posts() {
		return $this->has_many( Post::class )->uses_terms();
	}
}
```

On the flip side, the belongs-to relationship needs to use terms as well.

```php
class Post extends Base_Post {
	public function sponsor() {
		return $this->belongs_to( Sponsor::class )->uses_terms();
	}
}
```

### Post-to-Term Relationships

Post-to-term relationships should always use a Has One/Has Many in both
directions since post and terms in WordPress are bidirectional. Attempting to
define a relation between a post and a term using Belongs To will result in an
error being thrown.

```php
use Mantle\Database\Model\Post as Base_Post;
use Mantle\Database\Model\Term;

class Post extends Base_Post {
	public function tags() {
		return $this->has_many( Tag::class );
	}
}

class Tag extends Term {
	public function posts() {
		return $this->has_many( Post::class );
	}
}
```

## Querying Relationships

Relationships can be queried by calling the method on the model, which returns a
[query builder](./query-builder.md) to construct the query. Relationships will
return every related model unless a limit is set with `take()`.

```php
$sponsor->posts()->get();

$sponsor->posts()->take( 5 )->get();

$sponsor->posts()->first();
```

Relationships can also be accessed as properties on the model instance. Has one
and belongs to relationships return a single model or `null`. Has many and
belongs to many relationships return a collection of models.

```php
echo $post->sponsor?->title;

foreach ( $sponsor->posts as $post ) {
	echo $post->title;
}
```

### Querying Relationship Existence

You may query for models that have or don't have a belongs to relationship by
using the `has()` and `doesnt_have()` methods. Both methods accept the name of
the relationship and an optional ID of the related model to compare against.

```php
// Posts that have a sponsor.
$posts = Post::has( 'sponsor' )->get();

// Posts sponsored by a specific sponsor.
$posts = Post::has( 'sponsor', $sponsor->id )->get();

// Posts without a sponsor.
$posts = Post::doesnt_have( 'sponsor' )->get();

// Posts not sponsored by a specific sponsor.
$posts = Post::doesnt_have( 'sponsor', $sponsor->id )->get();
```

:::note
Relationship existence queries are only supported on belongs to relationships
that use meta. Relationships defined with `uses_terms()` will throw an
exception.
:::

## Eager Loading Relationships

When using relationships as model properties, related models are "lazy loaded"
by default. This means that the relationship data is not loaded until the first
time you access the property. Mantle supports eager loading relationships to
load all model relationships at the time of the initial query for the parent
model. This can prevent the "N + 1" query problem. Here's an example of a
problem eager loading can prevent:

1. A page includes a list of blog posts.
2. Each blog post has a sponsor relationship used.
3. During the loop, each blog post will cause an additional query (the "N + 1"
   problem) to retrieve the post's sponsor.

Eager Loading the relationship can prevent this by loading all sponsors for the
blog posts in a collection at once. Here is an example model:

```php
class Blog_Post extends Post {
	public function sponsor() {
		return $this->belongs_to( Sponsor::class );
	}
}
```

Now, let's retrieve all the blog posts and the sponsors:

```php
$posts = Blog_Post::with( 'sponsor' )->get();

foreach ( $posts as $post ) {
	echo $post->title;

	echo $post->sponsor?->title;
}
```

This loop will execute two queries: the initial query to retrieve the blog posts
and another query to retrieve the sponsors. Without eager loading, this would
perform "N + 1" queries on the page.

Eager Loading is by default an opt-in feature of Mantle models for performance.
A model can include an eager-loaded relationship by default by setting the with
property on the model.

```php
class Blog_Post extends Post {
	/**
	 * The relations to eager load on every query.
	 *
	 * @var string[]
	 */
	protected $with = [ 'sponsor' ];
}
```
