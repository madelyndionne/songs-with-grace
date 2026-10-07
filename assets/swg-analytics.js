(function(){
  window.plausible = window.plausible || function(){ (window.plausible.q = window.plausible.q || []).push(arguments); };
  function send(name, props){ window.plausible(name, {props: props || {}}); }
  function songName(){ var a=document.querySelector('[data-song]'); return a ? a.getAttribute('data-song') : ''; }
  document.addEventListener('DOMContentLoaded', function(){
    var song=songName();
    if(song) send('Song Open',{song:song});
    document.querySelectorAll('audio').forEach(function(a){
      var sent=false;
      a.addEventListener('play',function(){ if(!sent){ sent=true; send('Song Play',{song:song}); }});
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
