# KAR Labs Full-Site Visual Theme Migration v2.1.0

## Scope
- Builds cumulatively on homepage Full Visual Theme Migration v2.0.0.
- Fixes Process Kerja responsive geometry on homepage.
- Migrates `catalog.html` and all 8 service panels to the same black/zinc + KAR green `#006847` design language.
- Uses Oswald for display headings and Inter for body copy.
- Adds dotted ambient backdrop, editorial catalog hero, branded navigation, unified glass/card/button/form states, and restrained scroll reveal/panel transition motion.
- Keeps Lucide; no Iconify dependency added.

## Functional preservation
- Existing section/hash IDs preserved.
- Existing service panel routing preserved.
- Existing calculator/chatbot/dashboard/gallery/workflow/scraping interactions preserved.
- Existing 16 homepage deep links to catalog targets preserved.
- Pricing, FAQ, WhatsApp contact form, and build flow preserved.
- `public/` assets and builder scripts unchanged.

## Changed files
- `index.html`
- `catalog.html`

## Validation
Run:
```bash
npm run check
```
