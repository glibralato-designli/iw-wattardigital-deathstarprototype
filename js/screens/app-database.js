/* App 05 Database · Contacts and 06 Database · Properties: search, chips with option sheets, and the list.
   Contacts is the list builder in app form: the same criteria as the web (DS.crit), each a filter chip that opens its sheet,
   a live count, Save as list and Push to queue in sheets, and Lists (presets, saved lists, neighborhoods) in a sheet.
   Every "Turn into a list" in the app lands here with its chips (crit=…). */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const kind = document.body.dataset.page === 'properties' ? 'properties' : 'contacts', isC = kind === 'contacts';
  const st = { q: params.get('q') || '', cls: params.get('list') === 'A' ? 'Class A' : 'All classes', trust: 'All trust', sig: 'All signals', terr: true, data: params.get('data') || 'ready' };
  const TRK = { Verified: 'verified', 'Single source': 'single', Stale: 'stale', Disputed: 'disputed' };
  const OPTS = { cls: ['All classes', 'Class A', 'Class B', 'Class C', 'Class D'], trust: ['All trust', 'Verified', 'Single source', 'Stale', 'Disputed'], sig: ['All signals', 'Loan maturity', 'Estate transition', 'Long hold', 'Unused FAR', 'Lis pendens', 'Nearby sale', 'Recent refinance'] };
  const TITLE = { cls: 'Class', trust: 'Trust', sig: 'Signal' };
  const clsKey = () => st.cls === 'All classes' ? null : st.cls.replace('Class ', '');
  const contacts = () => { const q = st.q.trim().toLowerCase(), dig = q.replace(/\D/g, ''), ck = clsKey(), tk = TRK[st.trust];
    return D.C.filter(c => (!q || c.name.toLowerCase().includes(q) || c.entity.toLowerCase().includes(q) || D.pById[c.pid].addr.toLowerCase().includes(q) || (dig.length >= 4 && c.phone.replace(/\D/g, '').includes(dig))) && (!ck || c.cls === ck) && (!tk || c.trust === tk) && (st.sig === 'All signals' || c.signal === st.sig)).sort((a, b) => a.rank - b.rank); };
  const properties = () => { const q = st.q.trim().toLowerCase(), dig = q.replace(/\D/g, ''), ck = clsKey(), tk = TRK[st.trust], trustOf = p => D.cById[p.owner].pid === p.id ? D.cById[p.owner].trust : 'verified';
    return D.P.filter(p => { const c = D.cById[p.owner]; return (!q || p.addr.toLowerCase().includes(q) || c.name.toLowerCase().includes(q) || (dig.length >= 4 && p.bbl.replace(/\D/g, '').includes(dig))) && (!ck || p.cls === ck) && (!tk || trustOf(p) === tk) && (st.sig === 'All signals' || (c.pid === p.id && c.signal === st.sig)); }).sort((a, b) => b.score - a.score); };
  /* The builder (contacts). Presets as on the web: crit, list, sugg, from, saved=1, push=…, pushed=…, plus sheet=crit-<key>|crit-add|lists|save|push. */
  const CR = DS.crit, S0 = DS.S(), CH = { phone: ['Phone', 'Terrakotta', 'phone'], mail: ['Mail merge', 'Gmail', 'envelope-simple'], cc: ['Constant Contact', 'Constant Contact', 'megaphone'] };
  const LISTS = D.lists.map(([k, l, n]) => ({ k, l, n, crit: D.listCrit[k] }));
  const b = { crit: CR.parse(params.has('crit') ? params.get('crit') : params.has('list') ? (LISTS.find(l => l.k === params.get('list')) || {}).crit || '' : params.get('terr') === '0' ? '' : 'terr:1'), sugg: CR.parse(params.get('sugg') || ''), name: '', savedId: null, pushed: null, push: CH[params.get('push')] ? params.get('push') : 'phone' };
  if (isC && params.get('saved') === '1') b.savedId = DS.saveList(CR.name(b.crit), CR.str(b.crit));
  if (isC && CH[params.get('pushed')]) { const n = CR.count(b.crit); S0.queues = [...(S0.queues || []), { name: CR.name(b.crit), ch: params.get('pushed'), n }]; b.pushed = { ch: params.get('pushed'), n }; }
  if (isC && CH[params.get('push')]) DS.V.sheet = 'push';
  const byQ = c => { const q = st.q.trim().toLowerCase(), dig = q.replace(/\D/g, ''); return !q || c.name.toLowerCase().includes(q) || c.entity.toLowerCase().includes(q) || D.pById[c.pid].addr.toLowerCase().includes(q) || (q.length >= 3 && DS.emailsOf(c).some(e => e.includes(q))) || (dig.length >= 4 && c.phone.replace(/\D/g, '').includes(dig)); };
  const builderRows = () => CR.rows(b.crit).filter(byQ).sort((x, y) => x.rank - y.rank);
  const sortK = items => items.sort((x, y) => CR.ORDER.indexOf(x.k) - CR.ORDER.indexOf(y.k));
  const changed = () => { b.pushed = null; b.savedId = null; };
  const critChips = () => `<div class="ds-achips" role="group" aria-label="List criteria">
      <button type="button" class="ds-fchip" aria-haspopup="dialog" data-act="sheet" data-arg="lists">${icon('list-bullets')}Lists${icon('caret-down')}</button>
      ${b.crit.map(it => { const d = CR.DEF[it.k]; return `<button type="button" class="ds-fchip" aria-pressed="true" aria-haspopup="dialog" data-act="sheet" data-arg="crit-${it.k}">${esc(d.l)}: ${esc(CR.label(it))}${icon('caret-down')}</button>`; }).join('')}
      ${b.sugg.filter(x => !b.crit.some(y => y.k === x.k)).map(it => `<button type="button" class="ds-fchip" data-suggest data-act="crit-suggest" data-arg="${esc(CR.str([it]))}">${icon('plus')}${esc(CR.DEF[it.k].l)}: ${esc(CR.label(it))}</button>`).join('')}
      <button type="button" class="ds-fchip" data-add aria-haspopup="dialog" data-act="sheet" data-arg="crit-add">${icon('plus')}Add</button></div>`;
  const builderFoot = () => { const n = CR.count(b.crit), on = CR.on(b.crit).length, saved = DS.savedLists().find(x => x.id === b.savedId);
    return `<div class="ds-acount"><span><b class="num">${DS.loc(n)}</b> ${n === 1 ? 'owner matches' : 'owners match'}${on > 1 ? ' · every criterion' : on ? '' : ' · whole database'}</span></div>
      <div class="ds-aboth">${ui.btn({ label: 'Save as list', ic: 'list-bullets', variant: 'outline', act: 'sheet', arg: 'save' })}${ui.btn({ label: 'Push to queue', ic: 'arrow-up-right', act: 'sheet', arg: 'push' })}</div>
      ${saved ? `<div class="ds-crit-done">${ui.approved('Saved to Lists · ' + saved.name)}</div>` : ''}${b.pushed ? `<div class="ds-crit-done">${ui.approved('Queued for ' + CH[b.pushed.ch][0] + ' · ' + DS.loc(b.pushed.n) + ' owners')}</div>` : ''}`; };
  const optRows = (items, kind, act, cur) => `<div class="ds-opts"${kind === 'radio' ? ' role="radiogroup"' : ''}>${items.map(([v, l, sub]) => `<button type="button" class="ds-optrow"${kind === 'check' ? ' data-kind="check" role="checkbox"' : ' role="radio"'} aria-checked="${cur(v)}" data-act="${act}" data-arg="${esc(v)}"><span${sub ? ' class="ds-row__body"' : ''}>${sub ? `<span>${esc(l)}</span><span class="ds-meta">${esc(sub)}</span>` : esc(l)}</span><span class="ds-optrow__mark">${icon('check')}</span></button>`).join('')}</div>`;
  const critSheet = k => { const it = b.crit.find(x => x.k === k); if (!it) return ''; const d = CR.DEF[k], n = CR.count(b.crit);
    let body;
    if (d.fixed) body = `<p class="ds-meta" style="padding-top:var(--space-2)">${esc(D.TERRITORY.name + ' · ' + D.TERRITORY.sub)}.</p>`;
    else if (d.range) body = optRows(d.picks.map(([v, l]) => [k + '|' + v, l]), 'radio', 'crit-pick', v => it.v[0] === v.split('|')[1]);
    else if (d.groups) body = d.groups.map(g => { const os = d.opts.filter(([v]) => v.startsWith(g)); return os.length ? `<div class="ds-sheet-sec"><h3>${esc(g)}</h3>${optRows(os.map(([v, l]) => [k + '|' + v, l.replace(g + ' ', '')]), 'check', 'crit-opt', v => it.v.includes(v.split('|')[1]))}</div>` : ''; }).join('');
    else body = optRows(d.opts.map(([v, l]) => [k + '|' + v, l]), d.one ? 'radio' : 'check', 'crit-opt', v => it.v.includes(v.split('|')[1]));
    if (d.years) { const [y0, y1] = it.yr || [null, null], sel = (id, nm, cur, l) => `<label class="field"><span class="field__label">${l}</span><span class="select"><select id="${id}" class="field__control" data-change="${nm}"><option value="">Any year</option>${CR.years.map(y => `<option${y === cur ? ' selected' : ''}>${y}</option>`).join('')}</select></span></label>`;
      body += `<div class="ds-sheet-sec"><h3>Years</h3><div class="ds-two" style="gap:var(--space-3)">${sel('crit-from', 'critFrom', y0, 'From')}${sel('crit-to', 'critTo', y1, 'To')}</div><p class="ds-meta">From the team’s archive. Kept separate from the predictive score.</p></div>`; }
    return ui.sheet({ key: 'crit-' + k, title: d.l, close: 'crit-done', body: `<p class="ds-meta">${d.one ? 'Pick one' : d.range ? 'Pick a range' : d.fixed ? 'In territory' : 'Pick one or more · matches any of them'} · <b class="num" style="color:var(--fg)">${DS.loc(n)}</b> match</p>${body}`, foot: ui.btn({ label: 'Remove', variant: 'outline', act: 'crit-rm', arg: k }) + ui.btn({ label: 'Done', act: 'crit-done' }) }); };
  const builderSheet = () => { const k = DS.V.sheet || '';
    if (k.startsWith('crit-') && k !== 'crit-add') return critSheet(k.slice(5));
    if (k === 'crit-add') { const have = b.crit.map(x => x.k); return ui.sheet({ key: 'crit-add', title: 'Add criteria', body: `<p class="ds-meta">Each one narrows the list. Values inside one widen it.</p><div class="ds-opts">${CR.ORDER.filter(x => !have.includes(x)).map(x => `<button type="button" class="ds-optrow" data-act="crit-add" data-arg="${x}"><span style="display:flex;align-items:center;gap:var(--space-3)">${icon(CR.DEF[x].ic)}${esc(CR.DEF[x].l)}</span><span class="ds-arow__end">${icon('caret-right')}</span></button>`).join('')}</div>` }); }
    if (k === 'lists') { const cur = CR.str(b.crit), row = (arg, l, nn) => `<button type="button" class="ds-optrow" role="radio" aria-checked="${cur === listStr(arg)}" data-act="pick-list" data-arg="${esc(arg)}"><span class="ds-row__body"><span>${esc(l)}</span><span class="ds-meta num">${DS.loc(nn)}</span></span><span class="ds-optrow__mark">${icon('check')}</span></button>`;
      return ui.sheet({ key: 'lists', title: 'Lists', body: `<div class="ds-sheet-sec"><h3>Lists</h3><div class="ds-opts" role="radiogroup">${LISTS.map(x => row('p:' + x.k, x.l, x.n)).join('')}</div></div>${DS.savedLists().length ? `<div class="ds-sheet-sec"><h3>Saved lists</h3><div class="ds-opts" role="radiogroup">${DS.savedLists().map(x => row('s:' + x.id, x.name, CR.count(CR.parse(x.crit)))).join('')}</div></div>` : ''}<div class="ds-sheet-sec"><h3>By neighborhood</h3><div class="ds-opts" role="radiogroup">${D.hoods.map(([l, nn]) => row('h:' + l, l, nn)).join('')}</div></div>` }); }
    if (k === 'save') return ui.sheet({ key: 'save', title: 'Save as list', body: `<label class="field" style="padding-top:var(--space-2)"><span class="field__label">List name</span><input id="list-name" class="field__control" value="${esc(b.name || CR.name(b.crit))}" data-input="listName" autocomplete="off"></label><p class="ds-meta">${DS.loc(CR.count(b.crit))} owners · it appears under Lists, Saved lists.</p>`, foot: ui.btn({ label: 'Cancel', variant: 'outline', act: 'close-sheet' }) + ui.btn({ label: 'Save list', act: 'save-list' }) });
    if (k === 'push') { const n = CR.count(b.crit), note = b.push === 'phone' ? 'Only verified and confirmed numbers go to Terrakotta. Owners who asked not to be contacted are left out.' : b.push === 'mail' ? 'Sends from your Gmail with your mail-merge template. Opt-outs are left out.' : 'Synced to Constant Contact as a list. Anyone excluded from blasts is left out.';
      return ui.sheet({ key: 'push', title: 'Push ' + DS.loc(n) + ' owners to a queue', body: optRows(Object.entries(CH).map(([kk, [l, via]]) => [kk, l, 'Through ' + via]), 'radio', 'push-ch', v => b.push === v) + `<p class="ds-meta">${esc(note)}</p>`, foot: ui.btn({ label: 'Cancel', variant: 'outline', act: 'close-sheet' }) + ui.btn({ label: 'Push to ' + CH[b.push][0], act: 'push-go' }) }); }
    return ''; };
  const listStr = arg => { const [t, x] = arg.split(':'); return t === 'p' ? (LISTS.find(l => l.k === x) || {}).crit || '' : t === 's' ? (DS.savedLists().find(l => l.id === x) || {}).crit || '' : 'hood:' + x; };
  const active = k => st[k] !== OPTS[k][0];
  const hasFilters = () => !!st.q || ['cls', 'trust', 'sig'].some(active);

  const head = () => ({ title: 'Database', large: true, actions: ui.iconBtn({ ic: 'magnifying-glass', aria: 'Search everything', act: 'palette', arg: 'search' }) });
  const switcher = () => `<nav class="segmented" data-fill aria-label="Database">${[['contacts', 'Contacts'], ['properties', 'Properties']].map(([k, l]) => `<a class="segmented__item" href="${href(k)}"${k === kind ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav>`;
  const tools = () => isC ? `<label class="ds-asearch">${icon('magnifying-glass')}<input id="db-q" type="search" aria-label="Search contacts" placeholder="Name, phone, email or address" value="${esc(st.q)}" data-input="q" autocomplete="off"></label>${critChips()}${builderFoot()}` : `<label class="ds-asearch">${icon('magnifying-glass')}<input id="db-q" type="search" aria-label="Search ${kind}" placeholder="${isC ? 'Name, phone, email or address' : 'Address or BBL'}" value="${esc(st.q)}" data-input="q" autocomplete="off"></label>
    <div class="ds-achips" role="group" aria-label="Filters">${hasFilters() ? `<button type="button" class="ds-fchip" data-act="clear">${icon('x')}Clear</button>` : ''}${['cls', 'trust', 'sig'].map(k => `<button type="button" class="ds-fchip" aria-pressed="${active(k)}" aria-haspopup="dialog" data-act="sheet" data-arg="${k}">${esc(active(k) ? st[k] : TITLE[k])}${icon('caret-down')}</button>`).join('')}<button type="button" class="ds-fchip" aria-pressed="${st.terr}" data-act="terr">${st.terr ? icon('check') : ''}In territory</button></div>`;

  const contactRow = c => `<a class="ds-arow" data-lead href="${href('contact', 'id=' + c.id)}" style="align-items:flex-start">${ui.cls(c.cls)}<span class="ds-arow__body"><span class="ds-arow__title">${esc(c.name)}</span><span class="ds-arow__sub">${esc(c.why)}</span><span style="display:flex;align-items:center;gap:var(--space-2);margin-top:var(--space-1)">${ui.trust(c.trust)}<span class="ds-meta ds-ellipsis">${esc(D.pById[c.pid].addr + ' · ' + D.pById[c.pid].score + ' · ' + DS.lastOf(c))}</span></span></span><span class="ds-arow__end font-medium" style="color:var(--fg)">Rank ${c.rank}</span></a>`;
  const propRow = p => { const c = D.cById[p.owner]; return `<a class="ds-arow" data-lead href="${href('property', 'id=' + p.id)}" style="align-items:flex-start">${ui.cls(p.cls)}<span class="ds-arow__body"><span class="ds-arow__title">${esc(p.addr)}</span><span class="ds-arow__sub">${esc(p.hood)} · ${p.units} units · ${esc(c.name)}</span><span style="display:flex;align-items:center;gap:var(--space-2);margin-top:var(--space-1)">${ui.trust(c.pid === p.id ? c.trust : 'verified')}<span class="ds-meta">${p.signals} ${p.signals === 1 ? 'signal' : 'signals'}</span></span></span><span class="ds-arow__end font-medium" style="color:var(--fg)">${p.score}</span></a>`; };
  const list = () => {
    if (st.data === 'loading') return `<div class="ds-alist" role="status" aria-label="Loading ${kind}">${[62, 48, 70, 55, 66].map(w => `<div class="ds-arow" data-lead aria-hidden="true"><span class="ds-skel" style="width:1.375rem;height:1.375rem;border-radius:var(--radius-sm)"></span><span class="ds-arow__body" style="gap:var(--space-2)"><span class="ds-skel" style="width:${w}%"></span><span class="ds-skel" style="width:${w + 20}%"></span></span></div>`).join('')}</div>`;
    if (st.data === 'error') return `<div class="ds-alist" role="alert" style="padding:var(--space-4)">${ui.empty({ ic: 'warning', tone: 'danger', title: `${isC ? 'Contacts' : 'Properties'} didn’t load`, text: 'The connection to the database timed out. Your filters are kept.', action: ui.btn({ label: 'Try again', ic: 'arrow-clockwise', variant: 'outline', act: 'retry' }) })}</div>`;
    const rows = isC ? builderRows() : properties();
    if (!rows.length && isC && !st.q && CR.on(b.crit).length) return `<div class="ds-alist" style="padding:var(--space-4)">${ui.empty({ ic: 'list-bullets', title: DS.loc(CR.count(b.crit)) + ' owners match in the database', text: 'None of them are in this demo’s sample rows. In the full database they list here.' })}</div>`;
    if (!rows.length) return `<div class="ds-alist" style="padding:var(--space-4)">${ui.empty({ title: isC ? 'No contacts match' : 'No properties match', text: 'Try another name, or clear the filters.', action: ui.btn({ label: 'Clear filters', variant: 'outline', act: 'clear' }) })}</div>`;
    return `<p class="ds-meta" style="margin-bottom:calc(var(--space-4) * -1)">${isC ? rows.length + ' demo rows of ' + DS.loc(CR.count(b.crit)) : rows.length + ' ' + kind} · sorted by ${isC ? 'rank' : 'score'}</p><div class="ds-alist">${rows.map(isC ? contactRow : propRow).join('')}</div>`;
  };
  const sheet = () => { const k = DS.V.sheet; if (isC) return builderSheet(); if (!OPTS[k]) return '';
    return ui.sheet({ key: 'filter-' + k, title: TITLE[k], body: `<div class="ds-opts" role="radiogroup" aria-label="${TITLE[k]}">${OPTS[k].map(o => `<button type="button" class="ds-optrow" role="radio" aria-checked="${st[k] === o}" data-act="pick" data-arg="${k}|${esc(o)}"><span>${esc(o)}</span><span class="ds-optrow__mark">${icon('check')}</span></button>`).join('')}</div>` }); };

  DS.define({
    id: kind, nav: 'database', tab: 'database',
    head, scope: () => isC ? 'Contacts' : 'Properties',
    render: () => `<div class="ds-apage">${ui.large('Database', 'Stewart Group')}${ui.teach()}${switcher()}<div class="ds-asec">${tools()}</div>${list()}</div>`,
    overlays: sheet,
    acts: {
      pick: (el, arg) => { const [k, v] = arg.split('|'); st[k] = v; DS.V.sheet = null; DS.render(); },
      terr: () => { st.terr = !st.terr; DS.render(); },
      'pick-list': (el, arg) => { b.crit = CR.parse(listStr(arg)); b.sugg = []; changed(); if (arg.startsWith('s:')) b.savedId = arg.slice(2); DS.V.sheet = null; DS.render(); },
      'crit-add': (el, k) => { b.crit = sortK([...CR.parse(CR.str(b.crit)), { k, v: k === 'terr' ? ['1'] : [], yr: null }]); changed(); DS.V.sheet = k === 'terr' ? null : 'crit-' + k; DS.render(); },
      'crit-opt': (el, arg) => { const [k, v] = arg.split('|'), it = b.crit.find(x => x.k === k), d = CR.DEF[k]; it.v = d.one ? [v] : it.v.includes(v) ? it.v.filter(x => x !== v) : [...it.v, v]; changed(); DS.render(); },
      'crit-pick': (el, arg) => { const [k, v] = arg.split('|'); b.crit.find(x => x.k === k).v = [v]; changed(); DS.render(); },
      'crit-rm': (el, k) => { b.crit = b.crit.filter(x => x.k !== k); changed(); DS.V.sheet = null; DS.render(); },
      'crit-done': () => { b.crit = b.crit.filter(x => x.v.length); DS.V.sheet = null; DS.render(); },
      'crit-suggest': (el, str) => { const it = CR.parse(str)[0]; b.crit = sortK([...b.crit.filter(x => x.k !== it.k), it]); changed(); DS.render(); },
      'save-list': () => { b.savedId = DS.saveList((b.name || '').trim() || CR.name(b.crit), CR.str(b.crit)); b.name = ''; DS.V.sheet = null; DS.render(); DS.toast('Saved to Lists · ' + DS.loc(CR.count(b.crit)) + ' owners'); },
      'push-ch': (el, k) => { b.push = k; DS.render(); },
      'push-go': () => { const n = CR.count(b.crit), ch = b.push; DS.store(Sx => { Sx.queues = [...(Sx.queues || []), { name: CR.name(b.crit), ch, n }]; }); b.pushed = { ch, n }; DS.V.sheet = null; DS.render(); DS.toast(DS.loc(n) + ' owners queued for ' + CH[ch][0]); },
      clear: () => { b.crit = []; changed(); st.q = ''; st.cls = 'All classes'; st.trust = 'All trust'; st.sig = 'All signals'; DS.render(); },
      retry: () => { st.data = 'loading'; DS.render(); Nav.advance(() => { st.data = 'ready'; DS.render(); }, 700); },
    },
    inputs: { q: v => { st.q = v; DS.render(); }, listName: v => { b.name = v; },
      critFrom: v => { const it = b.crit.find(x => x.k === 'team'); it.yr = v ? [+v, (it.yr && it.yr[1]) || 2026] : null; if (!it.v.length) it.v = Object.keys(D.critCounts.team); DS.render(); },
      critTo: v => { const it = b.crit.find(x => x.k === 'team'); it.yr = v ? [(it.yr && it.yr[0]) || 2005, +v] : null; if (!it.v.length) it.v = Object.keys(D.critCounts.team); DS.render(); } },
  });
})();
