# Environmental Variables

This document describes the environmental variables that are used within the
testing framework and their purpose. Most variables are used during installation
and can be configured using methods on the [Installation
Manager](./installation-manager.md).

| Variable | Description |
|----------|-------------|
| `CACHEDIR` | The directory used when downloading WordPress, WordPress plugins, and checking WordPress versions during testing. [Defaults to `/tmp`.](https://github.com/alleyinteractive/mantle-ci/blob/de3063db39a21cf019490c2018a3d7ccd35ac557/install-plugin.sh#L72-L73) |
| `DISABLE_WP_UNIT_TEST_CASE_SHIM` | Disable the loading of a shim-version of `WP_UnitTestCase` that is used to support transitioning to Mantle Testkit. |
| `MANTLE_CI_BRANCH` | The branch of the Mantle CI repository to use when installing WordPress. |
| `MANTLE_EXPERIMENTAL_TESTING_USE_HOME_URL_HOST` | [See documentation](./installation-manager.md#using-the-experimental-feature-for-home-url-in-testing). |
| `MANTLE_INSTALL_OBJECT_CACHE` | Object cache to install during testing. [See documentation](./installation-manager.md#including-memcache-object-cache-drop-in). |
| `MANTLE_INSTALL_VIP_MU_PLUGINS` | Install VIP MU plugins during testing. [See documentation](./installation-manager.md#including-wordpress-vip-mu-plugins). |
| `MANTLE_LOAD_VIP_CONFIG` | Override to disable the loading of a `vip-config/vip-config.php` file in the `wp-config.php`. Defaults to `true`. |
| `MANTLE_REQUIRE_OBJECT_CACHE` | Force Mantle to install an object cache even if the environment does not support it. |
| `MANTLE_SKIP_LOCAL_OBJECT_CACHE` | Skip the loading of a local object cache drop-in during local testing. [See documentation](./installation-manager.md#disabling-object-cache-for-local-development). |
| `MANTLE_USE_SQLITE` | Use SQLite for the database connection. [See documentation](./installation-manager.md#using-sqlite-for-the-database). |
| `WP_DB_CHARSET` | The database character set. Defaults to `utf8`. |
| `WP_DB_COLLATE` | The database collation. Defaults to `(empty)`. |
| `WP_DB_HOST` | The database host. Defaults to `localhost`. |
| `WP_DB_NAME` | The database name. Defaults to `wordpress_unit_tests`. |
| `WP_DB_USER` | The database user. Defaults to `root`. |
| `WP_DB_PASSWORD` | The database password. Defaults to `root`. |
| `WP_DEFAULT_THEME` | The default theme to use during testing. Defaults to `default`. |
| `WP_MULTISITE` | Flag to install as multisite when testing. Defaults to `0`. |
| `WP_SKIP_DB_CREATE` | Skip creating the database during testing. Defaults to `0`. |
| `WP_TESTS_DOMAIN` | The domain to use during testing. Defaults to `example.org`. [See documentation](./installation-manager.md#using-the-experimental-feature-for-home-url-in-testing). |
| `WP_TESTS_USE_HTTPS` | Flag to use HTTPS during testing. Defaults to `0`. [See documentation](./installation-manager.md#using-the-experimental-feature-for-home-url-in-testing). |
| `WP_VERSION` | The version of WordPress to install during testing. Defaults to `latest`. |