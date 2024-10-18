---
title: "Testing: Deprecation and Incorrect Usage"
sidebar_label: Deprecation and Incorrect Usage
description: Deprecation and incorrect usage notices can be captured and asserted against in Mantle's Test Case.
---
# Deprecation and Incorrect Usage

## Introduction

Deprecation notices from `_deprecated_function()` and `_deprecated_argument()`
and incorrect usage notices from `_doing_it_wrong()` are captured and can be
asserted against. By default, deprecation and incorrect usage notices will throw
an error and fail the test.

:::tip
When you ignore a deprecation or incorrect usage notice, you can use a `*` as a
wildcard to ignore all or part of the notice. This applies to all methods of
declaring expectations below.
:::

## Declaring Expectations with Attributes

A test can declare a expected deprecation or incorrect usage notice or ignore a
deprecation or incorrect usage notice by using the following attributes:

- `Mantle\Testing\Attributes\Expected_Deprecation`: Declare that a test case is
  expected to trigger a deprecation notice for a function.
- `Mantle\Testing\Attributes\Expected_Incorrect_Usage`: Declare that a test case
  is expected to trigger a doing it wrong notice for a function.
- `Mantle\Testing\Attributes\Ignore_Deprecation`: Ignore a deprecation notice
  for a specific function or all functions.
- `Mantle\Testing\Attributes\Ignore_Incorrect_Usage`: Ignore a doing it wrong
  notice for a specific function or all functions.


### Expected Deprecation

Using the `Expected_Deprecation` attribute, you can declare that a test case or a
test method is expected to trigger a deprecation notice for a function.

:::note
If a deprecation notice is not triggered, the test will fail.
:::

```php
use Mantle\Testing\Attributes\Expected_Deprecation;
use Tests\Test_Case;

#[Expected_Deprecation( 'example_function' )]
class ExampleAttributeTest extends Test_Case {
  public function test_deprecated_function() {
    $this->assertTrue( true );
  }
}
```

You can also expect a deprecation notice for a single test method:

```php
use Mantle\Testing\Attributes\Expected_Deprecation;
use Tests\Test_Case;

class ExampleAttributeTest extends Test_Case {
  #[Expected_Deprecation( 'example_function' )]
  public function test_deprecated_function() {
    $this->assertTrue( true );
  }
}
```

### Expected Incorrect Usage

Using the `Expected_Incorrect_Usage` attribute, you can declare that a test case
or a test method is expected to trigger a doing it wrong notice for a function.

:::note
If a doing it wrong notice is not triggered, the test will fail.
:::

```php
use Mantle\Testing\Attributes\Expected_Incorrect_Usage;
use Tests\Test_Case;

#[Expected_Incorrect_Usage( 'example_function' )]
class ExampleAttributeTest extends Test_Case {
  public function test_incorrect_usage_function() {
    $this->assertTrue( true );
  }
}
```

You can also expect a doing it wrong notice for a single test method:

```php
use Mantle\Testing\Attributes\Expected_Incorrect_Usage;
use Tests\Test_Case;

class ExampleAttributeTest extends Test_Case {
  #[Expected_Incorrect_Usage( 'example_function' )]
  public function test_incorrect_usage_function() {
    $this->assertTrue( true );
  }
}
```

### Ignore Deprecation

Using the `Ignore_Deprecation` attribute, you can ignore deprecation notices for
a specific function or all functions. By default, it will ignore deprecation
notices unless you pass a `$deprecated` parameter.

```php
use Mantle\Testing\Attributes\Ignore_Deprecation;
use Tests\Test_Case;

#[Ignore_Deprecation( 'example_function' )]
class ExampleAttributeTest extends Test_Case {
  public function test_deprecated_function() {
    $this->assertTrue( true );
  }
}
```

You can also ignore deprecation notices for a single test method:

```php
use Mantle\Testing\Attributes\Ignore_Deprecation;
use Tests\Test_Case;

class ExampleAttributeTest extends Test_Case {
  #[Ignore_Deprecation( 'example_function' )]
  public function test_deprecated_function() {
    $this->assertTrue( true );
  }
}
```

You can also ignore all deprecation notices:

```php
use Mantle\Testing\Attributes\Ignore_Deprecation;
use Tests\Test_Case;

#[Ignore_Deprecation]
class ExampleAttributeTest extends Test_Case {
  public function test_deprecated_function() {
    $this->assertTrue( true );
  }
}
```

### Ignore Incorrect Usage

Using the `Ignore_Incorrect_Usage` attribute, you can ignore doing it wrong
notices for a specific function or all functions. By default, it will ignore
doing it wrong notices unless you pass a `$name` parameter.

```php
use Mantle\Testing\Attributes\Ignore_Incorrect_Usage;
use Tests\Test_Case;

#[Ignore_Incorrect_Usage( 'example_function' )]
class ExampleAttributeTest extends Test_Case {
  public function test_incorrect_usage_function() {
    $this->assertTrue( true );
  }
}
```

