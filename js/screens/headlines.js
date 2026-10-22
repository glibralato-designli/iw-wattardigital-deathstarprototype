/* 14 More › Headlines: a news feed read like a tabloid front page. Search, a date range (today to six months), topics,
   sources, "Relevant to my lists" and sort; a lead story, a grid of stories and a rail with Brain's take and what matters most.
   Every story is tagged by the owners it matters to, and turns into a list or a post (Brain's headline-to-post flow).
   Read-only: saving stories, opening sources and Market Data are not in this proposal. */
(() => {
  const { D, ui, esc, icon, href, params } = DS;
  const RANGES = [['today', 'Today', 24], ['week', 'This week', 168], ['month', 'This month', 720], ['3m', '3 months', 2160], ['6m', '6 months', 4320]];
  const TOPICS = [...new Set(D.headlines.map(h => h.tag))], SOURCES = [...new Set(D.headlines.map(h => h.src))];
  /* Presets: q=<search>, range=today|week|month|3m|6m, topic=<topic>, src=<source>, relevant=1, sort=relevant. */
  const st = { q: params.get('q') || '', range: RANGES.some(r => r[0] === params.get('range')) ? params.get('range') : 'week', topic: TOPICS.includes(params.get('topic')) ? params.get('topic') : 'All', src: SOURCES.includes(params.get('src')) ? params.get('src') : 'All', relevant: params.get('relevant') === '1', sort: params.get('sort') === 'relevant' ? 'relevant' : 'new' };
  const reach = h => DS.crit.count(DS.crit.parse(h.crit));
  // Relevant to my lists: the story touches at least one Class A or B owner in the territory.
  const relevant = h => DS.crit.rows(DS.crit.parse(h.crit + ';terr:1')).some(c => c.cls === 'A' || c.cls === 'B');
  const inRange = h => h.hours <= RANGES.find(r => r[0] === st.range)[2];
  const base = () => D.headlines.filter(h => inRange(h) && (!st.q.trim() || (h.t + ' ' + h.sum + ' ' + h.src + ' ' + h.tag).toLowerCase().includes(st.q.trim().toLowerCase())) && (st.src === 'All' || h.src === st.src) && (!st.relevant || relevant(h)));
  const shown = () => base().filter(h => st.topic === 'All' || h.tag === st.topic).sort((a, b) => st.sort === 'relevant' ? reach(b) - reach(a) : a.hours - b.hours);
  const art = (h, stories) => `<span class="ds-news__art" aria-hidden="true">${DS.streetArt({ id: 'hl-' + h.id, label: h.t, stories, units: 12 + (h.id.length * 3) % 20, shops: h.tag === 'Sales' })}</span>`;
  const meta = h => `<span class="ds-news__meta"><span class="ds-news__tag">${esc(h.tag)}</span><span>${esc(h.src)} · ${esc(DS.ago(h.hours))}</span></span>`;
  const rel = h => `<span class="ds-news__rel">${icon('users')}<b class="num">${DS.loc(reach(h))}</b> owners in your lists · ${esc(h.audience)}</span>`;
  const acts = (h, big) => `<span class="ds-news__acts">${ui.btn({ label: 'Draft a post', ic: 'linkedin-logo', variant: big ? null : 'outline', size: big ? 'md' : 'sm', link: href('brain', 'act=post&story=' + h.id) })}${big ? ui.toList(h.crit, { q: 'from=headlines', size: 'md' }) : ui.toList(h.crit, { icon: true, q: 'from=headlines', aria: 'Turn “' + h.audience + '” into a list' })}</span>`;
  const lead = h => `<article class="ds-news ds-news--lead" aria-labelledby="hl-${h.id}">${art(h, 6)}<div class="ds-news__body">${meta(h)}<h2 id="hl-${h.id}">${esc(h.t)}</h2><p>${esc(h.sum)}</p>${rel(h)}${acts(h, true)}</div></article>`;
  const card = h => `<article class="ds-news" aria-labelledby="hl-${h.id}">${art(h, 4 + (h.hours % 3))}<div class="ds-news__body">${meta(h)}<h3 id="hl-${h.id}">${esc(h.t)}</h3><p>${esc(h.sum)}</p>${rel(h)}${acts(h)}</div></article>`;
  const toolbar = () => `<div class="ds-newsbar">
      <label class="ds-input-icon ds-newsbar__search">${icon('magnifying-glass')}<input id="hl-q" aria-label="Search headlines" placeholder="Search headlines, sources or topics" value="${esc(st.q)}" data-input="q" autocomplete="off"></label>
      ${ui.segmented(RANGES.map(([k, l]) => [k, l]), st.range, 'range', 'Date range', 'sm')}
      <span class="select ds-newsbar__src"><select class="field__control" data-size="sm" aria-label="Source" data-change="src"><option value="All">All sources</option>${SOURCES.map(x => `<option${x === st.src ? ' selected' : ''}>${esc(x)}</option>`).join('')}</select></span>
      <span class="select ds-newsbar__sort"><select class="field__control" data-size="sm" aria-label="Sort" data-change="sort"><option value="new"${st.sort === 'new' ? ' selected' : ''}>Newest first</option><option value="relevant"${st.sort === 'relevant' ? ' selected' : ''}>Most relevant to my lists</option></select></span>
      <button type="button" class="ds-switch-btn" role="switch" aria-checked="${st.relevant}" data-act="relevant" data-tip="Stories that touch Class A or B owners in your territory"><span class="ds-switch-btn__track" data-flip="rel-t"><span data-flip="rel-k"></span></span>Relevant to my lists</button></div>
    <div class="ds-newstopics" role="group" aria-label="Topics">${['All', ...TOPICS].map(t => { const n = t === 'All' ? base().length : base().filter(h => h.tag === t).length; return !n && t !== 'All' && st.topic !== t ? '' : `<button type="button" class="ds-pill-btn" aria-pressed="${st.topic === t}" data-act="topic" data-arg="${esc(t)}">${esc(t)}<span class="ds-newstopics__n">${n}</span></button>`; }).join('')}</div>`;
  const rail = list => { const top = list.slice().sort((a, b) => reach(b) - reach(a)).slice(0, 4), rangeL = RANGES.find(r => r[0] === st.range)[1].toLowerCase();
    return `<aside class="ds-stack" aria-label="Headlines sidebar" style="gap:var(--space-4)">
      <section class="ds-bsugg" aria-label="Brain’s take"><div class="ds-bsugg__head" style="cursor:default"><span class="ds-bot-av">${icon('sparkle')}</span><span class="ds-row__body"><b>Brain’s take</b><span class="ds-meta">Market summary · ${esc(rangeL)}</span></span></div><div class="ds-bsugg__body"><p class="ds-news__take">Lenders are tightening on stabilized walk-ups while free-market buildings trade again. Lead with refinance math for owners with 2026–27 maturities, and with comps for free-market owners.</p></div></section>
      ${top.length ? `<section class="ds-card" data-pad="all" aria-label="Most relevant to your owners"><div class="ds-card__head"><h2 class="ds-grow">Most relevant to your owners</h2></div><ol class="ds-newsrank">${top.map((h, i) => `<li><span class="ds-newsrank__i num">${i + 1}</span><span class="ds-row__body"><a href="#hl-${h.id}" class="ds-newsrank__t">${esc(h.t)}</a><span class="ds-row__sub">${DS.loc(reach(h))} owners · ${esc(h.tag)}</span></span></li>`).join('')}</ol></section>` : ''}
      <section class="ds-card" data-pad="all" aria-label="Topics in range"><div class="ds-card__head"><h2 class="ds-grow">Topics</h2><span class="ds-meta">${esc(rangeL)}</span></div>${ui.hbars(TOPICS.map(t => [t, base().filter(h => h.tag === t).length]).filter(r => r[1]).sort((a, b) => b[1] - a[1]), { tone: 'accent', fmt: v => v + (v === 1 ? ' story' : ' stories') })}</section></aside>`; };
  const feed = () => { const list = shown();
    if (!list.length) return `<div class="ds-card" data-pad="lg">${ui.empty({ ic: 'newspaper', title: 'No headlines match', text: 'Try a wider date range, another topic, or clear the search.', action: ui.btn({ label: 'Clear filters', variant: 'outline', act: 'clear' }) })}</div>`;
    return `${lead(list[0])}${list.length > 1 ? `<div class="ds-newsgrid">${list.slice(1).map(card).join('')}</div>` : ''}<p class="ds-meta" style="text-align:center">${list.length} ${list.length === 1 ? 'story' : 'stories'} · refreshes every 15 minutes</p>`; };
  DS.define({
    id: 'headlines', nav: 'more', brain: 'min',
    crumbs: () => [{ l: 'More', page: 'headlines' }, { l: 'Headlines' }],
    scope: () => 'Headlines',
    render: () => `<div class="ds-page">${ui.pageHead('Headlines', ui.tabs([['headlines', 'Headlines'], [null, 'Market Data']], 'headlines', 'Headlines'))}${ui.nudge('The rent freeze matters to rent-stabilized owners in your LES lists. Draft a post for them before Tuesday’s LinkedIn slot.')}
      ${toolbar()}<div class="ds-split ds-newslayout"><div class="ds-stack" data-gap="4" style="gap:var(--space-4)" data-anim="fade" data-key="feed-${st.range}-${st.topic}-${st.src}-${st.relevant}-${st.sort}">${feed()}</div>${rail(shown())}</div></div>`,
    acts: {
      range: (el, k) => { st.range = k; DS.render(); },
      topic: (el, t) => { st.topic = t; DS.render(); },
      relevant: () => { st.relevant = !st.relevant; DS.render(); },
      clear: () => { Object.assign(st, { q: '', range: '6m', topic: 'All', src: 'All', relevant: false }); DS.render(); },
    },
    inputs: { q: v => { st.q = v; DS.render(); }, src: v => { st.src = v; DS.render(); }, sort: v => { st.sort = v; DS.render(); } },
  });
})();
