(()=>{'use strict';
const $=id=>document.getElementById(id);
function openRanking(){
 const h=$('pageTitle');if(h)h.textContent='Ranking';
 const p=$('periodLabel');if(p){const st=$('start')?.value,en=$('end')?.value;p.textContent=st&&en?`Ranking do período: ${st.split('-').reverse().join('/')} a ${en.split('-').reverse().join('/')}`:'Ranking da equipe ativa';}
 if(typeof window.__captaupRankingRefresh==='function')window.__captaupRankingRefresh();
}
document.querySelectorAll('[data-page="ranking"]').forEach(b=>b.addEventListener('click',()=>setTimeout(openRanking,0)));
['start','end'].forEach(id=>$(id)?.addEventListener('change',()=>{if(!$('page-ranking')?.classList.contains('hidden'))openRanking()}));
})();