/* App 09 Conversations: the week's conversations grouped by day, then Proposals. Connected calls land on today; + logs one. */
(() => {
  const { D, ui, esc, icon, href, params, fmtMD } = DS;
  const S = DS.S();
  const st = { wk: Number(params.get('week')) || 0, dlg: null };
  if (params.get('dialog') === 'new') { st.dlg = { c: 'marchetti', d: '2', o: 'Interested', t: '' }; DS.V.sheet = 'new'; }
  const start = () => -2 + 7 * st.wk;
  const all = () => {
    const base = st.wk === 0 ? D.conversations[0] : st.wk < 0 ? D.conversations.prev : D.conversations.next;
    const live = st.wk === 0 ? Object.entries(S.last || {}).filter(([, v]) => /Connected|Conversation/.test(v)).map(([id, v]) => ['2', id, v.split(' · ')[1] + ' on today’s call list', 'Callback', 'Log next step']) : [];
    const mine = (S.convs || []).filter(x => x.wk === st.wk).map(x => [x.d, x.c, x.t || 'Conversation logged', x.o, 'Added today']);
    return [...base, ...live, ...mine];
  };
  const row = ([, id, topic, o, next]) => { const c = D.cById[id];
    return `<a class="ds-arow" data-lead href="${href('contact', 'id=' + id)}" style="align-items:flex-start">${ui.cls(c.cls)}<span class="ds-arow__body"><span class="ds-arow__title">${esc(c.name)}</span><span class="ds-arow__sub" style="color:var(--fg-secondary)">${esc(topic)}</span><span style="display:flex;align-items:center;gap:var(--space-2);margin-top:var(--space-1)"><span class="ds-outtag" data-o="${esc(o)}">${esc(o)}</span><span class="ds-meta">${icon('arrow-right')} ${esc(next)}</span></span></span></a>`; };
  const head = () => ({ title: 'Activity', large: true, back: ['More', 'more'] });
  // What the week came to, in one line (as on the web).
  const summary = () => { if (st.wk !== 0) return ''; const convs = D.conversations[0].filter(x => x[0] !== 'prop'), follow = convs.filter(x => /Interested|Callback/.test(x[3])).length, total = D.outreachPerf.activity.find(x => x[0] === 'Conversations')[4] + (S.convos || 0);
    return `<p class="ds-convsum" role="status">${icon('sparkle')}<span><b>This week: ${total} conversations, ${follow} worth a follow-up, 1 first meeting booked.</b> 2 proposals in progress.</span></p>`; };
  const stepper = () => { const s = start(); return `<div class="ds-toolbar" style="justify-content:space-between">${ui.iconBtn({ ic: 'caret-left', aria: 'Previous week', act: 'wk', arg: -1 })}<span class="ds-row__body" style="flex:1;align-items:center;text-align:center"><span class="font-semibold">${st.wk === 0 ? 'This week' : 'Week of ' + fmtMD(D.addD(s))}</span><span class="ds-meta">${fmtMD(D.addD(s))} – ${fmtMD(D.addD(s + 4))} · ${all().filter(x => x[0] !== 'prop').length} conversations</span></span>${ui.iconBtn({ ic: 'caret-right', aria: 'Next week', act: 'wk', arg: 1 })}</div>`; };
  const days = () => { const items = all(), s = start();
    const groups = [0, 1, 2, 3, 4].map(i => ({ i, o: s + i, list: items.filter(x => x[0] === String(i)) })).filter(g => g.list.length || g.o === 0);
    if (!groups.length) return `<div class="ds-alist" style="padding:var(--space-4)">${ui.empty({ ic: 'chat-text', title: 'No conversations this week', text: 'Connected calls land here, or log one with the + button.' })}</div>`;
    return groups.map(g => { const d = D.addD(g.o); return `<section class="ds-asec" aria-label="${esc(d.toLocaleDateString('en-US', { weekday: 'long' }))}"><div class="ds-ahead"><h2 style="font-size:var(--text-body-lg);line-height:var(--line-height-body-lg)">${d.toLocaleDateString('en-US', { weekday: 'long' })}${g.o === 0 ? ' · Today' : ''}</h2><span class="ds-meta">${fmtMD(d)}</span></div>${g.list.length ? `<div class="ds-alist">${g.list.map(row).join('')}</div>` : '<p class="ds-meta">Nothing yet.</p>'}</section>`; }).join(''); };
  const proposals = () => { const props = all().filter(x => x[0] === 'prop'); return `<section class="ds-asec" aria-label="Proposals"><div class="ds-ahead"><h2>Proposals</h2><span class="ds-meta">${props.length} in progress</span></div>${props.length ? `<div class="ds-alist">${props.map(row).join('')}</div>` : '<p class="ds-meta">No proposals in progress.</p>'}</section>`; };
  const newSheet = () => { const f = st.dlg; if (!f) return ''; const s = start();
    return ui.sheet({ key: 'newconv', title: 'New conversation', size: 'full', body: `<div class="ds-stack" data-gap="4" style="padding-top:var(--space-1)">
      <label class="field"><span class="field__label">Contact</span><span class="select"><select class="field__control" data-change="c">${D.C.map(c => `<option value="${c.id}"${f.c === c.id ? ' selected' : ''}>${esc(c.name)}</option>`).join('')}</select></span></label>
      <label class="field"><span class="field__label">Day</span><span class="select"><select class="field__control" data-change="d">${[...[0, 1, 2, 3, 4].map(i => [String(i), D.addD(s + i).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })]), ['prop', 'Proposals']].map(([v, l]) => `<option value="${v}"${f.d === v ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></span></label>
      <div class="field"><span class="field__label">Outcome</span><div class="ds-achips" style="margin:0;padding:0;flex-wrap:wrap">${['Interested', 'Callback', 'Not now', 'Sent', 'Draft'].map(o => `<button type="button" class="ds-fchip" aria-pressed="${f.o === o}" data-act="out" data-arg="${o}">${o}</button>`).join('')}</div></div>
      <label class="field"><span class="field__label">What you talked about</span><textarea class="field__control" rows="3" placeholder="e.g. Open to a valuation in Q1" data-input="t">${esc(f.t)}</textarea></label></div>`,
      foot: ui.btn({ label: 'Cancel', variant: 'outline', act: 'close-sheet' }) + ui.btn({ label: 'Add conversation', act: 'save' }) }); };

  DS.define({
    id: 'conversations', nav: 'dashboard', tab: 'more',
    head, scope: () => 'Conversations',
    render: () => `<div class="ds-apage">${ui.large('Activity', 'Dashboard')}${ui.teach()}${ui.nudge(D.nudges.conversations)}${stepper()}${summary()}<div class="ds-stack" style="gap:var(--space-6)" data-anim="fade" data-key="wk-${st.wk}">${days()}${proposals()}</div></div>`,
    fab: () => `<button type="button" class="ds-fab" aria-label="New conversation" data-act="open-new">${icon('plus')}</button>`,
    overlays: () => DS.V.sheet === 'new' ? newSheet() : '',
    onSheetClose: () => { st.dlg = null; },
    acts: {
      wk: (el, d) => { st.wk += Number(d); DS.render(); },
      'open-new': () => { st.dlg = { c: 'marchetti', d: st.wk === 0 ? '2' : '0', o: 'Interested', t: '' }; DS.V.sheet = 'new'; DS.render(); },
      out: (el, o) => { st.dlg.o = o; DS.render(); },
      save: () => { S.convs = [...(S.convs || []), { ...st.dlg, wk: st.wk }]; DS.save(); st.dlg = null; DS.V.sheet = null; DS.render(); DS.toast('Conversation added'); },
    },
    inputs: { c: v => { st.dlg.c = v; }, d: v => { st.dlg.d = v; }, t: v => { st.dlg.t = v; } },
  });
})();
