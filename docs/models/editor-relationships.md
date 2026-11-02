---
title: Editor Relationships
description: Let editors set Mantle model relationships from the block editor.
---

# Editor Relationships

:::warning Work in progress

Editor Relationships is under active development and is not ready for
production use. Its PHP API, REST field, storage rules, and editor UI may change
without notice.

:::

## Introduction

[Relationships](./model-relationships.md) are normally set in PHP. The
[Mantle Editor Relationships](https://github.com/alleyinteractive/mantle-editor-relationships)
plugin lets you opt individual relationships in to the block editor so editors
can set them on a post. Each relationship gets its own panel in the post's
settings sidebar:

- Related posts are picked with the `PostPicker` search modal from
  [`@alleyinteractive/block-editor-tools`](https://github.com/alleyinteractive/alley-scripts/tree/main/packages/block-editor-tools).
  Each related post has its own **Replace** and **Remove** buttons.
- Related terms are picked with the `TermSelector` token field.

Selections are saved with the post through Mantle's own relationship methods,
so `$article->related_articles` returns exactly what the editor picked.

<img src={require('@site/static/img/docs/editor-relationships/editor.png').default} alt="The block editor with relationship panels in the post settings sidebar" />

## Installation

Install the plugin with Composer and activate it in WordPress:

```bash
composer require alleyinteractive/mantle-editor-relationships
```

The plugin depends on `mantle-framework/database` and does not require a full
Mantle application. It requires WordPress 6.6 or later.

## Opting In a Relationship

Add the `#[Editor_Relationship]` attribute to a relationship method on a post
model:

```php
use Mantle\Database\Model\Post;
use Mantle\Database\Model\Relations\Belongs_To;
use Mantle\Database\Model\Relations\Belongs_To_Many;
use Mantle\Database\Model\Relations\Has_Many;
use Mantle\Editor_Relationships\Attributes\Editor_Relationship;

class Article extends Post {
	public static $object_name = 'post';

	#[Editor_Relationship( label: 'Featured Page' )]
	public function featured_page(): Belongs_To {
		return $this->belongs_to( Page::class, null, 'featured_page_id' );
	}

	#[Editor_Relationship( label: 'Related Articles', max: 3 )]
	public function related_articles(): Belongs_To_Many {
		return $this->belongs_to_many( Article::class, null, 'related_article_ids' )->uses_terms();
	}

	#[Editor_Relationship]
	public function tags(): Has_Many {
		return $this->has_many( Tag::class );
	}
}
```

The attribute accepts two optional arguments:

| Argument | Description |
| --- | --- |
| `label` | The panel title. Defaults to a headline of the method name, such as "Related Articles". |
| `max` | The most items a `has_many()` or `belongs_to_many()` relationship can hold. |

### Discovering Models

The plugin needs to know which models to scan for the attribute. In a Mantle
application, models from the [model manifest](./model-registration.md) and the
`models.register` configuration are discovered automatically.

Outside a Mantle application, add the model with the
`mantle_editor_relationships_models` filter or the `discover_relationships()`
helper:

```php
use function Mantle\Editor_Relationships\discover_relationships;

add_filter(
	'mantle_editor_relationships_models',
	fn ( array $models ) => [ ...$models, Article::class ],
);

// Or, before `rest_api_init` (on `init`, for example):
discover_relationships( Article::class );
```

### Registering Without the Attribute

To opt in a relationship without the attribute, such as one on a model you don't
own, register it directly:

```php
use function Mantle\Editor_Relationships\register_relationship;

register_relationship(
	Article::class,
	'related_articles',
	[
		'label' => 'Related Articles',
		'max'   => 3,
	],
);
```

Relationships must be registered before `rest_api_init` fires.

## Supported Relationships

The model being edited must extend `Mantle\Database\Model\Post`. The related
model can be a post or a term model.

| Relationship | Cardinality | Editor control | Where the data is stored |
| --- | --- | --- | --- |
| `belongs_to()` | Many-to-one | Single | Meta on the post being edited. |
| `has_one()` | One-to-one | Single | Meta on the related post. |
| `has_many()` | One-to-many | Multiple | Meta on the related posts, the internal relationship taxonomy with `uses_terms()`, or core terms when relating to a term model. |
| `belongs_to_many()->uses_terms()` | Many-to-many | Multiple | The internal relationship taxonomy on the post being edited. |

Single relationships show one picker with **Replace** and **Remove** buttons.
Multiple relationships list each related post as a compact row and show an
**Add** button until `max` is reached. Relationships to terms use a token field.

<img src={require('@site/static/img/docs/editor-relationships/panels.png').default} alt="Relationship panels for a single page, a single lead page, multiple related articles, multiple child pages, and topic terms" width="280" />

:::note

The plugin skips a relationship it can't edit safely and reports it with
`_doing_it_wrong()`:

- `belongs_to_many()` must chain `uses_terms()`. A meta-backed
  `belongs_to_many()` only returns its first related model when lazy loaded.
- `belongs_to()` and `has_one()` must not chain `uses_terms()`. Saving a single
  relationship term replaces every other relationship term on the post.
- Term models can't be the model being edited. Relate from the post side
  instead, such as `has_many( Tag::class )`.

:::

### Permissions

`has_one()` and `has_many()` relationships to posts are stored on the related
posts. Saving one requires the user to be able to edit every post being added or
removed. Relating to a term model requires the taxonomy's `assign_terms`
capability.

## REST API

Each post type with an editor relationship gets a `mantle_relationships` field
in the `edit` context, keyed by relationship method. Single relationships are an
ID or `null`, and multiple relationships are a list of IDs:

```json
{
	"mantle_relationships": {
		"featured_page": 12,
		"related_articles": [ 34, 56 ],
		"tags": [ 7 ]
	}
}
```

Sending the field in an update replaces the relationships it includes and
leaves the others alone. Every value is validated before any relationship is
written: an ID of the wrong type or more IDs than `max` returns a `400` error,
and a missing capability returns a `403` error.

## Limitations

- The related post type or taxonomy must be registered with `show_in_rest`,
  since the editor searches it through the REST API.
- The picker only searches published posts. Related posts of any other status
  except trash are still read and kept.
- Related models are returned in the related model's default query order, not
  the order they were picked in.
- Two `belongs_to*()` relationships to the same model need distinct local keys,
  otherwise they share the same meta key (`featured_page_id` and
  `related_article_ids` above).
- Relationships are saved when the post is saved. Autosaves and previews don't
  include them.
