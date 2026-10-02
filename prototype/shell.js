/* Review-only orchestration. Never load in product pages. */
(() => {
  const project=window.PROJECT, params=new URLSearchParams(location.search);
  const requested=params.get('mode');
  const mode=Object.hasOwn(project.modes,requested)?requested:project.type;
  const config=project.modes[mode];
  const themeUrl=(path)=>{const next=new URL(path,location.href);next.searchParams.set('theme',document.documentElement.dataset.theme||'light');return next.href;};
  const modeUrl=(path,selectedMode)=>{const next=new URL(themeUrl(path));next.searchParams.set('mode',selectedMode);return next.href;};
  const url=(path)=>modeUrl(path,mode);
  const reviewUrl=(path)=>{
    const next=new URL(url(path)),current=new URLSearchParams(location.search);
    for(const key of ['screen','state','scale','view'])if(current.has(key))next.searchParams.set(key,current.get(key));
    return next.href;
  };
  const refreshReviewLinks=()=>document.querySelectorAll('[data-review-destination]').forEach(link=>link.href=reviewUrl(link.getAttribute('href')));
  const remember=(key,value)=>{const next=new URL(location.href);if(value)next.searchParams.set(key,value);else next.searchParams.delete(key);if(next.href!==location.href)history.replaceState(history.state,'',next);refreshReviewLinks();};
  const frameUrl=frame=>{try{return frame.contentWindow.location.href==='about:blank'?frame.src:frame.contentWindow.location.href;}catch(_){return frame.src;}};
  refreshReviewLinks();
  const projectName=typeof project.name==='string' && project.name.trim() ? project.name.trim() : 'Discovery Design Template';
  document.querySelectorAll('[data-project-name]').forEach(el=>el.textContent=projectName);
  if(document.body.dataset.review==='hub')document.title=projectName+' — Overview';
  document.querySelectorAll('[data-mode-label]').forEach(el=>el.textContent=config.label);
  document.querySelectorAll('[data-review-link]').forEach(el=>el.href=url(el.getAttribute('href')));
  document.querySelectorAll('[data-launch]').forEach(el=>el.href=reviewUrl('prototype.html'));
  document.querySelectorAll('[data-mode-select]').forEach(select=>{select.value=mode;select.addEventListener('change',()=>{const next=new URL(location.href);next.searchParams.set('mode',select.value);next.searchParams.delete('screen');location.href=next;});});
  document.querySelectorAll('[data-hub-label]').forEach(el=>{const target=project.modes[el.dataset.hubLabel];if(target)el.textContent=target.label;});
  document.querySelectorAll('[data-hub-mode]').forEach(link=>{
    const targetMode=link.dataset.hubMode, target=project.modes[targetMode];
    const enabled=!!target && (!Array.isArray(project.enabledModes) || project.enabledModes.includes(targetMode));
    if(!enabled){
      const card=link.closest('.hub__mode');
      card.classList.add('hub__mode--inactive');
      card.setAttribute('aria-disabled','true');
      link.removeAttribute('href');
      link.setAttribute('role','link');
      link.setAttribute('aria-disabled','true');
      link.setAttribute('tabindex','-1');
      link.addEventListener('click',event=>event.preventDefault());
      return;
    }
    link.href=link.dataset.hubView==='canvas'?modeUrl('screens.html',targetMode):modeUrl('prototype.html',targetMode);
  });
  const themeChoices=document.querySelectorAll('[data-theme-choice]');
  themeChoices.forEach(choice=>{
    choice.checked=choice.value===document.documentElement.dataset.theme;
    choice.addEventListener('change',()=>{
      if(!choice.checked)return;
      const theme=choice.value;
      document.documentElement.dataset.theme=theme;
      try{localStorage.setItem('design-project-theme',theme);}catch(_){}
      const next=new URL(location.href);next.searchParams.set('theme',theme);history.replaceState(null,'',next);
      // Preserve review state and each destination's mode while carrying the theme.
      document.querySelectorAll('a[href]').forEach(link=>{
        const target=new URL(link.href,location.href);
        if(target.origin===location.origin && target.pathname.endsWith('.html'))link.href=themeUrl(target.href);
      });
      document.querySelectorAll('iframe[src]').forEach(frame=>{frame.src=themeUrl(frameUrl(frame));});
    });
  });
  const hasScreens=config.screens.length>0;
  // Declared states (see config/project.js): a preset query applied to the screen's page.
  const statesOf=screen=>Object.entries(screen.states||{});
  const stateLabel=key=>key.replace(/^Custom-/,'').replace(/([a-z0-9])([A-Z])/g,'$1 $2');
  const statePath=(screen,key)=>{const preset=key?(screen.states||{})[key]:'';if(!preset)return screen.path;const next=new URL(screen.path,location.href);new URLSearchParams(preset).forEach((value,name)=>next.searchParams.set(name,value));return next.href;};
  const emptyState=()=>{
    const section=document.createElement('section');section.className='review-empty';
    const heading=document.createElement(document.body.dataset.review==='canvas'?'h2':'h1');heading.textContent='Your '+config.label.toLowerCase()+' starts here';
    const message=document.createElement('p');message.textContent='No screens yet. Your project screens will appear here as the concept takes shape.';
    section.append(heading,message);return section;
  };
  if(!hasScreens && ['player','canvas'].includes(document.body.dataset.review)){
    document.querySelectorAll('[data-restart], [data-screen-select], [data-scale], [data-viewport-filter]').forEach(control=>control.disabled=true);
    if(document.body.dataset.review==='player'){
      document.querySelector('.player__stage').replaceChildren(emptyState());
      document.title=config.label+' — Prototype';
      document.body.dataset.projectMode=mode;
    }
  }
  if(document.body.dataset.review==='player' && hasScreens){
    document.body.dataset.projectMode=mode;
    let screen=config.screens.find(s=>s.id===params.get('screen'))||config.screens.find(s=>s.path===config.entry)||config.screens[0];
    let state=statesOf(screen).some(([key])=>key===params.get('state'))?params.get('state'):'';
    const frame=document.querySelector('[data-player-frame]'),select=document.querySelector('[data-screen-select]');
    const framedViewport=matchMedia('(min-width:700px)');
    const setFrameName=()=>{
      frame.name=mode==='mobile' && framedViewport.matches?'device-framed':'';
      // Update the existing browsing context too; changing the attribute alone
      // does not update window.name in every browser.
      try{frame.contentWindow.name=frame.name;}catch(_){}
    };
    setFrameName();
    // Reapply product-safe insets when crossing the chrome breakpoint.
    framedViewport.addEventListener('change',()=>{
      if(mode!=='mobile')return;
      const current=frameUrl(frame);
      setFrameName();
      frame.src=current;
    });
    if(mode==='mobile'){
      document.documentElement.style.setProperty('--preview-width',config.primaryViewport.width+'px');
      document.documentElement.style.setProperty('--preview-height',config.primaryViewport.height+'px');
    }
    config.screens.forEach(s=>{
      const option=document.createElement('option');option.value=s.id;option.textContent=s.name;select.append(option);
      for(const [key] of statesOf(s)){const extra=document.createElement('option');extra.value=s.id+'~'+key;extra.textContent=s.name+' · '+stateLabel(key);select.append(extra);}
    });
    // Initial rendering and frame reloads must not signal a new review-page navigation.
    const markScreen=(persist=false)=>{
      const name=screen.name+(state?' · '+stateLabel(state):'');
      select.value=state?screen.id+'~'+state:screen.id;frame.title=name+' — product prototype';document.title=name+' — Prototype';
      if(persist){remember('screen',screen.id);remember('state',state);}
    };
    // Screens may switch in place (pushState) and announce it with a 'screenchange' event instead of a load.
    const follow=()=>{
      const path=new URL(frameUrl(frame)).pathname;
      const current=config.screens.find(s=>new URL(s.path,location.href).pathname===path);
      if(current && current.id!==screen.id){screen=current;state='';markScreen(true);}
    };
    frame.addEventListener('load',()=>{follow();try{frame.contentWindow.addEventListener('screenchange',follow);}catch(_){}});
    select.addEventListener('change',()=>{const [id,key='']=select.value.split('~');screen=config.screens.find(s=>s.id===id);state=key;markScreen(true);frame.src=themeUrl(statePath(screen,state));});
    document.querySelector('[data-restart]').addEventListener('click',()=>{screen=config.screens[0];state='';markScreen(true);frame.src=themeUrl(screen.path);});
    markScreen();frame.src=themeUrl(statePath(screen,state));
  }
  const canvas=document.querySelector('[data-canvas]');
  if(canvas){
    const title=mode==='mobile'?'Mobile app':'Web App';
    document.querySelector('[data-canvas-title]').textContent=title+' canvas';
    document.title=title+' — Canvas';
    const filter=document.querySelector('[data-viewport-filter]'),scale=document.querySelector('[data-scale]');
    document.querySelector('[data-viewport-setting]').hidden=mode==='mobile';
    scale.value=['0.5','0.75','1'].includes(params.get('scale'))?params.get('scale'):mode==='mobile'?'0.75':'0.5';
    filter.value=['all','desktop','mobile','tablet'].includes(params.get('view'))?params.get('view'):'all';
    const render=()=>{
      canvas.replaceChildren();canvas.dataset.mode=mode;
      if(!hasScreens){canvas.append(emptyState());return;}
      for(const screen of config.screens){
        const section=document.createElement('section');section.className='canvas__screen';
        const heading=document.createElement('h2');heading.textContent=screen.name;
        const description=document.createElement('p');description.textContent=screen.description;
        const row=document.createElement('div');row.className='canvas__row';section.append(heading,description,row);
        const views=mode==='mobile'?[['mobile',config.primaryViewport]]:Object.entries(config.viewports).filter(([key])=>filter.value==='all'?key!=='tablet':key===filter.value);
        for(const [key] of [['']].concat(statesOf(screen)))for(const [name,size] of views){
          const figure=document.createElement('figure');figure.className='canvas__frame';
          const stateText=key?stateLabel(key)+' · ':'';
          const caption=document.createElement('figcaption');const label=document.createElement('span');label.textContent=`${stateText}${name} · ${size.width} × ${size.height}`;
          const link=document.createElement('a');link.textContent='Open ↗';const destination=new URL(reviewUrl('prototype.html'));destination.searchParams.set('screen',screen.id);if(key)destination.searchParams.set('state',key);else destination.searchParams.delete('state');link.href=destination.href;link.setAttribute('aria-label',`Open ${screen.name} ${stateText}${name} prototype`);caption.append(label,link);
          const viewport=document.createElement('div');viewport.className='canvas__viewport';viewport.style.setProperty('--vw',size.width+'px');viewport.style.setProperty('--vh',size.height+'px');viewport.style.setProperty('--scale',scale.value);
          // Canvas frames are still: timed moves stay put and entrances render settled (js/navigation.js).
          const source=new URL(themeUrl(statePath(screen,key)));source.searchParams.set('preview','still');
          const frame=document.createElement('iframe');frame.src=source.href;frame.title=`${screen.name} — ${stateText}${name} ${size.width}px`;frame.loading='lazy';viewport.append(frame);figure.append(caption,viewport);row.append(figure);
        }
        canvas.append(section);
      }
    };
    filter.addEventListener('change',()=>{remember('view',filter.value);render();});
    scale.addEventListener('change',()=>{remember('scale',scale.value);canvas.querySelectorAll('.canvas__viewport').forEach(view=>view.style.setProperty('--scale',scale.value));});
    render();
  }
})();
