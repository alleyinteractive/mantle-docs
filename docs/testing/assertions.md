---
title: "Testing: Assertions"
sidebar_label: Assertions
description: Assertions available in Mantle's Test Case.
---

# Testing: Assertions

## Introduction

Mantle's Test Case provides some assertions above and beyond PHPUnit's, largely
influenced by `WP_UnitTestCase`. Here's a run-through:

## WP_Error

Assert the given item is/is not a `WP_Error`:

```php
$this->assertWPError( $actual, $message = '' );

$this->assertNotWPError( $actual, $message = '' );
```

## General Assertions

### assertEqualFields

Asserts that the given fields are present in the given object:

```php
$this->assertEqualFields( $object, $fields );
```

### assertDiscardWhitespace

Asserts that two values are equal, with whitespace differences discarded:

```php
$this->assertDiscardWhitespace( $expected, $actual );
```

### assertEqualsIgnoreEOL

Asserts that two values are equal, with EOL differences discarded:

```php
$this->assertEqualsIgnoreEOL( $expected, $actual );
```

### assertEqualSets

Asserts that the contents of two un-keyed, single arrays are equal, without
accounting for the order of elements:

```php
$this->assertEqualSets( $expected, $actual );
```

### assertEqualSetsWithIndex

Asserts that the contents of two keyed, single arrays are equal, without
accounting for the order of elements:

```php
$this->assertEqualSetsWithIndex( $expected, $actual );
```

### assertNonEmptyMultidimensionalArray

Asserts that the given variable is a multidimensional array, and that all arrays
are non-empty:

```php
$this->assertNonEmptyMultidimensionalArray( $array );
```

## WordPress Query Assertions

### assertQueryTrue

Assert that the global WordPress query is true for a given set of properties and
false for the rest:

```php
$this->assertQueryTrue( ...$prop );
```

### assertQueriedObjectId

Assert that the global queried object ID is equal to the given ID:

```php
$this->assertQueriedObjectId( int $id );
```

### assertNotQueriedObjectId

Assert that the global queried object ID is not equal to the given ID:

```php
$this->assertNotQueriedObjectId( int $id );
```

### assertQueriedObject

Assert that the global queried object is equal to the given object:

```php
$this->assertQueriedObject( $object );
```

### assertNotQueriedObject

Assert that the global queried object is not equal to the given object:

```php
$this->assertNotQueriedObject( $object );
```

### assertQueriedObjectNull

Assert that the global queried object is null:

```php
$this->assertQueriedObjectNull();
```

## WordPress Post/Term Existence

### assertPostExists

Assert if a post exists given a set of arguments.

```php
$this->assertPostExists( array $args );
```

### assertPostDoesNotExists

Assert if a post doesn't exist given a set of arguments.

```php
$this->assertPostDoesNotExists( array $args );
```

### assertTermExists

Assert if a term exists given a set of arguments.

```php
$this->assertTermExists( array $args );
```

### assertTermDoesNotExists

Assert if a term doesn't exists given a set of arguments.

```php
$this->assertTermDoesNotExists( array $args );
```

### assertUserExists

Assert if a user exists given a set of arguments.

```php
$this->assertUserExists( array $args );
```

### assertUserDoesNotExists

Assert if a user doesn't exists given a set of arguments.

```php
$this->assertUserDoesNotExists( array $args );
```

### assertPostHasTerm

Assert if a post has a specific term.

```php
$this->assertPostHasTerm( $post, $term );
```

### assertPostNotHasTerm

Assert if a post does not have a specific term (aliased to `assertPostsDoesNotHaveTerm()`)

```php
$this->assertPostNotHasTerm( $post, $term );
```

## Asset Assertions

Assets that are registered and/or enqueued with WordPress can be asserted
against using the following methods:

### assertScriptStatus

Assert against the status of a script. `$status` accepts 'enqueued',
'registered', 'queue', 'to_do', and 'done'.

```php
$this->assertScriptStatus( string $handle, string $status );
```

### assertStyleStatus

Assert against the status of a style. `$status` accepts 'enqueued',
'registered', 'queue', 'to_do', and 'done'.

```php
$this->assertStyleStatus( string $handle, string $status );
```

### assertScriptEnqueued

Assert that a script is enqueued by handle.

```php
$this->assertScriptEnqueued( string $handle );
```

### assertScriptNotEnqueued

