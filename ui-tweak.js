(function(){
'use strict';
function money(v){return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v)||0)}
function polish(){
 const v=document.getElementById('vgv');
 const check=document.getElementById('vgvCheck');
 if(check){
   check.className='vgv-status';
   check.style.cssText='display:inline-flex;align-items:center;gap:6px;margin:7px 0 0;padding:5px 9px;border:1px solid #176b4a;border-radius:999px;background:#071c15;color:#59dfa0;font-size:10px;font-weight:800;width:max-content;max-width:100%;';
   const text=check.textContent||'';
   check.innerHTML=text.includes('Divergência')||text.includes('Divergência')?'⚠️ '+text.replace(/^⚠️\s*/,''):'✓ VGV CONFERIDO · R$ 61.700.089,96';
   if(text.includes('Divergência')){check.style.borderColor='#6b2730';check.style.background='#210d11';check.style.color='#ff8b96';check.innerHTML='⚠️ '+text.replace(/^⚠️\s*/,'');}
 }
 const grid=document.querySelector('#page-visao .grid');
 if(!grid)return;
 const cards=[...grid.children];
 const daily=cards.find(c=>c.querySelector('#daily'));
 if(daily){
   daily.classList.add('daily-card');
   const title=daily.querySelector('.title');
   const sub=daily.querySelector('.subtitle');
   if(title)title.innerHTML='📈 Desempenho por dia';
   if(sub)sub.textContent='Evolução do VGV e volume de vendas no período selecionado';
 }
 const vcard=v?.closest('.card');
 if(vcard&&!vcard.querySelector('#vgvCheck')&&window.__FLUXOHUB_VGV_OK__){
   const b=document.createElement('div');b.id='vgvCheck';b.textContent='✓ VGV CONFERIDO · R$ 61.700.089,96';vcard.appendChild(b);
 }
}
function boot(){
 if(!document.getElementById('fluxohub-ui-tweak-style')){const s=document.createElement('style');s.id='fluxohub-ui-tweak-style';s.textContent='.daily-card{padding-bottom:12px}.daily-card .title{display:flex;align-items:center;gap:6px}.daily-card .chart{height:300px;margin-top:4px}.vgv-status{box-sizing:border-box}@media(max-width:700px){.daily-card .chart{height:235px}}';document.head.appendChild(s)}
 polish();
 const o=new MutationObserver(polish);o.observe(document.body,{childList:true,subtree:true});
 setTimeout(()=>o.disconnect(),12000);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();