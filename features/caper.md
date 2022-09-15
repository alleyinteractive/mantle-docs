# Caper

[[toc]]

Mantle includes `Caper` from the [wp-caper][0] package, providing a fluent interface 
for distributing post type, taxonomy, or generic primitive capabilities to roles.

An invocation of `Caper` takes the form of "`<grant to|deny to>` `<these roles>`
`<these capabilities>`":

```php
use Alley\WP\Caper;

Caper::grant_to( 'editor' )->primitives( 'edit_theme_options' );
Caper::deny_to( 'administrator' )->primitives( 'manage_options' );
Caper::grant_to( 'author' )->caps_for( 'page' );
Caper::deny_to( 'editor' )->caps_for( 'category' );
```

[Read the full Caper documentation on GitHub][0].

[0]: https://github.com/alleyinteractive/wp-caper
