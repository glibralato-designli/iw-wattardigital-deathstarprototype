/* App Approvals (3.0 · 2.3): the web's inbox in app form. Lanes as sections with Approve all (and First wave on Email);
   a row opens its draft in a sheet with Approve, Hold and Edit. Same store and presets as the web (DS.apprList). */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const S = DS.S();
  DS.apprPresets();
  const st = { edit: params.get('edit') === '1', draft: '' };
  if (params.has('open')) DS.V.sheet = 'appr:' + params.get('open');
  const LANE = Object.fromEntries(D.LANES.map(([k, l, ic]) => [k, { l, ic }]));
  const items = () => DS.apprList().filter(a => a.state !== 'removed');
  const pending = () => items().filter(a => !a.state);
  const who = a => a.c ? a.c.name + (a.p ? ' · ' + a.p.addr : '') : a.title;
  const badge = a => a.blocked ? `<span class="badge" data-status="danger">${icon('warning-diamond')}Blocked</span>` : a.check ? `<span class="badge" data-status="warning">${icon('warning')}Check</span>` : '';
  const row = a => `<button type="button" class="ds-arow" data-lead data-act="open" data-arg="${a.id}" style="width:100%;text-align:left"><span class="ds-arow__lead">${icon(LANE[a.lane].ic)}</span><span class="ds-arow__body"><span class="ds-arow__title">${esc(who(a))}</span><span class="ds-arow__sub">${esc(a.n ? a.n + ' owners · ' + a.why : a.why)}</span></span>${badge(a)}</button>`;

  const list = () => {
    const P = pending(), held = items().filter(a => a.state === 'held'), done = items().filter(a => a.state === 'approved' || a.state === 'wave');
    const lanes = D.LANES.map(([k]) => [k, P.filter(a => a.lane === k)]).filter(([, xs]) => xs.length).map(([k, xs]) => {
      const ok = xs.filter(a => !a.blocked && !a.n), wave = xs.find(a => a.n);
      return `<section class="ds-asec" aria-label="${esc(LANE[k].l)}"><div class="ds-ahead"><h2>${esc(LANE[k].l)} <span class="ds-meta">${xs.length}</span></h2>${wave ? `<button type="button" class="ds-link-btn" data-act="wave" data-arg="${wave.id}">First wave · ${wave.wave}</button>` : ok.length > 1 ? `<button type="button" class="ds-link-btn" data-act="approve-lane" data-arg="${k}">Approve all ${ok.length}</button>` : ''}</div><div class="ds-alist">${xs.map(row).join('')}</div></section>`;
    }).join('');
    const empty = !P.length && !held.length ? `<div class="ds-alist" style="padding:var(--space-4)">${ui.empty({ ic: 'tray', title: 'Nothing waiting for your click', text: 'New drafts from Brain, your lists and your follow-ups land here.' })}</div>` : '';
    return empty + lanes + (held.length ? `<section class="ds-asec" aria-label="On hold"><div class="ds-ahead"><h2>On hold</h2></div><div class="ds-alist">${held.map(row).join('')}</div></section>` : '') + (done.length ? `<section class="ds-asec" aria-label="Approved today"><div class="ds-ahead"><h2>Approved today</h2></div><div class="ds-alist">${done.map(a => `<div class="ds-arow"><span class="ds-arow__body"><span class="ds-arow__title">${esc(who(a))}</span><span class="ds-arow__sub">${esc(a.state === 'wave' ? 'First wave · ' + a.wave + ' of ' + a.n + ' go out Tuesday' : LANE[a.lane].l + ' · ' + a.title)}</span></span>${icon('check')}</div>`).join('')}</div></section>` : '');
  };

  const sheet = () => {
    const k = DS.V.sheet; if (!k || !k.startsWith('appr:')) return '';
    const a = items().find(x => x.id === k.slice(5)); if (!a) return '';
    const done = a.state === 'approved' || a.state === 'wave';
    const body = st.edit ? `<label class="field"><span class="field__label">Edit the draft</span><textarea id="appr-edit" class="field__control" rows="8" data-input="draft">${esc(st.draft)}</textarea></label>` : `<div class="ds-inbox__body">${a.body.map(l => `<p>${esc(l)}</p>`).join('')}</div>`;
    const foot = st.edit ? ui.btn({ label: 'Cancel', variant: 'outline', act: 'cancel-edit' }) + ui.btn({ label: 'Save draft', act: 'save-edit', arg: a.id })
      : a.blocked ? ui.btn({ label: 'Remove from queue', variant: 'outline', act: 'remove', arg: a.id }) + ui.btn({ label: 'Approve', disabled: true, tip: DS.NO_CONTACT })
      : done ? ui.btn({ label: 'Close', variant: 'outline', act: 'close-sheet' })
      : (a.state === 'held' ? ui.btn({ label: 'Edit', variant: 'outline', act: 'edit', arg: a.id }) : ui.btn({ label: 'Hold', variant: 'outline', act: 'hold', arg: a.id })) + (a.n ? ui.btn({ label: 'First wave · ' + a.wave, act: 'wave', arg: a.id }) : ui.btn({ label: 'Approve', act: 'approve', arg: a.id }));
    return ui.sheet({ key: 'appr-' + a.id, title: a.title, close: 'close-sheet', size: 'full', body: `<div class="ds-stack" data-gap="3">
      <div class="ds-toolbar" style="gap:var(--space-1-5)"><span class="ds-chip">${icon(LANE[a.lane].ic)}${esc(LANE[a.lane].l)}</span>${a.state === 'held' ? '<span class="badge">On hold</span>' : ''}${done ? `<span class="badge" data-status="success">${icon('check')}Approved</span>` : ''}</div>
      ${a.c ? `<p class="ds-meta">To <a href="${href('contact', 'id=' + a.c.id)}">${esc(a.c.name)}</a>${a.p ? ' · ' + esc(a.p.addr) : ''}</p>` : a.n ? `<p class="ds-meta">${a.n} owners · first wave of ${a.wave}, ranked</p>` : ''}
      <p class="ds-inbox__reason">${icon('sparkle')}<span><b>Why.</b> ${esc(a.why)}</span></p>
      ${a.blocked ? `<div class="alert" data-status="danger" role="alert">${icon('warning-diamond')}<span>${esc(a.check ? a.check[1] : a.c.name + ' asked not to be contacted, on every channel.')}</span></div>` : a.check ? `<div class="alert" data-status="warning">${icon('warning')}<span>${esc(a.check[1])}</span></div>` : ''}
      ${body}${!st.edit && !a.blocked && !done && a.state !== 'held' ? `<button type="button" class="ds-link-btn" style="align-self:flex-start" data-act="edit" data-arg="${a.id}">Edit the draft</button>` : ''}</div>`, foot });
  };

  const decide = (ids, state, msg) => { DS.apprSet(ids, state); DS.V.sheet = null; st.edit = false; DS.render(); DS.toast(msg); };
  DS.define({
    id: 'approvals', nav: 'approvals', tab: 'approvals',
    head: () => ({ title: 'Approvals', large: true }), scope: () => 'Approvals',
    render: () => { const n = pending().length; return `<div class="ds-apage">${ui.large('Approvals', n ? n + ' waiting for your click' : 'All clear')}${ui.teach('approvals')}${list()}</div>`; },
    overlays: sheet,
    acts: {
      open: (el, id) => { DS.V.sheet = 'appr:' + id; st.edit = false; DS.render(); },
      'close-sheet': () => { DS.V.sheet = null; st.edit = false; DS.render(); },
      approve: (el, id) => decide([id], 'approved', 'Approved · it goes out in the next send'),
      hold: (el, id) => decide([id], 'held', 'On hold. It stays here until you approve it.'),
      remove: (el, id) => decide([id], 'removed', 'Removed from the queue'),
      wave: (el, id) => { const a = items().find(x => x.id === id); decide([id], 'wave', 'First wave approved · ' + a.wave + ' of ' + a.n + ' go out Tuesday'); },
      'approve-lane': (el, k) => { const ids = pending().filter(a => a.lane === k && !a.blocked && !a.n).map(a => a.id); decide(ids, 'approved', ids.length + ' approved'); },
      edit: (el, id) => { const a = items().find(x => x.id === id); st.edit = true; st.draft = a.body.join('\n\n'); DS.render(); },
      'cancel-edit': () => { st.edit = false; DS.render(); },
      'save-edit': (el, id) => { S.apprEdit = { ...S.apprEdit, [id]: st.draft.split(/\n\s*\n/).map(x => x.trim()).filter(Boolean) }; DS.save(); st.edit = false; DS.render(); DS.toast('Draft saved. It still waits for your click.'); },
    },
    inputs: { draft: v => { st.draft = v; } },
  });
})();
