/* Approvals (3.0 · 2.3): one inbox for every planned touch. Nothing goes out without Thomas's click.
   Left: items grouped by lane, each with the owner, the building, the reason and any check. Right: the preview, to edit,
   approve or hold. Bulk approve per lane; First wave at the top of Email. Under 1024 the list and the preview take turns. */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const S = DS.S();
  DS.apprPresets();
  const st = { open: params.get('open') || null, picked: params.has('open'), edit: params.get('edit') === '1', draft: '' };
  const LANE = Object.fromEntries(D.LANES.map(([k, l, ic]) => [k, { l, ic }]));
  const items = () => DS.apprList().filter(a => a.state !== 'removed');
  const pending = () => items().filter(a => !a.state);
  const current = () => items().find(a => a.id === st.open) || pending()[0] || null;
  const who = a => a.c ? a.c.name + (a.p ? ' · ' + a.p.addr : '') : a.title;
  const checkBadge = a => a.blocked ? `<span class="badge" data-status="danger">${icon('warning-diamond')}Blocked</span>` : a.check ? `<span class="badge" data-status="warning">${icon('warning')}Check</span>` : '';
  const row = a => { const cur = current(); return `<button type="button" class="ds-inbox__row" aria-current="${!!cur && cur.id === a.id}" data-act="pick" data-arg="${a.id}"><span class="ds-row__body"><span class="font-medium ds-ellipsis">${esc(who(a))}</span><span class="ds-meta ds-inbox__why">${esc(a.n ? a.n + ' owners · ' + a.why : a.why)}</span></span>${checkBadge(a)}</button>`; };

  const list = () => {
    const P = pending(), held = items().filter(a => a.state === 'held'), done = items().filter(a => a.state === 'approved' || a.state === 'wave');
    if (!P.length && !held.length) return `<div class="ds-inbox__list">${ui.empty({ ic: 'tray', title: 'Nothing waiting for your click', text: 'New drafts from Brain, your lists and your follow-ups land here.' })}${done.length ? doneGroup(done) : ''}</div>`;
    const groups = D.LANES.map(([k]) => [k, P.filter(a => a.lane === k)]).filter(([, xs]) => xs.length).map(([k, xs]) => {
      const ok = xs.filter(a => !a.blocked && !a.n), wave = xs.find(a => a.n);
      return `<section class="ds-inbox__group" aria-label="${esc(LANE[k].l)}"><div class="ds-inbox__lane">${icon(LANE[k].ic)}<b>${esc(LANE[k].l)}</b><span class="ds-meta">${xs.length}</span><span class="ds-grow"></span>${wave ? ui.btn({ label: 'First wave · ' + wave.wave, size: 'sm', variant: 'outline', act: 'wave', arg: wave.id }) : ''}${ok.length > 1 ? ui.btn({ label: 'Approve all ' + ok.length, size: 'sm', variant: 'ghost', act: 'approve-lane', arg: k }) : ''}</div>${xs.map(row).join('')}</section>`;
    }).join('');
    return `<div class="ds-inbox__list">${groups}${held.length ? `<section class="ds-inbox__group" aria-label="On hold"><div class="ds-inbox__lane">${icon('clock')}<b>On hold</b><span class="ds-meta">${held.length}</span></div>${held.map(row).join('')}</section>` : ''}${done.length ? doneGroup(done) : ''}</div>`;
  };
  const doneGroup = done => `<section class="ds-inbox__group" data-done aria-label="Approved today"><div class="ds-inbox__lane">${icon('check')}<b>Approved today</b><span class="ds-meta">${done.length}</span></div>${done.map(a => `<div class="ds-inbox__row" data-static><span class="ds-row__body"><span class="ds-ellipsis">${esc(who(a))}</span><span class="ds-meta">${esc(a.state === 'wave' ? 'First wave · ' + a.wave + ' of ' + a.n + ' go out Tuesday. The rest wait here.' : LANE[a.lane].l + ' · ' + a.title)}</span></span></div>`).join('')}</section>`;

  const preview = () => {
    const a = current(); if (!a) return '';
    const state = a.state === 'held' ? '<span class="badge">On hold</span>' : a.state ? `<span class="badge" data-status="success">${icon('check')}Approved</span>` : '';
    const body = st.edit ? `<label class="field"><span class="field__label">Edit the draft</span><textarea id="appr-edit" class="field__control" rows="8" data-input="draft">${esc(st.draft)}</textarea></label>` : `<div class="ds-inbox__body">${a.body.map(l => `<p>${esc(l)}</p>`).join('')}</div>`;
    const acts = st.edit ? ui.btn({ label: 'Save draft', act: 'save-edit' }) + ui.btn({ label: 'Cancel', variant: 'outline', act: 'cancel-edit' })
      : a.blocked ? ui.btn({ label: 'Approve', disabled: true, tip: DS.NO_CONTACT }) + ui.btn({ label: 'Remove from queue', variant: 'outline', act: 'remove', arg: a.id })
      : (a.state === 'approved' || a.state === 'wave') ? '' : (a.n ? ui.btn({ label: 'Approve first wave · ' + a.wave, act: 'wave', arg: a.id }) + ui.btn({ label: 'Approve all ' + a.n, variant: 'outline', act: 'approve', arg: a.id }) : ui.btn({ label: 'Approve', ic: 'check', act: 'approve', arg: a.id })) + (a.state === 'held' ? '' : ui.btn({ label: 'Hold', variant: 'outline', act: 'hold', arg: a.id })) + ui.btn({ label: 'Edit', ic: 'note-pencil', variant: 'ghost', act: 'edit' });
    return `<section class="ds-card ds-inbox__preview" data-pad="lg" aria-label="Preview" data-anim="fade" data-key="appr-${a.id}-${st.edit}">
      <button type="button" class="ds-back ds-inbox__back" data-act="back">${icon('caret-left')}Back to Approvals</button>
      <div class="ds-toolbar" style="gap:var(--space-1-5)"><span class="ds-chip">${icon(LANE[a.lane].ic)}${esc(LANE[a.lane].l)}</span>${state}</div>
      <h2 class="ds-title-xl">${esc(a.title)}</h2>
      ${a.c ? `<p class="ds-meta">To <a href="${href('contact', 'id=' + a.c.id)}">${esc(a.c.name)}</a>${a.p ? ' · ' + esc(a.p.addr) : ''}</p>` : a.n ? `<p class="ds-meta">${a.n} owners · first wave of ${a.wave}, ranked</p>` : ''}
      <p class="ds-inbox__reason">${icon('sparkle')}<span><b>Why.</b> ${esc(a.why)}</span></p>
      ${a.blocked ? `<div class="alert" data-status="danger" role="alert">${icon('warning-diamond')}<span>${esc(a.check ? a.check[1] : a.c.name + ' asked not to be contacted, on every channel. This can’t be sent.')}</span></div>` : a.check ? `<div class="alert" data-status="warning">${icon('warning')}<span>${esc(a.check[1])}</span></div>` : ''}
      ${body}
      <div class="ds-toolbar">${acts}</div>
    </section>`;
  };

  const next = () => { const p = pending(); st.open = p.length ? p[0].id : null; st.edit = false; };
  DS.define({
    id: 'approvals', nav: 'approvals', brain: 'min',
    crumbs: () => [{ l: 'Approvals' }],
    scope: () => 'Approvals',
    render: () => { const n = pending().length;
      return `<div class="ds-page">${ui.pageHead('Approvals', '', `<p class="ds-lede">${n ? n + ' waiting for your click. Nothing goes out without it.' : 'All clear.'}</p>`)}<div class="ds-inbox"${st.picked ? ' data-picked' : ''}>${list()}${preview()}</div></div>`; },
    acts: {
      pick: (el, id) => { st.open = id; st.picked = true; st.edit = false; DS.render(); },
      back: () => { st.picked = false; DS.render(); },
      approve: (el, id) => { DS.apprSet([id], 'approved'); DS.toast('Approved · it goes out in the next send'); next(); DS.render(); },
      hold: (el, id) => { DS.apprSet([id], 'held'); DS.toast('On hold. It stays here until you approve it.'); next(); DS.render(); },
      remove: (el, id) => { DS.apprSet([id], 'removed'); DS.toast('Removed from the queue'); next(); DS.render(); },
      wave: (el, id) => { const a = items().find(x => x.id === id); DS.apprSet([id], 'wave'); DS.toast('First wave approved · ' + a.wave + ' of ' + a.n + ' go out Tuesday'); next(); DS.render(); },
      'approve-lane': (el, k) => { const ids = pending().filter(a => a.lane === k && !a.blocked && !a.n).map(a => a.id); DS.apprSet(ids, 'approved'); DS.toast(ids.length + ' approved'); next(); DS.render(); },
      edit: () => { const a = current(); st.edit = true; st.draft = a.body.join('\n\n'); DS.render(); setTimeout(() => { const t = document.getElementById('appr-edit'); if (t) t.focus(); }, 30); },
      'cancel-edit': () => { st.edit = false; DS.render(); },
      'save-edit': () => { const a = current(); S.apprEdit = { ...S.apprEdit, [a.id]: st.draft.split(/\n\s*\n/).map(x => x.trim()).filter(Boolean) }; DS.save(); st.edit = false; DS.render(); DS.toast('Draft saved. It still waits for your click.'); },
    },
    inputs: { draft: v => { st.draft = v; } },
  });
})();
