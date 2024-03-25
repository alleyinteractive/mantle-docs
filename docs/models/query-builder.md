# Query Builder

Models support a fluent query builder that will return an easy-to-use Collection
of models.

:::tip

The Mantle Framework is not required to use the query builder. You can require
the package in your application with Composer and use the models and query
builder in your application.

```bash
composer require mantle-framework/database
```
:::

## Retrieving Models

Once a model is defined you are ready to start retrieving data. Each model acts
as a powerful query builder that allows you to fluently query the underlying
data that each model represents.

### Querying a Model by ID

If you know a model's primary key, you can retrieve it using the `find()` method.

```php
use App\Models\Post;

$post = Post::find( 1 );
```

### Queuing Collections of Models

The `all()` method will return all the results for a model.

```php
use App\Models\Post;

$posts = Post::all();

foreach ( $posts as $post ) {
	echo $post->title;
}
```

:::tip
For post models, the `all` method will retrieve only published posts by default. You
can easily include all post statuses by calling `anyStatus()` on the model.

```php
use App\Models\Post;

Post::where( ... )->anyStatus()->all();
```
:::

Retrieving the results of the current query can be done by using the `get()`
method.

```php
use App\Models\Post;

$posts = Post::where( 'post_status', 'publish' )->get();
```

You can use the `found_rows()` method to retrieve the total number of results
from the collection of models returned by the query.

```php
use App\Models\Post;

$posts = Post::where( 'post_status', 'publish' )->get();

$total = $posts->found_rows();

```

### Querying a Single Model

You can also use the `first()` method to retrieve just a single model from
either the model or the model's query builder.

```php
use App\Models\Post;

$post = Post::first();

// Retrieve the first post with the title "example".
$post = Post::where( 'title', 'example' )->first();
```

### Counting the Number of Results

You can count the number of results for a query by using the `count()` method.

```php
use App\Models\Post;

$count = Post::where( 'post_status', 'publish' )->count();
```

## Querying Models

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

