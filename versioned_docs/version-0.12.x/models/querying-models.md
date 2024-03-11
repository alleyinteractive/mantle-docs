# Querying Models

Models support a fluent query builder that will return an easy-to-use Collection
of models.

## Retrieving Models

Once a model exists you are ready to start retrieving data. Each model acts as a
powerful query builder that allows you to fluently query the underlying data
that each model represents.

```php
use App\Models\Post;

$posts = Post::all();

foreach ( $posts as $post ) {
	echo $post->title;
}
```

The `Model::all()` method will return all the results for a model.

:::tip
For post models, the `all` method will retrieve only published posts by default. You
can easily include all post statuses by calling `anyStatus()` on the model.

```php
use App\Models\Post;

Post::where( ... )->anyStatus()->all();
```
:::

You can also use the `first()` method to retrieve just a single model from
either the model or the model's query builder.

```php
use App\Models\Post;

$post = Post::first();
```

The `first_or_fail()` method will retrieve the first model matching the query or
throw a `Mantle\Database\Model\Model_Not_Found_Exception` if no matching model
exists.

```php
use App\Models\Post;

// Retrieve the first post with the title "example" or throw an exception.
$post = Post::where( 'title', 'example' )->first_or_fail();
```

### Performing a Query

Queries can be started by calling the `query()` method on the model or using any
query method directly on the model statically.

```php
use App\Models\Post;

// Using the static magic method.
Post::where( 'post_status', 'publish' )->get();

// Using the query method.
Post::query()->where( 'post_status', 'publish' )->get();
```

### Querying Model Fields

Model fields can be queried against using the `where()` method or using
magic-methods in the format of `where{Field}()` to fluently build queries.

```php
Example_Post::where( 'slug', 'slug-to-find' )->first();

Example_Post::whereSlug( 'slug-to-find' )->first();
```

Queries can be chained together to build more complex queries.

```php
Example_Post::where( 'slug', 'slug-to-find' )
  ->where( 'post_status', 'publish' )
  ->first();
```

You can also use `whereIn()` and `whereNotIn()` to query against a list of
values to retrieve models who are in or not in the list of IDs.

```php
// Posts in a list of IDs.
Example_Post::whereIn( 'id', [ 1, 2, 3 ] )->get();

// Posts not a list of IDs.
Example_Post::whereNotIn( 'id', [ 1, 2, 3 ] )->get();
```

### Querying Posts with Terms

Post queries can be built to query against terms.

**Note:** Only post models support querying against terms.

```php
// Get the first 10 posts in the 'term-slug' tag.
Example_Post::whereTerm( 'term-slug', 'post_tag' )
  ->take( 10 )
  ->get();

// Get the first 10 posts in the 'term-slug' or 'other-tag' tags.
Example_Post::whereTerm( 'term-slug', 'post_tag' )
  ->orWhereTerm( 'other-tag', 'post_tag' )
  ->take( 10 )
  ->get();

// Get the first 10 posts in the taxonomy term controlled by `Example_Term`.
$term = Example_Term::first();
Example_Post::whereTerm( $term )->take( 10 )->get();
```

### Querying with Meta

Normal concerns for querying against a model's meta still should be observed.
The `Post` and `Term` models support querying with meta.

```php
// Instance of Example_Post if found.
Example_Post::whereMeta( 'meta-key', 'meta-value' )->first();

// Multiple meta keys to match.
Example_Post::whereMeta( 'meta-key', 'meta-value' )
  ->andWhereMeta( 'another-meta-key', 'another-value' )
  ->first();

Example_Post::whereMeta( 'meta-key', 'meta-value' )
  ->orWhereMeta( 'another-meta-key', 'another-value' )
  ->first();
```

### Limit Results

You can limit the number of results returned by using the `take()` method.

```php
// Get the first 10 posts.
Example_Post::where( 'title', 'example' )->take( 10 )->get();
```

### Pages

