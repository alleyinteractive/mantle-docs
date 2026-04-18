# LLMs Support Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expose mantle-docs to LLMs by generating `/llms.txt` and per-page `.md` endpoints for current (1.x) docs, plus a "Copy/View as markdown" UI action on each doc page.

**Architecture:** Install `@signalwire/docusaurus-plugin-llms-txt` (postBuild-time HTML→markdown conversion) and its companion theme `@signalwire/docusaurus-theme-llms-txt` (for the in-page UI). Configure in `docusaurus.config.ts`. No code written — pure configuration.

**Tech Stack:** Docusaurus 3.8.1, TypeScript config, `@signalwire/docusaurus-plugin-llms-txt@^1.2.2`, `@signalwire/docusaurus-theme-llms-txt` (canary).

---

## Post-implementation note (2026-04-17)

The plugin config shape in Task 2 below was based on the theme's README (which documents an
as-yet-unreleased plugin API). The installed plugin v1.2.2 uses a simpler flat schema. The
implementation used the **actual v1.2.2 shape**, verified against the plugin's
`lib/types/public.d.ts`:

```ts
plugins: [
  [
    '@signalwire/docusaurus-plugin-llms-txt',
    {
      runOnPostBuild: true,
      onRouteError: 'warn',
      content: {
        enableMarkdownFiles: true,
        enableLlmsFullTxt: false,
        includeBlog: false,
        includePages: false,
        includeDocs: true,
        includeVersionedDocs: false,
        excludeRoutes: ['/docs/0.12.x/**', '/next/**'],
      },
    },
  ],
],
themes: ['@signalwire/docusaurus-theme-llms-txt'],
```

Intent is preserved (current-docs-only scope, homepage excluded, per-page `.md` generated,
llms.txt generated, build not broken on one-off route errors). The plan's `ui.copyPageContent`
block was dropped — that option doesn't exist in v1.2.2; the theme falls back to built-in
defaults (button labeled "Copy Page" with Markdown / ChatGPT / Claude actions). The plan's
`onSectionError` key was also dropped — it doesn't exist in v1.2.2 either.

---

## File Structure

| File | Change | Responsibility |
|---|---|---|
| `package.json` | Modify | Add two new runtime deps. |
| `docusaurus.config.ts` | Modify | Register the plugin + theme, configure scope (current docs only), configure UI, tighten sitemap to exclude `.md` and `llms.txt`. |
| `tasks/plans/2026-04-17-llms-support.md` | Already exists | This plan. |
| `tasks/specs/2026-04-17-llms-support-design.md` | Already exists | The approved design. |

No code modules, no tests to write — this is a plugin install. Verification happens via `npm run build` + inspecting `build/` artifacts and the running dev server.

---

## Task 1: Install plugin and theme packages

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json` (generated)

- [ ] **Step 1: Confirm Node version**

Run: `node --version`
Expected: `v22.x` or newer (repo uses `.nvmrc = 22`).

- [ ] **Step 2: Install the plugin and theme**

Run from the repo root:

```bash
npm install --save @signalwire/docusaurus-plugin-llms-txt@^1.2.2 @signalwire/docusaurus-theme-llms-txt@latest
```

Expected: Both packages land under `dependencies` in `package.json`. The theme is currently canary — if `npm` reports that `latest` does not resolve, fall back to:

```bash
npm install --save @signalwire/docusaurus-theme-llms-txt@canary
```

- [ ] **Step 3: Verify the install**

Run: `npm ls @signalwire/docusaurus-plugin-llms-txt @signalwire/docusaurus-theme-llms-txt`
Expected: Both packages resolve (no "UNMET DEPENDENCY"). The plugin should be `1.2.2` or newer; the theme a `0.0.0-canary-*` tag is acceptable.

- [ ] **Step 4: Verify peer-dep compatibility with Docusaurus**

Run: `npm ls @docusaurus/core`
Expected: Resolves to `3.8.1` (or the installed version). No peer-dep warnings from the new packages. If warnings appear, STOP and report them before proceeding — they may indicate the theme is incompatible with 3.8 and we'd need to drop it (see Task 3 fallback).

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install signalwire llms-txt plugin and theme"
```

