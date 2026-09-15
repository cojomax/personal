# Max Cobbett's Personal Site

A public-facing personal website — a single-page profile showcasing work experience,
skills, and personal projects.

## Stack

- **[Astro](https://astro.build)** — file-based routing, component-based pages
- **Tailwind CSS v4** — utility-first styling, configured via `@theme` in
  `src/styles/global.css` rather than a `tailwind.config.js`
- **[astro-icon](https://www.astroicon.dev/)** (with the `@iconify-json/mdi` icon
  set) — inline SVG icons throughout (nav, socials, experience, projects)
- **Cloudflare adapter** (`@astrojs/cloudflare`) — `pnpm build` produces a
  Cloudflare Worker, deployed via `wrangler.jsonc`

## Site structure

Single home page (`src/pages/index.astro`) composed of:

- **Navbar** — centered nav links over a sticky, blurred header; GitHub/LinkedIn
  icons on the right, separated by a divider from a dark mode toggle
- **Hero** — quick intro
- **Experience** — work history as a timeline: role, company, location, dates
  (each with its own icon), a summary, bullet highlights, and tag pills for the
  languages/tech used
- **Skills** — grouped tag pills (Languages / Frameworks & Libraries /
  Tools & Platforms)
- **Projects** — cards with a status badge (In Development / Deployed /
  Archived), tags, and GitHub + Website link buttons (Website only shown when
  a project has a live URL)

## Design

- **Primary color**: violet, aliased as semantic `primary-*` Tailwind tokens
  (`src/styles/global.css`) so the whole site can be re-themed by editing that
  one block.
- **Background**: a warm off-white (`stone-50`) in light mode and a warm
  charcoal (`stone-900`) in dark mode — not plain white/black.
- **Dark mode**: manually toggleable (not just system-driven). Uses a
  `.dark` class on `<html>` (via Tailwind's `@custom-variant dark`), set by an
  inline script in `Layout.astro`'s `<head>` (no flash on load) that checks
  `localStorage` first, falling back to the visitor's system preference.
  Clicking the toggle in the navbar flips the class and persists the choice.

## Commands

```
pnpm install              # install dependencies
pnpm dev                  # start dev server at localhost:4321
pnpm build                # build production site to ./dist/ (Cloudflare Worker output)
pnpm preview               # preview the Cloudflare build locally (via wrangler)
pnpm astro check           # type-check .astro files
pnpm generate-types        # regenerate worker-configuration.d.ts from wrangler.jsonc
```

## Status

Structure and content derived from an existing CV. Updates coming soon. 