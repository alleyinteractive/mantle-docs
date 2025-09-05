---
title: "Testing: Parallel Testing"
sidebar_label: Parallel Testing
description: Run your WordPress unit tests in parallel to speed up your test suite.
---

# Testing: Parallel Testing

:::note
Parallel unit testing is currently in beta testing. Please let us know any issues
you may come across. It is generally a drop-in replacement for PHPUnit but does play
better with PHPUnit 10+.
:::

By default, PHPUnit runs tests sequentially. This can be slow, especially if you
have a lot of tests. To speed up your test suite, you can run tests in parallel.
To get started, you'll need to install the `paratest` package:

```bash
composer require --dev brianium/paratest
```

You can then call the `vendor/bin/paratest` binary to run your tests in parallel:

```bash
vendor/bin/paratest
```

You should also update your `composer.json` file to include a script to run your
tests in parallel:

```json
{
  "scripts": {
    "test": "vendor/bin/paratest"
  }
}
```
