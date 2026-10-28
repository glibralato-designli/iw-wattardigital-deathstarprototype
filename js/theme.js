/* Product-safe theme preference. No review UI; light is the default. */
(() => {
  if(window.name==='device-framed')document.documentElement.dataset.device='framed';
  const requested = new URLSearchParams(location.search).get('theme');
  let saved;
  try { saved = localStorage.getItem('design-project-theme'); } catch (_) {}
  const valid = value => ['light', 'dark'].includes(value);
  document.documentElement.dataset.theme = valid(requested) ? requested : valid(saved) ? saved : 'light';
  // Visual standard test (3.0 · 3.4): look=standard shows the client's written standard as a variant; the review menu sets it.
  const look = new URLSearchParams(location.search).get('look');
  let savedLook;
  try { savedLook = localStorage.getItem('design-project-look'); } catch (_) {}
  if ((look || savedLook) === 'standard') document.documentElement.dataset.look = 'standard';
})();