---

## Task 2: Register the plugin in `docusaurus.config.ts`

**Files:**
- Modify: `docusaurus.config.ts`

- [ ] **Step 1: Add the plugin block**

Open `docusaurus.config.ts`. The file currently has no top-level `plugins` key. Add one **directly after the `presets: [...]` block, before `themeConfig`**:

```ts
  plugins: [
    [
      '@signalwire/docusaurus-plugin-llms-txt',
      {
        runOnPostBuild: true,
        include: {
          includeBlog: false,
          includePages: false,
          includeDocs: true,
        },
        markdown: {
          enableFiles: true,
          includeVersionedDocs: false,
          excludeRoutes: [
            '/docs/0.12.x/**',
            '/next/**',
          ],
        },
        llmsTxt: {
          includeVersionedDocs: false,
          excludeRoutes: [
            '/docs/0.12.x/**',
            '/next/**',
          ],
        },
        ui: {
          copyPageContent: {
            buttonLabel: 'Copy as Markdown',
            display: { docs: true, blog: false, pages: false },
            actions: { viewMarkdown: true, copyMarkdown: true },
          },
        },
        onSectionError: 'warn',
        onRouteError: 'warn',
      },
    ],
  ],
```

Notes on each block:
- `includePages: false` — excludes `src/pages/index.tsx` (the marketing homepage).
- `markdown.includeVersionedDocs: false` + `llmsTxt.includeVersionedDocs: false` — keeps `0.12.x` out of both the index and per-page `.md` generation. The explicit `excludeRoutes` glob is a belt-and-suspenders safeguard in case a future version is added.
- `onSectionError: 'warn'` / `onRouteError: 'warn'` — don't break the build on a single bad page; upgrade to `'throw'` once we trust it.

- [ ] **Step 2: Add the theme (UI component registration)**

The `ui.copyPageContent` option requires the companion theme package to be registered. Add a `themes` key at the same level as `plugins` (directly after the new `plugins` array):

```ts
  themes: ['@signalwire/docusaurus-theme-llms-txt'],
```

If Task 1 Step 4 surfaced a peer-dep warning that made the theme unusable, skip this step, remove the `ui` block from the plugin config, and proceed without the Copy/View UI action — the `.md` files and `llms.txt` will still be generated, we just won't have the in-page button. Document this fallback in the commit message.

- [ ] **Step 3: Run the typecheck**

Run: `npm run typecheck`
Expected: Exits 0. If TypeScript complains that the plugin's option shape doesn't match what we passed, read the error and adjust — the plugin ships its own types.

- [ ] **Step 4: Start the dev server and confirm it boots**

Run: `npm run dev`
Expected: Docusaurus starts on `http://localhost:3000` without errors mentioning the new plugin. Stop the server with Ctrl-C.

- [ ] **Step 5: Commit**

```bash
git add docusaurus.config.ts
git commit -m "feat: register signalwire llms-txt plugin and theme"
```

---

## Task 3: Exclude generated LLM artifacts from the sitemap

**Files:**
- Modify: `docusaurus.config.ts` (the existing `sitemap` block inside `presets`)

Rationale: `/llms.txt` and the per-page `.md` files are alternative representations of existing HTML pages. Listing them in `sitemap.xml` would give search engines duplicate content and dilute SEO. The sitemap plugin already ignores `/docs/0.12.x/**` and `/next/**`; extend it.

- [ ] **Step 1: Update the `sitemap.ignorePatterns` array**

Locate `docusaurus.config.ts` around lines 70–79 — the `sitemap` block inside the classic preset. The current shape is:

```ts
sitemap: {
  changefreq: 'weekly',
  priority: 0.5,
  ignorePatterns: [
    '/tags/**',
    '/docs/0.12.x/**',
    '/next/**',
  ],
  filename: 'sitemap.xml',
},
```

