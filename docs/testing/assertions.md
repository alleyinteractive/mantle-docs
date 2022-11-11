# Assertions

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

### assertQueriedObject

Assert that the global queried object is equal to the given object:

```php
$this->assertQueriedObject( $object );
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
