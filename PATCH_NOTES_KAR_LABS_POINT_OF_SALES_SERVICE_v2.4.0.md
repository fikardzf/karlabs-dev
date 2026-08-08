# KAR Labs Point Of Sales Service & Interactive Portfolio Demo v2.4.0

Baseline: cumulative KAR Labs.dev v2.3.0.

## Source reviewed
`POS.zip` was reviewed as KAR Labs POS, a Laravel 12 + Vue 3 + TypeScript/Tailwind POS application. Its user-facing flows include product/cart operations, customers, cash registers, hold/pending orders, discounts/taxes/coupons, payments, inventory/stock validation, receipt/printing, orders, and sales dashboard/reporting.

## Changes
- Added **Point Of Sales** to the homepage service grid.
- Added POS to the lead form service selector.
- Added POS to the footer service navigation.
- Added `catalog.html#pos` as a new interactive service catalog page.
- Added a static portfolio POS simulation with:
  - product search and product grid;
  - add-to-cart;
  - quantity increment/decrement;
  - demo stock awareness and low-stock state;
  - customer selector;
  - 0%, 5%, and 10% discount simulation;
  - 11% tax calculation;
  - Cash / Card / Bank payment selection;
  - Hold Order simulation;
  - Checkout and receipt preview;
  - reset / new transaction flow.
- Added POS-specific client-fit, customization, output, and WhatsApp consultation copy.
- Existing service catalog navigation remains hash-based and now includes `pos`.

## Important scope
The portfolio POS is a front-end simulation only. It does not connect to a database, real payment gateway, printer, or the uploaded Laravel POS backend. Its interaction is designed to communicate the core workflow to prospective clients while keeping the KAR Labs.dev catalog deployable as a static site.

## Validation
- `npm run check` passed.
- `npm run build` passed.
- Catalog inline JavaScript passed `node --check`.
- No duplicate DOM IDs found in `index.html` or `catalog.html`.
- Homepage catalog navigation now covers 8 unique service targets, including `catalog.html#pos`.