Change `ignorePatterns` to:

```ts
ignorePatterns: [
  '/tags/**',
  '/docs/0.12.x/**',
  '/next/**',
  '/llms.txt',
  '/llms-full.txt',
  '**/*.md',
],
```

`/llms-full.txt` is listed defensively — we aren't generating it now, but this prevents drift if the option is ever flipped.

- [ ] **Step 2: Typecheck**

Run: `npm run typecheck`
Expected: Exits 0.

- [ ] **Step 3: Commit**

```bash
git add docusaurus.config.ts
git commit -m "chore: exclude llms.txt and .md files from sitemap"
```

---

## Task 4: Build and verify artifacts

**Files:** None modified — pure verification.

- [ ] **Step 1: Clear cache and run a clean build**

```bash
npm run clear
npm run build
```

Expected: Build completes without errors. Watch stdout for a log line from the llms-txt plugin (something like `[llms-txt] Generated N markdown files, wrote llms.txt`). If the build throws, STOP and diagnose before continuing.

- [ ] **Step 2: Confirm `llms.txt` exists and looks correct**

Run:

```bash
ls -la build/llms.txt
head -50 build/llms.txt
```

Expected:
- File exists and is non-empty.
- First line is an H1 like `# Mantle by Alley` (or similar site title).
- Body contains markdown links to pages under `/docs/` — e.g., `- [Installation](/docs/getting-started/installation.md): ...`.
- No entries matching `/docs/0.12.x/` appear.

Run a grep to be sure:

```bash
grep -c '0\.12\.x' build/llms.txt
```

Expected output: `0`.

- [ ] **Step 3: Confirm per-page `.md` files exist and render correctly**

Spot-check a page that uses `<Tabs>` heavily. The Testing section has many:

```bash
ls build/docs/getting-started/installation.md
head -60 build/docs/getting-started/installation.md
```

Expected:
- File exists.
- Content is readable prose + fenced code blocks.
- **No raw `<Tabs>`, `<TabItem>`, or JSX tags** — the tab content should have been flattened to sequential markdown sections.
- Admonitions should render as something readable (blockquote with an emoji/label, typically).

Pick a second page to double-check — try `build/docs/testing/factory.md`.

- [ ] **Step 4: Confirm excluded pages are absent**

```bash
ls build/docs/0.12.x/ 2>&1 || echo "absent: good"
find build/docs -name '*.md' | xargs grep -l '0\.12\.x' 2>/dev/null | head -5
```

Expected: The `build/docs/0.12.x/` directory may exist as HTML (we still render those pages as a site), but no `.md` files should be inside it. If you see `.md` files under `0.12.x/`, the exclude glob didn't match — re-check the path format the plugin uses (it may want `/0.12.x/**` instead of `/docs/0.12.x/**`).

- [ ] **Step 5: Confirm the homepage is not in `llms.txt`**

```bash
grep -E '^- \[.*\]\(/\)' build/llms.txt || echo "homepage absent: good"
```

Expected: No match.

- [ ] **Step 6: Confirm the sitemap does not leak `.md` URLs**

```bash
grep -c '\.md<' build/sitemap.xml
grep -c 'llms\.txt' build/sitemap.xml
```

Expected output for both: `0`.

- [ ] **Step 7: No commit**

Nothing changed — verification only.

---

## Task 5: Verify the in-page UI action

**Files:** None modified — pure verification.

This task is skipped if Task 2 Step 2 was skipped (the theme-fallback branch).

- [ ] **Step 1: Serve the built site**

```bash
npm run serve
```

Expected: Serves `build/` on `http://localhost:3000`.

- [ ] **Step 2: Open a doc page in the browser**

Navigate to `http://localhost:3000/docs/getting-started/installation`.

Expected:
- A "Copy as Markdown" button (or dropdown) appears near the top of the article content.
- The dropdown exposes "View Markdown" and/or "Copy Markdown" options.

