/* 10–13 Dashboard display tabs: Outreach performance, Reporting, Listings, Web analytics.
   Content follows the client's portal tabs. Summary first, then detail; drill-downs, logging and filters are drawn but off. */
(() => {
  const { D, ui, esc, icon, href, loc } = DS;
  const page = document.body.dataset.page;
  const LABEL = { 'outreach-performance': 'Outreach performance', reporting: 'Reporting', listings: 'Listings', 'web-analytics': 'Web analytics' };
  const OFF = DS.OFF;

  /* ── Shared pieces ── */
  const offSeg = (items, on, label) => `<div class="segmented" role="group" aria-label="${esc(label)}">${items.map((l, i) => `<button type="button" class="segmented__item" aria-pressed="${i === on}" aria-disabled="true" data-tip="${OFF}">${esc(l)}</button>`).join('')}</div>`;
  const range = (shown, note) => `<div class="ds-toolbar"><button type="button" class="ds-datepick__btn" aria-disabled="true" data-tip="${OFF}">${icon('calendar-blank')}<span>${esc(shown)}</span>${icon('caret-down')}</button>${note ? `<span class="ds-meta">${esc(note)}</span>` : ''}</div>`;
  const section = (title, sub, body, end = '') => `<section class="ds-stack" data-section aria-label="${esc(title)}"><div class="ds-section-h"><h2>${esc(title)}</h2>${sub ? `<span class="ds-meta">${esc(sub)}</span>` : ''}${end}</div>${body}</section>`;
  const cardHead = (title, sub, end = '') => `<div class="ds-card__head"><div class="ds-card__title"><h3>${esc(title)}</h3>${sub ? `<span class="ds-meta">${esc(sub)}</span>` : ''}</div>${end}</div>`;
  const offIcon = (ic, aria) => ui.iconBtn({ ic, aria, disabled: true });
  const delta = ch => { const t = ch > 0 ? 'up' : ch < 0 ? 'warn' : 'flat'; return `<span class="ds-delta" data-tone="${t}">${icon(ch > 0 ? 'arrow-up' : ch < 0 ? 'arrow-down' : 'minus')}${ch > 0 ? '+' : ch < 0 ? '−' : ''}${Math.abs(ch)}%<span class="sr-only">${ch > 0 ? ' up' : ch < 0 ? ' down' : ' no change'}</span></span>`; };
  // A stat tile: label row (icon, label, optional tool), value, then a meta line or comparison pairs.
  const stat = ({ l, ic, v, sub, tool = '', emph, cmp, extra = '', bar = '' }) => `<div class="ds-stat"${emph ? ' data-emph' : ''}${/^0(%|$)/.test(String(v)) ? ' data-zero' : ''}><span class="ds-stat__label">${ic ? icon(ic) : ''}<span class="ds-grow">${esc(l)}</span>${tool}</span><span class="ds-stat__value"><b>${esc(v)}</b>${extra}</span>${bar}${cmp ? `<span class="ds-stat__cmp">${cmp.map(([k, n]) => `<span><span class="ds-meta">${esc(k)}</span><span class="ds-stat__cmpv">${esc(n)}</span></span>`).join('')}</span>` : ''}${sub ? `<span class="ds-meta">${esc(sub)}</span>` : ''}</div>`;
  const table = (cols, rows, label) => `<div class="ds-dtable-wrap"><table class="ds-dtable" aria-label="${esc(label)}"><thead><tr>${cols.map(c => `<th scope="col"${c.n ? ' data-n' : ''}>${esc(c.l)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${r.map((v, i) => `<td${cols[i].n ? ' data-n' : ''}>${v}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  const inlineBar = (v, max) => `<span class="ds-dtable__bar" aria-hidden="true"><span style="width:${Math.max(3, Math.round(v / max * 100))}%"></span></span>`;
  const r1 = n => Math.round(n * 10) / 10;
  const share = (a, b) => (b ? r1(a / b * 100) : 0) + '%';

  /* ── Outreach performance: activity, then business generation, then workflow efficacy ── */
  const outreach = () => {
    const O = D.outreachPerf, E = O.efficiency;
    const activity = `<div class="ds-statrow">${O.activity.map(([l, ic, t, prev, wk], i) => stat({ l, ic, v: t, emph: i === 3, tool: offIcon('list-bullets', `See every ${l.toLowerCase().replace(/s$/, '')} behind this number`), cmp: [['Previous day', prev], ['This week', wk]] })).join('')}</div>`;
    const metric = (v, l, sub, tone) => `<div class="ds-effmetric"><span class="ds-effmetric__v">${v}%</span><span class="ds-effmetric__l">${esc(l)}</span>${ui.progress(v / 100, l, { tone })}<span class="ds-meta">${esc(sub)}</span></div>`;
    const eff = `<div class="ds-card" data-pad="lg">${cardHead('Calling efficiency', 'Last 30 days', offSeg(['7 days', '30 days', '90 days'], 1, 'Calling efficiency window'))}<div class="ds-effmetrics">${metric(E.hit, 'Hit rate', 'Right number reached', 'accent')}${metric(E.efficacy, 'Call efficacy', 'Produced a conversation')}</div><span class="ds-meta ds-card__foot">${E.conversations} conversations · ${E.confirmed} numbers confirmed · ${E.calls} calls</span></div>`;
    const reach = `<div class="ds-statrow" data-stack>${stat({ l: 'LinkedIn connections', ic: 'linkedin-logo', v: O.linkedin.pct + '%', sub: `${loc(O.linkedin.connected)} of ${loc(O.linkedin.total)} database contacts` })}${stat({ l: 'Weekly marketing blasts', ic: 'megaphone', v: O.blasts.n, sub: 'Campaigns created this week · ' + O.blasts.sub })}</div>`;
    const business = `<div class="ds-statrow">${O.business.map(([l, cur, ch, win, prev]) => stat({ l, v: cur, extra: delta(ch), sub: `${win} · previous period ${prev}`, tool: offIcon('plus', 'Log one: ' + l.toLowerCase()) })).join('')}</div>`;
    const W = O.communication, P = O.prediction, total = O.trades.reduce((a, t) => a + t[1], 0);
    const efficacy = `<div class="ds-two" data-ratio="even"><div class="ds-statrow" data-stack>${stat({ l: 'Communication efficacy', v: W.cur, extra: delta(W.change), bar: ui.progress(parseInt(W.cur) / 100, 'Communication efficacy', { tone: 'accent' }), sub: `${W.window} · ${W.sub}` })}${stat({ l: 'Prediction model accuracy', v: P.pct + '%', bar: ui.progress(P.pct / 100, 'Prediction model accuracy'), sub: `${P.flagged} of ${P.total} trades were flagged in advance · ${P.window}` })}</div>
      <div class="ds-card" data-pad="lg">${cardHead('Trades by class', 'Last 180 days in territory', `<span class="ds-headline"><b>${total}</b><span class="ds-meta">trades</span></span>`)}${ui.hbars(O.trades.map(([l, v]) => [l, v, l === 'Unclassified' ? 'muted' : null]), { wide: true, fmt: v => `${v} · ${total ? Math.round(v / total * 100) : 0}%` })}</div></div>`;
    return range('Today · Wed, Sep 30', 'Compared with the previous day and this week') +
      section('Outreach', 'Counted automatically', activity + `<div class="ds-two" data-ratio="wide">${eff}${reach}</div>`) +
      section('Business generation', 'Logged by hand, each against its previous period', business) +
      section('Workflow efficacy', 'How well the outreach and the model are working', efficacy);
  };

  /* ── Reporting: who we haven't reached, how the emails did, then each channel ── */
  const reporting = () => {
    const R = D.reporting, F = R.funnel;
    const zips = R.zips.map(([z, hit, reach, warm]) => ({ z, hit, reach, warm, p: hit / reach * 100 })).sort((a, b) => a.p - b.p);
    const hit = zips.reduce((a, z) => a + z.hit, 0), reach = zips.reduce((a, z) => a + z.reach, 0), warm = zips.reduce((a, z) => a + z.warm, 0);
    const cov = `<div class="ds-card" data-pad="lg"><div class="ds-card__head"><div class="ds-card__title"><span class="ds-headline"><b>${Math.round(hit / reach * 100)}%</b><span class="ds-meta">coverage</span></span><span class="ds-meta">${hit} of ${loc(reach)} reachable owners touched · ${warm} warm · ${R.engaged} engaged</span></div>${offSeg(R.channels, 0, 'Coverage channel')}</div>
      <div class="ds-covgrid">${zips.map(z => `<button type="button" class="ds-cov" aria-disabled="true" data-tip="${OFF}"${z.p < 5 ? ' data-thin' : ''}><span class="ds-cov__top"><b>${z.z}</b><span class="ds-cov__p">${Math.round(z.p)}%</span></span>${ui.progress(z.p / 15, z.z + ' coverage', { tone: z.p < 5 ? 'warn' : 'accent', fill: true })}<span class="ds-meta">${z.hit} of ${z.reach} touched${z.warm ? ` · ${z.warm} warm` : ''}</span></button>`).join('')}</div></div>`;
    const steps = [['Sent', F.sent], ['Delivered', F.delivered], ['Opened', F.opened], ['Clicked', F.clicked]];
    const funnel = `<div class="ds-card" data-pad="lg">${cardHead('Marketing funnel', 'Percentages are of sent')}<div class="ds-funnel">${steps.map(([l, v]) => `<div class="ds-funnel__row"><span>${l}</span><span class="ds-hbar__track"><span data-tone="accent" style="width:${Math.max(2, Math.round(v / F.sent * 100))}%"></span></span><span class="ds-funnel__n">${loc(v)}</span><span class="ds-funnel__p">${share(v, F.sent)}</span></div>`).join('')}</div>
      <div class="ds-statrow" data-compact>${[['Open rate', share(F.opened, F.sent)], ['Click rate', share(F.clicked, F.sent)], ['Click-to-open', share(F.clicked, F.opened)], ['Bounced', loc(F.bounced)], ['Unsubscribed', loc(F.unsub)]].map(([l, v]) => stat({ l, v })).join('')}</div></div>`;
    const clicked = `<div class="ds-card" data-pad="lg">${cardHead('Clicked what', 'Unique people per link', ui.btn({ label: 'See who', variant: 'outline', size: 'sm', disabled: true }))}${ui.hbars(R.clicked, { tone: 'accent' })}</div>`;
    const channel = e => `<div class="ds-card" data-pad="lg">${cardHead(e.t, e.v)}<span class="ds-headline"><b>${esc(e.head)}</b></span>${ui.kv(e.rows, { compact: true })}<span class="ds-meta">${esc(e.foot)}</span></div>`;
    return range('Last 30 days', 'Sep 1 – Sep 30') +
      section('Coverage by ZIP', 'Weakest first. Each owner list opens from its ZIP.', cov) +
      section('Email campaigns', 'LinkedIn post numbers arrive here once LinkedIn is connected', `<div class="ds-two" data-ratio="wide">${funnel}${clicked}</div>`, offSeg(R.emailChannels, 0, 'Outreach channel')) +
      section('Engagement by channel', '', `<div class="ds-three">${R.engagement.map(channel).join('')}</div>`);
  };

  /* ── Listings: each listing with its counts and viewers, then what came in through the website ── */
  const listings = () => {
    const card = l => {
      const vs = l.viewers, shown = vs.slice(0, 4);
      return `<section class="ds-card ds-listing" data-pad="lg" aria-label="${esc(l.addr)}"><div class="ds-card__head"><span class="ds-tile-icon" data-tone="tint">${icon('buildings')}</span><div class="ds-card__title"><h3>${esc(l.addr)}</h3><span class="ds-meta">${esc(l.sub)}</span></div><span class="badge" data-status="${l.status === 'Active' ? 'success' : 'info'}">${esc(l.status)}</span>${ui.btn({ label: 'Open OM', ic: 'file-text', variant: 'outline', size: 'sm', disabled: true })}</div>
        <div class="ds-listing__counts">${l.counts.map(([k, v, auto]) => `<div class="ds-listing__count"><span class="ds-meta">${esc(k)}</span><b>${loc(v)}</b>${auto ? '<span class="ds-listing__auto">Auto</span>' : ui.btn({ label: 'Log', ic: 'plus', variant: 'ghost', size: 'xs', disabled: true })}</div>`).join('')}</div>
        <div class="ds-listing__viewers"><div class="ds-subhead"><h3>Viewed by · 30 days</h3><span class="ds-meta">${vs.length} ${vs.length === 1 ? 'person' : 'people'}</span></div>${shown.map(([id, n, last]) => { const c = D.cById[id]; return `<a class="ds-row" data-dense href="${href('contact', 'id=' + id)}">${ui.cls(c.cls)}<span class="ds-row__body"><span class="ds-row__title">${esc(c.name)}</span><span class="ds-row__sub">${n} ${n === 1 ? 'view' : 'views'} · last ${esc(last)}</span></span><span class="ds-row__end">${icon('caret-right')}</span></a>`; }).join('')}${vs.length > shown.length ? `<button type="button" class="ds-link-btn ds-listing__more" aria-disabled="true" data-tip="${OFF}">View all ${vs.length}${icon('caret-right')}</button>` : ''}</div></section>`;
    };
    const waiting = D.inquiries.filter(q => q[7]).length;
    const inq = `<div class="ds-card" data-pad="none">${D.inquiries.map(([n, form, reach, about, msg, when, inDb, isNew]) => `<div class="ds-inq"${isNew ? ' data-new' : ''}><span class="ds-tile-icon">${icon('envelope-simple')}</span><div class="ds-inq__body"><span class="ds-inq__who"><b>${esc(n)}</b><span class="ds-meta">${esc(form)}</span>${inDb ? '<span class="badge" data-status="info">In database</span>' : ''}${isNew ? '<span class="badge" data-status="warning">Awaiting follow-up</span>' : ''}</span><p>${esc(msg)}</p><span class="ds-meta">${esc(reach)} · ${esc(about)} · ${esc(when)}</span></div><div class="ds-inq__acts">${ui.btn({ label: 'Reply', variant: 'outline', size: 'sm', disabled: true })}${ui.btn({ label: isNew ? 'Mark handled' : 'Reopen', variant: 'ghost', size: 'sm', disabled: true })}</div></div>`).join('')}</div>`;
    const small = (t, rows, act) => `<section class="ds-card" aria-label="${esc(t)}"><div class="ds-card__head"><div class="ds-card__title"><h3>${esc(t)}</h3></div><span class="ds-meta">${rows.length}</span></div>${rows.map(([a, b, d]) => `<div class="ds-row" data-dense><span class="ds-row__body"><span class="ds-row__title">${esc(a)}</span><span class="ds-row__sub">${esc(b)}</span></span><span class="ds-meta">${esc(d)}</span></div>`).join('')}${act ? `<button type="button" class="ds-link-btn ds-listing__more" aria-disabled="true" data-tip="${OFF}">${esc(act)}${icon('caret-right')}</button>` : ''}</section>`;
    const I = D.inbound, Ev = I.events;
    const events = `<div class="ds-card" data-pad="lg">${cardHead('Events page', Ev.name)}<div class="ds-two" data-ratio="even"><div class="ds-statrow" data-compact>${stat({ l: 'Views · 7 days', v: Ev.v7 })}${stat({ l: 'Views · 30 days', v: Ev.v30 })}${stat({ l: 'RSVPs', v: Ev.rsvps, sub: Ev.rsvps7 + ' this week' })}</div><div class="ds-stack" data-gap="2"><span class="ds-meta">Traffic sources · 30 days</span>${ui.hbars(Ev.refs)}</div></div></div>`;
    return range('All time', 'Auto counts tracked engagement. Tours and offers are logged with a record.') +
      section('Listing activity', `${D.listings.length} listings on the website`, `<div class="ds-two">${D.listings.map(card).join('')}</div>`) +
      section('Website inquiries', `${waiting} awaiting follow-up · every form on stewartgroup.example`, inq, offIcon('arrow-clockwise', 'Refresh')) +
      section('Other website requests', '', `<div class="ds-three">${small('Buyer registrations', I.buyers)}${small('BOV requests', I.bov, 'Open auto-BOV')}${small('Bookings', I.bookings)}</div>${events}`);
  };

  /* ── Web analytics: audience and outcomes, the trend and its summary, then sources, people, content, speed ── */
  const web = () => {
    const W = D.web, maxCh = Math.max(...W.channels.map(c => c[1]));
    const rate = r => `<span class="badge" data-status="${r === 'good' ? 'success' : r === 'needs' ? 'warning' : 'danger'}">${r === 'good' ? 'Good' : r === 'needs' ? 'Needs work' : 'Poor'}</span>`;
    const lcp = v => parseFloat(v) <= 2.5 ? 'good' : parseFloat(v) <= 4 ? 'needs' : 'poor';
    const head = `<div class="ds-toolbar"><span class="ds-grow ds-meta">${esc(W.site)} · first-party, no cookies · <span class="ds-live">${W.now} on the site now</span> · ${W.realtime.map(([p, n]) => `${esc(p)} ${n}`).join(' · ')}</span>${ui.btn({ label: 'Open the editor', ic: 'arrow-square-out', variant: 'outline', size: 'sm', disabled: true })}${offSeg(['7 days', '30 days', '90 days'], 1, 'Date range')}</div>`;
    const audience = `<div class="ds-statrow">${W.audience.map(([l, v, s], i) => stat({ l, v, sub: s, emph: i === 0 })).join('')}</div>`;
    const outcomes = `<div class="ds-statrow">${W.outcomes.map(([l, v, s]) => stat({ l, v, sub: s })).join('')}</div>`;
    const trend = `<div class="ds-two" data-ratio="wide"><div class="ds-card" data-pad="lg">${cardHead('Visitors per week', 'Last 7 weeks', '<span class="ds-headline"><b>1,284</b><span class="ds-meta">this week</span></span>')}${ui.line(W.weeks, { aria: 'Visitors per week, rising from 880 to 1,284' })}</div>
      <section class="ds-card" data-pad="lg" aria-label="What the numbers say">${cardHead('What the numbers say', 'Plain summary, refreshed daily')}<div>${W.insights.map(t => `<div class="ds-insight">${icon('sparkle')}<span>${esc(t)}</span></div>`).join('')}</div></section></div>`;
    const sources = `<div class="ds-two" data-ratio="wide"><div class="ds-card" data-pad="lg">${cardHead('Channels', 'Sessions by channel. Conversions are form submissions.')}${table([{ l: 'Channel' }, { l: 'Sessions', n: 1 }, { l: '' }, { l: 'Engaged', n: 1 }, { l: 'Conv.', n: 1 }], W.channels.map(([c, s, e, cv]) => [esc(c), loc(s), inlineBar(s, maxCh), e, cv ? `<b>${cv}</b>` : '<span class="muted">0</span>']), 'Sessions by channel')}</div>
      <div class="ds-card" data-pad="lg">${cardHead('Campaigns', 'Sessions by tagged campaign')}${table([{ l: 'Campaign' }, { l: 'Sessions', n: 1 }, { l: 'Conv.', n: 1 }], W.campaigns.map(([c, ch, s, cv]) => [`${esc(c)}<span class="ds-dtable__sub">${esc(ch)}</span>`, loc(s), cv ? `<b>${cv}</b>` : '<span class="muted">0</span>']), 'Sessions by campaign')}</div></div>`;
    const people = `<div class="ds-card" data-pad="lg">${cardHead('Known contacts on the site', 'Arrived through a tracked email link. Names open the contact.')}${table([{ l: 'Contact' }, { l: 'Views', n: 1 }, { l: 'Pages' }, { l: 'Last visit', n: 1 }], W.contacts.map(([id, v, pg, last, ch]) => { const c = D.cById[id]; return [`<a href="${href('contact', 'id=' + id)}"><b>${esc(c.name)}</b></a><span class="ds-dtable__sub">${esc(ch)}</span>`, v, esc(pg), esc(last)]; }), 'Known contacts on the site')}</div>`;
    const content = `<div class="ds-two" data-ratio="wide"><div class="ds-card" data-pad="lg">${cardHead('Pages', 'Views, people, engaged time and how far they scrolled')}${table([{ l: 'Page' }, { l: 'Views', n: 1 }, { l: 'People', n: 1 }, { l: 'Engaged', n: 1 }, { l: 'Scroll', n: 1 }], W.pages.map(([p, v, pp, e, s]) => [esc(p), loc(v), loc(pp), e, s]), 'Pages')}</div>
      <div class="ds-card" data-pad="lg">${cardHead('Documents and OMs', 'Every download, by file')}${table([{ l: 'File' }, { l: 'Downloads', n: 1 }, { l: 'People', n: 1 }], W.documents.map(([t, f, d, p]) => [`${esc(t)}<span class="ds-dtable__sub">${esc(f)}</span>`, d, p]), 'Documents and OMs')}</div></div>
      <div class="ds-two" data-ratio="even"><div class="ds-card" data-pad="lg">${cardHead('Forms', 'Started, submitted, and inquiries received')}${table([{ l: 'Form' }, { l: 'Started', n: 1 }, { l: 'Sent', n: 1 }, { l: 'Inquiries', n: 1 }], W.forms.map(([f, st, sb, iq]) => [esc(f), st, sb, iq ? `<b>${iq}</b>` : '<span class="muted">0</span>']), 'Forms')}</div>
      <div class="ds-card" data-pad="lg">${cardHead('Calls, emails and links clicked', 'Phone and email links, buttons and outbound links')}${table([{ l: 'Kind' }, { l: 'Target' }, { l: 'Clicks', n: 1 }], W.clicks.map(([k, t, n]) => [esc(k), esc(t), n]), 'Clicks')}</div></div>`;
    const poor = W.vitalPages.filter(v => lcp(v[1]) === 'poor').length;
    const speed = `<div class="ds-statrow" data-compact>${W.vitals.map(([l, v, code, r]) => stat({ l, v, sub: code, extra: rate(r) })).join('')}</div>${table([{ l: 'Page' }, { l: 'Largest paint', n: 1 }, { l: 'Taps', n: 1 }, { l: 'Layout shift', n: 1 }, { l: 'Rating' }], W.vitalPages.map(([p, a, b, c]) => [esc(p), a, b, c, rate(lcp(a))]), 'Speed by page')}<span class="ds-meta">75th percentile of real visits, rated on Google’s thresholds.</span>`;
    const tracking = `<p>One first-party script on every page records page views, engaged time, scroll depth, downloads, phone, email and outbound clicks, form starts and submissions, and speed. No cookies and no third-party trackers; visitors are counted with a hash that rotates daily. Portal previews are never counted.</p><p>To tie a visit to the owner who clicked, tracked email links carry the campaign and the contact. The visit then appears above and on that contact’s timeline.</p>`;
    const acc = (k, def) => { const a = DS.V.acc || {}; return k in a ? a[k] : def; };
    return head +
      section('Audience', 'Last 30 days', audience) +
      section('Outcomes', 'What the visits produced', outcomes) +
      section('Traffic', '', trend) +
      section('Where visitors come from', '', sources) +
      section('Who is on the site', '', people) +
      section('Content', '', content) +
      `<div class="ds-acc">${ui.acc('wa-speed', 'Site speed', `All four vitals are good · ${poor} page is slow on phones`, speed, acc('wa-speed', false))}${ui.acc('wa-track', 'How tracking works', 'First-party, no cookies', tracking, acc('wa-track', false))}</div>`;
  };
  const BODY = { 'outreach-performance': outreach, reporting, listings, 'web-analytics': web };

  DS.define({
    id: page, nav: 'dashboard', brain: 'min',
    crumbs: () => [{ l: 'Dashboard', page: 'attack-plan' }, { l: LABEL[page] }],
    scope: () => LABEL[page],
    render: () => `<div class="ds-page">${ui.pageHead('Dashboard', ui.tabs(D.dashboardTabs, page, 'Dashboard'))}${ui.nudge(D.nudges[page])}${BODY[page]()}</div>`,
  });
})();
