# LLMs support for mantle-docs

**Date:** 2026-04-17
**Status:** Design approved, pending implementation plan

## Goal

Make the Mantle docs site consumable by LLMs (ChatGPT, Claude, Cursor, Copilot) by exposing:

1. A machine-readable index at `/llms.txt` following the [llmstxt.org](https://llmstxt.org) spec.
2. Per-page raw markdown at `/docs/<path>.md` for every current-version doc page.
3. A per-page "View as markdown" affordance so humans can grab a clean markdown copy to paste into an LLM.

Out of scope: serving legacy (`0.12.x`) versioned docs to LLMs, and generating a monolithic `llms-full.txt`.

## Approach

Install **`@signalwire/docusaurus-plugin-llms-txt`** as a Docusaurus plugin. It runs in the `postBuild` lifecycle, reads the rendered HTML from `build/`, converts to clean markdown via unified/remark, and writes the `.md` files and `llms.txt` alongside the HTML.

### Why HTML-based conversion

Mantle docs use MDX heavily: `<Tabs>` / `<TabItem>` for PHP-vs-test variants, `<HomepageFeatures>`, `<TOCInlineWrapped>`, plus Docusaurus admonitions (`:::tip`, `:::note`). A source-based plugin (e.g., `docusaurus-plugin-llms` by rachfop) would emit raw JSX tags in the markdown, which is noisy and confusing to an LLM. HTML-based conversion renders MDX first, so the LLM sees the actual content.

### Alternatives considered

| Plugin | Why not |
|---|---|
| `docusaurus-plugin-llms` (rachfop) | Source-based; MDX components leak as JSX. |
| `din0s/docusaurus-plugin-llms-txt` | Only emits a single concatenated file; no per-page endpoints. |
| `FlyNumber/markdown_docusaurus_plugin` | Only per-page `.md` URLs, no `llms.txt` index. |
| Custom plugin | Reinvents what `@signalwire/docusaurus-plugin-llms-txt` already does. |

## Configuration

Add to `docusaurus.config.ts`:

```ts
plugins: [
  [
    '@signalwire/docusaurus-plugin-llms-txt',
    {
      generateMarkdownFiles: true,
      generateLLMsTxt: true,
      generateLLMsFullTxt: false,
      enableMarkdownActions: true,
      content: {
        includeVersionedDocs: false,
        excludeRoutes: ['/docs/0.12.x/**', '/next/**', '/'],
      },
    },
  ],
],
```

Option names will be verified against the plugin's current README during implementation — the signalwire plugin's option surface has evolved across versions. The shape above captures intent, not exact keys.

## Scope

- **Current (1.x) docs only.** Matches the existing `sitemap` config, which already ignores `/docs/0.12.x/**` and `/next/**`.
- **Exclude the custom homepage** (`src/pages/index.tsx`). It's marketing, not docs, and LLMs don't benefit from it.

## Outputs after `npm run build`

```
build/
  llms.txt                          # index
  docs/
    getting-started/index.md        # per-page markdown
    getting-started/installation.md
    ...
```

Netlify serves `build/` as static files, so no `netlify.toml` changes are required. Any existing redirect pattern that rewrites `/docs/*` should be verified to not interfere with `.md` URLs.

## User-facing UI

The plugin's `enableMarkdownActions` option injects a small link near each doc page's title (e.g., "View as markdown"). This signals to humans that LLM-friendly output is available and gives them a one-click copy path.

## Validation checklist

- `npm run build` completes without errors
- `build/llms.txt` exists and follows llmstxt.org spec (H1 title, summary, link list)
- `build/docs/getting-started/index.md` exists and contains clean, readable markdown with rendered `<Tabs>` content (not raw JSX)
- Open a doc page in `npm run serve`: "View as markdown" link is present and resolves to the correct `.md` URL
- `build/llms.txt` does NOT contain any `0.12.x` entries
- `build/docs/0.12.x/` directory is either absent or not referenced from `llms.txt`
- Broken-link check still passes (`onBrokenLinks: 'throw'`)

## Risks / open questions

- **Plugin option names**: API may have shifted; implementation should start by reading the plugin's current README and mapping intent to actual keys.
- **Build time**: Converting every HTML page adds build cost. Acceptable for a docs site this size (hundreds, not thousands, of pages).
- **Algolia crawler**: Algolia indexes from HTML; `.md` endpoints shouldn't affect it, but worth confirming nothing in the crawler config picks up the duplicate content.
- **Sitemap**: We likely want `/llms.txt` and the `.md` endpoints *excluded* from `sitemap.xml` to avoid diluting SEO. Add `ignorePatterns: ['**/*.md', '/llms.txt']` to the existing sitemap config if the plugin doesn't handle this itself.

## Future work (not in this change)

- Add `llms-full.txt` if user demand materializes.
- Expose older versioned docs once the team decides which releases should remain addressable to LLMs.
- Consider a GitHub Action on release to verify `llms.txt` remains valid.
