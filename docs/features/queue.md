# Queues

Mantle provides a Queue interface for queueing asynchronous jobs that should be
run in the background instead of blocking the user's request. The process is
abstracted so that another queue provider could be used but only
WordPress-backed queues are supported out of the box.

:::tip Mantle's Queue System Can Be Used In Any WordPress Project

Mantle's queue system is designed to be used in any WordPress project, not just
those built with Mantle. You can instantiate the bootloader and then use the
queue without any additional setup.

```php
// Instantiate the bootloader.
bootloader()->boot();

// Dispatch a job.
dispatch( function () {
		// Perform some task...
} );
```
:::

## Creating Jobs

Application jobs are stored in the `apps/jobs` directory. Jobs can be generated
through the `wp-cli` command:

```bash
bin/mantle make:job Send_Welcome_Email
```

That will generate a new job class in `app/jobs/class-send-welcome-email.php` that
looks like this:

```php
namespace App\Jobs;

use Mantle\Contracts\Queue\Can_Queue;
use Mantle\Contracts\Queue\Job;
use Mantle\Queue\Dispatchable;
use Mantle\Queue\Queueable;

/**
 * Send_Welcome_Email Job.
 */
class Send_Welcome_Email implements Job, Can_Queue {
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
use App\Jobs\Send_Welcome_Email;

Send_Welcome_Email::dispatch( $arguments_to_pass_to_constructor );
```

Any arguments passed to the `dispatch` method will be passed to the job's
constructor. The job will be serialized and stored in the database until it is
processed.

You can also dispatch using the `dispatch` helper function:

```php
dispatch( new Send_Welcome_Email( $arguments_to_pass_to_constructor ) );
```

If you need any application services in your job, you can type-hint them in the
handle method and they will be injected automatically:

```php
namespace App\Jobs;

use App\Models\Post;
use App\Services\Example_Service;
use Mantle\Contracts\Queue\Can_Queue;
use Mantle\Contracts\Queue\Job;
use Mantle\Queue\Dispatchable;
use Mantle\Queue\Queueable;

class Send_Welcome_Email implements Job, Can_Queue {
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

### Dispatching Closures/Anonymous Functions

Closures can be dispatched to the queue as well. The closure will be serialized
and unserialized when it is run. Dispatching an anonymous function is an
incredibly powerful tool that can quickly take an expensive operation and move
it to the background.

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

### Dispatch Synchronously

A job can be invoked synchronously and will be run in the current request.

```php
Example_Job::dispatch_now();
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

Dispatching to an isolated/smaller queue can be useful for ensuring that a
specific job is processed before others. For example, a job that sends a welcome
email to a new user might be sent to a `welcome-email` queue to ensure that it
is processed before other jobs that are sent to a larger `default` queue.

## Queue Worker

The queue worker is a scheduled task that runs via cron to process batches of
queued jobs. When a queue job is dispatched, it is stored in the database and a
queue worker batch is scheduled to run. The queue worker will process a batch of
5 jobs by default and can be configured via the `queue.batch_size` configuration
value or `QUEUE_BATCH_SIZE` environment variable.

The queue worker also supports concurrent processing of job batches. By default,
only a single batch will be processed at a time. For sites with a lot of queued
jobs, it may be beneficial to process multiple batches concurrently. This can be
configured via the `queue.max_concurrent_batches` configuration value or
`QUEUE_MAX_CONCURRENT_BATCHES` environment variable. The default value is 1,
meaning only a single batch will be processed at a time. A value of 2 would
allow for two batches to be processed concurrently, and so on. The value should
be adjusted based on the site's server resources and the number of queued jobs.

Jobs will be deleted from the queue after a week once they have either completed
or failed. This can be configured via the `queue.delete_after` configuration
value or `QUEUE_DELETE_AFTER` environment variable.

## Queue Admin

The WordPress-powered queue includes an admin page for monitoring the queue
status, reviewing pending/failed/completed jobs, and retrying failed jobs. It is
accessible via the WordPress admin under the `Tools` menu:

<img src={require('@site/static/img/docs/queue.png').default} alt="Queue Admin" />