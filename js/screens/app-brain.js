/* App 04 Brain: a tab. The empty state with suggestions, a conversation with sourced answers, and chat history in a left drawer. */
(() => {
  const { D, ui, esc, icon, params } = DS;
  const U = DS.U();
  const st = {};
  // Presets: ask=why|list|lookup|first, stage=thinking|streaming, approved=1, chat=<history id>, new=1, chats=open.
  if (params.get('new') === '1') { U.msgs = []; U.chatTitle = null; U.chatId = null; }
  const chatId = params.get('chat');
  if (chatId) { const ch = D.chats.find(x => x.id === chatId); if (ch) { U.chatId = ch.id; U.chatTitle = ch.t; U.msgs = ch.m ? ch.m.map(m => ({ ...m })) : [{ ...D.proactive }]; } }
  const has = () => (U.msgs || []).length > 0 || DS.V.thinking;

  const head = () => ({ title: has() ? (U.chatTitle || 'Brain') : 'Brain', large: !has(), lead: ui.chatsBtn(), actions: ui.iconBtn({ ic: 'note-pencil', aria: 'New chat', act: 'new-chat' }) });

  const chips = [['Why now for…', 'Daniel Marchetti, or any owner', 'sparkle', 'Why now for Daniel Marchetti?'], ['Build a list of…', 'LES owners with debt due this year', 'list-bullets', '/list LES owners with debt due before year end'], ['Look up a property…', '118 Ludlow St, or a BBL', 'buildings', 'Look up 118 Ludlow St'], ['Who should I call first?', 'Today’s Attack Plan', 'phone', 'Who should I call first today?']];
  const empty = () => `<div class="ds-apage">${ui.large('What do you need, Thomas?', 'Brain')}<p class="ds-alede" style="margin-top:calc(var(--space-4) * -1)">Ask about an owner, a building or a list. Answers cite their sources.</p>
    <div class="ds-alist">${chips.map(([t, s, ic, q]) => `<button type="button" class="ds-arow" data-lead data-act="ask" data-arg="${esc(q)}"><span class="ds-arow__lead">${icon(ic)}</span><span class="ds-arow__body"><span class="ds-arow__title">${esc(t)}</span><span class="ds-arow__sub">${esc(s)}</span></span><span class="ds-arow__end">${icon('arrow-up-right')}</span></button>`).join('')}</div></div>`;
  const convo = () => `<h1 class="sr-only">Brain · ${esc(U.chatTitle || 'New chat')}</h1><div class="ds-chat" data-page aria-live="polite" id="page-chat" data-keep-scroll="page-chat" style="padding:var(--space-2) var(--space-4) var(--space-4)"><div class="ds-chat__inner" id="page-chat-inner">${DS.chatHTML(true)}</div></div>`;
  const foot = () => `<div class="ds-abrain-foot">${DS.composer(true, { ph: has() ? 'Reply to Brain' : 'Ask about a contact, property or list' })}<p class="ds-meta ds-disclaimer">Brain can be wrong. Check trust badges before you say it out loud.</p></div>`;

  DS.define({
    id: 'brain', nav: 'brain', tab: 'brain',
    head, scope: () => 'Brain',
    init: () => { const k = params.get('ask'); if (k) DS.seedChat(k, params.get('stage')); },
    render: () => `<div class="ds-abrain">${has() ? convo() : empty()}</div>${foot()}`,
    overlays: () => ui.chatDrawer(),
    // Follow the conversation: scroll to the newest message when one arrives, not on every render.
    after: () => { const n = (U.msgs || []).length + (DS.V.thinking ? 1 : 0); if (n !== st.n) { st.n = n; const main = document.getElementById('ds-main'); if (main && has()) main.scrollTop = main.scrollHeight; } },
    acts: {
      'open-chat': (el, cid) => { const ch = D.chats.find(x => x.id === cid); U.chatId = cid; U.chatTitle = ch.t; U.msgs = ch.m ? ch.m.map(m => ({ ...m })) : [{ ...D.proactive }]; DS.V.thinking = false; DS.V.stream = null; DS.V.chats = false; DS.save(); DS.render(); },
      'new-chat': () => { U.msgs = []; U.chatId = null; U.chatTitle = null; DS.V.draft = ''; DS.V.thinking = false; DS.V.stream = null; DS.V.chats = false; DS.save(); DS.render(); const el = document.getElementById('brain-page-input'); if (el) el.focus(); },
    },
  });
})();
