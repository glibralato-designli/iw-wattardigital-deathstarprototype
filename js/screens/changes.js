/* System › Changes (3.0 · 2.5): what changed in how Death Star works, in plain words, each with Restore. The same changes
   show as a quiet note where the old behaviour was (ui.changeNote: Today's ranking, a Brain lesson). Settings, Health and Controls are drawn. */
(() => {
  const { D, ui, esc, icon } = DS;
  const S = DS.S();
  const row = ch => { const back = !!(S.restored || {})[ch.id];
    return `<div class="ds-chrow"><span class="ds-chrow__date num">${esc(ch.date)}</span><div class="ds-row__body"><span><b>${esc(ch.area)}.</b> ${esc(ch.what)}</span><span class="ds-meta">Before: ${esc(ch.before)} · ${esc(ch.by)}</span>${back ? `<span class="badge">${icon('clock-counter-clockwise')}Restored</span>` : ''}</div>${ui.btn({ label: back ? 'Undo' : 'Restore', variant: 'outline', size: 'sm', act: 'restore-change', arg: ch.id })}</div>`; };
  DS.define({
    id: 'changes', nav: 'system', brain: 'min',
    crumbs: () => [{ l: 'System', page: 'changes' }, { l: 'Changes' }],
    scope: () => 'System',
    render: () => `<div class="ds-page">${ui.pageHead('System', ui.tabs([['changes', 'Changes'], [null, 'Settings'], [null, 'Health'], [null, 'Controls']], 'changes', 'System'))}
      <p class="ds-lede">What changed in how Death Star works, newest first. Restore puts it back the way it was; nothing else moves.</p>
      <section class="ds-card" data-pad="all" aria-label="Changes"><div class="ds-chlist">${D.changes.map(row).join('')}</div></section></div>`,
  });
})();
