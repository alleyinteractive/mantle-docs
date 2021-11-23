# Users

The Mantle Test Framework provides a method, `acting_as( $user )` to execute a
test as a given user or a user in the given role. This is best explained through
code, so here are some examples of using this method:

```php
$this->acting_as( 'administrator' );
$this->assertTrue( current_user_can( 'manage_options' ) );
```

```php
$this->acting_as( 'contributor' );
$this->get( '/some-admin-only-page/' )
     ->assertForbidden();
```

```php
$user = $this->acting_as( 'editor' );
```

```php
$this->acting_as( $some_user_created_elsewhere );
```