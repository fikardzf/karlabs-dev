# KAR Labs.dev — Patch v2.7.0
## Production Hardening & SEO Foundation

**Base:** v2.6.0 Catalog Modularization (accepted)
**Status:** PATCH CREATED — pending user acceptance/deploy confirmation

## Scope
- Technical SEO foundation: canonical, robots meta, Open Graph, Twitter/X card, JSON-LD.
- Root `robots.txt` and `sitemap.xml`.
- Branded 1200×630 social preview asset.
- Chart.js and Lucide CDN versions pinned.
- `posReceiptModal` moved out of `<head>` into valid `<body>`.
- Accessibility metadata for key catalog modals.
- `_blank` links hardened with `noopener noreferrer`.
- Chatbot user/custom text escaped before DOM rendering.
- Netlify basic headers extended with Permissions-Policy and HSTS.
- Source and `dist/` validation strengthened.
- README corrected to reflect actual static production architecture.

## Files changed
- `index.html`
- `catalog.html`
- `public/catalog-core.js`
- `public/catalog-chatbot.js`
- `public/karlabs-social-preview.png` (new)
- `robots.txt` (new)
- `sitemap.xml` (new)
- `scripts/build.cjs`
- `scripts/check.cjs`
- `scripts/check-dist.cjs` (new)
- `package.json`
- `netlify.toml`
- `README.md`
- `PATCH_NOTES_KAR_LABS_PRODUCTION_HARDENING_SEO_v2.7.0.md` (new)

## Build / migration requirement
- No database migration.
- No npm dependency installation required.
- Existing deployment remains `npm run build` -> `dist/`.
- Recommended acceptance command: `npm run check`.

## Deferred intentionally
Tailwind Play CDN remains unchanged in v2.7.0 to avoid a framework/version migration inside a hardening patch. Moving Tailwind to compiled/static CSS should be handled as a dedicated future patch.
