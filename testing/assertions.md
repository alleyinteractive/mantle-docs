# Assertions

[[toc]]

Mantle's Test Case provides some assertions above and beyond PHPUnit's, largely
influenced by `WP_UnitTestCase`. Here's a run-through:

## WP_Error

Assert the given item is/is not a `WP_Error`:

* `assertWPError( $actual, $message = '' )`
* `assertNotWPError( $actual, $message = '' )`

## General Assertions

Asserts that the given fields are present in the given object:

* `assertEqualFields( $object, $fields )`

Asserts that two values are equal, with whitespace differences discarded:

* `assertDiscardWhitespace( $expected, $actual )`

Asserts that two values are equal, with EOL differences discarded:

* `assertEqualsIgnoreEOL( $expected, $actual )`

Asserts that the contents of two un-keyed, single arrays are equal, without
accounting for the order of elements:

* `assertEqualSets( $expected, $actual )`

Asserts that the contents of two keyed, single arrays are equal, without
accounting for the order of elements:

* `assertEqualSetsWithIndex( $expected, $actual )`

Asserts that the given variable is a multidimensional array, and that all arrays
are non-empty:

* `assertNonEmptyMultidimensionalArray( $array )`

## WordPress Query Assertions

* `assertQueryTrue( ...$prop )`
* `assertQueriedObjectId( int $id )`
* `assertQueriedObject( $object )`

## WordPress Post/Term Existence

* `assertPostExists( array $args )` - Assert if a post exists given a set of arguments.
* `assertPostDoesNotExists( array $args )` - Assert if a post doesn't exists given a set of arguments.
* `assertTermExists( array $args )` - Assert if a term exists given a set of arguments.
* `assertTermDoesNotExists( array $args )` - Assert if a term doesn't exists given a set of arguments.
* `assertUserExists( array $args )` - Assert if a user exists given a set of arguments.
* `assertUserDoesNotExists( array $args )` - Assert if a user doesn't exists given a set of arguments.
* `assertPostHasTerm( $post, $term )` - Assert if a post has a specific term.
* `assertPostNotHasTerm( $post, $term )` - Assert if a post does not have a specific term (aliased to `assertPostsDoesNotHaveTerm()`)

## Deprecated and Incorrect Usage Assertion

As with in `WP_UnitTestCase`, you can add phpdoc annotations to a test for
expected exceptions.

* `@expectedDeprecated` - Expects that the test will trigger a deprecation
  warning
* `@expectedIncorrectUsage` - Expects that `_doing_it_wrong()` will be called
  during the course of the test
