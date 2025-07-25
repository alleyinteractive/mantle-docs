# Documentation Guidelines for Mantle Framework

These are instructions for GitHub Copilot to follow when generating documentation for the Mantle framework (https://github.com/alleyinteractive/mantle-framework).
The goal is to create clear, helpful, and consistent documentation that aligns with the Mantle project's style and standards. The site uses Docusaurus for documentation, so please follow Docusaurus-specific conventions where applicable.

## Code Style Guidelines

### PHP Code Formatting
- **Always use tabs for indentation** - never spaces
- **Follow WordPress coding standards** for all PHP code examples EXCEPT for tests
- **For test files or testing related code**: Use PSR-4 file/class naming conventions but maintain tab indentation
- Do not include `<?php` or `?>` tags in documentation.
- Target PHP 8.2 or higher.

### Example PHP Code Structure
```php
namespace App\Models;

use Mantle\Database\Model\Model;

class Post extends Model {
	/**
	 * The attributes that are mass assignable.
	 *
	 * @var array
	 */
	protected $fillable = [
		'title',
		'content',
		'status',
	];

	/**
	 * Get the author of the post.
	 */
	public function author() {
		return $this->belongs_to( User::class );
	}
}
```

### Test Code Example
```php
namespace Tests\Feature;

use Mantle\Testing\TestCase;

class PostTest extends TestCase {
	public function test_can_create_post(): void {
		$post = Post::factory()->create([
			'title' => 'Test Post',
		]);

		$this->assertInstanceOf(Post::class, $post);
		$this->assertEquals('Test Post', $post->title);
	}
}
```

## Documentation Writing Style

### Documentation Platform
- **All documentation is written for Docusaurus** - use Docusaurus-specific features when appropriate
- Use MDX format for interactive components when needed
- Take advantage of Docusaurus admonitions (:::note, :::tip, :::warning, :::danger)
- Use proper frontmatter for page metadata

### Docusaurus-Specific Features

#### Frontmatter Example:
```yaml
---
title: Model Relationships
description: Learn how to define and work with model relationships in Mantle
sidebar_position: 4
---
```

#### Admonitions:
Use Docusaurus admonitions for important information:

```markdown
:::tip
This feature works great with WordPress custom post types!
:::

:::note
Remember to register your models in your service provider.
:::

:::warning
This method requires PHP 8.1 or higher.
:::
```

#### Code Tabs:
Use code tabs for showing multiple approaches:

```markdown
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="basic" label="Basic Usage">
    ```php
    $post = Post::find(1);
    ```
  </TabItem>
  <TabItem value="advanced" label="With Relationships">
    ```php
    $post = Post::with('author')->find(1);
    ```
  </TabItem>
</Tabs>
```

### Tone and Voice
- **Be helpful and friendly** - write as if you're helping a friend learn
- **Use clear, conversational language** similar to Laravel's documentation style
- **Be encouraging** - acknowledge when concepts might be challenging
- **Provide context** - explain not just how, but why

### Structure Guidelines
- Start with a brief introduction explaining what the feature does and why it's useful
- Include practical, real-world examples that developers can relate to
- Break complex topics into digestible sections
- Use code examples liberally to illustrate concepts
- End sections with "next steps" or related topics when appropriate

### Writing Patterns to Follow

#### Good Introduction Example:
> The Mantle Cache system provides a unified API for various caching backends, making it easy to speed up your application by storing frequently accessed data. Whether you're caching database queries, API responses, or computed values, Mantle's cache gives you a simple, expressive interface that works the same regardless of your underlying cache driver.

#### Code Example Formatting:
- Always include context around code examples
- Show both the code and the expected outcome when possible
- Use realistic variable names and scenarios
- Include comments in code when they add clarity

#### Section Organization:
1. **What it is** - Brief explanation of the feature
2. **Why you'd use it** - Common use cases and benefits
3. **Basic usage** - Simple examples to get started
4. **Advanced features** - More complex scenarios
5. **Configuration** - How to customize behavior
6. **Best practices** - Tips and recommendations

### Language Preferences
- Use "you" to address the reader directly
- Use active voice when possible
- Prefer "Let's" over "We will" for instructional content
- Use "Note:" or "Tip:" callouts for important information
- Be specific about requirements and prerequisites

### Code Documentation
- Every code example should be functional and tested
- Include necessary imports and use statements
- Show file paths when relevant for context
- Explain any "magic" or non-obvious behavior
- Link to related concepts and documentation

### Cross-References
- Link to related documentation sections when mentioning other features
- Include links to source code when discussing advanced topics
- Mention WordPress hooks/filters when relevant to WordPress developers

## Examples to Emulate

Write documentation that feels similar to these Laravel documentation examples:
- Clear explanations followed by practical code
- Progressive complexity (simple → advanced)
- Helpful asides and tips
- Real-world scenarios and use cases

## What to Avoid
- Overly technical jargon without explanation
- Examples that are too abstract or contrived
- Assuming too much prior knowledge
- Inconsistent code formatting
- Missing context around code examples