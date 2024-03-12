---
title: Authentication
---

# Users

The Mantle Test Framework provides a method `$this->acting_as( $user )` to
execute a test as a given user or a user in the given role.

Passing a role name to `acting_as()` will create a new user with that role and
authenticate as that user.

```php
$this->acting_as( 'administrator' );
$this->assertTrue( current_user_can( 'manage_options' ) );
```

```php
$this->acting_as( 'contributor' );
$this->get( '/some-admin-only-page/' )
     ->assertForbidden();
```

You may also pass a user instance to `acting_as()` to authenticate as that user.

```php
$this->acting_as( static::factory()->user->create() );
```

## Using `Acting_As` Attribute

Test classes and methods can use the `Mantle\Testing\Attributes\Acting_As`
attribute to automatically authenticate as a given user or role for a single
test method or an entire test class.

For example, the following test will authenticate as an administrator for the
entire test class:

```php
namespace Tests\Feature;

use Mantle\Testing\Attributes\Acting_As;
use Tests\Test_Case;

#[Acting_As( 'administrator' )]
class Admin_Test extends Test_Case {
    public function test_admin_can_manage_options() {
        $this->assertTrue( current_user_can( 'manage_options' ) );
    }
}
```

The following test will authenticate as a contributor for a single test method:

```php
namespace Tests\Feature;

use Mantle\Testing\Attributes\Acting_As;
use Tests\Test_Case;

class ContributorTest extends Test_Case {
    #[Acting_As( 'contributor' )]
    public function test_contributor_cannot_access_admin_pages() {
        $this->get( '/some-admin-only-page/' )
             ->assertForbidden();
    }
}
```

## Assertions

The Mantle Test Framework provides assertions to make it possible to assert if
you are authenticated as a given user or role or not at all.

### `assertAuthenticated()`

Assert that the user is authenticated.

```php
$this->assertAuthenticated();
```

Also supports checking if the current user is a specific user or role:

```php
$this->assertAuthenticated( 'administrator' );

$this->assertAuthenticatedAs( $user );
```

### `assertGuest()`

Assert that the user is not authenticated.

```php
$this->assertGuest();
```