---
title: "Testing: Traits"
sidebar_label: Traits
description: Traits that can be used to add optional functionality to a test case.
---

# Traits

## Introduction

Mantle's Test Framework uses traits to add optional functionality to a test
case.

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

## Network Admin Screen

The `Mantle\Testing\Concerns\Network_Admin_Screen` trait will set the current
"screen" to a WordPress network admin screen, and `is_network_admin()` will
return true in tests in the test case. This is useful for testing network admin
screens, or any code that checks `is_network_admin()`.

## With Faker

The `Mantle\Testing\Concerns\With_Faker` trait will add a `$this->faker` property to the test case with
an instance of [Faker](https://fakerphp.github.io/). This is useful for
generating test data.

## Prevent Remote Requests

The `Mantle\Testing\Concerns\Prevent_Remote_Requests` trait will prevent remote
requests from being made during tests. This is useful for testing code that
makes remote requests, but you don't want to actually make the requests or fake
them.

## Reset Data Structures

The `Mantle\Testing\Concerns\Reset_Data_Structures` trait will reset data
structures between tests. This will reset all post types and taxonomies that are
registered before each test is run.

## Reset Server

The `Mantle\Testing\Concerns\Reset_Server` trait will reset the server state
between tests. This will clear the main `$_SERVER` superglobals before each test
run, including `$_SERVER['REQUEST_URI']`, `$_SERVER['REQUEST_METHOD']`, and
`$_SERVER['HTTP_HOST']`.