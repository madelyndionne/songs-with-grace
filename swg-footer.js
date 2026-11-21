/* Shared footer: normalize existing footer text while retaining page-specific content. */
(function(){'use strict';
function ready(){
 const footer=document.querySelector('footer.site-footer,footer.swg-shared-footer,footer');
 if(!footer)return;
 footer.classList.add('site-footer');
 let p=footer.querySelector('[data-swg-copyright]')||Array.from(footer.querySelectorAll('p')).find(x=>/©|copyright|all rights reserved/i.test(x.textContent));
 if(!p){p=document.createElement('p');footer.appendChild(p)}
 p.setAttribute('data-swg-copyright','true');
 const year=new Date().getFullYear();
 p.replaceChildren(document.createTextNode('© '+year+' '));
 const em=document.createElement('em');em.textContent='Madelyn Dionne Ministry';p.append(em);
 const isMinistry=/^ministry(?:-|\.)/.test(location.pathname.split('/').pop().toLowerCase());
 if(isMinistry){
  p.append(document.createTextNode('. Ministry Partner use terms are handled separately. Other rights reserved.'));
 }else{
  const a=document.createElement('a');a.href='license.html';a.textContent='Free Use License';
  p.append(document.createTextNode('. Free noncommercial use is welcome under the '),a,document.createTextNode('. Other rights reserved.'));
 }
 Array.from(footer.querySelectorAll('p')).filter(x=>x!==p&&/©|copyright/i.test(x.textContent)).forEach(x=>x.remove());
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready);else ready();
})();
