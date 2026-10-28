/* Database › Cleaning (3.0 · 3.1): ten minutes a day across four queues (contact, ownership, property, context).
   Each item is one row: the field and whose record, current → proposed, the reason, then the dated source and the confidence.
   Approve, Reject or Defer each; select rows for a bulk action. A flagged item (sources disagree) is left for Thomas and never bulk-selected.
   Presets: queue=<contact|ownership|property|context>, sel=<id,…>, cleanbulk=<queue>, cleaned=all. */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  DS.cleanPresets();
  const Q = Object.fromEntries(D.QUEUES.map(([k, l, ic]) => [k, { l, ic }]));
  const items = () => DS.cleanList();
  const open = q => items().filter(x => x.q === q && !x.state);
  const firstQ = () => (D.QUEUES.find(([k]) => open(k).length) || D.QUEUES[0])[0];
  const st = { q: Q[params.get('queue')] ? params.get('queue') : firstQ(), sel: new Set((params.get('sel') || '').split(',').filter(Boolean)) };
  const high = () => open(st.q).filter(x => !x.flag && x.conf >= 85);
  const WORD = { approved: 'Approved', rejected: 'Rejected', deferred: 'Deferred to tomorrow' };

  const whose = x => x.c ? `<a href="${href('contact', 'id=' + x.c.id)}">${esc(x.c.name)}</a>${x.p ? `<span class="ds-meta"> · ${esc(x.p.addr)}</span>` : ''}` : `<a href="${href('property', 'id=' + x.p.id)}">${esc(x.p.addr)}</a>`;
  // A fix: the field and whose record with the confidence; Now → Proposed side by side; Brain's reason in its tint; the source and the actions.
  const row = x => `<div class="ds-fix"${x.flag ? ' data-flag' : ''}>
      ${x.flag ? '<span class="ds-fix__pick" aria-hidden="true"></span>' : `<label class="choice ds-fix__pick"><input type="checkbox" data-change="sel" value="${x.id}"${st.sel.has(x.id) ? ' checked' : ''}><span class="sr-only">Select ${esc(x.field)}, ${esc(x.c ? x.c.name : x.p.addr)}</span></label>`}
      <div class="ds-fix__body">
        <div class="ds-fix__top"><b>${esc(x.field)}</b><span class="ds-fix__who">${whose(x)}</span>${x.flag ? `<span class="badge" data-status="warning">${icon('flag')}Left for you</span>` : ''}<span class="ds-grow"></span><span class="ds-fix__conf"><b class="num">${x.conf}%</b> confidence</span></div>
        <div class="ds-fix__change"><div class="ds-fix__cell"><span class="ds-fix__lbl">Now</span><span class="ds-fix__from">${esc(x.from)}</span></div>${icon('arrow-right')}<div class="ds-fix__cell" data-to><span class="ds-fix__lbl">Proposed</span><span class="ds-fix__to">${esc(x.to)}</span></div></div>
        <p class="ds-fix__why">${icon('sparkle')}<span>${esc(x.why)}</span></p>
        <div class="ds-fix__foot"><span class="ds-fix__src">${icon('file-text')}${esc(x.src)}</span><span class="ds-grow"></span>${ui.btn({ label: 'Defer', size: 'sm', variant: 'ghost', act: 'fix', arg: x.id + '|deferred' })}${ui.btn({ label: 'Reject', size: 'sm', variant: 'ghost', act: 'fix', arg: x.id + '|rejected' })}${ui.btn({ label: 'Approve', ic: 'check', size: 'sm', variant: 'outline', act: 'fix', arg: x.id + '|approved' })}</div>
      </div>
    </div>`;

  const queues = () => `<div class="segmented ds-fixq" role="group" aria-label="Cleaning queues">${D.QUEUES.map(([k, l, ic]) => { const n = open(k).length; return `<button type="button" class="segmented__item" aria-pressed="${k === st.q}" data-act="queue" data-arg="${k}">${icon(ic)}${esc(l)}${n ? `<span class="num ds-fixq__n">${n}</span>` : ''}</button>`; }).join('')}</div>`;
  const bar = () => { const n = st.sel.size, h = high().filter(x => !st.sel.has(x.id));
    return `<div class="ds-fixbar" aria-live="polite">${n
      ? `<span><b class="num">${n}</b> selected</span><span class="ds-grow"></span>${ui.btn({ label: 'Approve ' + n, ic: 'check', size: 'sm', act: 'bulk', arg: 'approved' })}${ui.btn({ label: 'Reject', size: 'sm', variant: 'outline', act: 'bulk', arg: 'rejected' })}${ui.btn({ label: 'Defer', size: 'sm', variant: 'outline', act: 'bulk', arg: 'deferred' })}${ui.btn({ label: 'Clear', size: 'sm', variant: 'ghost', act: 'clear-sel' })}`
      : `<span class="ds-meta">${open(st.q).length} in ${esc(Q[st.q].l.toLowerCase())}</span><span class="ds-grow"></span>${h.length ? `<button type="button" class="ds-link-btn" data-act="pick-high">Select the ${h.length} at 85% or more</button>` : ''}`}</div>`; };
  const doneGroup = () => { const done = items().filter(x => x.state); if (!done.length) return '';
    return `<details class="ds-fixdone"><summary>${icon('check')}<b>Done today</b><span class="ds-meta num">${done.length}</span></summary>${done.map(x => `<div class="ds-fixdone__row"><span class="ds-ellipsis"><b>${esc(x.field)}</b> · ${esc(x.c ? x.c.name : x.p.addr)} · ${esc(x.to)}</span><span class="ds-meta">${WORD[x.state]}</span><button type="button" class="ds-link-btn" data-act="undo" data-arg="${x.id}">Undo</button></div>`).join('')}</details>`; };
  const list = () => { const xs = open(st.q);
    if (!DS.cleanPending()) return ui.empty({ ic: 'check-circle', title: 'Clean for today', text: 'Brain checks the sources again tonight. New fixes land here in the morning.' });
    if (!xs.length) return ui.empty({ ic: 'check-circle', title: Q[st.q].l + ' is clean', text: 'Other queues still have fixes waiting.' });
    return `${bar()}<div class="ds-fixlist">${xs.map(row).join('')}</div>`; };

  const decide = (ids, state) => { DS.cleanSet(ids, state); ids.forEach(id => st.sel.delete(id)); if (!open(st.q).length) st.q = firstQ(); DS.render(); };
  DS.define({
    id: 'cleaning', nav: 'database', brain: 'min',
    crumbs: () => [{ l: 'Database', page: 'contacts' }, { l: 'Cleaning' }],
    scope: () => 'Database › Cleaning',
    render: () => { const n = DS.cleanPending();
      return `<div class="ds-page">${ui.pageHead('Database', ui.dbTabs('cleaning'), '', ui.headStat({ n, l: n === 1 ? 'fix to review' : 'fixes to review', sub: n ? 'About ten minutes · nothing changes until you approve' : 'Clean for today' }))}
        <div class="ds-fixwrap">${n ? queues() : ''}${list()}${doneGroup()}</div></div>`; },
    acts: {
      queue: (el, k) => { st.q = k; st.sel.clear(); DS.render(); },
      fix: (el, arg) => { const [id, state] = arg.split('|'), x = items().find(i => i.id === id); decide([id], state); DS.toast(state === 'approved' ? x.field + ' updated on the record' : state === 'rejected' ? 'Rejected. Brain won’t propose it again from this source.' : 'Deferred to tomorrow'); },
      bulk: (el, state) => { const ids = [...st.sel]; decide(ids, state); DS.toast(ids.length + ' ' + (state === 'approved' ? 'approved' : state === 'rejected' ? 'rejected' : 'deferred to tomorrow')); },
      'pick-high': () => { high().forEach(x => st.sel.add(x.id)); DS.render(); },
      'clear-sel': () => { st.sel.clear(); DS.render(); },
      undo: (el, id) => { const S = DS.S(); S.clean = { ...S.clean }; delete S.clean[id]; DS.save(); DS.render(); DS.toast('Back in the queue'); },
    },
    inputs: { sel: (v, el) => { el.checked ? st.sel.add(v) : st.sel.delete(v); DS.render(); } },
  });
})();
