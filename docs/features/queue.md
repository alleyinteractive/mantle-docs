---
title: Queues
description: Dispatch jobs and closures to a WordPress-backed queue that runs them in the background.
---

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
use function Mantle\Queue\dispatch;

// Instantiate the bootloader.
bootloader()->boot();

// Dispatch a job.
dispatch( function () {
		// Perform some task...
} );
```
:::

## Creating Jobs

Application jobs are stored in the `app/jobs` directory. Jobs can be generated
with the `make:job` command:

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

dispatch( function () use ( $post ) {
	$post->perform_expensive_operation();
} );
```

Using the `catch` method, you may provide a closure that should be executed if
the queued closure fails to complete successfully after exhausting all of your
queue's configured retry attempts.

```php
dispatch( function () {
	// Perform some task...
} )->catch( function ( Throwable $e ) {
	// Send the exception to Sentry, etc...
} );
```

### Delayed Dispatching

A job can be delayed so that it isn't processed until a later time. The `delay`
method accepts the number of seconds to delay the job or a `DateTimeInterface`
instance:

```php
// Run the job in 10 minutes.
Example_Job::dispatch()->delay( 600 );

// Run the job tomorrow.
Example_Job::dispatch()->delay( now()->addDay() );
```

### Dispatch Synchronously

A job can be invoked synchronously and will be run in the current request.

```php
Example_Job::dispatch_now();
```

### Dispatching After the Request is Sent

If you need to dispatch a job after the response has been sent to the user, you
can use the `dispatch_after_response` method. This is useful for deferring
actions that should be executed after the response has been sent to the user but
before the request is completed.

```php
dispatch( function () {
		// Perform some task...
} )->after_response();

// Or with a job class:
Example_Job::dispatch_after_response();
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

## Handling Failed Jobs

If a job throws an exception, it will be marked as failed. A job can define a
`failed()` method that will be called with the exception when the job fails, as
well as a `completed()` method that will be called when the job completes
successfully:

```php
namespace App\Jobs;

use Mantle\Contracts\Queue\Can_Queue;
use Mantle\Contracts\Queue\Job;
use Mantle\Queue\Dispatchable;
use Mantle\Queue\Queueable;
use Throwable;

class Sync_Post implements Job, Can_Queue {
	use Queueable, Dispatchable;

	public function handle(): void {
		// Sync the post...
	}

	public function failed( Throwable $e ): void {
		// Notify the team about the failure...
	}

	public function completed(): void {
		// Log the successful sync...
	}
}
```

### Retrying Failed Jobs

Failed jobs are not retried by default. To automatically retry a job when it
fails, set the `$retry` property on the job to `true`. The `$retry_backoff`
property sets the number of seconds to wait before the job is retried:

```php
class Sync_Post implements Job, Can_Queue {
	use Queueable, Dispatchable;

	/**
	 * Retry the job if it fails.
	 */
	public bool $retry = true;

	/**
	 * Seconds to wait before retrying the job.
	 */
	public int $retry_backoff = 60;
}
```

:::warning
A job with `$retry` enabled will be retried every time it fails. Make sure the
job can eventually succeed or disable retries on it (for example, in the
`failed()` method) to prevent it from retrying forever.
:::

Failed jobs can also be retried manually from the [queue admin](#queue-admin).

### Job Timeout

While a job is running it is locked to prevent it from being run more than once.
The lock is held for 10 minutes by default. Jobs that take longer can increase
the lock by setting the `$timeout` property to the number of seconds the job may
run for:

```php
public int $timeout = 1800;
```

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

### Running the Queue Manually

The queue can be processed from the command line with the `queue:run` command.
The command accepts the name of the queue to run (defaulting to `default`) and
an optional `--count` of jobs to process (defaulting to the batch size):

```bash
wp mantle queue:run
wp mantle queue:run priority --count=50
```

Old completed and failed jobs can be deleted immediately with the
`queue:cleanup` command:

```bash
wp mantle queue:cleanup
```

## Configuration

The queue is configured in the application's `config/queue.php` file:

| Key | Environment Variable | Default | Description |
| --- | --- | --- | --- |
| `default` | `QUEUE_CONNECTION` | `wordpress` | The queue provider to use. |
| `batch_size` | `QUEUE_BATCH_SIZE` | `5` | The number of jobs processed in one run of the queue. |
| `max_concurrent_batches` | `QUEUE_MAX_CONCURRENT_BATCHES` | `1` | The maximum number of batches that can run concurrently. |
| `delete_after` | `QUEUE_DELETE_AFTER` | 1 week | Seconds to keep completed and failed jobs before deleting them. |
| `enable_admin` | `QUEUE_ENABLE_ADMIN` | `true` | Whether to show the [queue admin](#queue-admin). |
| `wordpress.delay` | `QUEUE_DELAY` | `0` | Seconds to wait between runs of the queue. |

The `batch_size`, `max_concurrent_batches`, and `delay` values can be set for a
specific queue under the `wordpress.queues` key:

```php title="config/queue.php"
'wordpress' => [
	'delay'  => environment( 'QUEUE_DELAY', 0 ),
	'queues' => [
		'priority' => [
			'batch_size'             => 20,
			'max_concurrent_batches' => 3,
		],
	],
],
```

## Queue Events

The queue fires [events](./hooks.md) as jobs are queued and processed. Each
event includes the queue `$provider` and the `$job`:

| Event | Fired |
| --- | --- |
| `Mantle\Queue\Events\Job_Queued` | When a job is added to the queue. |
| `Mantle\Queue\Events\Run_Start` | Before a batch of jobs is run. Includes the `$queue` and `$jobs`. |
| `Mantle\Queue\Events\Job_Processing` | Before a job is run. |
| `Mantle\Queue\Events\Job_Processed` | After a job has run successfully. |
| `Mantle\Queue\Events\Job_Failed` | After a job has failed. Includes the exception as `$e`. |
| `Mantle\Queue\Events\Run_Complete` | After a batch of jobs is run. Includes the `$queue` and `$jobs`. |

```php
use Mantle\Facade\Event;
use Mantle\Queue\Events\Job_Failed;

Event::listen( Job_Failed::class, function ( Job_Failed $event ) {
	// Report $event->e...
} );
```

## Testing

Queued jobs can be asserted against and processed in tests. See [Testing: Cron
and Queue](../testing/cron.md#queue) for more information.

## Queue Admin

The WordPress-powered queue includes an admin page for monitoring the queue
status, reviewing pending/failed/completed jobs, and retrying failed jobs. It is
accessible via the WordPress admin under the `Tools` menu and can be disabled by
setting the `queue.enable_admin` configuration value or `QUEUE_ENABLE_ADMIN`
environment variable to `false`:

<img src={require('@site/static/img/docs/queue.png').default} alt="Queue Admin" />