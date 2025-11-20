---
title: "Testing: Getting Started"
sidebar_label: Getting Started
---

# Testing: Getting Started

Mantle provides a powerful testing framework to help you write and run tests
for your WordPress applications. It supports use within Mantle applications as well
as existing WordPress projects via [Mantle Testkit](./testkit.md).

## Creating Tests

To create a new test case, use the `make:test` command. By default, the tests
will be placed in the `tests` directory.

_Note: These commands only work for Mantle applications._

```bash
bin/mantle make:test Namespace\Test_Name>

wp mantle make:test <Namespace\Test_Name>
```

## Running Tests

After installing `alleyinteractive/mantle-framework` or
`mantle-framework/testkit`, you can begin writing and running tests for your
WordPress application. Unit tests can be run directly or via Composer:

```bash
./vendor/bin/phpunit
```

:::info Interested in writing tests using Pest?
Mantle's testing framework is fully compatible with Pest. You can use Pest to write
your tests if you prefer its syntax and features. [Learn more about using Pest with Mantle](./pest.md).
:::

### Running Tests in Parallel

Mantle's testing framework supports running tests in parallel using
[`paratest`](https://github.com/brainmaestro/paratest). To get started, install
`brianium/paratest` as a development dependency:

```bash
composer require --dev brianium/paratest
```

`paratest` is a drop-in replacement for PHPUnit that runs your tests in parallel. To switch to using
`paratest`, replace `phpunit` with `paratest` when running your tests:

```bash
./vendor/bin/paratest
```

When running in parallel, each test process will use its own database prefix to
isolate the processes from each other. By default, the prefix will be `wptests_`
followed by an incrementing number (e.g. `wptests_1`, `wptests_2`, etc.).

For the most part, running tests in parallel should "just work." However,
there are some cases where you may need to make adjustments to your tests to
ensure they work correctly when run in parallel. For example, if your tests rely
on global state (e.g. global variables, singletons, etc.), you may need to
refactor your tests to avoid that global state or reset it between tests.