You can also ignore doing it wrong notices for a single test method:

```php
use Mantle\Testing\Attributes\Ignore_Incorrect_Usage;
use Tests\Test_Case;

class ExampleAttributeTest extends Test_Case {
  #[Ignore_Incorrect_Usage( 'example_function' )]
  public function test_incorrect_usage_function() {
    $this->assertTrue( true );
  }
}
```

You can also ignore all doing it wrong notices:

```php
use Mantle\Testing\Attributes\Ignore_Incorrect_Usage;
use Tests\Test_Case;

#[Ignore_Incorrect_Usage]
class ExampleAttributeTest extends Test_Case {
  public function test_incorrect_usage_function() {
    $this->assertTrue( true );
  }
}
```

## Declaring Expectations with Methods

You can also declare a expected deprecation/incorrect usage notice or ignore a
deprecation/incorrect usage notice by calling the following methods:

- `setExpectedDeprecated( string $deprecated )`: Declare that a test case is
  expected to trigger a deprecation notice for a function.
- `setExpectedIncorrectUsage( string $doing_it_wrong )`: Declare that a test case
  is expected to trigger a doing it wrong notice for a function.
- `ignoreDeprecated( string $deprecated = '*' )`: Ignore a deprecation notice
  for a specific function or all functions.
- `ignoreDeprecated( string $deprecated = '*' )`: Ignore a doing it wrong
  notice for a specific function or all functions.

### Expected Deprecation

Using the `setExpectedDeprecated()` method, you can declare that a test is
expected to trigger a deprecation notice for a function.

:::note
If a deprecation notice is not triggered, the test will fail.
:::

```php
use Tests\Test_Case;

class ExampleMethodTest extends Test_Case {
  public function test_deprecated_function() {
    $this->setExpectedDeprecated( 'example_function' );
    $this->assertTrue( true );
  }
}
```

### Expected Incorrect Usage

Using the `setExpectedIncorrectUsage()` method, you can declare that a test is
expected to trigger a doing it wrong notice for a function.

:::note
If a doing it wrong notice is not triggered, the test will fail.
:::

```php
use Tests\Test_Case;

class ExampleMethodTest extends Test_Case {
  public function test_incorrect_usage_function() {
    $this->setExpectedIncorrectUsage( 'example_function' );
    $this->assertTrue( true );
  }
}
```

### Ignore Deprecation

Using the `ignoreDeprecated()` method, you can ignore deprecation notices for a
test. By default, it will ignore deprecation notices unless you pass a
`$deprecated` parameter.

```php
use Tests\Test_Case;

class ExampleMethodTest extends Test_Case {
  public function test_deprecated_function() {
    // Ignore a specific function.
    $this->ignoreDeprecated( 'example_function' );

    // Ignore all functions that start with `wp_`.
    $this->ignoreDeprecated( 'wp_*' );

    // Ignore all deprecation notices.
    $this->ignoreDeprecated();
  }
}
```

### Ignore Incorrect Usage

Using the `ignoreDeprecated()` method, you can ignore doing it wrong notices for
a test.. By default, it will ignore doing it wrong notices unless you pass a
`$name` parameter.

```php
use Tests\Test_Case;

class ExampleMethodTest extends Test_Case {
  public function test_incorrect_usage_function() {
    // Ignore a specific function.
    $this->ignoreIncorrectUsage( 'example_function' );

    // Ignore all functions that start with `wp_`.
    $this->ignoreIncorrectUsage( 'wp_*' );

    // Ignore all doing it wrong notices.
    $this->ignoreIncorrectUsage();

    $this->assertTrue( true );
  }
}
```

## Expecting Expectations with PHPDoc Annotations

As with in `WP_UnitTestCase`, you can add PHPDoc annotations to a test method that will
flag a test as expecting a deprecation or incorrect usage notice.

:::warning
This format of declaring expected deprecations or incorrect usage is still supported
but is not preferred. You should use [attributes](#declaring-expectations-with-attributes) or
[methods](#declaring-expectations-with-methods) to declare expected deprecations or incorrect usage.
:::

:::note

If a test has an `@expectedDeprecated` or `@expectedIncorrectUsage` annotation,
it will not fail if a deprecation or incorrect usage notice is not triggered. If
the test does not cause a deprecation or incorrect usage notice, it will fail.
:::

```php
use Tests\Test_Case;

class Example_Annotation_Test extends Test_Case {
  /**
   * @expectedDeprecated example_function
   */
  public function test_deprecated_function() {
    $this->assertTrue( true );
  }

  /**
   * @expectedIncorrectUsage example_function
   */
  public function test_incorrect_usage_function() {
    $this->assertTrue( true );
  }
}
```
