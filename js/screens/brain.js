/* 04 Brain: chat history (a collapsible column, a drawer on a phone), the empty state with suggestions, and a centred conversation with rich answers. */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const U = DS.U();
  // Presets: ask=why|list|lookup|first, stage=thinking|streaming, approved=1, chat=<history id>, new=1, chats=open (phone drawer) or hidden (column hidden).
  if (params.get('new') === '1') { U.msgs = []; U.chatTitle = null; U.chatId = null; }
  const chatId = params.get('chat');
  if (chatId) { const ch = D.chats.find(x => x.id === chatId); if (ch) { U.chatId = ch.id; U.chatTitle = ch.t; U.msgs = ch.m ? ch.m.map(m => ({ ...m })) : [{ ...D.proactive }]; } }

  // Presets: view=learning (what Brain has been taught), act=post (one-shot from Headlines: ask for the post, then drop the trigger).
  const st = { view: params.get('view') === 'learning' ? 'learning' : 'chat' };
  const trigger = params.get('act');
  if (trigger && !Nav.exported) { const u = new URL(location.href); u.searchParams.delete('act'); window.history.replaceState(null, '', u); params.delete('act'); }
  if (params.get('taught') === '1') DS.S().taught = [...(DS.S().taught || []), D.okaforLesson];
  const learning = () => ui.learning();
  const history = () => U.histHidden ? '' : `<aside class="ds-history" aria-label="Chat history">${DS.chatHistory()}</aside>`;
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
      return `<div class="ds-brainpage">${history()}<div class="ds-brainpage__main"><div class="ds-brainpage__tabs">${ui.chatsBtn()}${ui.stateTabs([['chat', 'Chat'], ['learning', 'Learning Mode']], st.view, 'brain-view', 'Brain')}<span class="ds-grow"></span>${has && st.view === 'chat' ? `<span class="ds-meta ds-ellipsis" style="max-width:20rem">${esc(U.chatTitle || 'New chat')}</span>` : ''}</div>${st.view === 'learning' ? learning() : has ? convo() : empty()}</div></div>`;
    },
    overlays: () => ui.chatDrawer(),
    after: () => { if (trigger === 'post' && !st.fired) { st.fired = true; DS.V.draft = ''; U.msgs = []; U.chatId = null; U.chatTitle = null; const h = D.headlines.find(x => x.id === params.get('story')) || D.headlines[0]; DS.sendText('Turn this headline into a LinkedIn post for ' + h.audience); } if (DS.V.focusPage) { DS.V.focusPage = false; const el = document.getElementById('brain-page-input'); if (el) el.focus(); } },
    acts: {
      noop: () => {},
      'brain-view': (el, k) => { st.view = k; DS.render(); },
      'try-teach': () => { st.view = 'chat'; U.msgs = []; U.chatId = null; U.chatTitle = null; DS.save(); DS.sendText('Why now for Grace Okafor?'); },
      'open-chat': (el, cid) => { st.view = 'chat'; const ch = D.chats.find(x => x.id === cid); U.chatId = cid; U.chatTitle = ch.t; U.msgs = ch.m ? ch.m.map(m => ({ ...m })) : [{ ...D.proactive }]; DS.V.thinking = false; DS.V.stream = null; DS.V.chats = false; DS.save(); DS.V.scrollChat = true; DS.render(); },
      'new-chat': () => { st.view = 'chat'; U.msgs = []; U.chatId = null; U.chatTitle = null; DS.V.draft = ''; DS.V.chats = false; DS.save(); DS.V.focusPage = true; DS.render(); },
    },
  });
})();
