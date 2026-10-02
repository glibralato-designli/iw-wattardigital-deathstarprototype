/* 05 Database › Contacts and 06 Database › Properties: lists, filters, the table and the peek drawer. */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const kind = document.body.dataset.page === 'properties' ? 'properties' : 'contacts';
  const st = { q: params.get('q') || '', cls: 'All classes', trust: 'All trust', sig: 'All signals', terr: true, list: params.get('list') || 'all', sort: null, data: params.get('data') || 'ready', recentOpen: true, shut: {}, size: '50' };
  const TRK = { Verified: 'verified', 'Single source': 'single', Stale: 'stale', Disputed: 'disputed' }, TRO = { verified: 0, single: 1, stale: 2, disputed: 3 };
  const clsKey = () => st.cls === 'All classes' ? null : st.cls === 'Likely holders' ? 'LH' : st.cls.replace('Class ', '');
  const daysOf = s => { if (s.startsWith('Just')) return 0; if (s.startsWith('Never')) return 99999; const m = s.match(/(\d+)(d|mo)/); return m ? +m[1] * (m[2] === 'mo' ? 30 : 1) : 9999; };
  const sort = () => st.sort || { key: 'score', dir: 'desc' };
  const cmp = (a, b) => typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b));
  const contacts = () => {
    const q = st.q.trim().toLowerCase(), dig = q.replace(/\D/g, ''), ck = clsKey(), tk = TRK[st.trust], s = sort();
    const inList = c => st.list === 'all' || c.cls === st.list || (st.list === 'warm' && c.warm) || (st.list === 'cold' && !c.warm);
    const key = c => ({ name: c.name, prop: D.pById[c.pid].addr, last: daysOf(DS.lastOf(c)), trust: TRO[c.trust], score: c.score })[s.key];
    return D.C.filter(c => inList(c) && (!q || c.name.toLowerCase().includes(q) || c.entity.toLowerCase().includes(q) || D.pById[c.pid].addr.toLowerCase().includes(q) || (dig.length >= 4 && c.phone.replace(/\D/g, '').includes(dig))) && (!ck || c.cls === ck) && (!tk || c.trust === tk) && (st.sig === 'All signals' || c.signal === st.sig)).sort((a, b) => (s.dir === 'asc' ? 1 : -1) * cmp(key(a), key(b)));
  };
  const properties = () => {
    const q = st.q.trim().toLowerCase(), dig = q.replace(/\D/g, ''), ck = clsKey(), tk = TRK[st.trust], s = sort();
    const trustOf = p => D.cById[p.owner].pid === p.id ? D.cById[p.owner].trust : 'verified';
    const key = p => { const c = D.cById[p.owner]; return ({ addr: p.addr, owner: c.name, units: p.units, sf: p.sf, signals: p.signals, trust: TRO[trustOf(p)], score: c.score })[s.key]; };
    return D.P.filter(p => { const c = D.cById[p.owner]; return (!q || p.addr.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || (dig.length >= 4 && p.bbl.replace(/\D/g, '').includes(dig))) && (!ck || c.cls === ck) && (!tk || trustOf(p) === tk) && (st.sig === 'All signals' || (c.pid === p.id && c.signal === st.sig)); }).sort((a, b) => (s.dir === 'asc' ? 1 : -1) * cmp(key(a), key(b)));
  };
  const hasFilters = () => !!st.q || st.cls !== 'All classes' || st.trust !== 'All trust' || st.sig !== 'All signals' || st.list !== 'all';

  const listsNav = () => {
    const recent = (DS.S().recent || []).map(x => D.cById[x] ? [D.cById[x].cls, D.cById[x].name, D.pById[D.cById[x].pid].addr, href('contact', 'id=' + x)] : D.pById[x] ? [D.cById[D.pById[x].owner].cls, D.pById[x].addr, 'Property · ' + D.pById[x].hood, href('property', 'id=' + x)] : null).filter(Boolean).slice(0, 3);
    const group = (h, items) => { const shut = !!st.shut[h], shown = shut ? items.filter(x => x.active) : items; return `<div class="ds-stack" style="gap:1px"><button type="button" class="ds-lists__toggle" aria-expanded="${!shut}" data-act="lg" data-arg="${esc(h)}"><span>${esc(h)}</span>${icon(shut ? 'caret-right' : 'caret-down')}</button>${shown.map(x => x.off ? `<span class="ds-listitem" role="button" tabindex="0" aria-disabled="true" data-tip="${DS.OFF}" data-tip-side="right"><span>${esc(x.l)}</span><span>${x.n}</span></span>` : `<button type="button" class="ds-listitem"${x.active ? ' aria-current="true"' : ''} data-act="list" data-arg="${x.k}"><span>${esc(x.l)}</span><span>${x.n}</span></button>`).join('')}</div>`; };
    return `<nav class="ds-lists" aria-label="Lists">${recent.length ? `<div class="ds-stack" data-gap="2" style="gap:var(--space-1)"><button type="button" class="ds-lists__toggle" aria-expanded="${st.recentOpen}" data-act="recent">${icon('clock')}<span>Recently viewed</span>${icon(st.recentOpen ? 'caret-down' : 'caret-right')}</button>${st.recentOpen ? `<div class="ds-recent">${recent.map(([cl, t, s, l]) => `<a class="ds-row" href="${l}">${ui.cls(cl)}<span class="ds-row__body"><span class="ds-row__title">${esc(t)}</span><span class="ds-row__sub">${esc(s)}</span></span></a>`).join('')}</div>` : ''}</div>` : ''}
      ${group('Lists', [...D.lists.map(([k, l, n]) => ({ k, l, n, active: st.list === k })), ...(DS.S().lists || []).map(l => ({ l, n: 12, off: true })), ...D.listsOff.map(([l, n]) => ({ l, n, off: true }))])}${group('By neighborhood', D.hoods.map(([l, n]) => ({ l, n, off: true })))}</nav>`;
  };
  const filters = count => `<div class="ds-toolbar">
    <label class="ds-input-icon" style="flex:0 0 16.25rem">${icon('magnifying-glass')}<input id="db-q" aria-label="Search" placeholder="${kind === 'contacts' ? 'Name, phone, email or address' : 'Address or BBL'}" value="${esc(st.q)}" data-input="q" autocomplete="off"></label>
    ${[['Class', 'cls', ['All classes', 'Class A', 'Class B', 'Class C', 'Class D', 'Likely holders']], ['Trust', 'trust', ['All trust', 'Verified', 'Single source', 'Stale', 'Disputed']], ['Signal type', 'sig', ['All signals', 'Loan maturity', 'Estate transition', 'Long hold', 'Unused FAR', 'Lis pendens', 'Nearby sale', 'Recent refinance']]].map(([l, k, opts]) => `<span class="select"><select class="field__control" id="db-${k}" aria-label="${l}" data-change="${k}">${opts.map(o => `<option${o === st[k] ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select></span>`).join('')}
    <button type="button" class="ds-switch-btn" role="switch" aria-checked="${st.terr}" data-act="terr"><span class="ds-switch-btn__track" data-flip="terr-t"><span data-flip="terr-k"></span></span>In territory</button>
    ${kind === 'properties' ? `<button type="button" class="button" data-variant="outline" aria-disabled="true" data-tip="${DS.OFF}">${icon('funnel-simple')}Prospects view</button>` : ''}
    ${hasFilters() ? ui.btn({ label: 'Clear', variant: 'ghost', act: 'clear' }) : ''}<span class="ds-grow"></span><span class="ds-meta">${count} ${kind}</span></div>`;
  const head = cols => `<div class="ds-tr" data-head role="row">${cols.map(([key, l, right]) => key === 'reset'
    ? (st.sort && !(st.sort.key === 'score' && st.sort.dir === 'desc') ? `<button type="button" class="ds-reset-sort" aria-label="Reset sorting" data-tip="Sorted by ${esc(st.sort.key)}, ${st.sort.dir === 'asc' ? 'ascending' : 'descending'} · Reset" data-act="reset-sort">${icon('arrow-clockwise')}</button>` : `<span class="ds-reset-sort" aria-hidden="true" aria-disabled="true">${icon('arrow-clockwise')}</span>`)
    : key ? `<button type="button" class="ds-sort" role="columnheader" aria-sort="${sort().key === key ? (sort().dir === 'asc' ? 'ascending' : 'descending') : 'none'}"${sort().key === key ? ' data-on' : ''}${right ? ' data-right' : ''} data-act="sort" data-arg="${key}">${esc(l)}${icon(sort().key === key ? (sort().dir === 'asc' ? 'caret-up' : 'caret-down') : 'arrows-down-up')}</button>`
    : `<span role="columnheader"${right ? ' class="ds-td-right"' : ''}>${esc(l)}</span>`).join('')}</div>`;
  const pager = (shown, total) => { const n = Math.max(1, Math.ceil(total / Number(st.size))), nums = n <= 6 ? [...Array(n)].map((_, i) => i + 1) : [1, 2, 3, 'gap', n];
    return `<div class="ds-pager"><span class="ds-grow">Showing ${shown} of ${DS.loc(total)} ${kind} · Page 1 of ${n}</span><label>Rows per page<select aria-label="Rows per page" data-change="size">${['25', '50', '100'].map(o => `<option${o === st.size ? ' selected' : ''}>${o}</option>`).join('')}</select></label>
      <nav class="ds-pages" aria-label="Pagination"><span class="ds-page-n" aria-label="Previous page" aria-disabled="true" style="color:var(--fg-disabled)">${icon('caret-left')}</span>${nums.map(x => x === 'gap' ? '<span class="ds-meta" aria-hidden="true">…</span>' : x === 1 ? '<span class="ds-page-n" aria-current="page">1</span>' : `<span class="ds-page-n" role="button" tabindex="0" aria-disabled="true" aria-label="Page ${x}" data-tip="${DS.OFF}" data-tip-side="top">${x}</span>`).join('')}<span class="ds-page-n" role="button" tabindex="0" aria-label="Next page" aria-disabled="true" data-tip="${DS.OFF}" data-tip-side="top">${icon('caret-right')}</span></nav></div>`; };
  const skeleton = () => `<div role="status" aria-live="polite" aria-label="Loading ${kind}">${[62, 48, 70, 55, 66, 44].map((w, i) => `<div class="ds-tr" aria-hidden="true" style="cursor:default"><span class="ds-skel" style="height:1.375rem;width:1.375rem;border-radius:var(--radius-sm)"></span><span class="ds-stack" style="gap:var(--space-1-5)"><span class="ds-skel" style="width:${w}%"></span><span class="ds-skel" style="width:${[80, 64, 72, 90, 58, 76][i]}%"></span></span><span class="ds-skel" style="width:${w}%"></span><span class="ds-skel" style="width:${[80, 64, 72, 90, 58, 76][i]}%"></span><span class="ds-skel" style="width:70%"></span><span class="ds-skel" style="height:1.375rem;width:4.5rem;border-radius:var(--radius-full)"></span><span class="ds-skel"></span>${kind === 'properties' ? '<span class="ds-skel"></span>' : ''}</div>`).join('')}</div>`;
  const selected = (k, x) => DS.V.peek && DS.V.peek.k === k && DS.V.peek.id === x;
  const table = () => {
    const isC = kind === 'contacts', rows = isC ? contacts() : properties(), total = isC ? (D.lists.find(l => l[0] === st.list) || D.lists[0])[2] : 412;
    const cols = isC ? [['reset'], ['name', 'Name'], ['prop', 'Lead property'], [null, 'Why now'], ['last', 'Last touch'], ['trust', 'Trust'], ['score', 'Score', true]] : [['reset'], ['addr', 'Address'], ['owner', 'Owner'], ['units', 'Units', true], ['sf', 'Gross SF', true], ['signals', 'Signals', true], ['trust', 'Trust'], ['score', 'Score', true]];
    let body;
    if (st.data === 'loading') body = skeleton();
    else if (st.data === 'error') body = `<div role="alert" style="border-top:var(--border-width) solid var(--border-subtle)">${ui.empty({ ic: 'warning', tone: 'danger', title: `${isC ? 'Contacts' : 'Properties'} didn’t load`, text: 'The connection to the database timed out. Your filters are kept.', action: ui.btn({ label: 'Try again', ic: 'arrow-clockwise', variant: 'outline', act: 'retry' }) })}</div>`;
    else if (!rows.length) body = ui.empty({ title: isC ? 'No contacts match' : 'No properties match', text: 'Try another name, or clear the filters.', action: ui.btn({ label: 'Clear filters', variant: 'outline', act: 'clear' }) });
    else body = rows.map(r => {
      if (isC) { const c = r; return `<div class="ds-tr" role="row" aria-selected="${selected('c', c.id)}" data-act="row" data-arg="c:${c.id}">${ui.cls(c.cls)}<span class="ds-td-name"><button type="button" data-act="row" data-arg="c:${c.id}">${esc(c.name)}</button><span class="ds-row__sub">${esc(c.entity + ' · ' + DS.portfolio(c).length + ' props')}</span></span><span class="ds-ellipsis">${esc(D.pById[c.pid].addr)}</span><span class="ds-ellipsis muted" title="${esc(c.why)}">${esc(c.why)}</span><span class="ds-meta-strong ds-ellipsis" title="${esc(DS.lastOf(c))}">${esc(DS.lastOf(c))}</span><span>${ui.trust(c.trust)}</span><span class="ds-td-right font-medium num">${c.score}</span></div>`; }
      const p = r, c = D.cById[p.owner]; return `<div class="ds-tr" role="row" aria-selected="${selected('p', p.id)}" data-act="row" data-arg="p:${p.id}">${ui.cls(c.cls)}<span class="ds-td-name"><button type="button" data-act="row" data-arg="p:${p.id}">${esc(p.addr)}</button><span class="ds-row__sub">${esc(p.hood + ' · ' + p.zip)}</span></span><span class="ds-ellipsis">${esc(c.name)}</span><span class="ds-td-right num">${p.units}</span><span class="ds-td-right num">${DS.loc(p.sf)}</span><span class="ds-td-right num">${p.signals}</span><span>${ui.trust(c.pid === p.id ? c.trust : 'verified')}</span><span class="ds-td-right font-medium num">${c.score}</span></div>`;
    }).join('');
    return `<div class="ds-stack" data-gap="3">${filters(st.data === 'ready' ? rows.length : 0)}<div class="ds-table" data-kind="${kind}" role="table" aria-label="${isC ? 'Contacts' : 'Properties'}">${head(cols)}${body}${pager(st.data === 'ready' ? rows.length : 0, total)}</div></div>`;
  };

  DS.define({
    id: kind, nav: 'database', brain: 'min',
    crumbs: () => [{ l: 'Database', page: 'contacts' }, { l: kind === 'contacts' ? 'Contacts' : 'Properties' }],
    scope: () => 'Database',
    init: () => { const pk = params.get('peek'); if (pk) { const k = D.cById[pk] ? 'c' : D.pById[pk] ? 'p' : null; if (k) DS.V.peek = { k, id: pk, tab: params.get('peektab') || 'overview', mode: params.get('peekmode') || 'side' }; } },
    peekList: () => kind === 'contacts' ? contacts().map(c => ['c', c.id]) : properties().map(p => ['p', p.id]),
    render: () => `<div class="ds-page">${ui.pageHead('Database', ui.tabs(D.databaseTabs, kind, 'Database'))}<div class="ds-db"${kind === 'properties' ? ' data-full' : ''}>${kind === 'contacts' ? listsNav() : ''}${table()}</div></div>`,
    acts: {
      row: (el, arg, ev) => { ev.stopPropagation(); const [k, x] = arg.split(':'); if (selected(k, x)) { DS.V.peek = null; DS.render(); return; } DS.openPeek(k, x); },
      list: (el, k) => { st.list = k; DS.V.peek = null; DS.render(); },
      lg: (el, h) => { st.shut[h] = !st.shut[h]; DS.render(); },
      recent: () => { st.recentOpen = !st.recentOpen; DS.render(); },
      terr: () => { st.terr = !st.terr; DS.render(); },
      clear: () => { Object.assign(st, { q: '', cls: 'All classes', trust: 'All trust', sig: 'All signals', list: 'all' }); DS.render(); },
      sort: (el, key) => { const cur = sort(); st.sort = cur.key === key ? { key, dir: cur.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: ['name', 'prop', 'addr', 'owner', 'trust', 'last'].includes(key) ? 'asc' : 'desc' }; DS.render(); },
      'reset-sort': () => { st.sort = null; DS.render(); },
      retry: () => { st.data = 'loading'; DS.render(); setTimeout(() => { st.data = 'ready'; DS.render(); }, 900); },
    },
    inputs: { q: v => { st.q = v; DS.render(); }, cls: v => { st.cls = v; DS.render(); }, trust: v => { st.trust = v; DS.render(); }, sig: v => { st.sig = v; DS.render(); }, size: v => { st.size = v; DS.render(); } },
  });
})();
