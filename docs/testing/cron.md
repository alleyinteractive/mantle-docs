---
title: "Testing: Cron and Queue"
sidebar_label: Cron and Queue
description: Cron and queue jobs can be asserted in unit tests.
---
# Testing: Cron / Queue

## Introduction

Cron and queue jobs can be asserted in unit tests.

## Dispatching Cron

The WordPress cron can be dispatched by calling `dispatch_cron()` and optionally
passing the action name to run.

```php
namespace App\Tests;

class Dispatch_Cron_Test extends Test_Case {
  public function test_cron() {
    $this->dispatch_cron( 'example' );

    // ...
  }
}
```

## Asserting Cron Actions

The `assertInCronQueue()` and `assertNotInCronQueue()` methods can be used to
assert if a cron action is in the queue.

```php
namespace App\Tests;

class Cron_Test extends Test_Case {
  public function test_cron() {
    $this->assertNotInCronQueue( 'example' );

    wp_schedule_single_event( time(), 'example' );

    $this->assertInCronQueue( 'example' );

    $this->dispatch_cron( 'example' );

    $this->assertNotInCronQueue( 'example' );
  }
}
```

## Queue

The [Mantle Queue](../features/queue.md) can be run and asserted against in unit tests.

```php
namespace App\Tests;

use App\Jobs\Example_Job;

class Example_Queue_Test extends Test_Case {
  public function test_queue() {
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
  }
}
```