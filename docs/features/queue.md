# Queues

Mantle provides a Queue interface for queueing asynchronous jobs that should be
run in the background instead of blocking the user's request. By default, the
queue is powered through the WordPress cron but is abstracted so that it could
add additional providers in the future.

The queue configuration is stored in `config/queue.php` where you can configure
the default provider and additional parameters such as how long the cron should
wait before running the next batch of queued tasks.

## Creating Jobs

Application jobs are stored in the `apps/jobs` directory. Jobs can be generated
through the `wp-cli` command:

```bash
wp mantle make:job Example_Job
```

## Dispatching Jobs

Once you have a job class you can dispatch to it from anywhere in your
application.

```php
use App\Jobs\Example_Job;

Example_Job::dispatch( $post_data_to_include );
```

### Dispatching Closures

Closures can be dispatched to the queue as well. The closure will be serialized
and unserialized when it is run.

```php
$post = App\Models\Post::find( 1 );

dispatch( function() use ( $post ) {
    $post->perform_expensive_operation();
} );
```

Using the `catch` method, you may provide a closure that should be executed if
the queued closure fails to complete successfully after exhausting all of your
queue's configured retry attempts.

```php
dispatch( function() {
    // Perform some task...
} )->catch( function( Exception $e ) {
    // Send the exception to Sentry, etc...
} );
```

### Multiple Queues

To allow for some priority between jobs a job can be sent to a specific queue.
By default all jobs will be sent to the `default` queue. A job can be
selectively sent to a smaller/different queue to allow for some priority among
jobs.

```php
// Sent to the 'default' queue.
Example_Job::dispatch();

// Sent to the 'priority' queue.
Example_Job::dispatch()->on_queue( 'priority' );
```

### Dispatch Synchronously

A job can be invoked synchronously and will be run in the current request.

```php
Example_Job::dispatch_now();
```

## Future Additions

In the future, we hope to add better processing for failed jobs and better
support for concurrency among jobs.
