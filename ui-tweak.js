/* FluxoHub section filters: visual helper only.
   Does not load data or render KPIs, avoiding duplicate application state. */
(()=>{
'use strict';
const $=id=>document.getElementById(id);
const qs=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function add(){
  qs('section[id^="page-"]').forEach(section=>{
    if(section.querySelector('.section-filter'))return;
    const box=document.createElement('div');
    box.className='section-filter filters';
    box.innerHTML='<div class="field"><label>PERÍODO</label><input data-filter="start" type="date"></div><div class="field"><label>ATÉ</label><input data-filter="end" type="date"></div><div class="field"><label>PROMOTOR</label><select data-filter="promotor"></select></div><div class="field"><label>LINER</label><select data-filter="liner"></select></div><div class="field"><label>CLOSER</label><select data-filter="closer"></select></div><div class="field"><label>LOCAL</label><select data-filter="local"></select></div><button type="button" class="btn section-clear">Limpar filtro da aba</button>';
    section.prepend(box);
    box.addEventListener('change',e=>{
      const id=e.target.dataset.filter;
      const main=$(id);
      if(main) main.value=e.target.value;
      main?.dispatchEvent(new Event('change',{bubbles:true}));
    });
    box.querySelector('.section-clear')?.addEventListener('click',()=>{
      ['start','end','promotor','liner','closer','local'].forEach(id=>{const main=$(id);if(main)main.value='';});
      $('reset')?.click();
    });
  });
}
function sync(){
  qs('.section-filter').forEach(box=>['start','end','promotor','liner','closer','local'].forEach(id=>{
    const main=$(id),field=box.querySelector(`[data-filter="${id}"]`);
    if(!main||!field)return;
    if(field.tagName==='SELECT')field.innerHTML=main.innerHTML;
    field.value=main.value||'';
  }));
}
function boot(){add();sync();setTimeout(sync,100);setTimeout(sync,500);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
window.addEventListener('fluxohub:filters-updated',sync);
})();
