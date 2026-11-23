// The vendored GSAP distributions expect classic script semantics.
function loadVendor(file) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = new URL('./motion-vendor/' + file + '?v=3.15.1', import.meta.url).href;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Gagal memuat ' + file));
    document.head.append(script);
  });
}
await loadVendor('gsap.min.js');
const gsap = window.gsap;
await loadVendor('ScrollTrigger.min.js');
const plugin = window.ScrollTrigger;
gsap.registerPlugin(plugin);
let enabled = true;

export function suspend() {
  if (enabled) plugin.disable();
  enabled = false;
}

export function createScene(room) {
  if (!enabled) plugin.enable();
  enabled = true;
  const find = gsap.utils.selector(room);
  const stage = find('.gallery-stage')[0];
  const depth = gsap.timeline({scrollTrigger:{
    id:'showroom-depth', trigger:stage, start:'clamp(top 18%)', end:'clamp(bottom top)', scrub:true
  }});
  depth.to(find('.room-wall'), {yPercent:2.5, ease:'none'}, 0)
    .to(find('.gallery-track'), {scale:.978, ease:'none'}, 0);
  let arrival;
  function cancelArrival() {
    arrival?.revert();
    arrival = null;
  }
  // Opening package details changes the maximum scroll distance used by clamp().
  const refresh = gsap.delayedCall(.08, () => plugin.refresh()).pause();
  const resize = window.ResizeObserver && new ResizeObserver(() => refresh.restart(true));
  resize?.observe(document.querySelector('.studio-info'));
  return {
    ticker:gsap.ticker,
    cancelArrival,
    arrive(frame, direction) {
      cancelArrival();
      arrival = gsap.timeline({defaults:{ease:'power2.out'}});
      arrival.from(frame, {y:4, scale:.99, duration:.28}, 0)
        .from(find('#selected-title'), {x:direction * 7, opacity:.78, duration:.24}, .035)
        .from(find('#selected-desc'), {x:direction * 4, opacity:.78, duration:.22}, .07);
    },
    destroy() {
      resize?.disconnect();
      refresh.kill();
      cancelArrival();
      depth.revert();
      suspend();
    }
  };
}
