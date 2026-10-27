/* App More › Overview (3.0 · 2.1): the pulse, Brain's note, Up next, meetings and the week's calls. The day starts on Today. */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const st = { brainNote: params.get('note') !== '0' };

  // The account leads (as in Revolut) so the centred title has room; search and notifications trail.
  const head = () => {
    const search = ui.iconBtn({ ic: 'magnifying-glass', aria: 'Search contacts, properties, BBL', act: 'palette', arg: 'search' });
    const bell = `<span class="ds-icon-btn ds-abadge" role="button" tabindex="0" aria-disabled="true" aria-label="Notifications, 3 unread" data-tip="${DS.OFF}">${icon('bell')}<i>3</i></span>`;
    return { title: 'Overview', large: true, back: ['More', 'more'], actions: search + bell };
  };



  const pulse = () => {
    const S = DS.S(), done = DS.callsDone(), fu = S.tasks.filter(t => !t.done && t.g === 'Follow up').length;
    const m = DS.meetingsWeek();
    const cells = [['Meetings this week', 'handshake', m, 'with owners', 0, 'calendar', '+' + (m - 1) + ' vs. last week (1)', 'up', 'meetings'], ['Calls today', 'phone', done, 'of 40', done / 40, 'attack-plan', '+2 vs. yesterday', 'up', 'calls'], ['Conversations', 'chat-text', 2 + S.convos, 'of 5', (2 + S.convos) / 5, 'conversations', 'On pace for goal', '', 'convos'], ['Follow-ups due', 'clock', fu, 'today', 0, 'attack-plan', '2 overdue', 'warn', 'pulse-fu']];
    // Queues pushed from the Database's list builder count here, as on the web's Outreach tile.
    const qs = DS.queues(); cells.push(['Queues ready', 'list-bullets', 3 + qs.length, 'ready', 1, 'contacts', qs.length ? qs.length + ' pushed today · ' + DS.loc(qs.reduce((t, q) => t + q.n, 0)) + ' owners' : '1,480 owners queued', qs.length ? 'up' : '', 'pulse-q']);
    return `<section class="ds-atiles" aria-label="Pulse">${cells.map(([l, ic, v, of, r, page, d, tone, key]) => `<a class="ds-atile"${key === 'meetings' ? ' data-lead' : ''} href="${href(page)}"><span class="ds-atile__label">${icon(ic)}${esc(l)}</span><span class="ds-atile__value"><b data-count="${key}">${esc(v)}</b><span class="ds-meta">${esc(of)}</span></span>${ui.progress(r, l, { thin: true, fill: true, key })}<span class="ds-atile__foot"${tone ? ` data-tone="${tone}"` : ''}>${icon(tone === 'up' ? 'arrow-up-right' : tone === 'warn' ? 'warning-circle' : 'check')}${esc(d)}</span></a>`).join('')}</section>`;
  };

  // Brain's morning note: on the web it opens the Brain panel; in the app it's a card on Home.
  const brainNote = () => st.brainNote ? `<section class="ds-why" aria-label="From Brain" data-anim="grow" data-key="brain-note"><div class="ds-why__head">${icon('sparkle')}<h2>From Brain</h2><span class="ds-grow"></span><span class="ds-meta">8:02 AM</span></div><p>${esc(D.proactive.text)}</p><div class="ds-why__actions">${ui.btn({ label: 'Open record', size: 'sm', link: href('contact', 'id=marchetti') })}${ui.btn({ label: 'Not now', size: 'sm', variant: 'ghost', act: 'dismiss-note' })}</div></section>` : '';

  const week = () => {
    const t = D.tiles[0], vals = t.vals.map((v, j) => j === t.vals.length - 1 ? DS.callsDone() : v);
    return `<section class="ds-asec" aria-label="Calls this week"><div class="ds-ahead"><h2>Calls per day</h2><a href="${href('outreach-performance')}">Outreach</a></div>
      <div class="ds-acard" style="padding:var(--space-4)"><div class="ds-headline" style="margin-bottom:var(--space-3)"><b>${t.head}</b><span class="ds-meta">${esc(t.headL)} · goal 40 a day</span></div>${ui.bars(vals, t.labels, { goal: t.goal, aria: t.title, key: 'app-home-calls', zero: '0' })}</div></section>`;
  };

  const upNext = () => {
    const items = [['phone', 'Call Daniel Marchetti', '$9.4M loan due in June · Verified', href('contact', 'id=marchetti')], ['calendar-blank', '9:30 AM · Tour, 41 Ludlow St', 'Priya Venkataraman', href('calendar')], ['phone', 'Call Aaron Feld', 'Inherited 27 Orchard St · Single source', href('contact', 'id=feld')]];
    return `<section class="ds-asec" aria-label="Up next"><div class="ds-ahead"><h2>Up next</h2><a href="${href('attack-plan')}">View all</a></div><div class="ds-alist">${items.map(([ic, t, m, l]) => `<a class="ds-arow" data-lead href="${l}"><span class="ds-arow__lead">${icon(ic)}</span><span class="ds-arow__body"><span class="ds-arow__title">${esc(t)}</span><span class="ds-arow__sub">${esc(m)}</span></span><span class="ds-arow__end">${icon('caret-right')}</span></a>`).join('')}</div></section>`;
  };

  const meetings = () => `<section class="ds-asec" aria-label="Today’s meetings"><div class="ds-ahead"><h2>Today’s meetings</h2><a href="${href('calendar')}">Calendar</a></div><div class="ds-alist">${D.meetings.map(([t, n, w]) => `<a class="ds-arow" href="${href('calendar')}"><span class="ds-time">${esc(t)}</span><span class="ds-arow__body"><span class="ds-arow__title">${esc(n)}</span><span class="ds-arow__sub">${esc(w)}</span></span></a>`).join('')}</div></section>`;

  DS.define({
    id: 'home', nav: 'dashboard', tab: 'more',
    head, scope: () => 'Dashboard',
    render: () => `<div class="ds-apage">${ui.large('Overview', 'Wednesday, September 30')}${ui.teach()}${pulse()}${brainNote()}${upNext()}${meetings()}${week()}</div>`,
    acts: {
      'dismiss-note': () => DS.collapse(document.querySelector('[data-key="brain-note"]'), () => { st.brainNote = false; DS.render(); }),
    },
  });
})();
