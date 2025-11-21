---
title: "Testing: Pest"
sidebar_label: Pest
description: Mantle's Testing Framework supports running unit tests via Pest.
---
# Testing: Pest

Mantle's Testing Framework supports running unit tests via Pest via the
[alleyinteractive/pest-plugin-wordpress
plugin](https://github.com/alleyinteractive/pest-plugin-wordpress). Pest tests
using Mantle can be run with or without the rest of the framework.

<img src="https://pestphp.com/assets/img/pestinstall.png" alt="Pest Logo" width="300" />

Let's take a look at a quick example of a Pest test case using Mantle:

```php
use function Pest\PestPluginWordPress\from;
use function Pest\PestPluginWordPress\get;

it( 'should load the homepage', function () {
    get( '/' )
        ->assertStatus( 200 )
        ->assertSee( 'home' );
} );

it( 'should load with a referrer', function () {
    from( 'https://laravel.com/' )
        ->get( '/' )
        ->assertStatus( 200 );
});
```

For more information, [checkout the plugin's
GitHub](https://github.com/alleyinteractive/pest-plugin-wordpress#getting-started).