- [ ] **Step 3: Click "View Markdown"**

Expected: The browser navigates to `/docs/getting-started/installation.md` and renders raw markdown (the browser will typically show it as plain text). This is the same file verified in Task 4 Step 3.

- [ ] **Step 4: Click "Copy Markdown"**

Paste the clipboard into a scratchpad. Expected: Same content as the `.md` file.

- [ ] **Step 5: Confirm UI is absent on the homepage**

Navigate to `http://localhost:3000/`. Expected: No copy button (because `display.pages: false`).

- [ ] **Step 6: Stop the server**

Ctrl-C.

- [ ] **Step 7: No commit**

Nothing changed — verification only.

---

## Task 6: Test the 404 behavior for excluded versions

**Files:** None modified — pure verification.

- [ ] **Step 1: Start the served build again**

```bash
npm run serve
```

- [ ] **Step 2: Request a `.md` for a 0.12.x page**

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/docs/0.12.x/getting-started/installation.md
```

Expected: `404`. Good — confirms excluded pages are not published.

- [ ] **Step 3: Request `llms.txt`**

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/llms.txt
```

Expected: `200`.

- [ ] **Step 4: Request an included `.md`**

```bash
curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/docs/getting-started/installation.md
```

Expected: `200`.

- [ ] **Step 5: Stop the server and commit nothing**

Ctrl-C. No commit.

---

## Task 7: Netlify dry-run sanity check

**Files:** None modified — pure verification.

Rationale: `netlify.toml` has redirect rules. We want to ensure they don't interfere with `.md` URLs.

- [ ] **Step 1: Inspect `netlify.toml` redirects**

Read `netlify.toml` and list every `[[redirects]]` block. For each, check the `from` pattern:

- Does it match `/docs/*` or `/*`? If so, verify the `to` target doesn't strip `.md` extensions or redirect away from them.
- Patterns targeting specific old URLs (e.g., `/old-page` → `/new-page`) are fine.

If any redirect pattern could intercept `.md` URLs, add a more specific earlier rule that returns `/docs/:splat.md` as-is (status 200), or narrow the existing rule.

- [ ] **Step 2: No-op or commit (only if netlify.toml changed)**

If no changes were needed, proceed to Task 8. If a redirect was adjusted:

```bash
git add netlify.toml
git commit -m "chore: ensure netlify redirects don't intercept .md endpoints"
```

---

## Task 8: Final pre-merge checklist

**Files:** None modified — final verification.

- [ ] **Step 1: Clean build passes**

```bash
npm run clear && npm run build
```

Expected: Exit 0.

- [ ] **Step 2: Typecheck passes**

```bash
npm run typecheck
```

Expected: Exit 0.

- [ ] **Step 3: Broken-link policy is still enforced**

Docusaurus is configured with `onBrokenLinks: 'throw'`. Confirm the build above did not print any broken-link warnings. If it did, they need to be fixed (independent of this feature).

- [ ] **Step 4: Review the diff end-to-end**

```bash
git log --oneline main..HEAD
git diff main..HEAD -- package.json docusaurus.config.ts netlify.toml
```

Expected commits on this branch:
1. `chore: install signalwire llms-txt plugin and theme`
2. `feat: register signalwire llms-txt plugin and theme`
3. `chore: exclude llms.txt and .md files from sitemap`
4. (optional) `chore: ensure netlify redirects don't intercept .md endpoints`

- [ ] **Step 5: Surface the follow-ups**

Confirm the following are tracked (or open issues for them) — they are intentionally out of scope for this change:

- Upgrade `onSectionError` / `onRouteError` from `'warn'` to `'throw'` after a few deploys of confidence.
- Decide whether to generate `llms-full.txt` based on real-world LLM-tooling feedback.
- Monitor Algolia indexing for any noise from `.md` URLs (expected: none, since they're not in the sitemap).

Done.
