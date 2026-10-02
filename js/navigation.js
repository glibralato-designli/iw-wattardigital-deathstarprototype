/* Portal-safe navigation and screen-state presets. Product-safe: no review UI.
   Load it on every product page, after theme.js and before js/product.js (both deferred).
   Why: the Design Portal serves every screen state as its own renamed file. Screens survive
   that when (1) every move between screens is a real link in the markup, (2) a state can be
   switched on by a preset, and (3) timed moves only fire inside a real click-through.
   tools/export_portal.py relies on this contract. See DESIGN.md, "Portal export". */
(() => {
  const params = new URLSearchParams(location.search);
  // Exported portal files bake their state preset in; URL parameters still win.
  for (const [key, value] of Object.entries(window.PREVIEW_PARAMS || {})) if (!params.has(key)) params.set(key, value);
  const exported = window.PREVIEW_EXPORT === true;
  // ?preview=still (the canvas and exported snapshots): no timed moves, entrances settled.
  const still = params.get('preview') === 'still';
  const carried = ['theme'];

  const carry = href => {
    const url = new URL(href, location.href);
    if (url.origin === location.origin) for (const key of carried) if (params.get(key) && !url.searchParams.has(key)) url.searchParams.set(key, params.get(key));
    return url.href;
  };

  /* route('details') → the href of <a data-route="details"> (or a link to details.html) on this page.
     Script-driven moves must use it: hosts that rename screens rewrite those links, never script strings.
     For moves a script makes, add a hidden nav (hidden, data-routes, aria-hidden="true") holding one
     anchor per destination, with data-route set to the page name, an href to that page, and the trigger
     label as its text. See DESIGN.md, "Portal export", for the markup. */
  const route = (name, query = '') => {
    const link = document.querySelector(`a[data-route="${name}"]`) || document.querySelector(`a[href^="${name}.html"]`);
    const url = new URL(link ? link.getAttribute('href') : `${name}.html`, location.href);
    url.search = '';
    new URLSearchParams(query).forEach((value, key) => url.searchParams.set(key, value));
    return carry(url.href);
  };
  const go = (name, query) => location.assign(route(name, query));
  const replace = (name, query) => location.replace(route(name, query));

  // In an exported file, a timed move fires only when the visitor arrived from a sibling screen,
  // so a portal canvas frame of "Loading…" stays on its own state.
  const fromSibling = () => {
    try {
      const from = new URL(document.referrer);
      const folder = path => path.replace(/[^/]*$/, '');
      return from.origin === location.origin && folder(from.pathname) === folder(location.pathname);
    } catch (_) { return false; }
  };
  const advance = (fn, ms) => { if (!still && (!exported || fromSibling())) return setTimeout(fn, ms); };

  // Nav.asset('../assets/brand/logo.png') → the inlined copy in exported files, else the path itself.
  const asset = path => {
    const key = new URL(path, location.href).pathname.replace(/^.*?(?=assets\/)/, '');
    return (window.PREVIEW_ASSETS || {})[key] || path;
  };

  // Keep an explicit theme choice on in-product links.
  document.addEventListener('click', event => {
    const link = event.target.closest && event.target.closest('a[href]');
    if (link && link.origin === location.origin && carried.some(key => params.get(key))) link.href = carry(link.getAttribute('href'));
  });

  // Still previews render settled: finite entrances finish, ambient loops keep running.
  if (still) addEventListener('load', () => {
    for (const animation of document.getAnimations ? document.getAnimations() : []) {
      if (animation.effect && animation.effect.getTiming().iterations !== Infinity) animation.finish();
    }
  });

  window.Nav = { params, still, exported, route, go, replace, advance, asset };
})();
