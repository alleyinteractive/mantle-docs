---
title: "Console Commands"
sidebar_label: Console
---

# Console Commands

## Introduction

Mantle provides a console application that is integrated with WP-CLI to make
running commands easier. Out of the box, Mantle includes a `bin/mantle` console
application that can do a number of things without connecting to WordPress or
the database.

```bash
bin/mantle <command>
```

The `bin/mantle` application allows you to generate classes, models, etc. as
well as discover the current state of the application. For example, you can run
`bin/mantle model:discover` to automatically register all the models in the
application without needing to install WordPress. This is incredibly useful in a
CI/CD environment where you want to prepare the application for deployment.

The application also integrates with WP-CLI. Running `wp mantle <command>` will
provide an even larger set of commands that can be run through the application
and interact with WordPress/the database.

### Generating a Command

To generate a new command, you may use the `make:command` command. This command
will create a new command class in the `app/console` directory. The command will
also be automatically discovered and registered by the application.

```bash
bin/mantle make:command <name>
```

### Command Structure

After generating a command, you should define the `$signature` and
`$description` properties. The `$signature` property defines the command's name
along with its arguments and options. The `handle()` method is called when the
command is run. The Mantle Service Container will automatically inject all
dependencies that are type-hinted in the `handle()` method. The following
command would be registered as `wp mantle example:my-command`:

```php
namespace App\Console;

use Mantle\Console\Command;

/**
 * Example_Command Controller
 */
class Example_Command extends Command {
	/**
	 * The console command signature.
	 *
	 * @var string
	 */
	protected $signature = 'example:my-command {post_id} {--dry-run}';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'An example command.';

	/**
	 * Callback for the command.
	 */
	public function handle(): void {
		$post_id = $this->argument( 'post_id' );
		$dry_run = $this->option( 'dry-run' );

		$this->info( "Processing post {$post_id}." );
	}
}
```

The command name can also be defined separately in the `$name` property. If it
is, the name will be prepended to the `$signature` automatically.

### Closure Commands

As an alternative to defining a command class, you may register a closure-based
command using the `Console` facade in your application's `routes/console.php`
file. The closure is bound to a command instance, so all the input and output
helpers are available via `$this`. Arguments and options from the signature are
passed to the closure:

```php title="routes/console.php"
use Mantle\Facade\Console;

Console::command( 'hello {name}', function ( string $name ) {
	$this->info( "Hello, {$name}!" );
} )->describe( 'Greet a user by name' );
```

## Registering a Command

Once generated, the commands should automatically be registered by the
application. The application's console kernel loads all commands in the
`app/console` directory as well as any closure commands in `routes/console.php`.
If you wish to manually register commands, you can add them to the
`$commands` property of the `app/console/class-kernel.php` file in your
application:

```php
namespace App\Console;

use Mantle\Framework\Console\Kernel as Console_Kernel;

/**
 * Application Console Kernel
 */
class Kernel extends Console_Kernel {
	/**
	 * The commands provided by the application.
	 *
	 * @var array
	 */
	protected $commands = [
		Command_To_Register::class,
	];
}
```

## Defining Input Expectations

Arguments and options are defined in the command's `$signature` property, each
wrapped in curly braces. Options are prefixed with two dashes (`--`).

### Arguments

Arguments are required by default. Append a `?` to make an argument optional,
or provide a default value with `=`:

```php
// Required argument.
protected $signature = 'example:my-command {user}';

// Optional argument.
protected $signature = 'example:my-command {user?}';

// Optional argument with a default value.
protected $signature = 'example:my-command {user=admin}';
```

### Options

Options without a value act as a boolean switch. Append `=` to an option to
accept a value, optionally followed by a default value. A shortcut can be
defined before the option name, separated by a `|`:

```php
// Boolean switch: --dry-run
protected $signature = 'example:my-command {--dry-run}';

// Option with a value: --format=json
protected $signature = 'example:my-command {--format=}';

// Option with a default value.
protected $signature = 'example:my-command {--format=table}';

// Option with a shortcut: -F json
protected $signature = 'example:my-command {--F|format=}';
```

### Input Arrays

Arguments and options can accept multiple values by appending `*`:

```php
// wp mantle example:my-command 1 2 3
protected $signature = 'example:my-command {post_ids*}';

// wp mantle example:my-command --id=1 --id=2
protected $signature = 'example:my-command {--id=*}';
```

### Input Descriptions

Descriptions can be assigned to arguments and options by separating the name
from the description with a colon surrounded by spaces:

```php
protected $signature = 'example:my-command
	{post_id : The ID of the post to process}
	{--dry-run : Whether to run without making changes}';
```

### Retrieving Input

Arguments and options can be retrieved with the `argument()` and `option()`
methods. The `option()` method accepts a default value as its second argument.
All arguments or options can be retrieved as an array with `arguments()` and
`options()`:

```php
$post_id = $this->argument( 'post_id' );
$format  = $this->option( 'format', 'table' );

$all_arguments = $this->arguments();
$all_options   = $this->options();
```

## Command Input

A command can ask questions of the user to gather input.

### `anticipate`

The `anticipate` method allows you to ask the user to type a value from a list
of options. The method returns the value the user selects.

```php
$value = $this->anticipate( 'What is your decision?', [ 'Moon', 'Sun' ] );
```

### `ask`

The `ask` method asks the user for input. The method returns the value the user
enters.

```php
$value = $this->ask( 'What is your name?' );
```

### `choice`

