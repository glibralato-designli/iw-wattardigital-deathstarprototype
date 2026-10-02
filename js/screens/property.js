/* 07 Property record: everything the client's current property page holds (building, use, sale and taxes,
   lot and zoning, debt, violations, signals, ownership, deals, notes), laid out like the contact case file. */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const p = D.pById[params.get('id')] || D.pById.p118, c = D.cById[p.owner], lead = c.pid === p.id, f = D.propFacts(p);
  const S = DS.S();
  const TABS = ['overview', 'violations', 'ownership', 'deals', 'evidence'];
  const st = { tab: TABS.includes(params.get('tab')) ? params.get('tab') : 'overview', qNote: '' };
  const acc = (key, def) => { const a = DS.V.acc || {}; return key in a ? a[key] : def; };
  const fmt = DS.loc;
  DS.remember(p.id);

  const evidence = () => lead ? DS.evidenceOf(c) : [['Units', p.units + ' (' + p.fm + ' free market, ' + p.rs + ' rent stabilized)', 'DOF · Tier A · Jul 30', 'verified'], ['Debt', p.debt === 'Not on record' ? 'Not on record' : p.debt + ' due ' + p.mat, 'ACRIS · Tier A · Aug 12', 'verified'], ['Owner', c.entity, 'NY DOS · Tier A · Jun 18', 'verified']].map(([l, v, m, k], i) => ({ i, l, v, m, k, canFlag: false, flagged: false }));
  const safe = () => evidence().filter(e => e.k === 'verified');
  const openVio = () => f.vio.filter(v => v[3] === 'Open').length;
  const whyFull = lead ? c.whyFull : c.name + ' owns ' + p.addr + ' as part of a ' + DS.portfolio(c).length + '-building portfolio. The owner’s lead reason to call is at ' + D.pById[c.pid].addr + '.';
  const email = c.name.toLowerCase().replace(' ', '.') + '@example.com';
  const storefront = () => (S.storefront || {})[p.id] || 'auto';

  /* ───────── Header ───────── */
  const header = () => {
    const meta = [[p.hood + ' · New York, NY ' + p.zip, 'map-pin'], ['BBL ' + p.bbl, 'tag'], [f.type, 'buildings'], ['Built ' + p.built, 'calendar-blank']];
    const off = (l, ic) => ui.btn({ ic, aria: l, variant: 'outline', disabled: true, tip: l + ' · ' + DS.OFF });
    return `<div class="ds-rnav"><a class="ds-back" href="${href('properties')}">${icon('caret-left')}Back to Properties</a></div>
      <div class="ds-rhead"><span class="ds-rhead__avatar" data-kind="property" aria-hidden="true">${icon('buildings')}</span>
        <div class="ds-rhead__body"><div class="ds-rhead__title"><h1>${esc(p.addr)}</h1>${ui.cls(c.cls, true)}</div>
          <div class="ds-rhead__meta">${meta.map(([l, ic]) => `<span>${icon(ic)}${esc(l)}</span>`).join('')}</div>
          <div class="ds-rhead__chips"><a class="ds-chip" data-tone="outline" href="${href('contact', 'id=' + c.id)}">${icon('user')}${esc(c.name)}${icon('caret-right')}</a>${ui.scoreChip('Owner score ' + c.score, c.score)}<span class="ds-chip" title="Call priority">Priority ${f.priority}</span></div></div>
        <div class="ds-rhead__actions"><div class="ds-rhead__primary">${ui.btn({ label: 'Call owner', ic: 'phone', link: href('contact', 'id=' + c.id + '&act=call') })}${ui.btn({ label: 'Open owner', variant: 'outline', link: href('contact', 'id=' + c.id) })}</div>
          <div class="ds-rhead__tools">${off('View on map', 'map-trifold')}${off('Find comps', 'magnifying-glass')}${off('Owner summary (PDF)', 'file-text')}${off('Add to list', 'plus')}${ui.btn({ ic: 'arrows-in-simple', aria: 'Show as side panel', tip: 'Show as side panel', variant: 'outline', link: href('properties', 'peek=' + p.id) })}</div></div>
      </div>`;
  };
  // Summary first: the five numbers Thomas checks before anything else.
  const keyStats = () => {
    const v = openVio(), stat = (l, val, sub, zero) => `<div class="ds-stat"${zero ? ' data-zero' : ''}><span class="ds-meta font-medium">${esc(l)}</span><b>${esc(val)}</b><span class="ds-meta">${esc(sub)}</span></div>`;
    return `<div class="ds-statrow" data-compact aria-label="Key facts">${stat('Units', String(p.units), p.rs ? p.rs + ' rent stabilized' : 'All free market')}${stat('Gross SF', fmt(p.sf), f.stories + ' stories · built ' + p.built)}${stat('Last sale', f.saleShort, f.saleD.replace(/ \d+,/, '') + ' · held ' + f.years + ' yrs')}${stat('Debt', p.debt === 'Not on record' ? 'None' : p.debt, p.debt === 'Not on record' ? 'Not on record' : 'Due ' + p.mat, p.debt === 'Not on record')}${stat('Open violations', String(v), v ? 'HPD ' + f.hpd.open + ' · DOB ' + f.dob.open + ' · ECB ' + f.ecb.open : 'None open', !v)}</div>`;
  };

  /* ───────── Overview ───────── */
  const why = () => {
    const on = f.signals.filter(s => s[1]), n = safe().length;
    return `<section class="ds-why" aria-label="Why now"><div class="ds-why__head">${ui.cls(c.cls)}<h2>Why now</h2>${ui.trust(lead ? c.trust : 'verified')}<span class="ds-grow"></span><span class="badge" data-status="success">${icon('seal-check')}${n} ${n === 1 ? 'line' : 'lines'} safe to state</span></div>
      <p class="ds-why__text">${esc(whyFull)}</p>
      ${on.length ? `<ul class="ds-whylist">${on.map(([l, , line]) => `<li><span><b class="font-medium">${esc(l)}</b><span class="muted"> · ${esc(line)}</span></span></li>`).join('')}</ul>` : ''}
      <div class="ds-signals" aria-label="Distress signals"><span class="ds-meta">Distress signals</span>${f.signals.map(([l, active]) => `<span class="ds-signal"${active ? ' data-on' : ''}>${active ? icon('check') : ''}${esc(l)}<span class="sr-only">${active ? ' · present' : ' · not present'}</span></span>`).join('')}</div>
      <div class="ds-why__actions">${ui.btn({ label: 'Evidence', variant: 'outline', act: 'tab', arg: 'evidence' })}${ui.btn({ label: 'Ask Brain', ic: 'sparkle', variant: 'outline', act: 'ask', arg: 'Look up ' + p.addr })}</div></section>`;
  };
  const overview = () => {
    const debt = p.debt !== 'Not on record';
    const secs = [
      ['building', 'Building', f.type + ' · ' + f.stories + ' stories · built ' + p.built, [['Property type', f.type], ['Building class (DOF)', f.cls], ['Gross SF', fmt(p.sf)], ['Stories', String(f.stories)], ['Year built', String(p.built)], ['Construction pipeline', f.pipeline]], true],
      ['use', 'Units and rent', p.units + ' units · ' + (p.rs ? p.rs + ' rent stabilized' : 'all free market'), [['Total units', String(p.units)], ['Average unit size', f.avgUnit], ['Rent regulated', f.rentReg], ['Rent stabilized units', String(p.rs)], ['Free-market units', String(p.fm)], ['Owner occupied', f.ownerOcc]], true],
      ['debt', 'Debt and capital', debt ? p.debt + ' due ' + p.mat + (f.months ? ' · ' + f.months + ' months to maturity' : '') : 'No recorded debt', [['Debt amount', p.debt], ['Maturity date', p.mat], ['Months to maturity', f.months ? String(f.months) : 'Not on record', { hot: !!f.months && f.months <= 12 }], ['Lender', f.lender], ['Debt as of', f.debtAsOf], ['Distress status', f.distress]], true],
      ['sale', 'Sale and taxes', 'Bought ' + f.saleD + ' for ' + f.saleShort + ' · held ' + f.years + ' years', [['Sale date', f.saleD], ['Sale price', f.saleP], ['Years held', f.years + ' years'], ['Assessed value (DOF)', f.assessed]], false],
      ['lot', 'Lot and zoning', f.zoning + ' · ' + (f.unused ? fmt(f.unused) + ' SF unused' : 'built to the limit'), [['Lot SF', fmt(f.lotSF)], ['Block and lot', f.block], ['BBL', p.bbl], ['Zoning district', f.zoning], ['Built area (gross SF)', fmt(p.sf)], ['Unused development rights', f.unused ? fmt(f.unused) + ' SF' : 'None'], ['Max buildable (est.)', fmt(f.maxB) + ' SF']], false],
    ];
    return why() + `<div class="ds-acc">${secs.map(([k, t, sum, rows, open]) => ui.acc('pr-' + k, t, sum, ui.kv(rows), acc('pr-' + k, open))).join('')}</div>`;
  };

  /* ───────── Violations, Ownership, Deals, Evidence ───────── */
  const violations = () => {
    const box = (l, o) => `<div class="ds-stat"${o.open ? '' : ' data-zero'}><span class="ds-meta font-medium">${l}</span><b>${o.open} open</b><span class="ds-meta">${o.total} on record</span></div>`;
    const sf = storefront(), sfAuto = f.storefront;
    const store = `<div class="ds-storefront">${icon('buildings')}<span class="ds-row__body"><span class="font-medium">Storefront registry</span><span class="ds-meta">${sfAuto ? (sf === 'auto' ? 'Auto: ' + sfAuto + ' from the city registry' : 'Set by you: ' + (sf === 'vacant' ? 'Vacant' : 'Occupied')) : 'No storefront · residential only'}</span></span>${sfAuto ? ui.segmented([['auto', 'Auto'], ['vacant', 'Vacant'], ['occupied', 'Occupied']], sf, 'storefront', 'Storefront status', 'sm') : ''}</div>`;
    const list = f.vio.length ? `<div class="ds-stack" data-gap="2">${f.vio.map(([s, t, d, o, hz]) => `<div class="ds-vio"><span class="font-medium">${s}</span><span>${esc(t)}${hz ? ' <span class="ds-sev" data-sev="Critical">' + hz + '</span>' : ''}</span><span class="ds-meta">${esc(d)}</span><span class="badge"${o === 'Open' ? ' data-status="danger"' : ''}>${o}</span></div>`).join('')}</div>` : '<div class="ds-dashed">No violations on record.</div>';
    return `<div class="ds-statrow" data-compact aria-label="Violations by agency">${box('DOB', f.dob)}${box('ECB', f.ecb)}${box('HPD', f.hpd)}<div class="ds-stat"${f.litigation ? '' : ' data-zero'}><span class="ds-meta font-medium">HPD litigation</span><b>${f.litigation}</b><span class="ds-meta">${f.litigation ? 'Case open' : 'None on record'}</span></div></div>${store}
      <div class="ds-section-h"><h2>Violations</h2><span class="ds-meta">${f.vio.length} on record · newest first</span></div>${list}`;
  };
  const ownership = () => `<div class="ds-section-h"><h2>Ownership</h2><span class="ds-meta">1 linked contact</span>${ui.off('Link contact', 'plus')}</div>
    <div class="ds-ownrow"><span class="ds-ownrow__av" aria-hidden="true">${esc(DS.initials(c.name))}</span>
      <span class="ds-row__body"><a class="font-medium" href="${href('contact', 'id=' + c.id)}">${esc(c.name)}</a><span class="ds-row__sub">${esc(c.entity)} · Reported owner</span></span>
      <span class="ds-row__body"><span class="ds-meta">Direct phone</span><span class="num">${esc(DS.bestPhone(c))}</span></span>
      <span class="ds-row__body"><span class="ds-meta">Email</span><span class="ds-ellipsis">${esc(email)}</span></span><span class="badge" data-status="info">Primary</span></div>
    ${DS.portfolio(c).length > 1 ? `<span class="ds-meta">${esc(c.name)} owns ${DS.portfolio(c).length} buildings. The portfolio is in the side column.</span>` : ''}`;
  const deals = () => `<div class="ds-section-h"><h2>Deals</h2><span class="ds-meta">None yet</span>${ui.off('New deal in Outreach', 'plus')}</div>
    <div class="ds-dashed">No deals on this property yet. A deal opened in Outreach shows its price, stage and close dates here.</div>`;
  const evTab = () => `<p class="ds-meta" style="max-width:40rem;text-wrap:pretty">Every signal with its source and date. Outreach states only the verified lines; single-source lines read “public records suggest”; the rest never go out.</p>
    <div class="ds-toolbar">${ui.btn({ label: 'Copy safe lines', ic: 'copy', variant: 'outline', act: 'prep-copy' })}${ui.off('Owner summary (PDF)', 'file-text')}<span class="ds-grow"></span><span class="badge" data-status="success">${icon('seal-check')}${safe().length} safe to state</span></div>
    <div class="ds-stack" data-gap="2">${evidence().map(e => `<div class="ds-evidence"><div class="ds-row__body"><span><span class="font-medium">${esc(e.l)}</span><span class="muted"> · ${esc(e.v)}</span></span><span class="ds-meta">${esc(e.m)}</span></div>${ui.trust(e.k)}${e.canFlag ? ui.btn({ label: 'Flag as wrong', variant: 'ghost', size: 'sm', act: 'flag', arg: e.i }) : e.flagged ? '<span class="ds-evidence__flagged">Flagged</span>' : '<span></span>'}</div>`).join('')}</div>`;

  /* ───────── Rail ───────── */
  const rail = () => {
    const notes = (S.pnotes || {})[p.id] || [], tl = DS.timelineOf(c).slice(0, 3);
    return `<aside class="ds-record__rail" aria-label="Property sidebar">
      <section class="ds-rail-card" aria-label="Primary contact"><h2>Primary contact</h2><div style="display:flex;align-items:center;gap:var(--space-2-5)">${ui.cls(c.cls)}<span class="ds-row__body"><a class="font-medium" href="${href('contact', 'id=' + c.id)}">${esc(c.name)}</a><span class="ds-row__sub">${esc(c.entity)}</span></span></div>
        ${ui.kv([['Phone', DS.bestPhone(c)], ['Email', email], ['Priority', f.priority + ' · ' + D.CLASS[c.cls]]], { compact: true })}</section>
      <section class="ds-rail-card" aria-label="Location"><h2>Location</h2><div class="ds-facade" data-wide>${icon('map-pin')}<span>${esc(p.addr)}</span></div>
        <div class="ds-toolbar" style="gap:var(--space-1-5)">${[['Street view', 'image'], ['Open in Map', 'map-trifold']].map(([l, ic]) => `<span class="ds-off-link" role="link" tabindex="0" aria-disabled="true" data-tip="${DS.OFF}">${icon(ic)}${l}</span>`).join('')}</div></section>
      <section class="ds-rail-card" aria-label="Property notes"><h2>Property notes</h2>${notes.map(n => `<div class="ds-stack" style="gap:1px"><span style="text-wrap:pretty">${esc(n.t)}</span><span class="ds-meta">${esc(n.d)}</span></div>`).join('')}
        <textarea id="prop-note" class="field__control" aria-label="Property note" rows="2" placeholder="Add a note about the building…" data-input="qNote">${esc(st.qNote)}</textarea><div>${ui.btn({ label: 'Save note', size: 'sm', act: 'save-note' })}</div>
        ${ui.kv([['BBL', p.bbl], ['Owner occupied', f.ownerOcc], ['Construction pipeline', f.pipeline]], { compact: true })}</section>
      <section class="ds-rail-card" aria-label="Owner activity"><h2>Owner activity</h2>${tl.length ? tl.map(x => `<div class="ds-mini-tl"><span class="ds-grow"><span class="font-medium">${esc(x.k)}</span><span class="muted"> · ${esc(x.t)}</span></span><span class="ds-meta num">${esc(x.d)}</span></div>`).join('') : '<span class="ds-meta">Nothing logged yet.</span>'}<a class="ds-link-btn" style="align-self:flex-start" href="${href('contact', 'id=' + c.id + '&tab=activity')}">All activity${icon('caret-right')}</a></section>
      <section class="ds-rail-card" aria-label="Owner’s portfolio"><h2>Owner’s portfolio</h2>${DS.portfolio(c).map(x => x.id === p.id ? `<div class="ds-row" data-dense style="padding-inline:var(--space-1)"><span class="ds-row__body"><span class="ds-row__title">${esc(x.addr)}</span><span class="ds-row__sub">This property</span></span></div>` : `<a class="ds-row" data-dense style="padding-inline:var(--space-1)" href="${href('property', 'id=' + x.id)}"><span class="ds-row__body"><span class="ds-row__title">${esc(x.addr)}</span><span class="ds-row__sub">${x.units} units · ${esc(x.hood)}</span></span><span class="ds-row__end">${icon('caret-right')}</span></a>`).join('')}</section>
    </aside>`;
  };

  const tabs = () => ui.stateTabs([['overview', 'Overview'], ['violations', 'Violations (' + openVio() + ' open)'], ['ownership', 'Ownership (1)'], ['deals', 'Deals (0)'], ['evidence', 'Evidence'], ['oh', 'Ownership history', true], ['docs', 'Documents', true], ['permits', 'Permits', true]], st.tab, 'tab', 'Property');
  const body = () => `<div class="ds-stack" data-gap="4" style="gap:var(--space-5)" data-anim="fade" data-key="ptab-${st.tab}">${({ overview, violations, ownership, deals, evidence: evTab })[st.tab]()}</div>`;

  DS.define({
    id: 'property', nav: 'database', brain: 'min',
    crumbs: () => [{ l: 'Database', page: 'contacts' }, { l: 'Properties', page: 'properties' }, { l: p.addr }],
    scope: () => p.addr,
    render: () => `<div class="ds-record"><div class="ds-record__main">${header()}${keyStats()}${tabs()}${body()}</div>${rail()}</div>`,
    acts: {
      tab: (el, k) => { st.tab = k; DS.render(); },
      flag: (el, i) => { DS.S().flags[c.id + ':' + i] = true; const e = DS.evidenceOf(c)[+i]; DS.addTimeline(c.id, { k: 'Flag', t: e.l + ' flagged as wrong', d: 'Just now' }); DS.save(); DS.render(); DS.toast('Flagged. It now shows as disputed.'); },
      storefront: (el, k) => { S.storefront = { ...(S.storefront || {}), [p.id]: k }; DS.save(); DS.render(); },
      'save-note': () => { const t = st.qNote.trim(); if (!t) return; S.pnotes = { ...(S.pnotes || {}), [p.id]: [{ t, d: 'Just now' }, ...((S.pnotes || {})[p.id] || [])] }; DS.save(); st.qNote = ''; DS.render(); DS.toast('Note saved'); },
      'prep-copy': () => { const text = safe().map(e => e.l + ': ' + e.v).join('\n'), ok = () => DS.toast(safe().length + ' safe lines copied'), no = () => DS.toast('The browser blocked copying. Select the lines instead.'); try { navigator.clipboard.writeText(text).then(ok, no); } catch (_) { no(); } },
    },
    inputs: { qNote: v => { st.qNote = v; } },
  });
})();
