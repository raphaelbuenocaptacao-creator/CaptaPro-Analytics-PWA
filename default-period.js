(()=>{'use strict';
const $=id=>document.getElementById(id);
async function applyAnnualRange(){
  if(typeof window.loadCaptaUpAnnual!=='function'){setTimeout(applyAnnualRange,120);return;}
  try{
    const p=await window.loadCaptaUpAnnual();
    const st=p?.from||'2026-01-01',en=p?.to||'2026-08-23';
    const s=$('start'),e=$('end');
    if(!s||!e)return;
    s.value=st;e.value=en;
    s.dispatchEvent(new Event('change',{bubbles:true}));
    e.dispatchEvent(new Event('change',{bubbles:true}));
    window.__captaupDefaultRange=[st,en];
  }catch(err){console.warn('CAPTAUP default annual range',err)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(applyAnnualRange,250));else setTimeout(applyAnnualRange,250);
})();