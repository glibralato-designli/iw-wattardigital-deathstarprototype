/* Channels › Texting (ported from the old Texting page, Oct 28): one Salesmsg line. Conversations (Replied · Sent · All) beside the thread,
   Brain's four tailored drafts in its sky-blue block above the composer, and a one-to-one text that sends on Thomas's click.
   An owner who replied STOP, or is Do not contact, can't be texted: the composer is replaced by the reason. Blasts are built under Campaigns
   and wait in Approvals (cap 200). Presets: tab=campaigns, open=<contact id>, filter=sent|all, build=1, preview=1. */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const S = DS.S();
  const TABS = [['conversations', 'Conversations'], ['campaigns', 'Campaigns']];
  const CLASSES = ['A', 'B', 'C', 'D'];
  const st = { tab: params.get('tab') === 'campaigns' ? 'campaigns' : 'conversations', filter: params.get('filter') || 'replied', q: '', open: params.get('open') || null, picked: params.has('open'), msg: '',
    build: params.get('build') === '1' || params.get('preview') === '1' ? { cls: ['A', 'B'], zips: '', list: '', topic: 0, body: '', limit: 100, previewed: params.get('preview') === '1', ask: '' } : null };
  const fresh = (cid, id) => (S.sms || {})[cid] || [];
  const thread = cid => { const t = D.textThreads.find(x => x.cid === cid); return [...(t ? t.msgs : []), ...fresh(cid)]; };
  const stopped = cid => { const c = D.cById[cid]; return c.status === 'Do not contact' || thread(cid).some(m => m[0] === 'them' && /^stop$/i.test(m[2].trim())); };
  const unread = cid => { const t = D.textThreads.find(x => x.cid === cid); return !!t && t.replied && !(S.smsRead || {})[cid] && t.msgs[t.msgs.length - 1][0] === 'them' && !stopped(cid); };
  const rows = () => { const q = st.q.trim().toLowerCase(), ids = st.filter === 'all' ? D.C.map(c => c.id) : D.textThreads.filter(t => st.filter === 'replied' ? t.replied || thread(t.cid).some(m => m[0] === 'them') : !t.replied && !thread(t.cid).some(m => m[0] === 'them')).map(t => t.cid);
    return ids.filter(id => { const c = D.cById[id]; return !q || c.name.toLowerCase().includes(q) || c.phone.replace(/\D/g, '').includes(q.replace(/\D/g, '') || '~'); }); };
  const fill = (txt, c) => txt.replace(/{first}/g, c.name.split(' ')[0]).replace(/{property}/g, D.pById[c.pid].addr);

  /* ── Conversations ── */
  const row = id => { const c = D.cById[id], m = thread(id), last = m[m.length - 1];
    return `<button type="button" class="ds-textrow"${unread(id) ? ' data-unread' : ''} aria-current="${st.open === id}" data-act="pick" data-arg="${id}"><span class="ds-textrow__av" aria-hidden="true">${esc(DS.initials(c.name))}</span>
      <span class="ds-row__body"><span class="ds-textrow__top"><b>${esc(c.name)}</b>${stopped(id) ? '<span class="badge" data-status="danger">Opted out</span>' : ''}<span class="ds-grow"></span><span class="ds-meta">${last ? esc(last[1].split(',')[0]) : ''}</span></span>
      <span class="ds-meta ds-ellipsis">${last ? (last[0] === 'me' ? 'You: ' : '') + esc(last[2]) : esc(c.phone)}</span></span></button>`; };
  const list = () => { const xs = rows();
    return `<div class="ds-mailbar"><label class="ds-input-icon ds-mailbar__search">${icon('magnifying-glass')}<input id="text-q" aria-label="Search contacts" placeholder="Name or phone" value="${esc(st.q)}" data-input="q" autocomplete="off"></label>${ui.segmented([['replied', 'Replied'], ['sent', 'Sent'], ['all', 'All']], st.filter, 'filter', 'Conversations filter', 'sm')}</div>
      <div class="ds-maillist ds-textlist">${xs.length ? xs.map(row).join('') : ui.empty({ ic: 'chat-text', title: st.filter === 'replied' ? 'No replies yet' : 'Nothing here', text: st.filter === 'replied' ? 'Replies to your texts land here the moment they arrive.' : 'Try another name or number.' })}</div>`; };
  const pane = () => { const id = st.open; if (!id) return `<section class="ds-mailread" data-empty>${ui.empty({ ic: 'chat-text', title: 'Pick a conversation', text: 'Or find any owner under All to start one.' })}</section>`;
    const c = D.cById[id], p = D.pById[c.pid], m = thread(id), off = stopped(id);
    return `<section class="ds-mailread ds-textpane" aria-label="Conversation with ${esc(c.name)}" data-anim="fade" data-key="text-${id}">
      <div class="ds-mailread__tools"><button type="button" class="ds-back ds-mailread__back" data-act="back">${icon('caret-left')}Conversations</button><span class="ds-grow"></span>${ui.btn({ label: 'Add note', ic: 'note', size: 'sm', variant: 'ghost', link: href('contact', 'id=' + id + '&note=1') })}</div>
      <p class="ds-mailread__who"><a href="${href('contact', 'id=' + id)}"><b>${esc(c.name)}</b></a>${ui.cls(c.cls)}<span class="ds-meta num">${esc(c.phone)}</span><span class="ds-meta">${esc(p.addr)}</span>${ui.scoreTag(p.score)}</p>
      <div class="ds-bubbles" aria-live="polite">${m.length ? m.map(([f, when, text]) => `<div class="ds-bubble"${f === 'me' ? ' data-me' : ''}><p>${esc(text)}</p><span class="ds-meta">${esc(when)}</span></div>`).join('') : `<p class="ds-meta" style="text-align:center">No messages yet. Brain drafted four openers below.</p>`}</div>
      ${off ? `<div class="alert" data-status="danger" role="note">${icon('warning-diamond')}<span>${esc(c.name)} ${c.status === 'Do not contact' ? 'asked not to be contacted' : 'replied STOP'}. Opted out of texts and every other channel, permanently.</span></div>`
        : `<div class="ds-nudge ds-textdrafts" role="group" aria-label="Brain drafts">${icon('sparkle')}<div><b>Brain drafts</b><span class="ds-meta"> · from ${esc(c.name.split(' ')[0])}’s signals</span><div class="ds-textdrafts__row">${D.textDrafts.map(([l, t], i) => `<button type="button" class="ds-textdraft" data-act="use-draft" data-arg="${i}"><span class="ds-meta">${esc(l)}</span><span>${esc(fill(t, c))}</span></button>`).join('')}</div></div></div>
          <div class="ds-mailreply"><textarea id="text-msg" class="field__control" rows="2" placeholder="Text ${esc(c.name.split(' ')[0])}… two sentences, data first" data-input="msg" maxlength="320">${esc(st.msg)}</textarea><div class="ds-toolbar">${ui.btn({ label: 'Send', ic: 'paper-plane-tilt', act: 'send', arg: id })}<span class="ds-meta num">${st.msg.length} / 320</span><span class="ds-grow"></span><span class="ds-meta">From ${esc(D.textLine)} · sends on your click</span></div></div>`}
    </section>`; };
  const conversations = () => `<div class="ds-mail"${st.picked ? ' data-picked' : ''}><div class="ds-mail__list">${list()}</div>${pane()}</div>`;

  /* ── Campaigns ── */
  const matches = b => Math.round(b.cls.reduce((a, k) => a + ({ A: 1140, B: 3860, C: 9420, D: 25792 })[k], 0) * 0.31 * (b.zips.trim() ? 0.18 : 1) * (b.list ? 0.05 : 1));
  const builder = () => { const b = st.build, n = matches(b), c = D.cById.marchetti, send = Math.min(b.limit, n);
    return `<section class="ds-card ds-mailbuild" data-pad="lg" aria-label="New text campaign" data-anim="fade" data-key="tbuild">
      <div class="ds-card__head"><div class="ds-card__title"><h2>New text campaign</h2><span class="ds-meta">Opted-out owners and Do not contact are always left out</span></div>${ui.iconBtn({ ic: 'x', aria: 'Close', act: 'build-close' })}</div>
      <div class="field"><span class="field__label">Owner class</span><div class="ds-toolbar" style="gap:var(--space-1-5)">${CLASSES.map(k => `<button type="button" class="ds-pill-btn" role="checkbox" aria-checked="${b.cls.includes(k)}" data-act="b-cls" data-arg="${k}">${b.cls.includes(k) ? icon('check') : ''}Class ${k}</button>`).join('')}</div></div>
      <div class="ds-two" style="gap:var(--space-3)"><label class="field"><span class="field__label">ZIP codes</span><input id="t-zips" class="field__control" placeholder="10002, 10009" value="${esc(b.zips)}" data-input="bZips"></label>
        <label class="field"><span class="field__label">List</span><span class="select"><select id="t-list" class="field__control" data-change="bList"><option value="">Any</option>${D.lists.map(l => `<option${l[1] === b.list ? ' selected' : ''}>${esc(l[1])}</option>`).join('')}</select></span></label></div>
      <label class="field"><span class="field__label">Topic</span><span class="select"><select id="t-topic" class="field__control" data-change="bTopic">${D.textTopics.map((t, i) => `<option value="${i}"${i === b.topic ? ' selected' : ''}>${esc(t)}</option>`).join('')}</select></span></label>
      <label class="field"><span class="field__label">Message</span><textarea id="t-body" class="field__control" rows="3" maxlength="300" placeholder="Hi {first}, Thomas from Stewart Group. Quick question on your building…" data-input="bBody">${esc(b.body)}</textarea><span class="ds-meta num">${b.body.length} / 300 · {first} fills the first name</span></label>
      <div class="ds-nudge ds-mailask">${icon('sparkle')}<input id="t-ask" class="field__control" placeholder="Tell Brain: shorter, lead with the maturity, warmer…" value="${esc(b.ask)}" data-input="bAsk" aria-label="Tell Brain how to change the text">${ui.btn({ label: 'Rewrite', size: 'sm', variant: 'outline', act: 'b-rewrite' })}</div>
      ${b.previewed ? `<div class="ds-bubbles" data-anim="grow" data-key="tprev"><p class="ds-meta">Preview for ${esc(c.name)}</p><div class="ds-bubble" data-me><p>${esc(fill(b.body || 'Hi {first}', c))}</p><span class="ds-meta">From ${esc(D.textLine)}</span></div></div>` : ''}
      <div class="ds-two" style="gap:var(--space-3);align-items:end"><label class="field"><span class="field__label">Send limit</span><input id="t-limit" class="field__control" type="number" min="1" max="200" value="${b.limit}" data-input="bLimit"></label><p class="ds-meta"><b class="num" style="color:var(--fg)">${DS.loc(n)}</b> owners match. Up to 200 a send; replies stream back into Conversations.</p></div>
      <div class="ds-toolbar">${b.previewed && b.body.trim() ? ui.btn({ label: 'Send ' + send + ' to Approvals', ic: 'tray', act: 'b-send' }) : ui.btn({ label: 'Send to Approvals', ic: 'tray', disabled: true, tip: 'Write the message and preview it first' })}${ui.btn({ label: 'Preview on a real owner', variant: 'outline', act: 'b-preview' })}</div></section>`; };
  const campaigns = () => `${st.build ? builder() : `<div class="ds-toolbar"><span class="ds-meta">${D.textCampaigns.length} text blasts from ${esc(D.textLine)}</span><span class="ds-grow"></span>${ui.btn({ label: 'New text campaign', ic: 'plus', act: 'build' })}</div>`}
    <div class="ds-stack" data-gap="3">${D.textCampaigns.map(x => `<article class="ds-mailcamp"><div class="ds-mailcamp__head"><div class="ds-row__body"><b>${esc(x.name)}</b><span class="ds-meta">Sent ${esc(x.date)}</span></div></div><div class="ds-bubble" data-me><p>${esc(x.body)}</p></div><div class="ds-mailcamp__stats"><span class="ds-mailstat"><b class="num">${x.audience}</b><span class="ds-meta">matched</span></span><span class="ds-mailstat"><b class="num">${x.sent}</b><span class="ds-meta">sent</span></span><span class="ds-mailstat"><b class="num">${x.replied}</b><span class="ds-meta">replied</span></span><span class="ds-mailstat"><b class="num">${Math.round(x.replied / x.sent * 100)}%</b><span class="ds-meta">reply rate</span></span></div></article>`).join('')}</div>`;

  const n = () => D.textThreads.filter(t => unread(t.cid)).length;
  DS.define({
    id: 'texting', nav: 'texting', brain: 'min',
    crumbs: () => [{ l: 'Texting' }],
    scope: () => 'Texting',
    init: () => { if (st.open) S.smsRead = { ...S.smsRead, [st.open]: true }; },
    render: () => `<div class="ds-page">${ui.pageHead('Texting', ui.stateTabs(TABS, st.tab, 'tab', 'Texting'), '', ui.headStat({ n: n(), l: n() === 1 ? 'reply waiting' : 'replies waiting', sub: 'Salesmsg line ' + D.textLine }))}${st.tab === 'conversations' ? conversations() : campaigns()}</div>`,
    acts: {
      tab: (el, k) => { st.tab = k; DS.render(); },
      filter: (el, k) => { st.filter = k; DS.render(); },
      pick: (el, id) => { st.open = id; st.picked = true; st.msg = ''; S.smsRead = { ...S.smsRead, [id]: true }; DS.save(); DS.render(); },
      back: () => { st.picked = false; DS.render(); },
      'use-draft': (el, i) => { st.msg = fill(D.textDrafts[Number(i)][1], D.cById[st.open]); DS.render(); setTimeout(() => { const x = document.getElementById('text-msg'); if (x) x.focus(); }, 30); },
      send: (el, id) => { if (!st.msg.trim()) { DS.toast('Write the text first'); return; } if (stopped(id)) return; S.sms = { ...S.sms, [id]: [...fresh(id), ['me', 'Just now', st.msg.trim()]] }; DS.save(); st.msg = ''; DS.render(); DS.toast('Sent from ' + D.textLine); },
      build: () => { st.build = { cls: ['A', 'B'], zips: '', list: '', topic: 0, body: '', limit: 100, previewed: false, ask: '' }; DS.render(); },
      'build-close': () => { st.build = null; DS.render(); },
      'b-cls': (el, k) => { const b = st.build; b.cls = b.cls.includes(k) ? b.cls.filter(x => x !== k) : [...b.cls, k]; DS.render(); },
      'b-preview': () => { if (!st.build.body.trim()) st.build.body = 'Hi {first}, Thomas from Stewart Group. ' + ['Owners with loans due in 2027 are comparing a refinance with a sale. Want the numbers?', 'Cap rates moved this quarter. Want a two-line read on your building?', 'We have buyers asking for off-market walk-ups like yours. Open to a quiet look?', 'Air rights near you just set a record. Worth a look for your building?', 'Long-hold owners are freeing equity this year. Happy to run the numbers.', 'Happy to share what other families have done with inherited buildings.', '1031 buyers are active below 96th St. Open to a quiet offer?', 'Stabilized rents stay flat this year. Want the math on your building?'][st.build.topic]; st.build.previewed = true; DS.render(); },
      'b-rewrite': () => { const b = st.build; if (!b.ask.trim() || !b.body.trim()) { DS.toast('Write the message and tell Brain what to change'); return; } b.body = b.body.split('. ').slice(0, 2).join('. ').replace(/\.?$/, '.'); b.ask = ''; b.previewed = false; DS.render(); DS.toast('Brain made it shorter. Preview again before sending.'); },
      'b-send': () => { const b = st.build, k = Math.min(b.limit, matches(b)); DS.apprAdd({ lane: 'text', title: 'Text blast · Class ' + b.cls.join(', '), why: k + ' owners from ' + DS.loc(matches(b)) + ' matches. Opted-out owners and Do not contact are left out.', body: [b.body], n: k, wave: Math.min(20, k) }); st.build = null; DS.render(); DS.toast('In Approvals · ' + k + ' texts wait for your click'); },
    },
    inputs: { q: v => { st.q = v; DS.render(); }, msg: v => { st.msg = v; const k = document.querySelector('.ds-mailreply .num'); if (k) k.textContent = v.length + ' / 320'; },
      bZips: v => { st.build.zips = v; }, bList: v => { st.build.list = v; DS.render(); }, bTopic: v => { st.build.topic = Number(v); st.build.body = ''; st.build.previewed = false; DS.render(); },
      bBody: v => { st.build.body = v; st.build.previewed = false; }, bAsk: v => { st.build.ask = v; }, bLimit: v => { st.build.limit = Math.max(1, Math.min(200, Number(v) || 1)); } },
  });
})();
