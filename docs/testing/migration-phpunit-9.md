---
sidebar_label: Migration from PHPUnit 9
---

# Migrating to PHPUnit 10+ from 9

Mantle's Test Framework 1.0 upgrades the PHPUnit version to 10.x. This is a
major upgrade and may require some changes to your existing tests. The most
common change is the need for projects to use PSR-4 file/class naming
conventions. This is a breaking change from PHPUnit 9.x that allowed for classic
WordPress-style file/class naming conventions in your tests.

In Mantle 1.14, we dropped support for PHPUnit 9.x and now require PHPUnit 10.x
for all tests. If you need to continue using PHPUnit 9.x, you can stay on Mantle
1.13 or earlier. When you are ready to upgrade to Mantle 1.14 or later, you will need to
migrate your tests to use PSR-4 file/class naming conventions with PHPUnit 10+.

Migration to PHPUnit 10+ is generally straightforward. You may use
[`alleyinteractive/wp-to-psr-4`](https://github.com/alleyinteractive/wp-to-psr-4/)
to help automate the process of converting your test files to PSR-4 naming
conventions.

For more information, see the
[1.x CHANGELOG note about the PHPUnit 10 Migration](https://github.com/alleyinteractive/mantle-framework/blob/1.x/CHANGELOG.md#phpunit-10-migration) for more information.
