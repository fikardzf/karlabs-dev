# KAR Labs Full Visual Theme Migration Patch v2.0.0

## Scope
Full visual redesign of the KAR Labs.dev homepage using the supplied pasted source as a design-system / visual reference while preserving baseline functionality.

## Changed
- `index.html`

## Visual migration
- New black/zinc visual system with KAR green `#006847` accent.
- Inter body typography + Oswald display headings.
- New fixed dotted/grid backdrop and restrained green ambient glow.
- New branded navbar treatment and green code-braces mark.
- Fully redesigned editorial hero with large uppercase typography, CTA treatment, stats, and terminal-style business-solution preview.
- Section kicker numbering and stronger editorial hierarchy.
- Restyled service cards while preserving all catalog deep-links.
- Restyled process, pricing, testimonials, FAQ, contact, and footer surfaces.
- Consistent green hover/focus/glow states.
- Reduced-motion accessibility fallback.
- Lucide retained; no new Iconify dependency introduced.

## Functional regression guards verified
- Existing section IDs preserved: hero, layanan, proses, harga, testimoni, faq, kontak.
- Mobile-menu IDs and behavior hooks preserved.
- 16 catalog deep-links preserved exactly across 8 catalog targets.
- 6 FAQ accordion triggers preserved.
- Contact form ID/field IDs preserved.
- Existing WhatsApp number and generated-message flow preserved.
- Existing Lucide initialization preserved.
- Existing electric pricing CSS/JS references preserved.
- `catalog.html` and pricing assets are byte-identical to baseline.
- `npm run check` passed.
- Production build completed successfully.

## Apply
Copy `index.html` from this patch over the current baseline `index.html`, then run:

```bash
npm run check
npm run dev
```
