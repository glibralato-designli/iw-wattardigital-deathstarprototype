/* Small accessible behaviors, shared by products and the system showcase. */
(() => {
  document.querySelectorAll('[data-indeterminate]').forEach(input => input.indeterminate = true);
  document.querySelectorAll('.tabs').forEach(root => {
    const tabs = [...root.querySelectorAll(':scope > .tabs__list > [role="tab"]')];
    const select = tab => tabs.forEach(item => {
      const active = item === tab;
      item.setAttribute('aria-selected', String(active)); item.tabIndex = active ? 0 : -1;
      document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
    });
    tabs.forEach(tab => {
      tab.addEventListener('click', () => select(tab));
      tab.addEventListener('keydown', event => {
        const enabled = tabs.filter(t => !t.disabled); let index = enabled.indexOf(tab);
        const next = {'ArrowRight':1, 'ArrowLeft':-1}[event.key];
        if (next) index = (index + next + enabled.length) % enabled.length;
        else if(event.key === 'Home') index = 0;
        else if(event.key === 'End') index = enabled.length - 1;
        else return;
        event.preventDefault(); select(enabled[index]); enabled[index].focus();
      });
    });
  });
  document.querySelectorAll('dialog').forEach(dialog => dialog.addEventListener('keydown', event => {
    if(event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]')].filter(el => el.getClientRects().length);
    const first=controls[0], last=controls[controls.length-1];
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last?.focus();}
    else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first?.focus();}
  }));
  document.querySelectorAll('[data-dialog-open]').forEach(trigger => trigger.addEventListener('click', () => {
    const dialog = document.getElementById(trigger.dataset.dialogOpen);
    if (dialog && !dialog.open) {
      const parentMenu = trigger.closest('.menu');
      const returnTarget = parentMenu ? document.querySelector('[data-menu="'+parentMenu.id+'"]') : trigger;
      dialog.addEventListener('close', () => returnTarget?.focus(), {once:true});
      dialog.showModal();
    }
  }));
  document.querySelectorAll('[data-dialog-close]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
  document.querySelectorAll('.search').forEach(root => {
    const input = root.querySelector('input'), clear = root.querySelector('[data-search-clear]');
    if(!clear) return;
    const update = () => clear.hidden = !input.value;
    input.addEventListener('input', update);
    clear.addEventListener('click', () => { input.value='';input.dispatchEvent(new Event('input',{bubbles:true}));input.focus(); }); update();
  });
  document.querySelectorAll('[data-menu]').forEach(trigger => {
    const menu = document.getElementById(trigger.dataset.menu);
    const items = () => [...menu.querySelectorAll('[role="menuitem"]')].filter(i => !i.disabled);
    const open = () => {
      menu.showPopover(); trigger.setAttribute('aria-expanded','true');
      const r = trigger.getBoundingClientRect();
      menu.style.left = Math.max(8, Math.min(r.left,innerWidth-menu.offsetWidth-8))+'px';
      menu.style.top = (r.bottom+menu.offsetHeight+8>innerHeight ? Math.max(8,r.top-menu.offsetHeight-4) : r.bottom+4)+'px';
      items()[0]?.focus();
    };
    const close = () => { menu.hidePopover();trigger.setAttribute('aria-expanded','false');trigger.focus(); };
    trigger.addEventListener('click', () => menu.matches(':popover-open') ? close() : open());
    trigger.addEventListener('keydown', event => { if(event.key==='ArrowDown'){event.preventDefault();open();} });
    menu.addEventListener('beforetoggle', event => trigger.setAttribute('aria-expanded', String(event.newState === 'open')));
    menu.addEventListener('toggle', () => trigger.setAttribute('aria-expanded',String(menu.matches(':popover-open'))));
    menu.addEventListener('keydown', event => {
      const list=items();let index=list.indexOf(document.activeElement);
      if(event.key==='Escape'){event.preventDefault();close();return;}
      if(event.key==='Tab'){menu.hidePopover();trigger.focus();return;}
      if(event.key==='ArrowDown') index=(index+1)%list.length;
      else if(event.key==='ArrowUp') index=(index-1+list.length)%list.length;
      else if(event.key==='Home') index=0;
      else if(event.key==='End') index=list.length-1;
      else if(event.key.length===1 && /[a-z0-9]/i.test(event.key)) {
        const match=[...list.slice(index+1),...list.slice(0,index+1)].find(item=>item.textContent.trim().toLowerCase().startsWith(event.key.toLowerCase()));
        if(match){event.preventDefault();match.focus();}return;
      }
      else return;
      event.preventDefault();list[index]?.focus();
    });
    menu.addEventListener('click',event=>{if(event.target.closest('[role="menuitem"]'))close();});
    window.addEventListener('resize',()=>{if(menu.matches(':popover-open'))menu.hidePopover();});
    document.addEventListener('scroll',event=>{if(menu.matches(':popover-open') && !menu.contains(event.target))menu.hidePopover();},true);
  });
})();