Assert that a script is not enqueued by handle.

```php
$this->assertScriptNotEnqueued( string $handle );
```

### assertStyleEnqueued

Assert that a style is enqueued by handle.

```php
$this->assertStyleEnqueued( string $handle );
```

### assertStyleNotEnqueued

Assert that a style is not enqueued by handle.

```php
$this->assertStyleNotEnqueued( string $handle );
```

### assertScriptRegistered

Assert that a script is registered.

```php
$this->assertScriptRegistered( string $handle );
```

### assertStyleRegistered

Assert that a style is registered.

```php
$this->assertStyleRegistered( string $handle );
```

## Block Assertions

Powered by [Match Blocks](https://github.com/alleyinteractive/wp-match-blocks).

### assertStringMatchesBlock

Assert that a string matches a block with the given optional attributes.

```php
$this->assertStringMatchesBlock( $string, $args );
```

### assertStringNotMatchesBlock

Assert that a string does not match a block with the given optional attributes.

```php
$this->assertStringNotMatchesBlock( $string, $args );
```

### assertStringHasBlock

Assert that a string has a block with the given optional attributes.

```php
$this->assertStringHasBlock( $string, $block_name, $attrs );
```

### assertStringNotHasBlock

Assert that a string does not have a block with the given optional attributes.

```php
$this->assertStringNotHasBlock( string $string, array|string $block_name, array $attrs = [] );
```

### assertPostHasBlock

Assert that a post has a block in its content with the given optional attributes.

```php
use Mantle\Database\Model\Post;

$this->assertPostHasBlock( Post|\WP_Post $post, string|array $block_name, array $attrs = [] );

// Example:
$this->assertPostHasBlock( $post, 'core/paragraph' );
$this->assertPostHasBlock( $post, 'core/paragraph', [ 'placeholder' => 'Hello, world!' ] );

// Example with multiple blocks:
$this->assertPostHasBlock( $post, [ 'core/paragraph', 'core/image' ] );
$this->assertPostHasBlock( $post, [ 'core/paragraph', 'core/image' ], [ 'placeholder' => 'Hello, world!' ] );
```

### assertPostNotHasBlock

Assert that a post does not have a block in its content with the given optional attributes.

```php
use Mantle\Database\Model\Post;

$this->assertPostNotHasBlock( Post|\WP_Post $post, string|array $block_name, array $attrs );

// Example:
$this->assertPostNotHasBlock( $post, 'core/paragraph' );
$this->assertPostNotHasBlock( $post, 'core/paragraph', [ 'placeholder' => 'Hello, world!' ] );

// Example with multiple blocks (matching any of the blocks will fail):
$this->assertPostNotHasBlock( $post, [ 'core/paragraph', 'core/image' ] );
$this->assertPostNotHasBlock( $post, [ 'core/paragraph', 'core/image' ], [ 'placeholder' => 'Hello, world!' ] );
```

## Mail Assertions

### assertMailSent

Assert that an email was sent to the given address or callback.

```php
$this->assertMailSent( 'example@example.com' );
```

You can also pass a callback to assert that an email was sent to any address
matching the callback. The callback will be passed an instance of
`\Mantle\Testing\Mail\Mail_Message`.

```php
use Mantle\Testing\Mail\Mail_Message;

$this->assertMailSent(
  fn ( Mail_Message $message ) => $message->to === 'example@example.com' && $message->subject === 'Hello, world!',
);
```

### assertMailNotSent

Assert that an email was not sent to the given address or callback.

```php
$this->assertMailNotSent( 'example@example.com' );
```

You can also pass a callback to assert that an email was not sent to any address
matching the callback. The callback will be passed an instance of
`\Mantle\Testing\Mail\Mail_Message`.

```php
use Mantle\Testing\Mail\Mail_Message;

$this->assertMailNotSent(
  fn ( Mail_Message $message ) => $message->to === 'example@example.com,
);
```

## assertMailSentCount

Assert that the given number of emails were sent to the given address or
any address matching the callback.

```php
$this->assertMailSentCount( 3 );
$this->assertMailSentCount( 3, 'example@example.com' );
$this->assertMailSentCount( 3, fn ( Mail_Message $message ) => $message->to === 'example@example.com' );
```

## HTTP Test Assertions

See [HTTP Testing](./requests.md#available-assertions) for a full list of HTTP
test assertions.