# KAR Labs Contact / Lead Form Visual Reference Patch v2.3.0

Baseline: v2.2.0

## Scope
- Redesign homepage Contact / Lead Form section using the approved visual reference.
- Preserve existing KAR Labs contact identity and WhatsApp submission flow.
- Reframe desktop layout into two columns: consultation intro/contact information on the left, lead form on the right.
- Mobile layout stacks cleanly with compact heading and full-width form controls.

## Lead Form
Fields are now:
- Nama Lengkap
- Email / WhatsApp
- Jenis Website
- Ceritakan Kebutuhan Kamu

Submitting the form still opens KAR Labs WhatsApp with a prefilled lead summary.

## Contact details retained
- WhatsApp: 0857-7734-5985
- Email: karlabs.dev@gmail.com
- Location: Jakarta, Indonesia

## Files changed
- index.html

## Validation
- npm run check: PASS
- npm run build: PASS

## Packaging standard
This ZIP intentionally has no wrapper directory. Extracting it exposes the patch files directly.
