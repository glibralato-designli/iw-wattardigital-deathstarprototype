/* App 03 Contact case file: identity and quick actions, the why now with its trust, the live call, the outcome sheet and the record tabs. */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const id = D.cById[params.get('id')] ? params.get('id') : 'marchetti';
  const c = D.cById[id], p = D.pById[c.pid];
  const S = DS.S(), U = DS.U();
  const TABS = [['overview', 'Overview'], ['intelligence', 'Intelligence'], ['ownership', 'Ownership'], ['activity', 'Activity'], ['details', 'Details'], ['history', 'History']];
  const st = { tab: TABS.some(t => t[0] === params.get('tab')) ? params.get('tab') : 'overview', noteDraft: '', saving: params.get('call') === 'saving', logged: params.get('call') === 'logged' ? 'No answer' : null };
  const dnc = c.status === 'Do not contact';

  /* Presets: call=live|outcome|saving|logged|log, choice=<outcome>, res=<results, comma-separated>, why=open, note=1, flag=<evidence index>. */
  const call = params.get('call');
  if (call === 'live') { if (!U.call || U.call.id !== id) DS.setUI({ call: { id, t0: Date.now() - 74000 }, outcome: null }); }
  if (call === 'outcome' || call === 'saving') DS.setUI({ call: null, outcome: DS.OUT.preset(id, '2:14') });
  if (call === 'log') DS.setUI({ call: null, outcome: DS.OUT.blank(id, null) });
  if (call === 'logged') { S.done[id] = true; S.calls += 1; S.last[id] = 'Just now · No answer'; DS.addTimeline(id, { k: 'Call', t: 'No answer · 0:42', d: 'Just now' }); }
  if (params.has('flag')) S.flags[id + ':' + params.get('flag')] = true;
  if (params.get('why') === 'open') DS.V.sheet = 'why';
  if (params.get('note') === '1') DS.V.sheet = 'note';
  const byDigits = d => (D.contactPoints(c).find(x => x[0] === 'phone' && x[1].replace(/\D/g, '') === d) || [])[1];
  if (params.has('primary') && byDigits(params.get('primary'))) S.primary[id] = byDigits(params.get('primary'));
  if (params.get('blasts') === '1') S.blastOut[id] = DS.BLAST_UNTIL;
  if (params.has('dialed') && U.outcome && U.outcome.id === id && byDigits(params.get('dialed'))) DS.setUI({ outcome: { ...U.outcome, num: byDigits(params.get('dialed')) } });
  const trigger = params.get('act');
  if (trigger === 'call' && !dnc) DS.setUI({ call: { id, t0: Date.now() }, outcome: null });
  if (trigger === 'log') DS.setUI({ call: null, outcome: DS.OUT.blank(id, null) });
  if (trigger && !Nav.exported) { params.delete('act'); const u = new URL(location.href); u.searchParams.delete('act'); history.replaceState(null, '', u); }
  DS.remember(id);

  const onCall = () => !!(U.call && U.call.id === id);
  const outcome = () => U.outcome && U.outcome.id === id ? U.outcome : null;
  const callTime = () => { if (!U.call) return '0:00'; const s = Math.floor((Date.now() - U.call.t0) / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const hash = s => [...s].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7), n = hash(c.id);
  const portfolio = DS.portfolio(c);
  const first = c.name.split(' ')[0].toLowerCase(), lastN = c.name.split(' ')[1].toLowerCase();
  const ICON = { Call: 'phone', Email: 'envelope-simple', Note: 'note', Flag: 'warning-diamond', Text: 'chat-text', Broadcast: 'megaphone', Event: 'calendar-blank' };
  const rel = DS.relOf(c);
  const evidence = () => DS.evidenceOf(c);
  const disputed = () => evidence().some(e => e.k === 'disputed');
  const trustNow = () => evidence().some(e => e.flagged) || (disputed() && c.id !== 'marchetti') ? 'disputed' : c.trust;
  const nextId = () => { const ids = DS.callIds(), i = ids.indexOf(id); return ids.slice(i + 1).concat(ids.slice(0, Math.max(i, 0))).find(x => !DS.S().done[x] && x !== id) || null; };

  const head = () => ({ title: c.name, large: true, back: ['Back', 'contacts', '', 'history'], actions: nextId() ? `<a class="button" data-variant="ghost" data-size="sm" href="${href('contact', 'id=' + nextId())}">Next${icon('caret-right')}</a>` : '' });

  /* ───────── Identity, quick actions, call ───────── */
  const identity = () => `<div class="ds-aid"><span class="ds-aid__av" aria-hidden="true">${esc(DS.initials(c.name))}</span><h1>${esc(c.name)}</h1>${ui.cls(c.cls, true)}<span class="ds-aid__meta">${esc(c.entity)} · ${esc(c.meta.split(' · ')[1])}</span>
    <div class="ds-aid__chips">${ui.rankChip(c)}${ui.bldChip(p)}<span class="ds-chip" data-tone="outline"><span class="ds-dot" data-tone="${ui.statusDot(c.status)}"></span>${esc(c.status)}</span><span class="ds-chip">${esc(D.TIER[c.cls])}</span></div>${ui.lift(c)}</div>`;
  const quick = () => {
    if (onCall()) return `<section class="ds-callcard" role="status" aria-live="polite" data-anim="unroll" data-key="callcard"><span class="ds-meta">On a call · ${esc(DS.bestPhone(c))}</span><span class="ds-callcard__time" data-calltime aria-label="Call length">${callTime()}</span>${ui.btn({ label: 'End call', ic: 'phone-disconnect', act: 'end-call' })}</section>`;
    const callBtn = dnc ? `<span class="ds-qact" role="button" tabindex="0" aria-disabled="true" data-tip="Asked not to be contacted">${icon('phone')}Call</span>` : `<button type="button" class="ds-qact"${st.logged ? '' : ' data-primary'} data-act="start-call">${icon('phone')}Call</button>`;
    return `<div class="ds-qacts">${callBtn}<button type="button" class="ds-qact" data-act="sheet" data-arg="note">${icon('note')}Note</button><span class="ds-qact" role="button" tabindex="0" aria-disabled="true" data-tip="${DS.OFF}">${icon('chat-text')}Text</span><span class="ds-qact" role="button" tabindex="0" aria-disabled="true" data-tip="${DS.OFF}">${icon('envelope-simple')}Email</span></div>`;
  };
  const logged = () => {
    if (!st.logged) return '';
    const nx = nextId(), nc = nx && D.cById[nx];
    return `<section class="ds-acard" aria-label="Call logged" data-anim="grow" data-key="logged"><div class="ds-acard__head"><div class="ds-acard__title"><h2>Call logged</h2><span class="badge" data-status="success">${icon('check-circle')}${esc(st.logged)}</span></div><span class="ds-meta-strong"><span data-count="calls">${DS.callsDone()}</span> of 40 calls today</span>${ui.progress(DS.callsDone() / 40, 'Calls today', { key: 'calls' })}</div>
      <div class="ds-acard__foot">${nc ? ui.btn({ label: 'Call ' + nc.name + ' next', ic: 'phone', link: href('contact', 'id=' + nx + '&act=call'), extra: { 'data-block': true } }) + `<span class="ds-meta" style="text-align:center">${esc(nc.why)}</span>` : ui.btn({ label: 'Back to Today', link: href('attack-plan'), extra: { 'data-block': true } })}</div></section>`;
  };

  /* ───────── Why now ───────── */
  const whyCard = () => {
    const ev = evidence(), trustK = trustNow();
    const alert = disputed() ? (() => { const d = ev.filter(e => e.k === 'disputed'), what = d.length === 1 ? d[0].l + ' is disputed.' : d.length + ' facts are disputed.'; return trustK === 'disputed' ? `<div class="alert" data-status="danger" role="alert">${icon('warning-diamond')}<span>${esc(what)} Check before you say it.</span></div>` : `<div class="alert" data-status="warning">${icon('warning-diamond')}<span>${esc(what)} It isn’t part of this why now.</span></div>`; })() : '';
    return `<section class="ds-why" aria-label="Why now"><div class="ds-why__head">${icon('sparkle')}<h2>Why now</h2>${ui.trust(trustK)}<span class="ds-grow"></span><span class="ds-meta">2d ago</span></div>${alert}
      <p class="ds-why__text">${esc(c.whyFull)}</p>
      <div class="ds-toolbar" style="gap:var(--space-1-5)"><span class="ds-chip">${esc(c.narrative)}</span><span class="ds-chip">Momentum: ${esc(c.momentum)}</span></div>
      <div class="ds-why__actions" style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr))">${ui.btn({ label: 'Why this?', variant: 'outline', act: 'sheet', arg: 'why' })}${ui.btn({ label: 'Ask Brain', ic: 'sparkle', variant: 'outline', act: 'ask', arg: 'Why now for ' + c.name + '?' })}</div></section>`;
  };
  const whySheet = () => { const ev = evidence();
    return ui.sheet({ key: 'why', title: 'Why this?', size: 'full', body: `<div class="ds-stack" data-gap="4">
      <div class="ds-sheet-sec"><h3>Top drivers</h3>${D.drivers(c).map(([l, pp], i) => `<div class="ds-driver"><span>${i + 1}</span><span>${esc(l)}</span><span class="ds-meta-strong num">${pp}</span></div>`).join('')}</div>
      <div class="ds-sheet-sec"><h3>Evidence</h3>${ev.map(e => `<div class="ds-optrow" style="align-items:flex-start"><span><span class="font-medium">${esc(e.l)}</span><span class="ds-meta">${esc(e.v)} · ${esc(e.m)}</span>${e.canFlag ? `<button type="button" class="ds-link-btn" style="align-self:flex-start;margin-top:var(--space-1)" data-act="flag" data-arg="${e.i}">Flag as wrong</button>` : e.flagged ? '<span class="ds-evidence__flagged">Flagged</span>' : ''}</span>${ui.trust(e.k)}</div>`).join('')}</div>
      <div class="ds-sheet-sec"><h3>Lowers the likelihood</h3>${D.antis(c).map(a => `<div class="ds-anti">${icon('arrow-down')}${esc(a)}</div>`).join('')}</div></div>` }); };

  /* ───────── Tabs ───────── */
  const tabs = () => `<div class="ds-achips" style="padding-block:0" data-keep-scroll="ctabs">${ui.stateTabs(TABS.map(([k, l]) => [k, k === 'ownership' ? 'Ownership (' + portfolio.length + ')' : k === 'activity' ? 'Activity (' + DS.timelineOf(c).length + ')' : l]), st.tab, 'tab', 'Record')}</div>`;
  const conf = x => x >= 80 ? 'good' : x >= 60 ? 'ok' : x >= 45 ? 'warn' : 'bad';
  const reach = () => {
    const phone = DS.bestPhone(c), dead = DS.badOf(c).includes(phone), rows = [['phone', 'Best phone' + (dead ? ' · marked bad' : ' · Primary'), phone, dead ? 12 : 70 + (n % 26), (S.primary[id] === phone ? 'confirmed by us' : 'mobile · 3 sources') + ((S.texts || {})[id] ? ' · asked for texts' : '')], ['envelope-simple', 'Personal email', first + '.' + lastN + '@example.com', 55 + (n % 30), '2 sources'], ['briefcase', 'Business email', first[0] + lastN + '@' + c.entity.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').slice(0, 2).join('') + '.com', 45 + ((n >> 3) % 30), '1 source']];
    return `<section class="ds-asec" aria-label="Best way to reach"><div class="ds-ahead"><h2>Best way to reach</h2></div><div class="ds-alist">${rows.map(([ic, l, v, pc, src]) => `<div class="ds-arow" data-lead><span class="ds-arow__lead">${icon(ic)}</span><span class="ds-arow__body"><span class="ds-arow__sub">${esc(l)} · ${esc(src)}</span><span class="ds-arow__title" style="overflow-wrap:anywhere;white-space:normal">${esc(v).replace('@', '@<wbr>')}</span></span><span class="ds-conf" data-tone="${conf(pc)}">${pc}%</span></div>`).join('')}</div></section>`;
  };
  const facts = () => `<section class="ds-asec" aria-label="Key facts"><div class="ds-ahead"><h2>Key facts</h2><button type="button" class="ds-link-btn" data-act="tab" data-arg="intelligence">All signals</button></div><div class="ds-acard" style="padding:0 var(--space-4)">${ui.kv([['Lead property', p.addr], ['Debt', p.debt], ['Maturity', p.mat], ['Years held', c.years + ' years'], ['Last touch', DS.lastOf(c)]], { cols: 1 })}</div></section>`;
  const timeline = (limit) => { const tl = DS.timelineOf(c).slice(0, limit || 99);
    return tl.length ? `<div class="ds-alist">${tl.map(x => `<div class="ds-arow${params.get('hl') && x.id === params.get('hl') ? ' ds-hl' : ''}"${x.id ? ` id="tl-${esc(x.id)}"` : ''} data-lead><span class="ds-arow__lead" data-tone="plain">${icon(ICON[x.k] || 'note')}</span><span class="ds-arow__body"><span class="ds-arow__title">${esc(x.k === 'Event' ? 'Calendar' : x.k)}</span><span class="ds-arow__sub">${esc(x.t)}</span></span><span class="ds-arow__end">${esc(x.d)}</span></div>`).join('')}</div>` : `<div class="ds-alist"><div class="ds-arow"><span class="ds-arow__sub">Nothing logged yet.</span></div></div>`; };
  const relationship = () => `<section class="ds-asec" aria-label="Relationship"><div class="ds-ahead"><h2>Relationship</h2><span class="ds-meta">${rel.touches} touches since ${rel.since}</span></div>
    <div class="ds-acard ds-arel"><div class="ds-toolbar" style="gap:var(--space-1-5)"><span class="ds-chip" data-tone="outline">Warmth ${rel.warmth}</span>${rel.team.length ? `<a class="ds-teamchip" href="${href('property', 'id=' + rel.teamPid + '&tab=team')}">${icon('users')}Team knows this building</a>` : ''}</div>
      ${rel.notes.length ? `<div class="ds-stack" style="gap:var(--space-2)"><span class="ds-meta-strong">${icon('sparkle')} The notes that matter</span>${rel.notes.map(x => `<a class="ds-rel__note" href="${href('contact', 'id=' + id + '&tab=activity' + (x.id ? '&hl=' + x.id : ''))}" style="color:inherit;text-decoration:none"><p>${esc(x.t)}</p><span class="ds-meta">${esc(x.d)} · Open in Activity</span></a>`).join('')}<span class="ds-meta">Picked by Brain from ${rel.notesOf} notes.</span></div>` : ''}
      ${rel.who.length ? `<div class="ds-stack" style="gap:var(--space-2)"><span class="ds-meta-strong">Who on the team knew them</span>${rel.who.map(([w, l]) => `<div class="ds-rel__who"><span class="avatar" data-size="sm">${esc(DS.initials(w))}</span><span class="ds-row__body"><span class="font-medium">${esc(w)}</span><span class="ds-row__sub" style="white-space:normal">${esc(l)}</span></span></div>`).join('')}</div>` : ''}
      ${rel.said ? `<div class="ds-stack" style="gap:var(--space-1)"><span class="ds-meta-strong">What they said</span><p class="ds-rel__quote">“${esc(rel.said[0])}”</p><span class="ds-meta">${esc(rel.said[1])}</span></div>` : ''}
      ${rel.angle ? `<div class="ds-rel__line">${icon('sparkle')}<span><b>Suggested angle.</b> ${esc(rel.angle)}</span></div>` : ''}${rel.next ? `<div class="ds-rel__line">${icon('arrow-right')}<span><b>Next touch.</b> ${esc(rel.next[0])} · ${esc(rel.next[1].replace(/^Suggest/, 'suggest'))}.</span></div>` : ''}</div></section>`;
  const overview = () => `${whyCard()}${relationship()}${reach()}${facts()}<section class="ds-asec" aria-label="Recent activity"><div class="ds-ahead"><h2>Recent activity</h2><button type="button" class="ds-link-btn" data-act="tab" data-arg="activity">View all</button></div>${timeline(3)}</section>`;
  const intelligence = () => {
    return `<section class="ds-acard" style="padding:var(--space-4);display:flex;flex-direction:column;gap:var(--space-3)" aria-label="Predictive score"><span class="ds-meta-strong">Predictive score · ${esc(p.addr)}</span><span class="ds-score-big">${p.score}</span><div class="ds-toolbar" style="gap:var(--space-1-5)">${ui.cls(p.cls, true)}<span class="ds-chip">${esc(D.TIER[c.cls])}</span><span class="ds-chip" title="Relationship warmth, 0–100. Never added to the predictive score.">Warmth ${rel.warmth}</span></div><span class="ds-meta">Sets Rank ${c.rank} · Model v4 · scored Sep 29, 05:40 UTC</span></section>
      <section class="ds-asec" aria-label="Drivers"><div class="ds-ahead"><h2>Top drivers</h2></div><div class="ds-acard" style="padding:var(--space-2) var(--space-4)">${D.drivers(c).map(([l, pp], i) => `<div class="ds-driver"><span>${i + 1}</span><span>${esc(l)}</span><span class="ds-meta-strong num">${pp}</span></div>`).join('')}</div></section>
      <section class="ds-asec" aria-label="Evidence"><div class="ds-ahead"><h2>Evidence</h2></div><div class="ds-alist">${evidence().map(e => `<div class="ds-arow"><span class="ds-arow__body"><span class="ds-arow__title">${esc(e.l)}</span><span class="ds-arow__sub">${esc(e.v)} · ${esc(e.m)}</span></span>${ui.trust(e.k)}</div>`).join('')}</div></section>`; };
  const ownership = () => `<section class="ds-asec" aria-label="Ownership"><div class="ds-ahead"><h2>${portfolio.length} ${portfolio.length === 1 ? 'property' : 'properties'}</h2></div><div class="ds-alist">${portfolio.map(x => `<a class="ds-arow" data-lead href="${href('property', 'id=' + x.id)}"><span class="ds-arow__lead">${icon('buildings')}</span><span class="ds-arow__body"><span class="ds-arow__title">${esc(x.addr)}${x.id === c.pid ? ' · Lead' : ''}</span><span class="ds-arow__sub">${esc(x.hood)} · ${x.units} units · debt ${esc(x.debt)}</span></span><span class="ds-arow__end">${icon('caret-right')}</span></a>`).join('')}</div></section>
    <section class="ds-asec" aria-label="Connected people"><div class="ds-ahead"><h2>Connected people</h2></div><div class="ds-alist">${rel.connected.length ? rel.connected.map(([nm, how, cid]) => cid ? `<a class="ds-arow" data-lead href="${href('contact', 'id=' + cid)}"><span class="ds-arow__lead">${esc(DS.initials(nm))}</span><span class="ds-arow__body"><span class="ds-arow__title">${esc(nm)}</span><span class="ds-arow__sub">${esc(how)}</span></span><span class="ds-arow__end">${icon('caret-right')}</span></a>` : `<div class="ds-arow" data-lead><span class="ds-arow__lead">${esc(DS.initials(nm))}</span><span class="ds-arow__body"><span class="ds-arow__title">${esc(nm)}</span><span class="ds-arow__sub">${esc(how)} · not in the database</span></span></div>`).join('') : '<div class="ds-arow"><span class="ds-arow__sub">No co-owners or partners on record.</span></div>'}</div></section>`;
  const details = () => `${S.blastOut[id] ? `<span class="ds-chip" data-tone="outline" style="align-self:flex-start">${icon('megaphone')}Excluded from blasts until ${esc(S.blastOut[id])}</span>` : ''}<section class="ds-acard" style="padding:0 var(--space-4)" aria-label="Record">${ui.kv([['Contact owner', 'Thomas W.'], ['Lead stage', D.TIER[c.cls]], ['Status', c.status], ['Entity', c.entity], ['Owner type', c.meta], ['Source', 'ACRIS, Apollo'], ['Last updated', 'Sep 28, 2026']], { cols: 1 })}</section>`;
  const was = (D.contactPoints(c).find(x => x[0] === 'phone' && x[2] === 'Primary') || [])[1];
  const history = () => `<div class="ds-alist">${[...(S.blastOut[id] ? [['Blast status', 'Included', 'Excluded until ' + S.blastOut[id], 'Just now · logged call']] : []), ...DS.badOf(c).map(x => ['Phone marked bad', x, 'Bad', 'Just now · logged call']), ...(S.primary[id] && S.primary[id] !== was ? [['Primary phone', was, S.primary[id], 'Just now · logged call']] : []), ['Primary phone', '(212) 555-0199', was, 'Sep 28 · Thomas W.'], ['Status', 'New', c.status, 'Aug 21 · Thomas W.'], ['Lead stage', 'Tier 2 · Warm', D.TIER[c.cls], 'Jun 2 · Model v4']].map(([f, a, b, w]) => `<div class="ds-arow"><span class="ds-arow__body"><span class="ds-arow__sub">${esc(f)} · ${esc(w)}</span><span><s style="color:var(--fg-disabled)">${esc(a)}</s> → <span class="font-medium">${esc(b)}</span></span></span></div>`).join('')}</div>`;
  const BODY = { overview, intelligence, ownership, activity: () => timeline(), details, history };

  /* ───────── Sheets ───────── */
  const ACTS = [['note', 'Save note to record'], ['primary', 'Mark number primary'], ['bad', 'Mark number bad'], ['blasts', 'Remove from blasts for 1 year']];
  const outcomeSheet = () => { const oc = outcome(); if (!oc) return '';
    const FOLLOW = [['', 'No'], ['Tomorrow', 'Tomorrow'], ['Next week', 'Next week'], ['In a month', 'In a month']], O = DS.OUT, reached = O.reached(oc.choice), res = oc.res || {};
    const nums = DS.contactPointsOf(c).filter(x => x[0] === 'phone' && x[2] !== 'Bad').map(x => x[1]), num = oc.num || DS.bestPhone(c);
    return ui.sheet({ key: 'outcome-' + (oc.dur ? 'call' : 'hand'), title: 'Log the outcome', close: 'skip-outcome', size: 'full', body: `<p class="ds-meta">${esc((oc.dur ? 'Call lasted ' + oc.dur : 'Logged by hand') + ' · ' + num)}</p>
      ${nums.length > 1 ? `<div class="ds-sheet-sec"><h3>Number reached</h3><div class="ds-achips" style="margin:0;padding:0;flex-wrap:wrap" role="radiogroup" aria-label="Number reached">${nums.map(x => `<button type="button" class="ds-fchip num" role="radio" aria-checked="${x === num}" aria-pressed="${x === num}" data-act="pick-num" data-arg="${esc(x)}">${esc(x)}</button>`).join('')}</div></div>` : ''}
      <div class="ds-sheet-sec" role="radiogroup" aria-label="Outcome"><h3>Outcome</h3><div class="ds-opts">${O.main.map(o => `<button type="button" class="ds-optrow" role="radio" aria-checked="${oc.choice === o}" data-act="pick-outcome" data-arg="${o}"><span>${o}</span><span class="ds-optrow__mark" data-tick="opt-${o}|${oc.choice === o ? 'on' : 'off'}">${icon('check')}</span></button>`).join('')}</div>
        <div class="ds-achips" style="margin:0;padding:0;flex-wrap:wrap;align-items:center"><span class="ds-meta">Not reached</span>${O.quick.map(o => `<button type="button" class="ds-fchip" role="radio" aria-checked="${oc.choice === o}" aria-pressed="${oc.choice === o}" data-act="pick-outcome" data-arg="${o}">${oc.choice === o ? icon('check') : ''}${o}</button>`).join('')}</div></div>
      ${reached ? `<div class="ds-sheet-sec"><h3>What came out of it</h3><div class="ds-achips" style="margin:0;padding:0;flex-wrap:wrap">${O.results.map(([k, l]) => `<button type="button" class="ds-fchip" role="checkbox" aria-checked="${!!res[k]}" aria-pressed="${!!res[k]}" data-act="toggle-res" data-arg="${k}">${res[k] ? icon('check') : ''}${l}</button>`).join('')}</div></div>
      <div class="ds-sheet-sec"><label class="field"><span class="field__label">What they said</span><textarea id="out-said" class="field__control" rows="2" placeholder="In their words" data-input="outSaid">${esc(oc.said || '')}</textarea><span class="ds-meta">Saved as their claim, sourced to this call.</span></label></div>` : ''}
      <div class="ds-sheet-sec"><h3>Call back</h3><div class="ds-achips" style="margin:0;padding:0;flex-wrap:wrap">${FOLLOW.map(([k, l]) => `<button type="button" class="ds-fchip" aria-pressed="${(oc.follow || '') === k}" data-act="follow" data-arg="${k}">${l}</button>`).join('')}</div></div>
      <div class="ds-sheet-sec"><label class="field"><span class="field__label">Your notes</span><textarea id="out-notes" class="field__control" rows="3" placeholder="Optional" data-input="outNotes">${esc(oc.notes)}</textarea></label></div>
      <div class="ds-sheet-sec"><h3>Also</h3><div class="ds-opts">${ACTS.map(([k, l]) => `<button type="button" class="ds-optrow" data-kind="check" role="checkbox" aria-checked="${!!oc.acts[k]}" data-act="toggle-oact" data-arg="${k}"><span>${l}</span><span class="ds-optrow__mark">${icon('check')}</span></button>`).join('')}</div></div>`,
      foot: ui.btn({ label: 'Skip', variant: 'outline', act: 'skip-outcome' }) + (oc.choice ? ui.btn({ label: st.saving ? 'Saving' : 'Save outcome', act: 'save-outcome', busy: st.saving, id: 'save-outcome' }) : `<button type="button" class="button" aria-disabled="true" data-tip="Pick an outcome first">Save outcome</button>`) }); };
  const noteSheet = () => ui.sheet({ key: 'note', title: 'Add a note', body: `<label class="field" style="padding-top:var(--space-2)"><span class="field__label">What did you learn?</span><textarea id="note-draft" class="field__control" rows="4" data-input="noteDraft">${esc(st.noteDraft)}</textarea></label>`, foot: ui.btn({ label: 'Cancel', variant: 'outline', act: 'close-sheet' }) + ui.btn({ label: 'Save note', act: 'save-note' }) });
  const overlays = () => outcome() ? outcomeSheet() : DS.V.sheet === 'why' ? whySheet() : DS.V.sheet === 'note' ? noteSheet() : '';

  // Saving applies the outcome's actions exactly as on the web (DS.applyOutcome).
  const doSave = () => { const oc = outcome(), ch = oc.choice, said = DS.applyOutcome(c, oc); st.saving = false; st.logged = ch; DS.render(); DS.toast(said); };

  DS.define({
    id: 'contact', nav: 'database', tab: 'database',
    head, scope: () => c.name,
    render: () => `<div class="ds-apage">${dnc ? `<div class="alert" data-status="danger" role="alert">${icon('warning-diamond')}<span>Asked not to be contacted. Calls are off for this owner.</span></div>` : ''}${identity()}${logged()}${quick()}${tabs()}<div class="ds-stack" style="gap:var(--space-6)" data-anim="fade" data-key="ctab-${st.tab}">${BODY[st.tab]()}</div></div>`,
    overlays,
    after: () => { if (params.get('hl') && st.tab === 'activity' && !st.hlDone) { st.hlDone = true; const el = document.getElementById('tl-' + params.get('hl')); if (el) el.scrollIntoView({ block: 'center' }); } if (st.focus) { const el = document.getElementById(st.focus); st.focus = null; if (el) el.focus(); } },
    acts: {
      tab: (el, k) => { st.tab = k; DS.render(); },
      sheet: (el, k) => { DS.V.sheet = k; if (k === 'note') st.focus = 'note-draft'; DS.render(); },
      'start-call': () => { if (dnc) return; st.logged = null; DS.setUI({ call: { id, t0: Date.now() }, outcome: null }); DS.render(); },
      'end-call': () => { const dur = callTime(); DS.setUI({ call: null, outcome: DS.OUT.blank(id, dur) }); DS.render(); },
      'pick-outcome': (el, o) => { DS.setUI({ outcome: DS.OUT.pick(outcome(), o) }); DS.render(); },
      'toggle-res': (el, k) => { const oc = outcome(); DS.setUI({ outcome: { ...oc, res: { ...oc.res, [k]: !(oc.res || {})[k] } } }); DS.render(); },
      'pick-num': (el, x) => { DS.setUI({ outcome: { ...outcome(), num: x } }); DS.render(); },
      'toggle-oact': (el, k) => { const oc = outcome(); DS.setUI({ outcome: { ...oc, acts: { ...oc.acts, [k]: !oc.acts[k] } } }); DS.render(); },
      follow: (el, k) => { DS.setUI({ outcome: { ...outcome(), follow: k } }); DS.render(); },
      'save-outcome': () => { if (st.saving) return; st.saving = true; DS.render(); setTimeout(doSave, 520); },
      'skip-outcome': () => { DS.setUI({ outcome: null }); DS.render(); },
      'save-note': () => { const t = st.noteDraft.trim(); if (!t) return; DS.addTimeline(id, { k: 'Note', t, d: 'Just now' }); DS.save(); st.noteDraft = ''; DS.V.sheet = null; DS.render(); DS.toast('Note added'); },
      flag: (el, i) => { S.flags[id + ':' + i] = true; const e = DS.evidenceOf(c)[+i]; DS.addTimeline(id, { k: 'Flag', t: e.l + ' flagged as wrong', d: 'Just now' }); DS.save(); DS.render(); DS.toast('Flagged. It now shows as disputed.'); },
    },
    inputs: { noteDraft: v => { st.noteDraft = v; }, outNotes: v => { DS.setUI({ outcome: { ...outcome(), notes: v } }); }, outSaid: v => { DS.setUI({ outcome: { ...outcome(), said: v } }); } },
  });
})();
