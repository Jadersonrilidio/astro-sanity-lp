# Copilot instructions for astro-micra-project

## Build, test, and lint

This repo is a small Astro static site with a minimal package configuration:

- Start the dev server: `npm run dev`
- Build the production site: `npm run build`
- Preview the built site locally: `npm run preview`

There are currently no dedicated `test` or `lint` scripts in `package.json`, and no single-test command exists in this repository yet. Validation in practice is the Astro build (`npm run build`).

## Project architecture

This project is a static landing page website built with Astro, not a SPA or multi-app monorepo.

- `src/pages/` contains file-based routes: the homepage (`index.astro`), contact page (`contato.astro`). New routes are added by creating files in this directory.
- `src/layouts/Base.astro` is the shared document shell. It sets page metadata (`title`, `description`), includes the favicon, and renders the shared header/menu before the page content.
- `src/components/` holds reusable UI pieces such as `Button.astro`; keep component logic and markup in the same `.astro` file.
- `src/styles/global.css` is the global styling entry point. It imports Tailwind v4 (`@import "tailwindcss"`) and defines the design tokens used across the site (`--color-*`, spacing, menu motion, and fonts).
- `public/` stores static assets that are served directly, including branding assets like the Micra logo and favicon.
- `dist/` is generated build output and should not be edited by hand.

The site is intentionally lightweight: most pages are plain Astro markup with shared layout and CSS tokens rather than a heavier component framework setup.

## Key conventions

- Prefer Astro conventions over React/Vue patterns unless a clear need arises. This repo uses `.astro` files for pages, layouts, and components.
- Use the shared layout pattern from `Base.astro`: page files pass a `content` object with `title` and `description`, then render their content inside `<Base ...> ... </Base>`.
- Keep design tokens centralized in `src/styles/global.css`; do not duplicate colors, spacing, or transition values in individual components.
- Use file-based routing: route changes and new pages are driven by the file names under `src/pages/`.
- Keep static asset references in `public/` and use them as public URLs (for example `/assets/logo-micra.svg`) rather than importing from arbitrary locations.
- If you add or adjust UI behavior, prefer keeping the logic close to the component and use the same Astro component pattern already used in `Button.astro` rather than introducing a different client-script structure.

## Working style in this repo

- The repo is small and intentionally simple. Favor minimal, direct changes in the existing Astro structure instead of adding abstraction layers.
- Build validation is the main safety check here: run `npm run build` after significant changes before finishing.
- There is no separate lint/test workflow to follow yet; keep the code aligned with the existing Astro/Tailwind patterns already in use.
