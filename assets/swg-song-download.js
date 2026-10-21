/* Songs With Grace - shared song-page download/license flow */
(function () {
  'use strict';
  const audio = document.querySelector('audio#listen');
  if (!audio || !audio.getAttribute('src')) return;
  const licenseUrl = 'license.html';
  const songTitle = document.querySelector('h1')?.textContent?.trim() || 'Song';
  const source = audio.getAttribute('src');
  const style = document.createElement('style');
  style.textContent = `
  .swg-song-download-wrap{text-align:center;margin:-12px 0 26px}
  .swg-song-download-link{display:inline-block;color:#65407a;font:700 1rem Caladea,serif;background:#f3edf6;border:1px solid #d8cce0;border-radius:8px;padding:9px 16px;cursor:pointer}
  .swg-song-download-dialog[hidden]{display:none!important}
  .swg-song-download-dialog{position:fixed;inset:0;z-index:20000;background:rgba(30,20,37,.65);display:flex;align-items:center;justify-content:center;padding:16px}
  .swg-song-download-panel{width:min(650px,100%);max-height:92vh;overflow:auto;background:#fbfaf7;border-radius:15px;padding:24px;box-shadow:0 14px 44px rgba(0,0,0,.3);font-family:Caladea,serif;color:#29262b}
  .swg-song-download-panel h2{margin:0 0 12px;color:#65407a}
  .swg-song-download-panel p{line-height:1.5}
  .swg-song-download-panel a{color:#65407a}
  .swg-song-download-actions{display:flex;gap:12px;justify-content:flex-end;flex-wrap:wrap;margin-top:16px}
  .swg-song-download-actions button{font:inherit;border-radius:8px;padding:10px 15px;cursor:pointer;border:1px solid #d8cce0}
  .swg-song-download-confirm{background:#65407a;color:white}
  .swg-song-download-confirm:disabled{opacity:.45;cursor:not-allowed}
  .swg-song-download-check{display:flex;gap:10px;align-items:flex-start;margin-top:16px;line-height:1.4}
  .swg-song-download-check input{margin-top:4px}
  `;
  document.head.appendChild(style);
  const wrap = document.createElement('div');
  wrap.className = 'swg-song-download-wrap';
  const open = document.createElement('button');
  open.type = 'button'; open.className = 'swg-song-download-link';
  open.textContent = '↓ Download Song';
  wrap.appendChild(open);
  audio.insertAdjacentElement('afterend', wrap);
  const dialog = document.createElement('div');
  dialog.className = 'swg-song-download-dialog'; dialog.hidden = true;
  dialog.setAttribute('role','dialog'); dialog.setAttribute('aria-modal','true');
  dialog.setAttribute('aria-label','Song download and Free Use License');
  dialog.innerHTML = `<div class="swg-song-download-panel">
    <h2>Download ${escapeHtml(songTitle)}</h2>
    <p>These songs are freely available for personal, church, ministry, and educational use under the <strong>Free Use License</strong>. Please read the license before downloading.</p>
    <p><a href="${licenseUrl}" target="_blank" rel="noopener">Read the complete Free Use License ↗</a> (opens in a new tab so you can return here).</p>
    <label class="swg-song-download-check"><input type="checkbox" id="swgSongLicenseAccept"><span>I have read and agree to the Free Use License.</span></label>
    <div class="swg-song-download-actions"><button type="button" data-cancel>Cancel</button><button type="button" class="swg-song-download-confirm" data-confirm disabled>Download MP3</button></div>
  </div>`;
  document.body.appendChild(dialog);
  const check = dialog.querySelector('#swgSongLicenseAccept');
  const confirm = dialog.querySelector('[data-confirm]');
  const cancel = dialog.querySelector('[data-cancel]');
  let lastFocus = null;
  function close(){dialog.hidden=true;document.body.style.overflow='';lastFocus?.focus();}
  open.addEventListener('click',()=>{lastFocus=document.activeElement;check.checked=false;confirm.disabled=true;dialog.hidden=false;document.body.style.overflow='hidden';dialog.querySelector('a').focus();});
  check.addEventListener('change',()=>{confirm.disabled=!check.checked;});
  cancel.addEventListener('click',close);
  dialog.addEventListener('click',e=>{if(e.target===dialog)close();});
  document.addEventListener('keydown',e=>{if(!dialog.hidden&&e.key==='Escape')close();});
  confirm.addEventListener('click',()=>{
    if(!check.checked)return;
    const a=document.createElement('a');a.href=source;a.download=(songTitle.replace(/[\\/:*?"<>|]/g,'-')||'song')+'.mp3';
    document.body.appendChild(a);a.click();a.remove();close();
  });
  function escapeHtml(value){return value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
})();
