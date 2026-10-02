/* 08 Dashboard › Calendar: Day / Week / Month, a click drops a draft with an inline card, New event opens the full dialog. */
(() => {
  const { D, ui, esc, icon, href, params, fmtL, fmtMD, tFmt } = DS;
  const addD = D.addD, CALS = D.calendars;
  const st = { view: ['day', 'week', 'month'].includes(params.get('view')) ? params.get('view') : innerWidth < 768 ? 'day' : 'week', off: 0, m: null, hide: {}, ev: params.get('event') || null, draft: null, dlg: null };
  const S = DS.S();
  const dOff = d => Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()) - D.TODAY) / 864e5);
  const DURS = [[0.5, '30 min'], [1, '1 hr'], [1.5, '1.5 hr'], [2, '2 hr']];
  if (params.get('draft') === '1') st.draft = { t: '', cal: 'mtg', cid: '', dur: 1, off: 0, s: 10.5 };
  if (params.get('dialog') === 'new') st.dlg = { t: params.get('clash') ? 'Owner call · Feld' : '', off: '0', s: params.get('clash') ? '12' : '10.5', dur: '1', cal: 'mtg', cid: params.get('clash') ? 'feld' : '', n: '' };
  if (params.get('added') === '1') S.calNew = [...S.calNew, { t: 'Call · Aaron Feld', off: 0, s: 10.5, dur: 1, cal: 'call', cid: 'feld', n: '' }];

  const evOn = off => {
    const d = addD(off), dow = (d.getDay() + 6) % 7, wk = Math.floor((off - dow + 2) / 7);
    const base = dow > 4 ? [] : D.events.map((e, j) => ({ e, j })).filter(({ e, j }) => e[0] === dow && (wk === 0 || (j + wk) % 4 !== 0) && !st.hide[e[3]]).map(({ e, j }) => ({ id: off + '-' + j, s: e[1], dur: e[2], cal: e[3], t: e[4], who: e[5], cid: e[6] || null, off }));
    const mine = S.calNew.map((x, k) => ({ ...x, id: x.off + '-u' + k, who: x.cid ? D.cById[x.cid].name : 'Just you' })).filter(x => x.off === off && !st.hide[x.cal]);
    const drafts = st.draft && st.draft.off === off ? [{ ...st.draft, id: 'draft', t: st.draft.t.trim() || '(No title)', draft: true }] : [];
    const all = [...base, ...mine, ...drafts].sort((a, b) => a.s - b.s || b.dur - a.dur);
    let cl = [], end = -1; const flush = () => { const n = Math.max(...cl.map(x => x.lane)) + 1; cl.forEach(x => { x.n = n; }); cl = []; };
    all.forEach(x => { if (cl.length && x.s >= end) flush(); const used = cl.filter(y => y.s + y.dur > x.s).map(y => y.lane); let l = 0; while (used.includes(l)) l++; x.lane = l; cl.push(x); end = Math.max(end, x.s + x.dur); });
    if (cl.length) flush(); return all;
  };
  const sel = () => addD(st.off);
  const wkStart = () => st.off - ((sel().getDay() + 6) % 7);
  const cols = () => st.view === 'day' ? [st.off] : [0, 1, 2, 3, 4, 5, 6].map(i => wkStart() + i);
  const findEv = id => { if (!id) return null; const off = Number(String(id).split('-')[0]); return evOn(off).find(x => x.id === id) || null; };

  const miniMonth = () => {
    const mOff = st.m ?? ((sel().getFullYear() - 2026) * 12 + sel().getMonth() - 8), first = new Date(2026, 8 + mOff, 1), lead = (first.getDay() + 6) % 7, days = new Date(2026, 9 + mOff, 0).getDate(), cells = Math.ceil((lead + days) / 7) * 7;
    return `<section class="ds-stack" data-gap="2" style="gap:var(--space-1-5)"><div style="display:flex;align-items:center;gap:var(--space-0-5)"><span class="ds-grow font-semibold" style="padding-left:var(--space-1-5)">${first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>${ui.iconBtn({ ic: 'caret-left', aria: 'Previous month', act: 'mini-m', arg: mOff - 1 })}${ui.iconBtn({ ic: 'caret-right', aria: 'Next month', act: 'mini-m', arg: mOff + 1 })}</div>
      <div class="ds-minical" data-size="sm">${['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(x => `<span class="ds-minical__dow">${x}</span>`).join('')}${[...Array(cells)].map((_, i) => { const d = new Date(2026, 8 + mOff, 1 - lead + i), o = dOff(d); return `<button type="button" class="ds-minical__d" aria-label="${esc(fmtL(d))}"${d.getMonth() !== first.getMonth() ? ' data-out' : ''}${o === 0 ? ' data-today' : ''}${o === st.off && o !== 0 ? ' data-sel' : ''} data-act="goto" data-arg="${o}">${d.getDate()}</button>`; }).join('')}</div></section>`;
  };
  const aside = () => {
    const shown = cols().flatMap(evOn);
    return `<aside class="ds-cal__aside" aria-label="Calendar options">${ui.btn({ label: 'New event', ic: 'plus', shape: 'pill', size: 'lg', act: 'new-event' })}${miniMonth()}
      <section class="ds-stack" style="gap:1px"><span class="ds-meta font-semibold" style="padding:0 var(--space-1-5) var(--space-1-5)">My calendars</span>${Object.entries(CALS).map(([k, l]) => { const on = !st.hide[k], n = shown.filter(x => x.cal === k).length; return `<button type="button" class="ds-calrow" role="checkbox" aria-checked="${on}" data-cal="${k}" data-act="cal-toggle" data-arg="${k}"><span class="ds-calbox"${on ? ' data-on' : ''} data-tick="cal-${k}|${on ? 'on' : 'off'}">${on ? icon('check') : ''}</span><span>${esc(l)}</span><span>${n || ''}</span></button>`; }).join('')}</section>
      <section class="ds-stack" style="gap:1px"><span class="ds-meta font-semibold" style="padding:0 var(--space-1-5) var(--space-1-5)">Other calendars</span>${['Birthdays', 'Holidays in United States'].map(l => `<span class="ds-calrow" role="checkbox" aria-checked="false" tabindex="0" aria-disabled="true" data-tip="${DS.OFF}" data-tip-side="left"><span class="ds-calbox" style="border-color:var(--fg-disabled)"></span><span>${l}</span><span></span></span>`).join('')}</section></aside>`;
  };
  const label = () => { if (st.view === 'day') return fmtL(sel()); const a = addD(st.view === 'month' ? st.off : wkStart()), b = addD(st.view === 'month' ? st.off : wkStart() + 6); return a.getMonth() === b.getMonth() ? a.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : a.toLocaleDateString('en-US', { month: 'short' }) + ' – ' + b.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }); };
  const head = () => `<div class="ds-calhead">${ui.btn({ label: 'Today', variant: 'outline', shape: 'pill', act: 'today' })}<span style="width:var(--space-2)"></span>${ui.iconBtn({ ic: 'caret-left', aria: 'Previous', act: 'prev' })}${ui.iconBtn({ ic: 'caret-right', aria: 'Next', act: 'next' })}<h2 class="ds-title-xl" aria-live="polite" style="padding:0 var(--space-2)">${esc(label())}</h2><span class="ds-grow"></span>${ui.segmented([['day', 'Day'], ['week', 'Week'], ['month', 'Month']], st.view, 'view', 'View')}</div>`;
  const evBtn = (x, month) => {
    const on = st.ev === x.id || x.draft;
    if (month) return `<button type="button" class="ds-month__chip" data-cal="${x.cal}" data-act="ev" data-arg="${x.id}"><span class="ds-ev-dot"></span><span>${tFmt(x.s).replace(':00', '').replace(' AM', 'a').replace(' PM', 'p')}</span><span>${esc(x.t)}</span></button>`;
    return `<button type="button" class="ds-ev" data-cal="${x.cal}"${x.draft ? ` data-anim="pop" data-key="draft-ev-${x.off}-${x.s}"` : ''}${x.dur < 0.75 ? ' data-short' : ''}${x.draft ? ' data-draft' : ''} aria-pressed="${!!on}" data-act="ev" data-arg="${x.id}" style="left:calc(${(x.lane || 0) / (x.n || 1) * 100}% + 2px);width:calc(${100 / (x.n || 1)}% - 6px);top:${(x.s - 7) * 48 + 1}px;height:${Math.max(22, x.dur * 48 - 2)}px"><b><span class="ds-ev-dot"></span>${esc(x.t)}</b><span>${tFmt(x.s)} – ${tFmt(x.s + x.dur)}</span></button>`;
  };
  const popPos = (s, ci, n) => `top:${Math.max(0, Math.min(260, (s - 7) * 48))}px;` + (n === 1 ? 'left:50%;transform:translateX(-50%)' : ci >= 4 ? 'right:calc(100% + 6px)' : 'left:calc(100% + 6px)');
  const evPop = (x, ci, n) => `<div class="ds-evpop" role="dialog" aria-label="${esc(x.t)}" data-cal="${x.cal}" data-anim="pop" data-key="evpop-${x.id}" style="${popPos(x.s, ci, n)}"><div style="display:flex;align-items:flex-start;gap:var(--space-2-5)"><span class="ds-evpop__sw"></span><span class="ds-row__body"><span class="font-semibold" style="font-size:var(--text-md);line-height:var(--line-height-md)">${esc(x.t)}</span><span class="ds-meta">${esc(fmtL(addD(x.off)) + ' · ' + tFmt(x.s) + ' – ' + tFmt(x.s + x.dur))}</span></span>${ui.iconBtn({ ic: 'x', aria: 'Close event', act: 'close-ev' })}</div>
    ${[['users', x.who], ['calendar-blank', CALS[x.cal]], ...(x.n && typeof x.n === 'string' ? [['note', x.n]] : []), ['note-pencil', 'Editing not in this proposal yet']].map(([ic, v]) => `<div class="ds-evpop__row">${icon(ic)}<span${ic === 'note-pencil' ? ' class="ds-meta"' : ''}>${esc(v)}</span></div>`).join('')}
    ${x.cid ? `<div>${ui.btn({ label: 'Open contact', size: 'sm', link: href('contact', 'id=' + x.cid) })}</div>` : ''}</div>`;
  const draftCard = (ci, n) => { const d = st.draft; return `<div class="ds-draft" role="dialog" aria-label="New event" data-anim="pop" data-key="draft" style="${popPos(d.s, ci, n)}"><div style="padding:var(--space-3-5) var(--space-3-5) 0 var(--space-4);display:flex;flex-direction:column;gap:var(--space-1-5)"><div style="display:flex;align-items:center;gap:var(--space-2)" data-cal="${d.cal}"><span class="ds-evpop__sw" style="margin:0"></span><span class="ds-grow ds-meta font-semibold">New event</span>${ui.iconBtn({ ic: 'x', aria: 'Discard event', act: 'discard' })}</div>
      <input id="draft-title" class="ds-title-input" data-size="sm" aria-label="Event title" placeholder="Add a title" value="${esc(d.t)}" data-input="draftT" data-enter="save-draft" autocomplete="off"></div>
    <div class="ds-form-grid" style="padding:var(--space-3-5) var(--space-4) var(--space-4)">${icon('clock')}<div class="ds-stack" data-gap="2"><span class="ds-stack" style="gap:0"><span class="font-medium">${esc(addD(d.off).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }))}</span><span class="ds-meta">${tFmt(d.s)} – ${tFmt(d.s + d.dur)}</span></span>${ui.segmented(DURS.map(([v, l]) => [String(v), l]), String(d.dur), 'draft-dur', 'Length', 'sm')}</div>
      ${icon('calendar-blank')}<div style="display:flex;align-items:center;gap:var(--space-2-5)"><div role="group" aria-label="Calendar" style="display:flex;gap:var(--space-2)">${Object.entries(CALS).map(([k, l]) => `<button type="button" class="ds-swatch" data-cal="${k}" aria-label="${l}" aria-pressed="${d.cal === k}" data-tip="${l}" data-act="draft-cal" data-arg="${k}"></button>`).join('')}</div><span class="ds-ellipsis" style="color:var(--fg-secondary)">${esc(CALS[d.cal])}</span></div>
      ${icon('users')}<span class="select"><select id="draft-with" class="field__control" aria-label="With" data-change="draftCid"><option value="">Add a contact</option>${D.C.map(c => `<option value="${c.id}"${d.cid === c.id ? ' selected' : ''}>${esc(c.name)}</option>`).join('')}</select></span></div>
    <div class="ds-draft__foot">${ui.btn({ label: 'More options', variant: 'outline', act: 'more-options' })}<span class="ds-grow"></span>${ui.btn({ label: 'Save', act: 'save-draft' })}</div></div>`; };
  const timed = () => {
    const cs = cols(), evSel = findEv(st.ev), tpl = `grid-template-columns:3.25rem repeat(${cs.length},minmax(0,1fr))`;
    return `<div class="ds-calgrid"><div class="ds-calgrid__head" style="${tpl}"><span class="ds-calgrid__tz">EDT</span>${cs.map(o => { const d = addD(o), wkend = d.getDay() % 6 === 0; return `<button type="button" class="ds-calcol-h"${o === 0 ? ' data-today' : ''}${wkend ? ' data-weekend' : ''} data-act="goto-day" data-arg="${o}" aria-label="${esc(fmtL(d))}"><span>${d.toLocaleDateString('en-US', { weekday: 'short' })}</span><span>${d.getDate()}</span></button>`; }).join('')}</div>
      <div class="ds-calgrid__scroll" data-keep-scroll="cal-body"><div class="ds-calgrid__body" style="${tpl}"><div class="ds-calhours">${[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map((x, i) => `<span>${i ? tFmt(x).replace(':00', '') : ''}</span>`).join('')}</div>
        ${cs.map((o, ci) => { const d = addD(o), wkend = d.getDay() % 6 === 0; return `<div class="ds-calcol" role="button" tabindex="0" aria-label="Add an event on ${esc(fmtL(d))}" title="Click an empty slot to add an event"${wkend ? ' data-weekend' : ''} data-act="slot" data-arg="${o}" data-self data-enter-slot="${o}">${evOn(o).map(x => evBtn(x)).join('')}${o === 0 ? `<span class="ds-now" aria-hidden="true" style="top:${3.5 * 48}px"></span>` : ''}${evSel && evSel.off === o ? evPop(evSel, ci, cs.length) : ''}${st.draft && st.draft.off === o ? draftCard(ci, cs.length) : ''}</div>`; }).join('')}</div></div></div>`;
  };
  const month = () => {
    const mOff = (sel().getFullYear() - 2026) * 12 + sel().getMonth() - 8, first = new Date(2026, 8 + mOff, 1), lead = (first.getDay() + 6) % 7, days = new Date(2026, 9 + mOff, 0).getDate(), cells = Math.ceil((lead + days) / 7) * 7;
    return `<div class="ds-month">${['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(x => `<span class="ds-month__dow">${x}</span>`).join('')}${[...Array(cells)].map((_, i) => { const d = new Date(2026, 8 + mOff, 1 - lead + i), o = dOff(d), evs = evOn(o); return `<div class="ds-month__cell"${d.getMonth() !== first.getMonth() ? ' data-out' : ''}><button type="button" class="ds-month__n"${o === 0 ? ' data-today' : ''} aria-label="${esc(fmtL(d))}" data-act="goto-day" data-arg="${o}">${d.getDate()}</button>${evs.slice(0, 2).map(x => evBtn(x, true)).join('')}${evs.length > 2 ? `<button type="button" class="ds-month__more" data-act="goto-day" data-arg="${o}">+${evs.length - 2} more</button>` : ''}</div>`; }).join('')}</div>`;
  };
  const dialog = () => {
    const f = st.dlg; if (!f) return '';
    const day = Number(f.off), s = Number(f.s), dur = Number(f.dur), dayEvs = evOn(day).filter(x => !x.draft), clash = dayEvs.find(x => s < x.s + x.dur && s + dur > x.s);
    const dayOpts = [...new Set([...cols(), day])].map(o => `<option value="${o}"${o === day ? ' selected' : ''}>${esc(addD(o).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }))}</option>`).join('');
    const timeOpts = [...Array(24)].map((_, i) => 7 + i / 2).map(x => `<option value="${x}"${x === s ? ' selected' : ''}>${tFmt(x)}</option>`).join('');
    const mini = (x, mine) => `<span class="ds-daypreview__ev" data-cal="${x.cal}"${mine ? ' data-new' : ''} style="top:${(x.s - 7) * 26 + 1}px;height:${Math.max(20, x.dur * 26 - 2)}px;background:${mine ? 'var(--ev-fg)' : 'var(--ev-bg)'};color:${mine ? 'var(--bg)' : 'var(--ev-fg)'}"><span class="ds-ellipsis">${esc(x.t)}</span></span>`;
    return `<div class="ds-overlay" data-act="close-dialog" data-self style="padding-top:max(var(--space-6),min(6rem,8vh))"><div class="dialog ds-dialog-wide" role="dialog" aria-modal="true" aria-labelledby="newev-title" style="display:block;position:static;margin:0" data-anim="pop" data-key="newev"><div class="ds-newev">
      <div class="ds-newev__form"><div style="display:flex;align-items:center;gap:var(--space-2)"><h2 id="newev-title" class="ds-grow ds-meta font-semibold">New event</h2>${ui.iconBtn({ ic: 'x', aria: 'Close', act: 'close-dialog' })}</div>
        <input id="dlg-title" class="ds-title-input" aria-label="Title" placeholder="Add a title" value="${esc(f.t)}" data-input="dlgT" data-enter="save-dialog" autocomplete="off">
        <div class="ds-form-grid">${icon('clock')}<div class="ds-stack" data-gap="3" style="gap:var(--space-2-5)"><div style="display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:var(--space-2-5)"><div class="field"><label class="field__label" for="dlg-day">Day</label><span class="select"><select id="dlg-day" class="field__control" data-size="lg" data-change="dlgOff">${dayOpts}</select></span></div><div class="field"><label class="field__label" for="dlg-start">Starts</label><span class="select"><select id="dlg-start" class="field__control" data-size="lg" data-change="dlgS">${timeOpts}</select></span></div></div>
          <div class="ds-toolbar" style="gap:var(--space-1-5)">${DURS.map(([v, l]) => `<button type="button" class="ds-pill-btn" aria-pressed="${dur === v}" data-act="dlg-dur" data-arg="${v}">${l}</button>`).join('')}</div>${clash ? `<span class="ds-clash" role="alert">${icon('warning')}Overlaps ${esc(clash.t)} (${tFmt(clash.s)})</span>` : ''}</div>
          ${icon('calendar-blank')}<div class="ds-stack" data-gap="2" style="gap:var(--space-1-5)"><span class="field__label">Calendar</span><div class="ds-toolbar" style="gap:var(--space-1-5)">${Object.entries(CALS).map(([k, l]) => `<button type="button" class="ds-pill-btn" data-cal="${k}" aria-pressed="${f.cal === k}" data-act="dlg-cal" data-arg="${k}" style="${f.cal === k ? 'background:var(--ev-bg);border-color:var(--ev-fg);color:var(--ev-fg)' : ''}"><span class="ds-ev-dot" style="margin-right:var(--space-1-5)"></span>${l}</button>`).join('')}</div></div>
          ${icon('users')}<div class="field"><label class="field__label" for="dlg-with">With</label><span class="select"><select id="dlg-with" class="field__control" data-size="lg" data-change="dlgCid"><option value="">No contact</option>${D.C.map(c => `<option value="${c.id}"${f.cid === c.id ? ' selected' : ''}>${esc(c.name)}</option>`).join('')}</select></span></div>
          ${icon('note')}<div class="field"><label class="field__label" for="dlg-notes">Notes</label><textarea id="dlg-notes" class="field__control" rows="3" placeholder="Agenda, address, prep" data-input="dlgN">${esc(f.n)}</textarea></div></div>
        <div class="dialog__actions" style="margin-top:0">${ui.btn({ label: 'Cancel', variant: 'outline', size: 'lg', act: 'close-dialog' })}${ui.btn({ label: 'Save event', size: 'lg', act: 'save-dialog' })}</div></div>
      <div class="ds-newev__side"><div class="ds-stack" style="gap:var(--space-0-5);padding-left:var(--space-1)"><span class="font-semibold" style="font-size:var(--text-md);line-height:var(--line-height-sm)">${esc(fmtL(addD(day)))}</span><span class="ds-meta">${dayEvs.length ? dayEvs.length + (dayEvs.length === 1 ? ' event' : ' events') + ' that day' : 'Nothing else booked'}</span></div>
        <div class="ds-daypreview">${[7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18].map(x => `<span class="ds-daypreview__h" style="top:${(x - 7) * 26}px">${tFmt(x).replace(':00', '')}</span>`).join('')}${dayEvs.map(x => mini(x)).join('')}${mini({ s, dur, cal: f.cal, t: f.t.trim() || 'New event' }, true)}</div>
        <span class="ds-meta" style="padding-left:var(--space-1)">${tFmt(s)} – ${tFmt(s + dur)}</span></div>
    </div></div></div>`;
  };
  const openDialog = f => { st.dlg = f; st.draft = null; st.ev = null; DS.render(); setTimeout(() => { const el = document.getElementById('dlg-title'); if (el) el.focus(); }, 30); };
  const freeSlot = o => { const evs = evOn(o).filter(x => !x.draft); let s = o === 0 ? 10.5 : 9; while (s < 18.5 && evs.some(x => s < x.s + x.dur && s + 1 > x.s)) s += 0.5; return s; };
  const saveDraft = () => { const d = st.draft; if (!d) return; S.calNew = [...S.calNew, { t: d.t.trim() || 'New event', off: d.off, s: d.s, dur: d.dur, cal: d.cal, cid: d.cid || null }]; DS.save(); st.draft = null; DS.render(); DS.toast('Event added'); };

  DS.define({
    id: 'calendar', nav: 'dashboard', brain: 'min',
    crumbs: () => [{ l: 'Dashboard', page: 'attack-plan' }, { l: 'Calendar' }],
    scope: () => 'Calendar',
    render: () => `<div class="ds-page">${ui.pageHead('Dashboard', ui.tabs(D.dashboardTabs, 'calendar', 'Dashboard'))}${ui.nudge(D.nudges.calendar)}<div class="ds-cal">${aside()}<div class="ds-stack" data-gap="3">${head()}<div data-anim="slide" data-key="cal-${st.view}-${st.view === 'month' ? sel().getMonth() : st.view === 'week' ? wkStart() : st.off}" style="--dir:${st.dir || 1}">${st.view === 'month' ? month() : timed()}</div></div></div></div>`,
    overlays: dialog,
    after: () => { if (st.focusDraft) { st.focusDraft = false; const el = document.getElementById('draft-title'); if (el) el.focus(); } const sc = document.querySelector('[data-keep-scroll="cal-body"]'); if (sc && !st.scrolled) { sc.scrollTop = 96; st.scrolled = true; } },
    acts: {
      view: (el, k) => { st.view = k; st.ev = null; DS.render(); },
      today: () => { st.dir = st.off > 0 ? -1 : 1; st.off = 0; st.m = null; st.ev = null; DS.render(); },
      prev: () => { st.dir = -1; st.off = st.view === 'month' ? dOff(new Date(sel().getFullYear(), sel().getMonth() - 1, 1)) : st.off - (st.view === 'week' ? 7 : 1); st.m = null; st.ev = null; DS.render(); },
      next: () => { st.dir = 1; st.off = st.view === 'month' ? dOff(new Date(sel().getFullYear(), sel().getMonth() + 1, 1)) : st.off + (st.view === 'week' ? 7 : 1); st.m = null; st.ev = null; DS.render(); },
      'mini-m': (el, m) => { st.m = Number(m); DS.render(); },
      goto: (el, o) => { st.dir = Number(o) < st.off ? -1 : 1; st.off = Number(o); st.m = null; st.ev = null; DS.render(); },
      'goto-day': (el, o) => { st.dir = Number(o) < st.off ? -1 : 1; st.off = Number(o); st.view = 'day'; st.ev = null; DS.render(); },
      'cal-toggle': (el, k) => { st.hide[k] = !st.hide[k]; DS.render(); },
      ev: (el, id, ev) => { ev.stopPropagation(); if (id === 'draft') return; st.ev = st.ev === id ? null : id; st.draft = null; DS.render(); },
      'close-ev': () => { st.ev = null; DS.render(); },
      slot: (el, o, ev) => { if (st.ev) { st.ev = null; DS.render(); return; } const y = ev.offsetY, dur = (st.draft && st.draft.dur) || 1, s = Math.min(19 - dur, Math.max(7, 7 + Math.floor(y / 24) / 2)); st.draft = { t: (st.draft && st.draft.t) || '', cal: (st.draft && st.draft.cal) || 'mtg', cid: (st.draft && st.draft.cid) || '', dur, off: Number(o), s }; st.focusDraft = true; DS.render(); },
      discard: () => { st.draft = null; DS.render(); },
      'draft-dur': (el, v) => { st.draft.dur = Number(v); st.draft.s = Math.min(st.draft.s, 19 - st.draft.dur); DS.render(); },
      'draft-cal': (el, k) => { st.draft.cal = k; DS.render(); },
      'save-draft': saveDraft,
      'more-options': () => { const d = st.draft; openDialog({ t: d.t, off: String(d.off), s: String(d.s), dur: String(d.dur), cal: d.cal, cid: d.cid, n: '' }); },
      'new-event': () => { const o = st.view === 'day' ? st.off : Math.max(wkStart(), Math.min(wkStart() + 6, 0)); openDialog({ t: '', off: String(o), s: String(freeSlot(o)), dur: '1', cal: 'mtg', cid: '', n: '' }); },
      'close-dialog': () => { st.dlg = null; DS.render(); },
      'dlg-dur': (el, v) => { st.dlg.dur = v; DS.render(); },
      'dlg-cal': (el, k) => { st.dlg.cal = k; DS.render(); },
      'save-dialog': () => { const f = st.dlg; if (!f) return; const ev = { t: f.t.trim() || 'New event', off: Number(f.off), s: Number(f.s), dur: Number(f.dur), cal: f.cal, cid: f.cid || null, n: (f.n || '').trim() }; S.calNew = [...S.calNew, ev]; DS.save(); st.dlg = null; if (st.view !== 'month') st.off = ev.off; DS.render(); DS.toast('Event added'); },
    },
    inputs: {
      draftT: v => { st.draft.t = v; }, draftCid: v => { st.draft.cid = v; },
      dlgT: v => { st.dlg.t = v; const n = document.querySelector('.ds-daypreview__ev[data-new] span'); if (n) n.textContent = v.trim() || 'New event'; }, dlgN: v => { st.dlg.n = v; },
      dlgOff: v => { st.dlg.off = v; DS.render(); }, dlgS: v => { st.dlg.s = v; DS.render(); }, dlgCid: v => { st.dlg.cid = v; },
    },
    onEscape: () => { if (st.dlg) { st.dlg = null; DS.render(); return true; } if (st.draft) { st.draft = null; DS.render(); return true; } if (st.ev) { st.ev = null; DS.render(); return true; } return false; },
  });
  // Keyboard: Enter or Space on a day column drops a draft at the first free slot.
  DS.screen.onKey = e => { const t = e.target; if (!t || !t.dataset || t.dataset.enterSlot === undefined || (e.key !== 'Enter' && e.key !== ' ')) return false; e.preventDefault(); const o = Number(t.dataset.enterSlot); st.draft = { t: '', cal: 'mtg', cid: '', dur: 1, off: o, s: freeSlot(o) }; st.ev = null; st.focusDraft = true; DS.render(); return true; };
})();
