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