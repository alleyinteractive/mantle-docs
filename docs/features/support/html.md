---
sidebar_label: HTML
---

# HTML Parsing, Assertions, and Manipulation

The `HTML` class provides methods to query, manipulate, and assert against HTML
strings and documents. It is built on top of the [`DomCrawler` component from
Symfony](https://symfony.com/doc/current/components/dom_crawler.html), which
provides a powerful and flexible way to work with HTML.

## Usage

### Filtering

### Traversing and Looping

### Accessing Node Values

### Modifying Node Values



get_by_selector( string $selector ): static {
first_by_id( string $id ): static {
first_by_tag( string $tag ): static {
first_by_testid( string $test_id ): static {
first_by_selector( string $selector ): static {
get_by_xpath( string $xpath ): static {
get_by_tag( string $tag ): static {
get_by_testid( string $test_id ): static {
first_by_xpath( string $xpath ): static {
modify( callable $callback ): static {
set_attribute( string $name, string $value ): static {
  set_data
remove_attribute
remove_data
get_data
add_class
remove_class
has_class
has_any_class
remove
prepend
append
after
before
next_until
previous_until
wrap
wrap_all
wrap_inner
empty
has_nodes
dump

	public function dd