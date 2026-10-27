---
title: Database Table Models
description: Use Mantle models and the query builder with custom database tables.
---

# Database Table Models

<div className="lead">
Most Mantle models represent a WordPress object such as a post, term, or user.
When your application stores data in its own database table, you can extend
`Database_Table_Model` to get the same model API for reading and writing rows in
that table.
</div>

## Defining a Database Table Model

Extend `Mantle\Database\Model\Database_Table_Model` and return the name of your
table from `get_table_name()`. The table name should not include the WordPress
table prefix; Mantle prepends `$wpdb->prefix` for you.

```php
namespace App\Models;

use Mantle\Database\Model\Database_Table_Model;

/**
 * Subscriber Model.
 */
class Subscriber extends Database_Table_Model {
	/**
	 * The table name for the model.
	 */
	public static function get_table_name(): string {
		return 'subscribers';
	}
}
```

The model above reads and writes rows in the `wp_subscribers` table (assuming a
`wp_` prefix).

If you don't override `get_table_name()`, the table name is the snake-cased
class name. A `Subscriber` class maps to `subscriber`, and `NewsletterSubscriber`
maps to `newsletter_subscriber`.

:::warning
The default table name is derived by inserting an underscore before every
capital letter. A class following WordPress naming conventions like
`Newsletter_Subscriber` would map to `newsletter__subscriber` (with a double
underscore). Override `get_table_name()` on those models.
:::

### Creating the Table

Mantle does not create or migrate the table for you. Create it as you normally
would in WordPress, such as with `dbDelta()` on plugin activation:

```php
global $wpdb;

require_once ABSPATH . 'wp-admin/includes/upgrade.php';

dbDelta(
	"CREATE TABLE {$wpdb->prefix}subscribers (
		id bigint unsigned NOT NULL AUTO_INCREMENT,
		email varchar(255) NOT NULL,
		status varchar(20) NOT NULL DEFAULT 'pending',
		created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY  (id)
	) {$wpdb->get_charset_collate()};"
);
```

### Primary Key

Models assume the table's primary key is an auto-incrementing `id` column. If
your table uses a different column, override the static `$primary_key`
property:

```php
class Subscriber extends Database_Table_Model {
	protected static string $primary_key = 'subscriber_id';
}
```

## Creating, Updating, and Deleting Rows

Database table models support the same `create()`, `save()`, and `delete()`
methods as other models. Attributes map directly to the table's columns.

```php
use App\Models\Subscriber;

$subscriber = Subscriber::create( [
	'email' => 'reader@example.org',
] );

// The primary key is set from the inserted row.
$subscriber->id;

$subscriber->status = 'confirmed';
$subscriber->save();

$subscriber->delete();
```

A `Mantle\Database\Model\Model_Exception` is thrown if the insert, update, or
delete query fails.

## Querying Rows

Retrieve a single row by its primary key with `find()`:

```php
$subscriber = Subscriber::find( 1 );
```

Database table models use `Mantle\Database\Query\Database_Query_Builder`, which
builds SQL against the model's table and returns a collection of models. It
supports a subset of the [query builder](./query-builder.md):

```php
// Retrieve all confirmed subscribers.
$subscribers = Subscriber::where( 'status', 'confirmed' )->get();

// Match multiple columns.
$subscriber = Subscriber::where( [
	'email'  => 'reader@example.org',
	'status' => 'confirmed',
] )->first();

// Count matching rows.
$count = Subscriber::where( 'status', 'pending' )->count();

// Order and limit results.
$latest = Subscriber::query()
	->orderBy( 'created_at', 'desc' )
	->take( 10 )
	->get();
```

`where()` always compares with `=`. Use `where_raw()` to compare with a
different operator or to join a clause with `OR`:

```php
$recent = Subscriber::query()
	->where_raw( 'created_at', '>=', '2025-01-01 00:00:00' )
	->where_raw( 'status', '=', 'confirmed', 'OR' )
	->get();
```

Values are passed through `$wpdb->prepare()`, but column names and operators
are not escaped. Never pass user input as a column name or operator.

You can limit the columns that are selected with `select()`:

```php
$emails = Subscriber::query()->select( [ 'id', 'email' ] )->get();
```

To see the SQL a query will run, call `dumpSql()` or `ddSql()`:

```php
Subscriber::where( 'status', 'confirmed' )->dumpSql();
```

## Testing

Use [`assertDatabaseHas()` and `assertDatabaseDoesNotHave()`](../testing/assertions.md#database-assertions)
to check the rows in your table from a test:

```php
use App\Models\Subscriber;

Subscriber::create( [ 'email' => 'reader@example.org' ] );

$this->assertDatabaseHas( Subscriber::get_table_name(), [
	'email' => 'reader@example.org',
] );
```
