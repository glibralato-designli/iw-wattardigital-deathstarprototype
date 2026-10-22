/* 15 More › BOV & OM (next phase, drawn): a BOV for a building, its inputs pre-filled from the property record, comps with
   trust badges and a price range. Generate deck, editing and the OM are not in this proposal. */
(() => {
  const { D, ui, esc, icon, href, params, loc } = DS;
  const p = D.pById[params.get('id')] || D.pById.p118, c = D.cById[p.owner], f = D.propFacts(p);
  const money = n => '$' + loc(Math.round(n)), short = n => n >= 1e6 ? '$' + (Math.round(n / 1e5) / 10) + 'M' : '$' + Math.round(n / 1e3) + 'K';
  const rent = p.fm * 3400 * 12 + p.rs * 1450 * 12, opex = rent * 0.36, noi = rent - opex;
  const psf = D.comps.map(x => x[3]).sort((a, b) => a - b), mid = psf[Math.floor(psf.length / 2)];
  const range = [['Low', psf[0]], ['Likely', mid], ['High', psf[psf.length - 1]]].map(([l, v]) => ({ l, v, price: v * p.sf }));
  const field = (l, v, src, id) => `<div class="field"><label class="field__label" for="bov-${id}">${esc(l)}</label><input id="bov-${id}" class="field__control" value="${esc(v)}" readonly aria-readonly="true"><span class="ds-bovsrc">${esc(src)}</span></div>`;
  DS.define({
    id: 'bov', nav: 'more', brain: 'min',
    head: () => ({ title: 'BOV & OM', large: true, back: ['More', 'more'] }),
    crumbs: () => [{ l: 'More', page: 'headlines' }, { l: 'BOV & OM' }],
    scope: () => 'BOV · ' + p.addr,
    render: () => `<div class="ds-page">${ui.pageHead('BOV & OM', ui.tabs([['bov', 'BOV'], [null, 'OM']], 'bov', 'BOV and OM'))}
      <div class="alert" data-status="info" role="note">${icon('info')}<span class="ds-grow"><b>Next phase.</b> This screen is drawn to show the shape of the BOV generator. Generate deck, editing cells and the OM are not in this proposal yet.</span><span class="badge" data-status="info">Next phase</span></div>
      <div class="ds-nextphase"><div class="ds-row__body ds-grow"><h2 class="ds-title-xl">BOV for <a href="${href('property', 'id=' + p.id)}">${esc(p.addr)}</a></h2><span class="ds-meta">${esc(c.name)} · ${esc(c.entity)} · ${esc(p.hood)} · BBL ${esc(p.bbl)}</span></div>${ui.btn({ label: 'Export to Excel', ic: 'file-text', variant: 'outline', disabled: true })}${ui.btn({ label: 'Generate deck', ic: 'sparkle', disabled: true })}</div>
      <section class="ds-stack" data-section aria-label="Inputs"><div class="ds-section-h"><h2>Inputs</h2><span class="ds-meta">Pre-filled from the property record. Every cell will stay editable with its formula.</span></div>
        <div class="ds-card" data-pad="lg"><div class="ds-bovgrid">${field('Units', String(p.units), 'DOF · Tier A', 'units')}${field('Free market / stabilized', p.fm + ' / ' + p.rs, 'DOF · rent roll', 'mix')}${field('Gross SF', loc(p.sf), 'DOF · Tier A', 'sf')}${field('Year built', String(p.built), 'DOB', 'built')}
          ${field('Gross rent (est.)', money(rent), 'FM $3,400 and RS $1,450 a month', 'rent')}${field('Operating expenses', money(opex), '36% of gross rent', 'opex')}${field('Net operating income', money(noi), 'Rent less expenses', 'noi')}${field('Debt', p.debt === 'Not on record' ? 'None on record' : p.debt + ' due ' + p.mat, f.lender, 'debt')}</div></div></section>
      <section class="ds-stack" data-section aria-label="Comps"><div class="ds-section-h"><h2>Comps</h2><span class="ds-meta">Walk-up sales within half a mile, last 12 months. Trust shows how sure each sale is.</span></div>
        <div class="ds-card" data-pad="lg"><div class="ds-dtable-wrap"><table class="ds-dtable" aria-label="Comps"><thead><tr><th scope="col">Address</th><th scope="col">Sold</th><th scope="col" data-n>Units</th><th scope="col" data-n>$/SF</th><th scope="col" data-n>$/unit</th><th scope="col" data-n>Cap rate</th><th scope="col">Trust</th></tr></thead><tbody>${D.comps.map(([a, d, u, ps, pu, cap, t]) => `<tr><td><b>${esc(a)}</b></td><td>${esc(d)}</td><td data-n>${u}</td><td data-n>$${ps}</td><td data-n>${money(pu)}</td><td data-n>${cap}</td><td>${ui.trust(t)}</td></tr>`).join('')}</tbody></table></div></div></section>
      <section class="ds-stack" data-section aria-label="Price range"><div class="ds-section-h"><h2>Price range</h2><span class="ds-meta">From the comps’ $/SF on ${loc(p.sf)} SF</span></div>
        <div class="ds-range">${range.map((r, i) => `<div class="ds-stat"${i === 1 ? ' data-emph' : ''}><span class="ds-stat__label"><span class="ds-grow">${r.l}</span></span><span class="ds-stat__value"><b>${short(r.price)}</b></span><span class="ds-stat__cmp"><span><span class="ds-meta">$/SF</span><span class="ds-stat__cmpv">$${r.v}</span></span><span><span class="ds-meta">Per unit</span><span class="ds-stat__cmpv">${short(r.price / p.units)}</span></span><span><span class="ds-meta">Cap rate</span><span class="ds-stat__cmpv">${(noi / r.price * 100).toFixed(1)}%</span></span></span></div>`).join('')}</div></section></div>`,
  });
})();
