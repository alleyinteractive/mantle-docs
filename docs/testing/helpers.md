---
title: "Testing: Helpers"
sidebar_label: Helpers
description: Helpers to make it easier to write tests for your project.
---

# Testing: Helpers

Mantle provides some testing helpers to make it easier to write tests for your
project.

## HTML String

The `Mantle\Testing\html_string` helper is used to create a DOMDocument object
from an HTML string. This can be useful when you need to test a function that
returns HTML output and want to make assertions about the generated HTML. You
can use the same methods as the [Element Assertions](./requests.mdx#element-assertions)
feature to make assertions about the HTML string.

```php
use Mantle\Testing\html_string;

html_string(
  '
	<div>
		<section>Example Section</section>
		<div class="test-class">Example Div By Class</div>
		<div id="test-id">Example Div By ID</div>
		<ul>
			<li>Item 1</li>
			<li>Item 2</li>
			<li data-testid="test-item">Item 3</li>
		</ul>
	</div>
  '
)
  ->assertContains( 'Example Section' )
  ->assertElementExists( '//section' )
  ->assertQuerySelectorExists( 'section' )
  ->assertElementExistsById( 'test-id' )
  ->assertElementExistsByTestId( 'test-item' );
```

The HTML string helper returns a [HTML](../features/support/html.mdx) object.

## Getting Output

The [`capture()`](../features/support/helpers.md#capture) helper can be used to capture output
from a callable. It is a replacement for the core's
[`get_echo()` function](https://github.com/WordPress/wordpress-develop/blob/cf5898957e68d4d9fa63b5e89e2bee272391aa92/tests/phpunit/includes/utils.php#L432-L436).

```php
use function Mantle\Support\Helpers\capture;

$output = capture( fn () => the_title() );
```

## Time Mocking

Mantle provides powerful time mocking capabilities to help you test time-dependent functionality in your application. Whether you need to test scheduled events, time-based calculations, or date-specific features, Mantle's time travel helpers make it simple to control the flow of time in your tests.

:::tip
All time modifications are automatically cleaned up after each test, so you don't have to worry about time changes affecting other tests.
:::

### Traveling Through Time

The `travel()` method allows you to set the current time to a specific date and time. All calls to `now()` and `Carbon::now()` will return the time you've set until you travel back or your test ends.

```php
use Mantle\Support\Carbon;

use function Mantle\Support\Helpers\now;

class ScheduledEventTest extends TestCase {
	public function test_event_fires_at_correct_time(): void {
		// Travel to a specific date and time
		$this->travel( Carbon::parse( '2024-01-15 10:00:00' ) );

		// Now all time-based functions will return January 15, 2024 at 10:00 AM
		$this->assertEquals( '2024-01-15 10:00:00', now()->format( 'Y-m-d H:i:s' ) );

		// Test your scheduled event logic here
		$event = ScheduledPost::create([
			'title' => 'Future Post',
			'publish_at' => now()->addHours( 2 ),
		]);

		$this->assertFalse( $event->isPublished() );

		// Travel forward 2 hours
		$this->travel( now()->addHours( 2 ) );

		$this->assertTrue( $event->isPublished() );
	}
}
```

The `travel()` method accepts various date formats, making it flexible for different testing scenarios:

```php
use Mantle\Support\Carbon;

// Using a Carbon instance
$this->travel( Carbon::parse( '2024-01-15 10:00:00' ) );

// Using a DateTime instance
$this->travel( new \DateTime( '2024-01-15 10:00:00' ) );

// Using a string (parsed by Carbon)
$this->travel( '2024-01-15 10:00:00' );

// Using relative time with the now() helper
$this->travel( now()->subDays( 7 ) );
```

### Traveling for a Specific Operation

Sometimes you only need to travel through time for a specific operation and then return to the current time. The `travel_to()` method allows you to travel to a specific time, execute a callback, and then automatically travel back to the current time:

```php
use Mantle\Support\Carbon;

class ExpirationTest extends TestCase {
	public function test_coupon_expiration(): void {
		$coupon = Coupon::create([
			'code' => 'SAVE20',
			'expires_at' => now()->addDays( 7 ),
		]);

		// Coupon should be valid now
		$this->assertTrue( $coupon->isValid() );

		// Travel to 8 days in the future just for this assertion
		$this->travel_to( now()->addDays( 8 ), function () use ( $coupon ) {
			$this->assertFalse( $coupon->fresh()->isValid() );
		} );

		// We're back to the current time
		$this->assertTrue( $coupon->fresh()->isValid() );
	}
}
```

### Traveling Back to Current Time

While time changes are automatically cleaned up after each test, you can manually travel back to the current time using the `travel_back()` method:

```php
class TimeTest extends TestCase {
	public function test_time_sensitive_feature(): void {
		// Travel to a specific time
		$this->travel( Carbon::parse( '2024-01-01 00:00:00' ) );

		// Do some testing...
		$this->assertEquals( '2024-01-01', now()->format( 'Y-m-d' ) );

		// Travel back to current time
		$this->travel_back();

		// Now we're back to the current time
		$this->assertEquals( now()->format( 'Y-m-d' ), ( new \DateTime() )->format( 'Y-m-d' ) );
	}
}
```

### Working with the Carbon Class

Mantle provides its own `Carbon` class that extends Carbon/Carbon with additional functionality for time mocking. You can use it anywhere in your tests to access time-related functionality:

```php
use Mantle\Support\Carbon;

class PostTest extends TestCase {
	public function test_post_scheduling(): void {
		$publishTime = Carbon::parse( '2024-06-15 14:00:00' );

		$post = Post::create([
			'title' => 'Scheduled Post',
			'publish_at' => $publishTime,
		]);

		// Travel to just before publish time
		$this->travel( $publishTime->copy()->subMinute() );
		$this->assertFalse( $post->isPublished() );

		// Travel to publish time
		$this->travel( $publishTime );
		$this->assertTrue( $post->isPublished() );
	}
}
```

For advanced use cases, you can set the test time directly using `Carbon::set_test_now()`:

```php
use Mantle\Support\Carbon;

class AdvancedTimeTest extends TestCase {
	public function test_custom_time_mocking(): void {
		// Set the test time directly
		Carbon::set_test_now( Carbon::parse( '2024-01-01 12:00:00' ) );

		// All Carbon instances will now return this time
		$this->assertEquals( '2024-01-01 12:00:00', Carbon::now()->format( 'Y-m-d H:i:s' ) );

		// Clear the test time
		Carbon::set_test_now( null );
	}
}
```

### Testing with the `now()` Helper

The global `now()` helper automatically respects time mocking, making it perfect for use throughout your application code:

```php
use function Mantle\Support\Helpers\now;

class EventTest extends TestCase {
	public function test_event_timing(): void {
		// Travel to a specific time
		$this->travel( '2024-03-15 09:00:00' );

		// The now() helper returns the mocked time
		$event = Event::create([
			'name' => 'Conference',
			'starts_at' => now(),
			'ends_at' => now()->addHours( 3 ),
		]);

		$this->assertEquals( '2024-03-15 09:00:00', $event->starts_at->format( 'Y-m-d H:i:s' ) );
		$this->assertEquals( '2024-03-15 12:00:00', $event->ends_at->format( 'Y-m-d H:i:s' ) );
	}
}
```