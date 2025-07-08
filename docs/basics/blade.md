---
description: Use Blade Templating with WordPress to create elegant, dynamic views.
---
# Blade Templating

Mantle brings the power and elegance of [Laravel's Blade templating
engine](https://laravel.com/docs/master/blade) to WordPress. Blade provides a
clean, powerful templating syntax that makes it easy to build dynamic views
while maintaining the flexibility you need for WordPress development.

Blade templates can be used seamlessly alongside traditional PHP templates in
Mantle. The framework automatically detects the file extension and uses the
appropriate template engine, giving you the freedom to choose the right tool for
each situation.

## Getting Started

### Basic Blade Syntax

Blade templates use the `.blade.php` file extension and support all standard
Blade syntax:

```php title="views/welcome.blade.php"
<h1>Welcome to {{ $site_name }}</h1>
<p>Today is {{ date('Y-m-d') }}</p>

@if ($user_logged_in)
    <p>Hello, {{ $current_user->display_name }}!</p>
@else
    <p><a href="{{ wp_login_url() }}">Please log in</a></p>
@endif
```

### Displaying Data

Use double curly braces to display data. Blade automatically escapes the output
to prevent XSS attacks:

```php
{{-- Escaped output (safe) --}}
<h1>{{ $post->post_title }}</h1>
<p>{{ $post->post_content }}</p>

{{-- Raw, unescaped output (use with caution) --}}
<div class="content">
    {!! $post->post_content !!}
</div>
```

### Accessing WordPress Functions

You can call WordPress functions directly in Blade templates:

```php title="views/post-meta.blade.php"
<article class="post">
    <h1>{{ the_title() }}</h1>

    <div class="post-meta">
        <span>By {{ the_author() }}</span>
        <time datetime="{{ get_the_date('c') }}">{{ the_date() }}</time>
    </div>

    <div class="post-content">
        {!! the_content() !!}
    </div>

    @if(has_post_thumbnail())
        <div class="featured-image">
            {!! the_post_thumbnail('large') !!}
        </div>
    @endif
</article>
```

## Control Structures

Blade provides elegant alternatives to PHP's control structures:

### Conditional Statements

```php
@if (is_user_logged_in())
    <p>Welcome back!</p>
@elseif(is_front_page())
    <p>Welcome to our homepage!</p>
@else
    <p>Hello, visitor!</p>
@endif

{{-- Short conditional --}}
@auth
    <p>You are logged in</p>
@endauth

@guest
    <p>Please log in</p>
@endguest

{{-- Custom conditional --}}
@unless(is_admin())
    <p>This is not the admin area</p>
@endunless
```

### Loops

```php
@foreach ($posts as $post)
    <article>
        <h2>{{ $post->post_title }}</h2>
        <p>{{ wp_trim_words($post->post_content, 20) }}</p>
    </article>
@endforeach

@forelse ($comments as $comment)
    <div class="comment">
        <h4>{{ $comment->comment_author }}</h4>
        <p>{{ $comment->comment_content }}</p>
    </div>
@empty
    <p>No comments yet.</p>
@endforelse

@for ($i = 1; $i <= 5; $i++)
    <p>Item {{ $i }}</p>
@endfor

@while (have_posts())
    {{ the_post() }}
    <article>
        <h2>{{ the_title() }}</h2>
        {!! the_content() !!}
    </article>
@endwhile
```

### Loop Variables

Blade provides helpful loop variables:

```php
@foreach($posts as $post)
    <article class="@if($loop->first) first @endif @if($loop->last) last @endif">
        <h2>Post #{{ $loop->iteration }}: {{ $post->post_title }}</h2>

        @if($loop->even)
            <p class="even-post">This is an even-numbered post</p>
        @endif

        <p>{{ $loop->remaining }} posts remaining</p>
    </article>
@endforeach
```

Available loop variables:
- `$loop->index` - The index of the current loop iteration (starts at 0)
- `$loop->iteration` - The current loop iteration (starts at 1)
- `$loop->remaining` - The iterations remaining in the loop
- `$loop->count` - The total number of items in the array
- `$loop->first` - Whether this is the first iteration
- `$loop->last` - Whether this is the last iteration
- `$loop->even` - Whether this is an even iteration
- `$loop->odd` - Whether this is an odd iteration
- `$loop->depth` - The nesting level of the current loop
- `$loop->parent` - When in a nested loop, the parent's loop variable

## Template Inheritance

One of Blade's most powerful features is template inheritance, allowing you to
create a master layout and extend it:

### Creating a Layout

```php title="views/layouts/app.blade.php"
<!DOCTYPE html>
<html {{ language_attributes() }}>
<head>
    <meta charset="{{ get_bloginfo('charset') }}">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', get_bloginfo('name'))</title>
    {{ wp_head() }}
</head>
<body {{ body_class() }}>
    <header class="site-header">
        <h1><a href="{{ home_url() }}">{{ get_bloginfo('name') }}</a></h1>

        @include('partials.navigation')
    </header>

    <main class="site-main">
        @yield('content')
    </main>

    <footer class="site-footer">
        @include('partials.footer')
    </footer>

    {{ wp_footer() }}
</body>
</html>
```

### Extending the Layout

```php title="views/single.blade.php"
@extends('layouts.app')

@section('title', $post->post_title . ' - ' . get_bloginfo('name'))

@section('content')
    <article class="post">
        <header class="post-header">
            <h1>{{ $post->post_title }}</h1>
            <div class="post-meta">
                <span>By {{ get_the_author_meta('display_name', $post->post_author) }}</span>
                <time datetime="{{ get_the_date('c', $post) }}">
                    {{ get_the_date('F j, Y', $post) }}
                </time>
            </div>
        </header>

        <div class="post-content">
            {!! apply_filters('the_content', $post->post_content) !!}
        </div>

        @if($post->tags)
            <footer class="post-footer">
                <div class="post-tags">
                    <h3>Tags:</h3>
                    @foreach($post->tags as $tag)
                        <a href="{{ get_tag_link($tag->term_id) }}" class="tag">
                            {{ $tag->name }}
                        </a>
                    @endforeach
                </div>
            </footer>
        @endif
    </article>

    @include('partials.comments', ['post_id' => $post->ID])
@endsection
```

## Including Sub-Views

Break your templates into smaller, reusable pieces:

```php title="views/partials/post-card.blade.php"
<article class="post-card">
    <header>
        @if(has_post_thumbnail($post->ID))
            <div class="post-thumbnail">
                {!! get_the_post_thumbnail($post->ID, 'medium') !!}
            </div>
        @endif

        <h2>
            <a href="{{ get_permalink($post->ID) }}">{{ $post->post_title }}</a>
        </h2>
    </header>

    <div class="post-excerpt">
        {{ wp_trim_words($post->post_content, 30) }}
    </div>

    <footer>
        <a href="{{ get_permalink($post->ID) }}" class="read-more">
            Read More
        </a>
    </footer>
</article>
```

Include it in other templates:

```php title="views/archive.blade.php"
@extends('layouts.app')

@section('content')
    <div class="post-grid">
        @foreach($posts as $post)
            @include('partials.post-card', ['post' => $post])
        @endforeach
    </div>

    {{-- Pagination --}}
    @if($pagination)
        <nav class="pagination">
            {!! $pagination !!}
        </nav>
    @endif
@endsection
```

## Working with WordPress Data

### Setting the Global Post Object

When working with WordPress template functions, you may need to set the global
post object:

```php title="routes/web.php"
Route::get('/article/{post}', function (Post $post) {
    return view('single')
        ->with('post', $post)
        ->set_post($post); // Sets the global $post object
});
```

```php title="views/single.blade.php"
<article>
    {{-- These WordPress functions now work because $post is set globally --}}
    <h1>{{ the_title() }}</h1>
    <div class="content">{{ the_content() }}</div>

    {{-- You can also use the passed variable --}}
    <p>Published: {{ $post->post_date }}</p>
</article>
```

### Using the Loop Helper

Mantle provides helpful functions for working with post collections:

```php title="ExampleController.php"
public function index() {
    $posts = Post::published()->take(10)->get();

    return view('post-list', [
        'posts' => $posts
    ]);
}
```

```php title="views/post-list.blade.php"
<div class="post-list">
    {!! loop($posts, 'partials.post-card') !!}
</div>
```

### Custom Loops with Template Parts

```php title="views/homepage.blade.php"
@extends('layouts.app')

@section('content')
    <section class="featured-posts">
        <h2>Featured Posts</h2>

        @php
            $featured_posts = get_posts([
                'meta_key' => 'featured',
                'meta_value' => '1',
                'posts_per_page' => 3
            ]);
        @endphp

        @if($featured_posts)
            <div class="featured-grid">
                @foreach($featured_posts as $post)
                    @php(setup_postdata($post))
                    @include('partials.featured-post-card')
                @endforeach
                @php(wp_reset_postdata())
            </div>
        @endif
    </section>

    <section class="recent-posts">
        <h2>Recent Posts</h2>
        {!! loop(Post::recent()->limit(6)->get(), 'partials.post-card') !!}
    </section>
@endsection
```

## Advanced Features

<!-- ### Blade Components

Create reusable components for common UI elements:

```php title="views/components/alert.blade.php"
<div class="alert alert-{{ $type ?? 'info' }} {{ $class ?? '' }}">
    @if($title ?? false)
        <h4 class="alert-title">{{ $title }}</h4>
    @endif

    <div class="alert-content">
        {{ $slot }}
    </div>

    @if($dismissible ?? false)
        <button type="button" class="alert-dismiss" data-dismiss="alert">
            &times;
        </button>
    @endif
</div>
```

Use the component:

```php
@component('components.alert', ['type' => 'success', 'title' => 'Success!'])
    Your post has been published successfully.
@endcomponent

@component('components.alert', ['type' => 'warning', 'dismissible' => true])
    Please verify your email address.
@endcomponent
``` -->

### Custom Blade Directives

You can create custom Blade directives for common WordPress patterns:

```php title="app/Providers/View_Service_Provider.php"
use Mantle\Facade\Blade;

class View_Service_Provider extends Service_Provider {
    public function boot() {
      // Custom directive for WordPress capability checks
      Blade::directive('can', function ($capability) {
        return "<?php if (current_user_can($capability)): ?>";
      });

      Blade::directive('endcan', function () {
        return "<?php endif; ?>";
      });

      // Custom directive for WordPress nonces
      Blade::directive('nonce', function ($action) {
        return "<?php echo wp_nonce_field($action); ?>";
      });
    }
}
```

Use your custom directives:

```php
@can('edit_posts')
    <a href="{{ admin_url('post-new.php') }}" class="button">
        Create New Post
    </a>
@endcan

<form method="post" action="{{ admin_url('admin-post.php') }}">
    @nonce('my_form_action')
    <input type="hidden" name="action" value="my_form_handler">
    <!-- form fields -->
</form>
```

### Render Blade Dynamically

Mantle provides a convenient way to render Blade templates directly from strings
using `Blade::render_string()`. This is useful when you need to generate
templates dynamically at runtime, rather than from static files.

#### Example

```php
use Mantle\Facade\Blade;

// Render a Blade template from a string
$output = Blade::render_string( 'Hello, {{ $name }}!', [ 'name' => 'World' ] );
// $output: "Hello, World!"
```

:::note
When rendering templates from strings, ensure that any user-provided content is properly escaped to prevent security issues.
:::

## File Organization

Organize your Blade templates in a logical structure:

```
views/
├── layouts/
│   ├── app.blade.php
│   ├── admin.blade.php
│   └── email.blade.php
├── pages/
│   ├── home.blade.php
│   ├── about.blade.php
│   └── contact.blade.php
├── posts/
│   ├── single.blade.php
│   ├── archive.blade.php
│   └── search.blade.php
├── partials/
│   ├── header.blade.php
│   ├── footer.blade.php
│   ├── navigation.blade.php
│   ├── post-card.blade.php
│   └── sidebar.blade.php
├── components/
│   ├── alert.blade.php
│   ├── modal.blade.php
│   └── form-field.blade.php
└── emails/
    ├── welcome.blade.php
    └── notification.blade.php
```

## Integration with WordPress Themes

Blade templates work seamlessly in WordPress themes. You can gradually migrate
from PHP templates to Blade:

### Theme Template Hierarchy

Blade templates follow WordPress template hierarchy:

```
themes/your-theme/
├── index.blade.php          (fallback template)
├── home.blade.php           (homepage)
├── single.blade.php         (single posts)
├── page.blade.php           (static pages)
├── archive.blade.php        (archives)
├── search.blade.php         (search results)
├── 404.blade.php           (not found)
└── single-{post-type}.blade.php  (custom post types)
```

### Mixed Template Usage

You can use both PHP and Blade templates in the same theme:

```php
// WordPress will use single.blade.php if it exists
// Otherwise it falls back to single.php
themes/your-theme/
├── single.blade.php    ← Blade template (preferred)
├── single.php          ← PHP fallback
├── page.blade.php      ← Blade template
└── archive.php         ← PHP template
```

## Conclusion

Blade templating brings modern, clean syntax to WordPress development while
maintaining full compatibility with WordPress features and functions. By
leveraging Blade's powerful features like template inheritance, components, and
control structures, you can create more maintainable and elegant templates for
your WordPress applications.

For more information about templating in Mantle, see the [Templating and Views
documentation](./templating.md). To learn more about Blade syntax and features,
refer to the [official Laravel Blade
documentation](https://laravel.com/docs/master/blade).