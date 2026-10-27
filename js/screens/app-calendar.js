/* App 08 Calendar: a week strip over the day's agenda, a week list and a month grid; + opens New event in a sheet. */
(() => {
  const { D, ui, esc, icon, href, params, fmtL, fmtS, tFmt } = DS;
  const addD = D.addD, CALS = D.calendars;
  const S = DS.S();
  const st = { view: ['day', 'week', 'month'].includes(params.get('view')) ? params.get('view') : 'day', off: 0, ev: params.get('event') || null, dlg: null };
  const blank = () => ({ t: '', off: 0, s: 10.5, dur: 1, cal: 'mtg', cid: '' });
  if (params.get('dialog') === 'new') { st.dlg = params.get('clash') ? { t: 'Owner call · Feld', off: 0, s: 12, dur: 1, cal: 'call', cid: 'feld' } : blank(); DS.V.sheet = 'new'; }
  if (params.get('added') === '1') S.calNew = [...S.calNew, { t: 'Call · Aaron Feld', off: 0, s: 10.5, dur: 1, cal: 'call', cid: 'feld', n: '' }];
  if (st.ev) DS.V.sheet = 'event';

  const evOn = off => {
    const d = addD(off), dow = (d.getDay() + 6) % 7, wk = Math.floor((off - dow + 2) / 7);
    const base = dow > 4 ? [] : D.events.map((e, j) => ({ e, j })).filter(({ e, j }) => e[0] === dow && (wk === 0 || (j + wk) % 4 !== 0)).map(({ e, j }) => ({ id: off + '-' + j, s: e[1], dur: e[2], cal: e[3], t: e[4], who: e[5], cid: e[6] || null, off }));
    const mine = S.calNew.map((x, k) => ({ ...x, id: x.off + '-u' + k, who: x.cid ? D.cById[x.cid].name : 'Just you' })).filter(x => x.off === off);
    return [...base, ...mine].sort((a, b) => a.s - b.s);
  };
  const findEv = id => { if (!id) return null; const off = Number(String(id).split('-')[0]); return evOn(off).find(x => x.id === id) || null; };
  const wkStart = () => st.off - ((addD(st.off).getDay() + 6) % 7);

  const head = () => ({ title: 'Calendar', large: true, back: ['More', 'more'], actions: st.off !== 0 ? `<button type="button" class="button" data-variant="ghost" data-size="sm" data-act="today">Today</button>` : '' });
  const strip = () => `<div class="ds-daystrip" role="group" aria-label="Pick a day">${[0, 1, 2, 3, 4, 5, 6].map(i => { const o = wkStart() + i, d = addD(o), wkend = i > 4;
    return `<button type="button" class="ds-daystrip__d" aria-pressed="${o === st.off}" aria-label="${esc(fmtL(d))}"${o === 0 ? ' data-today' : ''}${wkend ? ' data-weekend' : ''}${evOn(o).length ? ' data-dots' : ''} data-act="pick" data-arg="${o}"><span>${d.toLocaleDateString('en-US', { weekday: 'short' })}</span><b>${d.getDate()}</b></button>`; }).join('')}</div>`;
  const evBtn = x => `<button type="button" class="ds-agenda__ev" data-cal="${x.cal}" data-act="ev" data-arg="${x.id}"><b><span class="ds-ev-dot"></span>${esc(x.t)}</b><span>${tFmt(x.s)} – ${tFmt(x.s + x.dur)} · ${esc(x.who)}</span></button>`;
  const agenda = off => { const list = evOn(off); if (!list.length) return `<div class="ds-alist" style="padding:var(--space-4)">${ui.empty({ ic: 'calendar-blank', title: 'Nothing scheduled', text: 'A free day. Add an event with the + button.' })}</div>`;
    const now = 10.25; let shown = false;
    return `<div class="ds-agenda">${list.map(x => { const line = off === 0 && !shown && x.s > now ? (shown = true, `<div class="ds-agenda__now" aria-label="Now, 10:15 AM"><span>10:15</span></div>`) : '';
      return line + `<div class="ds-agenda__row"><span class="ds-agenda__t">${tFmt(x.s)}</span>${evBtn(x)}</div>`; }).join('')}</div>`; };
  const week = () => [0, 1, 2, 3, 4, 5, 6].map(i => { const o = wkStart() + i, list = evOn(o), d = addD(o);
    return `<section class="ds-asec" aria-label="${esc(fmtL(d))}"><div class="ds-ahead"><h2 style="font-size:var(--text-md)">${esc(fmtS(d))}${o === 0 ? ' · Today' : ''}</h2><span class="ds-meta">${list.length || 'No'} ${list.length === 1 ? 'event' : 'events'}</span></div>${list.length ? `<div class="ds-stack" data-gap="2">${list.map(evBtn).join('')}</div>` : ''}</section>`; }).join('');
  const month = () => {
    const sel = addD(st.off), first = new Date(sel.getFullYear(), sel.getMonth(), 1), lead = (first.getDay() + 6) % 7, days = new Date(sel.getFullYear(), sel.getMonth() + 1, 0).getDate(), cells = Math.ceil((lead + days) / 7) * 7;
    const dOff = d => Math.round((d - D.TODAY) / 864e5);
    return `<div class="ds-acard" style="padding:var(--space-3)"><div class="ds-ahead" style="padding:0 var(--space-1) var(--space-2)"><h2 style="font-size:var(--text-md)">${first.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2></div><div class="ds-minical">${['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map(x => `<span class="ds-minical__dow">${x}</span>`).join('')}${[...Array(cells)].map((_, i) => { const d = new Date(first.getFullYear(), first.getMonth(), 1 - lead + i), o = dOff(d);
      return `<button type="button" class="ds-minical__d" aria-label="${esc(fmtL(d))}" aria-pressed="${o === st.off}"${d.getMonth() !== first.getMonth() ? ' data-out' : ''}${o === 0 ? ' data-today' : ''} data-act="pick" data-arg="${o}">${d.getDate()}</button>`; }).join('')}</div></div>
      <section class="ds-asec"><div class="ds-ahead"><h2 style="font-size:var(--text-md)">${esc(fmtS(sel))}</h2></div>${agenda(st.off)}</section>`;
  };

  const eventSheet = () => { const x = findEv(st.ev); if (!x) return '';
    return ui.sheet({ key: 'event-' + x.id, title: x.t, body: `<div class="ds-stack" data-gap="3" style="padding-top:var(--space-1)"><span class="ds-chip" data-cal="${x.cal}" style="align-self:flex-start;background:var(--ev-bg);color:var(--ev-fg)"><span class="ds-ev-dot"></span>${esc(CALS[x.cal])}</span>
      ${ui.kv([['When', fmtS(addD(x.off)) + ' · ' + tFmt(x.s) + ' – ' + tFmt(x.s + x.dur)], ['With', x.who]], { cols: 1 })}</div>`,
      foot: x.cid ? ui.btn({ label: 'Open ' + D.cById[x.cid].name.split(' ')[0] + '’s record', variant: 'outline', link: href('contact', 'id=' + x.cid) }) + ui.btn({ label: 'Call', ic: 'phone', link: href('contact', 'id=' + x.cid + '&act=call') }) : ui.btn({ label: 'Close', variant: 'outline', act: 'close-sheet' }) }); };
  const clashOf = d => evOn(Number(d.off)).find(x => d.s < x.s + x.dur && x.s < d.s + d.dur);
  const newSheet = () => { const d = st.dlg; if (!d) return ''; const clash = clashOf(d);
    const times = [9, 9.5, 10, 10.5, 11, 11.5, 12, 13, 14, 15, 16, 17];
    return ui.sheet({ key: 'new', title: 'New event', size: 'full', body: `<div class="ds-stack" data-gap="4" style="padding-top:var(--space-1)">
      <label class="field"><span class="field__label">Title</span><input class="field__control" id="ev-title" placeholder="Add a title" value="${esc(d.t)}" data-input="t" autocomplete="off"></label>
      <div class="field"><span class="field__label">Calendar</span><div class="ds-achips" style="margin:0;padding:0;flex-wrap:wrap">${Object.entries(CALS).map(([k, l]) => `<button type="button" class="ds-fchip" aria-pressed="${d.cal === k}" data-act="dcal" data-arg="${k}">${esc(l)}</button>`).join('')}</div></div>
      <div class="field"><span class="field__label">Day</span><div class="ds-achips" style="margin:0;padding:0;flex-wrap:wrap">${[[0, 'Today'], [1, 'Tomorrow'], [2, fmtS(addD(2))]].map(([o, l]) => `<button type="button" class="ds-fchip" aria-pressed="${Number(d.off) === o}" data-act="doff" data-arg="${o}">${esc(l)}</button>`).join('')}</div></div>
      <div class="ds-atiles"><label class="field"><span class="field__label">Starts</span><span class="select"><select class="field__control" data-change="s">${times.map(t => `<option value="${t}"${t === Number(d.s) ? ' selected' : ''}>${tFmt(t)}</option>`).join('')}</select></span></label><label class="field"><span class="field__label">Length</span><span class="select"><select class="field__control" data-change="dur">${[[0.5, '30 min'], [1, '1 hr'], [1.5, '1.5 hr'], [2, '2 hr']].map(([v, l]) => `<option value="${v}"${v === Number(d.dur) ? ' selected' : ''}>${l}</option>`).join('')}</select></span></label></div>
      ${clash ? `<div class="alert" data-status="warning" role="alert">${icon('warning-diamond')}<span>Overlaps ${esc(clash.t)} (${tFmt(clash.s)} – ${tFmt(clash.s + clash.dur)}). Save anyway, or pick another time.</span></div>` : ''}
      <label class="field"><span class="field__label">With</span><span class="select"><select class="field__control" data-change="cid"><option value="">Just you</option>${D.C.filter(c => c.status !== 'Do not contact').map(c => `<option value="${c.id}"${c.id === d.cid ? ' selected' : ''}>${esc(c.name)}</option>`).join('')}</select></span></label></div>`,
      foot: ui.btn({ label: 'Cancel', variant: 'outline', act: 'close-sheet' }) + ui.btn({ label: clash ? 'Save anyway' : 'Save event', act: 'save' }) }); };

  DS.define({
    id: 'calendar', nav: 'dashboard', tab: 'more',
    head, scope: () => 'Calendar',
    render: () => `<div class="ds-apage">${ui.large('Calendar', st.view === 'day' ? fmtL(addD(st.off)) + (st.off === 0 ? ' · Today' : '') : addD(st.off).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }))}${ui.teach()}
      ${ui.segmented([['day', 'Day'], ['week', 'Week'], ['month', 'Month']], st.view, 'view', 'View').replace('class="segmented"', 'class="segmented" data-fill')}${st.view !== 'month' ? strip() : ''}${st.off === 0 && st.view === 'day' ? ui.nudge(D.nudges.calendar) : ''}
      <div data-anim="fade" data-key="cal-${st.view}-${st.off}" class="ds-stack" style="gap:var(--space-5)">${st.view === 'day' ? agenda(st.off) : st.view === 'week' ? week() : month()}</div></div>`,
    fab: () => `<button type="button" class="ds-fab" aria-label="New event" data-act="new">${icon('plus')}</button>`,
    overlays: () => DS.V.sheet === 'new' ? newSheet() : DS.V.sheet === 'event' ? eventSheet() : '',
    onSheetClose: () => { st.ev = null; st.dlg = null; },
    acts: {
      view: (el, v) => { st.view = v; DS.render(); },
      pick: (el, o) => { st.off = Number(o); if (st.view === 'week') st.view = 'day'; DS.render(); },
      today: () => { st.off = 0; DS.render(); },
      ev: (el, id) => { st.ev = id; DS.V.sheet = 'event'; DS.render(); },
      new: () => { st.dlg = { ...blank(), off: st.off >= 0 && st.off <= 2 ? st.off : 0 }; DS.V.sheet = 'new'; DS.render(); },
      dcal: (el, k) => { st.dlg.cal = k; DS.render(); },
      doff: (el, o) => { st.dlg.off = Number(o); DS.render(); },
      save: () => { const d = st.dlg; DS.store(Sx => { Sx.calNew = [...Sx.calNew, { t: d.t.trim() || 'New event', off: Number(d.off), s: Number(d.s), dur: Number(d.dur), cal: d.cal, cid: d.cid || null }]; }); st.off = Number(d.off); st.view = 'day'; st.dlg = null; DS.V.sheet = null; DS.render(); DS.toast('Event added'); },
    },
    inputs: { t: v => { st.dlg.t = v; }, s: v => { st.dlg.s = Number(v); DS.render(); }, dur: v => { st.dlg.dur = Number(v); DS.render(); }, cid: v => { st.dlg.cid = v; } },
  });
})();
