/* Death Star product runtime: demo store, the navy shell, Brain, ⌘K, the peek drawer and shared UI.
   Screens register with DS.define() from js/screens/<page>.js. Every move between screens is a real
   link resolved through Nav.route(), so the portal export can rename screens. */
(() => {
  const D = window.DS_DATA;
  const Nav = window.Nav || { params: new URLSearchParams(location.search), route: n => n + '.html', go: n => location.assign(n + '.html'), advance: (f, ms) => setTimeout(f, ms), still: false };
  const params = Nav.params;
  const OFF = 'Not in this proposal yet';

  /* ───────── Utilities ───────── */
  const esc = v => String(v ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  const icon = (name, weight = 'regular') => `<svg class="icon ph-icon" aria-hidden="true" focusable="false" viewBox="0 0 256 256">${(window.PHOSPHOR || {})[name + '-' + weight] || ''}</svg>`;
  const attrs = o => Object.entries(o).filter(([, v]) => v !== undefined && v !== null && v !== false).map(([k, v]) => v === true ? ` ${k}` : ` ${k}="${esc(v)}"`).join('');
  const href = (page, query = '') => Nav.route(page, query);
  const loc = n => Number(n).toLocaleString('en-US');
  const pct = n => n + '%';
  const fmtL = d => d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const fmtS = d => d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const fmtMD = d => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const tFmt = x => { const hh = Math.floor(x), mm = Math.round((x - hh) * 60); return ((hh + 11) % 12 + 1) + (mm ? ':' + String(mm).padStart(2, '0') : '') + (hh < 12 ? ' AM' : ' PM'); };
  const initials = n => n.split(' ').map(x => x[0]).join('').slice(0, 2);
  const isEmptyVal = v => /^(Not on record|None on record|Never called|None yet|Not set)$/.test(String(v));

  /* ───────── Store: demo data in local storage, session UI in session storage ───────── */
  const STORE = 'ds-proto-v2', UI = 'ds-ui-v2';
  const fresh = () => ({ done: {}, calls: 0, convos: 0, tl: {}, last: {}, bad: {}, flags: {}, tasks: D.tasks.map(t => ({ ...t })), goalDone: {}, calNew: [], convs: [], clists: {}, ctog: {}, ranked: {}, recent: ['marchetti', 'p118', 'feld'], lists: [], storefront: {}, pnotes: {} });
  const read = (storage, key) => { try { return JSON.parse(storage.getItem(key) || 'null'); } catch (_) { return null; } };
  const write = (storage, key, value) => { try { storage.setItem(key, JSON.stringify(value)); } catch (_) {} };
  // Presets that change demo data render a snapshot; they never overwrite the saved demo.
  const isSnapshot = () => ['called', 'call', 'flag', 'added', 'approved', 'ask', 'chat', 'reset'].some(k => params.has(k)) && params.get('reset') !== '1';
  let snapshot = isSnapshot();
  let S = { ...fresh(), ...(read(localStorage, STORE) || {}) };
  if (params.get('reset') === '1') { S = fresh(); write(localStorage, STORE, S); try { sessionStorage.removeItem(UI); } catch (_) {} }
  const loadU = () => ({ navRail: null, moreOpen: false, navGrp: {}, brainUser: null, msgs: null, chatTitle: null, chatId: null, seen: false, scopeOff: false, call: null, outcome: null, ...(read(sessionStorage, UI) || {}) });
  let U = loadU();
  const save = () => { if (snapshot) return; write(localStorage, STORE, S); write(sessionStorage, UI, U); };
  // Per-screen view state; Brain's draft, thinking and streaming carry across screens.
  const freshV = () => ({ menu: null, drawer: false, brainHere: false, pal: null, peek: null, peekDir: 0, acc: null, guideTab: 'flows', brainParam: params.get('brain') });
  const V = { toast: null, draft: '', thinking: false, thinkSteps: [], thinkI: 0, stream: null, ...freshV() };

  /* ───────── Shared UI helpers ───────── */
  const ui = {};
  ui.icon = icon;
  ui.cls = (k, label) => `<span class="ds-class"${label ? ' data-label' : ''} data-cls="${k}">${label ? esc((k === 'LH' ? 'LH' : 'Class ' + k) + ' · ' + D.CLASS[k]) : esc(k)}</span>`;
  ui.trust = (k, word) => { const t = D.TRUST[k]; return `<span class="badge ds-trust"${t.status ? ` data-status="${t.status}"` : ''} data-trust="${k}">${icon(t.icon)}${esc(word || t.word)}</span>`; };
  ui.btn = ({ label = '', ic, variant, size, act, arg, link, shape, aria, tip, side, id, cls = '', disabled, busy, pressed, expanded, extra = {} }) => {
    const a = { class: 'button' + (label ? '' : ' button--icon') + (cls ? ' ' + cls : ''), 'data-variant': variant, 'data-size': size, 'data-shape': shape, 'aria-label': aria, 'data-tip': tip || (disabled ? OFF : null), 'data-tip-side': side, id, 'aria-busy': busy ? 'true' : null, 'aria-pressed': pressed, 'aria-expanded': expanded, ...extra };
    const inner = (ic ? icon(ic) : '') + esc(label);
    if (disabled) return `<button type="button"${attrs({ ...a, 'aria-disabled': 'true' })}>${inner}</button>`;
    if (link) return `<a${attrs({ ...a, href: link })}>${inner}</a>`;
    return `<button type="button"${attrs({ ...a, 'data-act': act, 'data-arg': arg })}>${inner}</button>`;
  };
  ui.iconBtn = ({ ic, aria, act, arg, link, tip, side = 'bottom', tone, disabled, expanded, id }) => {
    const a = { class: 'ds-icon-btn', 'aria-label': aria, 'data-tip': disabled ? OFF : (tip ?? aria), 'data-tip-side': side, 'data-tone': tone, 'aria-expanded': expanded, id };
    if (disabled) return `<button type="button"${attrs({ ...a, 'aria-disabled': 'true' })}>${icon(ic)}</button>`;
    if (link) return `<a${attrs({ ...a, href: link })}>${icon(ic)}</a>`;
    return `<button type="button"${attrs({ ...a, 'data-act': act, 'data-arg': arg })}>${icon(ic)}</button>`;
  };
  ui.off = (label, ic) => `<button type="button" class="button" data-variant="outline" aria-disabled="true" data-tip="${OFF}">${ic ? icon(ic) : ''}${esc(label)}</button>`;
  ui.tabs = (items, current, label) => `<div class="tabs"><nav class="tabs__list" aria-label="${esc(label)}">${items.map(t => {
    if (t === '|') return '<span class="tabs__divider" aria-hidden="true"></span>';
    const [page, l, off] = t;
    if (off || !page) return `<span class="tabs__tab" role="link" tabindex="0" aria-disabled="true" data-tip="${OFF}">${esc(l)}</span>`;
    return page === current ? `<a class="tabs__tab" aria-current="page" href="${href(page)}">${esc(l)}<span class="tabs__ink" aria-hidden="true"></span></a>` : `<a class="tabs__tab" href="${href(page)}">${esc(l)}</a>`;
  }).join('')}</nav></div>`;
  // In-page tabs (state, not navigation): role tablist with arrow keys.
  ui.stateTabs = (items, current, act, label) => `<div class="tabs"><div class="tabs__list" role="tablist" aria-label="${esc(label)}">${items.map(([k, l, off]) => off
    ? `<span class="tabs__tab" role="tab" tabindex="-1" aria-selected="false" aria-disabled="true" data-tip="${OFF}">${esc(l)}</span>`
    : `<button type="button" class="tabs__tab" role="tab" aria-selected="${k === current}" tabindex="${k === current ? 0 : -1}" data-act="${act}" data-arg="${k}">${esc(l)}${k === current ? `<span class="tabs__ink" aria-hidden="true" data-flip="ink-${esc(label)}"></span>` : ''}</button>`).join('')}</div></div>`;
  ui.segmented = (items, current, act, label, size) => `<div class="segmented" role="tablist" aria-label="${esc(label)}"${size ? ` data-size="${size}"` : ''}>${items.map(([k, l]) => `<button type="button" class="segmented__item" role="tab" aria-selected="${k === current}" data-act="${act}" data-arg="${k}">${k === current ? `<span class="segmented__ink" aria-hidden="true" data-flip="seg-${esc(label)}"></span>` : ''}${esc(l)}</button>`).join('')}</div>`;
  ui.pageHead = (title, tabsHtml, extra = '') => `<div class="ds-page-head"><div class="ds-page-title"><span class="ds-org">Stewart Group</span><h1>${esc(title)}</h1></div>${tabsHtml || ''}${extra}</div>`;
  ui.nudge = text => `<p class="ds-nudge">${icon('sparkle')}<span>${esc(text)}</span><button type="button" class="ds-link-btn" data-act="ask-nudge" data-arg="${esc(text)}">Ask Brain</button></p>`;
  ui.kv = (rows, opts = {}) => `<dl class="ds-kv"${opts.cols ? ` data-cols="${opts.cols}"` : ''}${opts.compact ? ' data-compact' : ''}>${rows.map(([k, v, x = {}]) => `<div class="ds-kv__row"><dt>${esc(k)}</dt><dd${isEmptyVal(v) ? ' data-empty' : ''}${x.hot ? ' data-hot' : ''}>${x.html ? v : esc(v)}</dd>${x.end || ''}</div>`).join('')}</dl>`;
  ui.acc = (key, title, sum, body, open, extra = '') => `<section><button type="button" class="ds-acc__btn" aria-expanded="${!!open}" data-act="acc" data-arg="${esc(key)}">${extra}<span class="ds-row__body"><b>${esc(title)}</b><span class="ds-row__sub">${esc(sum)}</span></span>${icon(open ? 'caret-up' : 'caret-down')}</button>${open ? `<div class="ds-acc__body" data-anim="grow" data-key="acc-${esc(key)}">${body}</div>` : ''}</section>`;
  ui.progress = (ratio, label, opts = {}) => `<span class="ds-progress"${opts.tone ? ` data-tone="${opts.tone}"` : ''}${opts.thin ? ' data-size="thin"' : ''}${opts.fill ? ' data-fill' : ''} role="progressbar" aria-label="${esc(label)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(Math.min(1, ratio) * 100)}"><span${opts.key ? ` data-bar="${esc(opts.key)}"` : ''} style="width:${Math.min(100, Math.round(ratio * 100))}%"></span></span>`;
  ui.scoreChip = (label, score) => `<span class="ds-chip" data-tone="strong">${esc(label)}<span class="ds-chip__bar" aria-hidden="true"><span style="width:${Math.round(score / 132 * 100)}%"></span></span></span>`;
  ui.statusDot = status => status === 'Do not contact' ? 'bad' : /never|new/i.test(status) ? '' : /call|contact|follow/i.test(status) ? 'active' : 'good';
  ui.empty = ({ ic = 'magnifying-glass', title, text, action = '', tone }) => `<div class="ds-empty"><span class="ds-empty__icon"${tone ? ` data-tone="${tone}"` : ''}>${icon(ic)}</span><b>${esc(title)}</b>${text ? `<span class="ds-meta">${esc(text)}</span>` : ''}${action}</div>`;
  ui.bars = (vals, labels, o = {}) => {
    const max = o.max || Math.max(...vals) || 1, last = vals.length - 1, f = o.fmt === 'loc' ? loc : o.fmt === 'pct' ? pct : String;
    const goal = o.goal ? `<div class="ds-goal" style="bottom:${Math.round(o.goal / max * 120) + 22}px"><span>Goal ${o.goal}</span></div>` : '';
    return `<div class="ds-bars" role="img" aria-label="${esc(o.aria || 'Bar chart')}"${o.key ? ` data-anim="bars" data-key="bars-${esc(o.key)}"` : ''}>${goal}${vals.map((v, i) => `<div class="ds-bar"><span class="ds-bar__v"${v ? '' : ' data-zero'}>${v ? f(v) : esc(o.zero || 'None')}</span><span class="ds-bar__fill"${!v ? ' data-zero' : (i === last && !o.flat && labels.length === 7) ? ' data-today' : ''} style="--i:${i};height:${v ? Math.max(4, Math.round(v / max * 120)) : 3}px"></span><span class="ds-bar__d">${esc(labels[i])}</span></div>`).join('')}</div>`;
  };
  ui.hbars = (rows, o = {}) => { const max = Math.max(...rows.map(r => r[1])) || 1, f = o.fmt === 'pct' ? pct : o.fmt === 'loc' ? loc : String; return `<div class="ds-hbars">${rows.map(([l, v, tone]) => `<div class="ds-hbar"><span class="ds-ellipsis">${esc(l)}</span><span class="ds-hbar__track"><span${tone || o.tone ? ` data-tone="${tone || o.tone}"` : ''} style="width:${Math.max(2, Math.round(v / max * 100))}%"></span></span><span class="ds-hbar__n${v ? '' : ' muted'}">${f(v)}</span></div>`).join('')}</div>`; };
  ui.line = (points, o = {}) => {
    // Lines and area are SVG (non-scaling strokes); dots and labels are HTML so text never stretches.
    const W = 1000, H = 160, max = Math.max(...points.map(p => p[1])) * 1.08, min = Math.min(...points.map(p => p[1])) * 0.82;
    const xp = i => i / (points.length - 1) * 100, yp = v => 100 - (v - min) / (max - min) * 100;
    const d = points.map((p, i) => (i ? 'L' : 'M') + (xp(i) * W / 100).toFixed(1) + ' ' + (yp(p[1]) * H / 100).toFixed(1)).join(' ');
    return `<div class="ds-linechart" role="img" aria-label="${esc(o.aria || 'Line chart')}"><div class="ds-linechart__plot"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true">${[0, 1, 2, 3].map(i => `<line class="ds-line__grid" x1="0" x2="${W}" y1="${i * H / 3}" y2="${i * H / 3}"/>`).join('')}<path class="ds-line__area" d="${d} L ${W} ${H} L 0 ${H} Z"/><path class="ds-line__path" d="${d}"/></svg>${points.map((p, i) => `<span class="ds-linechart__dot"${i === points.length - 1 ? ' data-last' : ''} style="left:${xp(i)}%;top:${yp(p[1])}%" title="${esc(p[0] + ': ' + p[1])}"></span>`).join('')}</div><div class="ds-linechart__x">${points.map(p => `<span>${esc(p[0])}</span>`).join('')}</div></div>`;
  };
  ui.whyMini = (text, trustK) => `<div class="ds-why-mini"><p>${esc(text)}</p>${ui.trust(trustK)}</div>`;

  /* ───────── Domain helpers ───────── */
  const C = D.C, P = D.P, cById = D.cById, pById = D.pById;
  const lastOf = c => S.last[c.id] || c.last;
  const callIds = () => D.callIds.slice(0, Math.max(3, Math.min(6, Number(params.get('calls')) || 6)));
  const callsDone = () => 6 + S.calls;
  const evidenceOf = c => D.evidence(c).map(([l, v, m, k], i) => { const key = c.id + ':' + i, fl = !!S.flags[key]; return { i, l, v, m, k: fl ? 'disputed' : k, flagged: fl, canFlag: !fl && k !== 'disputed', key }; });
  const contactPointsOf = c => { const bad = !!S.bad[c.id]; return D.contactPoints(c).map((x, i) => { let st = x[2]; if (bad && i === 0) st = 'Bad'; else if (bad && i === 1 && x[0] === 'phone') st = 'Primary'; return [x[0], x[1], st, x[3]]; }); };
  const bestPhone = c => { const cps = contactPointsOf(c); return (cps.find(x => x[0] === 'phone' && x[2] === 'Primary') || cps[0])[1]; };
  const timelineOf = c => [...(S.tl[c.id] || []), ...D.baseTimeline(c).map(([k, t, d]) => ({ k, t, d }))];
  const portfolio = c => P.filter(p => p.owner === c.id);
  const addTimeline = (id, entry) => { S.tl[id] = [entry, ...(S.tl[id] || [])]; };
  const remember = id => { S.recent = [id, ...(S.recent || []).filter(x => x !== id)].slice(0, 4); save(); };

  /* ───────── Screen registry ───────── */
  const DS = { D, S: () => S, U: () => U, V, ui, esc, icon, href, params, OFF, loc, pct, fmtL, fmtS, fmtMD, tFmt, initials, isEmptyVal, lastOf, callIds, callsDone, evidenceOf, contactPointsOf, bestPhone, timelineOf, portfolio, addTimeline, remember, save, attrs, acts: {}, inputs: {}, screen: null };
  DS.set = patch => { Object.assign(V, patch); render(); };
  DS.store = fn => { fn(S, U); save(); render(); };
  window.DS = DS;

  /* ───────── Toast and tooltip (direct DOM, outside the render loop) ───────── */
  let toastTimer;
  DS.toast = text => {
    clearTimeout(toastTimer); V.toast = text; renderToast();
    const live = document.getElementById('ds-announce'); if (live) live.textContent = text;
    toastTimer = setTimeout(() => { const t = document.querySelector('#ds-toast .toast'); const done = () => { V.toast = null; renderToast(); }; const a = t && DS.play(t, [{ opacity: 1, transform: 'translate(-50%,0)' }, { opacity: 0, transform: 'translate(-50%,6px)' }], { duration: 160, easing: 'cubic-bezier(.4,0,1,1)', fill: 'forwards' }); if (a) a.onfinish = done; else done(); }, 4000);
  };
  const renderToast = () => { const el = document.getElementById('ds-toast'); if (el) el.innerHTML = V.toast ? `<div class="toast" data-anim="toast">${icon('check-circle')}<span>${esc(V.toast)}</span></div>` : ''; };
  let tipTimer, tipEl;
  const showTip = target => {
    clearTimeout(tipTimer);
    tipTimer = setTimeout(() => {
      if (!document.body.contains(target)) return;
      hideTip(); const text = target.getAttribute('data-tip'); if (!text) return;
      tipEl = document.createElement('div'); tipEl.className = 'tooltip'; tipEl.setAttribute('role', 'tooltip'); tipEl.dataset.anim = 'fade'; tipEl.textContent = text;
      document.body.appendChild(tipEl);
      const r = target.getBoundingClientRect(), t = tipEl.getBoundingClientRect(), side = target.getAttribute('data-tip-side') || 'bottom';
      let left = r.left + r.width / 2 - t.width / 2, top = r.bottom + 6;
      if (side === 'right') { left = r.right + 8; top = r.top + r.height / 2 - t.height / 2; }
      if (side === 'left') { left = r.left - t.width - 8; top = r.top + r.height / 2 - t.height / 2; }
      if (side === 'top') top = r.top - t.height - 6;
      tipEl.style.left = Math.max(4, Math.min(innerWidth - t.width - 4, left)) + 'px'; tipEl.style.top = Math.max(4, top) + 'px';
    }, 300);
  };
  const hideTip = () => { clearTimeout(tipTimer); if (tipEl) { tipEl.remove(); tipEl = null; } };
  document.addEventListener('mouseover', e => { const t = e.target.closest && e.target.closest('[data-tip]'); if (t) showTip(t); });
  document.addEventListener('mouseout', e => { const t = e.target.closest && e.target.closest('[data-tip]'); if (t && !t.contains(e.relatedTarget)) hideTip(); });
  document.addEventListener('focusin', e => { const t = e.target.closest && e.target.closest('[data-tip]'); if (t && t.matches(':focus-visible')) showTip(t); else hideTip(); });
  document.addEventListener('focusout', hideTip);

  /* ───────── Shell state ───────── */
  // Phone (<768): the sidebar is a drawer. Tablet and laptop (<1180): an icon rail. Desktop: labelled.
  const isPhone = () => innerWidth < 768;
  const isRail = () => !isPhone() && (params.get('nav') === 'rail' && U.navRail === null ? true : (U.navRail ?? innerWidth < 1180));
  const layoutKey = () => [isPhone(), isRail(), innerWidth < 1024, innerWidth < 1360].join();
  const panel = () => {
    const sc = DS.screen; if (!sc || sc.id === 'brain') return 'hidden';
    // Open by default only where it docks beside the page; on laptops it would cover the work.
    const def = sc.brain === 'open' && innerWidth < 1360 ? 'min' : (sc.brain || 'min');
    const p = U.brainUser || V.brainParam || def;
    // On a phone Brain covers the screen, so it opens only on the screen where Thomas asked for it.
    if (isPhone() && p === 'open' && !V.brainHere && !V.brainParam) return 'min';
    return p;
  };
  const msgsOf = () => U.msgs || [D.proactive];
  const userCount = () => (U.msgs || []).filter(m => m.role === 'user').length;
  const chatOn = () => userCount() > 0;

  /* ───────── Sidebar ───────── */
  const NAVKEY = { home: 'home', 'attack-plan': 'dashboard', brain: 'brain', contacts: 'database' };
  function sidebar() {
    const rail = isRail(), sc = DS.screen;
    const tipSide = 'right', railTip = l => rail ? ` data-tip="${esc(l)}" data-tip-side="${tipSide}"` : '';
    let h = `<div class="ds-sidebar__head">${rail ? '' : '<span class="ds-wordmark">Death Star</span>'}${isPhone() ? ui.iconBtn({ ic: 'x', aria: 'Close menu', act: 'close-drawer', tone: 'shell' }) : ui.iconBtn({ ic: 'sidebar-simple', aria: rail ? 'Expand sidebar' : 'Collapse sidebar', act: 'toggle-nav', tip: (rail ? 'Expand sidebar' : 'Collapse sidebar') + '  [', side: rail ? 'right' : 'bottom', tone: 'shell' })}</div><div class="ds-sidebar__scroll">`;
    let grp = null;
    D.nav.forEach(n => {
      if (typeof n === 'string') {
        grp = n; const shut = !!U.navGrp[n];
        h += rail ? '<div class="ds-rail-divider" aria-hidden="true"></div>' : `<button type="button" class="ds-nav-group" aria-expanded="${!shut}" data-act="nav-group" data-arg="${esc(n)}"><span>${esc(n)}</span>${icon(shut ? 'caret-right' : 'caret-down')}</button>`;
        return;
      }
      const [label, ic, page, badge] = n, key = NAVKEY[page];
      if (!rail && grp && U.navGrp[grp] && key !== sc.nav) return;
      if (!page) { h += `<a class="ds-nav" role="link" tabindex="0" aria-disabled="true" data-tip="${OFF}" data-tip-side="right">${icon(ic)}<span>${esc(label)}</span>${badge ? `<span class="ds-nav__badge">${badge}</span>` : ''}</a>`; return; }
      h += `<a class="ds-nav" href="${href(page)}"${key === sc.nav ? ' aria-current="page"' : ''}${railTip(label)}>${key === sc.nav ? '<span class="ds-nav__ink" aria-hidden="true"></span>' : ''}${icon(ic)}<span>${esc(label)}</span></a>`;
    });
    if (rail || !U.navGrp.Marketing) {
      h += `<button type="button" class="ds-nav ds-nav-more" aria-expanded="${!!U.moreOpen}" data-act="toggle-more"${railTip('More')}>${icon('dots-three')}<span>More</span>${icon(U.moreOpen ? 'caret-down' : 'caret-right')}</button>`;
      if (U.moreOpen) D.more.forEach(([l, ic]) => { h += `<a class="ds-nav" data-sub role="link" tabindex="0" aria-disabled="true" data-tip="${OFF}" data-tip-side="right">${icon(ic)}<span>${esc(l)}</span></a>`; });
    }
    h += `</div><div class="ds-sidebar__foot"><div style="position:relative"><button type="button" class="ds-nav" aria-haspopup="dialog" aria-expanded="${V.menu === 'guide'}" data-act="menu" data-arg="guide"${railTip('Guide')}>${icon('question')}<span>Guide</span></button>${V.menu === 'guide' ? guide() : ''}</div>`;
    h += `<a class="ds-nav" role="link" tabindex="0" aria-disabled="true" data-tip="${OFF}" data-tip-side="right">${icon('gear-six')}<span>System</span></a><div class="ds-rail-divider" style="margin:var(--space-1-5) 0" aria-hidden="true"></div>`;
    h += `<div style="position:relative"><button type="button" class="ds-account" aria-label="Account menu" aria-haspopup="menu" aria-expanded="${V.menu === 'avatar'}" data-act="menu" data-arg="avatar"${railTip('Thomas Windels')}><span class="avatar">TW</span><span class="ds-account__who"><span class="ds-account__name">Thomas Windels</span><span class="ds-account__org">Stewart Group</span></span>${rail ? '' : icon('caret-up-down')}</button>${V.menu === 'avatar' ? account() : ''}</div></div>`;
    return h;
  }
  function account() {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    return `<div class="ds-pop ds-menu" role="menu" aria-label="Account" data-anim="pop" data-key="avatar" style="left:0;bottom:calc(100% + 6px);width:15rem">
      <div class="ds-theme-switch"><span>Appearance</span><div class="segmented" role="radiogroup" aria-label="Appearance">${[['light', 'Light', 'sun'], ['dark', 'Dark', 'moon']].map(([k, l, ic]) => `<button type="button" class="segmented__item" role="radio" aria-checked="${theme === k}" data-act="theme" data-arg="${k}">${theme === k ? '<span class="segmented__ink" aria-hidden="true" data-flip="seg-appearance"></span>' : ''}${icon(ic)}${l}</button>`).join('')}</div></div>
      <hr class="menu__divider">
      <button type="button" class="menu__item" role="menuitem" data-act="toggle-nav">${icon('sidebar-simple')}${isRail() ? 'Expand sidebar' : 'Collapse sidebar'}</button>
      <button type="button" class="menu__item" role="menuitem" data-act="reset">${icon('arrow-clockwise')}Reset prototype data</button>
      <hr class="menu__divider">
      ${[['Profile', 'user'], ['Settings', 'gear-six'], ['Sign out', 'sign-out']].map(([l, ic]) => `<button type="button" class="menu__item" role="menuitem" aria-disabled="true" data-tip="${OFF}" data-tip-side="right">${icon(ic)}${l}</button>`).join('')}
    </div>`;
  }
  const FLOWS = [['Start the day', 'Home, then today’s Attack Plan', 'home', ''], ['Live call', 'Why now, call, log the outcome', 'contact', 'id=marchetti'], ['Check the why now', 'Drivers, evidence and trust', 'contact', 'id=marchetti&why=open'], ['Ask Brain', 'Why now, build a list, look up a property', 'brain', ''], ['Find anything', '⌘K by name, phone or BBL', null, ''], ['Plan the week', 'Calendar, add an event, conversations', 'calendar', '']];
  function guide() {
    const flows = FLOWS.map(([t, d, page, q], i) => `<div class="ds-guide__flow"><span class="ds-step-num">${i + 1}</span><span class="ds-row__body"><span class="font-medium">${esc(t)}</span><span class="ds-meta">${esc(d)}</span></span>${page ? `<a class="button" data-variant="outline" data-size="sm" href="${href(page, q)}">Start</a>` : `<button type="button" class="button" data-variant="outline" data-size="sm" data-act="palette" data-arg="search">Start</button>`}</div>`).join('');
    const BUILT = { 'attack-plan': ['attack-plan', 'calendar', 'conversations', 'outreach-performance', 'reporting', 'listings', 'web-analytics'], contacts: ['contacts', 'properties'], brain: ['chat'] };
    const TABS = { 'attack-plan': D.dashboardTabs.filter(t => t !== '|').map(t => t[1]), contacts: ['Contacts', 'Properties'], brain: ['Chat'] };
    const LATER = { brain: 'Learning Mode', Map: 'Map · Prospects', Outreach: 'Queues · Hub · Attribution', Phone: 'Dialer · Auto-dialer · Recordings', Email: 'Inbox · Sequences · Smartlead', Texting: 'Threads · Templates', LinkedIn: 'Posts · Connections', Social: 'Inbox · Analytics', Marketing: 'Campaigns · Mail merge · Branding', Website: 'Editor · Pages' };
    const groups = []; let g = { h: 'Workspace', rows: [] }; groups.push(g);
    D.nav.forEach(n => { if (typeof n === 'string') { g = { h: n, rows: [] }; groups.push(g); return; } const [l, ic, page] = n; g.rows.push({ l, ic, page, on: TABS[page] ? TABS[page].join(' · ') : '', off: page ? (LATER[page] || '') : (LATER[l] || '') }); });
    groups.push({ h: 'More', rows: D.more.map(([l, ic]) => ({ l, ic, page: null, on: '', off: '' })) });
    groups.push({ h: 'System', rows: [{ l: 'System', ic: 'gear-six', page: null, on: '', off: 'Settings · Health · System status · Runbook · Controls' }] });
    groups.push({ h: 'Top bar', rows: [{ l: 'Links', ic: 'link-simple', page: null, on: '', off: 'Research (11) · Media (7)' }] });
    const struct = groups.map(gr => `<div class="ds-stack" data-gap="2"><div class="ds-struct-head"><b>${esc(gr.h)}</b><span>${gr.rows.filter(r => r.page).length} of ${gr.rows.length} built</span></div><div>${gr.rows.map(r => {
      const inner = `${icon(r.ic)}<span class="ds-row__body"><span class="font-medium"${r.page ? '' : ' style="color:var(--fg-subtle)"'}>${esc(r.l)}</span>${r.on ? `<span class="ds-meta" style="color:var(--fg-secondary)">${esc(r.on)}</span>` : ''}${r.off ? `<span class="ds-meta">Later: ${esc(r.off)}</span>` : ''}</span>${r.page ? '<span class="badge" data-status="success">Built</span>' : '<span class="badge">Later</span>'}`;
      return r.page ? `<a class="ds-struct-row" href="${href(r.page)}">${inner}</a>` : `<div class="ds-struct-row">${inner}</div>`;
    }).join('')}</div></div>`).join('');
    return `<div class="ds-pop ds-guide" role="dialog" aria-label="Prototype guide" data-anim="pop" data-key="guide">
      <div class="ds-stack" data-gap="2" style="gap:var(--space-0-5)"><div style="display:flex;align-items:center;gap:var(--space-2)"><h2 class="ds-grow">Prototype guide</h2><span class="badge" data-status="warning" data-shape="pill">Prototype · fake data</span></div><span class="ds-meta-strong">Start a flow, or see what’s in this proposal. Greyed items are planned but not built.</span></div>
      ${ui.segmented([['flows', 'Flows'], ['structure', 'Structure']], V.guideTab, 'guide-tab', 'Guide view')}
      ${V.guideTab === 'flows' ? `<div class="ds-guide__flows">${flows}</div>` : `<div class="ds-guide__struct">${struct}</div>`}
    </div>`;
  }

  /* ───────── Top bar ───────── */
  function topbar() {
    const crumbs = DS.screen.crumbs();
    const cr = crumbs.map((c, i) => i === crumbs.length - 1 ? `<span aria-current="page">${esc(c.l)}</span>` : `<a href="${href(c.page, c.q || '')}">${esc(c.l)}</a>${icon('caret-right')}`).join('');
    const p = panel(), open = p === 'open', unread = !open && !U.seen && DS.screen.id !== 'brain';
    const links = V.menu === 'links' ? `<div class="ds-pop" role="menu" aria-label="Links" data-anim="pop" data-key="links" style="top:2.75rem;right:0;width:17.5rem;max-height:32.5rem;overflow-y:auto">${D.links.map(g => `<div class="menu__label">${esc(g.h)}</div>${g.items.map(l => `<button type="button" class="menu__item" role="menuitem" aria-disabled="true" data-tip="${OFF}" data-tip-side="left"><span class="ds-grow">${esc(l)}</span>${icon('arrow-square-out')}</button>`).join('')}`).join('')}</div>` : '';
    return `<button type="button" class="ds-icon-btn ds-topbar__menu" data-tone="shell" aria-label="Open menu" aria-expanded="${!!V.drawer}" data-act="open-drawer">${icon('list')}</button><nav class="ds-crumbs" aria-label="Breadcrumb">${cr}</nav><div class="ds-topbar__tools">
      <button type="button" class="ds-search-trigger" data-act="palette" data-arg="search" aria-label="Search contacts, properties, BBL">${icon('magnifying-glass')}<span>Search contacts, properties, BBL</span><kbd>⌘K</kbd></button>
      <div class="ds-links" style="position:relative"><button type="button" class="ds-shell-btn" aria-haspopup="menu" aria-expanded="${V.menu === 'links'}" aria-label="Links" data-act="menu" data-arg="links">${icon('link-simple')}<span class="ds-shell-btn__label">Links</span>${icon('caret-down')}</button>${links}</div>
      <span class="ds-bell" role="button" tabindex="0" aria-disabled="true" aria-label="Notifications, 3 unread" data-tip="${OFF}">${icon('bell')}<span class="ds-bell__count">3</span></span>
      <span class="ds-topbar__sep" aria-hidden="true"></span>
      <button type="button" class="ds-ask" aria-pressed="${open}" aria-label="${open ? 'Close Brain' : 'Open Brain'}" data-tip="Brain  ⌘J" data-act="toggle-brain">${icon('sparkle')}<span class="ds-ask__label">Ask Brain</span>${unread ? '<span class="ds-ask__dot" aria-label="Unread message"></span>' : ''}</button>
    </div>`;
  }

  /* ───────── Brain: messages, replies, panel ───────── */
  DS.reply = text => {
    const q = text.toLowerCase();
    const c = C.find(x => q.includes(x.name.toLowerCase()) || q.includes(x.name.split(' ')[1].toLowerCase()));
    if (c && (q.includes('why') || q.includes(c.name.toLowerCase()))) return { kind: 'why', cid: c.id, text: c.whyFull, src: c.id === 'marchetti' ? [['ACRIS', 'Mortgage recorded Jun 2016 · $9.4M'], ['NY DOS', 'Ludlow 118 Holdings LLC · principal'], ['DOF', '37 units · 25 rent stabilized']] : [['ACRIS', 'Deed and mortgage history'], ['NY DOS', c.entity]] };
    if (q.startsWith('/list') || q.includes('list')) return { kind: 'list', text: 'I found 12 owners in the Lower East Side with debt due before year end. Marchetti, Okafor and Kowalski are the top three by score.', listName: 'LES debt due 2026 · 12 owners', pending: true, src: [['ACRIS', 'Mortgages maturing by Dec 31, 2026'], ['Model v4', 'Class A and B only']] };
    if (q.includes('ludlow') || q.startsWith('/lookup') || q.includes('look up') || q.includes('lookup')) return { kind: 'lookup', pid: 'p118', text: '118 Ludlow St is a 37-unit walk-up owned by Daniel Marchetti. Its $9.4M loan matures June 9, 2026.', src: [['DOF', 'Units and building class'], ['ACRIS', 'Mortgage · Aug 12']] };
    if (q.includes('who should i call') || q.includes('call first')) return { text: 'Start with Daniel Marchetti. His $9.4M loan matures June 9, and he hasn’t had a call in 41 days. Then Aaron Feld and Grace Okafor.', trust: 'Verified · ACRIS, Aug 12', acts: [['Open record', 'contact', 'id=marchetti', true]] };
    return { text: 'I can explain why an owner is worth calling now, build a list of owners, or look up a property. Try “Why now for Daniel Marchetti?”.' };
  };
  const stepsFor = q => q.includes('list') ? ['Reading your filters', 'Matching ACRIS mortgages', 'Ranking by score'] : (q.includes('ludlow') || q.includes('look')) ? ['Finding the property', 'Reading DOF and ACRIS', 'Checking the owner'] : ['Finding the owner', 'Reading the evidence', 'Writing the why now'];
  let thinkT, stepT, streamT;
  DS.sendText = (text, opts = {}) => {
    const t = (text || '').trim(); if (!t || V.thinking) return;
    const q = t.toLowerCase(), ms = Number(params.get('think')) || 1200, steps = stepsFor(q);
    const base = U.msgs || (DS.screen.id === 'brain' ? [] : [D.proactive]);
    U.msgs = [...base, { role: 'user', text: t }]; if (!U.chatTitle || !userCount()) U.chatTitle = U.chatTitle && userCount() > 1 ? U.chatTitle : t;
    V.draft = ''; V.thinking = true; V.thinkSteps = steps; V.thinkI = 0; V.scrollChat = true; save(); render();
    clearTimeout(thinkT); clearInterval(stepT); clearInterval(streamT);
    stepT = setInterval(() => { V.thinkI = Math.min(V.thinkI + 1, steps.length - 1); renderBrainOnly(); }, Math.max(150, ms / steps.length));
    thinkT = setTimeout(() => {
      clearInterval(stepT); const rp = DS.reply(t);
      U.msgs = [...U.msgs, { role: 'bot', ...rp }]; V.thinking = false; V.stream = opts.instant ? null : { i: U.msgs.length - 1, n: 0 }; V.scrollChat = true; if (!panelVisible()) U.seen = false; save(); render();
      if (V.stream) streamT = setInterval(() => { const full = U.msgs[V.stream.i].text; V.stream.n += 6; if (V.stream.n >= full.length) { clearInterval(streamT); V.stream = null; } V.scrollChat = true; renderBrainOnly(); }, 24);
    }, opts.instant ? 0 : ms);
  };
  const panelVisible = () => panel() === 'open' || DS.screen.id === 'brain';
  DS.seedChat = (kind, stage) => {
    // Presets: render a finished (or mid-way) answer without waiting.
    const qs = { why: 'Why now for Daniel Marchetti?', list: '/list LES owners with debt due before year end', lookup: 'Look up 118 Ludlow St', first: 'Who should I call first today?' };
    const t = qs[kind] || qs.why, rp = DS.reply(t);
    U.msgs = [...(DS.screen.id === 'brain' ? [] : [D.proactive]), { role: 'user', text: t }];
    U.chatTitle = t;
    if (stage === 'thinking') { V.thinking = true; V.thinkSteps = stepsFor(t.toLowerCase()); V.thinkI = 1; return; }
    U.msgs.push({ role: 'bot', ...rp, ...(params.get('approved') ? { pending: false, approved: true } : {}) });
    if (stage === 'streaming') V.stream = { i: U.msgs.length - 1, n: Math.round(rp.text.length * 0.55) };
  };
  function messageHTML(m, i, page) {
    if (m.role === 'user') return `<div class="ds-msg-user" data-anim="rise" data-key="msg-${page ? 'p' : 'b'}-${U.chatId || 'n'}-${i}">${esc(m.text)}</div>`;
    const streaming = V.stream && V.stream.i === i, text = streaming ? m.text.slice(0, V.stream.n) : m.text;
    let blocks = '';
    if (!streaming) {
      if (m.kind === 'why') { const c = cById[m.cid]; blocks += `<div class="ds-answer"><div style="display:flex;align-items:center;gap:var(--space-2);flex-wrap:wrap">${ui.cls(c.cls)}<b class="ds-grow font-semibold">${esc(c.name)}</b>${ui.trust(c.trust)}</div><span class="ds-meta-strong" style="font-size:var(--text-sm);line-height:var(--line-height-sm);color:var(--fg-secondary)">${esc(c.why)}</span><div class="ds-toolbar">${ui.btn({ label: 'Call', ic: 'phone', size: 'sm', link: href('contact', 'id=' + c.id + '&act=call') })}${ui.btn({ label: 'Open record', size: 'sm', variant: 'outline', link: href('contact', 'id=' + c.id) })}</div></div>`; }
      if (m.kind === 'list') {
        const rows = ['marchetti', 'okafor', 'kowalski'].map(id => { const c = cById[id]; return `<a class="ds-answer__row" href="${href('contact', 'id=' + id)}">${ui.cls(c.cls)}<span class="ds-row__body"><span class="font-medium">${esc(c.name)}</span><span class="ds-row__sub">${esc(pById[c.pid].addr + ' · ' + c.why)}</span></span></a>`; }).join('');
        blocks += `<div class="ds-answer"><div class="ds-toolbar" style="gap:var(--space-1-5)">${['Lower East Side', 'Debt due by Dec 31, 2026', 'Class A and B'].map(f => `<span class="ds-filter-chip">${icon('funnel-simple')}${esc(f)}</span>`).join('')}</div><b class="font-semibold">12 owners match</b><div>${rows}</div>${m.pending ? `<div class="ds-approve"><span>Save as <b>${esc(m.listName)}</b>?</span>${ui.btn({ label: 'Save list', size: 'sm', act: 'approve-list', arg: i })}${ui.btn({ label: 'Not now', size: 'sm', variant: 'outline', act: 'decline-list', arg: i })}</div>` : ''}${m.approved ? `<span class="ds-saved">${icon('check-circle')}Saved to Lists · ${esc(m.listName)}</span>` : ''}</div>`;
      }
      if (m.kind === 'lookup') { const p = pById[m.pid], c = cById[p.owner]; blocks += `<div class="ds-answer"><div style="display:flex;align-items:center;gap:var(--space-2-5)"><span class="ds-tile-icon" style="border:0;background:var(--bg-muted);color:var(--fg-muted)">${icon('buildings')}</span><span class="ds-row__body"><b class="font-semibold">${esc(p.addr)}</b><span class="ds-row__sub">${esc(p.hood + ' · ' + p.zip + ' · BBL ' + p.bbl)}</span></span></div>${ui.kv([['Units', p.units + ' · ' + p.fm + ' FM · ' + p.rs + ' RS'], ['Owner', c.name + ' · Class ' + c.cls], ['Debt', p.debt + ' due ' + p.mat]], { cols: 1 })}<div>${ui.btn({ label: 'Open property', size: 'sm', variant: 'outline', link: href('property', 'id=' + p.id) })}</div></div>`; }
      if (m.src) blocks += `<div class="ds-sources"><span class="ds-meta font-medium">Sources</span>${m.src.map(([l, d]) => `<span class="ds-source">${icon('link-simple')}<b class="font-medium">${esc(l)}</b><span aria-hidden="true">·</span><span>${esc(d)}</span></span>`).join('')}</div>`;
      if (m.trust) blocks += `<span class="badge" data-status="success" style="align-self:flex-start">${icon('seal-check')}${esc(m.trust)}</span>`;
      if (m.acts && m.acts.length) blocks += `<div class="ds-toolbar">${m.acts.map(([l, page, q, primary]) => page ? ui.btn({ label: l, variant: primary ? null : 'outline', link: href(page, q), size: 'sm' }) : ui.btn({ label: l, variant: 'outline', size: 'sm', act: 'dismiss-acts', arg: i })).join('')}</div>`;
      blocks += `<div class="ds-msg-tools">${[['copy', 'Copy'], ['repeat', 'Regenerate'], ['thumbs-up', 'Good answer'], ['thumbs-down', 'Bad answer']].map(([ic, t]) => `<span title="${t}">${icon(ic)}</span>`).join('')}</div>`;
    }
    const body = `${m.time ? `<span class="ds-meta">${esc(m.time)}</span>` : ''}<div class="ds-msg-bot__text">${esc(text)}${streaming ? '<span class="ds-caret" aria-hidden="true"></span>' : ''}</div>${blocks}`;
    const k = `data-anim="rise" data-key="msg-${page ? 'p' : 'b'}-${U.chatId || 'n'}-${i}"`;
    return page ? `<div class="ds-msg-page" ${k}><span class="ds-bot-av">${icon('sparkle')}</span><div class="ds-msg-bot ds-grow" style="padding-top:3px">${body}</div></div>` : `<div class="ds-msg-bot" ${k}>${body}</div>`;
  }
  const thinkHTML = page => V.thinking ? `<div class="${page ? 'ds-msg-page' : ''}" role="status" aria-live="polite" data-anim="rise" data-key="think-${page ? 'p' : 'b'}">${page ? `<span class="ds-bot-av">${icon('sparkle')}</span>` : ''}<div class="ds-think">${V.thinkSteps.map((t, i) => `<span class="ds-think__step" data-state="${i < V.thinkI ? 'done' : i === V.thinkI ? 'now' : 'todo'}">${icon(i < V.thinkI ? 'check-circle' : i === V.thinkI ? 'circle-notch' : 'circle')}${esc(t)}</span>`).join('')}</div></div>` : '';
  DS.chatHTML = page => {
    const list = page ? (U.msgs || []) : msgsOf();
    return list.map((m, i) => messageHTML(m, i, page)).join('') + thinkHTML(page);
  };
  DS.composer = (page, opts = {}) => `<div class="ds-composer"${page ? ' data-page' : ''}>${page ? `<textarea id="${opts.id || 'brain-page-input'}" aria-label="Message Brain" rows="${opts.rows || 1}" placeholder="${esc(opts.ph || 'Reply to Brain')}" data-input="draft" data-enter="send">${esc(V.draft)}</textarea>` : `<input id="brain-input" aria-label="Message Brain" placeholder="Ask about a contact, property or list" value="${esc(V.draft)}" data-input="draft" data-enter="send" autocomplete="off">`}<div class="ds-composer__tools">${icon('paperclip')}<b>@</b><b>/</b><span class="ds-composer__mode"><span>Ask</span><span>Act</span></span><span class="ds-composer__learn">${icon('book-open')}Learning</span><button type="button" class="ds-send" aria-label="Send" data-act="send">${icon('arrow-up')}</button></div></div>`;
  const scopeLabel = () => 'Scoped to ' + (DS.screen.scope ? DS.screen.scope() : 'Home');
  function brainPanel() {
    const p = panel();
    if (p === 'open') {
      const empty = msgsOf().length === 0 && !V.thinking;
      const sugg = ['Why now for Daniel Marchetti?', '/list LES owners with debt due before year end', 'Look up 118 Ludlow St'];
      return `<aside class="ds-brain" aria-label="Brain" data-anim="panel" data-key="brain-panel">
        <div class="ds-brain__head">${icon('sparkle')}<b>Brain</b>
          ${ui.iconBtn({ ic: 'clock', aria: 'Chat history', link: href('brain') })}${ui.iconBtn({ ic: 'plus', aria: 'New chat', act: 'new-chat' })}${ui.iconBtn({ ic: 'arrow-up-right', aria: 'Open in Brain', link: href('brain') })}${ui.iconBtn({ ic: 'minus', aria: 'Minimize', act: 'min-brain' })}${ui.iconBtn({ ic: 'x', aria: 'Close', tip: 'Close  ⌘J', act: 'close-brain' })}</div>
        ${U.scopeOff ? '' : `<span class="ds-scope">${esc(scopeLabel())}<button type="button" aria-label="Remove scope" data-act="drop-scope">${icon('x')}</button></span>`}
        <div class="ds-chat" aria-live="polite" id="brain-chat" data-keep-scroll="brain-chat">${empty ? `<div class="ds-stack" data-gap="2" style="color:var(--fg-muted)"><span class="font-medium" style="color:var(--fg)">Ask about a contact, property or list.</span>${sugg.map(s => `<button type="button" class="ds-sugg" data-act="ask" data-arg="${esc(s)}">${esc(s)}</button>`).join('')}</div>` : DS.chatHTML(false)}</div>
        ${DS.composer(false)}
      </aside>`;
    }
    if (p === 'min' && chatOn()) {
      const title = U.chatTitle || (U.msgs.find(m => m.role === 'user') || {}).text || 'Brain chat', n = userCount();
      return `<div class="ds-brain-min" role="region" aria-label="Minimized Brain chat" data-anim="pop" data-key="brain-min"><button type="button" class="ds-brain-min__open" aria-label="Open chat: ${esc(title)}" data-act="open-brain"><span class="ds-brain-min__av">${icon('sparkle')}${!U.seen ? '<span class="ds-brain-min__dot" aria-label="Unread reply"></span>' : ''}</span><span class="ds-row__body"><span class="ds-row__title">${esc(title)}</span><span class="ds-row__sub">${V.thinking ? 'Brain is thinking…' : 'Brain · ' + n + (n === 1 ? ' question' : ' questions')}</span></span></button>${ui.iconBtn({ ic: 'arrows-out-simple', aria: 'Open in side panel', side: 'top', act: 'open-brain' })}${ui.iconBtn({ ic: 'x', aria: 'Close chat', tip: 'Close', side: 'top', act: 'close-brain' })}</div>`;
    }
    return '';
  }
  DS.openBrain = () => { const was = panel(); U.brainUser = 'open'; U.seen = true; V.brainHere = true; save(); if (was === 'open') render(); else DS.vt(render, 'brain'); setTimeout(() => { const el = document.getElementById('brain-input') || document.getElementById('brain-page-input'); if (el) el.focus(); }, 30); };
  DS.ask = text => { if (DS.screen.id !== 'brain') { U.brainUser = 'open'; U.seen = true; U.scopeOff = false; } DS.sendText(text); };

  /* ───────── ⌘K palette ───────── */
  DS.openPalette = (mode = 'search', q = '') => { V.pal = { mode, q, active: 0 }; V.menu = null; render(); const el = document.getElementById('palette-input'); if (el) { el.focus(); el.setSelectionRange(el.value.length, el.value.length); } };
  const palItems = () => {
    const pal = V.pal; if (!pal) return [];
    const q = pal.q.trim().toLowerCase(), dig = q.replace(/\D/g, '');
    const cItem = c => ({ kind: 'c', id: c.id, cls: c.cls, t: c.name, s: c.entity + ' · ' + c.phone, k: 'Contact' });
    const pItem = p => ({ kind: 'p', id: p.id, cls: cById[p.owner].cls, t: p.addr, s: p.hood + ' · BBL ' + p.bbl, k: 'Property' });
    let groups;
    if (!q) {
      const rc = (S.recent || []).map(id => cById[id] ? cItem(cById[id]) : pById[id] && pal.mode !== 'log' ? pItem(pById[id]) : null).filter(Boolean);
      groups = [{ h: pal.mode === 'log' ? 'Recent contacts' : 'Recent', items: rc }];
      if (pal.mode === 'log') groups.push({ h: 'Call next', items: callIds().filter(id => !S.done[id] && !(S.recent || []).includes(id)).map(id => cItem(cById[id])) });
    } else {
      const cm = C.filter(c => c.name.toLowerCase().includes(q) || c.entity.toLowerCase().includes(q) || (dig.length >= 4 && c.phone.replace(/\D/g, '').includes(dig))).slice(0, 6).map(cItem);
      const pm = pal.mode === 'log' ? [] : P.filter(p => p.addr.toLowerCase().includes(q) || (dig.length >= 4 && p.bbl.replace(/\D/g, '').includes(dig))).slice(0, 4).map(pItem);
      groups = [{ h: 'Contacts', items: cm }, { h: 'Properties', items: pm }];
    }
    return groups.filter(g => g.items.length);
  };
  const palTarget = (it, log) => it.kind === 'c' ? href('contact', 'id=' + it.id + (log ? '&act=log' : '')) : href('property', 'id=' + it.id);
  function palette() {
    const pal = V.pal; if (!pal) return '';
    const groups = palItems(); let n = 0;
    const list = groups.map(g => `<div class="ds-palette__group"><span>${esc(g.h)}</span>${g.items.map(it => { const idx = n++; return `<a class="ds-palette__item" href="${palTarget(it, pal.mode === 'log')}" data-pal-index="${idx}" data-act="pal-pick" data-arg="${it.kind}:${it.id}"${idx === pal.active ? ' data-active' : ''}>${ui.cls(it.cls)}<span class="ds-row__body"><span class="font-medium">${esc(it.t)}</span><span class="ds-row__sub">${esc(it.s)}</span></span><span class="ds-meta">${it.k}</span></a>`; }).join('')}</div>`).join('');
    return `<div class="ds-overlay" data-act="close-palette" data-self data-key="palette-ov" data-anim="fade"><div class="ds-palette" role="dialog" aria-modal="true" aria-label="${pal.mode === 'log' ? 'Log a call' : 'Search'}" data-anim="pop" data-key="palette">
      ${pal.mode === 'log' ? '<div class="ds-meta font-medium" style="padding:var(--space-3) var(--space-4) 0">Log a call · pick a contact</div>' : ''}
      <div class="ds-palette__input">${icon('magnifying-glass')}<input id="palette-input" aria-label="Search" placeholder="Search by name, phone, address or BBL" value="${esc(pal.q)}" data-input="palette" autocomplete="off"><kbd>Esc</kbd></div>
      <div class="ds-palette__list" id="palette-list">${list || (pal.q.trim() ? `<div class="ds-empty" style="padding:var(--space-6) var(--space-2)"><span class="muted">No matches for “${esc(pal.q)}”. Try a phone number or a BBL.</span></div>` : '')}</div>
      <div class="ds-palette__foot"><span>↵ to open · Shift ↵ to preview</span><span>↑↓ to move</span><span>Esc to close</span></div>
    </div></div>`;
  }

  /* ───────── Peek drawer ───────── */
  DS.openPeek = (k, id, tab = 'overview') => { V.peekDir = 0; V.peek = { k, id, tab, mode: (V.peek && V.peek.mode) || params.get('peekmode') || 'side' }; V.menu = null; render(); };
  function peekSections() {
    const pk = V.peek, tab = pk.tab;
    const sec = (h, body, link) => `<section class="ds-peek__sec">${h ? `<div class="ds-peek__sec-h"><h3>${esc(h)}</h3>${link || ''}</div>` : ''}${body}</section>`;
    const kvIcons = rows => `<div class="ds-kv" data-cols="1">${rows.map(([k, v]) => `<div class="ds-kv__row"><dt>${esc(k)}</dt><dd${isEmptyVal(v) ? ' data-empty' : ''}>${esc(v)}</dd></div>`).join('')}</div>`;
    const listRows = items => `<div class="ds-peek-list">${items.map(([ic, t, s, link, act]) => link ? `<a class="ds-row" href="${link}"><span class="ds-round-icon">${icon(ic)}</span><span class="ds-row__body ds-ellipsis">${esc(t)}</span><span class="ds-meta">${esc(s)}</span></a>` : `<button type="button" class="ds-row" data-act="${act[0]}" data-arg="${act[1]}"><span class="ds-round-icon">${icon(ic)}</span><span class="ds-row__body ds-ellipsis">${esc(t)}</span><span class="ds-meta">${esc(s)}</span><span class="ds-row__end">${icon('caret-right')}</span></button>`).join('')}</div>`;
    if (pk.k === 'c') {
      const c = cById[pk.id], p = pById[c.pid], first = c.name.split(' ')[0].toLowerCase(), last = c.name.split(' ')[1].toLowerCase();
      if (tab === 'overview') {
        const tl = timelineOf(c).slice(0, 3), ic = { Call: 'phone', Email: 'envelope-simple', Note: 'note', Flag: 'warning-diamond', Text: 'chat-text', Broadcast: 'megaphone' };
        return sec('Why now', ui.whyMini(c.whyFull, c.trust)) + sec('Contact', kvIcons([['Best phone', bestPhone(c)], ['Best email', first + '.' + last + '@example.com'], ['Last touch', lastOf(c)], ['Status', c.status]])) + sec('Key facts', kvIcons([['Debt', p.debt], ['Maturity', p.mat], ['Years held', c.years + ' years'], ['Profile', c.meta.split(' · ')[1]]])) +
          sec('Recent activity', listRows(tl.length ? tl.map(x => [ic[x.k] || 'note', x.k + ' · ' + x.t, x.d, href('contact', 'id=' + c.id + '&tab=activity')]) : [['note', 'Nothing logged yet', 'Calls and notes show up here', href('contact', 'id=' + c.id)]]), `<a class="ds-link-btn" href="${href('contact', 'id=' + c.id + '&tab=activity')}">View all</a>`);
      }
      const others = portfolio(c).filter(x => x.id !== p.id);
      return sec('', `<div class="ds-facade" data-wide>${icon('buildings')}Facade photo</div>`) + sec('Lead property', kvIcons([['Address', p.addr + ', ' + p.zip], ['Units', p.units + ' · ' + p.fm + ' FM · ' + p.rs + ' RS'], ['Gross SF', loc(p.sf)], ['Year built', p.built], ['Debt', p.debt === 'Not on record' ? 'Not on record' : p.debt + ' due ' + p.mat], ['BBL', p.bbl]]), `<a class="ds-link-btn" href="${href('property', 'id=' + p.id)}">Open property</a>`) +
        (others.length ? sec('Other properties', listRows(others.map(x => ['buildings', x.addr, x.units + ' units · ' + x.hood, null, ['peek', 'p:' + x.id]]))) : '');
    }
    const p = pById[pk.id], c = cById[p.owner], lead = c.pid === p.id;
    if (tab === 'overview') return sec('', `<div class="ds-facade" data-wide>${icon('buildings')}Facade photo</div>`) + sec('Why now', ui.whyMini(lead ? c.whyFull : 'Part of ' + c.name + '’s portfolio. The lead reason to call is at ' + pById[c.pid].addr + '.', lead ? c.trust : 'verified')) + sec('Building', kvIcons([['Units', p.units + ' · ' + p.fm + ' FM · ' + p.rs + ' RS'], ['Gross SF', loc(p.sf)], ['Year built', p.built], ['Debt', p.debt === 'Not on record' ? 'Not on record' : p.debt + ' due ' + p.mat], ['BBL', p.bbl]]));
    const others = portfolio(c).filter(x => x.id !== p.id);
    return sec('Owner', kvIcons([['Name', c.name], ['Entity', c.entity], ['Class', 'Class ' + c.cls + ' · ' + D.CLASS[c.cls]], ['Best phone', c.phone], ['Last touch', lastOf(c)]]), `<a class="ds-link-btn" href="${href('contact', 'id=' + c.id)}">Open owner</a>`) + (others.length ? sec('Also owns', listRows(others.map(x => ['buildings', x.addr, x.units + ' units · ' + x.hood, null, ['peek', 'p:' + x.id]]))) : '');
  }
  function peek() {
    const pk = V.peek; if (!pk) return '';
    const list = DS.screen.peekList ? DS.screen.peekList() : [], cur = list.findIndex(([k, id]) => k === pk.k && id === pk.id);
    const isC = pk.k === 'c', c = isC ? cById[pk.id] : cById[pById[pk.id].owner], p = isC ? pById[c.pid] : pById[pk.id];
    const title = isC ? c.name : p.addr, full = isC ? href('contact', 'id=' + c.id) : href('property', 'id=' + p.id);
    const meta = isC ? [[c.entity, 'briefcase'], [c.meta.split(' · ')[1], 'user'], [portfolio(c).length + ' properties', 'buildings']] : [[p.hood + ' · ' + p.zip, 'map-pin'], ['BBL ' + p.bbl, 'tag'], ['Built ' + p.built, 'calendar-blank']];
    const modeL = pk.mode === 'center' ? ['Center peek', 'square'] : ['Side peek', 'sidebar'];
    const chips = isC ? `${ui.scoreChip('Score ' + c.score, c.score)}<span class="ds-chip" data-tone="outline"><span class="ds-dot" data-tone="${ui.statusDot(c.status)}"></span>${esc(c.status)}</span>` : `<a class="ds-chip" data-tone="outline" href="${href('contact', 'id=' + c.id)}">${icon('user')}${esc(c.name)}${icon('caret-right')}</a>${ui.scoreChip('Owner score ' + c.score, c.score)}<span class="ds-chip">${p.units} units</span><span class="ds-chip">${loc(p.sf)} SF</span>`;
    return `<div class="ds-scrim" data-act="close-peek" data-anim="fade" data-key="scrim"></div>
      <aside class="ds-peek" data-mode="${pk.mode}" role="dialog" aria-modal="true" aria-label="${esc(title)}" data-anim="peek" data-key="peek-${pk.mode}">
        <div class="ds-peek__bar">${ui.iconBtn({ ic: 'caret-double-right', aria: 'Close peek', tip: 'Close  Esc', act: 'close-peek' })}${ui.iconBtn({ ic: 'arrows-out-simple', aria: 'Open as full page', link: full })}<span class="ds-peek__sep" aria-hidden="true"></span>${ui.iconBtn({ ic: 'caret-up', aria: 'Previous record', tip: 'Previous  ↑', act: 'peek-step', arg: -1 })}${ui.iconBtn({ ic: 'caret-down', aria: 'Next record', tip: 'Next  ↓', act: 'peek-step', arg: 1 })}<span class="ds-peek__pos">${cur >= 0 ? (cur + 1) + ' of ' + list.length : ''}</span><span class="ds-grow"></span>
          <div style="position:relative"><button type="button" class="button" data-variant="ghost" data-size="sm" aria-haspopup="menu" aria-expanded="${V.menu === 'peek'}" data-act="menu" data-arg="peek">${icon(modeL[1])}${modeL[0]}${icon('caret-down')}</button>${V.menu === 'peek' ? `<div class="ds-pop ds-menu" role="menu" data-anim="pop" data-key="peekmenu" style="top:2rem;right:0;width:11.25rem">${[['side', 'Side peek', 'sidebar'], ['center', 'Center peek', 'square']].map(([k, l, ic]) => `<button type="button" class="menu__item" role="menuitemradio" aria-checked="${pk.mode === k}" data-act="peek-mode" data-arg="${k}">${icon(ic)}<span class="ds-grow">${l}</span>${pk.mode === k ? icon('check') : ''}</button>`).join('')}<a class="menu__item" role="menuitem" href="${full}">${icon('arrows-out-simple')}Full page</a></div>` : ''}</div></div>
        <div class="ds-peek__scroll">
          <div class="ds-peek__head"><div style="display:flex;align-items:flex-start;gap:var(--space-3)"><span class="ds-rhead__avatar ds-peek__avatar"${isC ? '' : ' data-kind="property"'} style="width:3rem;height:3rem;border-radius:var(--radius-xl)">${isC ? esc(initials(c.name)) : icon('buildings')}</span><div class="ds-rhead__body" style="flex:1"><div class="ds-rhead__title"><h2 class="ds-title-xl ds-peek__title">${esc(title)}</h2>${ui.cls(c.cls, true)}</div><div class="ds-toolbar" style="gap:var(--space-1) var(--space-3-5);color:var(--fg-muted)">${meta.map(([l, ic]) => `<span class="ds-meta-icon">${icon(ic)}${esc(l)}</span>`).join('')}</div></div></div>
            <div class="ds-toolbar" style="gap:var(--space-1-5)">${chips}</div>
            <div class="ds-toolbar">${ui.btn({ label: isC ? 'Call' : 'Call owner', ic: 'phone', link: href('contact', 'id=' + c.id + '&act=call') })}${ui.btn({ label: 'Ask Brain', ic: 'sparkle', variant: 'outline', act: 'ask', arg: isC ? 'Why now for ' + c.name + '?' : 'Look up ' + p.addr })}${ui.iconBtn({ ic: 'chat-text', aria: 'Text', disabled: true })}${ui.iconBtn({ ic: 'envelope-simple', aria: 'Email', disabled: true })}</div></div>
          <div class="ds-peek__tabs">${ui.stateTabs(isC ? [['overview', 'Overview'], ['property', 'Property']] : [['overview', 'Overview'], ['owner', 'Owner']], pk.tab, 'peek-tab', 'Preview')}</div>
          <div class="ds-peek__body" data-anim="${V.peekDir ? 'slide-y' : 'fade'}" data-key="peekbody-${pk.k}-${pk.id}-${pk.tab}" style="--dir:${V.peekDir || 1}">${peekSections()}</div>
        </div>
        <div class="ds-peek__foot"><span class="ds-meta">Esc to close</span><a class="button" data-variant="outline" data-size="sm" href="${full}">${icon('arrows-out-simple')}Open full page<kbd>↵</kbd></a></div>
      </aside>`;
  }

  /* ───────── Motion ─────────
     Motion explains state: indicators glide (FLIP), disclosures grow and fold, overlays leave as well as
     arrive, numbers that changed since you last saw them count, and screen changes use View Transitions.
     Nothing animates on first paint. Reduced motion keeps short fades only. */
  const RM = () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)', EASE_IN = 'cubic-bezier(0.4, 0, 1, 1)';
  DS.play = (el, kf, o = {}) => {
    if (!el || !el.animate || Nav.still) return null;
    const reduced = RM(), frames = reduced ? kf.map(f => ({ opacity: f.opacity ?? 1 })) : kf;
    if (reduced && frames.every(f => f.opacity === 1)) return null;
    return el.animate(frames, { duration: reduced ? Math.min(120, o.duration || 200) : (o.duration || 200), easing: o.easing || EASE, delay: reduced ? 0 : (o.delay || 0), fill: o.fill || 'none' });
  };
  DS.vt = (fn, type) => {
    if (!document.startViewTransition || RM() || Nav.still) { fn(); return; }
    V.inVT = true; if (type) document.documentElement.dataset.vt = type;
    const t = document.startViewTransition(() => fn());
    t.finished.finally(() => { V.inVT = false; delete document.documentElement.dataset.vt; });
  };
  // Fold a disclosure closed, then apply the state change.
  DS.collapse = (el, then) => {
    if (!el || RM() || Nav.still) { then(); return; }
    const h = el.getBoundingClientRect().height;
    const a = DS.play(el, [{ height: h + 'px', opacity: 1, overflow: 'hidden' }, { height: '0px', opacity: 0, overflow: 'hidden', paddingTop: '0px', paddingBottom: '0px', marginTop: '0px' }], { duration: 160, easing: EASE_IN, fill: 'forwards' });
    if (a) a.onfinish = then; else then();
  };
  const SEEN = 'ds-seen-v1';
  let seen = read(sessionStorage, SEEN) || {}, firstPaint = true;
  // A FLIP is measured inside its control (tab list, segmented track, switch), so page reflow never moves it.
  const flipFrame = el => el.closest('[role="tablist"],[role="radiogroup"],.segmented,.tabs__list,.ds-tog,.ds-switch-btn') || el.parentElement;
  const snapMotion = () => {
    const flips = {}, ticks = {};
    document.querySelectorAll('[data-flip]').forEach(el => { flips[el.dataset.flip] = { r: el.getBoundingClientRect(), f: flipFrame(el).getBoundingClientRect(), bg: getComputedStyle(el).backgroundColor }; });
    document.querySelectorAll('[data-tick]').forEach(el => { const [k, v] = el.dataset.tick.split('|'); ticks[k] = v; });
    const exits = [...document.querySelectorAll('#ds-overlays > [data-key]:not([data-exiting]), #ds-brain-slot > [data-key]:not([data-exiting])')].map(el => ({ el, key: el.dataset.key, parent: el.parentNode }));
    return { flips, ticks, exits };
  };
  const runFlips = prev => {
    if (RM() || firstPaint) return;
    document.querySelectorAll('[data-flip]').forEach(el => {
      const p = prev[el.dataset.flip]; if (!p) return;
      const r = el.getBoundingClientRect(), f = flipFrame(el).getBoundingClientRect(), bg = getComputedStyle(el).backgroundColor;
      const dx = (p.r.left - p.f.left) - (r.left - f.left), dy = (p.r.top - p.f.top) - (r.top - f.top), sx = r.width ? p.r.width / r.width : 1, sy = r.height ? p.r.height / r.height : 1;
      const moved = Math.abs(dx) > .5 || Math.abs(dy) > .5 || Math.abs(sx - 1) > .01 || Math.abs(sy - 1) > .01;
      if (!moved && bg === p.bg) return;
      const from = { transformOrigin: '0 0', transform: `translate(${dx}px,${dy}px) scale(${sx},${sy})` }, to = { transformOrigin: '0 0', transform: 'none' };
      if (bg !== p.bg) { from.backgroundColor = p.bg; to.backgroundColor = bg; }
      DS.play(el, [from, to], { duration: 280 });
    });
  };
  const SOFT = [{ transform: 'scale(.95)' }, { transform: 'scale(1.02)', offset: .55 }, { transform: 'scale(1)' }];
  const POP = [{ transform: 'scale(.6)', opacity: .4 }, { transform: 'scale(1.12)', opacity: 1, offset: .6 }, { transform: 'scale(1)', opacity: 1 }];
  const runTicks = prev => {
    document.querySelectorAll('[data-tick]').forEach(el => {
      const [k, v] = el.dataset.tick.split('|'), was = k in prev ? prev[k] : seen['t:' + k];
      seen['t:' + k] = v;
      if (was !== undefined && was !== v && v === 'on') DS.play(el, el.matches('.ds-opt,.ds-pill-btn,.ds-day,.ds-tog') ? SOFT : POP, { duration: el.matches('.ds-opt,.ds-pill-btn,.ds-day,.ds-tog') ? 220 : 320 });
    });
  };
  const runGrows = () => {
    document.querySelectorAll('[data-anim="grow"]:not([data-anim-done])').forEach(el => {
      // Content arriving with its container (a new tab, a new record) fades in with it; it does not also grow.
      if (el.parentElement && el.parentElement.closest('[data-anim]:not([data-anim-done]):not([data-anim="grow"])')) return;
      const h = el.getBoundingClientRect().height;
      DS.play(el, [{ height: '0px', opacity: 0, overflow: 'hidden' }, { height: h + 'px', opacity: 1, overflow: 'hidden' }], { duration: 260 });
    });
  };
  const runExits = exits => {
    exits.forEach(({ el, key, parent }) => {
      if (document.querySelector(`[data-key="${CSS.escape(key)}"]`) || !document.body.contains(parent)) return;
      if (V.inVT && parent.id === 'ds-brain-slot') return;
      el.setAttribute('data-exiting', ''); el.setAttribute('aria-hidden', 'true'); el.style.pointerEvents = 'none';
      el.querySelectorAll('[id]').forEach(n => n.removeAttribute('id'));
      let kf = [{ opacity: 1 }, { opacity: 0 }], d = 140;
      if (key.startsWith('peek-')) { kf = el.dataset.mode === 'center' ? [{ opacity: 1, transform: 'translate(-50%,0) scale(1)' }, { opacity: 0, transform: 'translate(-50%,8px) scale(.98)' }] : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(32px)' }]; d = 170; }
      if (key === 'brain-panel') { Object.assign(el.style, { position: 'absolute', top: '0', right: 'var(--gutter)', bottom: 'var(--gutter)' }); kf = [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateX(16px)' }]; d = 170; }
      if (key === 'brain-min') kf = [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(8px)' }];
      parent.appendChild(el);
      const a = DS.play(el, kf, { duration: d, easing: EASE_IN, fill: 'forwards' });
      if (a) a.onfinish = () => el.remove(); else el.remove();
    });
  };
  // Numbers and bars that changed since you last saw them (on this screen or another) count and fill.
  const runCounts = () => {
    const before = { ...seen };
    document.querySelectorAll('[data-count]').forEach(el => {
      const k = 'c:' + el.dataset.count, txt = el.textContent, n = parseInt(txt.replace(/[^\d-]/g, ''), 10); if (isNaN(n)) return;
      const was = before[k]; seen[k] = n;
      if (was === undefined || was === n || RM() || Nav.still) return;
      const t0 = performance.now(), d = 700;
      const step = now => { const p = Math.min(1, (now - t0) / d), e = 1 - Math.pow(1 - p, 3); el.textContent = txt.replace(String(n), String(Math.round(was + (n - was) * e))); if (p < 1) requestAnimationFrame(step); else el.textContent = txt; };
      requestAnimationFrame(step);
    });
    document.querySelectorAll('[data-bar]').forEach(el => {
      const k = 'b:' + el.dataset.bar, w = el.style.width, was = before[k]; seen[k] = w;
      if (!was || was === w) return;
      DS.play(el, [{ width: was }, { width: w }], { duration: 700, delay: 80 });
    });
    write(sessionStorage, SEEN, seen);
  };

  /* ───────── Render loop ───────── */
  let animSeen = new Set();
  function keepFocus(fn) {
    const a = document.activeElement; let key = null, sel = null;
    if (a && a !== document.body) {
      if (a.id) key = '#' + CSS.escape(a.id);
      else if (a.dataset.act) key = `[data-act="${a.dataset.act}"]` + (a.dataset.arg !== undefined ? `[data-arg="${CSS.escape(a.dataset.arg)}"]` : '');
      else if (a.dataset.palIndex) key = `[data-pal-index="${a.dataset.palIndex}"]`;
      if ('selectionStart' in a) try { sel = [a.selectionStart, a.selectionEnd]; } catch (_) {}
    }
    const scrolls = {}; document.querySelectorAll('[data-keep-scroll]').forEach(el => { scrolls[el.dataset.keepScroll] = [el.scrollTop, el.scrollLeft]; });
    fn();
    document.querySelectorAll('[data-keep-scroll]').forEach(el => { const k = scrolls[el.dataset.keepScroll]; if (k) { el.style.scrollBehavior = 'auto'; [el.scrollTop, el.scrollLeft] = k; el.style.scrollBehavior = ''; } });
    if (V.scrollChat) { document.querySelectorAll('#brain-chat,#page-chat').forEach(el => { el.scrollTop = el.scrollHeight; }); V.scrollChat = false; }
    if (key) { const el = document.querySelector(key); if (el && el !== document.activeElement) { el.focus({ preventScroll: true }); if (sel && 'setSelectionRange' in el) try { el.setSelectionRange(sel[0], sel[1]); } catch (_) {} } }
  }
  function settleAnims() {
    const now = new Set();
    document.querySelectorAll('[data-anim]').forEach((el, i) => { if (el.hasAttribute('data-exiting')) return; const k = el.dataset.key || (el.dataset.anim + ':' + i); now.add(k); if (animSeen.has(k) || Nav.still || firstPaint) el.setAttribute('data-anim-done', ''); });
    animSeen = now;
  }
  function render() {
    const sc = DS.screen; if (!sc || !document.getElementById('ds-main')) return;
    const snap = snapMotion();
    keepFocus(() => {
      const side = document.getElementById('ds-sidebar');
      side.innerHTML = sidebar(); side.toggleAttribute('data-rail', isRail()); side.toggleAttribute('data-drawer', isPhone()); side.toggleAttribute('data-open', isPhone() && !!V.drawer);
      side.inert = isPhone() && !V.drawer;
      document.getElementById('ds-topbar').innerHTML = topbar();
      document.getElementById('ds-main').innerHTML = sc.render();
      document.getElementById('ds-brain-slot').innerHTML = brainPanel();
      document.getElementById('ds-overlays').innerHTML = peek() + palette() + (sc.overlays ? sc.overlays() : '') + (V.menu && V.menu !== 'peek' ? '<div class="ds-pop__scrim" data-act="close-menu"></div>' : '') + (V.drawer && isPhone() ? '<div class="ds-drawer-scrim" data-act="close-drawer" data-anim="fade" data-key="drawer-scrim"></div>' : '');
    });
    settleAnims();
    runExits(snap.exits); runFlips(snap.flips); runTicks(snap.ticks); runGrows(); runCounts();
    firstPaint = false;
    markOverflow();
    if (sc.after) sc.after();
  }
  /* Scroll strips show their scroll affordance only when the content is wider than the strip. */
  function markOverflow() {
    document.querySelectorAll('[data-overflow-x]').forEach(el => { const box = el.closest('[data-overflow-host]') || el; box.toggleAttribute('data-overflowing', el.scrollWidth > el.clientWidth + 1); });
  }
  function renderBrainOnly() {
    const snap = snapMotion();
    keepFocus(() => {
      const slot = document.getElementById('ds-brain-slot'); if (slot) slot.innerHTML = brainPanel();
      const pc = document.getElementById('page-chat-inner'); if (pc) pc.innerHTML = DS.chatHTML(true);
    });
    settleAnims(); runTicks(snap.ticks);
  }
  DS.render = render;

  /* ───────── Global actions ───────── */
  const A = {
    'toggle-nav': () => { if (isPhone()) { A[V.drawer ? 'close-drawer' : 'open-drawer'](); return; } U.navRail = !isRail(); V.menu = null; save(); DS.vt(render, 'nav'); },
    'open-drawer': () => { V.drawer = true; V.menu = null; render(); const el = document.querySelector('#ds-sidebar .ds-nav[aria-current="page"]') || document.querySelector('#ds-sidebar a.ds-nav'); if (el) el.focus(); },
    'close-drawer': () => { V.drawer = false; V.menu = null; render(); const el = document.querySelector('.ds-topbar__menu'); if (el) el.focus(); },
    'nav-group': (el, g) => { U.navGrp[g] = !U.navGrp[g]; save(); render(); },
    'toggle-more': () => { U.moreOpen = !U.moreOpen; save(); render(); },
    menu: (el, m) => { V.menu = V.menu === m ? null : m; render(); },
    'close-menu': () => { V.menu = null; render(); },
    'guide-tab': (el, k) => { V.guideTab = k; render(); },
    theme: (el, k) => { if (document.documentElement.dataset.theme === k) return; try { localStorage.setItem('design-project-theme', k); } catch (_) {} if (params.has('theme')) params.set('theme', k); DS.vt(() => { document.documentElement.dataset.theme = k; render(); }, 'theme'); },
    reset: () => { write(localStorage, STORE, fresh()); write(sessionStorage, UI, { navRail: U.navRail, navGrp: U.navGrp, moreOpen: U.moreOpen }); try { sessionStorage.setItem('ds-toast', 'Prototype data reset'); } catch (_) {} const u = new URL(location.href); ['called', 'call', 'flag', 'added', 'approved', 'ask', 'chat', 'stage', 'choice'].forEach(k => u.searchParams.delete(k)); location.replace(u); },
    'toggle-brain': () => { const p = panel(); if (p === 'hidden') { const el = document.getElementById('brain-page-input'); if (el) el.focus(); return; } U.brainUser = p === 'open' ? 'closed' : 'open'; V.brainHere = U.brainUser === 'open'; U.seen = true; V.brainParam = null; save(); DS.vt(render, 'brain'); },
    'open-brain': () => DS.openBrain(),
    'min-brain': () => { U.brainUser = chatOn() ? 'min' : 'closed'; V.brainParam = null; save(); DS.vt(render, 'brain'); },
    'close-brain': () => { U.brainUser = 'closed'; V.brainParam = null; save(); DS.vt(render, 'brain'); },
    'new-chat': () => { U.msgs = []; U.chatId = null; U.chatTitle = null; V.draft = ''; V.thinking = false; V.stream = null; save(); render(); },
    'drop-scope': () => { U.scopeOff = true; save(); render(); },
    send: () => DS.sendText(V.draft),
    ask: (el, t) => DS.ask(t),
    'ask-nudge': (el, t) => DS.ask('Tell me more: ' + t),
    'approve-list': (el, i) => { U.msgs[+i] = { ...U.msgs[+i], pending: false, approved: true }; S.lists = [...(S.lists || []), 'LES debt due 2026']; save(); render(); DS.toast('List saved · 12 owners'); },
    'decline-list': (el, i) => { U.msgs[+i] = { ...U.msgs[+i], pending: false }; save(); render(); },
    'dismiss-acts': (el, i) => { const list = U.msgs || [D.proactive]; U.msgs = list.map((m, j) => j === +i ? { ...m, acts: [] } : m); save(); render(); },
    palette: (el, mode) => DS.openPalette(mode || 'search'),
    'close-palette': () => { V.pal = null; render(); },
    'pal-pick': (el, arg, ev) => { if (ev.shiftKey) { ev.preventDefault(); const [k, id] = arg.split(':'); V.pal = null; DS.openPeek(k, id); } },
    peek: (el, arg) => { const [k, id] = arg.split(':'); DS.openPeek(k, id); },
    'close-peek': () => { V.peek = null; V.menu = null; render(); if (DS.screen.onPeekClose) DS.screen.onPeekClose(); },
    'peek-tab': (el, k) => { V.peek.tab = k; V.peekDir = 0; render(); },
    'peek-mode': (el, k) => { V.peek.mode = k; V.menu = null; DS.vt(render, 'peek'); },
    'peek-step': (el, d) => { const list = DS.screen.peekList ? DS.screen.peekList() : []; if (!list.length) return; const cur = list.findIndex(([k, id]) => k === V.peek.k && id === V.peek.id); const n = list[(Math.max(cur, 0) + Number(d) + list.length) % list.length]; V.peek = { ...V.peek, k: n[0], id: n[1], tab: 'overview' }; V.peekDir = Number(d) < 0 ? -1 : 1; render(); },
    acc: (el, key) => { V.acc = V.acc || {}; const cur = el.getAttribute('aria-expanded') === 'true'; const go = () => { V.acc[key] = !cur; render(); }; if (cur) DS.collapse(el.nextElementSibling, go); else go(); },
  };
  Object.assign(DS.acts, A);

  document.addEventListener('click', ev => {
    const el = ev.target.closest('[data-act], a[href], [aria-disabled="true"]');
    if (!el) return;
    if (el.getAttribute('aria-disabled') === 'true') { ev.preventDefault(); return; }
    if (!el.dataset.act) return;
    if (el.hasAttribute('data-self') && ev.target !== el) return;
    const act = el.dataset.act, fn = (DS.screen && DS.screen.acts && DS.screen.acts[act]) || DS.acts[act];
    if (!fn) return;
    if (el.tagName !== 'A') ev.preventDefault();
    fn(el, el.dataset.arg, ev);
  });
  document.addEventListener('input', ev => {
    const el = ev.target, name = el.dataset && el.dataset.input; if (!name) return;
    if (name === 'draft') { V.draft = el.value; return; }
    if (name === 'palette') { V.pal.q = el.value; V.pal.active = 0; render(); return; }
    const fn = DS.screen.inputs && DS.screen.inputs[name]; if (fn) fn(el.value, el, ev);
  });
  document.addEventListener('change', ev => { const el = ev.target, name = el.dataset && el.dataset.change; if (!name) return; const fn = DS.screen.inputs && DS.screen.inputs[name]; if (fn) fn(el.value, el, ev); });
  document.addEventListener('keydown', ev => {
    const t = ev.target, typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);
    if (t && t.dataset && t.dataset.enter && ev.key === 'Enter' && !ev.shiftKey && !ev.isComposing) {
      ev.preventDefault(); const name = t.dataset.enter; if (name === 'send') DS.sendText(t.value); else { const fn = DS.screen.acts && DS.screen.acts[name]; if (fn) fn(t, t.value, ev); } return;
    }
    if (V.pal && t && t.id === 'palette-input') {
      const items = palItems().flatMap(g => g.items);
      if (ev.key === 'ArrowDown' || ev.key === 'ArrowUp') { ev.preventDefault(); V.pal.active = (V.pal.active + (ev.key === 'ArrowDown' ? 1 : -1) + items.length) % Math.max(items.length, 1); render(); return; }
      if (ev.key === 'Enter' && items[V.pal.active]) { ev.preventDefault(); const it = items[V.pal.active]; if (ev.shiftKey) { V.pal = null; DS.openPeek(it.kind, it.id); } else DS.navigate(palTarget(it, V.pal.mode === 'log')); return; }
    }
    if (ev.key === 'Escape') {
      if (DS.screen.onEscape && DS.screen.onEscape()) return;
      if (V.pal) { V.pal = null; render(); return; }
      if (V.menu) { V.menu = null; render(); return; }
      if (V.drawer) { A['close-drawer'](); return; }
      if (V.peek) { V.peek = null; render(); return; }
      return;
    }
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k') { ev.preventDefault(); DS.openPalette('search'); return; }
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'j') { ev.preventDefault(); A['toggle-brain'](); return; }
    if (DS.screen.onKey && DS.screen.onKey(ev)) return;
    if (typing) return;
    if (V.peek && (ev.key === 'ArrowUp' || ev.key === 'ArrowDown')) { ev.preventDefault(); A['peek-step'](null, ev.key === 'ArrowUp' ? -1 : 1); return; }
    if (V.peek && ev.key === 'Enter' && !(t && t.closest('a,button'))) { const pk = V.peek; DS.navigate(pk.k === 'c' ? href('contact', 'id=' + pk.id) : href('property', 'id=' + pk.id)); return; }
    if (ev.key === '[') { A['toggle-nav'](); return; }
    // Arrow keys move between in-page tabs.
    if ((ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') && t && t.getAttribute && t.getAttribute('role') === 'tab') {
      const tabs = [...t.closest('[role="tablist"]').querySelectorAll('[role="tab"]:not([aria-disabled="true"])')], i = tabs.indexOf(t), n = tabs[(i + (ev.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      if (n) { n.focus(); n.click(); ev.preventDefault(); }
    }
  });
  let railWas = null;
  addEventListener('resize', () => { markOverflow(); const r = layoutKey(); if (railWas !== null && r !== railWas) { if (!isPhone()) V.drawer = false; render(); } railWas = r; });

  /* ───────── Boot ───────── */
  const startScreen = () => {
    const sc = DS.screen;
    if (sc.init) sc.init();
    // Generic presets: peek=<contact or property id>, ask=<scripted question> on any screen.
    const pk = params.get('peek'); if (pk && !V.peek) { const k = cById[pk] ? 'c' : pById[pk] ? 'p' : null; if (k) V.peek = { k, id: pk, tab: params.get('peektab') || 'overview', mode: params.get('peekmode') || 'side' }; }
    if (params.get('ask') && sc.id !== 'brain') DS.seedChat(params.get('ask'), params.get('stage'));
    const pal = params.get('palette'); if (pal) V.pal = { mode: pal, q: params.get('pq') || '', active: 0 };
    if (params.get('guide')) { V.menu = 'guide'; V.guideTab = params.get('guide') === 'structure' ? 'structure' : 'flows'; }
    if (params.get('menu')) V.menu = params.get('menu');
    railWas = layoutKey();
    render();
    try { const t = sessionStorage.getItem('ds-toast'); if (t) { sessionStorage.removeItem('ds-toast'); DS.toast(t); } } catch (_) {}
    if (V.pal) setTimeout(() => { const el = document.getElementById('palette-input'); if (el) el.focus(); }, 20);
    here = location.pathname + location.search;
  };
  DS.boot = () => {
    if (!DS.screen) return;
    startScreen();
    // Live-call timer: update the clock without re-rendering the page.
    setInterval(() => { if (!U.call) return; const s = Math.floor((Date.now() - U.call.t0) / 1000), txt = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); document.querySelectorAll('[data-calltime]').forEach(el => { el.textContent = txt; }); }, 1000);
  };

  /* ───────── Screen switching ─────────
     Every move is still a real link (the portal export and new tabs rely on that). Same-folder pages
     swap in place instead of reloading: fetch the page, run its screen script, re-render, and push the
     URL. The shell, Brain and timers stay mounted, so moving around feels like one app. Exported portal
     files, file:// and failures fall back to a normal page load. */
  let here = location.pathname + location.search, navSeq = 0;
  const pages = new Map(), codes = new Map();
  const canSwap = !Nav.exported && /^https?:$/.test(location.protocol) && !!window.DOMParser && !!(history && history.pushState);
  const folder = p => p.replace(/[^/]*$/, '');
  const isScreen = url => url.origin === location.origin && folder(url.pathname) === folder(location.pathname) && /\.html$/.test(url.pathname);
  const text = u => fetch(u, { credentials: 'same-origin' }).then(r => { if (!r.ok) throw new Error(r.status); return r.text(); });
  const loadScreen = url => {
    const key = url.pathname;
    if (!pages.has(key)) {
      const job = text(url.pathname).then(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const src = [...doc.querySelectorAll('script[src]')].map(x => new URL(x.getAttribute('src'), url).href).find(x => /\/js\/screens\//.test(x));
        if (!src) throw new Error('No screen script');
        if (!codes.has(src)) codes.set(src, text(src));
        return codes.get(src).then(code => ({ title: doc.title, page: doc.body.dataset.page, routes: (doc.querySelector('nav[data-routes]') || {}).innerHTML, code, src }));
      });
      job.catch(() => { pages.delete(key); });
      pages.set(key, job);
    }
    return pages.get(key);
  };
  const swapTo = (pg, url) => {
    [...new Set(params.keys())].forEach(k => params.delete(k));
    url.searchParams.forEach((v, k) => params.append(k, v));
    snapshot = isSnapshot();
    S = { ...fresh(), ...(read(localStorage, STORE) || {}) };
    U = loadU();
    Object.assign(V, freshV());
    document.title = pg.title;
    if (pg.page) document.body.dataset.page = pg.page; else delete document.body.dataset.page;
    const routes = document.querySelector('nav[data-routes]'); if (routes && pg.routes != null) routes.innerHTML = pg.routes;
    hideTip();
    const had = document.activeElement && document.activeElement !== document.body;
    DS.screen = null;
    const run = document.createElement('script'); run.textContent = pg.code + '\n//# sourceURL=' + pg.src; document.head.appendChild(run); run.remove();
    if (!DS.screen) { location.reload(); return; }
    const main = document.getElementById('ds-main');
    DS.vt(() => { firstPaint = true; animSeen = new Set(); startScreen(); main.scrollTop = 0; });
    if (had && (!document.activeElement || document.activeElement === document.body)) main.focus({ preventScroll: true });
    const say = document.getElementById('ds-announce'); if (say) say.textContent = pg.title.replace(/ — .*$/, '');
    dispatchEvent(new CustomEvent('screenchange', { detail: { href: location.href } }));
  };
  DS.navigate = (to, { replace = false, pop = false } = {}) => {
    const url = new URL(to, location.href);
    const hard = () => (replace || pop) ? location.replace(url.href) : location.assign(url.href);
    if (!canSwap || !isScreen(url)) { hard(); return; }
    const seq = ++navSeq;
    loadScreen(url).then(pg => {
      if (seq !== navSeq) return;
      DS.referrer = location.href;
      if (!pop) history[replace ? 'replaceState' : 'pushState']({ ds: 1 }, '', url.href);
      swapTo(pg, url);
    }).catch(() => { if (seq === navSeq) hard(); });
  };
  Nav.go = (name, query) => DS.navigate(Nav.route(name, query));
  Nav.replace = (name, query) => DS.navigate(Nav.route(name, query), { replace: true });
  const swappable = ev => {
    const a = ev.target.closest && ev.target.closest('a[href]');
    if (!canSwap || !a || (a.target && a.target !== '_self') || a.hasAttribute('download')) return null;
    const url = new URL(a.href, location.href); return isScreen(url) ? url : null;
  };
  document.addEventListener('click', ev => {
    if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
    const url = swappable(ev); if (!url) return;
    if (url.pathname + url.search === location.pathname + location.search) { if (!url.hash) ev.preventDefault(); return; }
    ev.preventDefault(); DS.navigate(url.href);
  });
  // Warm the next screen while the pointer is on its link.
  const warm = ev => { const url = swappable(ev); if (url) loadScreen(url).catch(() => {}); };
  document.addEventListener('pointerover', warm); document.addEventListener('focusin', warm);
  addEventListener('popstate', () => { if (location.pathname + location.search !== here) DS.navigate(location.href, { pop: true }); });
  DS.setUI = patch => { Object.assign(U, patch); save(); };
  DS.setStore = patch => { Object.assign(S, patch); save(); };
  // Deferred screen scripts run after this file but before DOMContentLoaded, so boot there.
  // A screen registered after the document is ready boots itself from DS.define().
  // A page transition interrupted by another click is simply dropped; keep that out of the console.
  const quiet = e => { const t = e.viewTransition; if (t) [t.ready, t.finished, t.updateCallbackDone].forEach(x => x && x.catch(() => {})); };
  addEventListener('pageswap', quiet); addEventListener('pagereveal', quiet);
  let booted = false, domReady = false;
  const bootOnce = () => { if (booted || !DS.screen) return; booted = true; DS.boot(); };
  document.addEventListener('DOMContentLoaded', () => { domReady = true; bootOnce(); });
  if (document.readyState === 'complete') domReady = true;
  DS.define = screen => { DS.screen = screen; if (domReady) setTimeout(bootOnce, 0); };
})();
