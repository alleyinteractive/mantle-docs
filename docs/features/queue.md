# Queues

Mantle provides a Queue interface for queueing asynchronous jobs that should be
run in the background instead of blocking the user's request. By default, the
queue is powered through the WordPress cron but is abstracted so that it could
add additional providers in the future.

## Creating Jobs

Application jobs are stored in the `apps/jobs` directory. Jobs can be generated
through the `wp-cli` command:

```bash
bin/mantle make:job Example_Job
```

That will generate a new job class in `app/jobs/class-example-job.php` that
looks like this:

```php
namespace App\Jobs;

use Mantle\Contracts\Queue\Can_Queue;
use Mantle\Contracts\Queue\Job;
use Mantle\Queue\Dispatchable;
use Mantle\Queue\Queueable;

/**
 * Example Job that can be queued.
 */
class Example_Job implements Job, Can_Queue {
	use Queueable, Dispatchable;

	/**
	 * Handle the job.
	 */
	public function handle() {
		// Handle it here!
	}
}
```

## Dispatching Jobs

Once you have a job class you can dispatch to it from anywhere in your
application.

```php
use App\Jobs\Example_Job;

Example_Job::dispatch( $arguments_to_pass_to_constructor );
```

Any arguments passed to the `dispatch` method will be passed to the job's
constructor. The job will be serialized and stored in the database until it is
processed.

If you need any application services in your job, you can typehint them in the
handle method and they will be injected automatically:

```php
namespace App\Jobs;

use App\Models\Post;
use App\Services\Example_Service;
use Mantle\Contracts\Queue\Can_Queue;
use Mantle\Contracts\Queue\Job;
use Mantle\Queue\Dispatchable;
use Mantle\Queue\Queueable;

/**
 * Example Job that can be queued.
 */
class Example_Job implements Job, Can_Queue {
	use Queueable, Dispatchable;

    /**
     * Create a new job instance.
     *
     * @param Post $post
     */
    public function __construct( public Post $post ) {}

	/**
	 * Handle the job.
	 */
	public function handle( Example_Service $service ) {
        // Service is automatically injected at runtime.
	}
}
```

The above job can be dispatched like this:

```php
$post = App\Models\Post::find( 1 );

Example_Job::dispatch( $post );
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
