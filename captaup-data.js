(function(){
'use strict';
let annualPromise=null;
let pakoPromise=null;
const VERSION='20260823-direct-2308-v1';
const LOCAL_PAKO=['vendor/pako.part1.txt','vendor/pako.part2.txt','vendor/pako.part3.txt'];
const EXTRA_FILE='data-extra-2026-08-23.json';

function stage(text){
  window.__captaupDataStage=text;
  const el=document.getElementById('loadStatus');
  if(el)el.textContent=text;
}
function showTechnicalError(err){
  const msg=String(err&&err.message||err||'ERRO_DESCONHECIDO');
  window.__captaupDataError=msg;
  stage('Erro na base: '+msg);
}
async function ensurePako(){
  if(window.pako&&typeof window.pako.ungzip==='function')return window.pako;
  if(pakoPromise)return pakoPromise;
  pakoPromise=(async()=>{
    const parts=[];
    for(const file of LOCAL_PAKO){
      const r=await fetch('./'+file+'?v='+VERSION,{cache:'no-store'});
      if(!r.ok)throw new Error('DESCOMPACTADOR_HTTP_'+r.status);
      parts.push(await r.text());
    }
    const code=parts.join('');
    if(code.length<22000)throw new Error('DESCOMPACTADOR_INCOMPLETO_'+code.length);
    const script=document.createElement('script');
    script.text=code;document.head.appendChild(script);script.remove();
    if(!window.pako||typeof window.pako.ungzip!=='function')throw new Error('DESCOMPACTADOR_NAO_INICIALIZOU');
    return window.pako;
  })();
  try{return await pakoPromise;}catch(err){pakoPromise=null;throw err;}
}
async function decodeGzip(bytes){
  const pako=await ensurePako();
  let out;
  try{out=pako.ungzip(bytes);}catch(err){throw new Error('GZIP_FALHOU: '+(err&&err.message||err));}
  return new TextDecoder('utf-8').decode(out);
}
function mergeExtra(base,extra){
  if(!base||!Array.isArray(base.d)||!Array.isArray(base.r)||!extra||!Array.isArray(extra.d)||!Array.isArray(extra.r))return base;
  const rowPos=[1,2,3,4,6,12,13,14];
  const maps=[];
  for(let di=0;di<8;di++){
    const target=base.d[di]||(base.d[di]=[]);
    const idx=new Map(target.map((v,i)=>[v,i]));
    maps[di]=extra.d[di].map(v=>{
      if(idx.has(v))return idx.get(v);
      const n=target.length;target.push(v);idx.set(v,n);return n;
    });
  }
  const existing=new Set(base.r.map(r=>JSON.stringify(r)));
  for(const row of extra.r){
    const nr=row.slice();
    rowPos.forEach((pos,di)=>{nr[pos]=maps[di][row[pos]];});
    const key=JSON.stringify(nr);
    if(!existing.has(key)){base.r.push(nr);existing.add(key);}
  }
  base.to=extra.to||base.to;
  return base;
}
async function loadExtra(base){
  const r=await fetch('./'+EXTRA_FILE+'?v='+VERSION,{cache:'no-store'});
  if(!r.ok)throw new Error('EXTRA_2308_HTTP_'+r.status);
  const extra=await r.json();
  const merged=mergeExtra(base,extra);
  const count2308=merged.r.filter(x=>x[0]==='2026-08-23').length;
  if(count2308!==21)throw new Error('EXTRA_2308_DIVERGENTE_'+count2308);
  if(merged.r.length!==3394)throw new Error('TOTAL_ESPERADO_3394_RECEBIDO_'+merged.r.length);
  return merged;
}
async function loadCaptaUpAnnual(){
  if(annualPromise)return annualPromise;
  annualPromise=(async()=>{
    stage('Carregando base anual...');
    const mres=await fetch('./data-2026-full.json?v='+VERSION,{cache:'no-store'});
    if(!mres.ok)throw new Error('MANIFESTO_HTTP_'+mres.status);
    const manifest=await mres.json();
    let data;
    if(manifest.encoding!=='gzip-base64-chunks'){
      if(!manifest||!Array.isArray(manifest.r))throw new Error('BASE_JSON_INVALIDA');
      data=manifest;
    }else{
      const parts=[];
      for(const file of manifest.chunks){
        const r=await fetch('./'+file+'?v='+VERSION,{cache:'no-store'});
        if(!r.ok)throw new Error('BLOCO_HTTP_'+r.status+'_'+file);
        parts.push((await r.text()).replace(/\s+/g,''));
      }
      const b64=parts.join('');
      let bin;try{bin=atob(b64);}catch{throw new Error('BASE64_INVALIDO');}
      const bytes=new Uint8Array(bin.length);
      for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
      const text=await decodeGzip(bytes);
      try{data=JSON.parse(text);}catch(err){throw new Error('JSON_ANUAL_INVALIDO: '+(err&&err.message||err));}
    }
    if(!data||!Array.isArray(data.r))throw new Error('BASE_ANUAL_SEM_REGISTROS');
    stage('Somando resultado de 23/08...');
    data=await loadExtra(data);
    stage('3.394 casais · base até 23/08/2026');
    return data;
  })();
  try{return await annualPromise;}catch(err){annualPromise=null;showTechnicalError(err);throw err;}
}
window.loadCaptaUpAnnual=loadCaptaUpAnnual;
})();