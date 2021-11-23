# Continuous Integration

[[toc]]

## Introduction

Using Continuous Integration (CI) in your development can help ease your mind
when adding new features to a site. This guide will help you setup your Mantle
application or project that is using Mantle's testing framework for CI via
GitHub Actions or Buddy.

::: tip Are you transitioning an existing site to Mantle's Test Framework?

Be sure to checkout [Transitioning to Test Framework](./transition.md) for more
information.
:::

## Differences from Core Tests

One difference to call out from core is that Mantle does not require the use of
`bin/install-wp-tests.sh` to run tests in a CI environment. (If you don't know
what that even is, you can skip ahead!) Mantle will automatically attempt to
download and install WordPress behind the scenes so that your plugin/package can
focus on other things. For majority of the use cases plugins/packages will be
able to run `./vendor/bin/phpunit` and have their tests run automatically.

## Environment Variables

By default, no variables need to be set to run your tests. It is recommended to
set the following variables before running:

- `CACHEDIR`: `/tmp/test-cache`
- `WP_CORE_DIR`: `/tmp/wordpress`

The `CACHEDIR` variable defines the location of the cache folder used for tests.
If possible, cache that folder and use it across tests to improve performance.
For tests using the mantle installation script, `WP_DEVELOP_DIR` and
`WP_TESTS_DIR` are unused and do not need to be defined.

### Automatic Installation of WordPress

By default Mantle will check if the plugin/project is a valid WordPress
installation. If a WordPress installation is found it will use that installation
instead. For local development this is the most common use case if you're
working on a package/plugin/theme inside of an existing WordPress installation.

::: tip Are you are running unit tests locally?