The `choice` method allows you to ask the user to select from a list of options.

```php
$value = $this->choice( 'What is your decision?', [ 'Moon', 'Sun' ], $default_index );
```

### `confirm`

The `confirm` method asks the user to confirm an action. The method returns a
boolean value.

```php
$confirmed = $this->confirm( 'Do you wish to continue?' );
```

### `secret`

The `secret` method asks the user for a password or a secret value that won't appear in the console.

```php
$password = $this->secret( 'What is the password?' );
```

## Command Output

The `info`, `error`, `alert`, and `warn` methods can be used to write output to the console.

```php
use Mantle\Console\Command;

class Example_Command extends Command {
  public function handle() {
    $this->info( 'This is an informational message.' );
    $this->error( 'This is an error message.' );
    $this->alert( 'This is an alert message.' );
    $this->warn( 'This is a warning message.' );
  }
}
```

A `fail()` method is also available to write an error message and exit the command.

```php
use Mantle\Console\Command;

class Example_Command extends Command {
  public function handle() {
    $this->fail( 'This is an error message.' );
  }
}
```

### Colors

You can use the `colorize()` method to add color to your output. The method
accepts a string and a color.

```php
use Mantle\Console\Command;

class Example_Command extends Command {
  public function handle() {
    $this->line( $this->colorize( 'This is a red message.', 'red' ) );
  }
}
```

### Progress Bars

You can use the `with_progress_bar()` method to display a progress bar. The
method accepts an iterable (or the total number of steps) and a closure. When
passed an iterable, the closure is called for each item and the progress bar
advances automatically after each call.

```php
use Mantle\Console\Command;

class Example_Command extends Command {
	public function handle(): void {
		$this->with_progress_bar( get_posts( [ 'posts_per_page' => 100 ] ), function ( \WP_Post $post ) {
			// Process the post.
		} );
	}
}
```

## Advanced Output

Underneath the hood, `$this->output` is an instance of `
Symfony\Component\Console\Style\SymfonyStyle` which provides a number of methods
for writing to the console. You can use these methods directly if you need more
control over the output. See [the Symfony
documentation](https://symfony.com/doc/current/console/style.html) for more
information.

## Available Commands

Mantle includes a number of commands out of the box. Run `bin/mantle list` or
`wp mantle list` to see every command registered in your application. Commands
that interact with WordPress or the database, such as `queue:run` and `db:seed`,
must be run through `wp mantle`.

| Command | Description |
| --- | --- |
| `about` | Display information about the current Mantle installation. |
| `cache:clear` | Delete the local Mantle cache (not the WordPress object cache). |
| `config:cache` | Cache the application's configuration. |
| `config:clear` | Delete the cached configuration. |
| `db:seed` | Seed the database using the application's seeders. |
| `event:cache` | Cache the application's registered events. |
| `event:clear` | Clear the event cache. |
| `hook-usage {hook}` | Tabulate all the usage of a hook in the code base. |
| `model:discover` | Discover models within the application for automatic registration. |
| `package:discover` | Discover package service providers from Composer. |
| `queue:run {queue=default}` | Run jobs from a queue. See [Queue](../features/queue.md). |
| `queue:cleanup` | Delete old queue jobs. |
| `route:list` | List the registered routes in the application. |
| `test-config` | Create a `wp-test-config.php` file for local development. |
| `vendor:publish` | Publish assets from vendor packages. See [Package Development](../architecture/package-development.md#publishing-assets). |
| `view:cache` | Compile all Blade templates in the application. |
| `view:clear` | Clear the compiled views. |

### Generators

Mantle includes generators for most of the classes in an application. Each
generator accepts the name of the class to generate:

| Command | Description |
| --- | --- |
| `make:block` | Generate a Gutenberg block. |
| `make:class` | Generate a plain class. |
| `make:command` | Generate a console command. |
| `make:controller` | Generate a controller. Pass `--entity --entity-model=<model>` for an [entity controller](./requests.md#model-routing). |
| `make:factory` | Generate a model factory. |
| `make:generator` | Generate a new generator command. |
| `make:job` | Generate a queue job. |
| `make:listener` | Generate an event listener. |
| `make:middleware` | Generate an HTTP middleware class. |
| `make:model` | Generate a model. |
| `make:provider` | Generate a service provider. |
| `make:seeder` | Generate a database seeder. |
| `make:test` | Generate a test case. |

## Testing Commands

Commands can be tested using the `command()` method on the test case. The method
returns an object with assertions for the command's output and exit code. The
command is run when the object is destroyed or when `run()` is called:

```php
namespace App\Tests\Feature;

use App\Tests\TestCase;

class Example_Command_Test extends TestCase {
	public function test_example_command(): void {
		$this->command( 'wp mantle example:my-command', [ 'post_id' => 123 ] )
			->assertOutputContains( 'Processing post 123.' )
			->assertOutputNotContains( 'Error' )
			->assertSuccessful();
	}
}
```

The following assertions are available:

| Assertion | Description |
| --- | --- |
| `assertOutputContains( string $output )` | Assert the output contains the given string. |
| `assertOutputNotContains( string $output )` | Assert the output does not contain the given string. |
| `assertExitCode( int $code )` | Assert the command exited with the given code. |
| `assertSuccessful()` / `assertOk()` | Assert the command exited with a code of `0`. |
| `assertFailed()` / `assertNotSuccessful()` | Assert the command exited with a non-zero code. |

The output and exit code of a command that has run can be retrieved with
`get_output()` and `get_status_code()`.
