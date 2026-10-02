/* 02 Dashboard › Attack Plan: the to-do view. Today's plan with Call next, to-dos, the week, goals and meetings. */
(() => {
  const { D, ui, esc, icon, href, params, fmtL, fmtS, fmtMD } = DS;
  const st = { mode: params.get('range') === 'week' ? 'week' : 'day', sel: Number(params.get('day')) || 0, picker: params.get('picker') === '1', pickM: null, goalF: params.get('range') === 'week' ? 'Weekly' : 'Daily', resOpen: params.get('resolved') === '1', newTask: '', newCat: 'Follow up' };
  if (params.get('called') === 'all') DS.callIds().forEach(id => { DS.S().done[id] = true; });
  const addD = D.addD;
  const wk = () => { const selD = addD(st.sel), wkOff = st.sel - ((selD.getDay() + 6) % 7); return { selD, wkOff, wkRel: Math.floor((wkOff + 2) / 7), range: fmtMD(addD(wkOff)) + ' – ' + fmtMD(addD(wkOff + 4)) }; };
  const rel = () => { const w = wk(); return st.mode === 'week' ? Math.sign(w.wkRel) : Math.sign(st.sel); };

  const toolbar = () => {
    const w = wk(), label = st.mode === 'week' ? (w.wkRel === 0 ? 'This week' : 'Week of ' + fmtMD(addD(w.wkOff))) : (st.sel === 0 ? 'Today' : fmtS(w.selD));
    const relL = st.mode === 'week' ? w.range : fmtL(w.selD) + (st.sel === -1 ? ' · Yesterday' : st.sel === 1 ? ' · Tomorrow' : '');
    const unit = st.mode === 'week' ? 'week' : 'day';
    return `<div class="ds-toolbar" style="margin:calc(var(--space-1) * -1) 0 calc(var(--space-2) * -1)">
      ${ui.btn({ ic: 'caret-left', aria: 'Previous ' + unit, tip: 'Previous ' + unit, variant: 'outline', act: 'step', arg: -1 })}${ui.btn({ ic: 'caret-right', aria: 'Next ' + unit, tip: 'Next ' + unit, variant: 'outline', act: 'step', arg: 1 })}
      <div class="ds-datepick"><button type="button" class="ds-datepick__btn" aria-haspopup="dialog" aria-expanded="${st.picker}" data-act="picker" aria-live="polite">${icon('calendar-blank')}<span class="font-semibold">${esc(label)}</span><span class="ds-meta">${esc(relL)}</span>${icon('caret-down')}</button>${st.picker ? picker() : ''}</div>
      ${st.sel !== 0 ? ui.btn({ label: 'Back to today', variant: 'outline', size: 'sm', act: 'today' }) : ''}
      <span class="ds-grow"></span>${ui.segmented([['day', 'Day'], ['week', 'Week']], st.mode, 'mode', 'Range')}
    </div>`;
  };
  const picker = () => {
    const w = wk(), mOff = st.pickM ?? ((w.selD.getFullYear() - 2026) * 12 + w.selD.getMonth() - 8), first = new Date(2026, 8 + mOff, 1), lead = (first.getDay() + 6) % 7, days = new Date(2026, 9 + mOff, 0).getDate(), cells = Math.ceil((lead + days) / 7) * 7;
    const off = d => Math.round((d - D.TODAY) / 864e5), wkOf = o => o - ((addD(o).getDay() + 6) % 7);
    const grid = [...Array(cells)].map((_, i) => { const d = new Date(2026, 8 + mOff, 1 - lead + i), o = off(d), inM = d.getMonth() === first.getMonth(), col = i % 7, inWeek = st.mode === 'week' && wkOf(o) === w.wkOff, sel = st.mode === 'day' && o === st.sel;
      return `<button type="button" class="ds-minical__d" aria-label="${esc(fmtL(d))}" aria-pressed="${sel}"${inM ? '' : ' data-out'}${o === 0 ? ' data-today' : ''}${inWeek ? ' data-inweek' : ''}${inWeek && col === 0 ? ' data-first' : ''}${inWeek && col === 6 ? ' data-last' : ''} data-act="pick-day" data-arg="${o}">${d.getDate()}</button>`; }).join('');
    return `<div class="ds-pop ds-datepick__pop" role="dialog" aria-label="Pick a date" data-anim="pop" data-key="picker">
      <div style="display:flex;align-items:center;gap:var(--space-1)"><span class="ds-grow font-semibold" style="padding-left:var(--space-1)">${first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>${ui.iconBtn({ ic: 'caret-left', aria: 'Previous month', act: 'pick-month', arg: mOff - 1 })}${ui.iconBtn({ ic: 'caret-right', aria: 'Next month', act: 'pick-month', arg: mOff + 1 })}</div>
      <div class="ds-minical">${['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(x => `<span class="ds-minical__dow">${x}</span>`).join('')}${grid}</div>
      <div style="display:flex;align-items:center;gap:var(--space-2);padding-top:var(--space-2);border-top:var(--border-width) solid var(--border-subtle)"><span class="ds-grow ds-meta">${st.mode === 'week' ? 'Pick any day to select its week' : 'Pick a day'}</span>${ui.btn({ label: 'Today', size: 'sm', variant: 'outline', act: 'pick-day', arg: 0 })}</div>
    </div>`;
  };

  const callRow = (id, recap) => {
    const c = D.cById[id], done = recap || !!DS.S().done[id];
    return `<div class="ds-callrow"${done ? ' data-done' : ''}>${ui.cls(c.cls)}<a class="ds-callrow__name" href="${href('contact', 'id=' + id)}"><b>${esc(c.name)}</b><span class="ds-row__sub">${esc(D.pById[c.pid].addr)}</span></a><span class="ds-callrow__why" title="${esc(c.why)}">${esc(c.why)}</span>${ui.trust(c.trust)}${done ? `<span class="ds-called" aria-label="Called" data-tick="called-${id}|${recap ? 'recap' : 'on'}">${icon('check')}</span>` : `<a class="button button--icon" data-variant="outline" aria-label="Call ${esc(c.name)}" data-tip="Call ${esc(c.name)}" data-tick="called-${id}|off" href="${href('contact', 'id=' + id + '&act=call')}">${icon('phone')}</a>`}</div>`;
  };
  const todayPlan = () => {
    const w = wk(), r = rel(), S = DS.S(), ids = DS.callIds(), done = DS.callsDone();
    const title = st.mode === 'week' ? (w.wkRel === 0 ? 'This week’s plan' : 'Week plan') : st.sel === 0 ? 'Today’s plan' : 'Plan · ' + fmtS(w.selD);
    const left = ids.filter(id => !S.done[id]).length;
    const sub = (st.mode === 'week' ? w.range : fmtL(w.selD)) + ' · ' + (r === 0 ? left + ' left to call' : r < 0 ? 'Recap' : 'Upcoming');
    const n = st.mode === 'week' ? (r === 0 ? 112 + S.calls : r < 0 ? 150 : 0) : (r === 0 ? done : r < 0 ? 40 - (Math.abs(st.sel) * 7) % 13 : 0), of = st.mode === 'week' ? 150 : 40;
    const allCalled = r === 0 && ids.every(id => S.done[id]);
    const rows = r === 0 ? ids.map(id => callRow(id)) : r < 0 ? ids.map(id => callRow(id, true)) : [];
    return `<section class="ds-card" aria-label="${esc(title)}" style="padding-bottom:var(--space-2);gap:var(--space-1)">
      <div class="ds-card__head" style="padding-bottom:var(--space-1)"><div class="ds-card__title"><h2>${esc(title)}</h2><span class="ds-meta">${esc(sub)}</span></div><span class="ds-meta-strong num"><span data-count="${r === 0 && st.mode === 'day' ? 'calls' : 'plan-' + st.mode + st.sel}">${n}</span> of ${of} ${st.mode === 'week' ? 'dials' : 'calls'}</span>${ui.progress(n / of, 'Calls', { key: r === 0 && st.mode === 'day' ? 'calls' : 'plan-' + st.mode + st.sel })}</div>
      <div class="ds-stack" data-gap="2" style="gap:var(--space-0-5)">
        <div class="ds-subhead"><h3>${r < 0 ? 'Outreach · Called' : 'Outreach · Call next'}</h3><a class="small" href="${href('contacts', 'list=A')}">View all Class A</a></div>
        ${r > 0 ? `<div class="ds-note" style="margin-bottom:var(--space-1)">${icon('calendar-blank')}<span class="ds-grow">${esc(st.mode === 'week' ? 'Brain builds each day’s call list that morning. 200 owners are queued for ' + w.range + '.' : 'Brain builds this call list the morning of ' + fmtL(w.selD) + '. 40 owners are queued from your Class A segments.')}</span></div>` : ''}
        ${rows.join('')}
        ${allCalled ? `<div class="ds-note" style="color:var(--fg)"><span class="ds-grow">You’ve called everyone on today’s list.</span>${ui.btn({ label: 'Build a new list', variant: 'outline', act: 'build-list' })}</div>` : ''}
        <span class="ds-meta" style="padding:var(--space-1) var(--space-2)">5 Class A owners have no verified reason yet</span>
      </div>
    </section>`;
  };

  const dueOf = t => t.due ?? [0, 1, 0, 2, -1, 3, 0][t.id % 7];
  const inRange = t => { const d = dueOf(t), w = wk(); if (st.mode === 'week') return (d >= w.wkOff && d <= w.wkOff + 6) || (w.wkRel === 0 && d < w.wkOff); return st.sel === 0 ? d <= 0 : d === st.sel; };
  const todos = () => {
    const S = DS.S(), w = wk(), open = S.tasks.filter(t => !t.done && inRange(t)), resolved = S.tasks.filter(t => t.done);
    const groups = D.cats.map(g => ({ g, items: open.filter(t => t.g === g) })).filter(g => g.items.length);
    const when = st.mode === 'week' ? 'the week of ' + w.range : st.sel === 0 ? 'today' : 'on ' + fmtS(w.selD);
    const sub = open.length + ' open · ' + (st.mode === 'week' ? 'Week of ' + w.range : st.sel === 0 ? 'Due today and overdue' : 'Due ' + fmtS(w.selD));
    return `<section class="ds-card" aria-label="To-dos" style="padding-bottom:var(--space-2);gap:var(--space-1)">
      <div class="ds-card__head" style="padding-bottom:var(--space-1)"><div class="ds-card__title"><h2>To-dos</h2><span class="ds-meta">${esc(sub)}</span></div></div>
      ${groups.map(({ g, items }) => `<div class="ds-stack" style="gap:var(--space-0-5)"><div class="ds-subhead"><h3>${esc(g)}</h3></div>${items.map(t => `<div class="ds-task"><button type="button" class="ds-check" role="checkbox" aria-checked="false" aria-label="Mark “${esc(t.t)}” done" data-act="task-done" data-arg="${t.id}"></button><span class="ds-row__body"><span class="font-medium">${esc(t.t)}</span><span class="ds-task__meta">${t.rep ? icon('repeat') : ''}${esc(t.m)}</span></span>${ui.iconBtn({ ic: 'trash', aria: 'Delete', act: 'task-del', arg: t.id })}</div>`).join('')}</div>`).join('')}
      ${groups.length ? '' : `<div class="ds-note">${icon('check-circle')}<span>Nothing due ${esc(when)}.</span></div>`}
      <div class="ds-inline-add"><label class="ds-input-icon">${icon('plus')}<input id="new-task" aria-label="Add a to-do" placeholder="Add a to-do" value="${esc(st.newTask)}" data-input="newTask" data-enter="add-task" autocomplete="off"></label>
        <span class="select" style="width:9rem"><select class="field__control" aria-label="Category" data-change="newCat">${D.cats.map(c => `<option${c === st.newCat ? ' selected' : ''}>${esc(c)}</option>`).join('')}</select></span>${ui.btn({ label: 'Add', variant: 'outline', act: 'add-task' })}</div>
      <button type="button" class="ds-mute-btn" style="align-self:flex-start;height:var(--control-sm);padding:0 var(--space-2)" aria-expanded="${st.resOpen}" data-act="resolved">${icon(st.resOpen ? 'caret-down' : 'caret-right')}Resolved (${resolved.length})</button>
      ${st.resOpen ? resolved.map(t => `<div class="ds-resolved" data-anim="grow" data-key="res-${t.id}"><span class="ds-check" data-on>${icon('check')}</span><span>${esc(t.t)}</span><button type="button" class="ds-link-btn" data-act="task-done" data-arg="${t.id}">Reopen</button></div>`).join('') : ''}
    </section>`;
  };
  const week = () => {
    const w = wk(), S = DS.S();
    const days = [0, 1, 2, 3, 4].map(i => { const off = w.wkOff + i, d = addD(off), f = w.wkRel === 0 ? D.weekFocus[i] : D.weekAlt[(i + Math.abs(w.wkRel)) % 5];
      const n = w.wkRel === 0 ? (f[1] === 'calls' ? DS.callsDone() + ' of 40 calls' : f[1]) : off < 0 ? 'Done' : 'Planned';
      return `<button type="button" class="ds-day" aria-pressed="${st.mode === 'day' && off === st.sel}"${off === 0 ? ' data-today' : ''} data-act="pick-day" data-arg="${off}"><span class="ds-meta-strong font-medium">${d.toLocaleDateString('en-US', { weekday: 'short' })} ${d.getDate()}${off === 0 ? ' · Today' : ''}</span><b>${esc(f[0])}</b><span class="ds-meta">${esc(n)}</span></button>`; }).join('');
    return `<section class="ds-card" data-pad="all" aria-label="This week"><div class="ds-card__head"><h2 class="ds-grow">${w.wkRel === 0 ? 'This week' : 'Week of ' + esc(w.range)}</h2>${ui.iconBtn({ ic: 'caret-left', aria: 'Previous week', act: 'step-week', arg: -1 })}${ui.iconBtn({ ic: 'caret-right', aria: 'Next week', act: 'step-week', arg: 1 })}</div><div class="ds-week">${days}</div></section>`;
  };
  const goals = () => {
    const S = DS.S(), w = wk(), done = DS.callsDone();
    const gRel = st.goalF === 'Daily' ? Math.sign(st.sel) : st.goalF === 'Weekly' ? Math.sign(w.wkRel) : Math.sign((w.selD.getFullYear() - 2026) * 12 + w.selD.getMonth() - 8);
    const period = st.goalF === 'Daily' ? (st.sel === 0 ? 'Today' : fmtS(w.selD)) : st.goalF === 'Weekly' ? (w.wkRel === 0 ? 'This week · ' : '') + w.range : w.selD.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    const live = { calls: done, convos: 2 + S.convos, dials: 112 + S.calls };
    const rows = D.goals[st.goalF].map(([t, target, cur], i) => {
      const key = st.goalF + i + ':' + (st.goalF === 'Daily' ? st.sel : st.goalF === 'Weekly' ? w.wkOff : w.selD.getMonth());
      const n0 = typeof cur === 'string' ? live[cur] : cur, n = gRel === 0 ? n0 : gRel > 0 ? 0 : Math.round(target * [1, 0.9, 0.8][i % 3]);
      const isDone = target ? n >= target : gRel < 0 ? i % 2 === 0 : !!S.goalDone[key];
      const box = target ? `<span class="ds-box"${isDone ? ' data-on' : ''} role="img" aria-label="${isDone ? 'Done' : 'In progress'}">${isDone ? icon('check') : ''}</span>` : `<button type="button" class="ds-box" role="checkbox" aria-checked="${isDone}" aria-label="${esc(t)}"${isDone ? ' data-on' : ''} data-act="goal" data-arg="${esc(key)}">${isDone ? icon('check') : ''}</button>`;
      return `<div class="ds-goalrow"><div>${box}<span class="ds-grow font-medium">${esc(t)}</span>${target ? `<span class="ds-meta num"><span data-count="goal-${esc(key)}">${Math.min(n, target)}</span> of ${target}</span>` : ''}</div>${target ? ui.progress(n / target, t, { tone: 'accent', key: 'goal-' + key }) : ''}</div>`;
    }).join('');
    return `<section class="ds-card" data-pad="all" aria-label="Goals"><div class="ds-card__head"><div class="ds-card__title"><h2>Goals</h2><span class="ds-meta">${esc(period)}</span></div>${ui.segmented([['Daily', 'Daily'], ['Weekly', 'Weekly'], ['Monthly', 'Monthly']], st.goalF, 'goal-f', 'Goal period', 'sm')}</div>${rows}</section>`;
  };
  const meetings = () => {
    const w = wk(), r = rel(), title = st.mode === 'week' ? 'Meetings · ' + w.range : st.sel === 0 ? 'Today’s meetings' : 'Meetings · ' + fmtS(w.selD);
    const list = r === 0 && st.mode === 'day' ? D.meetings : D.meetings.slice(Math.abs(st.sel) % 2, Math.abs(st.sel) % 2 + 2);
    return `<section class="ds-card ds-meetings" aria-label="${esc(title)}"><div class="ds-card__head"><h2 class="ds-grow">${esc(title)}</h2><a href="${href('calendar')}">Open calendar</a></div>${list.map(([t, n, wh]) => `<div class="ds-row" data-dense><span class="ds-time">${esc(t)}</span><span class="ds-row__body"><span class="ds-row__title">${esc(n)}</span><span class="ds-row__sub">${esc(wh)}</span></span></div>`).join('')}</section>`;
  };

  DS.define({
    id: 'attack-plan', nav: 'dashboard', brain: 'min',
    crumbs: () => [{ l: 'Dashboard', page: 'attack-plan' }, { l: 'Attack Plan' }],
    scope: () => 'Dashboard',
    render: () => `<div class="ds-page">${ui.pageHead('Dashboard', ui.tabs(D.dashboardTabs, 'attack-plan', 'Dashboard'))}${ui.nudge(D.nudges['attack-plan'])}${toolbar()}
      <div class="ds-split" data-anim="slide" data-key="plan-${st.mode}-${st.sel}" style="--dir:${st.dir || 1}"><div class="ds-stack">${todayPlan()}${todos()}${week()}</div><div class="ds-stack">${goals()}${meetings()}</div></div></div>`,
    acts: {
      step: (el, d) => { st.dir = Math.sign(Number(d)); st.sel += Number(d) * (st.mode === 'week' ? 7 : 1); DS.render(); },
      'step-week': (el, d) => { st.dir = Math.sign(Number(d)); st.sel += Number(d) * 7; DS.render(); },
      today: () => { st.dir = st.sel > 0 ? -1 : 1; st.sel = 0; DS.render(); },
      mode: (el, k) => { st.mode = k; st.goalF = k === 'week' ? 'Weekly' : 'Daily'; DS.render(); },
      picker: () => { st.picker = !st.picker; st.pickM = null; DS.render(); },
      'pick-month': (el, m) => { st.pickM = Number(m); DS.render(); },
      'pick-day': (el, o) => { st.dir = Number(o) < st.sel ? -1 : 1; st.sel = Number(o); if (el.classList.contains('ds-day')) st.mode = 'day'; st.picker = false; st.pickM = null; DS.render(); },
      'goal-f': (el, k) => { st.goalF = k; DS.render(); },
      goal: (el, key) => DS.store(S => { S.goalDone[key] = !S.goalDone[key]; }),
      resolved: () => { st.resOpen = !st.resOpen; DS.render(); },
      'task-done': (el, id) => { const go = () => DS.store(S => { S.tasks = S.tasks.map(t => t.id === +id ? { ...t, done: !t.done } : t); }); const row = el.closest('.ds-task,.ds-resolved'); if (row) { DS.play(el, [{ transform: 'scale(.8)' }, { transform: 'scale(1)' }], { duration: 160 }); DS.collapse(row, go); } else go(); },
      'task-del': (el, id) => DS.collapse(el.closest('.ds-task'), () => DS.store(S => { S.tasks = S.tasks.filter(t => t.id !== +id); })),
      'add-task': () => { const t = st.newTask.trim(); if (!t) return; const w = wk(); DS.store(S => { S.tasks = [...S.tasks, { id: Date.now(), g: st.newCat, t, due: st.mode === 'week' ? Math.max(0, w.wkOff) : st.sel, m: 'Added today' }]; }); st.newTask = ''; DS.render(); DS.toast('To-do added'); },
      'build-list': () => { DS.V.draft = '/list '; DS.openBrain(); },
    },
    inputs: { newTask: v => { st.newTask = v; }, newCat: v => { st.newCat = v; } },
    onEscape: () => { if (st.picker) { st.picker = false; DS.render(); return true; } return false; },
  });
})();