You can paginate results by using the `page()` method.

```php
// Get the second page of results.
Example_Post::where( 'title', 'example' )->page( 2 )->get();
```

For more information on advanced pagination, see the [Pagination](#pagination) section.

### Ordering Results

Query results can be ordered by using the `orderBy()`/`order_by()` methods.

```php
Example_Post::query()->orderBy( 'name', 'asc' )->get();
```

You can also order by the value passed to `whereIn()`:

```php
Example_Post::query()->whereIn( 'id', [ 1, 2, 3 ] )->orderByWhereIn()->get();
```

### Conditional Clauses

Sometimes you may want certain clauses to be applied only if a condition is
met. You can use the `when()` method to conditionally add clauses to a query.

```php
use App\Models\Post;

Post::query()
  ->when( $request->has( 'name' ), function ( $query ) use ( $request ) {
    $query->where( 'name', $request->get( 'name' ) );
  } )
  ->get();
```

You can pass another callback to the third argument of the `when()` method to
add a clause when the condition is not met.

```php
use App\Models\Post;

Post::query()
  ->when( $request->has( 'name' ), function ( $query ) use ( $request ) {
    $query->where( 'name', $request->get( 'name' ) );
  }, function ( $query ) {
    $query->where( 'name', 'default-name' );
  } )
  ->get();
```

### Chunking Results

If you need to work with thousands of models, you can use the `chunk()` method
to process the results in chunks.

```php
use App\Models\Post;

// Chunk the results in groups of 100.
Post::chunk( 100, function ( $posts ) {
  foreach ( $posts as $post ) {
    // Do something with the post.
  }
} );
```

You can also use the `chunk_by_id()` method to chunk results by the model's ID.
This is useful if you need to process results in batches and potentially
delete/modify them in a way that can break the sorting of the query.

```php
use App\Models\Post;

// Chunk the results in groups of 100.
Post::chunk_by_id( 100, function ( $posts ) {
  foreach ( $posts as $post ) {
    // Do something with the post.
  }
} );
```

#### Each/Each By ID

If you need to process each model in a query, you can use the
`each()`/`each_by_id()` methods. These methods will process each model in the
query performantly without loading all of the models into memory. `each_by_id()` is
useful if you need to process results in batches and potentially delete/modify
them in a way that can break the sorting of the query.

```php
use App\Models\Post;

// Process each post using normal pagination chunking.
Post::where( 'status', 'publish' )->each( function (  Post$post ) {
  // Do something with the post.
} );

// Process each post using ID-based pagination chunking.
Post::where( 'status', 'publish' )->each_by_id( function (  Post$post ) {
  // Do something with the post.
} );
```

### Debugging Queries

The query arguments that are passed to the underlying `WP_Query`/`WP_Tax_Query`/etc.
can be dumped by using the `dump()`/`dd()` methods.

```php
use App\Models\Post;

// Dump the query arguments.
Post::query()->where( 'name', 'example' )->dump();

// Dump the query arguments and end the script.
Post::query()->where( 'name', 'example' )->dd();
```

You can dump the raw SQL query by using the `dump_sql()`/`dd_sql()` methods.

```php
use App\Models\Post;

// Dump the raw SQL query.
Post::query()->where( 'name', 'example' )->dump_sql();

// Dump the raw SQL query and end the script.
Post::query()->where( 'name', 'example' )->dd_sql();
```

### Limitations

Not all fields are supported to be queried against since this is a fluent
interface for the underlying `WP_Query` and `WP_Tax_Query` classes. For more
advanced queries, checkout the `Mantle\Database\Query\Concerns\Query_Clauses`
trait which will allow you to add raw query clauses to your post/term queries.

## Retrieving or Creating Models

Models can be retrieved or created if they do not exist using the following
helper methods:

### first_or_new

The `first_or_new()` method will retrieve the first model matching the query or
create a new instance of the model if no matching model exists. It will not save
the model. The second argument is an array of attributes to set on the model if
it is created.

```php
use App\Models\Post;

// Retrieve the first post with the title "example" or create a new post.
$post = Post::first_or_new(
  [
    'title' => 'example',
  ],
  [
    'content' => 'This is an example post.',
  ]
);
```

### first_or_create

Similar to `first_or_new()`, the `first_or_create()` method will retrieve the
first model matching the query or create a new instance of the model if no
matching model exists. It will save the model. The second argument is an array
of attributes to set on the model if it is created.

```php
use App\Models\Post;

// Retrieve the first post with the title "example" or create a new post.
$post = Post::first_or_create(
  [
    'title' => 'example',
  ],
  [
    'content' => 'This is an example post.',
  ]
);
```

### update_or_create

The `update_or_create()` method will retrieve the first model matching the query,
create it if it does not exist, or update it if it exists. The second argument
is an array of attributes to set on the model if it is created.

```php
use App\Models\Post;

// Retrieve the first post with the title "example" or create a new post.
$post = Post::update_or_create(
  [
    'title' => 'example',
  ],
  [
    'content' => 'This is an example post.',
  ]
);
```

## Querying Multiple Models

Multiple models of the same type (posts/terms/etc.) can be queried together.
There are some limitations and features that cannot be used including query
scopes.

```php
use Mantle\Database\Query\Post_Query_Builder;

use App\Models\Post;
use App\Models\Another_Post;

Post_Query_Builder::create( [ Post::class, Another_Post::class ] )
  ->whereMeta( 'shared-meta', 'meta-value' )
	->get();
```

## Pagination

All models support pagination of results to make traversal of large sets of data
easy. The paginators will display links to the next and previous pages as well
as other pages that can be styled by your application.

### Length Aware Pagination

By default the `paginate()` method will use the Length Aware Paginator which
will calculate the total number of pages in a result set. This is what you
probably expect from a paginator: previous / next links as well as links to a
few pages before and after the current one.

```php
App\Models\Posts::paginate( 20 );
```

### Basic Pagination

'Basic' pagination is purely a next / previous link relative to the current
page. It also sets `'no_found_rows' => true` on the query to help performance for very
large data sets.

```php
App\Model\Posts::simple_paginate( 20 );
```

### Displaying Paginator Results

The paginator instances both support iteration over it to allow you to easily
loop through and display the current page's results.

```php
<ul class="post-list">
	@foreach ( $posts as $post )
		<li>
			<a href="{{ $post->url() }}">{{ $post->title() }}</a>
		</li>
	@endforeach
</ul>

{{ $posts->links() }}
```

### Customizing the Paginator Links

By default the paginator will use query strings to paginate and determine the
current URL.

```
/blog/
/blog/?page=2
...
/blog/?page=100
```

The paginator can also be set to use path pages to paginate. For example, a
paginated URL would look like `/blog/page/2/`.

```php
{{ $posts->use_path()->links() }}
```

### Append Query Parameters to Paginator Links

Arbitrary query parameters can be append to paginator links.

```php
{{ $posts->append( [ 'key' => 'value' ] )->links() }}
```

The current GET query parameters can also be automatically included on the links
as well.

```php
{{ $posts->with_query_string()->links() }}
```

### Customizing the Paginator Path

The paginator supports setting a custom base path for paginated results. By
default the paginator will use the current path (stripping `/page/n/` if it
includes it).

```php
{{ $posts->path( '/blog/' )->links() }}
```

### Converting the Paginator to JSON

The paginator supports being returned directly as a route's response.

```php
Route::get( '/posts', function() {
	return App\Posts::paginate( 20 );
} );
```

The paginator will return the results in a JSON format.

```php
{
  "current_page": 1,
  "data": [ ... ],
  "first_page_url": "\/path",
  "next_url": "\/path?page=2",
  "path": "\/path",
  "previous_url": null
}
```
