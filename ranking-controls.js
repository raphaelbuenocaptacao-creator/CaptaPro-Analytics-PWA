(function(){
'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const money=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(n)||0);
const num=n=>new Intl.NumberFormat('pt-BR').format(Number(n)||0);
const pct=n=>((Number(n)||0)*100).toFixed(2).replace('.',',')+'%';
let rows=[];
let sortKey='activeV';
let sortDir='desc';
function unpack(p){
  if(!(p&&Array.isArray(p.d)&&Array.isArray(p.r)))return[];
  const [P,L,C,O]=p.d;
  return p.r.map(a=>({
    date:a[0],promotor:String(P[a[1]]||'').trim(),liner:String(L[a[2]]||'').trim(),closer:String(C[a[3]]||'').trim(),local:String(O[a[4]]||'').trim(),
    activeV:+a[8]||0,sales:+a[7]||0,giftCost:+a[11]||0
  })).filter(r=>r.date&&r.promotor);
}
function filtered(){
  const st=$('start')?.value||'',en=$('end')?.value||'',p=$('promotor')?.value||'',l=$('liner')?.value||'',c=$('closer')?.value||'',o=$('local')?.value||'';
  return rows.filter(r=>(!st||r.date>=st)&&(!en||r.date<=en)&&(!p||r.promotor===p)&&(!l||r.liner===l)&&(!c||r.closer===c)&&(!o||r.local===o));
}
function aggregate(a){
  const m=new Map();
  for(const r of a){
    if(!m.has(r.promotor))m.set(r.promotor,{name:r.promotor,casais:0,activeV:0,sales:0,giftCost:0});
    const x=m.get(r.promotor);x.casais++;x.activeV+=r.activeV;x.sales+=r.sales;x.giftCost+=r.giftCost;
  }
  return [...m.values()].map(x=>({...x,conv:x.casais?x.sales/x.casais:0,costPerCasal:x.casais?x.giftCost/x.casais:0}));
}
function cmp(a,b){
  let av=sortKey==='name'?a.name:a[sortKey],bv=sortKey==='name'?b.name:b[sortKey];
  let d=sortKey==='name'?String(av).localeCompare(String(bv),'pt-BR'):(Number(av)||0)-(Number(bv)||0);
  return sortDir==='asc'?d:-d;
}
function arrow(k){return sortKey===k?(sortDir==='asc'?' ▲':' ▼'):''}
function th(label,key){return `<th class="rk-sort" data-rksort="${key}" style="cursor:pointer;user-select:none;white-space:nowrap">${label}${arrow(key)}</th>`}
function render(){
  const host=$('rankingTable');if(!host||!rows.length)return;
  const data=aggregate(filtered()).sort(cmp);
  host.innerHTML=data.length?`<div class="tablewrap"><table><thead><tr><th>#</th>${th('NOME','name')}${th('CASAIS','casais')}${th('VGV LÍQUIDO','activeV')}${th('VENDAS','sales')}${th('CONVERSÃO','conv')}${th('CUSTO BRINDES','giftCost')}${th('CUSTO/CASAL','costPerCasal')}</tr></thead><tbody>${data.map((x,i)=>`<tr><td>${i+1}</td><td><b>${esc(x.name)}</b></td><td>${num(x.casais)}</td><td class="money">${money(x.activeV)}</td><td>${num(x.sales)}</td><td>${pct(x.conv)}</td><td class="warn">${money(x.giftCost)}</td><td>${money(x.costPerCasal)}</td></tr>`).join('')}</tbody></table></div>`:'<div class="info">Nenhum registro no período selecionado.</div>';
  host.querySelectorAll('[data-rksort]').forEach(h=>h.onclick=()=>{const k=h.dataset.rksort;if(sortKey===k)sortDir=sortDir==='desc'?'asc':'desc';else{sortKey=k;sortDir=k==='name'?'asc':'desc'}render()});
}
function bind(){
  ['start','end','promotor','liner','closer','local'].forEach(id=>{const e=$(id);if(!e)return;e.addEventListener('change',()=>setTimeout(render,0));e.addEventListener('input',()=>setTimeout(render,0));});
  document.querySelectorAll('[data-rank]').forEach(b=>b.addEventListener('click',()=>{const map={activeV:'activeV',sales:'sales',casais:'casais',conv:'conv',giftEfficiency:'giftCost',totalPay:'activeV'};sortKey=map[b.dataset.rank]||'activeV';sortDir='desc';setTimeout(render,0)}));
  const reset=$('reset');if(reset)reset.addEventListener('click',()=>setTimeout(render,30));
}
async function boot(){
  if(typeof window.loadCaptaUpAnnual!=='function'){setTimeout(boot,150);return;}
  try{rows=unpack(await window.loadCaptaUpAnnual());bind();render();window.__captaupRankingRefresh=render;}catch(e){console.warn('CAPTAUP ranking controls',e)}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();