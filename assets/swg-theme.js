/* SWG theme preference shared across pages */
(function(){
 const root=document.documentElement,key='swgTheme';
 let saved=null;try{saved=localStorage.getItem(key)}catch(e){}
 const media=window.matchMedia?window.matchMedia('(prefers-color-scheme: dark)'):null;
 function preferred(){return saved==='dark'||(saved!=='light'&&!!media&&media.matches)}
 function apply(dark){root.toggleAttribute('data-swg-theme',false);if(dark)root.setAttribute('data-swg-theme','dark');const btn=document.getElementById('swgThemeToggle');if(btn){btn.textContent=dark?'☀ Light mode':'☾ Dark mode';btn.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');btn.setAttribute('aria-pressed',String(dark));}}
 apply(preferred());
 document.addEventListener('DOMContentLoaded',function(){
  const nav=document.querySelector('.site-menu');
  let btn=document.getElementById('swgThemeToggle');if(!btn){btn=document.createElement('button');btn.id='swgThemeToggle';btn.type='button';btn.className='swg-theme-toggle';if(nav){nav.appendChild(btn)}else{btn.classList.add('swg-theme-floating');document.body.appendChild(btn)}}
  btn.addEventListener('click',function(){const dark=root.getAttribute('data-swg-theme')!=='dark';saved=dark?'dark':'light';try{localStorage.setItem(key,saved)}catch(e){}apply(dark)});apply(preferred());
 });
 if(media){const changed=()=>{if(saved!=='light'&&saved!=='dark')apply(preferred())};if(media.addEventListener)media.addEventListener('change',changed);else if(media.addListener)media.addListener(changed)}
})();
