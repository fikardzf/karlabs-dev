// PixelBlast placeholder integration point.
// Dependencies are included in package.json: three and postprocessing.
// The live static site uses a lightweight canvas background in index.html/catalog.html
// to preserve the existing no-framework deployment flow.

export default function PixelBlast({ className = '', style = {} }) {
  return <div className={`pixel-blast-container ${className}`} style={style} aria-label="PixelBlast interactive background" />;
}
