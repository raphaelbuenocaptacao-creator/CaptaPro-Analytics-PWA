(function(){
'use strict';
let annualPromise=null;
let pakoPromise=null;
const VERSION='20260823-safe2308-v2';
const LOCAL_PAKO=['vendor/pako.part1.txt','vendor/pako.part2.txt','vendor/pako.part3.txt'];
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
async function ensurePako(){
  if(window.pako&&typeof window.pako.ungzip==='function')return window.pako;
  if(pakoPromise)return pakoPromise;
  pakoPromise=(async()=>{
    const parts=[];
    for(const file of LOCAL_PAKO){
      const r=await fetch('./'+file+'?v='+VERSION,{cache:'no-store'});
      if(!r.ok)throw new Error('DESCOMPACTADOR_HTTP_'+r.status+'_'+file);
      parts.push(await r.text());
    }
    const code=parts.join('');
    if(code.length<22000)throw new Error('DESCOMPACTADOR_INCOMPLETO_'+code.length);
    const script=document.createElement('script');
    script.id='captaup-pako-local';
    script.text=code;
    document.head.appendChild(script);
    script.remove();
    if(!window.pako||typeof window.pako.ungzip!=='function')throw new Error('DESCOMPACTADOR_NAO_INICIALIZOU');
    return window.pako;
  })();
  try{return await pakoPromise;}catch(err){pakoPromise=null;throw err;}
}
async function decodeGzip(bytes){
  const pako=await ensurePako();
  const out=pako.ungzip(bytes);
  return new TextDecoder('utf-8').decode(out);
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
      const n=target.length;
      target.push(v);
      idx.set(key,n);
      return n;
    });
  }
  const already=base.r.some(r=>r&&r[0]==='2026-08-23');
  if(already){base.to='2026-08-23';return base;}
  for(const row of extra.r){
    const nr=row.slice();
    rowPos.forEach((pos,di)=>{nr[pos]=maps[di][row[pos]];});
    base.r.push(nr);
  }
  base.to=extra.to||'2026-08-23';
  return base;
}
async function tryLoadExtra(base){
  try{
    stage('Somando resultado de 23/08...');
    const r=await fetch('./'+EXTRA_FILE+'?v='+VERSION,{cache:'no-store'});
    if(!r.ok)throw new Error('HTTP_'+r.status);
    const extra=await r.json();
    const before=base.r.length;
    const merged=mergeExtra(base,extra);
    const count=merged.r.filter(x=>x&&x[0]==='2026-08-23').length;
    if(count!==21)throw new Error('REGISTROS_2308_'+count);
    stage(merged.r.length+' casais · base até 23/08/2026');
    window.__captaupExtraStatus={ok:true,before,after:merged.r.length,count2308:count};
    return merged;
  }catch(err){
    rememberError('EXTRA_2308',err);
    stage(base.r.length+' casais · base principal carregada');
    window.__captaupExtraStatus={ok:false,error:String(err&&err.message||err)};
    return base;
  }
}
async function loadBase(){
  stage('Carregando base anual...');
  const mres=await fetch('./data-2026-full.json?v='+VERSION,{cache:'no-store'});
  if(!mres.ok)throw new Error('MANIFESTO_HTTP_'+mres.status);
  const manifest=await mres.json();
  let data;
  if(manifest.encoding!=='gzip-base64-chunks'){
    if(!manifest||!Array.isArray(manifest.r))throw new Error('BASE_JSON_INVALIDA');
    data=manifest;
  }else{
    if(!Array.isArray(manifest.chunks)||!manifest.chunks.length)throw new Error('MANIFESTO_SEM_BLOCOS');
    const parts=[];
    for(const file of manifest.chunks){
      const r=await fetch('./'+file+'?v='+VERSION,{cache:'no-store'});
      if(!r.ok)throw new Error('BLOCO_HTTP_'+r.status+'_'+file);
      const txt=(await r.text()).replace(/\s+/g,'');
      if(!txt)throw new Error('BLOCO_VAZIO_'+file);
      parts.push(txt);
    }
    let bin;
    try{bin=atob(parts.join(''));}catch{throw new Error('BASE64_INVALIDO');}
    const bytes=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
    const text=await decodeGzip(bytes);
    try{data=JSON.parse(text);}catch(err){throw new Error('JSON_ANUAL_INVALIDO_'+(err&&err.message||err));}
  }
  if(!data||!Array.isArray(data.r)||!Array.isArray(data.d))throw new Error('BASE_ANUAL_INVALIDA');
  return data;
}
async function loadCaptaUpAnnual(){
  if(annualPromise)return annualPromise;
  annualPromise=(async()=>{
    const base=await loadBase();
    return await tryLoadExtra(base);
  })();
  try{return await annualPromise;}catch(err){
    annualPromise=null;
    rememberError('BASE_PRINCIPAL',err);
    stage('Erro ao carregar dados');
    throw err;
  }
}
window.loadCaptaUpAnnual=loadCaptaUpAnnual;
})();