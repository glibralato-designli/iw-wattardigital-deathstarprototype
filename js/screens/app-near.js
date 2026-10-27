/* App 02 Near me (3.0 · 3.3, field mode): owners near where Thomas stands, closest first. Each row: class, name, the why now,
   the lead building with its score and the walk, and tap to call (off for an opted-out owner). Scan sits in the header.
   Presets: scan=open|found|type (the scan sheet). */
(() => {
  const { D, ui, esc, icon, href } = DS;
  DS.scanPreset();
  const row = ([id, min]) => { const c = D.cById[id], p = D.pById[c.pid], dnc = c.status === 'Do not contact';
    const end = dnc ? `<span class="ds-icon-btn ds-abtn" style="border:var(--border-width) solid var(--border)" role="button" tabindex="0" aria-disabled="true" aria-label="Call ${esc(c.name)}" data-tip="${DS.NO_CONTACT}">${icon('phone')}</span>` : `<a class="ds-icon-btn ds-abtn" style="border:var(--border-width) solid var(--border)" href="${href('contact', 'id=' + id + '&act=call')}" aria-label="Call ${esc(c.name)}">${icon('phone')}</a>`;
    return `<div class="ds-arow" data-lead>${ui.cls(c.cls)}<a class="ds-arow__body" href="${href('contact', 'id=' + id)}" style="color:inherit;text-decoration:none"><span class="ds-arow__title">${esc(c.name)}</span><span class="ds-arow__sub">${esc(c.why)}</span><span class="ds-meta">${esc(p.addr)} · ${p.score} · ${min} min walk</span>${dnc ? '<span class="ds-meta">Asked not to be contacted</span>' : ''}</a>${end}</div>`; };
  DS.define({
    id: 'near', nav: 'near', tab: 'near',
    head: () => ({ title: 'Near me', large: true, actions: ui.iconBtn({ ic: 'scan', aria: 'Scan a building', act: 'scan' }) }),
    scope: () => 'Near me',
    render: () => `<div class="ds-apage">${ui.large('Near me')}
      <p class="ds-anear">${icon('navigation-arrow')}<span>Near <b>${esc(D.near.at)}</b> · owners within a ten-minute walk, closest first</span></p>
      <section class="ds-asec" aria-label="Owners nearby"><div class="ds-alist">${D.near.walk.map(row).join('')}</div></section></div>`,
    overlays: () => ui.scanSheet(),
  });
})();
