---
title: "Testing: Snapshot Testing"
sidebar_label: Snapshot Testing
description: Snapshot testing in Mantle's testing framework.
---
# Snapshot Testing

Mantle's testing framework includes [Spatie's PHPUnit Snapshot Testing
package](https://github.com/spatie/phpunit-snapshot-assertions) for easy
snapshot testing in your unit tests. It is a wonderful way to test without
writing actual test cases, comparing the outcome of functions/methods to a
snapshot of the expected output.

```php
use Mantle\Testkit\Test_Case;

class Example_Test extends Test_Case {
  public function test_it_can_do_something() {
    // Perform some action that should result in a specific output.
    $output = do_something();

    // Assert that the output matches the snapshot.
    $this->assertMatchesSnapshot( $output );
  }
}
```

After running the test, you will see a new snapshot file in the `__snapshots__`
relative to the current test that will store the output of the test. If the
output of the test changes, the test will fail and you will be able to review
the changes and decide whether to accept them or not.

If you need to update the stored snapshot, you can either delete the
`__snapshots__` directory relative to your test or you can pass `-d
--update-snapshots` to the test runner.

For more information about snapshot testing, see the [Spatie's PHPUnit Snapshot
Package Documentation](https://github.com/spatie/phpunit-snapshot-assertions).

## Testing Requests

[HTTP request tests](/docs/testing/requests) can use snapshot testing to test the
response of a remote request. This is useful for testing the response of a an
REST API endpoint OR a page on the site. Snapshot testing can help you test
against the entire response of a page rather than checking for specific parts of
it.

For example, if you had a login page, you could test the entire page response to
ensure that the login form is present, the page title is correct, and the page
is not returning an error.

```php
use Mantle\Testkit\Test_Case;

class Example_Test extends Test_Case {
  public function test_it_can_do_something() {
    $this->get( '/login' )->assertMatchesSnapshot();
  }
}
```

### `assertMatchesSnapshot()` / `assertMatchesSnapshotContent()`

Assert that the given content matches the snapshot. Only compares the content to
a stored snapshot.

**Note:** If you are testing against a JSON response, the method will automatically use `assertMatchesSnapshotJson()` to compare the response.

```php
$this->get( '/' )->assertMatchesSnapshot();
```

### `assertMatchesSnapshotHtml()`

Assert that a response matches the snapshot. Expects the content to be valid
HTML. Internally the package will be loaded into a DOMDocument and the HTML will
be formatted before it is compared to the snapshot. See [the HTML
Driver](https://github.com/spatie/phpunit-snapshot-assertions/blob/main/src/Drivers/HtmlDriver.php) for more information.

```php
$this->get( '/' )->assertMatchesSnapshotHtml();
```

### `assertMatchesSnapshotJson()`

Assert that a response matches the snapshot. Expects the content to be valid
JSON. Internally the package will be JSON decoded and encoded again for storage.

```php
$this->get( '/wp-json/wp/v2/posts' )->assertMatchesSnapshotJson();
```

`assertMatchesSnapshotJson()` also accepts a second parameter to specify the
JSON paths that can be included in the snapshot. This is useful if you want to
test the response of an API endpoint but don't want to test the entire response.
This supports `*` wildcards.

```php
$this->get( '/wp-json/wp/v2/posts' )->assertMatchesSnapshotJson(
  '*.type',
);

$this->get( '/wp-json/wp/v2/posts' )->assertMatchesSnapshotJson( [
  'data.*.type',
  'data.*.title',
  'data.*.content',
] );

$this->get( '/wp-json/wp/v2/posts' )->assertMatchesSnapshotJson( [
  'single-key',
] );
```

### `assertStatusAndHeadersMatchSnapshot()`

Assert that the status code and headers match the snapshot. This is useful if
you want to test the response of an endpoint but don't want to test the
response's content.

:::tip Use with caution!

This is useful for testing the response of an endpoint but it is not recommended
for practice testing because headers often contain dynamic information such as
the date and time. If you want to test the response of an endpoint, it is
recommended to use `assertMatchesSnapshot()` method.
:::

```php
$this->get( '/wp-json/wp/v2/posts' )->assertStatusAndHeadersMatchSnapshot();
```

### `assertMatchesSnapshotWithStatusAndHeaders()`

Assert that the status code, headers, and content match the snapshot. This is
useful if you want to test the entire response of the endpoint (status code,
headers, and content).

```php
$this->get( '/wp-json/wp/v2/posts' )->assertMatchesSnapshotWithStatusAndHeaders();
```