(function(){
'use strict';

function installButton(){
  if(document.getElementById('installPwa')) return;
  const actions=document.querySelector('.actions');
  if(!actions) return;
  const b=document.createElement('button');
  b.id='installPwa';
  b.className='btn primary';
  b.textContent='📲 Instalar App';
  b.hidden=true;
  actions.insertBefore(b,actions.firstChild);
  let deferred=null;
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;b.hidden=false;});
  b.addEventListener('click',async()=>{
    if(!deferred){alert('Para instalar: abra o menu do navegador e escolha “Instalar app” ou “Adicionar à tela inicial”.');return;}
    deferred.prompt();
    try{await deferred.userChoice;}catch(e){}
    deferred=null;b.hidden=true;
  });
  window.addEventListener('appinstalled',()=>{b.hidden=true;});
}

function visual(){
  if(document.getElementById('fluxohub-final-ui'))return;
  const style=document.createElement('style');
  style.id='fluxohub-final-ui';
  style.textContent=`
    .actions #installPwa{box-shadow:0 8px 22px #1683ff44;font-weight:800}
    #page-visao .grid > .card:first-child{grid-column:span 8!important;min-height:390px}
    #page-visao .grid > .card:nth-child(2){grid-column:span 4!important;min-height:390px}
    #page-visao .grid > .card:first-child .chart{height:335px;margin-top:8px}
    #page-visao .grid > .card:first-child .title{font-size:15px}
    #page-visao .grid > .card:first-child .subtitle{font-size:11px}
    #page-visao .grid > .card:nth-child(3){grid-column:span 8!important}
    #page-visao .grid > .card:nth-child(4){grid-column:span 4!important}
    .nav button,.mobilebar button,.tab,.actions button{position:relative;z-index:60;pointer-events:auto}
    @media(max-width:1150px){#page-visao .grid > .card:first-child,#page-visao .grid > .card:nth-child(2),#page-visao .grid > .card:nth-child(3),#page-visao .grid > .card:nth-child(4){grid-column:span 12!important}}
    @media(max-width:700px){#page-visao .grid > .card:first-child,#page-visao .grid > .card:nth-child(2){min-height:0}#page-visao .grid > .card:first-child .chart{height:290px}.actions #installPwa{display:inline-block!important}}
  `;
  document.head.appendChild(style);
}

function navigationFix(){
  if(window.__fluxohubNavigationFix)return;
  window.__fluxohubNavigationFix=true;
  const titles={visao:'Visão 360°',equipe:'Equipe',funil:'Funil de Vendas',ranking:'Ranking',operacao:'Operação',perfil:'Perfil do Cliente',alertas:'Alertas',dados:'Dados',xp:'XP BMW GAME'};
  document.addEventListener('click',function(e){
    const btn=e.target.closest('[data-page]');
    if(!btn)return;
    e.preventDefault();e.stopPropagation();
    const page=btn.dataset.page;
    document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('active',x===btn || x.dataset.page===page));
    document.querySelectorAll('main section[id^="page-"]').forEach(s=>{s.hidden=s.id!=='page-'+page;});
    const title=document.getElementById('pageTitle');
    if(title)title.textContent=titles[page]||'FluxoHub';
    if(page==='xp'&&typeof window.renderXP==='function')window.renderXP();
    window.scrollTo({top:0,behavior:'smooth'});
  },true);
  document.addEventListener('click',function(e){
    const rank=e.target.closest('[data-rank]');
    if(rank){e.preventDefault();e.stopPropagation();document.querySelectorAll('[data-rank]').forEach(x=>x.classList.toggle('active',x===rank));return;}
    const close=e.target.closest('.close,[data-close]');
    if(close){const m=document.getElementById('modal');if(m)m.classList.remove('open');}
  },true);
}

function boot(){visual();installButton();navigationFix();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();