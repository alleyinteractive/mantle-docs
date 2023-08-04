# Deprecation and Incorrect Usage

## Introduction

Deprecation notices from `_deprecated_function()` and `_deprecated_argument()`
and incorrect usage notices from `_doing_it_wrong()` are captured and can be
asserted against. By default, deprecation and incorrect usage notices will throw
an error and fail the test.

## Expecting Deprecations/Incorrect Usage with PHPDoc Annotations

As with in `WP_UnitTestCase`, you can add PHPDoc annotations to a test method that will
flag a test as expecting a deprecation or incorrect usage notice.

:::note

If a test has an `@expectedDeprecated` or `@expectedIncorrectUsage` annotation,
it will not fail if a deprecation or incorrect usage notice is not triggered. If
the test does not cause a deprecation or incorrect usage notice, it will fail.

:::


```php
use Tests\Test_Case;

class Example_Annotation_Test extends Test_Case {
  /**
   * @expectedDeprecated Example_Function
   */
  public function test_deprecated_function() {
    $this->assertTrue( true );
  }

  /**
   * @expectedIncorrectUsage Example_Function
   */
  public function test_incorrect_usage_function() {
    $this->assertTrue( true );
  }
}
```

## Setting Expected Deprecations/Incorrect Usage

A test can also declare a expected deprecation or incorrect usage notice by
calling `setExpectedDeprecated()` or `setExpectedIncorrectUsage()`.

:::note

If a test calls `setExpectedDeprecated()` or `setExpectedIncorrectUsage()` and a deprecation
or incorrect usage notice is not triggered, the test will fail.

:::

```php
use Tests\Test_Case;

class Example_Call_Test extends Test_Case {
  public function test_deprecated_function() {
    $this->setExpectedDeprecated( 'Example_Function' );
    $this->assertTrue( true );
  }

  public function test_incorrect_usage_function() {
    $this->setExpectedIncorrectUsage( 'Example_Function' );
    $this->assertTrue( true );
  }
}
```

## Ignoring Deprecations/Incorrect Usage

A test can ignore deprecation or incorrect usage notices by calling
`ignoreDeprecated()` or `ignoreIncorrectUsage()`.

:::note

If a deprecation or incorrect usage notice is not triggered, the test will not
fail.

:::

```php
use Tests\Test_Case;

class Example_Ignore_Test extends Test_Case {
  public function test_deprecated_function() {
    $this->ignoreDeprecated( 'Example_Function' );
  }

  public function test_incorrect_usage_function() {
    $this->ignoreIncorrectUsage( 'Example_Function' );
  }
}
```

It also supports a wildcard `*` to ignore all deprecations or incorrect usage
notices that match the pattern.

```php
use Tests\Test_Case;

class Example_Ignore_Match_Test extends Test_Case {
  public function test_deprecated_function() {
    $this->ignoreDeprecated( 'wp_*' );

    // Or ignore all deprecations.
    $this->ignoreDeprecated();
  }

  public function test_incorrect_usage_function() {
    $this->ignoreIncorrectUsage( 'wp_*' );

    // Or ignore all incorrect usage notices.
    $this->ignoreIncorrectUsage();
  }
}
```
