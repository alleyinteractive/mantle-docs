# Pipeline

Mantle includes a pipeline class that uses the pipeline pattern to process a
series of tasks in a specific order. This can be useful for processing data
through a series of filters or middleware. The pipeline class powers the
application's middleware for routing, databases, etc.

## Usage

To use the pipeline class, you can use the following pattern:

```php
use Closure;
use Mantle\Support\Pipeline;

$result = ( new Pipeline() )
  ->send( $data )
  ->through( [
    // Middleware as a closure.
    function ( mixed $data, Closure $next ) {
      // Your task code here.

      return $next( $data );
    },

    // Modify the result of the pipeline.
    function ( mixed $data, Closure $next ) {
      $result = $next( $data );

      // Modify the result of the pipeline.

      return $result;
    },

    // Middleware can also be passed as a class name.
    ExampleMiddleware::class,
  ] )
  ->then( function ( mixed $data ) {
    // Your final task code here.

    return $data;
  } );
```

When the pipeline is executed, the data will be passed through each middleware
in the order they are defined. The `send` method is used to pass the initial
data to the pipeline. The `through` method is used to define the middleware to
be executed. The `then` method is used to define the final task to be executed
after all middleware have been processed.

Each middleware "pipe" can modify the initial data that is passed on to the next
pipe as well as modify the data that is returned from the pipeline.