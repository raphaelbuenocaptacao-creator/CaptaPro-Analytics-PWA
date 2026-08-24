(function(){
'use strict';
let annualPromise=null;
const VERSION='20260823-directjson-v1';
const BASE_FILE='data-2026.json';
const EXTRA_FILE='data-extra-2026-08-23.json';

function stage(text){
  window.__captaupDataStage=text;
  const el=document.getElementById('loadStatus');
  if(el)el.textContent=text;
}
function rememberError(prefix,err){
  const msg=prefix+': '+String(err&&err.message||err||'ERRO_DESCONHECIDO');
  window.__captaupDataError=msg;
  console.warn('[CAPTAUP]',msg);
}
function mergeExtra(base,extra){
  if(!base||!Array.isArray(base.d)||!Array.isArray(base.r)||!extra||!Array.isArray(extra.d)||!Array.isArray(extra.r))throw new Error('FORMATO_EXTRA_INVALIDO');
  const rowPos=[1,2,3,4,6,12,13,14];
  const maps=[];
  for(let di=0;di<8;di++){
    const source=Array.isArray(extra.d[di])?extra.d[di]:[];
    const target=base.d[di]||(base.d[di]=[]);
    const idx=new Map(target.map((v,i)=>[String(v),i]));
    maps[di]=source.map(v=>{
      const key=String(v);
      if(idx.has(key))return idx.get(key);
      const n=target.length;target.push(v);idx.set(key,n);return n;
    });
  }
  const existing2308=base.r.filter(r=>r&&r[0]==='2026-08-23');
  if(existing2308.length){base.to='2026-08-23';return base;}
  for(const row of extra.r){
    const nr=row.slice();
    rowPos.forEach((pos,di)=>{nr[pos]=maps[di][row[pos]];});
    base.r.push(nr);
  }
  base.to=extra.to||'2026-08-23';
  return base;
}
async function loadBase(){
  stage('Carregando base anual...');
  const r=await fetch('./'+BASE_FILE+'?v='+VERSION,{cache:'no-store'});
  if(!r.ok)throw new Error('BASE_HTTP_'+r.status);
  const data=await r.json();
  if(!data||!Array.isArray(data.d)||!Array.isArray(data.r))throw new Error('BASE_DIRETA_INVALIDA');
  return data;
}
async function addExtra(base){
  try{
    stage('Somando resultado de 23/08...');
    const r=await fetch('./'+EXTRA_FILE+'?v='+VERSION,{cache:'no-store'});
    if(!r.ok)throw new Error('EXTRA_HTTP_'+r.status);
    const extra=await r.json();
    const merged=mergeExtra(base,extra);
    const count2308=merged.r.filter(x=>x&&x[0]==='2026-08-23').length;
    window.__captaupExtraStatus={ok:count2308===21,count2308,total:merged.r.length};
    stage(merged.r.length+' casais · base até '+(count2308?'23/08/2026':'22/08/2026'));
    return merged;
  }catch(err){
    rememberError('EXTRA_2308',err);
    stage(base.r.length+' casais · base até 22/08/2026');
    return base;
  }
}
async function loadCaptaUpAnnual(){
  if(annualPromise)return annualPromise;
  annualPromise=(async()=>addExtra(await loadBase()))();
  try{return await annualPromise;}catch(err){
    annualPromise=null;
    rememberError('BASE_PRINCIPAL',err);
    stage('Erro ao carregar dados: '+String(err&&err.message||err));
    throw err;
  }
}
window.loadCaptaUpAnnual=loadCaptaUpAnnual;
})();