/* SWG song actions: read the current page, never a hardcoded song. */
(function(){'use strict';
function init(){
 const article=document.querySelector('article.resource[data-song]');if(!article)return;
 const song=article.dataset.song.trim();const pageUrl=location.href;
 const canonical=location.pathname.split('/').pop()||'index.html';
 const text='I thought you might enjoy '+song+' on Songs With Grace.';
 const nativeBtn=document.getElementById('share-native'),copyBtn=document.getElementById('share-copy'),email=document.getElementById('share-email'),facebook=document.getElementById('share-facebook'),status=document.getElementById('share-status'),favoriteBtn=document.getElementById('favorite-btn');
 if(!nativeBtn||!copyBtn||!email||!facebook||!status||!favoriteBtn)return;
 email.href='mailto:?subject='+encodeURIComponent(song+' | Songs With Grace')+'&body='+encodeURIComponent(text+'\n\n'+pageUrl);
 facebook.href='https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(pageUrl);
 if(!navigator.share)nativeBtn.hidden=true;
 nativeBtn.addEventListener('click',async()=>{try{await navigator.share({title:song+' | Songs With Grace',text,url:pageUrl})}catch(e){if(e&&e.name!=='AbortError')status.textContent='Sharing was not available. You can copy the link instead.'}});
 copyBtn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(pageUrl);status.textContent='Link copied.'}catch(e){status.textContent='Please copy the address from your browser.'}});
 const key='swgFavorites';const getFavs=()=>{try{const v=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(v)?v:[]}catch(e){return []}};
 function paint(){const on=getFavs().includes(canonical);favoriteBtn.textContent=on?'♥ Favorited':'♡ Favorite';favoriteBtn.classList.toggle('is-favorite',on);favoriteBtn.setAttribute('aria-pressed',String(on))}
 favoriteBtn.addEventListener('click',()=>{let f=getFavs();f=f.includes(canonical)?f.filter(x=>x!==canonical):[...f,canonical];try{localStorage.setItem(key,JSON.stringify(f))}catch(e){}paint()});paint();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
