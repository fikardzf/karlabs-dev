# KAR Labs — Business context for Codex

## Business direction

Pembaruan yang disetujui pada sesi 18 November 2026: tema production menjadi terang dengan logo PNG resmi pengguna. Harga awal (Start From): Starter mulai Rp500.000, Professional mulai Rp1.500.000, Premium mulai Rp3.000.000; nilai akhir dapat lebih tinggi sesuai kebutuhan dan scope. Premium maksimal satu workflow sederhana yang dinilai layak dan disepakati tertulis. ERP, CRM lengkap, AI kompleks dan pengembangan enterprise berada di luar paket dan memerlukan penawaran terpisah. Sumber: `config/packages.json`; implementasi dan ketentuan yang belum dikonfirmasi: `docs/LIGHT_THEME_REVIEW.md` dan `docs/MOBILE_PRICING_REVIEW.md`.
KAR Labs is building a practical, productized digital-service offering for Indonesian UMKM (small businesses). Current strategic priority: **Website Katalog Produk & Business Automation**. Services may combine website/catalog setup, WhatsApp inquiry flows, chatbot, dashboards, and operational workflow automation. The website acts as a lead-generation storefront and a live demonstration of deliverables.

## Buyer examples
- UMKM owners with products that are currently difficult to browse through WhatsApp chats.
- Dealers, spare-parts stores, retail shops, and online sellers with many SKUs.
- Small teams whose repetitive admin workflows can be simplified.

## Main conversion goals
1. Make the core offer clear to a new visitor within seconds.
2. Show real, labeled demonstrations and substantiated case studies.
3. Drive qualified inquiries via WhatsApp and the contact form.
4. Explain process, deliverables, scope, and realistic pricing without overpromising.
5. Keep the site fast, mobile-friendly, accessible, and discoverable.

## Current public website and repository
- Website: https://karlabs-dev.netlify.app/
- Canonical dikonfirmasi pemilik pada 18 November 2026: https://karlabs-dev.netlify.app/. URL production diselaraskan pada workspace; deployment belum dilakukan. Detail dan hasil audit ada di `docs/TECHNICAL_QUALITY_REVIEW.md`.
- Public GitHub: https://github.com/fikardzf/karlabs-dev
- Netlify build: `npm run build`; publish folder: `dist/`.
- Static source of truth: `index.html`, `catalog.html`, `public/`, `styles/`, `scripts/`, `netlify.toml`, `package.json`.

## Important version discrepancy — inspect before editing
On 2026-11-17, an uploaded `karlabs.zip` snapshot included v2.9.0 source with local Tailwind CSS compilation (`npm run build:css`, `styles/tailwind-theme.css`, `vendor/tailwindcss/`). Public GitHub `main` showed older v2.8.0 documentation and package scripts without local CSS compilation. The version actually deployed on Netlify has not been conclusively established. Compare all available sources, select the intended base with user approval, and reconcile in a separate Git branch without blindly overwriting files.

## Initial improvement themes (proposals, not yet approved features)
- Lead-focused homepage messaging and CTA hierarchy.
- A dedicated, compelling Website Katalog Produk offer and demo journey.
- Transparent portfolio/case-study presentation and trust signals.
- Mobile UX, loading performance, accessibility, SEO, analytics events, and contact funnel.
- Clear qualification form and automation service examples.

## Boundaries
Do not add integrations, tracking, paid products, synthetic client proof, pricing changes, or framework migrations without explicit approval. Prioritize incremental changes with screenshots, tested behavior, and reversible Git commits.
