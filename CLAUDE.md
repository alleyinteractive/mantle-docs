# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the documentation site for the [Mantle Framework](https://github.com/alleyinteractive/mantle-framework) — a Laravel-inspired framework for building applications with WordPress. The site is built with Docusaurus 3 and deployed to https://mantle.alley.com via Netlify.

## Commands

```bash
npm install          # install dependencies (requires Node >= 22, see .nvmrc)
npm run dev          # start local dev server (alias for `docusaurus start`)
npm run build        # build static site into build/
npm run serve        # serve built site locally
npm run typecheck    # run `tsc` against docusaurus.config.ts / sidebars.ts / src/
npm run clear        # clear Docusaurus cache (.docusaurus/)
```

Versioning (managing released doc versions):

```bash
npm run docusaurus docs:version <version>   # snapshot current docs/ into versioned_docs/
```

Broken links fail the build (`onBrokenLinks: 'throw'` in `docusaurus.config.ts`). Always run `npm run build` to verify link integrity before committing doc changes that move or rename pages.

## Architecture

- **`docs/`** — the current/unreleased documentation (labeled "1.x" in the UI). Edits here affect `/docs/...` on the live site.
- **`versioned_docs/version-<X>/`** — snapshots of older doc versions. `versions.json` lists them. Do not edit current docs and expect old versions to update; each version is an independent copy.
- **`versioned_sidebars/`** — sidebar configuration frozen at each version snapshot.
- **`sidebars.ts`** — sidebar config for the current docs. All top-level pages must be listed here or under a `generated-index` category to appear in navigation.
- **`docusaurus.config.ts`** — site config. Notable: `lastVersion: 'current'`, Algolia search (`indexName: 'mantle'`), GA tracking, Prism languages (`bash, json, php, diff`).
- **`src/theme.ts`** — custom Prism light/dark themes imported by `docusaurus.config.ts`.
- **`src/pages/index.tsx`** — custom homepage (not a doc page).
- **`src/components/`** — React components used in MDX pages (`HomepageFeatures`, `HomepageExamples`, `Features`, `TOCInlineWrapped`).
- **`netlify.toml`** — build config + URL redirects. When renaming/moving a doc page, add a 301 redirect here rather than leaving broken inbound links.
- **`static/`** — served at site root (images, favicon, etc.).

## Adding or editing documentation

- Current docs live in `docs/`. Use `.md` for plain Markdown, `.mdx` when you need React/JSX (e.g., `<Tabs>`, custom components).
- When moving or renaming a doc page, update `sidebars.ts` AND add a `[[redirects]]` entry to `netlify.toml`.
- When changing code snippets, also update the equivalent page in `versioned_docs/version-0.12.x/` only if the fix is a correction that applies to that released version. Feature additions should land in current docs only.
- Redirect-only URL rewrites belong in `netlify.toml`, not in Docusaurus config.

## Documentation style (from .github/copilot-instructions.md)

Authoritative style guide lives at `.github/copilot-instructions.md`. Key rules:

- **PHP code samples**: tabs for indentation, WordPress coding standards, PHP 8.2+, always include the relevant `use` statements, no `<?php` tags.
- **Test code samples**: PSR-4 class naming but keep tab indentation.
- Use Docusaurus admonitions (`:::tip`, `:::note`, `:::warning`, `:::danger`) for callouts.
- Use `<Tabs>` / `<TabItem>` (imported from `@theme/Tabs` / `@theme/TabItem`) for multi-variant code examples — this requires `.mdx`.
- Voice: direct ("you"), active, Laravel-docs-style progression (what → why → basic → advanced).
- Frontmatter with `title`, `description`, and optional `sidebar_position` on pages that need ordering.
