/**
 * KAR Labs v2.9.0 Tailwind production build manifest.
 *
 * The project does not use the Tailwind Play CDN anymore. The local compiler in
 * scripts/build-tailwind.cjs scans these production sources and writes
 * public/tailwind.css before the static dist/ copy step runs.
 */
module.exports = {
  content: [
    './index.html',
    './catalog.html',
    './public/*.js',
  ],
  safelist: [
    'hidden',
    'block',
    'text-left',
    'text-right',
    'justify-start',
    'justify-end',
    'text-red-400',
    'text-yellow-300',
    'text-green-400',
    'text-blue-400',
  ],
};
