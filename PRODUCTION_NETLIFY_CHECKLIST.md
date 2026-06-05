# KAR Labs.dev — Netlify Production Checklist

## Build setting recommended

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: `20`

The same values are already included in `netlify.toml`.

## Before deploy

1. Run `npm install` if dependencies are not installed.
2. Run `npm run check`.
3. Run `npm run build`.
4. Preview locally with `npm run preview`.
5. Open `dist/index.html` and `dist/catalog.html` through the preview server, not by double-clicking, so relative assets behave like production.

## Manual Netlify deploy

Upload the `dist` folder to Netlify Drop or to the deploy dropzone of an existing Netlify site.

## Git-based Netlify deploy

Push this project to GitHub, connect the repository in Netlify, and use the build settings above. Future pushes will trigger automatic deploys.

## Final QA

- Test homepage menu on mobile.
- Test landing page preview button on mobile and desktop.
- Test pricing card electric border activation.
- Test WhatsApp links.
- Test catalog tabs: Landing, Chatbot, Calculator, Dashboard, Design AI, Workflow, Scraping.
