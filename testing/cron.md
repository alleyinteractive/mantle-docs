# Cron / Queue Assertions

[[toc]]

Cron and queue jobs can be asserted in unit tests.

## Cron

* `assertInCronQueue( string $action, array $args = [] )`
* `assertNotInCronQueue( string $action, array $args = [] )`
* `dispatch_cron( string $action = null )`

```php
$this->assertNotInCronQueue( 'example' );

wp_schedule_single_event( time(), 'example' );

$this->assertInCronQueue( 'example' );

$this->dispatch_cron( 'example' );
$this->assertNotInCronQueue( 'example' );
```

## Queue

* `assertJobQueued( $job, array $args = [], string $queue = null )`
* `assertJobNotQueued( $job, array $args = [], string $queue = null )`
* `dispatch_queue( string $queue = null )`

```php
$job = new Example_Job( 1, 2, 3 );

// Assert if a job class with a set of arguments is not in the queue.
$this->assertJobNotQueued( Example_Job::class, [ 1, 2, 3 ] );

// Assert if a specific job is not in the queue.
$this->assertJobNotQueued( $job );

Example_Job::dispatch( 1, 2, 3 );

$this->assertJobQueued( Example_Job::class, [ 1, 2, 3 ] );
$this->assertJobQueued( $job );

// Fire the queue.
$this->dispatch_queue();

$this->assertJobNotQueued( Example_Job::class, [ 1, 2, 3 ] );
$this->assertJobNotQueued( $job );
```