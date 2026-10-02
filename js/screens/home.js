/* 01 Home: the overview. Greeting, today's Attack Plan, the pulse strip, metric tabs, Up next and meetings. */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const st = { tile: Math.max(0, Math.min(10, Number(params.get('tile')) || 0)), planOpen: params.get('plan') !== 'min' };
  const layout = params.get('layout') === 'classic' ? 'classic' : 'focused';
  const lead = params.get('lead') === 'upnext' ? 'upnext' : 'plan';
  const showUpNext = params.get('upnext') !== '0';

  const plan = () => {
    const done = DS.callsDone(), S = DS.S();
    const steps = [
      { done: true, t: 'Call Ruth Adler back', m: 'Done at 8:40 AM · Callback set for Friday', link: href('attack-plan') },
      { done: !!S.done.marchetti, t: 'Call Daniel Marchetti', m: '$9.4M loan due in June · Verified', link: href('contact', 'id=marchetti') },
      { done: false, t: 'Tour 41 Ludlow St at 9:30 AM', m: 'With Priya Venkataraman', link: href('calendar') },
    ];
    return `<section class="ds-card" aria-label="Today’s Attack Plan">
      <div class="ds-card__head"><div class="ds-card__title"><h2>Today’s Attack Plan</h2><span class="ds-meta">LES maturities · from the Dashboard</span></div>
        <span class="ds-meta-strong num"><span data-count="calls">${done}</span> of 40 calls</span>${ui.progress(done / 40, 'Calls today', { key: 'calls' })}
        <a href="${href('attack-plan')}">See more on Dashboard</a>
        ${ui.iconBtn({ ic: st.planOpen ? 'caret-up' : 'caret-down', aria: st.planOpen ? 'Minimize Attack Plan' : 'Expand Attack Plan', act: 'toggle-plan', expanded: st.planOpen })}</div>
      ${st.planOpen ? `<div data-anim="grow" data-key="plan-body"><div class="ds-plan__steps">${steps.map((s, i) => `<a class="ds-row" href="${s.link}"><span class="ds-check"${s.done ? ' data-on' : ''} data-tick="step-${i}|${s.done ? 'on' : 'off'}">${s.done ? icon('check') : ''}</span><span class="ds-row__body"><span class="ds-row__title">${esc(s.t)}</span><span class="ds-row__sub">${esc(s.m)}</span></span><span class="ds-row__end">${icon('caret-right')}</span></a>`).join('')}</div>
      <div class="ds-plan__actions">${ui.btn({ label: 'Open Attack Plan', ic: 'squares-four', link: href('attack-plan') })}${ui.btn({ label: 'Log a call', ic: 'phone', variant: 'outline', act: 'palette', arg: 'log' })}${ui.btn({ label: 'Build a list', ic: 'list-bullets', variant: 'outline', act: 'build-list' })}</div></div>` : ''}
    </section>`;
  };

  const pulse = () => {
    const S = DS.S(), done = DS.callsDone(), fu = S.tasks.filter(t => !t.done && t.g === 'Follow up').length;
    const cells = [['Calls today', 'phone', done, 'of 40', done / 40, 'attack-plan', '+2 vs. yesterday', 'up'], ['Conversations', 'chat-text', 2 + S.convos, 'of 5 goal', (2 + S.convos) / 5, 'conversations', 'On pace for goal', ''], ['Class A coverage', 'chart-pie-slice', '64%', 'called', 0.64, 'outreach-performance', '+4 pts this week', 'up'], ['Follow-ups due', 'clock', fu, 'today', 0, 'attack-plan', '2 overdue', 'warn']];
    return `<section class="ds-pulse" aria-label="Pulse">${cells.map(([l, ic, v, of, r, page, d, tone]) => `<a class="ds-pulse__cell" href="${href(page)}"><span class="ds-pulse__label"><span class="ds-tile-icon" data-tone="tint">${icon(ic)}</span><span class="ds-ellipsis">${esc(l)}</span></span><span class="ds-pulse__value"><b data-count="${page === 'conversations' ? 'convos' : l === 'Calls today' ? 'calls' : 'pulse-' + esc(l)}">${esc(v)}</b><span class="ds-meta">${esc(of)}</span></span>${r ? ui.progress(r, l, { thin: true, fill: true, key: l === 'Calls today' ? 'calls' : l === 'Conversations' ? 'convos' : 'pulse-' + l }) : '<span class="ds-progress" data-size="thin" data-fill aria-hidden="true"></span>'}<span class="ds-delta"${tone ? ` data-tone="${tone}"` : ''}>${icon(tone === 'up' ? 'arrow-up-right' : tone === 'warn' ? 'warning-circle' : 'check')}${esc(d)}</span></a>`).join('')}</section>`;
  };

  const metrics = () => {
    const tiles = D.tiles.map((t, i) => i === 0 ? { ...t, num: DS.callsDone() + ' / 40', vals: t.vals.map((v, j) => j === t.vals.length - 1 ? DS.callsDone() : v) } : t);
    const d = tiles[st.tile];
    return `<section class="ds-metrics" aria-label="Metrics">
      <div class="ds-metrics__strip"><div class="ds-metrics__tabs" role="tablist" aria-label="Areas" id="metric-tabs" data-keep-scroll="metric-tabs">${tiles.map((t, i) => `<button type="button" class="ds-mtab" role="tab" aria-selected="${i === st.tile}" tabindex="${i === st.tile ? 0 : -1}" data-act="tile" data-arg="${i}"><span class="ds-mtab__name">${icon(t.icon)}${esc(t.name)}</span><span class="ds-meta">${esc(t.label)}</span><span class="ds-mtab__num"${i === 0 ? ' data-count="calls"' : ''}>${esc(t.num)}</span></button>`).join('')}</div>
        <div class="ds-metrics__fade"><button type="button" aria-label="Scroll metrics" data-act="scroll-tiles">${icon('caret-right')}</button></div></div>
      <div class="ds-metrics__panel" role="tabpanel" aria-label="${esc(d.name)}">
        <div class="ds-metrics__head"><div class="ds-card__title"><h2>${esc(d.title)}</h2><span class="ds-meta">${esc(d.sub)}</span></div>
          <span class="ds-headline"><b>${esc(d.head)}</b><span class="ds-meta">${esc(d.headL)}</span></span>
          ${d.to ? ui.btn({ label: d.go, variant: 'outline', link: href(d.to), cls: 'ds-go' }) : `<button type="button" class="button" data-variant="outline" aria-disabled="true" data-tip="${DS.OFF}">${esc(d.go)}${icon('caret-right')}</button>`}</div>
        ${ui.bars(d.vals, d.labels, { max: d.max, goal: d.goal, fmt: d.fmt, flat: d.flat, zero: d.zero, aria: d.title, key: 'tile-' + st.tile })}
      </div>
    </section>`;
  };

  const upNext = () => {
    const items = [['phone', 'Call Daniel Marchetti', '$9.4M loan due in June · Verified', href('contact', 'id=marchetti')], ['calendar-blank', '9:30 AM · Tour, 41 Ludlow St', 'Priya Venkataraman', href('calendar')], ['phone', 'Call Aaron Feld', 'Inherited 27 Orchard St · Single source', href('contact', 'id=feld')]];
    const left = `<section class="ds-card" aria-label="Up next"><div class="ds-card__head"><h2 class="ds-grow">Up next</h2><a href="${href('attack-plan')}">View all</a></div>${items.map(([ic, t, m, l]) => `<a class="ds-row" data-dense href="${l}"><span class="ds-tile-icon">${icon(ic)}</span><span class="ds-row__body"><span class="ds-row__title">${esc(t)}</span><span class="ds-row__sub">${esc(m)}</span></span></a>`).join('')}</section>`;
    const right = layout === 'classic'
      ? `<section class="ds-card" aria-label="This week"><div class="ds-card__head"><h2 class="ds-grow">This week</h2><a href="${href('attack-plan', 'range=week')}">View all</a></div>${[['Mon', 'Calls · Sourcing', '14 dials'], ['Tue', 'Mail merge · Listings', '1 blast'], ['Wed', 'Calls · LES maturities', DS.callsDone() + ' of 40', 1], ['Thu', 'LinkedIn · Market info', 'Planned'], ['Fri', 'Constant Contact · Listings', 'Planned']].map(([d, f, n, today]) => `<div class="ds-weekrow"${today ? ' data-today' : ''}><span class="ds-meta-strong" style="width:2rem">${d}</span><span class="ds-grow ds-ellipsis">${esc(f)}</span><span class="ds-meta num">${esc(n)}</span></div>`).join('')}</section>`
      : `<section class="ds-card ds-meetings" aria-label="Today’s meetings"><div class="ds-card__head"><h2 class="ds-grow">Today’s meetings</h2><a href="${href('calendar')}">Open calendar</a></div>${D.meetings.map(([t, n, w]) => `<div class="ds-row" data-dense><span class="ds-time">${esc(t)}</span><span class="ds-row__body"><span class="ds-row__title">${esc(n)}</span><span class="ds-row__sub">${esc(w)}</span></span></div>`).join('')}</section>`;
    return `<div class="ds-two">${left}${right}</div>`;
  };

  DS.define({
    id: 'home', nav: 'home', brain: 'open',
    crumbs: () => [{ l: 'Home' }],
    scope: () => 'Home',
    render() {
      const S = DS.S(), classA = 22;
      const parts = [plan(), layout === 'focused' ? pulse() : '', metrics(), showUpNext ? upNext() : ''];
      if (lead === 'upnext' && showUpNext) { parts.splice(3, 1); parts.unshift(upNext()); }
      return `<div class="ds-page"><div class="ds-greeting"><h1>Good morning, Thomas</h1><span class="ds-lede">${classA} Class A owners haven’t had a call yet.</span></div>${parts.join('')}</div>`;
    },
    acts: {
      'toggle-plan': () => { const go = () => { st.planOpen = !st.planOpen; DS.render(); }; if (st.planOpen) DS.collapse(document.querySelector('[data-key="plan-body"]'), go); else go(); },
      tile: (el, i) => { st.tile = +i; DS.render(); },
      'scroll-tiles': () => { const el = document.getElementById('metric-tabs'); if (!el) return; const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4; el.scrollLeft = end ? 0 : el.scrollLeft + 400; },
      'build-list': () => { DS.V.draft = '/list '; DS.openBrain(); },
    },
  });
})();
