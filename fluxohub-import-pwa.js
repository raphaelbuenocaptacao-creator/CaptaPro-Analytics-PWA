(()=>{
'use strict';
const KEY='fluxohubImportedDataV4';
const oldKey='fluxohubImportedDataV3';
const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
const $=id=>document.getElementById(id);
const validFile=f=>f&&(/\.(csv|xlsx|xls)$/i.test(f.name));
let deferred=null;

function loadSheetJS(){
  if(window.XLSX)return Promise.resolve();
  return new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
    s.onload=resolve;
    s.onerror=()=>reject(new Error('Não foi possível carregar o leitor Excel. Verifique a internet e tente novamente.'));
    document.head.appendChild(s);
  });
}
function findHeader(matrix){
  for(let i=0;i<Math.min(matrix.length,30);i++){
    const row=(matrix[i]||[]).map(norm);
    const prom=row.some(x=>x.includes('promotor de marketing')||x==='promotor'||x.includes('captador'));
    const vgv=row.some(x=>x.includes('valor vendido')||x==='vgv'||x.includes('valor venda')||x.includes('valor_vendido'));
    const date=row.some(x=>x.includes('data de atendimento')||x==='data');
    if((prom&&vgv)||(prom&&date))return i;
  }
  return Math.min(2,Math.max(0,matrix.length-1));
}
function validRows(rows){
  if(!Array.isArray(rows)||rows.length<1)return false;
  const keys=Object.keys(rows[0]||{}).map(norm);
  const hasProm=keys.some(k=>k.includes('promotor')||k.includes('captador'));
  const hasDate=keys.some(k=>k.includes('data de atendimento')||k==='data');
  const hasValue=keys.some(k=>k.includes('valor vendido')||k==='vgv'||k.includes('valor_vendido'));
  return hasProm&&(hasValue||hasDate);
}
function cleanRows(rows){
  return rows.filter(r=>Object.values(r||{}).some(v=>String(v??'').trim()!=='')).filter(r=>Object.keys(r||{}).some(k=>norm(k).includes('promotor')||norm(k).includes('captador')||norm(k).includes('data de atendimento')));
}
function saveImported(rows){
  localStorage.setItem(KEY,JSON.stringify(rows));
  localStorage.removeItem(oldKey);
}
function getSaved(){return localStorage.getItem(KEY)||localStorage.getItem(oldKey)}
function restoreSaved(){
  const saved=getSaved();
  if(!saved||typeof prep!=='function')return;
  try{
    const raw=JSON.parse(saved);
    if(!Array.isArray(raw)||!raw.length)return;
    if(typeof __DATA__!=='undefined')__DATA__=raw;
    if(typeof DATA!=='undefined')DATA=raw.map(prep);
    const ds=raw.map(prep).map(x=>x._date||x.date).filter(Boolean).sort();
    if(ds.length){if($('start'))$('start').value=ds[0];if($('end'))$('end').value=ds.at(-1)}
    if(typeof render==='function')render();
    window.dispatchEvent(new Event('fluxohub:filters-updated'));
  }catch(e){console.error('FluxoHub restore',e)}
}
async function handle(file){
  if(!validFile(file)){alert('Selecione uma planilha .xlsx, .xls ou .csv.');return;}
  const before=getSaved();
  try{
    await loadSheetJS();
    const buf=await file.arrayBuffer();
    const wb=XLSX.read(buf,{type:'array',cellDates:true,raw:false});
    if(!wb.SheetNames.length)throw new Error('A planilha não possui nenhuma aba.');
    const ws=wb.Sheets[wb.SheetNames[0]];
    const matrix=XLSX.utils.sheet_to_json(ws,{header:1,defval:'',raw:false});
    if(!matrix.length)throw new Error('A planilha está vazia.');
    const headerRow=findHeader(matrix);
    const imported=cleanRows(XLSX.utils.sheet_to_json(ws,{range:headerRow,defval:'',raw:false}));
    if(!validRows(imported))throw new Error('Não encontrei as colunas da base (Promotor + Valor vendido/VGV ou Data de atendimento).');
    if(imported.length<2)throw new Error('A planilha não contém registros suficientes para importar.');
    saveImported(imported);
    alert(`Importação concluída com sucesso: ${imported.length.toLocaleString('pt-BR')} registros.\n\nCabeçalho identificado na linha ${headerRow+1}.`);
    location.reload();
  }catch(e){
    if(before) localStorage.setItem(KEY,before);
    else localStorage.removeItem(KEY);
    console.error('FluxoHub import',e);
    alert(`IMPORTAÇÃO NÃO REALIZADA.\n\n${e.message}\n\nOs dados atuais foram preservados.`);
  }
}
function installImport(){
  const input=$('file'),btn=$('importBtn');
  if(!input||!btn)return;
  input.setAttribute('accept','.csv,.xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel');
  btn.type='button';
  btn.textContent='Importar Excel/CSV';
  input.addEventListener('change',e=>{
    e.stopImmediatePropagation();
    const f=e.target.files?.[0];
    if(f)handle(f);
    input.value='';
  },true);
}
function installPWA(){
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;const b=$('installPWA');if(b)b.style.display='inline-flex'});
  window.addEventListener('appinstalled',()=>{deferred=null});
  const btn=$('installPWA');
  if(!btn)return;
  btn.type='button';
  btn.style.display='inline-flex';
  btn.addEventListener('click',async e=>{
    e.preventDefault();e.stopImmediatePropagation();
    if(deferred){deferred.prompt();try{await deferred.userChoice}catch(_){}deferred=null;return;}
    alert('Para instalar o FluxoHub, use o ícone de instalação na barra de endereço do Chrome ou o menu ⋮ → Instalar FluxoHub.');
  },true);
}
function installSafety(){
  document.addEventListener('click',e=>{
    const b=e.target.closest('button');
    if(!b)return;
    b.style.pointerEvents='auto';
  },true);
}
function boot(){installImport();installPWA();installSafety();if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(restoreSaved,150));else setTimeout(restoreSaved,150);}
boot();
})();
