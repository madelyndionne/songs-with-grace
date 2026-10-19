(function(){
  window.plausible = window.plausible || function(){ (window.plausible.q = window.plausible.q || []).push(arguments); };
  function send(name, props){ window.plausible(name, {props: props || {}}); }
  function songName(){ var a=document.querySelector('[data-song]'); return a ? a.getAttribute('data-song') : ''; }
  document.addEventListener('DOMContentLoaded', function(){
    var song=songName();
    if(song) send('Song Open',{song:song});
    var maryPlaySent=false;
    document.querySelectorAll('audio').forEach(function(a){
      var sent=false;
      a.addEventListener('play',function(){
        if(!sent){ sent=true; send('Song Play',{song:song}); }
        if(song === "Mary's Song" && !maryPlaySent){
          maryPlaySent=true;
          send("Play: Mary's Song",{song:song});
        }
      });
    });
    // Offer a download link on individual song pages, and track download clicks.
    // This measures requests to download, not confirmed completed transfers.
    if(song){
      document.querySelectorAll('audio[src]').forEach(function(a){
        var src=a.getAttribute('src');
        if(!src || !/\.(mp3|wav|m4a|ogg|flac)(?:[?#]|$)/i.test(src)) return;
        if(a.nextElementSibling && a.nextElementSibling.classList.contains('swg-download-link')) return;
        var link=document.createElement('a');
        link.className='swg-download-link';
        link.href=src;
        link.download=src.split('/').pop().split('?')[0];
        link.textContent='\u2193 Download Song';
        link.setAttribute('data-swg-event','song-download');
        link.setAttribute('data-swg-song',song);
        link.style.cssText='display:block;width:max-content;max-width:100%;margin:-12px auto 24px;color:#65407a;font-weight:700;text-decoration:underline;text-underline-offset:3px;';
        a.insertAdjacentElement('afterend',link);
      });
    }
    // Also tracks any explicitly marked download links elsewhere on the site.
    document.addEventListener('click',function(e){
      var el=e.target.closest('[data-swg-event="song-download"]');
      if(!el) return;
      send('Song Download',{song:el.getAttribute('data-swg-song')||song||'Unknown'});
    });
    document.querySelectorAll('[data-swg-event="devotional-open"]').forEach(function(el){
      el.addEventListener('click',function(){ send('Devotional Open',{song:song}); });
    });
    document.querySelectorAll('[data-swg-event="print-devotional"]').forEach(function(el){
      el.addEventListener('click',function(){ send('Devotional Print',{song:song}); });
    });
    document.querySelectorAll('[data-swg-song-link]').forEach(function(el){
      el.addEventListener('click',function(){ send('Song Navigation',{song:el.getAttribute('data-swg-song-link'), action:el.getAttribute('data-swg-action')||'open'}); });
    });
  });
})();

/* Load the shared SWG Scripture reader on song pages. */
(function(){
  if(!document.querySelector('#devotional')) return;
  if(document.querySelector('script[data-swg-scripture-loader]')) return;
  var s=document.createElement('script');
  s.src='assets/swg-scripture.js?v=20261007';
  s.defer=true;
  s.setAttribute('data-swg-scripture-loader','');
  document.head.appendChild(s);
})();
