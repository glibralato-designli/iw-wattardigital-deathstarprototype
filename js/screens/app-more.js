/* App 08 More: the account, the rest of the Dashboard (calendar, activity, reports), Headlines and BOV & OM, channels not in this proposal, and settings. */
(() => {
  const { D, ui, esc, icon, href } = DS;
  const row = (ic, t, sub, page) => page
    ? `<a class="ds-arow" data-lead href="${href(page)}"><span class="ds-arow__lead">${icon(ic)}</span><span class="ds-arow__body"><span class="ds-arow__title">${esc(t)}</span>${sub ? `<span class="ds-arow__sub">${esc(sub)}</span>` : ''}</span><span class="ds-arow__end">${icon('caret-right')}</span></a>`
    : `<span class="ds-arow" data-lead role="link" tabindex="0" aria-disabled="true" data-tip="${DS.OFF}"><span class="ds-arow__lead" data-tone="plain" style="color:var(--fg-disabled)">${icon(ic)}</span><span class="ds-arow__body"><span class="ds-arow__title" style="color:var(--fg-disabled)">${esc(t)}</span>${sub ? `<span class="ds-arow__sub">${esc(sub)}</span>` : ''}</span></span>`;
  const group = (title, rows) => `<section class="ds-asec" aria-label="${esc(title)}"><div class="ds-ahead"><h2>${esc(title)}</h2></div><div class="ds-alist">${rows.join('')}</div></section>`;
  const theme = () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';

  DS.define({
    id: 'more', nav: 'more', tab: 'more',
    head: () => ({ title: 'More', large: true }),
    scope: () => 'More',
    render: () => `<div class="ds-apage">${ui.large('More')}
      <div class="ds-alist"><div class="ds-arow" data-lead><span class="ds-arow__lead" style="border-radius:var(--radius-full)">TW</span><span class="ds-arow__body"><span class="ds-arow__title">Thomas Windels</span><span class="ds-arow__sub">Stewart Group · Main Body Manhattan</span></span></div></div>
      ${group('Dashboard', [row('calendar-blank', 'Calendar', '5 events today', 'calendar'), row('chat-text', 'Activity', '9 conversations this week · 2 proposals', 'conversations')])}
      ${group('Reports', [row('squares-four', 'Overview', 'The pulse, Up next and meetings', 'home'), row('chart-pie-slice', 'Who to call', 'Coverage by ZIP and who engaged', 'reporting'), row('chart-bar', 'Performance', 'Calls, emails, texts and conversations', 'outreach-performance'), row('buildings', 'Listings', 'Views, tours and offers per listing', 'listings'), row('globe', 'Website', 'Visitors, inquiries and known contacts', 'web-analytics')])}
      ${group('Intelligence', [row('newspaper', 'Headlines', 'Stories tagged by the owners they matter to', 'headlines'), row('file-text', 'BOV & OM', 'Next phase · drawn', 'bov')])}
      ${group('Channels', [['Phone', 'phone', 'Dialer · Recordings'], ['Email', 'envelope-simple', 'Inbox · Sequences'], ['Texting', 'chat-text', 'Threads · Templates'], ['LinkedIn', 'linkedin-logo', 'Posts · Connections'], ['Map', 'map-trifold', 'Prospects by ZIP']].map(([t, ic, s]) => row(ic, t, 'Later: ' + s)))}
      <section class="ds-asec" aria-label="Settings"><div class="ds-ahead"><h2>Settings</h2></div><div class="ds-alist">
        <a class="ds-arow" data-lead href="${href('changes')}"><span class="ds-arow__lead">${icon('clock-counter-clockwise')}</span><span class="ds-arow__body"><span class="ds-arow__title">Changes</span><span class="ds-arow__sub">What changed, with Restore</span></span>${icon('caret-right')}</a>
        <div class="ds-arow" data-lead><span class="ds-arow__lead">${icon(theme() === 'dark' ? 'moon' : 'sun')}</span><span class="ds-arow__body"><span class="ds-arow__title">Appearance</span></span><div class="segmented" role="radiogroup" aria-label="Appearance">${[['light', 'Light'], ['dark', 'Dark']].map(([k, l]) => `<button type="button" class="segmented__item" role="radio" aria-checked="${theme() === k}" data-act="theme" data-arg="${k}">${l}</button>`).join('')}</div></div>
        <button type="button" class="ds-arow" data-lead data-act="reset"><span class="ds-arow__lead">${icon('arrow-clockwise')}</span><span class="ds-arow__body"><span class="ds-arow__title">Reset prototype data</span><span class="ds-arow__sub">Calls, notes and to-dos go back to the demo start</span></span></button>
        ${row('sign-out', 'Sign out', '', null)}</div></section>
      <p class="ds-meta" style="text-align:center">Death Star · prototype with demo data</p></div>`,
  });
})();
