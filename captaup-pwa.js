(function(){
'use strict';
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js?v=15-top10').catch(console.error));}
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;mountInstall();});
window.addEventListener('appinstalled',()=>{const b=document.getElementById('installCaptaUp');if(b){b.textContent='App instalado';b.disabled=true;}});

function mountInstall(){
  const top=document.querySelector('.top');
  if(!top||document.getElementById('installCaptaUp'))return;
  const b=document.createElement('button');
  b.id='installCaptaUp';b.className='btn primary';
  b.textContent=matchMedia('(display-mode: standalone)').matches?'App instalado':'Instalar App';
  b.style.whiteSpace='nowrap';
  b.onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();try{await deferredPrompt.userChoice}catch{}deferredPrompt=null;}else alert(/iphone|ipad|ipod/i.test(navigator.userAgent)?'No iPhone/iPad: Safari → Compartilhar → Adicionar à Tela de Início.':'Use o menu do navegador → Instalar CAPTAUP.');};
  top.appendChild(b);
}

function style(){
  if(document.getElementById('captaup-orbit-css'))return;
  const s=document.createElement('style');
  s.id='captaup-orbit-css';
  s.textContent=`
  .cu-holo{position:relative;min-height:610px;margin-bottom:14px;border:1px solid #20699d;border-radius:24px;overflow:hidden;background:radial-gradient(circle at 50% 50%,#123e64 0,#0a2740 23%,#071824 48%,#04090f 82%);box-shadow:0 26px 90px #000c,inset 0 0 110px #1683ff20}
  .cu-holo:before{content:"";position:absolute;inset:0;background-image:linear-gradient(#1683ff0b 1px,transparent 1px),linear-gradient(90deg,#1683ff0b 1px,transparent 1px);background-size:34px 34px;mask-image:radial-gradient(circle,#000 28%,transparent 86%);pointer-events:none}
  .cu-holo:after{content:"";position:absolute;inset:22% 12%;border-radius:50%;background:radial-gradient(circle,#2ba8ff16 0,transparent 66%);filter:blur(10px);pointer-events:none}
  .cu-head{position:absolute;left:22px;top:20px;right:22px;z-index:12}
  .cu-eyebrow{font-size:9px;letter-spacing:2.2px;color:#75d4ff;font-weight:900}
  .cu-title{font-size:22px;font-weight:950;margin-top:5px;letter-spacing:-.3px}
  .cu-sub{font-size:10px;color:#9ab4c9;margin-top:5px;line-height:1.45}
  .cu-corewrap{position:absolute;left:50%;top:55%;width:430px;height:430px;transform:translate(-50%,-50%)}
  .cu-ring{position:absolute;border-radius:50%;border:1px solid #299dff72;inset:20px;animation:cuSpin 34s linear infinite;box-shadow:0 0 26px #1683ff1f,inset 0 0 30px #1683ff12}
  .cu-ring.r2{inset:74px;border-style:dashed;border-color:#62c9ff5e;animation-duration:24s;animation-direction:reverse}
  .cu-ring.r3{inset:128px;border-color:#8bdcff6e;animation-duration:17s;box-shadow:0 0 34px #37b9ff28,inset 0 0 34px #37b9ff15}
  .cu-core{position:absolute;left:50%;top:50%;width:170px;height:170px;transform:translate(-50%,-50%);border-radius:50%;display:grid;place-items:center;text-align:center;background:radial-gradient(circle at 38% 30%,#3b9ee5,#0d4f7d 42%,#071b2b 78%);border:1px solid #b4e9ffcc;box-shadow:0 0 42px #1683ff99,0 0 130px #1683ff3b,inset 0 0 42px #a2e5ff1d;z-index:6}
  .cu-core:before{content:"";position:absolute;inset:11px;border-radius:50%;border:1px solid #a8e5ff4f;box-shadow:inset 0 0 24px #1683ff22}
  .cu-core b{font-size:34px;letter-spacing:4px;text-shadow:0 0 20px #c5efff}
  .cu-core small{display:block;font-size:8px;letter-spacing:1.8px;color:#b7e7ff;margin-top:4px}
  .cu-core em{display:block;font-style:normal;font-size:9px;color:#77ccf7;margin-top:7px;font-weight:800}
  .cu-orbit{--r:184px;--a:0deg;--d:28s;position:absolute;left:50%;top:50%;width:42px;height:42px;margin:-21px;border-radius:50%;border:1px solid #e7faff;background:radial-gradient(circle at 35% 28%,#fff,#82d9ff 38%,#2087d2 70%,#0d5792 100%);color:#03111d;font-size:12px;font-weight:950;display:grid;place-items:center;box-shadow:0 0 16px #6ed0ff,0 0 36px #1683ff70;z-index:8;cursor:pointer;animation:cuOrbit var(--d) linear infinite;animation-delay:calc(var(--i) * -2.1s);transition:filter .2s,box-shadow .2s,scale .2s}
  .cu-orbit:hover,.cu-orbit:focus{animation-play-state:paused;z-index:30;filter:brightness(1.28);scale:1.12;box-shadow:0 0 22px #fff,0 0 52px #1683ff;outline:none}
  .cu-orbit:after{content:attr(data-tip);position:absolute;left:50%;top:-46px;transform:translateX(-50%);padding:7px 10px;border-radius:9px;background:#06111df5;border:1px solid #2f8fc9;color:#edfaff;font-size:9px;font-weight:800;white-space:nowrap;opacity:0;pointer-events:none;box-shadow:0 10px 28px #000b}
  .cu-orbit:hover:after,.cu-orbit:focus:after{opacity:1}
  .cu-legend{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);font-size:9px;letter-spacing:1.1px;color:#7597b0;text-transform:uppercase;white-space:nowrap}
  @keyframes cuSpin{to{transform:rotate(360deg)}}
  @keyframes cuOrbit{from{transform:rotate(var(--a)) translateX(var(--r)) rotate(calc(-1 * var(--a)))}to{transform:rotate(calc(var(--a) + 360deg)) translateX(var(--r)) rotate(calc(-1 * (var(--a) + 360deg)))}}
  @media(max-width:800px){.cu-holo{min-height:585px}.cu-corewrap{width:360px;height:360px;top:55%}.cu-core{width:150px;height:150px}.cu-core b{font-size:30px}.cu-orbit{width:38px;height:38px;margin:-19px;font-size:11px}}
  @media(max-width:560px){.cu-holo{min-height:545px;border-radius:20px}.cu-head{left:16px;top:16px;right:14px}.cu-title{font-size:18px}.cu-sub{font-size:9px;max-width:92%}.cu-corewrap{width:318px;height:318px;top:56%}.cu-core{width:136px;height:136px}.cu-core b{font-size:27px}.cu-orbit{width:34px;height:34px;margin:-17px;font-size:10px}.cu-legend{font-size:7px;bottom:11px}.cu-orbit:after{font-size:8px;max-width:210px;overflow:hidden;text-overflow:ellipsis}}
  @media(prefers-reduced-motion:reduce){.cu-ring,.cu-orbit{animation:none!important}}
  `;
  document.head.appendChild(s);
}

