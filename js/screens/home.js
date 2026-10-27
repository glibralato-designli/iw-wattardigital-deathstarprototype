/* Dashboard › Overview (3.0 · 2.1): the pulse strip, metric tabs, Up next and meetings. The day starts on Today; this is the command centre. */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const st = { tile: Math.max(0, Math.min(10, Number(params.get('tile')) || 0)), planOpen: params.get('plan') !== 'min' };
  const showUpNext = params.get('upnext') !== '0';

  const pulse = () => {
    const S = DS.S(), done = DS.callsDone(), fu = S.tasks.filter(t => !t.done && t.g === 'Follow up').length;
    const m = DS.meetingsWeek();
    // Meetings this week leads: the one number the rest exists to move. Calls, conversations and follow-ups are its drivers.
    const cells = [['Meetings this week', 'handshake', m, 'with owners', 0, 'calendar', '+' + (m - 1) + ' vs. last week (1)', 'up'], ['Calls today', 'phone', done, 'of 40', done / 40, 'attack-plan', '+2 vs. yesterday', 'up'], ['Conversations', 'chat-text', 2 + S.convos, 'of 5 goal', (2 + S.convos) / 5, 'conversations', 'On pace for goal', ''], ['Follow-ups due', 'clock', fu, 'today', 0, 'attack-plan', '2 overdue', 'warn']];
    return `<section class="ds-pulse" aria-label="Pulse">${cells.map(([l, ic, v, of, r, page, d, tone]) => `<a class="ds-pulse__cell"${page === 'calendar' ? ' data-lead' : ''} href="${href(page)}"><span class="ds-pulse__label"><span class="ds-tile-icon" data-tone="tint">${icon(ic)}</span><span class="ds-ellipsis">${esc(l)}</span></span><span class="ds-pulse__value"><b data-count="${page === 'conversations' ? 'convos' : l === 'Calls today' ? 'calls' : page === 'calendar' ? 'meetings' : 'pulse-' + esc(l)}">${esc(v)}</b><span class="ds-meta">${esc(of)}</span></span>${r ? ui.progress(r, l, { thin: true, fill: true, key: l === 'Calls today' ? 'calls' : l === 'Conversations' ? 'convos' : 'pulse-' + l }) : '<span class="ds-progress" data-size="thin" data-fill aria-hidden="true"></span>'}<span class="ds-delta"${tone ? ` data-tone="${tone}"` : ''}>${icon(tone === 'up' ? 'arrow-up-right' : tone === 'warn' ? 'warning-circle' : 'check')}${esc(d)}</span></a>`).join('')}</section>`;
  };

  const metrics = () => {
    // Queues pushed from a list in the Database add to Outreach's "Queues ready".
    const qs = DS.queues(), qn = qs.reduce((a, q) => a + q.n, 0);
    const tiles = D.tiles.map((t, i) => i === 0 ? { ...t, num: DS.callsDone() + ' / 40', vals: t.vals.map((v, j) => j === t.vals.length - 1 ? DS.callsDone() : v) } : t.name === 'Outreach' && qs.length ? { ...t, num: String(3 + qs.length), head: DS.loc(1480 + qn), headL: 'in ' + (3 + qs.length) + ' ready queues · ' + qs.length + ' pushed today', vals: t.vals.map((v, j) => j === t.vals.length - 1 ? v + qn : v) } : t);
    const d = tiles[st.tile];
    return `<section class="ds-metrics" aria-label="Metrics">
      <div class="ds-metrics__strip" data-overflow-host><div class="ds-metrics__tabs" role="tablist" aria-label="Areas" id="metric-tabs" data-keep-scroll="metric-tabs" data-overflow-x>${tiles.map((t, i) => `<button type="button" class="ds-mtab" role="tab" aria-selected="${i === st.tile}" tabindex="${i === st.tile ? 0 : -1}" data-act="tile" data-arg="${i}"><span class="ds-mtab__name">${icon(t.icon)}${esc(t.name)}</span><span class="ds-meta">${esc(t.label)}</span><span class="ds-mtab__num"${i === 0 ? ' data-count="calls"' : ''}>${esc(t.num)}</span></button>`).join('')}</div>
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
    const right = `<section class="ds-card ds-meetings" aria-label="Today’s meetings"><div class="ds-card__head"><h2 class="ds-grow">Today’s meetings</h2><a href="${href('calendar')}">Open calendar</a></div>${D.meetings.map(([t, n, w]) => `<div class="ds-row" data-dense><span class="ds-time">${esc(t)}</span><span class="ds-row__body"><span class="ds-row__title">${esc(n)}</span><span class="ds-row__sub">${esc(w)}</span></span></div>`).join('')}</section>`;
    return `<div class="ds-two">${left}${right}</div>`;
  };

  DS.define({
    id: 'home', nav: 'dashboard', brain: 'min',
    crumbs: () => [{ l: 'Dashboard', page: 'home' }, { l: 'Overview' }],
    scope: () => 'Dashboard',
    render: () => `<div class="ds-page">${ui.pageHead('Dashboard', ui.tabs(D.dashboardTabs, 'home', 'Dashboard'))}${ui.nudge(D.nudges.home)}${pulse()}${metrics()}${showUpNext ? upNext() : ''}</div>`,
    acts: {
      tile: (el, i) => { st.tile = +i; DS.render(); },
      'scroll-tiles': () => { const el = document.getElementById('metric-tabs'); if (!el) return; const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4; el.scrollLeft = end ? 0 : el.scrollLeft + 400; },
    },
  });
})();
