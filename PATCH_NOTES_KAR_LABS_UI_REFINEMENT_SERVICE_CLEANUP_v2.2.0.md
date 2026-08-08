# KAR Labs UI Refinement & Service Cleanup Patch v2.2.0

Baseline: KAR Labs Full-Site Visual Theme Migration v2.1.0

## Scope

1. Mobile hamburger/menu stability
   - Prevents the scrolled navbar backdrop-filter state from making the fixed mobile drawer appear transparent/viewport-constrained.
   - Mobile drawer now keeps an opaque zinc/black background before and after scrolling.
   - Body menu-open state is added/removed consistently.

2. Compact mobile hero typography
   - Reduces hero title scale on mobile.
   - Tightens line-height/letter-spacing and caps title width for a more compact composition.
   - Desktop hero typography remains unchanged.

3. Service-card icon hover refinement
   - Removes the solid green icon-block hover treatment.
   - Keeps the icon visible with a subtle translucent green surface and green border/accent.

4. Remove Desain AI as an offered service
   - Removed homepage service card.
   - Removed catalog service switcher entry and public service panel.
   - Removed contact-form service option.
   - Removed footer service link.
   - Removed Starter package Desain AI inclusion.
   - Removed service CTA/detail/message mapping and gallery-specific runtime initialization/data.
   - Removed homepage/catalog deep-link references to #gallery.

## Functional regression guard

- Existing remaining catalog service deep-links preserved:
  - landing
  - product-catalog
  - chatbot
  - calculator
  - dashboard
  - workflow
  - scraping
- Pricing, FAQ, WhatsApp/contact, mobile navigation, catalog demos, and build architecture remain intact.
- `npm run check`: PASS
- production build: PASS
