(function(){
'use strict';
let annualPromise=null;
const VERSION='20260824-datafixed35';
const BASE_FILE='data-2026.json';
function stage(text){window.__captaupDataStage=text;const el=document.getElementById('loadStatus');if(el)el.textContent=text}
function br(v){if(!v)return'';const[a,b,c]=String(v).split('-');return c&&b&&a?`${c}/${b}/${a}`:v}
async function loadCaptaUpAnnual(){
  if(annualPromise)return annualPromise;
  annualPromise=(async()=>{
    stage('Carregando base oficial...');
    const r=await fetch('./'+BASE_FILE+'?v='+VERSION,{cache:'no-store'});
    if(!r.ok)throw new Error('BASE_HTTP_'+r.status);
    const data=await r.json();
    if(!data||data.v!==2||!Array.isArray(data.d)||!Array.isArray(data.r)||data.r.length!==3394)throw new Error('BASE_INVALIDA_'+(data?.r?.length??0));
    if(data.from!=='2026-01-01'||data.to!=='2026-08-23')throw new Error('PERIODO_INVALIDO');
    stage('3.394 casais · base até '+br(data.to));
    window.__captaupDataOk={rows:data.r.length,from:data.from,to:data.to};
    return data;
  })();
  try{return await annualPromise}catch(err){
    annualPromise=null;
    window.__captaupDataError=String(err&&err.message||err);
    stage('Erro ao carregar dados: '+window.__captaupDataError);
    throw err;
  }
}
window.loadCaptaUpAnnual=loadCaptaUpAnnual;
})();
