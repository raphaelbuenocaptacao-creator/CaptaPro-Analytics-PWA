(function(){
'use strict';
let annualPromise=null;
const VERSION='20260824-recover34';
function stage(text){window.__captaupDataStage=text;const el=document.getElementById('loadStatus');if(el)el.textContent=text}
function rememberError(err){const msg='BASE_PRINCIPAL: '+String(err&&err.message||err||'ERRO_DESCONHECIDO');window.__captaupDataError=msg;console.warn('[CAPTAUP]',msg)}
function br(v){if(!v)return'';const[a,b,c]=String(v).split('-');return c&&b&&a?`${c}/${b}/${a}`:v}
async function fetchJSON(file){const r=await fetch('./'+file+'?v='+VERSION,{cache:'no-store'});if(!r.ok)throw new Error(file+'_HTTP_'+r.status);return r.json()}
function mergeExtra(base,extra){
  if(!base||!Array.isArray(base.d)||!Array.isArray(base.r)||!extra||!Array.isArray(extra.d)||!Array.isArray(extra.r))throw new Error('MERGE_INVALIDO');
  if(base.r.some(r=>r&&r[0]==='2026-08-23')){base.to='2026-08-23';return base}
  const rowPos=[1,2,3,4,6,12,13,14],maps=[];
  for(let di=0;di<8;di++){
    const target=base.d[di]||(base.d[di]=[]),source=extra.d[di]||[],idx=new Map(target.map((v,i)=>[String(v),i]));
    maps[di]=source.map(v=>{const k=String(v);if(idx.has(k))return idx.get(k);const n=target.length;target.push(v);idx.set(k,n);return n});
  }
  for(const row of extra.r){const nr=row.slice();rowPos.forEach((pos,di)=>nr[pos]=maps[di][row[pos]]);base.r.push(nr)}
  base.to='2026-08-23';return base;
}
async function loadDirect(){
  const data=await fetchJSON('data-2026.json');
  if(!data||!Array.isArray(data.d)||!Array.isArray(data.r)||data.r.length<3000)throw new Error('BASE_DIRETA_VAZIA');
  return data;
}
async function loadFromChunks(){
  stage('Reconstruindo base anual...');
  const manifest=await fetchJSON('data-2026-full.json');
  if(!manifest||!Array.isArray(manifest.chunks)||!manifest.chunks.length)throw new Error('MANIFESTO_INVALIDO');
  const parts=await Promise.all(manifest.chunks.map(async file=>{const r=await fetch('./'+file+'?v='+VERSION,{cache:'no-store'});if(!r.ok)throw new Error(file+'_HTTP_'+r.status);return (await r.text()).trim()}));
  const bin=atob(parts.join('')),bytes=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
  let data;
  if(typeof DecompressionStream==='function'){
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    data=await new Response(stream).json();
  }else throw new Error('GZIP_NAO_SUPORTADO');
  if(!data||!Array.isArray(data.d)||!Array.isArray(data.r)||data.r.length!==3373)throw new Error('BASE_RECONSTRUIDA_INVALIDA_'+(data?.r?.length||0));
  const extra=await fetchJSON('data-extra-2026-08-23.json');
  data=mergeExtra(data,extra);
  if(data.r.length!==3394)throw new Error('TOTAL_RECONSTRUIDO_INVALIDO_'+data.r.length);
  return data;
}
async function loadCaptaUpAnnual(){
  if(annualPromise)return annualPromise;
  annualPromise=(async()=>{
    stage('Carregando base oficial...');
    let data;
    try{data=await loadDirect()}catch(e){console.warn('[CAPTAUP] base direta indisponível, usando recuperação',e);data=await loadFromChunks()}
    stage(data.r.length+' casais · base até '+br(data.to));
    window.__captaupDataOk={rows:data.r.length,to:data.to};
    return data;
  })();
  try{return await annualPromise}catch(err){annualPromise=null;rememberError(err);stage('Erro ao carregar dados: '+String(err&&err.message||err));throw err}
}
window.loadCaptaUpAnnual=loadCaptaUpAnnual;
})();
