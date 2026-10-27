---
title: Error Handling
description: Report and render exceptions with Mantle's exception handler.
---

# Error Handling

## Introduction

Exceptions thrown by your application are handled by the application's exception
handler. The handler is responsible for reporting exceptions (logging them) and
rendering them into a response for the user. Mantle applications include an
`App\Exceptions\Handler` class in `app/exceptions/class-handler.php` that is
registered in `bootstrap/app.php`:

```php title="bootstrap/app.php"
use Mantle\Framework\Bootloader;

return Bootloader::create()
	->with_exception_handler( App\Exceptions\Handler::class )
	// ...
```

If no handler is registered, Mantle will use the default
`Mantle\Framework\Exceptions\Handler`.

## Configuration

The `debug` option in `config/app.php` determines how much information about an
error is displayed to the user. It defaults to the `APP_DEBUG` environment
variable, falling back to `WP_DEBUG`. When enabled, a detailed error page with a
stack trace is displayed. It should always be disabled in production.

## Reporting Exceptions

Exceptions are reported by sending them to the application's
[logger](./logging.md) at the `error` level. Context about the current site and
user is added to the log message automatically.

### Ignoring Exceptions by Type

Exceptions that should never be reported can be added to the `$dont_report`
property of the application's exception handler:

```php
namespace App\Exceptions;

use App\Exceptions\Invalid_Order_Exception;
use Mantle\Framework\Exceptions\Handler as Base_Handler;

class Handler extends Base_Handler {
	/**
	 * A list of the exception types that should not be reported.
	 *
	 * @var string[]
	 */
	protected $dont_report = [
		Invalid_Order_Exception::class,
	];
}
```

Mantle does not report HTTP exceptions (such as 404s), authentication errors,
model not found exceptions, or console "command not found" exceptions.

### Exception Log Levels

The log level used to report an exception can be customized with the `level()`
method on the handler:

```php
use App\Exceptions\Invalid_Order_Exception;
use Mantle\Contracts\Exceptions\Handler;
use Psr\Log\LogLevel;

app( Handler::class )->level( Invalid_Order_Exception::class, LogLevel::WARNING );
```

### Custom Reporting

An exception can define its own `report()` method, which will be called instead
of the default logging. Dependencies can be type-hinted on the method and will
be injected by the container. An exception can also define a `context()` method
to add data to the log message:

```php
namespace App\Exceptions;

use Exception;

class Invalid_Order_Exception extends Exception {
	public function __construct( public readonly int $order_id ) {
		parent::__construct( 'Invalid order.' );
	}

	public function context(): array {
		return [ 'order_id' => $this->order_id ];
	}
}
```

### The `report` Helper

An exception can be reported without interrupting the current request using the
`report()` helper. A string can be passed as well and will be converted to an
exception:

```php
try {
	// Validate the value...
} catch ( Throwable $e ) {
	report( $e );
}

report( 'Something went wrong.' );
```

## Rendering Exceptions

Exceptions are rendered as an HTML error page, or as JSON when the request
expects a JSON response. An exception can control how it is rendered by
defining a `render()` method that returns a response:

```php
namespace App\Exceptions;

use Exception;
use Mantle\Http\Request;

class Invalid_Order_Exception extends Exception {
	public function render( Request $request ) {
		return response()->view( 'errors/invalid-order', status: 422 );
	}
}
```

### HTTP Exceptions

The `abort()` helper will throw an HTTP exception with the given status code,
which will be rendered as an error page with that status. A message and headers
can be passed as well:

```php
abort( 404 );

abort( 403, 'You cannot view this page.' );
```

Models that cannot be found through [route model
binding](./requests.md#route-model-binding) or `find_or_fail()` will be
converted to a 404 response automatically.

### Custom Error Pages

When debug mode is disabled, Mantle will render the `error/error-{code}.php`
view (falling back to `error/error.php`) from your application's `views`
directory. The view receives the `$code` and `$exception` variables:

```text
views/
└── error/
	├── error-404.php
	└── error.php
```

The view used can be changed with the `mantle_exception_view` filter, which
receives the view's slug and name:

```php
add_filter(
	'mantle_exception_view',
	fn ( array $view, Throwable $e ) => [ 'errors/error', (string) $view[1] ],
	10,
	2,
);
```
