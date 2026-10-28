/* App Texting (field mode, Oct 28): the web's Texting in the iOS Messages pattern. Conversations (Replied · Sent · All) as avatar rows; a thread
   opens as its own screen with the opt-in status, bubbles, Brain's drafts in a sky-blue scroller and the composer at the bottom.
   STOP opts out on every channel; quiet hours (8 PM–9 AM) queue a text for 9 AM. Campaigns stay on the web. Same store as the web (S.sms).
   Presets: open=<contact id>, filter=sent|all, stop=<contact id>, hour=<0–23>. */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const S = DS.S();
  const HOUR = params.has('hour') ? Number(params.get('hour')) : 14, [QH0, QH1] = D.quietHours, quiet = HOUR >= QH0 || HOUR < QH1;
  if (params.get('stop') && D.cById[params.get('stop')]) { const id = params.get('stop'); S.sms = { ...S.sms, [id]: [...((S.sms || {})[id] || []), ['them', 'Just now', 'STOP']] }; S.optOut = { ...S.optOut, [id]: 'Sep 30, 2026' }; DS.optOut(D.cById[id]); }
  const st = { filter: params.get('filter') || 'replied', open: params.get('open') || null, msg: '' };
  const fresh = cid => (S.sms || {})[cid] || [];
  const thread = cid => { const t = D.textThreads.find(x => x.cid === cid); return [...(t ? t.msgs : []), ...fresh(cid)]; };
  const isStop = m => m[0] === 'them' && /^stop$/i.test(m[2].trim());
  const stopped = cid => D.cById[cid].status === 'Do not contact' || thread(cid).some(isStop);
  const unread = cid => { const t = D.textThreads.find(x => x.cid === cid); return !!t && t.replied && !(S.smsRead || {})[cid] && t.msgs[t.msgs.length - 1][0] === 'them' && !stopped(cid); };
  const optin = cid => stopped(cid) ? 'out' : (D.textOptin[cid] || ['none'])[0];
  const fill = (txt, c) => txt.replace(/{first}/g, c.name.split(' ')[0]).replace(/{property}/g, D.pById[c.pid].addr);
  const ids = () => st.filter === 'all' ? D.C.map(c => c.id) : D.textThreads.filter(t => (st.filter === 'replied') === thread(t.cid).some(m => m[0] === 'them')).map(t => t.cid);

  const row = id => { const c = D.cById[id], m = thread(id), last = m[m.length - 1];
    return `<button type="button" class="ds-textrow"${unread(id) ? ' data-unread' : ''} data-act="pick" data-arg="${id}"><span class="ds-textrow__av" aria-hidden="true">${esc(DS.initials(c.name))}</span>
      <span class="ds-row__body"><span class="ds-textrow__top"><b>${esc(c.name)}</b>${stopped(id) ? '<span class="badge" data-status="danger">Opted out</span>' : ''}<span class="ds-grow"></span><span class="ds-meta">${last ? esc(last[1].split(',')[0]) : ''}</span></span>
      <span class="ds-meta ds-ellipsis">${last ? (last[0] === 'me' ? 'You: ' : '') + esc(last[2]) : esc(c.phone)}</span></span>${icon('caret-right')}</button>`; };
  const list = () => { const n = D.textThreads.filter(t => unread(t.cid)).length, xs = ids();
    return `<div class="ds-apage">${ui.large('Texting', (n ? n + (n === 1 ? ' reply' : ' replies') + ' waiting · ' : '') + D.textLine)}${ui.teach('texting')}
      <div class="ds-achips" role="group" aria-label="Show">${[['replied', 'Replied'], ['sent', 'Sent'], ['all', 'All']].map(([k, l]) => `<button type="button" class="ds-fchip" aria-pressed="${st.filter === k}" data-act="filter" data-arg="${k}">${l}</button>`).join('')}</div>
      <section class="ds-asec" aria-label="Conversations"><div class="ds-alist ds-textlist">${xs.length ? xs.map(row).join('') : `<div style="padding:var(--space-4)">${ui.empty({ ic: 'chat-text', title: 'No replies yet', text: 'Replies land here the moment they arrive.' })}</div>`}</div></section>
      <p class="ds-meta" style="text-align:center">Text campaigns are built on the web and wait in Approvals.</p></div>`; };
  const convo = id => { const c = D.cById[id], p = D.pById[c.pid], m = thread(id), off = stopped(id), o = optin(id);
    return `<div class="ds-apage ds-atext"><p class="ds-mailread__who" style="justify-content:center">${ui.cls(c.cls)}<span class="ds-meta">${esc(p.addr)}</span>${ui.scoreTag(p.score)}${o === 'in' ? `<span class="badge" data-status="success">${icon('check')}Opted in</span>` : o === 'out' ? `<span class="badge" data-status="danger">${icon('x')}Opted out</span>` : '<span class="badge">No opt-in yet</span>'}</p>
      <div class="ds-bubbles">${m.length ? m.map(x => `<div class="ds-bubble"${x[0] === 'me' ? ' data-me' : ''}${/^queued/i.test(x[1]) ? ' data-queued' : ''}><p>${esc(x[2])}</p><span class="ds-meta">${esc(x[1])}</span></div>${isStop(x) ? `<p class="ds-bubble__sys">${icon('warning-diamond')}Opted out automatically, on every channel, permanently.</p>` : ''}`).join('') : '<p class="ds-meta" style="text-align:center">No messages yet. Brain drafted four openers below.</p>'}</div>
      ${off ? `<div class="alert" data-status="danger" role="note">${icon('warning-diamond')}<span>${esc(c.name)} ${m.some(isStop) ? 'replied STOP' : 'asked not to be contacted'}. No texts, calls or email, permanently.</span></div>`
        : `<div class="ds-nudge ds-textdrafts" role="group" aria-label="Brain drafts">${icon('sparkle')}<div><b>Brain drafts</b><div class="ds-atext__drafts">${D.textDrafts.map(([l, t], i) => `<button type="button" class="ds-textdraft" data-act="use-draft" data-arg="${i}"><span class="ds-meta">${esc(l)}</span><span>${esc(fill(t, c))}</span></button>`).join('')}</div></div></div>
          <div class="ds-atext__composer"><textarea id="a-msg" class="field__control" rows="2" maxlength="320" placeholder="Text ${esc(c.name.split(' ')[0])}" data-input="msg">${esc(st.msg)}</textarea><button type="button" class="ds-icon-btn ds-atext__send" aria-label="${quiet ? 'Queue for 9 AM' : 'Send'}" data-act="send">${icon(quiet ? 'clock' : 'paper-plane-tilt')}</button></div>
          <p class="ds-meta" style="text-align:center">${quiet ? 'Quiet hours, 8 PM to 9 AM · it goes out at 9 AM' : 'From ' + esc(D.textLine) + ' · sends on your click'}${o === 'none' ? ' · no opt-in on record' : ''}</p>`}</div>`; };

  DS.define({
    id: 'texting', nav: 'more', tab: 'more',
    head: () => st.open ? { title: D.cById[st.open].name, large: false, back: ['Texting', 'texting'], actions: stopped(st.open) ? '' : `<a class="ds-icon-btn" href="${href('contact', 'id=' + st.open + '&act=call')}" aria-label="Call ${esc(D.cById[st.open].name)}">${icon('phone')}</a>` } : { title: 'Texting', large: true, back: ['More', 'more'] },
    scope: () => 'Texting',
    init: () => { if (st.open) S.smsRead = { ...S.smsRead, [st.open]: true }; },
    render: () => st.open ? convo(st.open) : list(),
    acts: {
      filter: (el, k) => { st.filter = k; DS.render(); },
      pick: (el, id) => { st.open = id; st.msg = ''; S.smsRead = { ...S.smsRead, [id]: true }; DS.save(); DS.render(); },
      'use-draft': (el, i) => { st.msg = fill(D.textDrafts[Number(i)][1], D.cById[st.open]); DS.render(); },
      send: () => { if (!st.msg.trim()) { DS.toast('Write the text first'); return; } const id = st.open; S.sms = { ...S.sms, [id]: [...fresh(id), ['me', quiet ? 'Queued · goes out at 9:00 AM' : 'Just now', st.msg.trim()]] }; DS.save(); st.msg = ''; DS.render(); DS.toast(quiet ? 'Quiet hours: it goes out at 9:00 AM' : 'Sent'); },
    },
    inputs: { msg: v => { st.msg = v; } },
  });
})();
