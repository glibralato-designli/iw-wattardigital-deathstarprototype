/* App 02 Today: the Attack Plan. A day strip, Call next, to-dos, goals and meetings. */
(() => {
  const { D, ui, esc, icon, href, params, fmtL, fmtS, fmtMD } = DS;
  const st = { sel: Math.max(-2, Math.min(4, Number(params.get('day')) || 0)), mode: params.get('range') === 'week' ? 'week' : 'day', resOpen: params.get('resolved') === '1', newTask: '', newCat: 'Follow up' };
  if (params.get('called') === 'all') DS.callIds().forEach(id => { DS.S().done[id] = true; });
  const addD = D.addD;
  const rel = () => Math.sign(st.sel);

  const head = () => ({ title: 'Today', large: true, actions: `${ui.iconBtn({ ic: 'magnifying-glass', aria: 'Search contacts, properties, BBL', act: 'palette', arg: 'search' })}${ui.iconBtn({ ic: 'plus', aria: 'Add a to-do', act: 'sheet', arg: 'add' })}` });

  const strip = () => {
    const days = [-2, -1, 0, 1, 2, 3, 4].map(o => { const d = addD(o), wk = d.getDay() === 0 || d.getDay() === 6;
      return `<button type="button" class="ds-daystrip__d" aria-pressed="${st.mode === 'day' && o === st.sel}" aria-label="${esc(fmtL(d))}"${o === 0 ? ' data-today' : ''}${wk ? ' data-weekend' : ''} data-act="pick-day" data-arg="${o}"><span>${d.toLocaleDateString('en-US', { weekday: 'short' })}</span><b>${d.getDate()}</b></button>`; }).join('');
    return `<div class="ds-asec"><div class="ds-daystrip" role="group" aria-label="Pick a day">${days}</div>${ui.segmented([['day', 'Day'], ['week', 'This week']], st.mode, 'mode', 'Range', null).replace('class="segmented"', 'class="segmented" data-fill')}</div>`;
  };

  const callRow = (id, recap) => {
    const c = D.cById[id], done = recap || !!DS.S().done[id];
    const end = done ? `<span class="ds-called" aria-label="Called" data-tick="called-${id}|${recap ? 'recap' : 'on'}">${icon('check')}</span>` : `<a class="ds-icon-btn ds-abtn" style="border:var(--border-width) solid var(--border)" href="${href('contact', 'id=' + id + '&act=call')}" aria-label="Call ${esc(c.name)}" data-tick="called-${id}|off">${icon('phone')}</a>`;
    return `<div class="ds-arow"${done ? ' data-done' : ''} data-lead>${ui.cls(c.cls)}<a class="ds-arow__body" href="${href('contact', 'id=' + id)}" style="color:inherit;text-decoration:none"><span class="ds-arow__title">${esc(c.name)}</span><span class="ds-arow__sub">${esc(c.why)}</span><span style="margin-top:var(--space-1)">${ui.trust(c.trust)}</span></a>${end}</div>`;
  };

  const callNext = () => {
    const r = rel(), S = DS.S(), ids = DS.callIds();
    if (st.mode === 'week') return weekPlan();
    const n = r === 0 ? DS.callsDone() : r < 0 ? 40 - (Math.abs(st.sel) * 7) % 13 : 0, left = ids.filter(id => !S.done[id]).length;
    const title = st.sel === 0 ? 'Call next' : r < 0 ? 'Calls · ' + fmtS(addD(st.sel)) : 'Planned · ' + fmtS(addD(st.sel));
    const sub = r === 0 ? left + ' left to call' : r < 0 ? 'Recap' : 'Upcoming';
    let body;
    if (r > 0) body = `<div style="padding:0 var(--space-4) var(--space-4)">${ui.empty({ ic: 'calendar-blank', title: 'Not planned yet', text: 'The call list for ' + fmtS(addD(st.sel)) + ' is built the evening before.' })}</div>`;
    else if (r === 0 && left === 0) body = `<div style="padding:0 var(--space-4) var(--space-4)">${ui.empty({ ic: 'check-circle', tone: 'success', title: 'Every call on today’s list is done', text: 'Build the next list, or work the follow-ups.', action: ui.btn({ label: 'Build a list', ic: 'list-bullets', variant: 'outline', act: 'build-list' }) })}</div>`;
    else body = ids.map(id => callRow(id, r < 0)).join('') + `<p class="ds-meta" style="padding:var(--space-2) var(--space-4) var(--space-4)">5 Class A owners have no verified reason yet</p>`;
    return `<section class="ds-acard" aria-label="${esc(title)}"><div class="ds-acard__head"><div class="ds-acard__title"><h2>${esc(title)}</h2><span class="ds-meta">${esc(sub)}</span></div>
      <div class="ds-acard__prog">${ui.progress(n / 40, 'Calls', { key: r === 0 ? 'calls' : 'calls-' + st.sel })}<span class="ds-meta-strong num"><span${r === 0 ? ' data-count="calls"' : ''}>${n}</span> of 40 calls</span></div></div>${body}</section>`;
  };

  const weekPlan = () => {
    const off0 = -((D.TODAY.getDay() + 6) % 7);
    return `<section class="ds-asec" aria-label="This week"><div class="ds-ahead"><h2>This week</h2><span class="ds-meta">${fmtMD(addD(off0))} – ${fmtMD(addD(off0 + 4))}</span></div><div class="ds-alist">${D.weekFocus.map(([f, n], i) => { const o = off0 + i, d = addD(o);
      return `<button type="button" class="ds-arow" data-act="pick-day" data-arg="${o}"${o < 0 ? ' data-done' : ''}><span class="ds-time" style="width:3rem">${d.toLocaleDateString('en-US', { weekday: 'short' })} ${d.getDate()}</span><span class="ds-arow__body"><span class="ds-arow__title">${esc(f)}</span><span class="ds-arow__sub">${esc(n === 'calls' ? DS.callsDone() + ' of 40 calls' : n)}${o === 0 ? ' · Today' : ''}</span></span><span class="ds-arow__end">${icon('caret-right')}</span></button>`; }).join('')}</div></section>`;
  };

  const todos = () => {
    const S = DS.S(), open = S.tasks.filter(t => !t.done && (st.mode === 'week' || (st.sel <= 0 ? (t.due || 0) <= 0 : (t.due || 0) === st.sel))), resolved = S.tasks.filter(t => t.done);
    return `<section class="ds-asec" aria-label="To-dos"><div class="ds-ahead"><h2>To-dos</h2><button type="button" class="ds-link-btn" data-act="sheet" data-arg="add">Add</button></div>
      <div class="ds-alist">${open.length ? open.map(t => `<div class="ds-arow ds-task" data-lead><button type="button" class="ds-check-mini" style="width:1.5rem;height:1.5rem" role="checkbox" aria-checked="false" aria-label="Mark “${esc(t.t)}” done" data-act="task-done" data-arg="${t.id}">${icon('check')}</button><span class="ds-arow__body"><span class="ds-arow__title">${esc(t.t)}</span><span class="ds-arow__sub">${esc(t.g + ' · ' + t.m)}</span></span></div>`).join('') : `<div class="ds-arow"><span class="ds-arow__body"><span class="ds-arow__sub">Nothing due. Add a to-do with the + button.</span></span></div>`}
        <button type="button" class="ds-arow" aria-expanded="${st.resOpen}" data-act="resolved"><span class="ds-arow__body"><span class="ds-arow__title" style="color:var(--fg-muted);font-weight:var(--weight-regular)">Resolved (${resolved.length})</span></span><span class="ds-arow__end">${icon(st.resOpen ? 'caret-up' : 'caret-down')}</span></button>
        ${st.resOpen ? resolved.map(t => `<div class="ds-arow" data-done data-anim="grow" data-key="res-${t.id}"><span class="ds-check-mini" data-on>${icon('check')}</span><span class="ds-arow__body"><span class="ds-arow__title">${esc(t.t)}</span></span><button type="button" class="ds-link-btn" data-act="task-done" data-arg="${t.id}">Reopen</button></div>`).join('') : ''}</div></section>`;
  };

  const goals = () => {
    const S = DS.S(), done = DS.callsDone(), F = st.mode === 'week' ? 'Weekly' : 'Daily';
    const live = { calls: done, convos: 2 + S.convos, dials: 112 + S.calls }, r = rel();
    const rows = D.goals[F].filter(g => g[1]).map(([t, target, cur]) => { const n0 = typeof cur === 'string' ? live[cur] : cur, n = r === 0 || st.mode === 'week' ? n0 : r > 0 ? 0 : target;
      return `<div class="ds-atile"><span class="ds-atile__label">${esc(t)}</span><span class="ds-atile__value"><b>${Math.min(n, target)}</b><span class="ds-meta">of ${target}</span></span>${ui.progress(n / target, t, { tone: 'accent', thin: true, fill: true })}</div>`; }).join('');
    return `<section class="ds-asec" aria-label="Goals"><div class="ds-ahead"><h2>${st.mode === 'week' ? 'Weekly goals' : 'Goals'}</h2></div><div class="ds-atiles">${rows}</div></section>`;
  };

  const meetings = () => {
    const r = rel(), list = r === 0 && st.mode === 'day' ? D.meetings : D.meetings.slice(Math.abs(st.sel) % 2, Math.abs(st.sel) % 2 + 2);
    return `<section class="ds-asec" aria-label="Meetings"><div class="ds-ahead"><h2>Meetings</h2><a href="${href('calendar')}">Calendar</a></div><div class="ds-alist">${list.map(([t, n, w]) => `<a class="ds-arow" href="${href('calendar')}"><span class="ds-time">${esc(t)}</span><span class="ds-arow__body"><span class="ds-arow__title">${esc(n)}</span><span class="ds-arow__sub">${esc(w)}</span></span></a>`).join('')}</div></section>`;
  };

  const addSheet = () => DS.V.sheet === 'add' ? ui.sheet({ key: 'add', title: 'Add a to-do', body: `<div class="ds-stack" data-gap="4" style="padding-top:var(--space-2)"><label class="field"><span class="field__label">To-do</span><input class="field__control" id="new-task" placeholder="Call the lender back" value="${esc(st.newTask)}" data-input="newTask" data-enter="add-task" autocomplete="off"></label>
      <div class="field"><span class="field__label">Category</span><div class="ds-achips" style="margin:0;padding:0;flex-wrap:wrap">${D.cats.map(c => `<button type="button" class="ds-fchip" aria-pressed="${c === st.newCat}" data-act="cat" data-arg="${esc(c)}">${esc(c)}</button>`).join('')}</div></div>
      <p class="ds-meta">Due ${st.sel === 0 ? 'today' : fmtS(addD(st.sel))}.</p></div>`,
    foot: ui.btn({ label: 'Cancel', variant: 'outline', act: 'close-sheet' }) + ui.btn({ label: 'Add to-do', act: 'add-task', disabled: !st.newTask.trim() }) }) : '';

  DS.define({
    id: 'attack-plan', nav: 'dashboard', tab: 'today',
    head, scope: () => 'Today',
    render: () => `<div class="ds-apage">${ui.large(st.mode === 'week' ? 'This week' : st.sel === 0 ? 'Today' : fmtS(addD(st.sel)), st.mode === 'week' ? 'Attack Plan' : fmtL(addD(st.sel)))}${strip()}${st.sel === 0 ? ui.nudge(D.nudges['attack-plan']) : ''}<div class="ds-stack" data-anim="slide" data-key="today-${st.mode}-${st.sel}" style="gap:var(--space-6)">${callNext()}${todos()}${goals()}${meetings()}</div></div>`,
    overlays: addSheet,
    after: () => { if (st.focus) { st.focus = false; const el = document.getElementById('new-task'); if (el) el.focus(); } },
    acts: {
      'pick-day': (el, o) => { st.sel = Number(o); st.mode = 'day'; DS.render(); },
      mode: (el, k) => { st.mode = k; if (k === 'week') st.sel = 0; DS.render(); },
      resolved: () => { st.resOpen = !st.resOpen; DS.render(); },
      cat: (el, c) => { st.newCat = c; DS.render(); },
      sheet: (el, k) => { DS.V.sheet = k; st.focus = true; DS.render(); },
      'task-done': (el, id) => { const go = () => DS.store(S => { S.tasks = S.tasks.map(t => t.id === +id ? { ...t, done: !t.done } : t); }); const row = el.closest('.ds-task'); if (row) { DS.play(el, [{ transform: 'scale(.8)' }, { transform: 'scale(1)' }], { duration: 160 }); DS.collapse(row, go); } else go(); },
      'add-task': () => { const t = st.newTask.trim(); if (!t) return; DS.store(S => { S.tasks = [...S.tasks, { id: Date.now(), g: st.newCat, t, due: Math.max(0, st.sel), m: 'Added today' }]; }); st.newTask = ''; DS.V.sheet = null; DS.render(); DS.toast('To-do added'); },
      'build-list': () => { DS.V.draft = '/list '; DS.openBrain(); },
    },
    inputs: { newTask: v => { const was = !!st.newTask.trim(); st.newTask = v; if (was !== !!v.trim()) DS.render(); } },
  });
})();
