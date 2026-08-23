(function(){
'use strict';
let annualPromise=null;
async function loadCaptaUpAnnual(){
  if(annualPromise)return annualPromise;
  annualPromise=(async()=>{
    const mres=await fetch('./data-2026-full.json?v=20260823-annual',{cache:'no-store'});
    if(!mres.ok)throw new Error('Falha ao carregar data-2026-full.json: HTTP '+mres.status);
    const manifest=await mres.json();
    if(manifest.encoding!=='gzip-base64-chunks')return manifest;
    const parts=await Promise.all(manifest.chunks.map(async f=>{
      const r=await fetch('./'+f+'?v=20260823-annual',{cache:'no-store'});
      if(!r.ok)throw new Error('Falha ao carregar '+f+': HTTP '+r.status);
      return (await r.text()).trim();
    }));
    const b64=parts.join('');
    const bin=atob(b64),bytes=new Uint8Array(bin.length);
    for(let i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);
    if(typeof DecompressionStream==='undefined')throw new Error('Navegador sem suporte à descompactação da base anual.');
    const stream=new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    const text=await new Response(stream).text();
    const data=JSON.parse(text);
    if(!data||!Array.isArray(data.r)||data.r.length!==manifest.records)throw new Error('Base anual incompleta.');
    return data;
  })();
  return annualPromise;
}
window.loadCaptaUpAnnual=loadCaptaUpAnnual;
})();
