/* App More › Changes (3.0 · 2.5): the web's System › Changes as a list, each with Restore. */
(() => {
  const { D, ui, esc, icon } = DS;
  const S = DS.S();
  DS.define({
    id: 'changes', nav: 'more', tab: 'more',
    head: () => ({ title: 'Changes', large: true, back: ['More', 'more'] }), scope: () => 'System',
    render: () => `<div class="ds-apage">${ui.large('Changes', 'What changed in how Death Star works')}<div class="ds-alist">${D.changes.map(ch => { const back = !!(S.restored || {})[ch.id];
      return `<div class="ds-arow" style="align-items:flex-start"><span class="ds-arow__body"><span class="ds-arow__sub">${esc(ch.date)} · ${esc(ch.area)}${back ? ' · Restored' : ''}</span><span class="ds-arow__title" style="white-space:normal">${esc(ch.what)}</span><span class="ds-arow__sub" style="white-space:normal">Before: ${esc(ch.before)}</span></span><button type="button" class="ds-link-btn" data-act="restore-change" data-arg="${ch.id}">${back ? 'Undo' : 'Restore'}</button></div>`; }).join('')}</div></div>`,
  });
})();
