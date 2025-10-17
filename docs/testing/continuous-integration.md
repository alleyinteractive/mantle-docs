---
title: "Testing: Continuous Integration"
sidebar_label: Continuous Integration
description: Using Continuous Integration (CI) in your development can help ease your mind when adding new features to a site. This guide will help you setup your Mantle application or project that is using Mantle's testing framework for CI via GitHub Actions.
---
# Testing: Continuous Integration

## Introduction

Using Continuous Integration (CI) in your development can help ease your mind
when adding new features to a site. This guide will help you setup your Mantle
application or project that is using Mantle's testing framework for CI via
GitHub Actions.

:::tip Are you transitioning an existing site to Mantle's Test Framework?

Be sure to checkout [Transitioning to Test Framework using Mantle Testkit](./testkit.md) for more information.
:::

## Differences from Core Tests

One difference to call out from core is that Mantle does not require the use of
`bin/install-wp-tests.sh` to run tests in a CI environment. (If you don't know
what that is, skip ahead!) Mantle will automatically attempt to download and
install WordPress behind the scenes so that your plugin/package can focus on
other things. For majority of the use cases plugins/packages will be able to run
`./vendor/bin/phpunit` and have their tests run automatically.

For more information, read more about the
[Installation Manager](./installation-manager.md).

## Environment Variables

By default, no variables need to be set to run your tests. It is recommended to
set the following variables before running:

- `CACHEDIR`: `/tmp/test-cache`
- `WP_CORE_DIR`: `/tmp/wordpress`

The `CACHEDIR` variable defines the location of the cache folder used for tests.
If possible, cache that folder and use it across tests to improve performance.
For tests using the Mantle installation script, `WP_DEVELOP_DIR` and
`WP_TESTS_DIR` are unused and do not need to be defined.

For more environmental variables, see the
[Installation Manager](./installation-manager.md#overriding-the-default-installation).

:::tip Where can I find the Mantle version of the installation script?

  The canonical version of the Mantle `install-wp-tests.sh` script is located
  [here](https://github.com/alleyinteractive/mantle-ci/blob/HEAD/install-wp-tests.sh) and can be referenced in tests via `https://raw.githubusercontent.com/alleyinteractive/mantle-ci/HEAD/install-wp-tests.sh`.
:::

To manually install WordPress, run the following commands inside your
integration test (specific examples for [GitHub Actions](#github-actions) can be found below):


```bash
# Testing: Install Composer
composer install

# Testing: Run PHPUnit/phpcs
composer test
```

An example test bootstrap file for a plugin [can be found
here](https://github.com/alleyinteractive/mantle/blob/HEAD/tests/bootstrap.php).

## Caching

Caching can improve the performance of your tests by a great deal. Your tests
should cache the dependencies installed using Composer and the remote files
downloaded during testing (the `CACHEDIR` variable). The configurations included
in this guide will use the recommended caching for testing.

The Mantle version of the `install-wp-tests.sh` script will also cache the
WordPress installation and latest WordPress version for 24 hours.

## Setting Up Continuous Integration

### GitHub Actions

The Mantle repository includes GitHub Actions for testing your Mantle
application against PHPUnit and phpcs:

- [GitHub Action Workflow](https://github.com/alleyinteractive/mantle/blob/HEAD/.github/workflows/all-pr-tests.yml)
