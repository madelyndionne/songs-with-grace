(function(){
  'use strict';
  const KEY='swgPlaylist';
  const grid=document.getElementById('songGrid');
  const launch=document.getElementById('playlistLaunch');
  const panel=document.getElementById('playlistPanel');
  const close=document.getElementById('playlistClose');
  const list=document.getElementById('playlistList');
  const empty=document.getElementById('playlistEmpty');
  const audio=document.getElementById('playlistAudio');
  const now=document.getElementById('playlistNow');
  const playAll=document.getElementById('playlistPlayAll');
  const prev=document.getElementById('playlistPrev');
  const next=document.getElementById('playlistNext');
  const clear=document.getElementById('playlistClear');
  if(!grid||!launch||!panel||!list||!audio) return;

  let current=-1;
  function get(){try{const x=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(x)?x:[]}catch(e){return []}}
  function put(items){localStorage.setItem(KEY,JSON.stringify(items));render();}
  function songFromCard(card){
    const page=card.dataset.page||'';
    const slug=page.replace(/\.html(?:#.*)?$/i,'');
    return {page:page,title:card.dataset.title||slug,audio:'assets/'+slug+'.mp3'};
  }
  function fire(name,props){if(typeof window.plausible==='function') window.plausible(name,{props:props||{}});}
  function addButtons(){
    grid.querySelectorAll('.card').forEach(card=>{
      const actions=card.querySelector('.actions'); if(!actions) return;
      let b=actions.querySelector('.playlist-add');
      if(!b){
        b=document.createElement('button'); b.type='button'; b.className='playlist-add'; b.dataset.page=card.dataset.page;
        b.textContent='+ Playlist'; actions.appendChild(b);
      }
    });
    paintButtons();
  }
  grid.addEventListener('click',e=>{
    const b=e.target.closest('.playlist-add'); if(!b) return;
    const card=b.closest('.card'); if(card) toggle(songFromCard(card));
  });
  function toggle(song){
    let items=get(); const i=items.findIndex(x=>x.page===song.page);
    if(i>=0){items.splice(i,1);fire('Playlist Remove',{song:song.title});}
    else{items.push(song);fire('Playlist Add',{song:song.title});}
    put(items);
  }
  function paintButtons(){
    const pages=new Set(get().map(x=>x.page));
    grid.querySelectorAll('.playlist-add').forEach(b=>{const on=pages.has(b.dataset.page);b.textContent=on?'✓ Added':'+ Playlist';b.classList.toggle('is-added',on);b.setAttribute('aria-pressed',String(on));});
  }
  function render(){
    const items=get(); launch.textContent='♫ Playlist ('+items.length+')'; empty.hidden=items.length>0; list.innerHTML='';
    items.forEach((s,i)=>{
      const li=document.createElement('li'); li.className='playlist-item'+(i===current?' is-current':'');
      const title=document.createElement('button'); title.type='button'; title.textContent=s.title; title.title='Play '+s.title; title.addEventListener('click',()=>playIndex(i,true));
      const acts=document.createElement('span'); acts.className='playlist-item-actions';
      const up=small('↑','Move up',()=>move(i,-1)); const down=small('↓','Move down',()=>move(i,1)); const rm=small('×','Remove',()=>remove(i));
      acts.append(up,down,rm); li.append(title,acts); list.appendChild(li);
    });
    if(current>=items.length) current=-1;
    paintButtons();
  }
  function small(text,label,fn){const b=document.createElement('button');b.type='button';b.textContent=text;b.setAttribute('aria-label',label);b.addEventListener('click',fn);return b;}
  function move(i,d){let items=get(),j=i+d;if(j<0||j>=items.length)return;[items[i],items[j]]=[items[j],items[i]];if(current===i)current=j;else if(current===j)current=i;put(items);}
  function remove(i){let items=get();const removed=items[i];items.splice(i,1);if(i<current)current--;else if(i===current){audio.pause();audio.removeAttribute('src');audio.load();current=-1;now.textContent='Choose a song or press Play All.';}put(items);if(removed)fire('Playlist Remove',{song:removed.title});}
  function playIndex(i,userStarted){
    const items=get(); if(!items.length)return; if(i<0)i=items.length-1;if(i>=items.length)i=0;current=i;const s=items[i];
    if(audio.getAttribute('src')!==s.audio){audio.src=s.audio;audio.load();}
    now.textContent=(i+1)+' of '+items.length+' — '+s.title;render();
    const p=audio.play(); if(p&&p.catch)p.catch(()=>{});
    if(userStarted)fire('Playlist Play',{song:s.title,position:String(i+1),size:String(items.length)});
  }
  function openPanel(){panel.classList.add('is-open');panel.setAttribute('aria-hidden','false');launch.setAttribute('aria-expanded','true');render();}
  function closePanel(){panel.classList.remove('is-open');panel.setAttribute('aria-hidden','true');launch.setAttribute('aria-expanded','false');}
  launch.addEventListener('click',()=>panel.classList.contains('is-open')?closePanel():openPanel()); close.addEventListener('click',closePanel);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closePanel();});
  playAll.addEventListener('click',()=>playIndex(current>=0?current:0,true)); prev.addEventListener('click',()=>playIndex(current-1,true)); next.addEventListener('click',()=>playIndex(current+1,true));
  clear.addEventListener('click',()=>{audio.pause();audio.removeAttribute('src');audio.load();current=-1;now.textContent='Choose songs, then press Play All.';put([]);fire('Playlist Clear',{});});
  audio.addEventListener('ended',()=>{const items=get();if(current>=0&&current<items.length-1){playIndex(current+1,false);}else{fire('Playlist Complete',{size:String(items.length)});current=-1;render();now.textContent='Playlist finished.';}});
  addButtons(); render();
})();
