/* Shared review navigation. Never import into product pages. */
(() => {
  const page=document.body.dataset.review;
  if(!['player','canvas','system'].includes(page))return;
  const root=document.createElement('div');root.className='review-menu';
  const icon=name=>`<svg class="icon ph-icon" aria-hidden="true" focusable="false" viewBox="0 0 256 256">${window.PHOSPHOR[name+'-regular']}</svg>`;
  const restartIcon=icon('arrow-counter-clockwise');
  const paintIcon=icon('paint-brush');
  const backIcon=icon('arrow-left');
  root.innerHTML=`
    <button class="button button--icon review-menu__trigger" type="button" popovertarget="review-navigation" aria-label="Open review menu" aria-controls="review-navigation" aria-expanded="false" title="Review menu">
      ${icon('list')}
    </button>
    <div class="review-menu__panel" id="review-navigation" popover="auto" aria-label="Review navigation">
      <fieldset class="review__theme">
        <legend class="sr-only">Color theme</legend>
        <label><input class="sr-only" type="radio" name="review-theme" value="light" data-theme-choice><span>Light</span></label>
        <label><input class="sr-only" type="radio" name="review-theme" value="dark" data-theme-choice><span>Dark</span></label>
      </fieldset>
      ${page==='player'?`<button class="review-menu__item" type="button" data-restart>${restartIcon}Restart prototype</button>`:''}
      <nav class="review-menu__links" aria-label="Review views">
        <a class="review-menu__item" href="system.html" data-review-destination="system" ${page==='system'?'aria-current="page"':''}>${paintIcon}Design system</a>
      </nav>
      <div class="review-menu__settings">
      <nav class="review-menu__views" aria-label="Review view">
        <a href="screens.html" data-review-destination="canvas" ${page==='canvas'?'aria-current="page"':''}>Canvas</a>
        <a href="prototype.html" data-review-destination="player" ${page==='player'?'aria-current="page"':''}>Prototype</a>
      </nav>
      ${page==='player'?'<label for="review-screen">Screen</label><div class="select"><select class="field__control" id="review-screen" data-screen-select></select></div>':''}
      ${page==='canvas'?`
        <div data-viewport-setting><label for="review-viewport">Viewports</label><div class="select"><select class="field__control" id="review-viewport" data-viewport-filter><option value="all">Side by side</option><option value="desktop">Desktop</option><option value="mobile">Mobile</option><option value="tablet">Tablet</option></select></div></div>
        <label for="review-scale">Scale</label><div class="select"><select class="field__control" id="review-scale" data-scale><option value="0.5">50%</option><option value="0.75">75%</option><option value="1">100%</option></select></div>
      `:''}
      </div>
      <hr class="review-menu__divider">
        <a class="review-menu__item" href="index.html" data-review-destination="hub">${backIcon}Back to home</a>
    </div>`;
  document.body.prepend(root);
  const trigger=root.querySelector('button'),panel=root.querySelector('[popover]');
  panel.addEventListener('beforetoggle',event=>trigger.setAttribute('aria-expanded',String(event.newState==='open')));
  panel.addEventListener('toggle',()=>{if(panel.matches(':popover-open'))panel.querySelector('[data-theme-choice]:checked')?.focus();});
  panel.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();panel.hidePopover();trigger.focus();}});
  panel.addEventListener('click',event=>{if(event.target.closest('[data-restart],a')){panel.hidePopover();trigger.focus();}});
})();
