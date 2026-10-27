---
title: Logging
description: Write log messages to error_log, Slack, New Relic, and other channels.
---

# Logging

## Introduction

Mantle provides a logging service built on [Monolog](https://github.com/Seldaek/monolog)
that can write log messages to one or more "channels", such as the PHP error
log, Slack, or New Relic.

## Configuration

Logging is configured in the application's `config/logging.php` file. Each
channel has a `driver` and a minimum `level` of message that it will log. The
`default` option determines which channel is used when writing a message and
defaults to the `LOG_CHANNEL` environment variable.

```php title="config/logging.php"
return [
	'default' => environment( 'LOG_CHANNEL', 'stack' ),

	'channels' => [
		'stack' => [
			'driver'   => 'stack',
			'channels' => [ 'error_log', 'slack' ],
		],

		'error_log' => [
			'driver' => 'error_log',
			'level'  => 'error',
		],

		'slack' => [
			'driver'   => 'slack',
			'url'      => environment( 'SLACK_URL', '' ),
			'username' => environment( 'SLACK_USERNAME', 'Mantle Log' ),
			'emoji'    => ':boom:',
			'level'    => 'critical',
		],
	],
];
```

### Available Channel Drivers

| Driver | Description |
| --- | --- |
| `stack` | Sends messages to each of the channels listed in `channels`. |
| `error_log` | Writes to PHP's `error_log()`. |
| `daily` | Writes to a file at `path` that rotates daily, keeping `days` files (14 by default). |
| `slack` | Sends messages to a Slack webhook `url`. |
| `new_relic` | Sends messages to New Relic. |
| `ai_logger` | Sends messages to the [Alley Logger](https://github.com/alleyinteractive/logger/) plugin. |
| `custom` | Uses a custom Monolog handler class set in `handler`. Arguments for the class can be passed in `handler_with`. |

### Log Levels

Each channel will log messages at or above its `level`. The available levels,
from most to least severe, are: `emergency`, `alert`, `critical`, `error`,
`warning`, `notice`, `info`, and `debug`. Channels without a `level` will log
every message.

## Writing Log Messages

Messages can be written using the `Log` facade. A method is available for each
log level:

```php
use Mantle\Facade\Log;

Log::emergency( $message );
Log::alert( $message );
Log::critical( $message );
Log::error( $message );
Log::warning( $message );
Log::notice( $message );
Log::info( $message );
Log::debug( $message );
```

The `logger()` helper can also be used. When passed a message it will be logged
at the `debug` level, otherwise the logger instance is returned:

```php
use function Mantle\Support\Helpers\logger;

logger( 'Debug message' );

logger()->error( 'Something went wrong.' );
```

### Contextual Information

An array of context data can be passed as the second argument to be included
with the message:

```php
use Mantle\Facade\Log;

Log::info( 'Post was syndicated.', [ 'post_id' => $post->id ] );
```

### Writing to Specific Channels

To write to a channel other than the default, use the `channel()` method. An
array of channels can be passed to write to many channels at once:

```php
use Mantle\Facade\Log;

Log::channel( 'slack' )->critical( 'Something has gone very wrong.' );

Log::channel( [ 'error_log', 'slack' ] )->critical( 'Something has gone very wrong.' );
```

## Listening for Log Messages

A callback can be registered to run whenever a message is logged. The callback
receives a `Mantle\Log\Events\Message_Logged` event with the `$level`,
`$message`, and `$context` of the message:

```php
use Mantle\Facade\Log;
use Mantle\Log\Events\Message_Logged;

Log::listen( function ( Message_Logged $event ) {
	// ...
} );
```
