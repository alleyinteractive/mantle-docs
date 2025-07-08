---
description: Mantle provides a delightful templating experience for WordPress using blade templating.
---

# Templating and Views

Templating in WordPress should be delightful — Mantle hopes to make it that
way.

## Views
WordPress template parts can be returned for a route.

```php title="routes/web.php"
Route::get( '/', function () {
  return response()->view( 'template-parts/block', [ 'variable' => '123' ] );
} );
```

### PHP Templates

Mantle supports normal PHP template partials. The `view()` helper function will
automatically from any of the [configured view locations](#view-file-locations).

```php title="ExampleController.php"
class ExampleController {
  public function example() {
    return view( 'template-parts/block', [ 'variable' => '123' ] );
  }
}
```

```php title="template-parts/block.php"
<div>
  <h1><?php echo esc_html( $variable ); ?></h1>
</div>
```

### Blade Templates

Mantle also supports loading [Laravel's Blade](https://laravel.com/docs/11.x/blade) template
parts. Blade and WordPress template parts can be used interchangeably. Mantle
uses the `illuminate/view` package directly to provide complete compatibility
with Blade templating.

```php
Hello, {{ $name }}
```

Blade templates can be used interchangeably with PHP templates. Mantle will
automatically detect the file extension and load the appropriate template engine.

For more information on Blade templating, see [Blade Templating](./blade.md).

## Passing Variables to Views

Frequently you will need to pass variables down to views from controllers and
routes. To ensure a global variable isn't overwritten the variables are stored
in the helper method `mantle_get_var()`.

```php
// Call the view with a variable.
echo view( 'template-parts/view', [ 'foo' => 'bar' ] );
```

Inside the view:

```php title="template-parts/view.php"
<div>
  <?php echo mantle_get_var( 'foo' ); ?>
</div>
```

When using [Blade Templates](#blade-templates), variables can access the variables
directly. Blade will automatically escape the contents of a variable when using
`{{ ... }}`.

```php
Hello {{ $foo }}!
```

You can also use `mantle_get_mixed_var()` to retrieve a variable as a
[Mixed Data](../features/support/mixed-data.mdx) instance:

```php
Hello {{ mantle_get_mixed_var( 'foo' )->string() }}!
```

### Passing Global Variables

Service Providers and other classes in the application can pass global variables
to all views loaded. This can be very handy when you want to pass template
variables to a service provider without doing any additional work in the route.

```php
use Mantle\Facade\View;

// Pass 'variable_to_pass' to all views.
View::share( 'variable_to_pass', 'value or reference to pass' );
```

## Setting the Global Post Object

Commonly views need to set the global post object in WordPress for a view. This
will allow WordPress template tags such as `the_ID()` and `the_title()` to work
properly.

```php title="routes/web.php"
Route::get( '/article/{article}', function ( App\Article $article ) {
  // Supports passing a model, ID, or core WordPress object.
  return view( 'template-parts/block', [ 'post' => $article ] )->set_post( $article );
} );
```

```php title="template-parts/block.blade.php"
<article>
  <h1>{{ the_title() }}</h1>
  <div>{{ the_content() }}</div>

  {{-- Use the passed variable. --}}
  <p>{{ $post->post_title }}</p>
</article>
```

## View File Locations

By default WordPress will only load a template part from the active theme and
parent theme if applicable. Mantle supports loading views from a dynamic set of
locations. Mantle support automatically register the current theme and parent
theme as view locations. Additional paths can be registered through
`View_Loader`.

```php
use Mantle\Facade\View_Loader;

View_Loader::add_path( '/path-to-add' );

// Optionally provide an alias for easy referencing.
View_Loader::add_path( '/another-path', alias: 'vendor-views' );

// Remove a path.
View_Loader::remove_path( '/path-to-remove' );
```

Adding additional view locations will allow you to use templates that aren't
located in the theme directory. This can be useful for loading templates from a
plugin which WordPress doesn't natively support.

### Default View Locations

- Active Theme
- Parent of Active Theme (if applicable)
- `{root of mantle site}/views`

## Loading Views

Views can be loaded using the `view()` helper function. This function will
automatically detect the file extension and load the appropriate template engine.

```php
echo view( 'template-parts/block', [ 'variable' => '123' ] );
```

Views will be loaded from the [configured view locations](#view-file-locations)
in the order they were registered. If a view is found in multiple locations the
first one found will be used.

To load a view from a specific location you can prefix the view name with the
alias of the location in the format `@{alias}/{path to view}`:

```php
echo view( '@vendor-views/template-parts/block', [ 'variable' => '123' ] );
```

This can be useful when you want to load views from a plugin or a specific
directory that isn't the active theme or parent theme.

## View Methods

### `view()`

Load a view file and return the rendered output. This function will
automatically detect the file extension and load the appropriate template engine
(Blade or PHP). The view file will be loaded from the [configured view
locations](#view-file-locations).

```php
echo view( 'template-parts/block', [ 'variable' => '123' ] );
```

### `loop()`

Loop over a collection/array of post objects. Supports a collection or array of
`WP_Post` objects, Mantle Models, post IDs, or a `WP_Query` object. The post
object will be automatically setup for each template part. We don't have to
`while ( have_posts() ) : the_post(); ... endwhile;`, keeping our code nice and
DRY.

```php title="template-parts/post-list.php"
$posts = Post::all();
echo loop( $posts, 'template-parts/post-list-item' );
```

Inside the loop, the global post object will be set to the current post in the
loop. This allows you to use WordPress template tags such as `the_title()`,
`the_content()`, and `the_ID()` without needing to call `setup_postdata()`.

```php title="template-parts/post-list-item.php"
<?php
/**
 * @var int $index The index of the current post in the loop.
 */
?>
<article>
  <h2><?php the_title(); ?></h2>
  <div><?php the_content(); ?></div>
</article>
```

You can use `render_loop()` to echo the output of the loop directly:

```php
render_loop( $posts, 'template-parts/post-list-item' );
```

### `iterate()`

Iterate over a collection/array of arbitrary data. Each view is passed `index`
and `item` as a the current item in the loop.

```php
echo iterate( [ 1, 2, 3 ], 'template-parts/number-item' );
```

```php title="template-parts/number-item.php"
<?php
/**
 * @var int $index The index of the current item in the loop.
 * @var int $item The current item in the loop.
 */
?>
<div>
  <p>Index: <?php echo esc_html( $index ); ?></p>
  <p>Item: <?php echo esc_html( $item ); ?></p>
</div>
```

You can use `render_iterate()` to echo the output of the iteration directly:

```php
render_iterate( [ 1, 2, 3 ], 'template-parts/number-item' );
```

## View Shortcuts

When inside of a partial, you can prefix your path slug with `_` to load a
sub-partial, appending everything after the `_` to the current partial's file
name (with a dash separating them).

```php title="template-parts/homepage/slideshow.php"
<div class="slideshow">
  @foreach ( $slides as $slide )
    @include( '_slide', [ 'text' => $slide->text ] )
  @endforeach
</div>
```

```php title="template-parts/homepage/slideshow-slide.php"
echo mantle_get_var( 'text', "Slide data!" );
```

## View Caching

Views can be cached using the `cache()` method. This will cache the view output
for a specified duration. The cache will be stored in the WordPress object
cache, allowing it to be shared across requests.

```php
echo cache( 'template-parts/view', [ 'foo' => 'bar' ] )->cache(); // Cache for default of 15 minutes.
echo cache( 'template-parts/view', [ 'foo' => 'bar' ] )->cache( HOUR_IN_SECONDS ); // Cache for a custom TTL.

// You can also specify a cache key:
echo cache( 'template-parts/view', [ 'foo' => 'bar' ] )->cache(
  ttl: HOUR_IN_SECONDS,
  key: 'my-custom-cache-key'
);
```