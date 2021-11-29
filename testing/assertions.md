# Assertions

Mantle's Test Case provides some assertions above and beyond PHPUnit's, largely
influenced by `WP_UnitTestCase`. Here's a runthrough.

Assert the given item is/is not a `WP_Error`:

* `assertWPError( $actual, $message = '' )`
* `assertNotWPError( $actual, $message = '' )`

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

WordPress Query assertions (see above):

* `assertQueryTrue( ...$prop )`
* `assertQueriedObjectId( int $id )`
* `assertQueriedObject( $object )`

## Deprecated and Incorrect Usage Assertion

As with in `WP_UnitTestCase`, you can add phpdoc annotations to a test for
expected exceptions.

* `@expectedDeprecated` - Expects that the test will trigger a deprecation
  warning
* `@expectedIncorrectUsage` - Expects that `_doing_it_wrong()` will be called
  during the course of the test
