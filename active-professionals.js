(()=>{'use strict';
const norm=s=>String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const ACTIVE=[
'SUENE CINTIA DA SILVA',
'PEDRO HENRIQUE GOMES SANTOS',
'LARISSA MARIA RIBEIRO',
'MATHEUS ESLEY SILVA',
'RICARDO MALTCHIK',
'JOSYENE APARECIDA DE FREITAS',
'EDSON ADRIANO PINTO MOREIRA',
'MATHEUS DOMINGOS SANTOS DE SOUZA',
'ANA CAROLINE DA SILVA LOPES PEREIRA',
'JESSICA GONCALVES BARBOSA',
'ANDRE LUIS CARRIÇO DOS SANTOS',
'MARCIO VINICIOS MARTINS ALFAIA',
'MATEUS SANTOS SANTA ROSA',
'OTAVIO JOSE DE OLIVEIRA MARTINS',
'MANARA ALEXANDRE SOUSA',
'CLACION DE SOUZA BRAGA FILHO',
'RAFAEL HENRIQUE MEDEIROS',
'WEENA ALVES MENEZES',
'LETICIA LEANDRA DE TOLEDO',
'TAINA JOICE SILVA SOUZA'
];
const ALIASES={
'LARISSA RIBEIRO':'LARISSA MARIA RIBEIRO',
'JOSYENE FREITAS':'JOSYENE APARECIDA DE FREITAS',
'ADRIANO MOREIRA':'EDSON ADRIANO PINTO MOREIRA',
'MATHEUS DOMINGOS SANTOS':'MATHEUS DOMINGOS SANTOS DE SOUZA',
'ANA CAROLINE':'ANA CAROLINE DA SILVA LOPES PEREIRA',
'JESSICA BARBOSA':'JESSICA GONCALVES BARBOSA',
'ANDRE CARRIÇO':'ANDRE LUIS CARRIÇO DOS SANTOS',
'MARCIO ALFAIA':'MARCIO VINICIOS MARTINS ALFAIA'
};
const ACTIVE_SET=new Set(ACTIVE.map(norm));
function canonical(name){const n=norm(name);return norm(ALIASES[n]||n)}
function isActive(name){return ACTIVE_SET.has(canonical(name))}
window.CAPTAUP_ACTIVE_PROFESSIONALS=[...ACTIVE];
window.CAPTAUP_IS_ACTIVE=isActive;
function filterSelect(id,firstLabel){const s=document.getElementById(id);if(!s)return;[...s.options].forEach((o,i)=>{if(i===0)return;if(!isActive(o.textContent))o.remove()});if(s.options.length&&firstLabel)s.options[0].textContent=firstLabel}
function filterTable(id){const root=document.getElementById(id);if(!root)return;root.querySelectorAll('tbody tr').forEach(tr=>{const td=tr.querySelector('td:nth-child(2),td:first-child');if(!td)return;const name=td.textContent.trim();tr.style.display=isActive(name)?'':'none'})}
function apply(){
 filterSelect('promotor','Todos os ativos');
 filterSelect('proSelect','Selecione um ativo');
 ['rankingTable','promotorTable','rulesTable'].forEach(filterTable);
}
let queued=false;const schedule=()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;apply()})};
new MutationObserver(schedule).observe(document.documentElement,{subtree:true,childList:true});
window.addEventListener('DOMContentLoaded',schedule);setTimeout(schedule,300);setTimeout(schedule,1200);
})();