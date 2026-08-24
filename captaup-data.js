(function(){
'use strict';
let annualPromise=null;
const VERSION='20260824-singlebase-v1';
const BASE_FILE='data-2026.json';
function stage(text){window.__captaupDataStage=text;const el=document.getElementById('loadStatus');if(el)el.textContent=text}
function rememberError(err){const msg='BASE_PRINCIPAL: '+String(err&&err.message||err||'ERRO_DESCONHECIDO');window.__captaupDataError=msg;console.warn('[CAPTAUP]',msg)}
function br(v){if(!v)return'';const[a,b,c]=String(v).split('-');return c&&b&&a?`${c}/${b}/${a}`:v}
async function loadCaptaUpAnnual(){
  if(annualPromise)return annualPromise;
  annualPromise=(async()=>{
    stage('Carregando base oficial...');
    const r=await fetch('./'+BASE_FILE+'?v='+VERSION,{cache:'no-store'});
    if(!r.ok)throw new Error('BASE_HTTP_'+r.status);
    const data=await r.json();
    if(!data||!Array.isArray(data.d)||!Array.isArray(data.r))throw new Error('BASE_INVALIDA');
    stage(data.r.length+' casais · base até '+br(data.to));
    return data;
  })();
  try{return await annualPromise}catch(err){annualPromise=null;rememberError(err);stage('Erro ao carregar dados: '+String(err&&err.message||err));throw err}
}
window.loadCaptaUpAnnual=loadCaptaUpAnnual;
})();
