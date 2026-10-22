/* 14 More › Headlines (read-only): stories tagged by the owners they matter to. Each story turns into a list or a post
   (Brain's headline-to-post flow: story, audience, draft, approve). Saving and sharing stories are not in this proposal. */
(() => {
  const { D, ui, esc, icon, href } = DS;
  const card = (h, i) => {
    const items = DS.crit.parse(h.crit), n = DS.crit.count(items);
    return `<article class="ds-card ds-story" data-pad="lg" aria-labelledby="hl-${h.id}">
      <div class="ds-toolbar" style="gap:var(--space-2)"><span class="ds-chip">${esc(h.tag)}</span><span class="ds-meta">${esc(h.src)} · ${esc(h.when)}</span><span class="ds-grow"></span>${ui.iconBtn({ ic: 'push-pin', aria: 'Save story', disabled: true })}${ui.iconBtn({ ic: 'arrow-square-out', aria: 'Open the source', disabled: true })}</div>
      <h2 id="hl-${h.id}">${esc(h.t)}</h2><p style="max-width:46rem;text-wrap:pretty;color:var(--fg-secondary)">${esc(h.sum)}</p>
      <div class="ds-story__rel">${icon('users')}<span><b class="num">Relevant to ${DS.loc(n)} owners</b> in your lists · ${esc(h.audience)}</span><span class="ds-grow"></span>${items.map(it => ui.critChip(it, { static: true })).join('')}</div>
      <div class="ds-toolbar">${ui.btn({ label: 'Draft a post', ic: 'linkedin-logo', variant: i ? 'outline' : null, link: href('brain', 'act=post&story=' + h.id) })}${ui.toList(h.crit, { q: 'from=headlines', size: 'md' })}</div>
    </article>`;
  };
  DS.define({
    id: 'headlines', nav: 'more', brain: 'min',
    crumbs: () => [{ l: 'More', page: 'headlines' }, { l: 'Headlines' }],
    scope: () => 'Headlines',
    render: () => `<div class="ds-page">${ui.pageHead('Headlines', ui.tabs([['headlines', 'Headlines'], [null, 'Market Data']], 'headlines', 'Headlines'))}${ui.nudge('The rent freeze matters to rent-stabilized owners in your LES lists. Draft a post for them before Tuesday’s LinkedIn slot.')}
      <div class="ds-toolbar"><span class="ds-meta">${D.headlines.length} stories this week · Read-only in this proposal. Brain tags each story with the owners it matters to.</span><span class="ds-grow"></span><button type="button" class="ds-datepick__btn" aria-disabled="true" data-tip="${DS.OFF}">${icon('calendar-blank')}<span>This week</span>${icon('caret-down')}</button></div>
      <div class="ds-stack" data-gap="4" style="gap:var(--space-4)">${D.headlines.map(card).join('')}</div></div>`,
  });
})();
