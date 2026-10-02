/* 10–13 Dashboard display tabs: Outreach performance, Reporting, Listings, Web analytics. Display-only, summary first. */
(() => {
  const { D, ui, esc, icon, href } = DS;
  const page = document.body.dataset.page;
  const LABEL = { 'outreach-performance': 'Outreach performance', reporting: 'Reporting', listings: 'Listings', 'web-analytics': 'Web analytics' };
  const rangeOff = () => `<div class="segmented" role="group" aria-label="Date range">${['7 days', '30 days', '90 days'].map((l, i) => `<button type="button" class="segmented__item" aria-pressed="${i === 1}" aria-disabled="true" data-tip="${DS.OFF}">${l}</button>`).join('')}</div>`;
  const section = (title, sub, body, end = '') => `<section class="ds-stack" data-gap="3"><div class="ds-section-h"><h2>${esc(title)}</h2>${sub ? `<span class="ds-meta">${esc(sub)}</span>` : ''}${end}</div>${body}</section>`;
  const stat = (l, v, sub, o = {}) => `<div class="ds-stat"${o.emph ? ' data-emph' : ''}${/^0(%|$)/.test(String(v)) ? ' data-zero' : ''}><span class="ds-meta font-medium" style="display:flex;align-items:center;gap:var(--space-1-5);color:var(--fg-muted)">${o.ic ? icon(o.ic) : ''}${esc(l)}</span><b>${esc(v)}</b>${sub ? `<span class="ds-meta">${esc(sub)}</span>` : ''}</div>`;

  const outreach = () => {
    const O = D.outreachPerf;
    return section('Outreach', 'Today vs previous day and this week', `<div class="ds-statrow">${O.outreach.map(([l, v, s, ic, emph]) => stat(l, v, s, { ic, emph })).join('')}</div>
        <div class="ds-card" data-pad="lg"><div class="ds-card__head"><div class="ds-card__title"><h3>Calling efficiency</h3><span class="ds-meta">Last 30 days</span></div>${rangeOff()}</div>${ui.hbars(O.efficiency.map(([l, v]) => [l, v]), { fmt: 'pct', tone: 'accent' })}<span class="ds-meta">Hit rate counts calls that reached the right number. Call efficacy counts calls that produced a conversation.</span></div>`, `<button type="button" class="button" data-variant="outline" data-size="sm" aria-disabled="true" data-tip="${DS.OFF}">${icon('calendar-blank')}Date range</button>`) +
      section('Business generation', 'Each with the change against the previous period', `<div class="ds-statrow">${O.business.map(([l, v, s, prev]) => stat(l, v, s + ' · ' + prev)).join('')}</div>`) +
      section('Workflow efficacy', '', `<div class="ds-two"><div class="ds-statrow" style="grid-template-columns:minmax(0,1fr)">${O.efficacy.map(([l, v, s]) => stat(l, v, s)).join('')}</div><div class="ds-card" data-pad="lg"><div class="ds-card__head"><div class="ds-card__title"><h3>Trades by class</h3><span class="ds-meta">Last 180 days · 9 trades in territory</span></div></div>${ui.hbars(O.trades.map(([l, v]) => [l, v, l === 'Unclassified' ? 'muted' : null]))}</div></div>`);
  };
  const reporting = () => {
    const R = D.reporting, lvl = v => v >= 12 ? 4 : v >= 9 ? 3 : v >= 6 ? 2 : v >= 3 ? 1 : 0;
    return section('Coverage by ZIP', 'Share of owners touched at least once', `<div class="ds-two"><div class="ds-card" data-pad="lg"><div class="ds-zipgrid">${R.zips.map(([z, v, n]) => `<div class="ds-zip" data-level="${lvl(v)}"><span class="ds-meta" style="color:inherit">${z}</span><b>${v}%</b><span class="ds-meta" style="color:inherit">${n} owners</span></div>`).join('')}</div><div class="ds-legend">${[['0', '0–2%'], ['1', '3–5%'], ['2', '6–8%'], ['3', '9–11%'], ['4', '12% and up']].map(([k, l]) => `<span><span class="ds-zip" data-level="${k}" style="width:10px;height:10px;padding:0;border-radius:2px"></span>${l}</span>`).join('')}</div></div>
      <div class="ds-card" data-pad="lg"><div class="ds-card__head"><div class="ds-card__title"><h3>Clicked what</h3><span class="ds-meta">Unique people, last campaign</span></div></div>${ui.hbars(R.clicked)}</div></div>`) +
      section('Outreach', 'Q3 market report · Constant Contact', `<div class="ds-statrow">${R.outreach.map(([l, v]) => stat(l, v)).join('')}</div>`) +
      section('Marketing funnel', '', `<div class="ds-card" data-pad="lg"><div class="ds-card__head"><div class="ds-card__title"><h3>Q3 market report</h3><span class="ds-meta">Overall open rate 44%</span></div></div>${ui.hbars(R.funnel, { fmt: 'loc' })}</div>`) +
      section('Engagement', '', `<div class="ds-statrow">${R.engagement.map(([l, vendor, v, s]) => `<div class="ds-stat"><span class="ds-meta font-medium" style="color:var(--fg-muted)">${esc(l)} <span class="ds-meta" style="font-weight:var(--weight-regular)">· ${esc(vendor)}</span></span><b>${esc(v)}</b><span class="ds-meta">${esc(s)}</span></div>`).join('')}</div>`);
  };
  const listings = () => {
    const L = D.listings;
    const cards = `<div class="ds-two">${L.map(l => `<section class="ds-card ds-listing" data-pad="lg"><div class="ds-card__head"><span class="ds-tile-icon" style="border:0;background:var(--bg-muted);color:var(--fg-muted)">${icon('buildings')}</span><div class="ds-card__title"><h2>${esc(l.addr)}</h2><span class="ds-meta">${esc(l.sub)}</span></div><span class="badge"${l.status === 'Active' ? ' data-status="success"' : ' data-status="info"'}>${esc(l.status)}</span></div><div class="ds-listing__counts">${l.counts.map(([k, v]) => `<div class="ds-listing__count"><span class="ds-meta">${esc(k)}</span><b>${esc(v)}</b></div>`).join('')}</div><div class="ds-toolbar"><button type="button" class="button" data-variant="outline" data-size="sm" aria-disabled="true" data-tip="${DS.OFF}">${icon('file-text')}Open OM</button><button type="button" class="button" data-variant="ghost" data-size="sm" aria-disabled="true" data-tip="${DS.OFF}">${icon('plus')}Log a tour or offer</button></div></section>`).join('')}</div>`;
    const viewers = `<section class="ds-card" aria-label="Viewed by"><div class="ds-card__head"><div class="ds-card__title"><h2>Viewed by · 30 days</h2><span class="ds-meta">Call them while the listing is fresh</span></div></div>${D.viewers.map(([id, s]) => { const c = D.cById[id]; return `<a class="ds-row" data-dense href="${href('contact', 'id=' + id)}">${ui.cls(c.cls)}<span class="ds-row__body"><span class="ds-row__title">${esc(c.name)}</span><span class="ds-row__sub">${esc(s)}</span></span><span class="ds-row__end">${icon('caret-right')}</span></a>`; }).join('')}</section>`;
    const inq = `<section class="ds-card" aria-label="Website inquiries"><div class="ds-card__head"><div class="ds-card__title"><h2>Website inquiries</h2><span class="ds-meta">3 to handle</span></div><button type="button" class="button button--icon" data-variant="ghost" data-size="sm" aria-label="Refresh" aria-disabled="true" data-tip="${DS.OFF}">${icon('arrow-clockwise')}</button></div>${D.inquiries.map(([n, s, d, inDb]) => `<div class="ds-row" data-dense><span class="ds-tile-icon">${icon('envelope-simple')}</span><span class="ds-row__body"><span class="ds-row__title">${esc(n)}</span><span class="ds-row__sub">${esc(s)}</span></span>${inDb ? '<span class="badge" data-status="info">In database</span>' : ''}<span class="ds-meta">${d}</span><button type="button" class="button" data-variant="outline" data-size="xs" aria-disabled="true" data-tip="${DS.OFF}">Reply</button></div>`).join('')}</section>`;
    const small = (t, rows) => `<section class="ds-card" aria-label="${esc(t)}"><div class="ds-card__head"><h2 class="ds-grow" style="font-size:var(--text-md);line-height:var(--line-height-sm);color:var(--fg);font-weight:var(--weight-semibold)">${esc(t)}</h2><span class="ds-meta">${rows.length}</span></div>${rows.map(([a, b, d]) => `<div class="ds-row" data-dense><span class="ds-row__body"><span class="ds-row__title">${esc(a)}</span><span class="ds-row__sub">${esc(b)}</span></span><span class="ds-meta">${esc(d)}</span></div>`).join('')}</section>`;
    return cards + `<div class="ds-two">${viewers}${inq}</div><div class="ds-three">${small('Buyer registrations', D.inbound.buyers)}${small('BOV requests', D.inbound.bov)}${small('Bookings', D.inbound.bookings)}</div>`;
  };
  const web = () => {
    const W = D.web;
    return `<div class="ds-toolbar"><span class="ds-grow ds-meta">stewartgroup.example · last 30 days</span>${rangeOff()}</div><div class="ds-statrow">${W.stats.map(([l, v, s], i) => stat(l, v, s, { emph: i === 0 })).join('')}</div>
      <div class="ds-card" data-pad="lg"><div class="ds-card__head"><div class="ds-card__title"><h2>Visitors per week</h2><span class="ds-meta">Last 7 weeks</span></div><span class="ds-headline"><b>1,284</b><span class="ds-meta">this week</span></span></div>${ui.line(W.weeks, { aria: 'Visitors per week, rising from 880 to 1,284' })}</div>
      <section class="ds-card" data-pad="lg" aria-label="What the numbers say"><div class="ds-card__head"><div class="ds-card__title"><h2>What the numbers say</h2><span class="ds-meta">A plain summary, not a forecast</span></div></div><div>${W.insights.map(t => `<div class="ds-insight">${icon('sparkle')}<span>${esc(t)}</span></div>`).join('')}</div></section>`;
  };
  const BODY = { 'outreach-performance': outreach, reporting, listings, 'web-analytics': web };

  DS.define({
    id: page, nav: 'dashboard', brain: 'min',
    crumbs: () => [{ l: 'Dashboard', page: 'attack-plan' }, { l: LABEL[page] }],
    scope: () => LABEL[page],
    render: () => `<div class="ds-page">${ui.pageHead('Dashboard', ui.tabs(D.dashboardTabs, page, 'Dashboard'))}${ui.nudge(D.nudges[page])}${BODY[page]()}</div>`,
  });
})();
