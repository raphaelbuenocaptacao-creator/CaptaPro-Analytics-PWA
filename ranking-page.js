(()=>{'use strict';
const $=id=>document.getElementById(id);
function openRanking(){
 const h=$('pageTitle');if(h)h.textContent='Ranking';
 const p=$('periodLabel');if(p){const st=$('start')?.value,en=$('end')?.value;p.textContent=st&&en?`Ranking do período: ${st.split('-').reverse().join('/')} a ${en.split('-').reverse().join('/')}`:'Ranking da equipe ativa';}
 if(typeof window.__captaupRankingRefresh==='function')window.__captaupRankingRefresh();
}
function loadManagerInsights(){if(document.querySelector('script[data-manager-insights]'))return;const s=document.createElement('script');s.src='./manager-insights.js?v=20260824-rank38';s.dataset.managerInsights='1';document.body.appendChild(s)}
document.querySelectorAll('[data-page="ranking"]').forEach(b=>b.addEventListener('click',()=>setTimeout(openRanking,0)));
['start','end'].forEach(id=>$(id)?.addEventListener('change',()=>{if(!$('page-ranking')?.classList.contains('hidden'))openRanking()}));
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadManagerInsights);else loadManagerInsights();
})();