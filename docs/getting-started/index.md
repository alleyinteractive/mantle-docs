---
title: Getting Started
description: Learn about Mantle and how it can help you build enterprise-level WordPress applications.
---

# Mantle

Welcome to the Mantle—a modern and powerful toolkit built atop
WordPress to streamline and elevate enterprise WordPress applications. Whether
you’re an experienced developer or new to enterprise-level WordPress
development, Mantle provides a structured, flexible foundation for building
complex applications, without sacrificing the extensibility and accessibility of
WordPress.

Mantle always uses the same underlying WordPress APIs and functions you know and
love. It doesn't replace WordPress, but rather enhances it with modern
development practices and tools.

## What is Mantle?

Mantle is an object-oriented framework designed to enhance WordPress for
enterprise projects by providing essential abstractions, utility functions, and
best practices for developing clean, maintainable code. Built to optimize
performance, scalability, and developer productivity, Mantle bridges the gap
between WordPress’s approachable CMS features and the advanced requirements of
modern web applications.

Mantle brings a Laravel-inspired flexibility to WordPress, bringing the latest
and greatest to WordPress development. It provides a structured, organized
framework for building complex applications, while still leveraging the
extensibility and accessibility of WordPress.

### Provides a Model Toolkit for Interacting with Data

Mantle provides a robust model toolkit for interacting with data in WordPress.
Models allow you to interact with your database in a more object-oriented way
and removes most of the quirks of dealing with WordPress' API (attributes passed
to `wp_insert_post()` for example).

```php
use Mantle\Database\Model\Post;

$post = Post::create( [
  'post_title'   => 'My New Post',
  'post_content' => 'This is the content of my new post.',
] );

$post->post_content = 'This is an updated content.';

$post->save( [
  'post_title' => 'My Updated Post',
] );

// You can also query for posts.
$posts = Post::where( 'post_title', 'Example Title' )->get();
```

For more information about models, see the [documentation](../models/index.md).

### Use Blade Templating

Mantle allows you to use Blade templating in your WordPress project. Blade is a
powerful templating engine that allows you to write clean, concise templates
without the clutter of PHP tags.

```php title="ExampleController.php"
class ExampleController extends Controller {
    public function index() {
        $posts = Post::all();

        return view('posts', ['posts' => $posts]);
    }
}
```

```php title="resources/views/posts.blade.php"
<div class="posts">
    @foreach ($posts as $post)
        <div class="post">
            <h2>{{ $post->title }}</h2>

            {{-- Display the post image if it exists --}}
            @if ($post->image_url)
                <img src="{{ $post->image_url }}" alt="{{ $post->title }} image" class="post-image">
            @endif

            <p>{{ $post->content }}</p>
        </div>
    @endforeach
</div>
```

For more information about blade and other templating, see the
[documentation](../basics/templating.md).

### Create Custom Routes with Fluent Routing

Mantle provides a fluent routing system that allows you to define custom routes
for your WordPress application. This makes it easy to create custom endpoints for
your application. It also provides a way to define REST API routes in a
structured way.

```php
use Mantle\Facade\Route;

Route::get( '/posts', 'PostController@index' );

Route::get( '/post/{post}', function ( Post $post ) {
  return view( 'post' )->with( 'post', $post );
} );

Route::post( '/upload/', function ( Request $post ) {
  $attachment_id = $request->file( 'uploaded_image' )->store_as_attachment();

  return response()->json( [
    'attachment_id' => $attachment_id,
    'message'       => 'Image uploaded successfully',
  ] );
} );

Route::rest_api( 'namespace/v1', '/route-to-use', function() {
  return [ ... ];
} );
```

For more information about fluent routing, see the [documentation](../basics/requests.md).

### Independent Testing Framework

Mantle provides a isolated testing framework that allows you to write tests for
your WordPress application. Similar to Laravel, you can use Mantle's testing
framework to perform HTTP request inspection, database seeding, and more.

```php
$post = static::factory()->post->create_and_get();

$this->get( $post )
  ->assertOk()
  ->assertSee( $post->post_title );

$this->post( '/upload', [
  'uploaded_file' => [ ... ],
] )
  ->assertStatus( 201 )
  ->assertJsonPath( 'message', 'Image uploaded successfully' );
```

For more information about testing, see the [documentation](../testing/index.md).

## Who is Mantle For?

Mantle is for developers and technical teams working with WordPress in
environments where scalability, flexibility, and reliability are paramount. If
your project involves complex data modeling, customized RESTful APIs, advanced
caching, or intricate frontend requirements, Mantle equips you with the tools to
build with confidence.

- Agencies and In-House Development Teams building bespoke WordPress
  applications for enterprise clients. Mantle can be used to build new projects
  from scratch or to enhance existing ones.
- Advanced WordPress Developers seeking a cleaner, more organized framework for
  handling complex applications with DRY and MVP principles.
- Product Owners looking to streamline development processes, reduce technical
  debt, and ensure maintainable codebases.

## How can I get started with Mantle?

To get started with Mantle, continue with the [installation guide](./installation.md).