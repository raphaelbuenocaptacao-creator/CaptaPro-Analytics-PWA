(function(){
'use strict';
let annualPromise=null;
const VERSION='20260823-android-fix1';

async function ensurePako(){
  if(window.pako&&typeof window.pako.ungzip==='function')return window.pako;
  await new Promise((resolve,reject)=>{
    const existing=document.getElementById('captaup-pako');
    if(existing){
      existing.addEventListener('load',resolve,{once:true});
      existing.addEventListener('error',()=>reject(new Error('Falha ao carregar descompactador compatível.')),{once:true});
      return;
    }
    const s=document.createElement('script');
    s.id='captaup-pako';
    s.src='https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js';
    s.async=true;
    s.onload=resolve;
    s.onerror=()=>reject(new Error('Falha ao carregar descompactador compatível.'));
    document.head.appendChild(s);
  });
  if(!window.pako||typeof window.pako.ungzip!=='function')throw new Error('Descompactador não disponível.');
  return window.pako;
}

async function decodeGzip(bytes){
  if(typeof DecompressionStream!=='undefined'){
    try{
      const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
      const text=await new Response(stream).text();
      if(text&&text.trim().startsWith('{'))return text;
    }catch(err){console.warn('CAPTAUP: descompactação nativa falhou, usando fallback.',err);}
  }
  const pako=await ensurePako();
  const out=pako.ungzip(bytes);
  return new TextDecoder('utf-8').decode(out);
}

async function loadCaptaUpAnnual(){
  if(annualPromise)return annualPromise;
  annualPromise=(async()=>{
    const mres=await fetch('./data-2026-full.json?v='+VERSION,{cache:'no-store'});
    if(!mres.ok)throw new Error('Falha ao carregar data-2026-full.json: HTTP '+mres.status);
    const manifest=await mres.json();
    if(manifest.encoding!=='gzip-base64-chunks')return manifest;
    if(!Array.isArray(manifest.chunks)||!manifest.chunks.length)throw new Error('Manifesto anual sem blocos de dados.');

    const parts=await Promise.all(manifest.chunks.map(async f=>{
      const r=await fetch('./'+f+'?v='+VERSION,{cache:'no-store'});
      if(!r.ok)throw new Error('Falha ao carregar '+f+': HTTP '+r.status);
      return (await r.text()).replace(/\s+/g,'');
    }));

    const b64=parts.join('');
    let bin;
    try{bin=atob(b64);}catch(err){throw new Error('Base anual codificada de forma inválida.');}
    const bytes=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);

    const text=await decodeGzip(bytes);
    const data=JSON.parse(text);
    if(!data||!Array.isArray(data.r))throw new Error('Base anual inválida.');
    if(manifest.records&&data.r.length!==manifest.records)throw new Error('Base anual incompleta: '+data.r.length+' de '+manifest.records+' registros.');
    if(data.r.length!==3373)console.warn('CAPTAUP: quantidade anual diferente de 3373:',data.r.length);
    return data;
  })();
  try{return await annualPromise;}catch(err){annualPromise=null;throw err;}
}

window.loadCaptaUpAnnual=loadCaptaUpAnnual;
})();
