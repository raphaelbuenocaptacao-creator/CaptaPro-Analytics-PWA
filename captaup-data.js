(function(){
'use strict';
let annualPromise=null;
let pakoPromise=null;
const VERSION='20260823-android-fix3';
const LOCAL_PAKO=['vendor/pako.part1.txt','vendor/pako.part2.txt','vendor/pako.part3.txt'];

function stage(text){
  window.__captaupDataStage=text;
  const el=document.getElementById('loadStatus');
  if(el&&(!el.textContent||/carregando|erro|preparando|baixando|abrindo/i.test(el.textContent)))el.textContent=text;
}
function showTechnicalError(err){
  const msg=String(err&&err.message||err||'ERRO_DESCONHECIDO');
  window.__captaupDataError=msg;
  stage('Erro na base: '+msg);
  setTimeout(()=>{
    const main=document.querySelector('main');
    if(!main)return;
    let box=document.getElementById('captaupDataDiagnostic');
    if(!box){box=document.createElement('div');box.id='captaupDataDiagnostic';box.className='info';main.insertBefore(box,main.firstChild);}
    box.innerHTML='<b>Diagnóstico da base:</b> '+msg;
  },0);
}

async function ensurePako(){
  if(window.pako&&typeof window.pako.ungzip==='function')return window.pako;
  if(pakoPromise)return pakoPromise;
  pakoPromise=(async()=>{
    stage('Preparando base anual...');
    const parts=[];
    for(const file of LOCAL_PAKO){
      const r=await fetch('./'+file+'?v='+VERSION,{cache:'no-store'});
      if(!r.ok)throw new Error('DESCOMPACTADOR_LOCAL_HTTP_'+r.status+'_'+file);
      parts.push(await r.text());
    }
    const code=parts.join('');
    if(code.length<22000)throw new Error('DESCOMPACTADOR_LOCAL_INCOMPLETO_'+code.length);
    try{
      const script=document.createElement('script');
      script.id='captaup-pako-local';
      script.text=code;
      document.head.appendChild(script);
      script.remove();
    }catch(err){throw new Error('DESCOMPACTADOR_LOCAL_EXECUCAO: '+(err&&err.message||err));}
    if(!window.pako||typeof window.pako.ungzip!=='function')throw new Error('DESCOMPACTADOR_LOCAL_NAO_INICIALIZOU');
    return window.pako;
  })();
  try{return await pakoPromise;}catch(err){pakoPromise=null;throw err;}
}

async function decodeGzip(bytes){
  stage('Abrindo 3.373 registros...');
  const pako=await ensurePako();
  let out;
  try{out=pako.ungzip(bytes);}catch(err){throw new Error('GZIP_FALHOU: '+(err&&err.message||err));}
  try{return new TextDecoder('utf-8').decode(out);}catch(err){
    let s='';
    for(let i=0;i<out.length;i+=8192)s+=String.fromCharCode.apply(null,out.subarray(i,Math.min(out.length,i+8192)));
    try{return decodeURIComponent(escape(s));}catch{return s;}
  }
}

async function loadCaptaUpAnnual(){
  if(annualPromise)return annualPromise;
  annualPromise=(async()=>{
    stage('Carregando base anual...');
    const mres=await fetch('./data-2026-full.json?v='+VERSION,{cache:'no-store'});
    if(!mres.ok)throw new Error('MANIFESTO_HTTP_'+mres.status);
    const manifest=await mres.json();
    if(manifest.encoding!=='gzip-base64-chunks'){
      if(!manifest||!Array.isArray(manifest.r))throw new Error('BASE_JSON_INVALIDA');
      return manifest;
    }
    if(!Array.isArray(manifest.chunks)||!manifest.chunks.length)throw new Error('MANIFESTO_SEM_BLOCOS');
    stage('Baixando dados anuais...');
    const parts=[];
    for(const file of manifest.chunks){
      const r=await fetch('./'+file+'?v='+VERSION,{cache:'no-store'});
      if(!r.ok)throw new Error('BLOCO_HTTP_'+r.status+'_'+file);
      const txt=(await r.text()).replace(/\s+/g,'');
      if(!txt)throw new Error('BLOCO_VAZIO_'+file);
      parts.push(txt);
    }
    const b64=parts.join('');
    let bin;
    try{bin=atob(b64);}catch(err){throw new Error('BASE64_INVALIDO');}
    const bytes=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
    const text=await decodeGzip(bytes);
    let data;
    try{data=JSON.parse(text);}catch(err){throw new Error('JSON_ANUAL_INVALIDO: '+(err&&err.message||err));}
    if(!data||!Array.isArray(data.r))throw new Error('BASE_ANUAL_SEM_REGISTROS');
    if(manifest.records&&data.r.length!==manifest.records)throw new Error('BASE_INCOMPLETA_'+data.r.length+'_DE_'+manifest.records);
    if(data.r.length!==3373)throw new Error('TOTAL_ANUAL_DIVERGENTE_'+data.r.length);
    stage('Base anual pronta');
    return data;
  })();
  try{return await annualPromise;}catch(err){annualPromise=null;showTechnicalError(err);throw err;}
}
window.loadCaptaUpAnnual=loadCaptaUpAnnual;
})();