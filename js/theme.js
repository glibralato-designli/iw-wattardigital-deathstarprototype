/* Product-safe theme preference. No review UI; light is the default. */
(() => {
  if(window.name==='device-framed')document.documentElement.dataset.device='framed';
  const requested = new URLSearchParams(location.search).get('theme');
  let saved;
  try { saved = localStorage.getItem('design-project-theme'); } catch (_) {}
  const valid = value => ['light', 'dark'].includes(value);
  document.documentElement.dataset.theme = valid(requested) ? requested : valid(saved) ? saved : 'light';
})();
