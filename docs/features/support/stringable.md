# Stringable

The Stringable class exists in the `Mantle\Support` namespace and is used to create a stringable object from a string or a stringable object.

For more information see the [Laravel docs](https://laravel.com/docs/master/strings#method-str).

## Usage

```php
use function Mantle\Support\Helpers\stringable;

$string = stringable( 'String' ); // String

$string->append( 'append' )->lower(); // stringappend
```
