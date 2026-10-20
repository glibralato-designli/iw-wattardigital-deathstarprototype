/* App 05 Database · Contacts and 06 Database · Properties: search, filter chips with option sheets, and the list. */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const kind = document.body.dataset.page === 'properties' ? 'properties' : 'contacts', isC = kind === 'contacts';
  const st = { q: params.get('q') || '', cls: params.get('list') === 'A' ? 'Class A' : 'All classes', trust: 'All trust', sig: 'All signals', terr: true, data: params.get('data') || 'ready' };
  const TRK = { Verified: 'verified', 'Single source': 'single', Stale: 'stale', Disputed: 'disputed' };
  const OPTS = { cls: ['All classes', 'Class A', 'Class B', 'Class C', 'Class D', 'Likely holders'], trust: ['All trust', 'Verified', 'Single source', 'Stale', 'Disputed'], sig: ['All signals', 'Loan maturity', 'Estate transition', 'Long hold', 'Unused FAR', 'Lis pendens', 'Nearby sale', 'Recent refinance'] };
  const TITLE = { cls: 'Class', trust: 'Trust', sig: 'Signal' };
  const clsKey = () => st.cls === 'All classes' ? null : st.cls === 'Likely holders' ? 'LH' : st.cls.replace('Class ', '');
  const contacts = () => { const q = st.q.trim().toLowerCase(), dig = q.replace(/\D/g, ''), ck = clsKey(), tk = TRK[st.trust];
    return D.C.filter(c => (!q || c.name.toLowerCase().includes(q) || c.entity.toLowerCase().includes(q) || D.pById[c.pid].addr.toLowerCase().includes(q) || (dig.length >= 4 && c.phone.replace(/\D/g, '').includes(dig))) && (!ck || c.cls === ck) && (!tk || c.trust === tk) && (st.sig === 'All signals' || c.signal === st.sig)).sort((a, b) => b.score - a.score); };
  const properties = () => { const q = st.q.trim().toLowerCase(), dig = q.replace(/\D/g, ''), ck = clsKey(), tk = TRK[st.trust], trustOf = p => D.cById[p.owner].pid === p.id ? D.cById[p.owner].trust : 'verified';
    return D.P.filter(p => { const c = D.cById[p.owner]; return (!q || p.addr.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || (dig.length >= 4 && p.bbl.replace(/\D/g, '').includes(dig))) && (!ck || c.cls === ck) && (!tk || trustOf(p) === tk) && (st.sig === 'All signals' || (c.pid === p.id && c.signal === st.sig)); }).sort((a, b) => D.cById[b.owner].score - D.cById[a.owner].score); };
  const active = k => st[k] !== OPTS[k][0];
  const hasFilters = () => !!st.q || ['cls', 'trust', 'sig'].some(active);

  const head = () => ({ title: 'Database', large: true, actions: ui.iconBtn({ ic: 'magnifying-glass', aria: 'Search everything', act: 'palette', arg: 'search' }) });
  const switcher = () => `<nav class="segmented" data-fill aria-label="Database">${[['contacts', 'Contacts'], ['properties', 'Properties']].map(([k, l]) => `<a class="segmented__item" href="${href(k)}"${k === kind ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav>`;
  const tools = () => `<label class="ds-asearch">${icon('magnifying-glass')}<input id="db-q" type="search" aria-label="Search ${kind}" placeholder="${isC ? 'Name, phone, email or address' : 'Address or BBL'}" value="${esc(st.q)}" data-input="q" autocomplete="off"></label>
    <div class="ds-achips" role="group" aria-label="Filters">${hasFilters() ? `<button type="button" class="ds-fchip" data-act="clear">${icon('x')}Clear</button>` : ''}${['cls', 'trust', 'sig'].map(k => `<button type="button" class="ds-fchip" aria-pressed="${active(k)}" aria-haspopup="dialog" data-act="sheet" data-arg="${k}">${esc(active(k) ? st[k] : TITLE[k])}${icon('caret-down')}</button>`).join('')}<button type="button" class="ds-fchip" aria-pressed="${st.terr}" data-act="terr">${st.terr ? icon('check') : ''}In territory</button></div>`;

  const contactRow = c => `<a class="ds-arow" data-lead href="${href('contact', 'id=' + c.id)}" style="align-items:flex-start">${ui.cls(c.cls)}<span class="ds-arow__body"><span class="ds-arow__title">${esc(c.name)}</span><span class="ds-arow__sub">${esc(c.why)}</span><span style="display:flex;align-items:center;gap:var(--space-2);margin-top:var(--space-1)">${ui.trust(c.trust)}<span class="ds-meta ds-ellipsis">${esc(DS.lastOf(c))}</span></span></span><span class="ds-arow__end font-medium" style="color:var(--fg)">${c.score}</span></a>`;
  const propRow = p => { const c = D.cById[p.owner]; return `<a class="ds-arow" data-lead href="${href('property', 'id=' + p.id)}" style="align-items:flex-start">${ui.cls(c.cls)}<span class="ds-arow__body"><span class="ds-arow__title">${esc(p.addr)}</span><span class="ds-arow__sub">${esc(p.hood)} · ${p.units} units · ${esc(c.name)}</span><span style="display:flex;align-items:center;gap:var(--space-2);margin-top:var(--space-1)">${ui.trust(c.pid === p.id ? c.trust : 'verified')}<span class="ds-meta">${p.signals} ${p.signals === 1 ? 'signal' : 'signals'}</span></span></span><span class="ds-arow__end font-medium" style="color:var(--fg)">${c.score}</span></a>`; };
  const list = () => {
    if (st.data === 'loading') return `<div class="ds-alist" role="status" aria-label="Loading ${kind}">${[62, 48, 70, 55, 66].map(w => `<div class="ds-arow" data-lead aria-hidden="true"><span class="ds-skel" style="width:1.375rem;height:1.375rem;border-radius:var(--radius-sm)"></span><span class="ds-arow__body" style="gap:var(--space-2)"><span class="ds-skel" style="width:${w}%"></span><span class="ds-skel" style="width:${w + 20}%"></span></span></div>`).join('')}</div>`;
    if (st.data === 'error') return `<div class="ds-alist" role="alert" style="padding:var(--space-4)">${ui.empty({ ic: 'warning', tone: 'danger', title: `${isC ? 'Contacts' : 'Properties'} didn’t load`, text: 'The connection to the database timed out. Your filters are kept.', action: ui.btn({ label: 'Try again', ic: 'arrow-clockwise', variant: 'outline', act: 'retry' }) })}</div>`;
    const rows = isC ? contacts() : properties();
    if (!rows.length) return `<div class="ds-alist" style="padding:var(--space-4)">${ui.empty({ title: isC ? 'No contacts match' : 'No properties match', text: 'Try another name, or clear the filters.', action: ui.btn({ label: 'Clear filters', variant: 'outline', act: 'clear' }) })}</div>`;
    return `<p class="ds-meta" style="margin-bottom:calc(var(--space-4) * -1)">${rows.length} ${kind} · sorted by score</p><div class="ds-alist">${rows.map(isC ? contactRow : propRow).join('')}</div>`;
  };
  const sheet = () => { const k = DS.V.sheet; if (!OPTS[k]) return '';
    return ui.sheet({ key: 'filter-' + k, title: TITLE[k], body: `<div class="ds-opts" role="radiogroup" aria-label="${TITLE[k]}">${OPTS[k].map(o => `<button type="button" class="ds-optrow" role="radio" aria-checked="${st[k] === o}" data-act="pick" data-arg="${k}|${esc(o)}"><span>${esc(o)}</span><span class="ds-optrow__mark">${icon('check')}</span></button>`).join('')}</div>` }); };

  DS.define({
    id: kind, nav: 'database', tab: 'database',
    head, scope: () => isC ? 'Contacts' : 'Properties',
    render: () => `<div class="ds-apage">${ui.large('Database', 'Stewart Group')}${switcher()}<div class="ds-asec">${tools()}</div>${list()}</div>`,
    overlays: sheet,
    acts: {
      pick: (el, arg) => { const [k, v] = arg.split('|'); st[k] = v; DS.V.sheet = null; DS.render(); },
      terr: () => { st.terr = !st.terr; DS.render(); },
      clear: () => { st.q = ''; st.cls = 'All classes'; st.trust = 'All trust'; st.sig = 'All signals'; DS.render(); },
      retry: () => { st.data = 'loading'; DS.render(); Nav.advance(() => { st.data = 'ready'; DS.render(); }, 700); },
    },
    inputs: { q: v => { st.q = v; DS.render(); } },
  });
})();
