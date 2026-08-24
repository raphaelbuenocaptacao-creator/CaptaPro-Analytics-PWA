(function(){'use strict';
const original=window.loadCaptaUpAnnual;
if(typeof original!=='function')return;
const dictRowPos={0:1,1:2,2:3,3:4,4:6,5:12,6:13,7:14};
function merge(base,extra){
  if(!base||!Array.isArray(base.d)||!Array.isArray(base.r)||!extra||!Array.isArray(extra.d)||!Array.isArray(extra.r))return base;
  const maps=[];
  for(let di=0;di<8;di++){
    const target=base.d[di]||(base.d[di]=[]), idx=new Map(target.map((v,i)=>[v,i]));
    maps[di]=extra.d[di].map(v=>{if(idx.has(v))return idx.get(v);const n=target.length;target.push(v);idx.set(v,n);return n;});
  }
  const existing=new Set(base.r.filter(r=>r[0]==='2026-08-23').map(r=>JSON.stringify(r)));
  for(const row of extra.r){
    const nr=row.slice();
    for(const [di,pos] of Object.entries(dictRowPos))nr[pos]=maps[+di][row[pos]];
    const key=JSON.stringify(nr);if(!existing.has(key)){base.r.push(nr);existing.add(key);}
  }
  base.to=extra.to||base.to;return base;
}
window.loadCaptaUpAnnual=async function(){
  const base=await original();
  try{
    const r=await fetch('./data-extra-2026-08-23.json?v=20260823-extra1',{cache:'no-store'});
    if(!r.ok)return base;
    const extra=await r.json();
    const merged=merge(base,extra);
    const el=document.getElementById('loadStatus');if(el)el.textContent=merged.r.length+' casais · base até 23/08/2026';
    return merged;
  }catch(e){console.warn('CAPTAUP extra 23/08 não carregou',e);return base;}
};
})();