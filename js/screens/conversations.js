/* 09 Dashboard › Conversations: a Mon–Fri board plus Proposals. Connected calls from the case file land here. */
(() => {
  const { D, ui, esc, icon, href, params, fmtMD } = DS;
  const S = DS.S();
  const st = { wk: Number(params.get('week')) || 0, dlg: params.get('dialog') === 'new' ? { c: 'marchetti', d: '2', o: 'Interested', t: '' } : null };
  const start = () => -2 + 7 * st.wk;
  const all = () => {
    const base = st.wk === 0 ? D.conversations[0] : st.wk < 0 ? D.conversations.prev : D.conversations.next;
    const live = st.wk === 0 ? Object.entries(S.last || {}).filter(([, v]) => /Connected/.test(v)).map(([id]) => ['2', id, 'Connected on today’s call list', 'Callback', 'Log next step']) : [];
    const mine = (S.convs || []).filter(x => x.wk === st.wk).map(x => [x.d, x.c, x.t || 'Conversation logged', x.o, 'Added today']);
    return [...base, ...live, ...mine];
  };
  const card = ([, id, topic, o, next]) => { const c = D.cById[id]; return `<a class="ds-conv" href="${href('contact', 'id=' + id)}"><span style="display:flex;align-items:center;gap:var(--space-2);min-width:0">${ui.cls(c.cls)}<b class="ds-grow ds-ellipsis font-semibold">${esc(c.name)}</b></span><span style="color:var(--fg-secondary);text-wrap:pretty">${esc(topic)}</span><span class="ds-conv__foot"><span class="ds-outtag" data-o="${esc(o)}">${esc(o)}</span><span class="ds-meta" style="display:inline-flex;align-items:center;gap:var(--space-1)">${icon('arrow-right')}${esc(next)}</span></span></a>`; };
  const board = () => {
    const items = all(), s = start();
    const days = [0, 1, 2, 3, 4].map(i => { const o = s + i, d = D.addD(o), cards = items.filter(x => x[0] === String(i)); return `<section class="ds-board__col"${o === 0 ? ' data-today' : ''} aria-label="${esc(d.toLocaleDateString('en-US', { weekday: 'long' }))}"><div class="ds-board__head"><span class="ds-row__body"><b class="font-semibold" style="font-size:var(--text-md);line-height:var(--line-height-sm)">${d.toLocaleDateString('en-US', { weekday: 'long' })}</b><span class="ds-meta">${fmtMD(d)}${o === 0 ? ' · Today' : ''}</span></span>${cards.length ? `<span class="ds-board__count">${cards.length}</span>` : ''}</div>${cards.map(card).join('')}${cards.length ? '' : `<span class="ds-meta" style="padding:var(--space-5) var(--space-2);text-align:center">${o > 0 ? 'Nothing yet' : 'No conversations'}</span>`}</section>`; }).join('');
    const props = items.filter(x => x[0] === 'prop');
    return `<div class="ds-board">${days}<section class="ds-board__col" data-kind="proposals" aria-label="Proposals"><div class="ds-board__head"><span class="ds-row__body"><b class="font-semibold" style="font-size:var(--text-md);line-height:var(--line-height-sm)">Proposals</b><span class="ds-meta">In progress</span></span>${props.length ? `<span class="ds-board__count">${props.length}</span>` : ''}</div>${props.map(card).join('')}${props.length ? '' : '<span class="ds-meta" style="padding:var(--space-5) var(--space-2);text-align:center">No proposals</span>'}</section></div>`;
  };
  const head = () => { const s = start(), n = all().filter(x => x[0] !== 'prop').length; return `<div class="ds-calhead">${ui.btn({ label: 'This week', variant: 'outline', shape: 'pill', act: 'this-week' })}<span style="width:var(--space-2)"></span>${ui.iconBtn({ ic: 'caret-left', aria: 'Previous week', act: 'wk', arg: -1 })}${ui.iconBtn({ ic: 'caret-right', aria: 'Next week', act: 'wk', arg: 1 })}<span class="ds-row__body" style="flex:none;padding:0 var(--space-2)"><h2 class="ds-title-xl">${st.wk === 0 ? 'This week' : 'Week of ' + fmtMD(D.addD(s))}</h2><span class="ds-meta">${fmtMD(D.addD(s))} – ${fmtMD(D.addD(s + 4))} · ${n} conversation${n === 1 ? '' : 's'}</span></span><span class="ds-grow"></span>${ui.btn({ label: 'Conversation', ic: 'plus', act: 'open-new' })}</div>`; };
  const dialog = () => {
    const f = st.dlg; if (!f) return ''; const s = start();
    return `<div class="ds-overlay" data-act="close-new" data-self style="padding-top:7.5rem"><div class="dialog" role="dialog" aria-modal="true" aria-labelledby="newconv-title" style="display:flex;flex-direction:column;gap:var(--space-3-5);position:static;margin:0;max-width:27.5rem" data-anim="pop" data-key="newconv">
      <div style="display:flex;align-items:center"><h2 id="newconv-title" class="ds-grow" style="font-size:var(--text-body-lg);line-height:var(--line-height-body-lg)">New conversation</h2>${ui.iconBtn({ ic: 'x', aria: 'Close', act: 'close-new' })}</div>
      <div class="field"><label class="field__label" for="cv-contact">Contact</label><span class="select"><select id="cv-contact" class="field__control" data-size="lg" data-change="c">${D.C.map(c => `<option value="${c.id}"${f.c === c.id ? ' selected' : ''}>${esc(c.name + ' · ' + c.entity)}</option>`).join('')}</select></span></div>
      <div class="ds-two" style="gap:var(--space-3)"><div class="field"><label class="field__label" for="cv-day">Day</label><span class="select"><select id="cv-day" class="field__control" data-size="lg" data-change="d">${[...[0, 1, 2, 3, 4].map(i => [String(i), D.addD(s + i).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })]), ['prop', 'Proposals']].map(([v, l]) => `<option value="${v}"${f.d === v ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select></span></div>
        <div class="field"><label class="field__label" for="cv-out">Outcome</label><span class="select"><select id="cv-out" class="field__control" data-size="lg" data-change="o">${['Interested', 'Callback', 'Not now', 'Sent', 'Draft'].map(o => `<option${f.o === o ? ' selected' : ''}>${o}</option>`).join('')}</select></span></div></div>
      <div class="field"><label class="field__label" for="cv-topic">What you talked about</label><textarea id="cv-topic" class="field__control" rows="3" placeholder="e.g. Open to a valuation in Q1" data-input="t">${esc(f.t)}</textarea></div>
      <div class="dialog__actions" style="margin-top:0">${ui.btn({ label: 'Cancel', variant: 'outline', act: 'close-new' })}${ui.btn({ label: 'Add conversation', act: 'save' })}</div></div></div>`;
  };
  DS.define({
    id: 'conversations', nav: 'dashboard', brain: 'min',
    crumbs: () => [{ l: 'Dashboard', page: 'attack-plan' }, { l: 'Conversations' }],
    scope: () => 'Conversations',
    render: () => `<div class="ds-page">${ui.pageHead('Dashboard', ui.tabs(D.dashboardTabs, 'conversations', 'Dashboard'))}${ui.nudge(D.nudges.conversations)}<div class="ds-stack" data-gap="4">${head()}<div data-anim="slide" data-key="board-${st.wk}" style="--dir:${st.dir || 1}">${board()}</div></div></div>`,
    overlays: dialog,
    acts: {
      'this-week': () => { st.dir = st.wk > 0 ? -1 : 1; st.wk = 0; DS.render(); }, wk: (el, d) => { st.dir = Math.sign(Number(d)); st.wk += Number(d); DS.render(); },
      'open-new': () => { st.dlg = { c: 'marchetti', d: st.wk === 0 ? '2' : '0', o: 'Interested', t: '' }; DS.render(); setTimeout(() => { const el = document.getElementById('cv-contact'); if (el) el.focus(); }, 30); },
      'close-new': () => { st.dlg = null; DS.render(); },
      save: () => { S.convs = [...(S.convs || []), { ...st.dlg, wk: st.wk }]; DS.save(); st.dlg = null; DS.render(); DS.toast('Conversation added'); },
    },
    inputs: { c: v => { st.dlg.c = v; }, d: v => { st.dlg.d = v; }, o: v => { st.dlg.o = v; }, t: v => { st.dlg.t = v; } },
    onEscape: () => { if (st.dlg) { st.dlg = null; DS.render(); return true; } return false; },
  });
})();
