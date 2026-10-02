/* 03 Contact case file: why now and its trust, the live call, the outcome, and the record tabs. */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const id = D.cById[params.get('id')] ? params.get('id') : 'marchetti';
  const c = D.cById[id], p = D.pById[c.pid];
  const S = DS.S(), U = DS.U();
  const TABS = ['overview', 'intelligence', 'ownership', 'activity', 'details', 'history'];
  const st = { tab: TABS.includes(params.get('tab')) ? params.get('tab') : 'overview', whyOpen: params.get('why') === 'open', noteOpen: params.get('note') === '1', noteDraft: '', qNote: '', listPick: '', actF: 'All', othersOpen: false, saving: params.get('call') === 'saving' };
  const acc = (key, def) => { const a = DS.V.acc || {}; return key in a ? a[key] : def; };

  /* Presets: call=live|outcome|saving|logged|log, choice=<outcome>, flag=<evidence index>. */
  const call = params.get('call');
  if (call === 'live') { if (!U.call || U.call.id !== id) DS.setUI({ call: { id, t0: Date.now() - (params.has('choice') ? 0 : 74000) }, outcome: null }); }
  if (call === 'outcome' || call === 'saving') DS.setUI({ call: null, outcome: { id, dur: '2:14', choice: params.get('choice') || (call === 'saving' ? 'No answer' : null), acts: {}, notes: '', follow: '' } });
  if (call === 'log') DS.setUI({ call: null, outcome: { id, dur: null, choice: null, acts: {}, notes: '', follow: '' } });
  if (call === 'logged') { S.done[id] = true; S.calls += 1; S.last[id] = 'Just now · No answer'; DS.addTimeline(id, { k: 'Call', t: 'No answer · 0:42', d: 'Just now' }); }
  if (params.has('flag')) S.flags[id + ':' + params.get('flag')] = true;
  /* One-shot triggers from other screens (persisted, then removed from the address). */
  const trigger = params.get('act');
  if (trigger === 'call') DS.setUI({ call: { id, t0: Date.now() }, outcome: null });
  if (trigger === 'log') DS.setUI({ call: null, outcome: { id, dur: null, choice: null, acts: {}, notes: '', follow: '' } });
  if (trigger && !Nav.exported) { params.delete('act'); const u = new URL(location.href); u.searchParams.delete('act'); history.replaceState(null, '', u); }
  DS.remember(id);

  const onCall = () => !!(U.call && U.call.id === id);
  const outcome = () => U.outcome && U.outcome.id === id ? U.outcome : null;
  const callTime = () => { if (!U.call) return '0:00'; const s = Math.floor((Date.now() - U.call.t0) / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const hash = s => [...s].reduce((a, ch) => (a * 31 + ch.charCodeAt(0)) >>> 0, 7), n = hash(c.id);
  const tier = D.TIER[c.cls];
  const portfolio = DS.portfolio(c);
  const first = c.name.split(' ')[0].toLowerCase(), lastN = c.name.split(' ')[1].toLowerCase();
  const nextCall = c.status === 'Engaged' ? 'Oct 2' : c.status === 'Do not contact' ? 'Not set' : (c.cls === 'A' || c.cls === 'B') ? 'Oct 6' : 'Not set';
  const ICON = { Call: 'phone', Email: 'envelope-simple', Note: 'note', Flag: 'warning-diamond', Text: 'chat-text', Broadcast: 'megaphone' };

  /* ───────── Header ───────── */
  const backLabel = () => {
    let from = ''; try { const r = new URL(DS.referrer || document.referrer); if (r.origin === location.origin) from = r.pathname.split('/').pop().replace('.html', ''); } catch (_) {}
    const L = { home: 'Home', 'attack-plan': 'Dashboard', calendar: 'Calendar', conversations: 'Conversations', listings: 'Listings', brain: 'Brain', property: 'property', contact: 'previous contact' };
    return from && L[from] ? 'Back to ' + L[from] : 'Back to Database';
  };
  const header = () => {
    const oc = outcome(), phone = DS.bestPhone(c);
    const meta = [[c.entity, 'briefcase'], [c.meta.split(' · ')[1], 'user'], [portfolio.length + (portfolio.length === 1 ? ' property' : ' properties'), 'buildings']];
    return `<div class="ds-rnav"><button type="button" class="ds-back" data-act="back">${icon('caret-left')}${esc(backLabel())}</button>${ui.btn({ label: 'Next owner', variant: 'ghost', size: 'sm', act: 'next-owner', cls: 'ds-next' }).replace('Next owner</button>', 'Next owner' + icon('caret-right') + '</button>')}</div>
      <div class="ds-rhead"><span class="ds-rhead__avatar" aria-hidden="true">${esc(DS.initials(c.name))}</span>
        <div class="ds-rhead__body"><div class="ds-rhead__title"><h1>${esc(c.name)}</h1>${ui.cls(c.cls, true)}</div>
          <div class="ds-rhead__meta">${meta.map(([l, ic]) => `<span>${icon(ic)}${esc(l)}</span>`).join('')}</div>
          <div class="ds-rhead__chips">${ui.scoreChip('Score ' + c.score, c.score)}<span class="ds-chip" data-tone="outline"><span class="ds-dot" data-tone="${ui.statusDot(c.status)}"></span>${esc(c.status)}</span><span class="ds-chip" title="Lead stage">${esc(tier)}</span>${c.status === 'Do not contact' ? `<span class="ds-chip" data-tone="danger">${icon('warning-diamond')}Asked not to be contacted</span>` : ''}</div></div>
        <div class="ds-rhead__actions"><div class="ds-rhead__primary">${!onCall() && !oc ? ui.btn({ label: 'Call', ic: 'phone', act: 'start-call' }) : ''}${ui.btn({ label: 'Add note', ic: 'note', variant: 'outline', act: 'open-note' })}</div>
          <div class="ds-rhead__tools">${ui.btn({ ic: 'plus', aria: 'Add to queue', tip: 'Add to queue', variant: 'outline', act: 'queue' })}${ui.btn({ ic: 'chat-text', aria: 'Text', variant: 'outline', disabled: true })}${ui.btn({ ic: 'envelope-simple', aria: 'Email', variant: 'outline', disabled: true })}${ui.btn({ ic: 'arrows-in-simple', aria: 'Show as side panel', tip: 'Show as side panel', variant: 'outline', link: href('contacts', 'peek=' + id) })}</div></div>
      </div>`;
  };
  const liveBar = () => onCall() ? `<div class="ds-livebar" role="status" aria-live="polite" data-anim="unroll" data-key="livebar"><span class="ds-livebar__dot" aria-hidden="true"></span><span class="font-medium">On a call with ${esc(c.name)}</span><span class="ds-livebar__num">${esc(DS.bestPhone(c))}</span><span class="ds-grow"></span><span class="ds-livebar__time" data-calltime aria-label="Call length">${callTime()}</span>${ui.btn({ label: 'End call', ic: 'phone-disconnect', act: 'end-call' })}</div>` : '';
  const noteBox = () => st.noteOpen ? `<div class="ds-card" data-pad="all" data-anim="grow" data-key="notebox"><textarea id="note-draft" class="field__control" aria-label="Note" rows="2" placeholder="What did you learn?" data-input="noteDraft" style="border:0;padding:0;min-height:0;box-shadow:none">${esc(st.noteDraft)}</textarea><div class="ds-toolbar">${ui.btn({ label: 'Save note', act: 'save-note' })}${ui.btn({ label: 'Cancel', variant: 'outline', act: 'close-note' })}</div></div>` : '';
  const outcomeBar = () => {
    const oc = outcome(); if (!oc) return '';
    const OUTS = ['Connected', 'Callback', 'Voicemail', 'No answer', 'Not interested', 'Bad number'];
    const ACTS = [['note', 'Save note to record'], ['primary', 'Mark number primary'], ['bad', 'Mark number bad'], ['blasts', 'Remove from blasts for 1 year']];
    return `<section class="ds-outcome" aria-label="Log the outcome" data-anim="grow" data-key="outcome-${oc.dur ? 'call' : 'hand'}">
      <div style="display:flex;align-items:baseline;gap:var(--space-2)"><h2>Log the outcome</h2><span class="ds-meta">${esc((oc.dur ? 'Call lasted ' + oc.dur : 'Logged by hand') + ' · ' + DS.bestPhone(c))}</span></div>
      <div class="ds-outcome__opts" role="radiogroup" aria-label="Outcome">${OUTS.map(o => `<button type="button" class="ds-opt" role="radio" aria-checked="${oc.choice === o}" data-tick="opt-${o}|${oc.choice === o ? 'on' : 'off'}" data-act="pick-outcome" data-arg="${o}">${o}</button>`).join('')}</div>
      <div class="ds-two"><div class="ds-stack" data-gap="2"><span class="field__label">Actions</span>${ACTS.map(([k, l]) => `<button type="button" class="ds-checkline" role="checkbox" aria-checked="${!!oc.acts[k]}" data-act="toggle-oact" data-arg="${k}"><span class="ds-box"${oc.acts[k] ? ' data-on' : ''} data-tick="oact-${k}|${oc.acts[k] ? 'on' : 'off'}">${oc.acts[k] ? icon('check') : ''}</span>${l}</button>`).join('')}</div>
        <div class="ds-stack" data-gap="3"><div class="field"><label class="field__label" for="out-follow">Follow-up date</label><input id="out-follow" class="field__control" type="date" value="${esc(oc.follow)}" data-change="follow"></div><div class="field"><label class="field__label" for="out-notes">Notes</label><textarea id="out-notes" class="field__control" rows="2" placeholder="Optional" data-input="outNotes" style="min-height:3.5rem">${esc(oc.notes)}</textarea></div></div></div>
      <div class="ds-toolbar">${oc.choice ? ui.btn({ label: st.saving ? 'Saving' : 'Save outcome', act: 'save-outcome', busy: st.saving, id: 'save-outcome' }) : `<button type="button" class="button" aria-disabled="true" data-tip="Pick an outcome first">Save outcome</button>`}${ui.btn({ label: 'Skip', variant: 'outline', act: 'skip-outcome' })}</div>
    </section>`;
  };

  /* ───────── Overview ───────── */
  const evidence = () => DS.evidenceOf(c);
  const disputed = () => evidence().some(e => e.k === 'disputed');
  const whyCard = () => {
    const ev = evidence(), trustK = ev.some(e => e.flagged) || (disputed() && c.id !== 'marchetti') ? 'disputed' : c.trust;
    return `<section class="ds-why" aria-label="Why now">
      <div class="ds-why__head">${icon('sparkle')}<h2>Why now</h2>${ui.trust(trustK)}<span class="ds-grow"></span><span class="ds-meta">Updated 2d ago</span></div>
      ${disputed() ? (() => { const d = ev.filter(e => e.k === 'disputed'), what = d.length === 1 ? d[0].l + ' is disputed.' : d.length + ' facts are disputed.'; return trustK === 'disputed' ? `<div class="alert" data-status="danger" role="alert">${icon('warning-diamond')}<span>${esc(what)} Check before you say it.</span></div>` : `<div class="alert" data-status="warning">${icon('warning-diamond')}<span>${esc(what)} It isn’t part of this why now.</span></div>`; })() : ''}
      <p class="ds-why__text">${esc(c.whyFull)}</p>
      <div class="ds-toolbar" style="gap:var(--space-1-5)"><span class="ds-chip">${esc(c.narrative)}</span><span class="ds-chip">Momentum: ${esc(c.momentum)}</span></div>
      <div class="ds-why__actions">${!onCall() && !outcome() ? ui.btn({ label: 'Next: Call ' + DS.bestPhone(c), ic: 'phone', variant: 'subtle', shape: 'pill', act: 'start-call' }) : ''}<span class="ds-grow"></span>${ui.btn({ label: 'Why this?', variant: 'outline', act: 'toggle-why', expanded: st.whyOpen }).replace('Why this?</button>', 'Why this?' + icon(st.whyOpen ? 'caret-up' : 'caret-down') + '</button>')}${ui.btn({ label: 'Ask Brain', ic: 'sparkle', variant: 'outline', act: 'ask', arg: 'Why now for ' + c.name + '?' })}</div>
      ${st.whyOpen ? `<div class="ds-why__more" data-anim="grow" data-key="why-more">
        <div class="ds-stack" data-gap="2"><h3>Top drivers</h3>${D.drivers(c).map(([l, pp], i) => `<div class="ds-driver"><span>${i + 1}</span><span>${esc(l)}</span><span class="ds-meta-strong num">${pp}</span></div>`).join('')}</div>
        <div class="ds-stack" data-gap="2"><h3>Evidence</h3>${ev.map(e => `<div class="ds-evidence"><div class="ds-row__body"><span><span class="font-medium">${esc(e.l)}</span><span class="muted"> · ${esc(e.v)}</span></span><span class="ds-meta">${esc(e.m)}</span></div>${ui.trust(e.k)}${e.canFlag ? ui.btn({ label: 'Flag as wrong', variant: 'ghost', size: 'sm', act: 'flag', arg: e.i }) : e.flagged ? '<span class="ds-evidence__flagged">Flagged</span>' : '<span></span>'}</div>`).join('')}</div>
        <div class="ds-stack" data-gap="2"><h3>Lowers the likelihood</h3>${D.antis(c).map(a => `<div class="ds-anti">${icon('arrow-down')}${esc(a)}</div>`).join('')}</div></div>` : ''}
    </section>`;
  };
  const reach = () => {
    const phone = DS.bestPhone(c), spoke = /Connected|Callback/.test(c.last), domain = c.entity.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').slice(0, 2).join('') + '.com';
    const tone = x => x >= 80 ? 'good' : x >= 60 ? 'ok' : x >= 45 ? 'warn' : 'bad';
    const LIFE = { 'Confirmed by us': 'good', Active: 'ok', Secondary: 'warn', Historical: 'muted', Unverified: 'muted', Rejected: 'bad' };
    const best = [['Best phone', phone, 70 + (n % 26), spoke ? 'Confirmed by us' : 'Active', 'mobile · 3 sources', [spoke ? 'Answered by the owner on a logged call (' + c.last.split(' · ')[0] + ').' : 'Matches the mailing record on ACRIS.', '3 independent sources agree: ACRIS, Apollo, PropertyShark.', 'Tied to ' + c.entity + ' filings.']],
      ['Best personal email', first + '.' + lastN + '@example.com', 55 + (n % 30), 'Active', 'personal · 2 sources', ['Deliverable on the last send; no bounce on record.', '2 independent sources agree: Apollo, Hunter.']],
      ['Best business email', first[0] + lastN + '@' + domain, 45 + ((n >> 3) % 30), 'Secondary', 'business · 1 source', ['Domain matches the owning entity.', 'Single source: Hunter.']],
      ['LinkedIn', c.warm ? 'linkedin.com/in/' + first + '-' + lastN : null, 40 + ((n >> 5) % 30), 'Unverified', '1 source', ['Profile name and company match the owning entity.']]];
    const cps = DS.contactPointsOf(c), others = [...cps.filter(x => x[1] !== phone).map(x => [x[1], x[2] === 'Bad' ? 'Rejected' : x[2] === 'Verified' ? 'Secondary' : 'Historical']), ['(212) 555-0' + (100 + (n % 99)), 'Historical']];
    const [top, ...rest] = best;
    const body = `<div class="ds-best"><span class="ds-best__icon">${icon('phone')}</span><span class="ds-row__body" style="min-width:10rem"><span class="ds-best__num">${esc(top[1])}</span><span class="ds-meta"><span class="ds-life" data-tone="${LIFE[top[3]]}">${top[3]}</span> · ${esc(top[4])}</span></span><span style="display:flex;flex-direction:column;align-items:flex-end"><span class="ds-conf" data-tone="${tone(top[2])}">${top[2]}%</span><span class="ds-meta">confidence</span></span></div>
      <div style="border-top:var(--border-width) solid var(--border-subtle)">${rest.map(b => `<div class="ds-cp"><span class="ds-meta">${esc(b[0])}</span><span${b[1] ? '' : ' style="color:var(--fg-disabled);font-weight:var(--weight-regular)"'}>${esc(b[1] || 'None on record')}</span>${b[1] ? `<span class="ds-conf" data-tone="${tone(b[2])}" style="font-size:var(--text-sm);line-height:var(--line-height-sm)">${b[2]}%</span>` : ''}</div>`).join('')}</div>
      <button type="button" class="ds-mute-btn" style="align-self:flex-start" aria-expanded="${st.othersOpen}" data-act="toggle-others">${icon(st.othersOpen ? 'caret-down' : 'caret-right')}${st.othersOpen ? 'Hide details' : 'Why these, and ' + others.length + ' older numbers'}</button>
      ${st.othersOpen ? `<div class="ds-panel-sub" data-anim="grow" data-key="others">${best.filter(b => b[1]).map(b => `<div class="ds-stack" style="gap:var(--space-0-5)"><span class="ds-meta font-semibold" style="color:var(--fg)">${esc(b[0])}</span>${b[5].map(w => `<span style="color:var(--fg-secondary)">${esc(w)}</span>`).join('')}</div>`).join('')}
        <div class="ds-stack" style="gap:var(--space-0-5)"><span class="ds-meta font-semibold" style="color:var(--fg)">Older and rejected</span>${others.map(([v, life], i) => { const pr = life === 'Rejected' ? 12 : 30 + ((n >> i) % 25); return `<div style="display:flex;align-items:center;gap:var(--space-2-5);padding:var(--space-1) 0"><span class="num font-medium"${life === 'Rejected' ? ' style="text-decoration:line-through;color:var(--fg-disabled)"' : ''}>${esc(v)}</span><span class="ds-life ds-meta" data-tone="${LIFE[life]}">${life}</span><span class="ds-grow"></span><span class="ds-conf" data-tone="${tone(pr)}" style="font-size:var(--text-sm);line-height:var(--line-height-sm)">${pr}%</span></div>`; }).join('')}</div>
        <div>${ui.btn({ label: 'Re-rank contact points', ic: 'arrow-clockwise', variant: 'outline', size: 'sm', act: 'rerank' })}</div><span class="ds-meta">Ranked ${esc(S.ranked[id] || 'Sep 29, 5:40 AM')}</span></div>` : ''}`;
    return ui.acc('reach', 'Best way to reach', top[1] + ' · ' + top[2] + '% confidence', body, acc('reach', true));
  };
  const facts = () => {
    const rows = [['Debt', p.debt], ['Maturity', p.mat], ['Months to maturity', c.id === 'marchetti' ? '8' : 'Not on record'], ['Years held', c.years + ' years'], ['Lis pendens', c.id === 'chen' ? 'Filed Aug 14' : 'None on record'], ['Unused FAR', c.id === 'rivera' ? '9,400 SF' : 'Not on record']];
    return ui.acc('facts', 'Key facts', [p.debt !== 'Not on record' ? p.debt + ' due ' + p.mat : null, c.years + ' years held'].filter(Boolean).join(' · '), ui.kv(rows) + `<button type="button" class="ds-link-btn" style="align-self:flex-start" data-act="tab" data-arg="intelligence">See all signals${icon('caret-right')}</button>`, acc('facts', true));
  };
  const recent = () => {
    const tl = DS.timelineOf(c);
    const body = `<div>${tl.slice(0, 3).map(x => `<div class="ds-mini-tl"><span class="ds-round-icon">${icon(ICON[x.k] || 'note')}</span><span class="ds-grow"><span class="font-medium">${esc(x.k)}</span><span class="muted"> · ${esc(x.t)}</span></span><span class="ds-meta num">${esc(x.d)}</span></div>`).join('')}</div>${tl.length ? '' : '<span class="ds-meta">Nothing logged yet.</span>'}<button type="button" class="ds-link-btn" style="align-self:flex-start" data-act="tab" data-arg="activity">View all activity${icon('caret-right')}</button>`;
    return ui.acc('recent', 'Recent activity', tl.length ? tl.length + ' touches · last ' + tl[0].d : 'Nothing logged yet', body, acc('recent', true));
  };
  const notes = () => {
    const ns = DS.timelineOf(c).filter(x => x.k === 'Note');
    const body = `<div>${ns.map(x => `<div class="ds-stack" style="gap:var(--space-0-5);padding:var(--space-2) 0;border-bottom:var(--border-width) solid var(--border-subtle)"><span style="text-wrap:pretty">${esc(x.t)}</span><span class="ds-meta">${esc(x.d)}</span></div>`).join('')}</div>${ns.length ? '' : '<span class="ds-meta">No notes yet.</span>'}<div>${ui.btn({ label: 'Add note', ic: 'plus', variant: 'outline', size: 'sm', act: 'open-note' })}</div>`;
    return ui.acc('notes', 'Notes', ns.length ? ns.length + (ns.length === 1 ? ' note' : ' notes') : 'No notes yet', body, acc('notes', false));
  };
  const overview = () => whyCard() + `<div class="ds-acc">${reach()}${facts()}${recent()}${notes()}</div>`;

  /* ───────── Intelligence ───────── */
  const mon = m => { const d = new Date(m); if (isNaN(d)) return null; return Math.round((d - D.TODAY) / (30.4 * 864e5)); };
  const intelligence = () => {
    const access = 40 + (n % 50), mtm = c.id === 'marchetti' ? 8 : p.debt === 'Not on record' ? null : mon(p.mat), hot = mtm != null && mtm > 0 && mtm < 18;
    const score = `<div style="display:flex;align-items:center;gap:var(--space-4);flex-wrap:wrap"><span class="ds-score-big">${c.score}</span><span class="ds-toolbar" style="gap:var(--space-1-5)">${ui.cls(c.cls, true)}<span class="ds-chip" title="Lead stage">${esc(tier)}</span><span class="ds-chip" title="Relationship strength. Tracked separately, never added to the predictive score.">Accessibility ${access}</span></span></div>${ui.kv([['Debt', p.debt], ['Maturity', p.mat], ['Months to maturity', mtm != null && mtm > 0 ? String(mtm) : 'Not on record', { hot }]])}<span class="ds-meta">Model v4 · scored Sep 29, 05:40 UTC</span>`;
    const rank = { Critical: 3, Strong: 2, Moderate: 1 };
    const props = portfolio.map((x, i) => {
      const lead = x.id === c.pid, rows = [];
      if (x.debt !== 'Not on record') { const m = lead && c.id === 'marchetti' ? 8 : mon(x.mat); rows.push(['Loan maturity', x.debt + ' outstanding · due ' + x.mat + (m != null && m > 0 ? ' · ' + m + ' mo. to maturity' : ''), lead && m != null && m <= 12 ? 'Critical' : 'Strong']); }
      if (lead && c.id === 'marchetti') rows.push(['High debt load', x.debt + ' across ' + x.units + ' units · debt is 68% of value', 'Strong']);
      if (lead && c.id === 'chen') rows.push(['Lis pendens', 'Active legal distress on record · filed Aug 14', 'Critical']);
      if (lead && c.id === 'rivera') rows.push(['Unused FAR', '9,400 SF of unbuilt development rights', 'Moderate']);
      if (lead && c.years >= 20) rows.push(['Pre-2005 ownership', 'Long hold; basis favors a sale · held ' + c.years + ' years', 'Moderate']);
      const top = rows.slice().sort((a, b) => rank[b[2]] - rank[a[2]])[0], sc = lead ? c.score : Math.round(c.score * 0.4);
      const body = (rows.length ? `<dl class="ds-kv" data-cols="1">${rows.map(([sig, line, sev]) => `<div class="ds-kv__row"><dt>${esc(sig)}</dt><dd>${esc(line)}</dd><span class="ds-sev" data-sev="${sev}">${sev}</span></div>`).join('')}</dl>` : '<span class="ds-meta">No active signals.</span>') +
        `<div class="ds-kv__row" style="border:0;grid-template-columns:8.5rem minmax(0,1fr)"><span class="ds-kv__k">Why now</span><p style="text-wrap:pretty">${esc(lead ? c.whyFull : 'Part of ' + c.name + '’s portfolio. The lead reason to call is at ' + p.addr + '.')}</p></div><button type="button" class="ds-link-btn" style="align-self:flex-start" data-act="peek" data-arg="p:${x.id}">Open property${icon('caret-right')}</button>`;
      return ui.acc('ps-' + x.id, x.addr, rows.length ? rows.length + (rows.length === 1 ? ' signal' : ' signals') + ' · score ' + sc : 'No active signals', body, acc('ps-' + x.id, i === 0)).replace('<span class="ds-row__body">', '<span class="ds-row__body">').replace(/(<\/span><\/span>)(<svg)/, `$1${top ? `<span class="ds-sev" data-sev="${top[2]}">${top[2]}</span>` : ''}$2`);
    }).join('');
    const ev = evidence();
    const evBody = `<dl class="ds-kv" data-cols="1">${ev.map(e => `<div class="ds-kv__row" style="grid-template-columns:8.5rem minmax(0,1fr) auto auto;align-items:center"><dt>${esc(e.l)}</dt><dd><span style="display:block">${esc(e.v)}</span><span class="ds-meta" style="font-weight:var(--weight-regular)">${esc(e.m)}</span></dd>${ui.trust(e.k)}${e.canFlag ? ui.iconBtn({ ic: 'flag', aria: 'Flag as wrong', act: 'flag', arg: e.i }) : e.flagged ? '<span class="ds-evidence__flagged">Flagged</span>' : '<span></span>'}</div>`).join('')}</dl>`;
    const model = D.drivers(c).map(([l, pp], i) => { const base = parseInt(pp, 10), sev = [1.2, 1.0, 0.9][i], tim = [1.1, 1.0, 1.0][i]; return [['Debt', 'Hold', 'Leverage'][i], l, base + ' base × ' + sev.toFixed(1) + '× severity × ' + tim.toFixed(1) + '× timing', '+' + Math.round(base * sev * tim)]; });
    const modelBody = `<dl class="ds-kv" data-cols="1">${model.map(([cat, sig, calc, adj]) => `<div class="ds-kv__row"><dt>${cat}</dt><dd><span style="display:block">${esc(sig)}</span><span class="ds-meta num" style="font-weight:var(--weight-regular)">${esc(calc)}</span></dd><span class="font-semibold num">${adj}</span></div>`).join('')}</dl>`;
    return `<div class="ds-acc">${ui.acc('score', 'Predictive score', c.score + ' · Class ' + c.cls + ' · ' + tier, score, acc('score', true))}${props}${ui.acc('ev', 'Evidence', ev.length + ' items · ' + ev.filter(e => e.k === 'verified').length + ' verified', evBody, acc('ev', false))}${ui.acc('model', 'How the score is built', 'Base points, severity and timing for each signal', modelBody, acc('model', false))}</div>`;
  };

  /* ───────── Ownership, Activity, Details, History ───────── */
  const ownership = () => `<div class="ds-acc">${portfolio.map((x, i) => ui.acc('own-' + x.id, x.addr, x.units + ' units · ' + (x.debt === 'Not on record' ? 'No debt on record' : x.debt + ' due ' + x.mat), ui.kv([['Neighborhood', x.hood + ' · ' + x.zip], ['Units', x.units + ' · ' + x.fm + ' FM · ' + x.rs + ' RS'], ['Gross SF', DS.loc(x.sf)], ['Year built', String(x.built)], ['Debt', x.debt], ['Maturity', x.mat], ['BBL', x.bbl], ['Role', x.id === c.pid ? 'Lead property' : 'Portfolio']]) + `<button type="button" class="ds-link-btn" style="align-self:flex-start" data-act="peek" data-arg="p:${x.id}">Open property${icon('caret-right')}</button>`, acc('own-' + x.id, i === 0), ui.cls(c.cls))).join('')}</div>`;
  const MON = { Jan: 'January', Feb: 'February', Mar: 'March', Apr: 'April', May: 'May', Jun: 'June', Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October', Nov: 'November', Dec: 'December' };
  const activity = () => {
    const all = DS.timelineOf(c), tl = st.actF === 'All' ? all : all.filter(x => x.k + 's' === st.actF);
    const groups = []; tl.forEach(x => { const m = MON[(x.d || '').slice(0, 3)] ? MON[x.d.slice(0, 3)] + ' 2026' : 'September 2026'; let g = groups.find(y => y.m === m); if (!g) groups.push(g = { m, items: [] }); g.items.push(x); });
    const tone = t => /Connected|Callback|replied|opened/i.test(t) ? 'good' : /Voicemail|No answer/i.test(t) ? 'warn' : /Not interested|Bad/i.test(t) ? 'bad' : '';
    const filters = ['All', 'Calls', 'Emails', 'Texts', 'Notes'].map(l => `<button type="button" class="ds-pill-btn" aria-pressed="${st.actF === l}" data-act="act-f" data-arg="${l}">${l}</button>`).join('');
    return `${nextCall !== 'Not set' ? `<div class="ds-note--info ds-note">${icon('calendar-blank')}<span class="ds-row__body"><span class="ds-meta font-semibold" style="color:inherit">Upcoming and overdue</span><span>${esc(c.name)} · Follow-up call</span></span><b class="num">${nextCall}</b></div>` : ''}
      <div class="ds-toolbar"><div class="ds-card__title" style="min-width:12.5rem"><h2>Every touch</h2><span class="ds-meta">Calls, emails, texts, broadcasts and notes, newest first</span></div>${filters}${ui.btn({ label: 'Log a call', ic: 'plus', variant: 'outline', size: 'sm', act: 'log-call' })}</div>
      ${tl.length ? `<div class="ds-acc">${groups.map((g, gi) => ui.acc('tl-' + g.m, g.m, g.items.length + (g.items.length === 1 ? ' touch' : ' touches'), `<div>${g.items.map(x => { const isCall = x.k === 'Call'; return `<div class="ds-tl"><span class="ds-tl__when">${icon(ICON[x.k] || 'note')}${esc(x.d)}</span><span class="ds-row__body"><span class="font-medium">${isCall ? 'Call · outbound' : x.k === 'Text' ? 'Text · outbound' : esc(x.k)}</span><span class="muted" style="text-wrap:pretty">${esc(isCall ? 'Outcome logged by Thomas W.' : x.t)}</span></span><span class="ds-tl__o" data-tone="${tone(x.t)}">${esc(isCall ? x.t : /opened/.test(x.t) ? 'opened' : '')}</span></div>`; }).join('')}</div>`, acc('tl-' + g.m, gi === 0))).join('')}</div>` : '<div class="ds-dashed">No touches logged yet. Calls, emails and notes show up here.</div>'}`;
  };
  const togState = () => ({ emailOut: false, unsub: false, dnc: c.status === 'Do not contact', buy: false, sell: c.cls === 'A', hold: c.cls === 'LH' || c.id === 'marchetti', fin: c.id === 'marchetti', x1031: c.cls === 'A' && n % 2 === 0, ...(S.ctog[id] || {}) });
  const details = () => {
    const tog = togState(), etype = c.meta.split(' · ')[0], formed = 2000 + (n % 18), mail = c.id === 'marchetti' ? ['14 Heathcote Rd', 'Scarsdale', 'NY', '10583'] : [p.addr, 'New York', 'NY', p.zip];
    const cps = DS.contactPointsOf(c), domain = c.entity.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ').slice(0, 2).join('') + '.com';
    const T = (k, l) => `<button type="button" class="ds-tog" role="switch" aria-checked="${!!tog[k]}" data-act="ctog" data-arg="${k}"><span>${esc(l)}</span><span class="ds-tog__state">${tog[k] ? 'On' : 'Off'}</span><span class="ds-tog__track" data-flip="togt-${k}"><span data-flip="togk-${k}"></span></span></button>`;
    const G = (h, ic, rows) => `<div class="ds-stack" style="gap:var(--space-0-5)">${h ? `<div class="ds-group-h">${icon(ic)}<b>${esc(h)}</b></div>` : ''}${ui.kv(rows.map(([k, v]) => [k, v == null || v === '' ? 'Not on record' : String(v)]))}</div>`;
    const TG = (h, items) => `<div class="ds-stack" data-gap="2"><div class="ds-group-h">${icon('toggle-right')}<b>${esc(h)}</b></div><div class="ds-togs">${items.map(([k, l]) => T(k, l)).join('')}</div></div>`;
    const entity = `<div class="ds-entity"><span class="ds-entity__av" aria-hidden="true">${esc(DS.initials(c.name))}</span><div class="ds-stack ds-grow" data-gap="2" style="gap:var(--space-1-5)"><span class="ds-meta">Behind the entity · NY Dept. of State</span><span style="display:flex;align-items:center;gap:var(--space-2);flex-wrap:wrap"><span class="ds-entity__name">${esc(c.name)}</span><span class="ds-chip" data-tone="success">Principal</span></span><div class="ds-toolbar" style="gap:var(--space-1) var(--space-4);color:var(--fg-muted)">${[[etype, 'briefcase'], ['Formed in New York', 'map-pin'], [formed + ' · ' + (2026 - formed) + ' yrs', 'calendar-blank']].map(([l, ic]) => `<span class="ds-meta-icon">${icon(ic)}${esc(l)}</span>`).join('')}</div><span class="ds-entity__process">${icon('envelope-simple')}<span><b class="font-medium" style="color:var(--fg-muted)">Service of process</span> · ${esc(mail[0] + ', ' + mail[1] + ', ' + mail[2] + ' ' + mail[3])}</span></span></div></div>`;
    const secs = [
      ['Contact information', c.entity + ' · ' + tier, entity + G('Owner', 'user', [['Account name', c.entity], ['Name', c.name], ['Real owner', c.name], ['Owner profile', c.meta.split(' · ')[1]], ['Contact type', 'Owner']]) + G('Lead property', 'buildings', [['Property address', p.addr], ['Neighborhood', p.hood], ['BBL', p.bbl]]) + G('Pipeline', 'target', [['Contact owner', 'Thomas W.'], ['Record type', 'Class ' + c.cls + ' · ' + D.CLASS[c.cls]], ['Lead stage', tier], ['Source', 'ACRIS']])],
      ['Email', '2 addresses', G('', '', [['Email', first + '.' + lastN + '@example.com'], ['Other email', first[0] + lastN + '@' + domain]]) + TG('Email status', [['emailOut', 'Email opt out'], ['unsub', 'Unsubscribed']])],
      ['Phone', cps.filter(x => x[0] === 'phone').length + ' numbers', G('', '', cps.filter(x => x[0] === 'phone').map((x, i) => [i === 0 ? 'Business phone' : 'Phone ' + (i + 1), x[1] + (x[2] === 'Bad' ? ' · bad' : '')])) + TG('Calling rules', [['dnc', 'Asked not to be contacted']])],
      ['Contact preferences', 'Plans, 1031 and next call', TG('Intent', [['buy', 'Plans to buy'], ['sell', 'Plans to sell'], ['hold', 'Plans to hold'], ['fin', 'Plans to finance'], ['x1031', '1031 exchange']]) + G('', '', [['Last call outcome', c.last === 'Never called' ? null : c.last.split(' · ')[1]], ['Next call date', nextCall === 'Not set' ? null : nextCall], ['Years held', c.years + ' years']])],
      ['Acquisition preferences', 'Product, profile and FAR', G('', '', [['Product type', 'Multifamily walk-up'], ['Owner profile', c.meta.split(' · ')[1]], ['Neighborhood', p.hood], ['Unused FAR', c.id === 'rivera' ? '9,400 SF' : null], ['Narrative type', c.narrative]])],
      ['Address', 'Mailing: ' + mail.slice(0, 2).join(', '), G('', '', [['Mailing street', mail[0]], ['Mailing city', mail[1]], ['Mailing state', mail[2]], ['Mailing ZIP', mail[3]], ['Property ZIP', p.zip], ['Neighborhood', p.hood]])],
      ['System', 'Created Mar 4, 2024 · Updated Sep 28', G('', '', [['Created', 'Mar 4, 2024'], ['Last updated', 'Sep 28, 2026'], ['Source', 'ACRIS'], ['ACRIS enriched', 'Yes'], ['Apollo enriched', n % 3 ? 'Yes' : 'No'], ['Lead source', 'Firm DB']])],
    ];
    return `<div class="ds-acc">${secs.map(([h, sum, body], i) => ui.acc('det-' + h, h, sum, body, acc('det-' + h, i === 0))).join('')}</div>`;
  };
  const historyTab = () => {
    const phone = DS.bestPhone(c), hist = [['Sep 28, 2026 · 4:12 PM', 'Primary phone', '(212) 555-0199', phone, 'Thomas W.'], ['Aug 21, 2026 · 10:03 AM', 'Status', 'New', c.status, 'Thomas W.'], ['Jun 2, 2026 · 6:00 AM', 'Lead stage', 'Tier 2 · Warm', tier, 'Model v4'], ['Mar 4, 2024 · 9:15 AM', 'Record created', 'None', 'ACRIS import', 'System']];
    return `<div class="ds-acc">${ui.acc('hist', 'Change history', hist.length + ' changes · last Sep 28, 2026', `<div>${hist.map(([w, f, a, b, by]) => `<div class="ds-hist"><span class="ds-meta">${esc(f)}</span><span style="display:flex;align-items:baseline;gap:var(--space-2);flex-wrap:wrap"><s>${esc(a)}</s><span class="muted" aria-hidden="true">→</span><span class="font-medium">${esc(b)}</span></span><span class="ds-meta" style="display:flex;flex-direction:column;align-items:flex-end"><span>${esc(w)}</span><span>${esc(by)}</span></span></div>`).join('')}</div>`, acc('hist', true))}</div>`;
  };

  /* ───────── Rail ───────── */
  const rail = () => {
    const tl = DS.timelineOf(c), mine = S.clists[id] || (c.cls === 'A' ? ['Class A sellers', 'LES debt 2026'] : c.cls === 'B' ? ['Q4 mail merge'] : []), opts = D.customLists.filter(x => !mine.includes(x));
    return `<aside class="ds-record__rail" aria-label="Record sidebar">
      <section class="ds-rail-card" aria-label="Contact notes"><h2>Contact notes</h2><div class="ds-two" style="gap:var(--space-2)"><span class="ds-stack" style="gap:1px"><span class="ds-meta">Last completed</span><span class="num">${esc(tl.length ? tl[0].d : 'None yet')}</span></span><span class="ds-stack" style="gap:1px"><span class="ds-meta">Follow-up</span><span class="num">${esc(nextCall)}</span></span></div>
        <textarea id="quick-note" class="field__control" aria-label="Quick note" rows="3" placeholder="Add a note…" data-input="qNote">${esc(st.qNote)}</textarea><div>${ui.btn({ label: 'Save note', size: 'sm', act: 'save-qnote' })}</div></section>
      <section class="ds-rail-card" aria-label="Lists"><h2>Lists</h2><div class="ds-toolbar" style="gap:var(--space-1-5)">${mine.map(l => `<span class="ds-list-chip">${esc(l)}<button type="button" aria-label="Remove from ${esc(l)}" data-act="rm-list" data-arg="${esc(l)}">${icon('x')}</button></span>`).join('') || '<span class="ds-meta">Not in any custom list</span>'}</div>
        <div style="display:flex;gap:var(--space-1-5)"><span class="select ds-grow"><select id="list-pick" class="field__control" data-size="sm" aria-label="Add to list" data-change="listPick"><option value="">Add to list…</option>${opts.map(o => `<option${o === st.listPick ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select></span>${ui.btn({ label: 'Add', size: 'sm', variant: 'outline', act: 'add-list' })}</div></section>
      <section class="ds-rail-card" aria-label="Record"><h2>Record</h2>${ui.kv([['Contact owner', 'Thomas W.'], ['Lead stage', tier], ['Last updated', 'Sep 28, 2026'], ['Source', 'ACRIS, Apollo']], { compact: true })}
        <div class="ds-toolbar" style="gap:var(--space-1-5);padding-top:var(--space-2);border-top:var(--border-width) solid var(--border-subtle)">${[['Prediction model', 'brain'], ...(c.warm ? [['LinkedIn', 'linkedin-logo']] : []), ['HubSpot', 'link-simple']].map(([l, ic]) => `<span class="ds-off-link" role="link" tabindex="0" aria-disabled="true" data-tip="${DS.OFF}">${icon(ic)}${esc(l)}</span>`).join('')}</div></section>
    </aside>`;
  };

  const tabs = () => ui.stateTabs([['overview', 'Overview'], ['intelligence', 'Intelligence'], ['ownership', 'Ownership (' + portfolio.length + ')'], ['activity', 'Activity (' + DS.timelineOf(c).length + ')'], ['details', 'Details'], ['history', 'History'], ['related', 'Related', true], ['map', 'Property map', true]], st.tab, 'tab', 'Record');
  const body = () => `<div class="ds-stack" data-gap="4" style="gap:var(--space-5)" data-anim="fade" data-key="tab-${st.tab}">${({ overview, intelligence, ownership, activity, details, history: historyTab })[st.tab]()}</div>`;

  /* ───────── Actions ───────── */
  const nextOwner = () => { const ids = DS.callIds(), cur = ids.indexOf(id), order = [...ids.slice(cur + 1), ...ids.slice(0, Math.max(cur, 0))], nx = order.find(x => !S.done[x] && x !== id); if (nx) Nav.go('contact', 'id=' + nx); else DS.toast('You’ve called everyone on today’s list.'); };
  const doSave = () => {
    const oc = outcome(); if (!oc || !oc.choice) return; const ch = oc.choice;
    DS.store((Sx, Ux) => {
      Sx.done[id] = true; Sx.calls += 1; if (ch === 'Connected') Sx.convos += 1; Sx.last[id] = 'Just now · ' + ch; if (oc.acts.bad) Sx.bad[id] = true;
      if (oc.notes && oc.acts.note) DS.addTimeline(id, { k: 'Note', t: oc.notes, d: 'Just now' });
      DS.addTimeline(id, { k: 'Call', t: ch + (oc.dur ? ' · ' + oc.dur : '') + (oc.follow ? ' · Follow up ' + oc.follow : ''), d: 'Just now' });
      Ux.outcome = null;
    });
    st.saving = false; DS.render(); DS.toast('Call logged');
  };

  DS.define({
    id: 'contact', nav: 'database', brain: 'min',
    crumbs: () => [{ l: 'Database', page: 'contacts' }, { l: 'Contacts', page: 'contacts' }, { l: c.name }],
    scope: () => c.name,
    peekList: () => portfolio.map(x => ['p', x.id]),
    render: () => `${liveBar()}<div class="ds-record"><div class="ds-record__main">${header()}${noteBox()}${outcomeBar()}${tabs()}${body()}</div>${rail()}</div>`,
    after: () => { if (st.focusNotes) { st.focusNotes = false; const el = document.getElementById('out-notes'); if (el) el.focus(); } },
    acts: {
      back: () => { try { const r = new URL(DS.referrer || document.referrer); if (r.origin === location.origin && history.length > 1) { history.back(); return; } } catch (_) {} Nav.go('contacts'); },
      tab: (el, k) => { st.tab = k; DS.render(); },
      'toggle-why': () => { const go = () => { st.whyOpen = !st.whyOpen; DS.render(); }; if (st.whyOpen) DS.collapse(document.querySelector('.ds-why__more'), go); else go(); },
      'toggle-others': () => { const go = () => { st.othersOpen = !st.othersOpen; DS.render(); }; if (st.othersOpen) DS.collapse(document.querySelector('.ds-panel-sub'), go); else go(); },
      'start-call': () => { DS.setUI({ call: { id, t0: Date.now() }, outcome: null }); DS.render(); },
      'end-call': () => { const dur = callTime(); DS.setUI({ call: null, outcome: { id, dur, choice: null, acts: {}, notes: '', follow: '' } }); DS.render(); },
      'log-call': () => { DS.setUI({ call: null, outcome: { id, dur: null, choice: null, acts: {}, notes: '', follow: '' } }); st.tab = st.tab; DS.render(); },
      'pick-outcome': (el, o) => { const oc = outcome(); DS.setUI({ outcome: { ...oc, choice: o, acts: o === 'Connected' ? { note: true, primary: true } : o === 'Bad number' ? { bad: true } : {} } }); if (o === 'Connected') st.focusNotes = true; DS.render(); },
      'toggle-oact': (el, k) => { const oc = outcome(); DS.setUI({ outcome: { ...oc, acts: { ...oc.acts, [k]: !oc.acts[k] } } }); DS.render(); },
      'save-outcome': () => { if (st.saving) return; st.saving = true; DS.render(); setTimeout(() => DS.collapse(document.querySelector('.ds-outcome'), doSave), 520); },
      'skip-outcome': () => DS.collapse(document.querySelector('.ds-outcome'), () => { DS.setUI({ outcome: null }); DS.render(); }),
      'next-owner': nextOwner,
      'open-note': () => { st.noteOpen = true; DS.render(); setTimeout(() => { const el = document.getElementById('note-draft'); if (el) el.focus(); }, 20); },
      'close-note': () => DS.collapse(document.querySelector('[data-key="notebox"]'), () => { st.noteOpen = false; st.noteDraft = ''; DS.render(); }),
      'save-note': () => { const t = st.noteDraft.trim(); if (!t) return; DS.addTimeline(id, { k: 'Note', t, d: 'Just now' }); DS.save(); st.noteOpen = false; st.noteDraft = ''; DS.render(); DS.toast('Note added'); },
      'save-qnote': () => { const t = st.qNote.trim(); if (!t) return; DS.addTimeline(id, { k: 'Note', t, d: 'Just now' }); DS.save(); st.qNote = ''; DS.render(); DS.toast('Note saved'); },
      queue: () => DS.toast(c.name + ' added to the outreach queue'),
      flag: (el, i) => { S.flags[id + ':' + i] = true; const e = DS.evidenceOf(c)[+i]; DS.addTimeline(id, { k: 'Flag', t: e.l + ' flagged as wrong', d: 'Just now' }); DS.save(); DS.render(); DS.toast('Flagged. It now shows as disputed.'); },
      rerank: () => { S.ranked[id] = 'just now'; DS.save(); DS.render(); DS.toast('Contact points re-ranked'); },
      'act-f': (el, f) => { st.actF = f; DS.render(); },
      ctog: (el, k) => { const cur = togState(); S.ctog[id] = { ...(S.ctog[id] || {}), [k]: !cur[k] }; DS.save(); DS.render(); },
      'rm-list': (el, l) => { const mine = S.clists[id] || (c.cls === 'A' ? ['Class A sellers', 'LES debt 2026'] : c.cls === 'B' ? ['Q4 mail merge'] : []); S.clists[id] = mine.filter(x => x !== l); DS.save(); DS.render(); },
      'add-list': () => { if (!st.listPick) return; const mine = S.clists[id] || (c.cls === 'A' ? ['Class A sellers', 'LES debt 2026'] : c.cls === 'B' ? ['Q4 mail merge'] : []); S.clists[id] = [...mine, st.listPick]; DS.save(); DS.toast('Added to ' + st.listPick); st.listPick = ''; DS.render(); },
    },
    inputs: {
      noteDraft: v => { st.noteDraft = v; }, qNote: v => { st.qNote = v; }, listPick: v => { st.listPick = v; },
      outNotes: v => { DS.setUI({ outcome: { ...outcome(), notes: v } }); }, follow: v => { DS.setUI({ outcome: { ...outcome(), follow: v } }); DS.render(); },
    },
  });
})();
