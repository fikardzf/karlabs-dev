# KAR Labs.dev — Patch v2.6.0 Catalog Modularization

## Baseline
- Source baseline: `public(1).zip` / production static HTML-CSS-Vanilla JS
- Production branch: `main`
- Deployment: GitHub -> Netlify
- Build command: `npm run build`
- Publish directory: `dist`

## Scope
Refactor internal `catalog.html` structure without changing framework, production build flow, or intended UI/behavior.

## Changes
- Extracted catalog CSS from inline `<style>` into `public/catalog.css`.
- Extracted Tailwind runtime configuration into `public/catalog-tailwind-config.js`.
- Split the monolithic catalog JavaScript into feature-focused classic scripts:
  - `public/catalog-core.js`
  - `public/catalog-landing.js`
  - `public/catalog-chatbot.js`
  - `public/catalog-calculators.js`
  - `public/catalog-dashboard.js`
  - `public/catalog-workflow.js`
  - `public/catalog-pos.js`
  - `public/catalog-scraping.js`
  - `public/catalog-init.js`
- `catalog.html` now references the extracted files in dependency-safe order.
- Existing `scripts/build.cjs` remains unchanged because it already copies the full `public/` directory into `dist/`.

## Intentionally unchanged
- Visual design and content.
- Static HTML/CSS/Vanilla JS architecture.
- Netlify configuration.
- `npm run build` flow.
- External CDN dependencies and versions.
- Existing HTML/accessibility hardening items outside the modularization scope.

## Migration / Build Requirement
- No database migration.
- No package installation.
- No new npm dependency.
- Overwrite changed files and add the new `public/catalog-*.js` / `public/catalog.css` files.
- Run `npm run check` and `npm run build`.

## Status
- Patch only; not considered LIVE until user tests and deploys it.
