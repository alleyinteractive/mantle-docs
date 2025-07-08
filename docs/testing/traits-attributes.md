---
title: "Testing: Traits and Attributes"
sidebar_label: Traits and Attributes
description: Traits and attributes that can be used to add optional functionality to a test case.
---

# Traits and Attributes

## Introduction

Mantle's Test Framework uses traits and attributes to add optional functionality
to a test case.

## Traits

### Refresh Database

The `Mantle\Testing\Concerns\Refresh_Database` trait will ensure that the
database is rolled back after each test in the test case has run. Without it,
data in the database will persist between tests, which almost certainly would
not be desirable. That said, if your test case doesn't interact with the
database, omitting this trait will provide a significant performance boost.

### Admin Screen

The `Mantle\Testing\Concerns\Admin_Screen` and
`Mantle\Testing\Concerns\Network_Admin_Screen` traits will set the current
"screen" to a WordPress admin screen, and `is_admin()` will return true in tests
in the test case. This is useful for testing admin screens, or any code that
checks `is_admin()`.

### Network Admin Screen

The `Mantle\Testing\Concerns\Network_Admin_Screen` trait will set the current
"screen" to a WordPress network admin screen, and `is_network_admin()` will
return true in tests in the test case. This is useful for testing network admin
screens, or any code that checks `is_network_admin()`.

### With Faker

The `Mantle\Testing\Concerns\With_Faker` trait will add a `$this->faker` property to the test case with
an instance of [Faker](https://fakerphp.github.io/). This is useful for
generating test data.

### Prevent Remote Requests

The `Mantle\Testing\Concerns\Prevent_Remote_Requests` trait will prevent remote
requests from being made during tests. This is useful for testing code that
makes remote requests, but you don't want to actually make the requests or fake
them.

### Reset Data Structures

The `Mantle\Testing\Concerns\Reset_Data_Structures` trait will reset data
structures between tests. This will reset all post types and taxonomies that are
registered before each test is run.

### Reset Server

The `Mantle\Testing\Concerns\Reset_Server` trait will reset the server state
between tests. This will clear the main `$_SERVER` superglobals before each test
run, including `$_SERVER['REQUEST_URI']`, `$_SERVER['REQUEST_METHOD']`, and
`$_SERVER['HTTP_HOST']`.

## Attributes

The following are [PHP
Attributes](https://www.php.net/manual/en/language.attributes.overview.php) that
can be used to add optional functionality to a test case. Many can be used on
test classes or individual test methods. Check the documentation for each
attribute for details on how to use it.

### Preserve Object Cache

When making HTTP requests in tests, the object cache will be cleared before each
request. If you want to preserve the object cache between requests, you can use
the `Mantle\Testing\Attributes\PreserveObjectCache` attribute on your test class or
method.

Supports test classes and individual test methods.

```php
use App\Tests\TestCase;
use Mantle\Testing\Attributes\PreserveObjectCache;

class ExampleTest extends TestCase {
    #[PreserveObjectCache]
    public function test_example(): void {
        $this->get('/some-endpoint')
            ->assertOk();

        // ...
    }
}
```

### User Agent

You can set the user agent used for HTTP requests in tests by using the
`Mantle\Testing\Attributes\UserAgent` attribute on your test class or method.
The attribute includes some common user agents for desktop, tablet, and mobile
devices, but you can also specify a custom user agent string.

Supports test classes and individual test methods.

```php
use App\Tests\TestCase;
use Mantle\Testing\Attributes\UserAgent;

class ExampleTest extends TestCase {
    #[UserAgent('My Custom User Agent')]
    public function test_example(): void {
        $this->get('/some-endpoint')
            ->assertOk();

        // ...
    }

    #[UserAgent(UserAgent::MOBILE)]
    public function test_mobile_example(): void {
        $this->get('/some-endpoint')
            ->assertOk();
    }
}
```

### WordPress Environment

The WordPress `wp_get_environment_type()` function can be set when testing to a specific
environment using the `Mantle\Testing\Attributes\Environment` attribute. The environment
type must be one of the following: `production`, `staging`, `development`, or `local`.

Supports test classes and individual test methods.

```php
use App\Tests\TestCase;
use Mantle\Testing\Attributes\Environment;

class ExampleTest extends TestCase {
    #[Environment('staging')]
    public function test_example(): void {
        $this->get('/some-endpoint')
            ->assertOk();

        // ...
    }

    #[Environment(Environment::DEVELOPMENT)]
    public function test_development_example(): void {
        $this->get('/some-endpoint')
            ->assertOk();
    }
}
```