Make sure you have a `wp-tests-config.php` file: [Generating a wp-tests-config.php](./test-framework.md#generating-a-wp-tests-config-php).
:::

If a WordPress installation is not found, common when a single plugin is checked
out in a CI environment, Mantle will attempt to automatically install WordPress
in `WP_CORE_DIR` (`/tmp/wordpress` by default). A default configuration is used
that can be customized via environmental variables. Here are the default
variables:

```
WP_DB_HOST: localhost
WP_DB_USER: root
WP_DB_PASSWORD: root
WP_DB_NAME: wordpress_unit_tests
```

### Manual Installation of WordPress

Mantle's automatic installation of WordPress is the preferred solution but may not meet all of your needs. Two common use cases may require you to install WordPress manually in CI:

1. Themes are currently not supported for automatic installation.
2. Plugins/packages that rely on other plugins to be installed.

Installing WordPress in your CI test is easy and can be done in a few lines of
code. Mantle's version of the WordPress installer for continuous integration is
also faster than the common version included from WP-CLI, too (1-2 seconds
versus 4-5 -- subsequent runs also cache the existing WordPress installation).

::: details Where can I find the Mantle version of the installation script?

  The canonical version of the Mantle `install-wp-tests.sh` script is located
  [here](https://github.com/alleyinteractive/mantle-ci/blob/HEAD/install-wp-tests.sh) and can be referenced in tests via `https://raw.githubusercontent.com/alleyinteractive/mantle-ci/HEAD/install-wp-tests.sh`.
:::

To manually install WordPress, run the following commands inside your
integration test (specific examples for [Buddy](#buddy) and [GitHub
Actions](#github-actions) can be found below):


```bash
# Install WordPress [db name, username, password, host, version]
curl -s https://raw.githubusercontent.com/alleyinteractive/mantle-ci/HEAD/install-wp-tests.sh | bash -s wordpress_unit_tests root 'root' mysql $WP_VERSION

# Install Composer
composer install

# Rsync the theme into $WP_CORE_DIR/themes/example-theme
rsync -aWq --no-compress --exclude '.npm' --exclude '.git' --exclude '.npm' --exclude 'node_modules' . ${WP_CORE_DIR}/wp-content/themes/example-theme

# Hop into theme's directory.
cd ${WP_CORE_DIR}/wp-content/wp-content/themes/example-theme

# Run PHPUnit/phpcs
composer run phpunit
composer run phpcs
```

## Caching

Caching can improve the performance of your tests by a great deal. Your tests
should cache the dependencies installed using Composer and the remote files
downloaded during testing (the `CACHEDIR` variable). The configurations included
in this guide will use the recommended caching for testing.

The Mantle version of the `install-wp-tests.sh` script will also cache the WordPress installation and latest WordPress version as well.

## Setting Up Continuous Integration

### GitHub Actions

The Mantle repository includes GitHub Actions for testing your Mantle
application against PHPUnit and phpcs:

- [GitHub Action for PHPUnit](https://github.com/alleyinteractive/mantle/blob/main/.github/workflows/tests.yml)
- [GitHub Action for phpcs](https://github.com/alleyinteractive/mantle/blob/main/.github/workflows/coding-standards.yml)

These actions include best practices included in this guide to test your
application. If you are working against a `wp-content/`-rooted application, you
can use the GitHub Actions from `alleyinteractive/create-mantle-app`:

- [GitHub Action for PHPUnit](https://github.com/alleyinteractive/create-mantle-app/blob/main/.github/workflows/tests.yml)
- [GitHub Action for phpcs](https://github.com/alleyinteractive/create-mantle-app/blob/main/.github/workflows/coding-standards.yml)

### Buddy

[Buddy](https://buddy.works/) is a fast and performance CI platform that
is in use at Alley. For internal projects, we test projects using Buddy using
the Mantle framework.

To get started, create a new project and connect your repository to Buddy. You
can use the following YAML file as a starting point Buddy. It supports
[importing this
file](https://buddy.works/docs/yaml/yaml-gui#how-to-switch-the-config-mode-to-gui)
so you can work in the GUI.

With the below configuration, Mantle can run Unit Tests and Coding Standards
tests on every Pull Request in under 30 seconds. This configuration is for
testing a single plugin/theme/project.

```yaml
- pipeline: "Test Pull Requests"
  trigger_mode: "ON_EVERY_PUSH"
  ref_name: "refs/pull/*"
  ref_type: "WILDCARD"
  priority: "NORMAL"
  fail_on_prepare_env_warning: true
  clone_depth: 1
  trigger_condition: "ALWAYS"
  actions:
  - action: "Setup Composer"
    type: "BUILD"
    working_directory: "/buddy/mantle"
    docker_image_name: "alleyops/ci-resources"
    docker_image_tag: "latest"
    execute_commands:
    - "# Install Dependencies"
    - "composer install"
    cached_dirs:
    - "/root/.composer/cache"
    volume_mappings:
    - "/:/buddy/mantle"
    trigger_condition: "ALWAYS"
    shell: "BASH"
  - action: "Setup WordPress and Run Unit Tests"
    type: "BUILD"
    working_directory: "/buddy/mantle"
    docker_image_name: "alleyops/ci-resources"
    docker_image_tag: "latest"
    execute_commands:
    - "# Run Unit Tests"
    - "composer run phpunit"
    services:
    - type: "MYSQL"
      version: "5.7"
      connection:
        host: "mysql"
        port: 3306
        user: "root"
        password: "root"
    cached_dirs:
    - "/tmp/test-cache"
    - "/tmp/wordpress"
    volume_mappings:
    - "/:/buddy/mantle"
    trigger_condition: "ALWAYS"
    shell: "BASH"
    run_next_parallel: true
  - action: "Run PHPCS"
    type: "BUILD"
    working_directory: "/buddy/mantle"
    docker_image_name: "alleyops/ci-resources"
    docker_image_tag: "latest"
    execute_commands:
    - "composer run phpcs"
    volume_mappings:
    - "/:/buddy/mantle"
    trigger_condition: "ALWAYS"
    shell: "BASH"
  variables:
  - key: "CACHEDIR"
    value: "/tmp/test-cache"
    description: "Cache folder for remote requests."
  - key: "SKIP_DISCOVERY"
    value: "true"
  - key: "WP_CORE_DIR"
    value: "/tmp/wordpress"
    type: "VAR"
    description: "WordPress checkout folder."
  - key: "WP_VERSION"
    value: "latest"
    type: "VAR"
  - key: "WP_DB_PASSWORD"
    value: "root"
    type: "VAR"
  - key: "WP_DB_HOST"
    value: "mysql"
    type: "VAR"
  - key: "WP_SKIP_DB_CREATE"
    value: "true"
    type: "VAR"
```

#### Buddy for a `/wp-content/`-rooted Project

If you are looking for a `/wp-content/`-rooted Buddy YAML, you can use
this configuration (this one manually installs WordPress):

```yaml
- pipeline: "Test Pull Requests"
  trigger_mode: "ON_EVERY_PUSH"
  ref_name: "refs/pull/*"
  ref_type: "WILDCARD"
  priority: "NORMAL"
  fail_on_prepare_env_warning: true
  clone_depth: 1
  trigger_condition: "ALWAYS"
  actions:
  - action: "Setup Composer"
    type: "BUILD"
    working_directory: "/buddy/mantle"
    docker_image_name: "alleyops/ci-resources"
    docker_image_tag: "7.4-fpm-wp"
    execute_commands:
    - "# Install Dependencies"
    - "composer install"
    cached_dirs:
    - "/root/.composer/cache"
    volume_mappings:
    - "/:/buddy/mantle"
    trigger_condition: "ALWAYS"
    shell: "BASH"
  - action: "Setup WordPress and Run Unit Tests"
    type: "BUILD"
    working_directory: "/buddy/mantle"
    docker_image_name: "alleyops/ci-resources"
    docker_image_tag: "7.4-fpm-wp"
    execute_commands:
    - "# Install WordPress"
    - "curl -s https://raw.githubusercontent.com/alleyinteractive/mantle-ci/HEAD/install-wp-tests.sh | bash -s wordpress_unit_tests root 'root' mysql $WP_VERSION false"
    - ""
    - "# Install Composer"
    - "composer install"
    - ""
    - "# Rsync the theme into /tmp/wordpress"
    - "rsync -aWq --no-compress --exclude '.npm' --exclude '.git' --exclude '.npm' --exclude 'node_modules' . ${WP_CORE_DIR}/wp-content/"
    - ""
    - "# Hop into theme's directory."
    - "cd ${WP_CORE_DIR}/wp-content/themes/national-review/"
    - ""
    - "# Run PHPUnit"
    - "../../vendor/bin/phpunit"
    - ""
    - "# Run phpcs"
    - "../../vendor/bin/phpcs -vs --parallel=20"
    services:
    - type: "MYSQL"
      version: "5.7"
      connection:
        host: "mysql"
        port: 3306
        user: "root"
        password: "root"
    cached_dirs:
    - "/tmp/test-cache"
    - "/tmp/wordpress"
    volume_mappings:
    - "/:/buddy/mantle"
    trigger_condition: "ALWAYS"
    shell: "BASH"
    run_next_parallel: true
  - action: "Run PHPCS"
    type: "BUILD"
    working_directory: "/buddy/mantle"
    docker_image_name: "alleyops/ci-resources"
    docker_image_tag: "7.4-fpm-wp"
    execute_commands:
    - "composer run phpcs"
    volume_mappings:
    - "/:/buddy/mantle"
    trigger_condition: "ALWAYS"
    shell: "BASH"
  variables:
  - key: "CACHEDIR"
    value: "/tmp/test-cache"
    description: "Cache folder for remote requests."
  - key: "SKIP_DISCOVERY"
    value: "true"
  - key: "WP_CORE_DIR"
    value: "/tmp/wordpress"
    type: "VAR"
    description: "WordPress checkout folder."
  - key: "WP_VERSION"
    value: "latest"
    type: "VAR"
  - key: "WP_DB_PASSWORD"
    value: "root"
    type: "VAR"
  - key: "WP_DB_HOST"
    value: "mysql"
    type: "VAR"
  - key: "WP_SKIP_DB_CREATE"
    value: "true"
    type: "VAR"

```
