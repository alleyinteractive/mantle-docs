# Traits

## Introduction

Mantle's Test Framework uses traits to add optional functionality to a test
case.

### Refresh Database

The `Refresh_Database` trait will ensure that the database is rolled back after
each test in the test case has run. Without it, data in the database will
persist between tests, which almost certainly would not be desirable. That said,
if your test case doesn't interact with the database, omitting this trait will
provide a significant performance boost.

### Admin Screen

The `Admin_Screen` and `Network_Admin_Screen` traits will set the current
"screen" to a WordPress admin screen, and `is_admin()` will return true in tests
in the test case. This is useful for testing admin screens, or any code that
checks `is_admin()`.

## Network Admin Screen

The `Network_Admin_Screen` trait will set the current "screen" to a WordPress
network admin screen, and `is_network_admin()` will return true in tests in the
test case. This is useful for testing network admin screens, or any code that
checks `is_network_admin()`.

## With Faker

The `With_Faker` trait will add a `$this->faker` property to the test case with
an instance of [Faker](https://fakerphp.github.io/). This is useful for
generating test data.