---
title: "Console Commands"
sidebar_label: Console
---

# Console Command

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

After generating a command, you should verify the `$name` and `$synopsis`
properties which determine the name and arguments/flags for the command,
respectively. The `$synopsis` property is the `wp-cli` definition of the
command's arguments ([reference the `wp-cli`
documentation](https://make.wordpress.org/cli/handbook/guides/commands-cookbook/)).
The Mantle Service Container will automatically inject all dependencies that are
type-hinted in the class. The following command would be registered to `wp
mantle example_command`:

```php
namespace App\Console;

use Mantle\Console\Command;

/**
 * Example_Command Controller
 */
class Example_Command extends Command {
  /**
   * The console command name.
   *
   * @var string
   */
  protected $signature = 'example:my-command {argument} [--flag]';

  /**
   * Callback for the command.
   */
  public function handle() {
    // Write to the console.
    $this->line( 'Message to write.' );

    // Error to the console.
    $this->error( 'Error message but does not exit without the second argument being true' );

    // Ask for input.
    $question = $this->prompt( 'Ask a question?' );
    $password = $this->secret( 'Ask a super secret question?' );

    // Get an argument.
    $arg = $this->argument( 'name-of-the-argument', 'Default Value' );

    // Get a flag.
    $flag = $this->flag( 'flag-to-get', 'default-value' );
  }
}
```

## Registering a Command

Once generated, the commands should automatically be registered by the
application. If for some reason that doesn't work or you wish to manually
register commands, you can add them to the `app/console/class-kernel.php` file
in your application:

```php
namespace App\Console;

use Mantle\Console\Kernel as Console_Kernel;

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

## Command Arguments / Options

Arguments and options can be included in the signature of the command. Arguments
are required and options are optional. The signature is defined as a string with
the following format:

```
{argument} [--option]
```

The arguments/options can be retrieved from the command's
`argument( $key )`/`option( $key )` methods.

```php
namespace App\Console;

use Mantle\Console\Command;

/**
 * Example Command
 */
class Example_Command extends Command {
  /**
   * The console command name.
   *
   * @var string
   */
  protected $signature = 'example:my-command {argument} [--flag]';

  /**
   * Callback for the command.
   */
  public function handle() {
    $arg  = $this->argument( 'argument' );
    $flag = $this->flag( 'flag' );

    // ...
  }
}
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
method accepts a closure that will be called for each iteration of the progress
bar. The closure should return the number of items processed.

```php
use Mantle\Console\Command;

class Example_Command extends Command {
  public function handle() {
    $this->with_progress_bar( get_posts( [...], function( \WP_Post $post ) {
      // Process the post.
      return 1;
    } ) );
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
