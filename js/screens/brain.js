/* 04 Brain: history, the empty state with suggestions, and a centred conversation with rich answers. */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const st = { histQ: '', docsOpen: false };
  const U = DS.U();
  // Presets: ask=why|list|lookup|first, stage=thinking|streaming, approved=1, chat=<history id>, new=1.
  if (params.get('new') === '1') { U.msgs = []; U.chatTitle = null; U.chatId = null; }
  const chatId = params.get('chat');
  if (chatId) { const ch = D.chats.find(x => x.id === chatId); if (ch) { U.chatId = ch.id; U.chatTitle = ch.t; U.msgs = ch.m ? ch.m.map(m => ({ ...m })) : [{ ...D.proactive }]; } }

  const history = () => {
    const q = st.histQ.toLowerCase().trim(), groups = ['Pinned', 'Today', 'Previous 7 days', 'Older'].map(g => ({ g, items: D.chats.filter(c => c.g === g && (!q || c.t.toLowerCase().includes(q))) })).filter(g => g.items.length);
    return `<aside class="ds-history" aria-label="Chat history"><div class="ds-history__top">${ui.btn({ label: 'New chat', ic: 'note-pencil', variant: 'outline', act: 'new-chat', cls: 'ds-newchat' })}<label class="ds-input-icon">${icon('magnifying-glass')}<input id="hist-q" aria-label="Search chats" placeholder="Search chats" value="${esc(st.histQ)}" data-input="histQ" autocomplete="off"></label></div>
      <div class="ds-history__list">${groups.map(({ g, items }) => `<div class="ds-history__group"><span>${esc(g)}</span>${items.map(c => `<button type="button" class="ds-hitem"${U.chatId === c.id ? ' aria-current="true"' : ''} data-act="open-chat" data-arg="${c.id}">${c.pin ? icon('push-pin') : ''}<span>${esc(c.t)}</span></button>`).join('')}</div>`).join('')}${groups.length ? '' : `<span class="ds-meta" style="padding:var(--space-2)">No chats match “${esc(st.histQ)}”.</span>`}
        <div class="ds-history__group">${[['Folders', 'folders'], ['Archived', 'archive']].map(([l, ic]) => `<span class="ds-hitem" role="button" tabindex="0" aria-disabled="true" data-tip="${DS.OFF}" data-tip-side="right">${icon(ic)}<span>${l}</span></span>`).join('')}</div></div>
      <div style="padding:var(--space-2);display:flex;flex-direction:column;gap:var(--space-0-5)"><button type="button" class="ds-hitem font-medium" aria-expanded="${st.docsOpen}" data-act="docs">${icon('folder')}<span>Stored documents</span><span class="ds-meta" style="flex:none">3</span>${icon(st.docsOpen ? 'caret-down' : 'caret-right')}</button>
        ${st.docsOpen ? D.docs.map(([n, s]) => `<div class="ds-doc" data-anim="expand" data-key="doc-${esc(n)}">${icon('file-text')}<span class="ds-row__body"><span class="ds-row__title" style="font-size:var(--text-xs);line-height:var(--line-height-xs)">${esc(n)}</span><span class="ds-row__sub">${esc(s)}</span></span></div>`).join('') : ''}</div></aside>`;
  };
  const chips = [['Why now for…', 'Daniel Marchetti, or any owner', 'sparkle', 'Why now for Daniel Marchetti?'], ['Build a list of…', 'LES owners with debt due this year', 'list-bullets', '/list LES owners with debt due before year end'], ['Look up a property…', '118 Ludlow St, or a BBL', 'buildings', 'Look up 118 Ludlow St'], ['This week’s market brief', 'Sales, listings and rates', 'newspaper', null]];
  const empty = () => `<div class="ds-brain-empty"><div class="ds-brain-empty__inner"><div class="ds-brain-hello"><span class="ds-brain-hello__icon">${icon('sparkle')}</span><h1>What do you need, Thomas?</h1><span class="ds-lede">Ask about an owner, a building or a list. Answers cite their sources.</span></div>
    ${DS.composer(true, { rows: 2, ph: 'Ask about a contact, property or list' })}
    <div class="ds-chips">${chips.map(([t, s, ic, q]) => q ? `<button type="button" class="ds-chipcard" data-act="ask" data-arg="${esc(q)}">${icon(ic)}<span class="ds-row__body"><span class="font-medium">${esc(t)}</span><span class="ds-meta">${esc(s)}</span></span></button>` : `<div class="ds-chipcard" role="button" tabindex="0" aria-disabled="true" data-tip="${DS.OFF}">${icon(ic)}<span class="ds-row__body"><span class="font-medium">${esc(t)}</span><span class="ds-meta">${esc(s)}</span></span></div>`).join('')}</div></div></div>`;
  const convo = () => `<h1 class="sr-only">Brain · ${esc(U.chatTitle || 'New chat')}</h1><div class="ds-chat" data-page aria-live="polite" id="page-chat" data-keep-scroll="page-chat"><div class="ds-chat__inner" id="page-chat-inner">${DS.chatHTML(true)}</div></div>
    <div class="ds-brainpage__foot"><div style="max-width:47.5rem;margin:0 auto">${DS.composer(true)}</div><p class="ds-meta ds-disclaimer">Brain can be wrong. Check trust badges before you say it out loud.</p></div>`;

  DS.define({
    id: 'brain', nav: 'brain',
    crumbs: () => [{ l: 'Brain', page: 'brain' }, { l: 'Chat' }],
    scope: () => 'Brain',
    init: () => { const k = params.get('ask'); if (k) DS.seedChat(k, params.get('stage')); },
    render: () => {
      const has = (U.msgs || []).length > 0 || DS.V.thinking;
      return `<div class="ds-brainpage">${history()}<div class="ds-brainpage__main"><div class="ds-brainpage__tabs">${ui.stateTabs([['chat', 'Chat'], ['learning', 'Learning Mode', true]], 'chat', 'noop', 'Brain')}<span class="ds-grow"></span>${has ? `<span class="ds-meta ds-ellipsis" style="max-width:20rem">${esc(U.chatTitle || 'New chat')}</span>` : ''}</div>${has ? convo() : empty()}</div></div>`;
    },
    after: () => { if (DS.V.focusPage) { DS.V.focusPage = false; const el = document.getElementById('brain-page-input'); if (el) el.focus(); } },
    acts: {
      noop: () => {},
      'open-chat': (el, cid) => { const ch = D.chats.find(x => x.id === cid); U.chatId = cid; U.chatTitle = ch.t; U.msgs = ch.m ? ch.m.map(m => ({ ...m })) : [{ ...D.proactive }]; DS.V.thinking = false; DS.V.stream = null; DS.save(); DS.V.scrollChat = true; DS.render(); },
      'new-chat': () => { U.msgs = []; U.chatId = null; U.chatTitle = null; DS.V.draft = ''; DS.save(); DS.V.focusPage = true; DS.render(); },
      docs: () => { st.docsOpen = !st.docsOpen; DS.render(); },
    },
    inputs: { histQ: v => { st.histQ = v; DS.render(); } },
  });
})();
