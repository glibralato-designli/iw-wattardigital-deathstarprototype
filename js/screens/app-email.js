/* App Email (field mode, Oct 28): the web's Email in the iOS Gmail pattern. A list of avatar rows (All · Unread · Starred · Bounces) with
   Brain's end-of-day suggestion; a thread opens as its own screen with Brain's read, the record actions, and Reply and Forward in sheets.
   Campaigns, templates and domains stay on the web. Same store as the web (DS.mailOf, S.mail).
   Presets: open=<thread id>, filter=unread|starred|bounces, eod=1, compose=1, reply=1. */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const S = DS.S();
  const st = { filter: params.get('filter') || 'all', open: params.get('open') || null, reply: '', compose: { to: 'marchetti', subject: '', body: '' }, eodOff: {} };
  if (params.get('eod') === '1') DS.V.sheet = 'eod';
  if (params.get('compose') === '1') DS.V.sheet = 'compose';
  if (params.get('reply') === '1' && st.open) DS.V.sheet = 'reply';
  const who = cid => cid ? D.cById[cid] : null;
  const threads = () => D.mailThreads.map(DS.mailOf).filter(t => !t.archived);
  const shown = () => threads().filter(t => st.filter === 'all' ? t.kind !== 'bounce' : st.filter === 'unread' ? t.unread : st.filter === 'starred' ? t.starred : t.kind === 'bounce');
  const current = () => threads().find(t => t.id === st.open) || null;
  const setMail = (id, patch) => { S.mail = { ...S.mail, [id]: { ...(S.mail || {})[id], ...patch } }; DS.save(); };
  const fill = (txt, c) => { const p = D.pById[c.pid]; return txt.replace(/{{first_name}}/g, c.name.split(' ')[0]).replace(/{{address}}/g, p.addr).replace(/{{debt_amount}}/g, p.debt).replace(/{{maturity_date}}/g, p.mat).replace(/{{neighborhood}}/g, p.hood).replace(/{{years_held}}/g, c.years); };
  const DRAFT = { m1: 'Ruth, Tuesday at 11 works. I’ll come to 64 Essex. Looking forward to meeting you both.', m3: 'Daniel, three walk-ups traded near you this quarter. Easier to walk through on a call than in writing. Does Thursday at 10 work?', m7: 'Michael, the 41 Ludlow rent roll is attached, plus two off-market buildings that fit your box. Want to see them this week?' };

  /* ── The list ── */
  const row = t => `<div class="ds-amail"${t.unread ? ' data-unread' : ''}><button type="button" class="ds-amail__main" data-act="pick" data-arg="${t.id}"><span class="ds-textrow__av" aria-hidden="true">${esc(DS.initials(t.from))}</span>
      <span class="ds-row__body"><span class="ds-amail__top"><b>${esc(t.from)}</b><span class="ds-grow"></span><span class="ds-amail__time">${esc(t.time)}</span></span>
        <span class="ds-amail__subj">${t.kind === 'auto' ? '<span class="badge">Auto</span>' : t.kind === 'bounce' ? `<span class="badge" data-status="danger">Bounced</span>` : ''}${esc(t.subject)}</span>
        <span class="ds-meta ds-ellipsis">${esc(t.msgs[t.msgs.length - 1][2])}</span></span></button>
      <button type="button" class="ds-amail__star" aria-label="${t.starred ? 'Unstar' : 'Star'}" aria-pressed="${t.starred}" data-act="star" data-arg="${t.id}">${icon('star', t.starred ? 'fill' : 'regular')}</button></div>`;
  const list = () => { const xs = shown(), nE = D.eodFollowups.length, done = !!(S.mail || {}).eodSent;
    const eod = st.filter === 'all' ? (done ? `<a class="ds-waiting" href="${href('approvals')}">${icon('tray')}${nE} end-of-day follow-ups wait in Approvals</a>` : `<div class="ds-nudge" role="note" aria-label="Brain suggests">${icon('sparkle')}<p><b>End of day</b> Follow up with today’s ${nE} conversations. Brain drafted one email each.</p><button type="button" class="ds-link-btn" data-act="sheet" data-arg="eod">Review${icon('caret-right')}</button></div>`) : '';
    return `<div class="ds-apage">${ui.large('Email', (DS.mailUnread() ? DS.mailUnread() + ' unread · ' : '') + '154 sends left today')}${ui.teach('email')}
      <div class="ds-achips" role="group" aria-label="Show">${[['all', 'All'], ['unread', 'Unread'], ['starred', 'Starred'], ['bounces', 'Bounces']].map(([k, l]) => `<button type="button" class="ds-fchip" aria-pressed="${st.filter === k}" data-act="filter" data-arg="${k}">${l}</button>`).join('')}</div>
      ${eod}<section class="ds-asec" aria-label="Mail"><div class="ds-alist">${xs.length ? xs.map(row).join('') : `<div style="padding:var(--space-4)">${ui.empty({ ic: 'tray', title: st.filter === 'starred' ? 'Nothing starred' : st.filter === 'bounces' ? 'No delivery failures' : 'No mail', text: 'Replies to your sends land here.' })}</div>`}</div></section>
      <p class="ds-meta" style="text-align:center">Campaigns, templates and domains are on the web.</p></div>`; };

  /* ── A thread ── */
  const thread = t => { const c = who(t.cid), p = c && D.pById[c.pid], m = (S.mail || {})[t.id] || {}, msgs = [...t.msgs, ...(m.replies || []).map(x => ['me', 'Just now', x])];
    return `<div class="ds-apage"><h1 class="ds-amail__subject">${esc(t.subject)}</h1>
      ${c ? `<p class="ds-mailread__who"><a href="${href('contact', 'id=' + c.id)}">${esc(c.name)}</a>${ui.cls(c.cls)}${ui.scoreTag(p.score)}${ui.rankTag(c.rank)}</p>` : ''}
      ${t.brain ? `<div class="ds-nudge" role="note" aria-label="Brain">${icon('sparkle')}<p><b>Brain</b> ${esc(t.brain)}</p>${t.kind === 'reply' ? `<button type="button" class="ds-link-btn" data-act="draft-reply">Draft the reply${icon('caret-right')}</button>` : ''}</div>` : ''}
      <div class="ds-acard ds-amsgs">${msgs.map(([f, when, text]) => `<article class="ds-gmmsg"><span class="ds-gmmsg__av" aria-hidden="true">${f === 'me' ? 'TW' : esc(DS.initials(t.from))}</span><div class="ds-gmmsg__body"><header><b>${f === 'me' ? 'You' : esc(t.from)}</b><span class="ds-grow"></span><span class="ds-meta">${esc(when)}</span></header><span class="ds-meta">to ${f === 'me' ? esc(t.from.split(' ')[0]) : 'me'}</span><p>${esc(text)}</p></div></article>`).join('')}</div>
      ${c && t.kind === 'reply' ? `<section class="ds-asec" aria-label="Record"><div class="ds-ahead"><h2>Record</h2></div><div class="ds-achips">${[['note', 'Add note'], ['off', m.off ? 'Off blasts · 1 yr ✓' : 'Off blasts · 1 yr'], ['primary', m.primary ? 'Primary email ✓' : 'Mark primary'], ['bad', 'Mark bad']].map(([k, l]) => `<button type="button" class="ds-fchip"${m[k] ? ' aria-pressed="true"' : ''} data-act="rec" data-arg="${k}">${l}</button>`).join('')}</div></section>` : ''}
      ${t.kind === 'reply' ? `<div class="ds-aboth">${ui.btn({ label: 'Forward', ic: 'arrow-bend-up-right', variant: 'outline', act: 'forward' })}${ui.btn({ label: 'Reply', ic: 'arrow-bend-up-left', act: 'sheet', arg: 'reply' })}</div>` : ''}</div>`; };

  /* ── Sheets: reply, compose, end of day ── */
  const sheets = () => { const k = DS.V.sheet, t = current();
    if (k === 'reply' && t) return ui.sheet({ key: 'reply', title: 'Reply to ' + t.from.split(' ')[0], body: `<label class="field" style="padding-top:var(--space-2)"><span class="field__label">Re: ${esc(t.subject.replace(/^Re: /, ''))}</span><textarea id="a-reply" class="field__control" rows="6" data-input="reply" placeholder="Write your reply…">${esc(st.reply)}</textarea></label><p class="ds-meta">From thomas@sg-outreach.example · sends on your click</p>`, foot: ui.btn({ label: 'Cancel', variant: 'outline', act: 'close-sheet' }) + ui.btn({ label: 'Send', ic: 'paper-plane-tilt', act: 'send-reply' }) });
    if (k === 'compose') { const c = who(st.compose.to);
      return ui.sheet({ key: 'compose', title: 'New email', size: 'full', body: `<div class="ds-stack" data-gap="3" style="padding-top:var(--space-2)"><label class="field"><span class="field__label">To</span><span class="select"><select id="a-to" class="field__control" data-change="cTo">${D.C.filter(x => x.status !== 'Do not contact').map(x => `<option value="${x.id}"${x.id === st.compose.to ? ' selected' : ''}>${esc(x.name)}</option>`).join('')}</select></span></label>
        <label class="field"><span class="field__label">Subject</span><input id="a-subject" class="field__control" value="${esc(st.compose.subject)}" data-input="cSubject"></label>
        <button type="button" class="ds-nudge ds-amail__brain" data-act="compose-brain">${icon('sparkle')}<p><b>Brain draft</b> from ${esc(c.name.split(' ')[0])}’s signals</p></button>
        <label class="field"><span class="field__label">Message</span><textarea id="a-body" class="field__control" rows="8" data-input="cBody">${esc(st.compose.body)}</textarea></label></div>`, foot: ui.btn({ label: 'Cancel', variant: 'outline', act: 'close-sheet' }) + ui.btn({ label: 'Send', ic: 'paper-plane-tilt', act: 'compose-send' }) }); }
    if (k === 'eod') { const xs = D.eodFollowups, on = xs.filter(x => !st.eodOff[x.cid]);
      return ui.sheet({ key: 'eod', title: 'Today’s follow-ups', size: 'full', body: `<p class="ds-meta" style="padding-top:var(--space-2)">One draft per call logged today, from your note. Untick any you’d rather not send.</p><div class="ds-eod">${xs.map(x => { const c = D.cById[x.cid], off = !!st.eodOff[x.cid]; return `<article class="ds-eod__item"${off ? ' data-off' : ''}><label class="ds-eod__head choice"><input type="checkbox" data-change="eodPick" value="${x.cid}"${off ? '' : ' checked'}><span class="ds-row__body"><b>${esc(c.name)}</b><span class="ds-meta">Your note: ${esc(x.note)}</span></span></label><div class="ds-mailpreview"><b>${esc(x.subject)}</b><p>${esc(x.body)}</p></div></article>`; }).join('')}</div>`, foot: ui.btn({ label: 'Cancel', variant: 'outline', act: 'close-sheet' }) + ui.btn({ label: 'Send ' + on.length + ' to Approvals', act: 'eod-send', disabled: !on.length }) }); }
    return ''; };

  DS.define({
    id: 'email', nav: 'more', tab: 'more',
    head: () => { const t = current(); return t ? { title: '', large: false, back: ['Email', 'email'], actions: ui.iconBtn({ ic: 'archive', aria: 'Archive', act: 'archive' }) + ui.iconBtn({ ic: 'star', aria: t.starred ? 'Unstar' : 'Star', act: 'star', arg: t.id }) } : { title: 'Email', large: true, back: ['More', 'more'], actions: ui.iconBtn({ ic: 'note-pencil', aria: 'Compose', act: 'sheet', arg: 'compose' }) }; },
    scope: () => 'Email',
    init: () => { if (st.open) setMail(st.open, { read: true }); },
    render: () => { const t = current(); return t ? thread(t) : list(); },
    overlays: sheets,
    acts: {
      filter: (el, k) => { st.filter = k; DS.render(); },
      pick: (el, id) => { st.open = id; setMail(id, { read: true }); DS.render(); document.getElementById('ds-main').scrollTop = 0; },
      star: (el, id) => { const t = threads().find(x => x.id === id); setMail(id, { star: !t.starred }); DS.render(); },
      archive: () => { setMail(st.open, { archived: true }); st.open = null; DS.render(); DS.toast('Archived'); },
      sheet: (el, k) => { DS.V.sheet = k; DS.render(); },
      'close-sheet': () => { DS.V.sheet = null; DS.render(); },
      'draft-reply': () => { const t = current(); st.reply = DRAFT[t.id] || 'Thanks, ' + t.from.split(' ')[0] + '. I’ll keep you posted.'; DS.V.sheet = 'reply'; DS.render(); },
      'send-reply': () => { if (!st.reply.trim()) { DS.toast('Write the reply first'); return; } const m = (S.mail || {})[st.open] || {}; setMail(st.open, { replies: [...(m.replies || []), st.reply.trim()] }); st.reply = ''; DS.V.sheet = null; DS.render(); DS.toast('Sent from thomas@sg-outreach.example'); },
      forward: () => { const t = current(); st.compose = { to: 'marchetti', subject: 'Fwd: ' + t.subject, body: t.msgs[t.msgs.length - 1][2] }; DS.V.sheet = 'compose'; DS.render(); },
      rec: (el, k) => { const t = current(), c = who(t.cid); if (k === 'note') { Nav.go('contact', 'id=' + c.id + '&note=1'); return; } setMail(t.id, { [k]: true }); DS.render(); DS.toast(k === 'off' ? 'Off blast lists for one year' : k === 'primary' ? 'Primary email set' : 'Marked bad and removed from the record'); },
      'compose-brain': () => { const c = who(st.compose.to), tp = D.mailTemplates[c.signal === 'Estate transition' ? 2 : c.signal === 'Loan maturity' ? 0 : 7]; st.compose.subject = fill(tp.subject, c); st.compose.body = fill(tp.body, c); DS.render(); },
      'compose-send': () => { const k = st.compose; if (!k.subject.trim() || !k.body.trim()) { DS.toast('Still needs a subject and a message'); return; } S.mail = { ...S.mail, sentNew: [{ id: 'u' + Date.now(), cid: k.to, subject: k.subject, preview: k.body.slice(0, 70) + '…', from: 'thomas@sg-outreach.example', when: 'Just now', status: 'sent' }, ...((S.mail || {}).sentNew || [])] }; DS.save(); st.compose = { to: 'marchetti', subject: '', body: '' }; DS.V.sheet = null; DS.render(); DS.toast('Sent'); },
      'eod-send': () => { const on = D.eodFollowups.filter(x => !st.eodOff[x.cid]); on.forEach(x => DS.apprAdd({ lane: 'email', cid: x.cid, pid: D.cById[x.cid].pid, title: x.subject, why: 'End-of-day follow-up. Your note: ' + x.note + '.', body: ['Subject: ' + x.subject, x.body] })); S.mail = { ...S.mail, eodSent: true }; DS.save(); DS.V.sheet = null; DS.render(); DS.toast(on.length + ' follow-ups in Approvals'); },
    },
    inputs: { reply: v => { st.reply = v; }, cTo: v => { st.compose.to = v; }, cSubject: v => { st.compose.subject = v; }, cBody: v => { st.compose.body = v; }, eodPick: (v, el) => { st.eodOff = { ...st.eodOff, [v]: !el.checked }; DS.render(); } },
  });
})();
