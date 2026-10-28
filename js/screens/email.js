/* Channels › Email (ported from the old Mail page, Oct 28), in the Notion Mail / Gmail pattern: one-line rows grouped by day beside a reading pane.
   Tabs: Inbox (All · Unread · Starred · Bounces), Sent, Campaigns (mail merges and the New campaign builder), Templates, Domains.
   A one-to-one reply sends on Thomas's click; a campaign goes to Approvals. Brain's read of each thread sits in its sky-blue block.
   The old Email Cleaning actions live on each reply (Add note, Off blasts · 1 yr, Mark primary, Mark bad).
   Presets: tab=sent|campaigns|templates|domains, open=<thread id>, filter=unread|starred|bounces, compose=1, build=1, preview=1. */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const S = DS.S();
  const TABS = [['inbox', 'Inbox'], ['sent', 'Sent'], ['campaigns', 'Campaigns'], ['templates', 'Templates'], ['domains', 'Domains']];
  const CAP = D.mailDomains.reduce((a, d) => a + d.inboxes.reduce((b, i) => b + i.day, 0), 0), USED = 186;
  const st = { tab: TABS.some(t => t[0] === params.get('tab')) ? params.get('tab') : 'inbox', filter: params.get('filter') || 'all', q: '', open: params.get('open') || null, picked: params.has('open'),
    reply: '', compose: params.get('compose') === '1' ? { to: 'marchetti', from: D.mailDomains[0].inboxes[0].addr, subject: '', body: '', tpl: '', when: '', min: false } : null,
    build: params.get('build') === '1' || params.get('preview') === '1' ? { list: 'Class A sellers', tpl: 0, subject: D.mailTemplates[0].subject, body: D.mailTemplates[0].body, limit: 50, previewed: params.get('preview') === '1', ask: '' } : null,
    tpl: 0, sentOpen: null, domain: '', domainMsg: '' };
  const who = cid => cid ? D.cById[cid] : null;
  const threads = () => D.mailThreads.map(DS.mailOf).filter(t => !t.archived);
  const shown = () => { const q = st.q.trim().toLowerCase();
    return threads().filter(t => (st.filter === 'all' ? t.kind !== 'bounce' : st.filter === 'unread' ? t.unread : st.filter === 'starred' ? t.starred : t.kind === 'bounce') && (!q || (t.from + ' ' + t.subject + ' ' + t.msgs.map(m => m[2]).join(' ')).toLowerCase().includes(q))); };
  const current = () => threads().find(t => t.id === st.open) || null;
  const setMail = (id, patch) => { S.mail = { ...S.mail, [id]: { ...(S.mail || {})[id], ...patch } }; DS.save(); };

  /* ── Inbox ── */
  const row = t => `<div class="ds-mailrow"${t.unread ? ' data-unread' : ''} aria-current="${st.open === t.id}">
      <button type="button" class="ds-mailrow__star" aria-label="${t.starred ? 'Unstar' : 'Star'}" aria-pressed="${t.starred}" data-act="star" data-arg="${t.id}">${icon('star', t.starred ? 'fill' : 'regular')}</button>
      <button type="button" class="ds-mailrow__main" data-act="pick" data-arg="${t.id}"><span class="ds-mailrow__from">${esc(t.from)}</span>
        <span class="ds-mailrow__text">${t.kind === 'auto' ? '<span class="badge">Auto</span>' : t.kind === 'bounce' ? `<span class="badge" data-status="danger">${icon('warning')}Bounced</span>` : ''}<b>${esc(t.subject)}</b><span> — ${esc(t.msgs[t.msgs.length - 1][2])}</span></span>
        <span class="ds-mailrow__time">${esc(t.time)}</span></button></div>`;
  const list = () => { const xs = shown();
    const filters = ui.segmented([['all', 'All'], ['unread', 'Unread'], ['starred', 'Starred'], ['bounces', 'Bounces']], st.filter, 'filter', 'Inbox filter', 'sm');
    const bar = `<div class="ds-mailbar"><label class="ds-input-icon ds-mailbar__search">${icon('magnifying-glass')}<input id="mail-q" aria-label="Search mail" placeholder="Search mail and people" value="${esc(st.q)}" data-input="q" autocomplete="off"></label>${ui.btn({ label: 'Compose', ic: 'note-pencil', act: 'compose' })}</div>${filters}`;
    const note = st.filter === 'bounces' ? `<p class="ds-meta ds-mail__note">A hard bounce flags that address on the record and leaves it out of the next send. A delay is only a warning.</p>` : '';
    if (!xs.length) return bar + note + `<div class="ds-maillist">${ui.empty({ ic: 'tray', title: st.filter === 'starred' ? 'Nothing starred' : st.filter === 'bounces' ? 'No delivery failures' : 'No replies match', text: st.filter === 'starred' ? 'Star a thread to pin it here.' : 'Replies to your mail merges thread here on their own.' })}</div>`;
    const days = ['Today', 'Yesterday', 'Earlier'].map(d => [d, xs.filter(t => t.day === d)]).filter(([, g]) => g.length);
    return bar + note + `<div class="ds-maillist">${days.map(([d, g]) => `<section aria-label="${d}"><h3 class="ds-maillist__day">${d}</h3>${g.map(row).join('')}</section>`).join('')}</div>`; };
  const recordActs = t => { const c = who(t.cid); if (!c || t.kind !== 'reply') return ''; const m = (S.mail || {})[t.id] || {};
    return `<div class="ds-mailrec"><span class="ds-meta">Record</span>${ui.btn({ label: 'Add note', ic: 'note', size: 'sm', variant: 'ghost', act: 'rec', arg: t.id + '|note' })}${ui.btn({ label: m.off ? 'Off blasts until Sep 30, 2027' : 'Off blasts · 1 yr', size: 'sm', variant: 'ghost', act: 'rec', arg: t.id + '|off', disabled: !!m.off })}${ui.btn({ label: m.primary ? 'Primary email' : 'Mark primary', size: 'sm', variant: 'ghost', act: 'rec', arg: t.id + '|primary', disabled: !!m.primary })}${ui.btn({ label: 'Mark bad', size: 'sm', variant: 'ghost', act: 'rec', arg: t.id + '|bad', disabled: !!m.bad })}</div>`; };
  const reader = () => { const t = current();
    if (!t) return `<section class="ds-mailread" data-empty>${ui.empty({ ic: 'envelope-simple', title: 'Pick a thread', text: 'Replies, auto-replies and bounces from your sends land in the Inbox.' })}</section>`;
    const c = who(t.cid), p = c && D.pById[c.pid], mine = ((S.mail || {})[t.id] || {}).replies || [];
    const msgs = [...t.msgs, ...mine.map(x => ['me', 'Just now', x])];
    return `<section class="ds-mailread" aria-label="Thread" data-anim="fade" data-key="mail-${t.id}">
      <div class="ds-mailread__tools"><button type="button" class="ds-back ds-mailread__back" data-act="back">${icon('caret-left')}Inbox</button><span class="ds-grow"></span>
        ${ui.iconBtn({ ic: 'star', aria: t.starred ? 'Unstar' : 'Star', act: 'star', arg: t.id })}${ui.iconBtn({ ic: 'envelope-simple', aria: 'Mark unread', act: 'unread', arg: t.id })}${ui.iconBtn({ ic: 'archive', aria: 'Archive', act: 'archive', arg: t.id })}</div>
      <h2 class="ds-mailread__subject">${esc(t.subject)}</h2>
      ${c ? `<p class="ds-mailread__who"><a href="${href('contact', 'id=' + c.id)}">${esc(c.name)}</a>${ui.cls(c.cls)}<span class="ds-meta">${esc(p.addr)}</span>${ui.scoreTag(p.score)}${ui.rankTag(c.rank)}</p>` : ''}
      ${t.brain ? `<div class="ds-nudge" role="note" aria-label="Brain">${icon('sparkle')}<p><b>Brain</b> ${esc(t.brain)}</p>${t.kind === 'reply' ? `<button type="button" class="ds-link-btn" data-act="draft-reply" data-arg="${t.id}">Draft the reply${icon('caret-right')}</button>` : ''}</div>` : ''}
      <div class="ds-mailmsgs">${msgs.map(([f, when, text]) => `<article class="ds-mailmsg"${f === 'me' ? ' data-me' : ''}><header><b>${f === 'me' ? 'You' : esc(t.from)}</b><span class="ds-meta">${f === 'me' ? 'thomas@sg-outreach.example' : esc(t.email)}</span><span class="ds-grow"></span><span class="ds-meta">${esc(when)}</span></header><p>${esc(text)}</p></article>`).join('')}</div>
      ${recordActs(t)}
      ${t.kind === 'reply' ? `<div class="ds-mailreply"><textarea id="mail-reply" class="field__control" rows="3" placeholder="Reply to ${esc(t.from.split(' ')[0])}…" data-input="reply">${esc(st.reply)}</textarea><div class="ds-toolbar">${ui.btn({ label: 'Send', ic: 'paper-plane-tilt', act: 'send-reply', arg: t.id })}${ui.btn({ label: 'Open in composer', variant: 'ghost', act: 'reply-compose', arg: t.id })}<span class="ds-grow"></span><span class="ds-meta">Sends now, on your click</span></div></div>` : ''}
    </section>`; };
  const inbox = () => `<div class="ds-mail"${st.picked ? ' data-picked' : ''}><div class="ds-mail__list">${list()}</div>${reader()}</div>`;

  /* ── Sent ── */
  const sentAll = () => [...((S.mail || {}).sentNew || []), ...D.mailSent];
  const sent = () => `<div class="ds-maillist" data-flat>${sentAll().map(x => { const c = who(x.cid); return `<div class="ds-mailrow"><span class="ds-mailrow__star" aria-hidden="true">${icon('paper-plane-tilt')}</span><div class="ds-mailrow__main" data-static><span class="ds-mailrow__from">To ${esc(c ? c.name : x.to)}</span><span class="ds-mailrow__text">${x.status === 'scheduled' ? '<span class="badge" data-status="warning">Scheduled</span>' : ''}<b>${esc(x.subject)}</b><span> — ${esc(x.preview)}</span></span><span class="ds-mailrow__time">${esc(x.when)}</span></div></div>`; }).join('')}</div>
    <p class="ds-meta">One-to-one emails you send. Mail merges are under Campaigns. Mailbox sync runs every 30 to 60 minutes.</p>`;

  /* ── Campaigns ── */
  const stat = (l, v) => `<span class="ds-mailstat"><b class="num">${DS.loc(v)}</b><span class="ds-meta">${l}</span></span>`;
  const campaign = c => { const sentRest = ((S.mail || {}).rest || {})[c.id];
    return `<article class="ds-mailcamp"><div class="ds-mailcamp__head"><div class="ds-row__body"><b>${esc(c.name)}</b><span class="ds-meta">“${esc(c.subject)}” · started ${esc(c.date)}</span></div><span class="badge"${c.state === 'Active' ? ' data-status="success"' : c.state === 'Paused' ? ' data-status="warning"' : ''}>${esc(c.state)}</span></div>
      <div class="ds-mailcamp__stats">${stat('sent', c.sent)}${stat('delivered', c.delivered)}${stat('opened', c.opened)}${stat('clicked', c.clicked)}${stat('replied', c.replied)}${stat('bounced', c.bounced)}</div>
      <div class="ds-mailcamp__foot"><span class="ds-meta">${c.hit} of ${c.owners} owners reached${c.sendable ? ` · ${c.sendable} can still be sent` : ''}${c.noEmail ? ` · ${c.noEmail} need an email` : ''}</span><span class="ds-grow"></span>${c.sendable ? (sentRest ? `<a class="ds-waiting" href="${href('approvals')}">${icon('tray')}In Approvals</a>` : ui.btn({ label: 'Send to the rest (' + c.sendable + ')', size: 'sm', variant: 'outline', act: 'rest', arg: c.id })) : '<span class="ds-meta">List finished</span>'}</div></article>`; };
  const fill = (txt, c) => { const p = D.pById[c.pid]; return txt.replace(/{{first_name}}/g, c.name.split(' ')[0]).replace(/{{address}}|{{property}}/g, p.addr).replace(/{{debt_amount}}/g, p.debt).replace(/{{maturity_date}}|{{maturity}}/g, p.mat).replace(/{{neighborhood}}/g, p.hood).replace(/{{years_held}}/g, c.years).replace(/{{units}}/g, p.units); };
  const builder = () => { const b = st.build, owners = (D.lists.find(l => l[1] === b.list) || [0, 0, 120])[2], c = D.cById.marchetti, n = Math.min(b.limit, owners);
    const steps = ['Pick a list', 'Pick a template', 'Edit, or ask Brain', 'Preview on a real owner', 'Send to Approvals'];
    return `<section class="ds-card ds-mailbuild" data-pad="lg" aria-label="New campaign" data-anim="fade" data-key="build">
      <div class="ds-card__head"><div class="ds-card__title"><h2>New campaign</h2><span class="ds-meta">${CAP - USED} sends left in today’s capacity</span></div>${ui.iconBtn({ ic: 'x', aria: 'Close', act: 'build-close' })}</div>
      <ol class="ds-mailsteps">${steps.map((s, i) => `<li${i < (b.previewed ? 4 : 3) ? ' data-done' : ''}><span class="num">${i + 1}</span>${s}</li>`).join('')}</ol>
      <div class="ds-two" style="gap:var(--space-3)"><label class="field"><span class="field__label">List</span><span class="select"><select id="b-list" class="field__control" data-change="bList">${D.lists.map(l => `<option${l[1] === b.list ? ' selected' : ''}>${esc(l[1])}</option>`).join('')}</select></span></label>
        <label class="field"><span class="field__label">Template</span><span class="select"><select id="b-tpl" class="field__control" data-change="bTpl">${D.mailTemplates.map((t, i) => `<option value="${i}"${i === b.tpl ? ' selected' : ''}>${esc(t.name)}</option>`).join('')}</select></span></label></div>
      <label class="field"><span class="field__label">Subject</span><input id="b-subject" class="field__control" value="${esc(b.subject)}" data-input="bSubject"></label>
      <label class="field"><span class="field__label">Email</span><textarea id="b-body" class="field__control" rows="5" data-input="bBody">${esc(b.body)}</textarea></label>
      <div class="ds-mailtokens"><span class="ds-meta">Fills per owner:</span>${['{{first_name}}', '{{address}}', '{{debt_amount}}', '{{maturity_date}}', '{{neighborhood}}', '{{years_held}}'].map(t => `<code>${t}</code>`).join('')}</div>
      <div class="ds-nudge ds-mailask">${icon('sparkle')}<input id="b-ask" class="field__control" placeholder="Tell Brain how to change it: shorter, lead with the maturity, warmer…" value="${esc(b.ask)}" data-input="bAsk" aria-label="Tell Brain how to change the email">${ui.btn({ label: 'Rewrite', size: 'sm', variant: 'outline', act: 'b-rewrite' })}</div>
      <div class="ds-two" style="gap:var(--space-3);align-items:end"><label class="field"><span class="field__label">Send limit</span><input id="b-limit" class="field__control" type="number" min="1" max="${CAP - USED}" value="${b.limit}" data-input="bLimit"></label><p class="ds-meta">${owners > 30 ? 'A canary of 10 goes first. If bounces stay under 3% after two hours, the rest follow; otherwise it holds and tells you.' : 'Small list: it goes out in one batch.'} Owners without a verified email wait until one is found.</p></div>
      ${b.previewed ? `<div class="ds-mailpreview" data-anim="grow" data-key="preview"><p class="ds-meta">Preview for ${esc(c.name)} · ${esc(D.pById[c.pid].addr)}</p><b>${esc(fill(b.subject, c))}</b><p>${esc(fill(b.body, c))}</p><p class="ds-meta">Thomas W. · The Stewart Group at Marcus &amp; Millichap · (212) 555-0184</p></div>` : ''}
      <div class="ds-toolbar">${b.previewed ? ui.btn({ label: 'Send ' + n + ' to Approvals', ic: 'tray', act: 'b-send' }) : ui.btn({ label: 'Send to Approvals', ic: 'tray', disabled: true, tip: 'Preview on a real owner first' })}${ui.btn({ label: b.previewed ? 'Preview again' : 'Preview on a real owner', variant: 'outline', act: 'b-preview' })}<span class="ds-grow"></span><span class="ds-meta">${DS.loc(owners)} owners on the list · sending ${n} now</span></div>
    </section>`; };
  const campaigns = () => `${st.build ? builder() : `<div class="ds-toolbar"><span class="ds-meta">${D.mailCampaigns.length} mail merges · capacity ${CAP} a day across ${D.mailDomains.length} domains</span><span class="ds-grow"></span>${ui.btn({ label: 'New campaign', ic: 'plus', act: 'build' })}</div>`}
    <div class="ds-stack" data-gap="3">${D.mailCampaigns.map(campaign).join('')}</div>`;

  /* ── Templates and Domains ── */
  const templates = () => { const t = D.mailTemplates[st.tpl];
    return `<div class="ds-mailtpl"><div class="ds-maillist" data-flat role="listbox" aria-label="Templates">${D.mailTemplates.map((x, i) => `<button type="button" class="ds-mailtpl__item" role="option" aria-selected="${i === st.tpl}" data-act="tpl" data-arg="${i}"><b>${esc(x.name)}</b><span class="ds-meta">${esc(x.use)}</span></button>`).join('')}</div>
      <section class="ds-card" data-pad="lg" aria-label="${esc(t.name)}"><div class="ds-card__head"><div class="ds-card__title"><h2>${esc(t.name)}</h2><span class="ds-meta">${esc(t.use)}</span></div></div><p class="ds-meta">Subject</p><b>${esc(t.subject)}</b><div class="ds-mailpreview"><p>${esc(t.body)}</p></div><p class="ds-meta">Merge fields fill from the owner’s record. Never a price for the owner’s own building.</p><div class="ds-toolbar">${ui.btn({ label: 'Use in a new email', ic: 'note-pencil', act: 'tpl-use', arg: st.tpl })}${ui.btn({ label: 'Use in a campaign', variant: 'outline', act: 'tpl-camp', arg: st.tpl })}</div></section></div>`; };
  const domains = () => `<div class="ds-stack" data-gap="3">${D.mailDomains.map(d => { const cap = d.inboxes.reduce((a, i) => a + i.day, 0); return `<section class="ds-card" data-pad="all" aria-label="${esc(d.domain)}"><div class="ds-card__head"><div class="ds-card__title"><h3>${esc(d.domain)}</h3><span class="ds-meta">${d.inboxes.length} inboxes · ${d.inboxes.filter(i => i.status === 'Active').length} warmed</span></div><span class="ds-meta-strong num">${cap} a day</span></div>
      ${d.inboxes.map(i => `<div class="ds-maildom"><span class="num">${esc(i.addr)}</span><span class="badge"${i.status === 'Active' ? ' data-status="success"' : ' data-status="warning"'}>${esc(i.status)}</span><span class="ds-grow"></span><span class="ds-meta num">${i.day} a day</span>${ui.btn({ label: 'Compose from', size: 'sm', variant: 'ghost', act: 'compose-from', arg: i.addr })}</div>`).join('')}</section>`; }).join('')}
    <section class="ds-card" data-pad="all" aria-label="Add a domain"><div class="ds-card__head"><div class="ds-card__title"><h3>Add sending capacity</h3><span class="ds-meta">Campaigns split across domains on their own. A new domain warms up for about two weeks.</span></div></div>
      <div class="ds-inline-add"><label class="ds-input-icon">${icon('globe')}<input id="dom-q" aria-label="Domain" placeholder="stewartgroup-mail.example" value="${esc(st.domain)}" data-input="domain" autocomplete="off"></label>${ui.btn({ label: 'Check availability', variant: 'outline', act: 'domain-check' })}</div>${st.domainMsg ? `<p class="ds-meta">${esc(st.domainMsg)}</p>` : ''}</section></div>`;

  /* ── Composer, docked bottom right ── */
  const composer = () => { const k = st.compose; if (!k) return ''; const c = who(k.to);
    if (k.min) return `<button type="button" class="ds-maildock" data-min data-act="compose-max">${icon('note-pencil')}<span>${esc(k.subject || 'New email')}</span>${icon('caret-up')}</button>`;
    return `<section class="ds-maildock" role="dialog" aria-label="New email" data-anim="rise" data-key="dock"><header><b>${esc(k.subject || 'New email')}</b><span class="ds-grow"></span>${ui.iconBtn({ ic: 'minus', aria: 'Minimize', act: 'compose-min' })}${ui.iconBtn({ ic: 'x', aria: 'Close', act: 'compose-close' })}</header>
      <div class="ds-maildock__body">
        <label class="ds-maildock__row"><span>To</span><span class="select"><select id="c-to" class="field__control" data-change="cTo">${D.C.filter(x => x.status !== 'Do not contact').map(x => `<option value="${x.id}"${x.id === k.to ? ' selected' : ''}>${esc(x.name)} · ${esc(D.pById[x.pid].addr)}</option>`).join('')}</select></span></label>
        <label class="ds-maildock__row"><span>From</span><span class="select"><select id="c-from" class="field__control" data-change="cFrom">${D.mailDomains.flatMap(d => d.inboxes).map(i => `<option${i.addr === k.from ? ' selected' : ''}>${esc(i.addr)}</option>`).join('')}</select></span></label>
        <label class="ds-maildock__row"><span>Subject</span><input id="c-subject" class="field__control" value="${esc(k.subject)}" data-input="cSubject"></label>
        <div class="ds-maildock__tools"><span class="select"><select id="c-tpl" class="field__control" data-size="sm" aria-label="Apply a template" data-change="cTpl"><option value="">Apply a template…</option>${D.mailTemplates.map((t, i) => `<option value="${i}">${esc(t.name)}</option>`).join('')}</select></span>${ui.btn({ label: 'Brain draft', ic: 'sparkle', size: 'sm', variant: 'outline', act: 'compose-brain' })}</div>
        <textarea id="c-body" class="field__control" rows="7" placeholder="Write, apply a template, or let Brain draft from ${c ? esc(c.name.split(' ')[0]) + '’s' : 'the owner’s'} signals…" data-input="cBody">${esc(k.body)}</textarea>
      </div>
      <footer>${ui.btn({ label: k.when ? 'Schedule' : 'Send', ic: 'paper-plane-tilt', act: 'compose-send' })}<label class="ds-maildock__when"><span class="sr-only">Schedule</span><input id="c-when" class="field__control" type="datetime-local" value="${esc(k.when)}" data-input="cWhen" data-size="sm"></label><span class="ds-grow"></span>${ui.iconBtn({ ic: 'trash', aria: 'Discard', act: 'compose-close' })}</footer></section>`; };

  const body = () => ({ inbox, sent, campaigns, templates, domains })[st.tab]();
  DS.define({
    id: 'email', nav: 'email', brain: 'min',
    crumbs: () => [{ l: 'Email' }],
    scope: () => 'Email',
    render: () => `<div class="ds-page">${ui.pageHead('Email', ui.stateTabs(TABS, st.tab, 'tab', 'Email'), '', ui.headStat({ n: CAP - USED, l: 'sends left today', sub: CAP + ' a day across ' + D.mailDomains.length + ' domains' }))}${body()}</div>`,
    overlays: composer,
    acts: {
      tab: (el, k) => { st.tab = k; DS.render(); },
      filter: (el, k) => { st.filter = k; DS.render(); },
      pick: (el, id) => { st.open = id; st.picked = true; st.reply = ''; setMail(id, { read: true }); DS.render(); },
      back: () => { st.picked = false; DS.render(); },
      star: (el, id) => { const t = threads().find(x => x.id === id); setMail(id, { star: !t.starred }); DS.render(); },
      unread: (el, id) => { setMail(id, { read: false }); st.picked = false; st.open = null; DS.render(); DS.toast('Marked unread'); },
      archive: (el, id) => { setMail(id, { archived: true }); st.open = null; st.picked = false; DS.render(); DS.toast('Archived'); },
      'draft-reply': (el, id) => { const t = current(), c = who(t.cid); st.reply = id === 'm1' ? 'Ruth, Tuesday at 11 works. I’ll come to 64 Essex. Looking forward to meeting you both.' : id === 'm3' ? 'Daniel, three walk-ups traded near you this quarter. Easier to walk through on a call than in writing. Does Thursday at 10 work?' : id === 'm7' ? 'Michael, the 41 Ludlow rent roll is attached, plus two off-market buildings that fit your box. Want to see them this week?' : 'Thanks, ' + (c ? c.name.split(' ')[0] : '') + '. I’ll keep you posted.'; DS.render(); setTimeout(() => { const x = document.getElementById('mail-reply'); if (x) x.focus(); }, 30); },
      'send-reply': (el, id) => { if (!st.reply.trim()) { DS.toast('Write the reply first'); return; } const m = (S.mail || {})[id] || {}; setMail(id, { replies: [...(m.replies || []), st.reply.trim()] }); st.reply = ''; DS.render(); DS.toast('Sent from thomas@sg-outreach.example'); },
      'reply-compose': (el, id) => { const t = current(); st.compose = { to: t.cid || 'marchetti', from: D.mailDomains[0].inboxes[0].addr, subject: 'Re: ' + t.subject.replace(/^Re: /, ''), body: st.reply, tpl: '', when: '', min: false }; DS.render(); },
      rec: (el, arg) => { const [id, k] = arg.split('|'), t = current(), c = who(t.cid);
        if (k === 'note') { Nav.go('contact', 'id=' + c.id + '&note=1'); return; }
        setMail(id, { [k]: true }); DS.render(); DS.toast(k === 'off' ? 'Off blast lists for one year. A Class A or B signal overrides it.' : k === 'primary' ? c.name + '’s primary email is ' + t.email : 'Marked bad and removed from the record'); },
      compose: () => { st.compose = { to: 'marchetti', from: D.mailDomains[0].inboxes[0].addr, subject: '', body: '', tpl: '', when: '', min: false }; DS.render(); },
      'compose-from': (el, addr) => { st.compose = { to: 'marchetti', from: addr, subject: '', body: '', tpl: '', when: '', min: false }; DS.render(); },
      'compose-min': () => { st.compose.min = true; DS.render(); },
      'compose-max': () => { st.compose.min = false; DS.render(); },
      'compose-close': () => { st.compose = null; DS.render(); },
      'compose-brain': () => { const c = who(st.compose.to), t = D.mailTemplates[c.signal === 'Estate transition' ? 2 : c.signal === 'Loan maturity' ? 0 : 7]; st.compose.subject = fill(t.subject, c); st.compose.body = fill(t.body, c); DS.render(); DS.toast('Brain drafted from ' + c.name.split(' ')[0] + '’s signals. Check it before you send.'); },
      'compose-send': () => { const k = st.compose; if (!k.subject.trim() || !k.body.trim()) { DS.toast('Still needs a subject and a message'); return; } S.mail = { ...S.mail, sentNew: [{ id: 'u' + Date.now(), cid: k.to, subject: k.subject, preview: k.body.slice(0, 70) + '…', from: k.from, when: k.when ? k.when.replace('T', ' ') : 'Just now', status: k.when ? 'scheduled' : 'sent' }, ...((S.mail || {}).sentNew || [])] }; DS.save(); st.compose = null; DS.render(); DS.toast(k.when ? 'Scheduled' : 'Sent from ' + k.from); },
      rest: (el, id) => { const c = D.mailCampaigns.find(x => x.id === id); DS.apprAdd({ lane: 'email', title: c.name + ' · the rest', why: c.hit + ' of ' + c.owners + ' owners reached; ' + c.sendable + ' can still be sent. Owners already contacted, bounced or unsubscribed are skipped.', body: ['Subject: ' + c.subject, 'Same email as the first send, to the ' + c.sendable + ' owners not reached yet.'], n: c.sendable, wave: Math.min(10, c.sendable) }); S.mail = { ...S.mail, rest: { ...((S.mail || {}).rest), [id]: true } }; DS.save(); DS.render(); DS.toast('In Approvals · ' + c.sendable + ' owners wait for your click'); },
      build: () => { st.build = { list: 'Class A sellers', tpl: 0, subject: D.mailTemplates[0].subject, body: D.mailTemplates[0].body, limit: 50, previewed: false, ask: '' }; DS.render(); },
      'build-close': () => { st.build = null; DS.render(); },
      'b-preview': () => { st.build.previewed = true; DS.render(); },
      'b-rewrite': () => { const b = st.build; if (!b.ask.trim()) { DS.toast('Tell Brain what to change'); return; } b.body = b.body.split('. ').slice(0, 2).join('. ').replace(/\.?$/, '.') + ' Worth a short call this week?'; b.ask = ''; b.previewed = false; DS.render(); DS.toast('Brain rewrote it shorter. Preview again before sending.'); },
      'b-send': () => { const b = st.build, n = Math.min(b.limit, (D.lists.find(l => l[1] === b.list) || [0, 0, 120])[2]); DS.apprAdd({ lane: 'email', title: b.list + ' · ' + D.mailTemplates[b.tpl].name, why: 'Mail merge to “' + b.list + '”. A canary of 10 goes first, then the rest if bounces stay under 3%.', body: ['Subject: ' + b.subject, b.body], n, wave: 10 }); st.build = null; DS.render(); DS.toast('In Approvals · ' + n + ' owners wait for your click'); },
      tpl: (el, i) => { st.tpl = Number(i); DS.render(); },
      'tpl-use': (el, i) => { const t = D.mailTemplates[Number(i)], c = D.cById.marchetti; st.compose = { to: 'marchetti', from: D.mailDomains[0].inboxes[0].addr, subject: fill(t.subject, c), body: fill(t.body, c), tpl: i, when: '', min: false }; DS.render(); },
      'tpl-camp': (el, i) => { const t = D.mailTemplates[Number(i)]; st.tab = 'campaigns'; st.build = { list: 'Class A sellers', tpl: Number(i), subject: t.subject, body: t.body, limit: 50, previewed: false, ask: '' }; DS.render(); },
      'domain-check': () => { const d = st.domain.trim(); st.domainMsg = !d ? 'Type a domain first.' : /stewart/.test(d) ? d + ' is available · about $18 a year. Buying it adds DNS, two or three inboxes and two weeks of warmup.' : d + ' is taken. Try a variation with stewart in it.'; DS.render(); },
    },
    inputs: { q: v => { st.q = v; DS.render(); }, reply: v => { st.reply = v; }, domain: v => { st.domain = v; },
      cTo: v => { st.compose.to = v; }, cFrom: v => { st.compose.from = v; }, cSubject: v => { st.compose.subject = v; }, cBody: v => { st.compose.body = v; }, cWhen: v => { st.compose.when = v; DS.render(); },
      cTpl: v => { if (v === '') return; const t = D.mailTemplates[Number(v)], c = who(st.compose.to); st.compose.subject = fill(t.subject, c); st.compose.body = fill(t.body, c); DS.render(); },
      bList: v => { st.build.list = v; st.build.previewed = false; DS.render(); }, bTpl: v => { const t = D.mailTemplates[Number(v)]; Object.assign(st.build, { tpl: Number(v), subject: t.subject, body: t.body, previewed: false }); DS.render(); },
      bSubject: v => { st.build.subject = v; st.build.previewed = false; }, bBody: v => { st.build.body = v; st.build.previewed = false; }, bAsk: v => { st.build.ask = v; }, bLimit: v => { st.build.limit = Math.max(1, Math.min(CAP - USED, Number(v) || 1)); } },
  });
})();