function moneyText(v){return (v||'').trim()||'R$ 0,00';}
function getProfessionals(){
  return [...document.querySelectorAll('#promotorTable tbody tr')]
    .map((tr,i)=>({rank:i+1,name:(tr.cells[1]?.textContent||'').trim(),vgv:moneyText(tr.cells[3]?.textContent||''),casais:(tr.cells[2]?.textContent||'').trim()}))
    .filter(x=>x.name&&x.name!=='Não informado')
    .slice(0,10);
}
function radiusFor(){
  const w=window.innerWidth||1024;
  return w<=560?132:w<=800?154:184;
}
function syncOrbit(){
  const wrap=document.getElementById('cuOrbitLayer');if(!wrap)return;
  const list=getProfessionals();
  const total=list.length;
  const r=radiusFor();
  wrap.innerHTML=list.map((p,i)=>{
    const angle=-90+(i*360/Math.max(1,total));
    const d=28+(i%3)*2.5;
    return `<button class="cu-orbit" type="button" style="--r:${r}px;--a:${angle}deg;--d:${d}s;--i:${i}" data-name="${escapeHtml(p.name)}" data-tip="${p.rank}º • ${escapeHtml(p.name)} • ${escapeHtml(p.vgv)}">${p.rank}</button>`;
  }).join('');
  wrap.querySelectorAll('.cu-orbit').forEach(b=>b.addEventListener('click',()=>openProfile(b.dataset.name)));
  const c=document.getElementById('cuCount');if(c)c.textContent=total?'Top '+total+' profissionais':'carregando...';
}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function openProfile(name){
  const sel=document.getElementById('proSelect');
  if(sel){const opt=[...sel.options].find(o=>o.value===name||o.textContent.trim()===name);if(opt){sel.value=opt.value;sel.dispatchEvent(new Event('change',{bubbles:true}));}}
  const nav=document.querySelector('[data-page="profissional"]');if(nav)nav.click();
  setTimeout(()=>document.getElementById('profileName')?.scrollIntoView({behavior:'smooth',block:'start'}),80);
}
function mount(){
  mountInstall();style();
  const page=document.getElementById('page-visao');if(!page||document.getElementById('cuHolo'))return;
  const box=document.createElement('div');
  box.id='cuHolo';box.className='cu-holo';
  box.innerHTML=`<div class="cu-head"><div class="cu-eyebrow">CAPTAUP • PERFORMANCE LIVE</div><div class="cu-title">Top 10 Performance 360°</div><div class="cu-sub">Os 10 primeiros por VGV líquido ativo • toque em uma bolinha para abrir a ficha completa</div></div><div class="cu-corewrap"><div class="cu-ring r1"></div><div class="cu-ring r2"></div><div class="cu-ring r3"></div><div id="cuOrbitLayer"></div><div class="cu-core"><div><b>UP</b><small>CAPTAUP 360°</small><em id="cuCount">carregando...</em></div></div></div><div class="cu-legend">ordem das bolinhas = ranking por VGV líquido ativo</div>`;
  const kpis=page.querySelector('.kpis');if(kpis)page.insertBefore(box,kpis);else page.prepend(box);
  syncOrbit();
  const table=document.getElementById('promotorTable');if(table)new MutationObserver(()=>requestAnimationFrame(syncOrbit)).observe(table,{childList:true,subtree:true});
  document.addEventListener('change',e=>{if(e.target&&['start','end','promotor','liner','closer','local'].includes(e.target.id))setTimeout(syncOrbit,60)});
  window.addEventListener('resize',()=>setTimeout(syncOrbit,90));
  setTimeout(syncOrbit,350);setTimeout(syncOrbit,900);setTimeout(syncOrbit,1800);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
