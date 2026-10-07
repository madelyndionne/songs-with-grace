(function(){
  'use strict';

  var APP_KEY='vP7lCWRfAQmzU6Jl8Hb8g0e6ve3ae9ppV0aUJkYDVe911ADB';
  var BIBLE_ID=111; // New International Version (NIV)

  var devotional=document.getElementById('devotional');
  if(!devotional || document.getElementById('scriptureOpen')) return;

  var BOOKS={
    'Genesis':'GEN','Exodus':'EXO','Leviticus':'LEV','Numbers':'NUM','Deuteronomy':'DEU',
    'Joshua':'JOS','Judges':'JDG','Ruth':'RUT','1 Samuel':'1SA','2 Samuel':'2SA',
    '1 Kings':'1KI','2 Kings':'2KI','1 Chronicles':'1CH','2 Chronicles':'2CH','Ezra':'EZR',
    'Nehemiah':'NEH','Esther':'EST','Job':'JOB','Psalm':'PSA','Psalms':'PSA','Proverbs':'PRO',
    'Ecclesiastes':'ECC','Song of Solomon':'SNG','Song of Songs':'SNG','Isaiah':'ISA','Jeremiah':'JER',
    'Lamentations':'LAM','Ezekiel':'EZK','Daniel':'DAN','Hosea':'HOS','Joel':'JOL','Amos':'AMO',
    'Obadiah':'OBA','Jonah':'JON','Micah':'MIC','Nahum':'NAM','Habakkuk':'HAB','Zephaniah':'ZEP',
    'Haggai':'HAG','Zechariah':'ZEC','Malachi':'MAL','Matthew':'MAT','Mark':'MRK','Luke':'LUK',
    'John':'JHN','Acts':'ACT','Romans':'ROM','1 Corinthians':'1CO','2 Corinthians':'2CO',
    'Galatians':'GAL','Ephesians':'EPH','Philippians':'PHP','Colossians':'COL',
    '1 Thessalonians':'1TH','2 Thessalonians':'2TH','1 Timothy':'1TI','2 Timothy':'2TI',
    'Titus':'TIT','Philemon':'PHM','Hebrews':'HEB','James':'JAS','1 Peter':'1PE','2 Peter':'2PE',
    '1 John':'1JN','2 John':'2JN','3 John':'3JN','Jude':'JUD','Revelation':'REV'
  };
  var bookNames=Object.keys(BOOKS).sort(function(a,b){return b.length-a.length;});
  var escaped=bookNames.map(function(n){return n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}).join('|');
  var refRe=new RegExp('(?:^|[^A-Za-z0-9])('+escaped+')\\s+(\\d+)(?:(?:\\s*[–-]\\s*(\\d+))|(?::(\\d+(?:\\s*[–-]\\s*\\d+)?(?:\\s*,\\s*\\d+(?:\\s*[–-]\\s*\\d+)?)*)))?','g');

  function normalizeDash(s){ return String(s||'').replace(/–/g,'-').replace(/\s+/g,''); }
  function parseReferences(){
    var extra=document.getElementById('extra');
    var source=extra ? extra.innerText : devotional.innerText;
    var out=[], seen={};
    refRe.lastIndex=0;
    var m;
    while((m=refRe.exec(source))){
      var book=m[1], code=BOOKS[book], chapter=m[2], chapterEnd=m[3], verses=m[4];
      var label=book+' '+chapter;
      var passages=[];
      if(chapterEnd){
        label+='–'+chapterEnd;
        passages.push(code+'.'+chapter+'-'+code+'.'+chapterEnd);
      }else if(verses){
        var clean=normalizeDash(verses);
        label+=':'+verses.replace(/-/g,'–');
        clean.split(',').forEach(function(v){ passages.push(code+'.'+chapter+'.'+v); });
      }else{
        passages.push(code+'.'+chapter);
      }
      var key=book+'|'+chapter+'|'+(chapterEnd||'')+'|'+(verses||'');
      if(!seen[key]){ seen[key]=true; out.push({label:label,passages:passages}); }
    }
    return out;
  }

  var refs=parseReferences();
  if(!refs.length) return;

  var style=document.createElement('style');
  style.textContent='.scripture-open{display:inline-block;margin:.25rem 0 1.15rem;padding:.62rem .9rem;border:1px solid var(--purple);border-radius:9px;background:#f3edf6;color:var(--purple);font:700 1rem "Caladea",serif;cursor:pointer}.scripture-modal[hidden]{display:none}.scripture-modal{position:fixed;inset:0;z-index:10000;background:rgba(30,20,34,.55);display:flex;align-items:center;justify-content:center;padding:20px}.scripture-card{position:relative;width:min(760px,100%);max-height:86vh;overflow:auto;background:var(--paper,#fbfaf7);border-radius:15px;padding:24px;box-shadow:0 18px 55px rgba(0,0,0,.28)}.scripture-close{position:absolute;right:14px;top:10px;border:0;background:transparent;color:var(--purple,#65407a);font-size:2rem;cursor:pointer}.scripture-card h2{margin:0 42px 10px 0;padding:0;border:0}.scripture-picks{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0 18px}.scripture-picks button{border:1px solid #cbbbd3;border-radius:8px;background:#fff;padding:.45rem .65rem;font-family:inherit;cursor:pointer}.scripture-picks button.active{background:#f3edf6;font-weight:700}.scripture-text{line-height:1.65;white-space:pre-wrap}.scripture-copy{font-size:.85rem;color:#6b626f;margin-top:18px;border-top:1px solid #ddd;padding-top:10px}.scripture-error-detail{font-size:.85rem;color:#6b626f}@media print{.scripture-open,.scripture-modal{display:none!important}}';
  document.head.appendChild(style);

  var button=document.createElement('button');
  button.className='scripture-open';
  button.id='scriptureOpen';
  button.type='button';
  button.textContent='📖 Read the Scriptures';

  var modal=document.createElement('div');
  modal.className='scripture-modal';
  modal.id='scriptureModal';
  modal.setAttribute('role','dialog');
  modal.setAttribute('aria-modal','true');
  modal.setAttribute('aria-labelledby','scriptureTitle');
  modal.hidden=true;
  modal.innerHTML='<div class="scripture-card"><button class="scripture-close" id="scriptureClose" type="button" aria-label="Close Scripture reader">×</button><h2 id="scriptureTitle">Read the Scriptures — NIV</h2><p>Scriptures referenced in this devotional:</p><div class="scripture-picks" id="scripturePicks"></div><h3 id="scripturePassageTitle">Choose a passage</h3><div class="scripture-text" id="scriptureText">The passage will appear here.</div><div class="scripture-copy" id="scriptureCopyright">Scripture supplied through YouVersion Platform.</div></div>';

  var heading=devotional.querySelector('h2');
  if(heading){ heading.insertAdjacentElement('afterend',button); button.insertAdjacentElement('afterend',modal); }
  else{ devotional.insertBefore(modal,devotional.firstChild); devotional.insertBefore(button,modal); }

  var close=document.getElementById('scriptureClose');
  var picks=document.getElementById('scripturePicks');
  var text=document.getElementById('scriptureText');
  var title=document.getElementById('scripturePassageTitle');
  var copy=document.getElementById('scriptureCopyright');
  var metaLoaded=false;

  function escapeHtml(s){return String(s).replace(/[&<>\"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c];});}
  function shut(){modal.hidden=true;button.focus();}
  function openModal(){modal.hidden=false; if(!metaLoaded) loadCopyright();}

  async function loadCopyright(){
    metaLoaded=true;
    try{
      var res=await fetch('https://api.youversion.com/v1/bibles/'+BIBLE_ID,{headers:{'X-YVP-App-Key':APP_KEY,'Accept':'application/json'}});
      if(!res.ok) return;
      var body=await res.json(), b=body.data||body;
      var c=b.copyright||b.promotional_content||'New International Version';
      copy.textContent=c+'  Scripture supplied through YouVersion Platform.';
    }catch(_e){}
  }

  async function fetchPassage(ref){
    var url='https://api.youversion.com/v1/bibles/'+BIBLE_ID+'/passages/'+encodeURIComponent(ref)+'?format=text';
    var res=await fetch(url,{headers:{'X-YVP-App-Key':APP_KEY}});
    if(!res.ok){
      var details='';
      try{details=await res.text();}catch(_e){}
      throw new Error('HTTP '+res.status+(details?' — '+details.slice(0,180):''));
    }
    var body=await res.json(), d=body.data||body;
    return d.content||d.text||'';
  }

  refs.forEach(function(item,index){
    var b=document.createElement('button');
    b.type='button';
    b.textContent=item.label;
    b.addEventListener('click',async function(){
      Array.prototype.forEach.call(picks.querySelectorAll('button'),function(x){x.classList.remove('active');});
      b.classList.add('active');
      title.textContent=item.label+' — NIV';
      text.textContent='Loading Scripture…';
      try{
        var chunks=[];
        for(var i=0;i<item.passages.length;i++){
          var t=await fetchPassage(item.passages[i]);
          if(t) chunks.push(t.trim());
        }
        text.textContent=chunks.length?chunks.join('\n\n'):'Scripture text was returned, but could not be displayed.';
      }catch(err){
        console.error('YouVersion Scripture request failed:',err);
        text.innerHTML='<p>Scripture could not be loaded from YouVersion just now.</p><p class="scripture-error-detail">'+escapeHtml(err.message||err)+'</p>';
      }
    });
    picks.appendChild(b);
    if(index===0) b.setAttribute('data-first','true');
  });

  button.addEventListener('click',openModal);
  close.addEventListener('click',shut);
  modal.addEventListener('click',function(e){if(e.target===modal)shut();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!modal.hidden)shut();});
})();
