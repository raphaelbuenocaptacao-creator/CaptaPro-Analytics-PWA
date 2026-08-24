(()=>{'use strict';
const $=id=>document.getElementById(id);
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/\s+/g,' ').trim();
function fix(){
 const role=$('engRole')?.value;
 const op=$('engOpponent');
 if(!op||role!=='promotor'||!Array.isArray(window.CAPTAUP_ACTIVE_PROFESSIONALS))return;
 const me=$('engName')?.value||'';
 const current=op.value;
 const people=window.CAPTAUP_ACTIVE_PROFESSIONALS.filter(n=>norm(n)!==norm(me));
 const wanted=people.map(norm).join('|');
 const existing=[...op.options].slice(1).map(o=>norm(o.value||o.textContent)).join('|');
 if(existing===wanted)return;
 op.innerHTML='<option value="">Escolha um promotor ativo</option>'+people.map(n=>`<option value="${String(n).replace(/"/g,'&quot;')}">${n}</option>`).join('');
 if(people.some(n=>norm(n)===norm(current)))op.value=current;
}
let q=false;const schedule=()=>{if(q)return;q=true;requestAnimationFrame(()=>{q=false;fix()})};
new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true});
document.addEventListener('change',e=>{if(e.target?.id==='engRole'||e.target?.id==='engName')setTimeout(fix,0)});
window.addEventListener('DOMContentLoaded',schedule);setTimeout(fix,400);setTimeout(fix,1200);
})();