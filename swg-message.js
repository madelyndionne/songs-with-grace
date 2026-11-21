/* Shared messaging behavior; Formspree endpoint remains in HTML. */
(function(){'use strict';
function init(){document.querySelectorAll('form.swg-message-form').forEach(form=>{
 const topic=form.querySelector('[name="topic"]'),wrap=form.querySelector('#swgOtherSubjectWrap'),other=form.querySelector('[name="other_subject"]'),subject=form.querySelector('[name="_subject"]'),status=form.querySelector('.swg-form-status');
 if(!topic||!wrap||!other)return;
 function sync(){const isOther=topic.value==='Other';wrap.hidden=!isOther;other.disabled=!isOther;other.required=isOther;
 if(subject)subject.value='Message TO Madelyn Dionne — '+(isOther?(other.value.trim()||'Other'):topic.value);}
 topic.addEventListener('change',sync);other.addEventListener('input',sync);sync();
 // Native POST is retained. Do not show a false success notice without delivery confirmation.
 if(status)form.addEventListener('submit',()=>{status.textContent='Submitting your message…';});
});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