You can use the field name or any [field alias](./models.md#field-aliases) to
query against. Mantle will automatically convert the field name to the correct
argument for the underlying `WP_Query` or `WP_Tax_Query` class.

#### Chaining Queries

Queries can be chained together to build more complex queries.

```php
Example_Post::where( 'slug', 'slug-to-find' )
  ->where( 'post_status', 'publish' )
  ->first();
```

#### Querying Model in a List of IDs

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

:::note Only post models support querying against terms.
:::

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

### Querying By Date

Mantle provides a few methods to query against dates to circumvent the
limitations of `WP_Query`.

All date arguments support a date string, unix timestamp, Carbon instance, or
DateTime/DateTimeInterface instance. All comparison operators support `=`, `!=`,
`>`, `>=`, `<`, `<=`.

Where possible, the query will be converted to a `date_query` argument for
`WP_Query` to use. If the query cannot be converted to a `date_query` argument,
Mantle will use a raw SQL query to query against the database column directly.
This applies when trying to query [a specific
date](https://core.trac.wordpress.org/ticket/59351) which WordPress does not
support.

:::note The date methods are only available on post models.
:::

#### whereDate

Find posts where the date matches a specific value. Supports a date string, unix
timestamp, Carbon instance, or DateTime instance. The default column to query
against is `post_date`.

```php
use App\Models\Post;

$posts = Post::query()
  ->whereDate( '2021-01-01', '>' )
  ->get();

$posts = Post::query()
  ->whereDate( 1612137600, '>' )
  ->get();

$posts = Post::query()
  ->whereDate( new DateTime( '2021-01-01' ), '>', 'post_modified' )
  ->get();
```

#### whereUtcDate

Find posts where the `post_date_gmt` matches a specific value. Supports a date
string, unix timestamp, Carbon instance, or DateTime instance.

```php
use App\Models\Post;

$posts = Post::query()
  ->whereUtcDate( '2021-01-01' )
  ->get();

$posts = Post::query()
  ->whereUtcDate( 1612137600, '>' )
  ->get();
```

#### whereModifiedDate

Find posts where the `post_modified` matches a specific value.

```php
use App\Models\Post;

$posts = Post::query()
  ->whereModifiedDate( '2021-01-01', '>' )
  ->get();
```

#### whereModifiedUtcDate

Find posts where the `post_modified_gmt` matches a specific value.

```php
use App\Models\Post;

$posts = Post::query()
  ->whereModifiedUtcDate( '2021-01-01', '>' )
  ->get();
```

#### olderThan

Find posts where the date is older than a specific value.

```php
use App\Models\Post;

$posts = Post::query()
  ->olderThan( '2021-01-01' )
  ->get();
```

#### olderThanOrEqualTo

Find posts where the date is older than or equal to a specific value.

```php
use App\Models\Post;

$posts = Post::query()
  ->olderThanOrEqualTo( '2021-01-01' )
  ->get();
```

#### newerThan

Find posts where the date is newer than a specific value.

```php
use App\Models\Post;

$posts = Post::query()
  ->newerThan( '2021-01-01' )
  ->get();
```

#### newerThanOrEqualTo

Find posts where the date is newer than or equal to a specific value.

```php
use App\Models\Post;

$posts = Post::query()
  ->newerThanOrEqualTo( '2021-01-01' )
  ->get();
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
Example_Post::query()
  ->whereIn( 'id', [ 1, 2, 3 ] )
  ->orderByWhereIn()
  ->get();
```

You can pass multiple fields and directions to the `orderBy()` method by calling
it multiple times.

```php
Example_Post::query()
  ->orderBy( 'name', 'asc' )
  ->orderBy( 'date', 'desc' )
  ->get();
```

To remove all ordering from a query, you can use the `removeOrder()` method.

```php
Example_Post::query()->removeOrder()->get();
```

### Conditional Clauses

Sometimes you may want certain clauses to be applied only if a condition is
met. You can use the `when()` method to conditionally add clauses to a query.

```php
use App\Models\Post;
use Mantle\Database\Query\Post_Query_Builder;

Post::query()
  ->when(
    $request->has( 'name' ),
    fn ( Post_Query_Builder $query ) => $query->where( 'name', $request->get( 'name' ) ),
  )
  ->get();
```

The closure will only be executed if the condition is met. You can pass another
callback to the third argument of the `when()` method to add a clause when the
condition is not met.

```php
use App\Models\Post;
use Mantle\Database\Query\Post_Query_Builder;

Post::query()
  ->when(
    $request->has( 'name' ),
    // Applied when the condition is met.
    fn ( Post_Query_Builder $query ) => $query->where( 'name', $request->get( 'name' ) ),
    // Applied when the condition is not met.
    fn ( Post_Query_Builder $query ) => $query->where( 'name', 'default-name' ),
  )
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
Post::where( 'status', 'publish' )->each( function ( Post $post ) {
  // Do something with the post.
} );

// Process each post using ID-based pagination chunking.
Post::where( 'status', 'publish' )->each_by_id( function ( Post $post ) {
  // Do something with the post.
} );
```

#### Map/Map By ID

If you need to map the results of a query, you can use the `map()`/`map_by_id()`
methods. These methods will map the results of the query performantly without
loading all of the models into memory. `map_by_id()` is useful if you need to
process results in batches and potentially delete/modify them in a way that can
break the sorting of the query.

```php
use App\Models\Post;

// Map the results using normal pagination chunking.
$posts = Post::where( 'status', 'publish' )->map( function ( Post $post ) {
  // Perform some additional processing here.
  return [ $post->id => $post->title ];
} );

// Map the results using ID-based pagination chunking.
$posts = Post::where( 'status', 'publish' )->map_by_id( function ( Post $post ) {
  // Perform some additional processing here.
  return [ $post->id => $post->title ];
} );
```

### Debugging Queries

The query arguments that are passed to the underlying `WP_Query`/`WP_Tax_Query`/etc.
can be dumped by using the `dump()`/`dd()` methods.

```php
use App\Models\Post;

// Dump the query arguments.
Post::query()->where( 'name', 'example' )->dump()->get();

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

### Advanced: Querying Against Database Columns

You can query against the database columns directly by using the
`whereRaw()`/`orWhereRaw()` methods. This allows you to write raw SQL queries to
query against the database columns to circumvent the limitations of `WP_Query`
and `WP_Tax_Query`.

```php
use App\Models\Post;

// Get the first 10 posts where the comment count is greater than 10.
$posts = Post::query()->whereRaw( 'comment_count', '>', 10 )->get();

// Get a post by ID using a raw SQL query.
$post = Post::query()->whereRaw( 'ID', 1 )->first();

// Partial match the post title using a raw SQL query.
$posts = Post::query()
  ->whereRaw( 'post_title', 'LIKE', 'example prefix:%' )
  ->get();

// Attach multiple conditions together.
$posts = Post::query()
  ->whereRaw( 'comment_count', '>', 10 )
  ->orWhereRaw( 'comment_count', '<', 5 )
  ->get();
```

These methods are useful for more complex queries that cannot be expressed using
`WP_Query` or `WP_Tax_Query` via the fluent query builder. For example, Mantle
uses this internally to chunk models by ID (which is not supported by
`WP_Query`). The variables passed to `whereRaw()`/`orWhereRaw()` are
automatically escaped with `$wpdb->prepare()` to prevent SQL injection.

### Advanced: Modifying Query Clauses

Apart of the above raw SQL queries, you can also modify the query clauses
directly by using the `add_clause()` method on post/term queries. This allows
you to modify post/term query clauses that are exposed via the
`posts_clauses`/`terms_clauses` filters.

The callback passed to `add_clause()` will receive the current query clauses and
should return the modified query clauses. See the relevant WordPress core
documentation for the `posts_clauses` and `terms_clauses` filters for more
information:

- [`posts_clauses`](https://developer.wordpress.org/reference/hooks/posts_clauses/)
- [`terms_clauses`](https://developer.wordpress.org/reference/hooks/terms_clauses/)

```php
use App\Models\Post;

// Add a custom clause to the post query.
$posts = Post::query()->add_clause( function ( array $clauses ) {
  $clauses['where'] .= ' AND post_date > "2021-01-01"';
  return $clauses;
} )->get();
```

Mantle recommends to use the
[`whereRaw()`/`orWhereRaw()`](#advanced-querying-against-database-columns) methods over
`add_clause()` as it is more expressive and easier to understand. The
`add_clause()` method is useful to make it simpler than WordPress core makes it
to quickly modify the query clause directly.

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

## Model Not Found Exceptions

The `first_or_fail()` method will retrieve the first model matching the query or
throw a `Mantle\Database\Model\Model_Not_Found_Exception` if no matching model
exists.

```php
use App\Models\Post;

// Retrieve the first post with the title "example" or throw an exception.
$post = Post::where( 'title', 'example' )->first_or_fail();
```

The `find_or_fail()` method will retrieve the model by its primary key or throw a
`Mantle\Database\Model\Model_Not_Found_Exception` if no matching model exists.

```php
use App\Models\Post;

// Retrieve the post with the ID of 1 or throw an exception.
$post = Post::find_or_fail( 1 );
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
use App\Models\Posts;

$posts = Posts::paginate( 20 );
```

### Basic Pagination

'Basic' pagination is purely a next / previous link relative to the current
page. It also sets `'no_found_rows' => true` on the query to help performance for very
large data sets.

```php
use App\Model\Posts;

$posts = Posts::simple_paginate( 20 );
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
