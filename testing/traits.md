# Traits

Mantle's Test Framework uses traits to add optional functionality to a test
case.

* `Refresh_Database` - Using this trait ensures that the database is rolled back
  after each test in the test case has run. Without it, data in the database
  will persist between tests, which almost certainly would not be desirable.
  That said, if your test case doesn't interact with the database, omitting this
  trait will provide a significant performance boost.
* `Admin_Screen` - Using this trait sets the current "screen" to a WordPress
  admin screen, and `is_admin()` will return true in tests in the test case
* `Network_Admin_Screen` - Same as with `Admin_Screen` except for the network
  admin and `is_network_admin()`
