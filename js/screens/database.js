/* 05 Database › Contacts and 06 Database › Properties: lists, the criteria builder (contacts) or filters (properties), the table and the peek drawer.
   Contacts: a list is a stack of criteria chips (DS.crit), AND across chips and OR within one, with a live count at database scale,
   Save as list and Push to queue. Every "Turn into a list" in the product links here with its chips (crit=…). */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const kind = document.body.dataset.page === 'properties' ? 'properties' : 'contacts';
  const b = { crit: [], edit: null, sugg: [], from: null, saving: null, savedId: null, push: null, pushed: null };
  const st = { q: params.get('q') || '', cls: 'All classes', trust: 'All trust', sig: 'All signals', terr: params.get('terr') !== '0', list: params.get('list') || 'all', sort: null, data: params.get('data') || 'ready', recentOpen: true, shut: {}, size: '50' };
  /* Builder presets: crit=<chips> (empty for none), list=<key>, edit=<chip key>|add, sugg=<chips offered>, from=<where it came from>,
     saved=1 (saved to Lists), push=phone|mail|cc (confirming), pushed=phone|mail|cc (queued). */
  const CR = DS.crit, S0 = DS.S();
  const LISTS = D.lists.map(([k, l, n]) => ({ k, l, n, crit: D.listCrit[k] }));
  const FROM = { reporting: ['Who to call', 'reporting'], listings: ['Listings', 'listings'], 'web-analytics': ['Website', 'web-analytics'], 'outreach-performance': ['Performance', 'outreach-performance'], brain: ['Brain', 'brain'], 'attack-plan': ['Today', 'attack-plan'], headlines: ['Headlines', 'headlines'] };
  const CH = { phone: ['Phone', 'Terrakotta', 'phone'], mail: ['Mail merge', 'Gmail', 'envelope-simple'], cc: ['Constant Contact', 'Constant Contact', 'megaphone'] };
  const listPreset = k => (LISTS.find(l => l.k === k) || {}).crit;
  b.crit = CR.parse(params.has('crit') ? params.get('crit') : params.has('list') ? listPreset(params.get('list')) || '' : st.terr ? 'terr:1' : '');
  b.edit = params.get('edit') || null; b.sugg = CR.parse(params.get('sugg') || ''); b.from = FROM[params.get('from')] || null;
  if (params.get('saved') === '1') b.savedId = DS.saveList(CR.name(b.crit), CR.str(b.crit));
  if (CH[params.get('push')]) b.push = params.get('push');
  if (CH[params.get('pushed')]) { const n = CR.count(b.crit); S0.queues = [...(S0.queues || []), { name: CR.name(b.crit), ch: params.get('pushed'), n }]; b.pushed = { ch: params.get('pushed'), n }; }
  const TRK = { Verified: 'verified', 'Single source': 'single', Stale: 'stale', Disputed: 'disputed' }, TRO = { verified: 0, single: 1, stale: 2, disputed: 3 };
  const clsKey = () => st.cls === 'All classes' ? null : st.cls === 'Likely holders' ? 'LH' : st.cls.replace('Class ', '');
  const daysOf = s => { if (s.startsWith('Just')) return 0; if (s.startsWith('Never')) return 99999; const m = s.match(/(\d+)(d|mo)/); return m ? +m[1] * (m[2] === 'mo' ? 30 : 1) : 9999; };
  // Owners sort by rank, buildings by their own score.
  const defSort = () => kind === 'contacts' ? { key: 'rank', dir: 'asc' } : { key: 'score', dir: 'desc' };
  const sort = () => st.sort || defSort();
  const cmp = (a, b) => typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b));
  const contacts = () => {
    const q = st.q.trim().toLowerCase(), dig = q.replace(/\D/g, ''), s = sort();
    const key = c => ({ name: c.name, prop: D.pById[c.pid].addr, last: daysOf(DS.lastOf(c)), trust: TRO[c.trust], rank: c.rank })[s.key];
    return CR.rows(b.crit).filter(c => !q || c.name.toLowerCase().includes(q) || c.entity.toLowerCase().includes(q) || D.pById[c.pid].addr.toLowerCase().includes(q) || (q.length >= 3 && DS.emailsOf(c).some(e => e.includes(q))) || (dig.length >= 4 && c.phone.replace(/\D/g, '').includes(dig))).sort((a, b2) => (s.dir === 'asc' ? 1 : -1) * cmp(key(a), key(b2)));
  };
  const properties = () => {
    const q = st.q.trim().toLowerCase(), dig = q.replace(/\D/g, ''), ck = clsKey(), tk = TRK[st.trust], s = sort();
    const trustOf = p => D.cById[p.owner].pid === p.id ? D.cById[p.owner].trust : 'verified';
    const key = p => { const c = D.cById[p.owner]; return ({ addr: p.addr, owner: c.name, units: p.units, sf: p.sf, signals: p.signals, trust: TRO[trustOf(p)], score: p.score })[s.key]; };
    return D.P.filter(p => { const c = D.cById[p.owner]; return (!st.terr || p.terr) && (!q || p.addr.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || (dig.length >= 4 && p.bbl.replace(/\D/g, '').includes(dig))) && (!ck || p.cls === ck) && (!tk || trustOf(p) === tk) && (st.sig === 'All signals' || (c.pid === p.id && c.signal === st.sig)); }).sort((a, b) => (s.dir === 'asc' ? 1 : -1) * cmp(key(a), key(b)));
  };
  const hasFilters = () => kind === 'contacts' ? !!st.q || CR.on(b.crit).length > 0 : !!st.q || st.cls !== 'All classes' || st.trust !== 'All trust' || st.sig !== 'All signals';
  const critStr = () => CR.str(b.crit);

  const listsNav = () => {
    const recent = (DS.S().recent || []).map(x => D.cById[x] ? [D.cById[x].cls, D.cById[x].name, D.pById[D.cById[x].pid].addr, href('contact', 'id=' + x)] : D.pById[x] ? [D.cById[D.pById[x].owner].cls, D.pById[x].addr, 'Property · ' + D.pById[x].hood, href('property', 'id=' + x)] : null).filter(Boolean).slice(0, 3);
    const group = (h, items) => { const shut = !!st.shut[h], shown = shut ? items.filter(x => x.active) : items; return `<div class="ds-stack" style="gap:1px"><button type="button" class="ds-lists__toggle" aria-expanded="${!shut}" data-act="lg" data-arg="${esc(h)}"><span>${esc(h)}</span>${icon(shut ? 'caret-right' : 'caret-down')}</button>${shown.map(x => x.off ? `<span class="ds-listitem" role="button" tabindex="0" aria-disabled="true" data-tip="${DS.OFF}" data-tip-side="right"><span>${esc(x.l)}</span><span>${DS.loc(x.n)}</span></span>` : `<button type="button" class="ds-listitem"${x.active ? ' aria-current="true"' : ''}${x.fresh ? ' data-anim="rise" data-key="list-' + esc(x.k) + '"' : ''} data-act="list" data-arg="${esc(x.k)}"><span>${esc(x.l)}</span><span>${DS.loc(x.n)}</span></button>`).join('')}</div>`; };
    return `<nav class="ds-lists" aria-label="Lists">${recent.length ? `<div class="ds-stack" data-gap="2" style="gap:var(--space-1)"><button type="button" class="ds-lists__toggle" aria-expanded="${st.recentOpen}" data-act="recent">${icon('clock')}<span>Recently viewed</span>${icon(st.recentOpen ? 'caret-down' : 'caret-right')}</button>${st.recentOpen ? `<div class="ds-recent">${recent.map(([cl, t, s, l]) => `<a class="ds-row" href="${l}">${ui.cls(cl)}<span class="ds-row__body"><span class="ds-row__title">${esc(t)}</span><span class="ds-row__sub">${esc(s)}</span></span></a>`).join('')}</div>` : ''}</div>` : ''}
      ${group('Lists', [...LISTS.map(x => ({ k: 'p:' + x.k, l: x.l, n: x.n, active: critStr() === x.crit })), ...D.listsOff.map(([l, n]) => ({ l, n, off: true }))])}
      ${DS.savedLists().length ? group('Saved lists', DS.savedLists().map(x => ({ k: 's:' + x.id, l: x.name, n: CR.count(CR.parse(x.crit)), active: critStr() === x.crit, fresh: x.id === b.savedId }))) : ''}
      ${group('By neighborhood', D.hoods.map(([l, n]) => ({ k: 'h:' + l, l, n, active: critStr() === 'hood:' + l })))}</nav>`;
  };
  const editor = () => {
    if (b.edit === 'add') { const have = b.crit.map(it => it.k); return `<section class="ds-crit-edit" aria-label="Add criteria" data-anim="grow" data-key="crit-add"><div class="ds-crit-edit__head"><b>Add criteria</b><span class="ds-meta">Each one narrows the list. Values inside one criterion widen it.</span><span class="ds-grow"></span>${ui.btn({ label: 'Done', variant: 'outline', size: 'sm', act: 'crit-close' })}</div><div class="ds-crit-types">${CR.ORDER.filter(k => !have.includes(k)).map(k => `<button type="button" class="ds-crit-type" data-act="crit-add" data-arg="${k}">${icon(CR.DEF[k].ic)}${esc(CR.DEF[k].l)}</button>`).join('')}</div></section>`; }
    const it = b.crit.find(x => x.k === b.edit); if (!it) return '';
    const d = CR.DEF[it.k], pill = (v, l, on, act = 'crit-opt') => `<button type="button" class="ds-pill-btn" aria-pressed="${on}" data-act="${act}" data-arg="${esc(it.k + '|' + v)}">${esc(l)}</button>`;
    let body;
    if (d.range) { const [a = '', z = ''] = (it.v[0] || '').split('-'); body = `<div class="ds-toolbar" style="gap:var(--space-1-5)">${d.picks.map(([v, l]) => pill(v, l, it.v[0] === v, 'crit-pick')).join('')}</div><div class="ds-crit-range"><div class="field"><label class="field__label" for="crit-min">Minimum</label><input id="crit-min" class="field__control" type="number" min="0" inputmode="numeric" value="${esc(a)}" data-change="critMin"></div><span class="ds-meta" aria-hidden="true">to</span><div class="field"><label class="field__label" for="crit-max">Maximum</label><input id="crit-max" class="field__control" type="number" min="0" inputmode="numeric" value="${esc(z)}" data-change="critMax"></div></div>`; }
    else if (d.groups) body = d.groups.map(g => { const os = d.opts.filter(([v]) => v.startsWith(g)); return os.length ? `<div class="ds-crit-group"><span class="ds-meta">${esc(g)}</span><div class="ds-toolbar" style="gap:var(--space-1-5)">${os.map(([v, l]) => pill(v, l.replace(g + ' ', ''), it.v.includes(v))).join('')}</div></div>` : ''; }).join('');
    else body = `<div class="ds-toolbar" style="gap:var(--space-1-5)"${d.one ? ' role="radiogroup"' : ''}>${d.opts.map(([v, l]) => pill(v, l, it.v.includes(v))).join('')}</div>`;
    if (d.years) { const [y0, y1] = it.yr || [null, null], sel = (id, k, cur) => `<span class="select"><select id="${id}" class="field__control" data-size="sm" aria-label="${k === 'critFrom' ? 'From year' : 'To year'}" data-change="${k}"><option value="">Any year</option>${CR.years.map(y => `<option${y === cur ? ' selected' : ''}>${y}</option>`).join('')}</select></span>`;
      body += `<div class="ds-crit-range"><span class="field__label">Years</span>${sel('crit-from', 'critFrom', y0)}<span class="ds-meta" aria-hidden="true">to</span>${sel('crit-to', 'critTo', y1)}</div><span class="ds-meta">From the team’s archive. Kept separate from the predictive score.</span>`; }
    const n = CR.count(b.crit);
    return `<section class="ds-crit-edit" aria-label="Edit ${esc(d.l)}" data-anim="grow" data-key="crit-edit-${it.k}"><div class="ds-crit-edit__head">${icon(d.ic)}<b>${esc(d.l)}</b><span class="ds-meta">${d.one ? 'Pick one' : d.range ? 'Pick a range' : 'Pick one or more · matches any of them'}</span><span class="ds-grow"></span><span class="ds-meta num" aria-live="polite">${DS.loc(n)} match</span>${ui.btn({ label: 'Done', variant: 'outline', size: 'sm', act: 'crit-close' })}</div>${body}</section>`;
  };
  const actions = () => {
    const n = CR.count(b.crit), rows = CR.rows(b.crit), on = CR.on(b.crit).length, name = CR.name(b.crit);
    if (b.saving !== null) return `<div class="ds-crit-confirm" data-anim="grow" data-key="crit-save"><div class="field ds-grow"><label class="field__label" for="list-name">List name</label><input id="list-name" class="field__control" value="${esc(b.saving)}" data-input="listName" data-enter="save-list" autocomplete="off"></div>${ui.btn({ label: 'Save list', act: 'save-list' })}${ui.btn({ label: 'Cancel', variant: 'outline', act: 'cancel-save' })}</div>`;
    if (b.push) { const [l, via] = CH[b.push], ok = b.push === 'phone' ? rows.filter(c => c.status !== 'Do not contact' && DS.badOf(c).length < 2).length : rows.filter(c => c.status !== 'Do not contact').length;
      const note = b.push === 'phone' ? 'Only verified and confirmed numbers go to Terrakotta. Owners who asked not to be contacted are left out.' : b.push === 'mail' ? 'Sends from your Gmail with your mail-merge template. Opt-outs are left out.' : 'Synced to Constant Contact as a list. Anyone excluded from blasts is left out.';
      return `<section class="ds-crit-confirm" aria-label="Push to queue" data-anim="grow" data-key="crit-push"><div class="ds-stack" data-gap="2" style="gap:var(--space-2);flex:1;min-width:16rem"><b>Push ${DS.loc(n)} owners to a queue</b><div class="ds-toolbar" style="gap:var(--space-1-5)" role="radiogroup" aria-label="Queue">${Object.entries(CH).map(([k, [cl, v, ic]]) => `<button type="button" class="ds-pill-btn" role="radio" aria-checked="${b.push === k}" aria-pressed="${b.push === k}" data-act="push-ch" data-arg="${k}">${icon(ic)}${esc(cl)}</button>`).join('')}</div><span class="ds-meta">${esc(note)} ${ok} of the ${rows.length} demo rows qualify.</span></div>${ui.btn({ label: 'Push ' + DS.loc(n) + ' to ' + l, act: 'push-go' })}${ui.btn({ label: 'Cancel', variant: 'outline', act: 'push-cancel' })}</section>`; }
    return '';
  };
  const builder = () => {
    const n = CR.count(b.crit), on = CR.on(b.crit).length, sugg = b.sugg.filter(x => !b.crit.some(y => y.k === x.k));
    const saved = DS.savedLists().find(x => x.id === b.savedId), queued = b.pushed;
    return `<section class="ds-builder" aria-label="List criteria">
      <div class="ds-builder__bar">${b.from ? `<a class="ds-crit-from" href="${href(b.from[1])}">${icon('caret-left')}From ${esc(b.from[0])}</a>` : ''}${b.crit.map(it => ui.critChip(it, { editing: b.edit === it.k })).join('')}${sugg.map(it => ui.critChip(it, { suggest: true })).join('')}
        <button type="button" class="ds-crit-addbtn" aria-expanded="${b.edit === 'add'}" data-act="crit-open-add">${icon('plus')}Add criteria</button>${on ? ui.btn({ label: 'Clear', variant: 'ghost', size: 'sm', act: 'clear' }) : ''}</div>
      ${b.edit ? editor() : ''}
      <div class="ds-builder__foot"><span class="ds-builder__count" aria-live="polite"><b class="num">${DS.loc(n)}</b> ${n === 1 ? 'owner matches' : 'owners match'}${on > 1 ? '<span class="ds-meta"> · every criterion must match</span>' : on ? '' : '<span class="ds-meta"> · the whole database. Add criteria to build a list.</span>'}</span><span class="ds-grow"></span>
        ${ui.btn({ label: 'Save as list', ic: 'list-bullets', variant: 'outline', act: 'open-save' })}${ui.btn({ label: 'Push to queue', ic: 'arrow-up-right', variant: b.push ? 'outline' : null, act: 'open-push' })}</div>
      ${actions()}
      ${saved && !b.saving ? `<div class="ds-crit-done">${ui.approved('Saved to Lists · ' + saved.name)}</div>` : ''}
      ${queued ? `<div class="ds-crit-done">${ui.approved('Queued for ' + CH[queued.ch][0] + ' · ' + DS.loc(queued.n) + ' owners')}<span class="ds-meta">Home now shows ${3 + DS.queues().length} queues ready.</span><a class="ds-link-btn" href="${href('home')}">Go to Home${icon('caret-right')}</a></div>` : ''}
    </section>`;
  };
  const filters = count => kind === 'contacts' ? `<div class="ds-toolbar"><label class="ds-input-icon ds-dbsearch">${icon('magnifying-glass')}<input id="db-q" aria-label="Search" placeholder="Name, phone, email or address" value="${esc(st.q)}" data-input="q" autocomplete="off"></label><span class="ds-grow"></span><span class="ds-meta">${count} demo rows</span></div>${builder()}` : `<div class="ds-toolbar">
    <label class="ds-input-icon ds-dbsearch">${icon('magnifying-glass')}<input id="db-q" aria-label="Search" placeholder="${kind === 'contacts' ? 'Name, phone, email or address' : 'Address or BBL'}" value="${esc(st.q)}" data-input="q" autocomplete="off"></label>
    ${[['Class', 'cls', ['All classes', 'Class A', 'Class B', 'Class C', 'Class D', 'Likely holders']], ['Trust', 'trust', ['All trust', 'Verified', 'Single source', 'Stale', 'Disputed']], ['Signal type', 'sig', ['All signals', 'Loan maturity', 'Estate transition', 'Long hold', 'Unused FAR', 'Lis pendens', 'Nearby sale', 'Recent refinance']]].map(([l, k, opts]) => `<span class="select"><select class="field__control" id="db-${k}" aria-label="${l}" data-change="${k}">${opts.map(o => `<option${o === st[k] ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select></span>`).join('')}
    <button type="button" class="ds-switch-btn" role="switch" aria-checked="${st.terr}" data-act="terr" data-tip="${esc(D.TERRITORY.name + ' · ' + D.TERRITORY.sub)}"><span class="ds-switch-btn__track" data-flip="terr-t"><span data-flip="terr-k"></span></span>In territory</button>
    ${kind === 'properties' ? `<button type="button" class="button" data-variant="outline" aria-disabled="true" data-tip="${DS.OFF}">${icon('funnel-simple')}Prospects view</button>` : ''}
    ${hasFilters() ? ui.btn({ label: 'Clear', variant: 'ghost', act: 'clear' }) : ''}<span class="ds-grow"></span><span class="ds-meta">${count} ${kind}</span></div>`;
  const head = cols => `<div class="ds-tr" data-head role="row">${cols.map(([key, l, right]) => key === 'reset'
    ? (st.sort && !(st.sort.key === defSort().key && st.sort.dir === defSort().dir) ? `<button type="button" class="ds-reset-sort" aria-label="Reset sorting" data-tip="Sorted by ${esc(st.sort.key)}, ${st.sort.dir === 'asc' ? 'ascending' : 'descending'} · Reset" data-act="reset-sort">${icon('arrow-clockwise')}</button>` : `<span class="ds-reset-sort" aria-hidden="true" aria-disabled="true">${icon('arrow-clockwise')}</span>`)
    : key ? `<button type="button" class="ds-sort" role="columnheader" aria-sort="${sort().key === key ? (sort().dir === 'asc' ? 'ascending' : 'descending') : 'none'}"${sort().key === key ? ' data-on' : ''}${right ? ' data-right' : ''} data-act="sort" data-arg="${key}">${esc(l)}${icon(sort().key === key ? (sort().dir === 'asc' ? 'caret-up' : 'caret-down') : 'arrows-down-up')}</button>`
    : `<span role="columnheader"${right ? ' class="ds-td-right"' : ''}>${esc(l)}</span>`).join('')}</div>`;
  const pager = (shown, total) => { const n = Math.max(1, Math.ceil(total / Number(st.size))), nums = n <= 6 ? [...Array(n)].map((_, i) => i + 1) : [1, 2, 3, 'gap', n];
    return `<div class="ds-pager"><span class="ds-grow">Showing ${shown} of ${DS.loc(total)} ${kind} · Page 1 of ${n}</span><label>Rows per page<select aria-label="Rows per page" data-change="size">${['25', '50', '100'].map(o => `<option${o === st.size ? ' selected' : ''}>${o}</option>`).join('')}</select></label>
      <nav class="ds-pages" aria-label="Pagination"><span class="ds-page-n" aria-label="Previous page" aria-disabled="true" style="color:var(--fg-disabled)">${icon('caret-left')}</span>${nums.map(x => x === 'gap' ? '<span class="ds-meta" aria-hidden="true">…</span>' : x === 1 ? '<span class="ds-page-n" aria-current="page">1</span>' : `<span class="ds-page-n" role="button" tabindex="0" aria-disabled="true" aria-label="Page ${x}" data-tip="${DS.OFF}" data-tip-side="top">${x}</span>`).join('')}<span class="ds-page-n" role="button" tabindex="0" aria-label="Next page" aria-disabled="true" data-tip="${DS.OFF}" data-tip-side="top">${icon('caret-right')}</span></nav></div>`; };
  const skeleton = () => `<div role="status" aria-live="polite" aria-label="Loading ${kind}">${[62, 48, 70, 55, 66, 44].map((w, i) => `<div class="ds-tr" aria-hidden="true" style="cursor:default"><span class="ds-skel" style="height:1.375rem;width:1.375rem;border-radius:var(--radius-sm)"></span><span class="ds-stack" style="gap:var(--space-1-5)"><span class="ds-skel" style="width:${w}%"></span><span class="ds-skel" style="width:${[80, 64, 72, 90, 58, 76][i]}%"></span></span><span class="ds-skel" style="width:${w}%"></span><span class="ds-skel" style="width:${[80, 64, 72, 90, 58, 76][i]}%"></span><span class="ds-skel" style="width:70%"></span><span class="ds-skel" style="height:1.375rem;width:4.5rem;border-radius:var(--radius-full)"></span><span class="ds-skel"></span>${kind === 'properties' ? '<span class="ds-skel"></span>' : ''}</div>`).join('')}</div>`;
  const selected = (k, x) => DS.V.peek && DS.V.peek.k === k && DS.V.peek.id === x;
  const table = () => {
    const isC = kind === 'contacts', rows = isC ? contacts() : properties(), total = isC ? CR.count(b.crit) : st.terr ? D.DB.propsInTerritory : D.DB.properties;
    const cols = isC ? [['reset'], ['name', 'Name'], ['prop', 'Lead property'], [null, 'Why now'], ['last', 'Last touch'], ['trust', 'Trust'], ['rank', 'Rank', true]] : [['reset'], ['addr', 'Address'], ['owner', 'Owner'], ['units', 'Units', true], ['sf', 'Gross SF', true], ['signals', 'Signals', true], ['trust', 'Trust'], ['score', 'Score', true]];
    let body;
    if (st.data === 'loading') body = skeleton();
    else if (st.data === 'error') body = `<div role="alert" style="border-top:var(--border-width) solid var(--border-subtle)">${ui.empty({ ic: 'warning', tone: 'danger', title: `${isC ? 'Contacts' : 'Properties'} didn’t load`, text: 'The connection to the database timed out. Your filters are kept.', action: ui.btn({ label: 'Try again', ic: 'arrow-clockwise', variant: 'outline', act: 'retry' }) })}</div>`;
    else if (!rows.length && isC && !st.q && CR.on(b.crit).length) body = ui.empty({ ic: 'list-bullets', title: DS.loc(total) + ' owners match in the database', text: 'None of them are in this demo’s sample rows. In the full database they list here.', action: ui.btn({ label: 'Clear criteria', variant: 'outline', act: 'clear' }) });
    else if (!rows.length && isC) { const keep = b.crit, outside = b.crit.some(it => it.k === 'terr') ? (b.crit = b.crit.filter(it => it.k !== 'terr'), contacts().length) : 0; b.crit = keep;
      body = outside ? ui.empty({ title: 'No contacts match in the territory', text: outside + (outside === 1 ? ' match is' : ' matches are') + ' outside ' + D.TERRITORY.name + '.', action: ui.btn({ label: 'Include outside the territory', variant: 'outline', act: 'crit-rm', arg: 'terr' }) }) : ui.empty({ title: 'No contacts match', text: 'Try another name, or clear the criteria.', action: ui.btn({ label: 'Clear', variant: 'outline', act: 'clear' }) }); }
    else if (!rows.length) { let outside = 0; if (st.terr) { st.terr = false; outside = (isC ? contacts() : properties()).length; st.terr = true; }
      body = outside ? ui.empty({ title: isC ? 'No contacts match in the territory' : 'No properties match in the territory', text: outside + (outside === 1 ? ' match is' : ' matches are') + ' outside ' + D.TERRITORY.name + '.', action: ui.btn({ label: 'Include outside the territory', variant: 'outline', act: 'terr' }) })
        : ui.empty({ title: isC ? 'No contacts match' : 'No properties match', text: 'Try another name, or clear the filters.', action: ui.btn({ label: 'Clear filters', variant: 'outline', act: 'clear' }) }); }
    else body = rows.map(r => {
      if (isC) { const c = r; return `<div class="ds-tr" role="row" aria-selected="${selected('c', c.id)}" data-act="row" data-arg="c:${c.id}">${ui.cls(c.cls)}<span class="ds-td-name"><button type="button" data-act="row" data-arg="c:${c.id}">${esc(c.name)}</button><span class="ds-row__sub">${esc(c.entity + ' · ' + DS.portfolio(c).length + ' props')}</span></span><span class="ds-ellipsis">${esc(D.pById[c.pid].addr)} <span class="muted num">· ${D.pById[c.pid].score}</span></span><span class="ds-ellipsis muted" title="${esc(c.why)}">${esc(c.why)}</span><span class="ds-meta-strong ds-ellipsis" title="${esc(DS.lastOf(c))}">${esc(DS.lastOf(c))}</span><span>${ui.trust(c.trust)}</span><span class="ds-td-right font-medium num">${c.rank}</span></div>`; }
      const p = r, c = D.cById[p.owner]; return `<div class="ds-tr" role="row" aria-selected="${selected('p', p.id)}" data-act="row" data-arg="p:${p.id}">${ui.cls(p.cls)}<span class="ds-td-name"><button type="button" data-act="row" data-arg="p:${p.id}">${esc(p.addr)}</button><span class="ds-row__sub">${esc(p.hood + ' · ' + p.zip)}</span></span><span class="ds-ellipsis">${esc(c.name)}</span><span class="ds-td-right num">${p.units}</span><span class="ds-td-right num">${DS.loc(p.sf)}</span><span class="ds-td-right num">${p.signals}</span><span>${ui.trust(c.pid === p.id ? c.trust : 'verified')}</span><span class="ds-td-right font-medium num">${p.score}</span></div>`;
    }).join('');
    return `<div class="ds-stack" data-gap="4">${filters(st.data === 'ready' ? rows.length : 0)}<div class="ds-table" data-kind="${kind}" role="table" aria-label="${isC ? 'Contacts' : 'Properties'}">${head(cols)}${body}${pager(st.data === 'ready' ? rows.length : 0, total)}</div></div>`;
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
      list: (el, k) => { const [t, x] = k.split(':'); const str = t === 'p' ? listPreset(x) : t === 's' ? (DS.savedLists().find(l => l.id === x) || {}).crit : 'hood:' + x; b.crit = CR.parse(str || ''); Object.assign(b, { edit: null, sugg: [], saving: null, push: null, pushed: null, savedId: t === 's' ? x : null }); DS.V.peek = null; DS.render(); },
      'crit-edit': (el, k) => { b.edit = b.edit === k ? null : k; DS.render(); },
      'crit-close': () => { b.crit = b.crit.filter(it => it.v.length); b.edit = null; DS.render(); },
      'crit-open-add': () => { b.crit = b.crit.filter(it => it.v.length || it.k === b.edit && false); b.edit = b.edit === 'add' ? null : 'add'; DS.render(); },
      'crit-add': (el, k) => { b.crit = CR.parse(CR.str(b.crit)); b.crit.push({ k, v: k === 'terr' ? ['1'] : [], yr: null }); b.crit.sort((x, y) => CR.ORDER.indexOf(x.k) - CR.ORDER.indexOf(y.k)); b.edit = k === 'terr' ? null : k; b.pushed = null; b.savedId = null; DS.render(); },
      'crit-rm': (el, k) => { b.crit = b.crit.filter(it => it.k !== k); if (b.edit === k) b.edit = null; b.pushed = null; b.savedId = null; DS.render(); },
      'crit-opt': (el, arg) => { const [k, v] = arg.split('|'), it = b.crit.find(x => x.k === k), d = CR.DEF[k]; it.v = d.one ? [v] : it.v.includes(v) ? it.v.filter(x => x !== v) : [...it.v, v]; b.pushed = null; b.savedId = null; DS.render(); },
      'crit-pick': (el, arg) => { const [k, v] = arg.split('|'); b.crit.find(x => x.k === k).v = [v]; b.pushed = null; DS.render(); },
      'crit-suggest': (el, str) => { const it = CR.parse(str)[0]; b.crit = [...b.crit.filter(x => x.k !== it.k), it].sort((x, y) => CR.ORDER.indexOf(x.k) - CR.ORDER.indexOf(y.k)); b.pushed = null; DS.render(); },
      'open-save': () => { b.push = null; b.saving = CR.name(b.crit); DS.render(); setTimeout(() => { const el = document.getElementById('list-name'); if (el) el.select(); }, 30); },
      'cancel-save': () => { b.saving = null; DS.render(); },
      'save-list': () => { const name = (b.saving || '').trim() || CR.name(b.crit); b.savedId = DS.saveList(name, CR.str(b.crit)); b.saving = null; DS.render(); DS.toast('Saved to Lists · ' + DS.loc(CR.count(b.crit)) + ' owners'); },
      'open-push': () => { b.saving = null; b.push = b.push ? null : 'phone'; DS.render(); },
      'push-ch': (el, k) => { b.push = k; DS.render(); },
      'push-cancel': () => { b.push = null; DS.render(); },
      'push-go': () => { const n = CR.count(b.crit), ch = b.push; DS.store(Sx => { Sx.queues = [...(Sx.queues || []), { name: CR.name(b.crit), ch, n }]; }); b.push = null; b.pushed = { ch, n }; DS.render(); DS.toast(DS.loc(n) + ' owners queued for ' + CH[ch][0] + (ch === 'phone' ? ' · Terrakotta' : '')); },
      lg: (el, h) => { st.shut[h] = !st.shut[h]; DS.render(); },
      recent: () => { st.recentOpen = !st.recentOpen; DS.render(); },
      terr: () => { st.terr = !st.terr; DS.render(); },
      clear: () => { Object.assign(st, { q: '', cls: 'All classes', trust: 'All trust', sig: 'All signals', list: 'all' }); Object.assign(b, { crit: [], edit: null, sugg: [], pushed: null, savedId: null, push: null, saving: null }); DS.render(); },
      sort: (el, key) => { const cur = sort(); st.sort = cur.key === key ? { key, dir: cur.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: ['name', 'prop', 'addr', 'owner', 'trust', 'last', 'rank'].includes(key) ? 'asc' : 'desc' }; DS.render(); },
      'reset-sort': () => { st.sort = null; DS.render(); },
      retry: () => { st.data = 'loading'; DS.render(); setTimeout(() => { st.data = 'ready'; DS.render(); }, 900); },
    },
    onEscape: () => { if (b.edit) { b.crit = b.crit.filter(it => it.v.length); b.edit = null; DS.render(); return true; } if (b.push || b.saving !== null) { b.push = null; b.saving = null; DS.render(); return true; } return false; },
    inputs: { listName: v => { b.saving = v; },
      critMin: v => { const it = b.crit.find(x => x.k === b.edit), z = (it.v[0] || '').split('-')[1] || ''; it.v = v || z ? [(v || '') + '-' + z] : []; DS.render(); },
      critMax: v => { const it = b.crit.find(x => x.k === b.edit), a = (it.v[0] || '').split('-')[0] || ''; it.v = a || v ? [a + '-' + (v || '')] : []; DS.render(); },
      critFrom: v => { const it = b.crit.find(x => x.k === b.edit); it.yr = v ? [+v, (it.yr && it.yr[1]) || 2026] : null; if (!it.v.length) it.v = Object.keys(D.critCounts.team); DS.render(); },
      critTo: v => { const it = b.crit.find(x => x.k === b.edit); it.yr = v ? [(it.yr && it.yr[0]) || 2005, +v] : null; if (!it.v.length) it.v = Object.keys(D.critCounts.team); DS.render(); },
      q: v => { st.q = v; DS.render(); }, cls: v => { st.cls = v; DS.render(); }, trust: v => { st.trust = v; DS.render(); }, sig: v => { st.sig = v; DS.render(); }, size: v => { st.size = v; DS.render(); } },
  });
})();
