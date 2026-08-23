(function(){
'use strict';
if('serviceWorker' in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js?v=13-android').catch(console.error));}
let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;mountInstall();});
window.addEventListener('appinstalled',()=>{const b=document.getElementById('installCaptaUp');if(b){b.textContent='App instalado';b.disabled=true;}});

function mountInstall(){
  const top=document.querySelector('.top');
  if(!top||document.getElementById('installCaptaUp'))return;
  const b=document.createElement('button');b.id='installCaptaUp';b.className='btn primary';
  b.textContent=matchMedia('(display-mode: standalone)').matches?'App instalado':'Instalar App';
  b.style.whiteSpace='nowrap';
  b.onclick=async()=>{if(deferredPrompt){deferredPrompt.prompt();try{await deferredPrompt.userChoice}catch{}deferredPrompt=null;}else alert(/iphone|ipad|ipod/i.test(navigator.userAgent)?'No iPhone/iPad: Safari → Compartilhar → Adicionar à Tela de Início.':'Use o menu do navegador → Instalar CAPTAUP.');};
  top.appendChild(b);
}

function style(){
  if(document.getElementById('captaup-orbit-css'))return;
  const s=document.createElement('style');s.id='captaup-orbit-css';s.textContent=`
  .cu-holo{position:relative;min-height:620px;margin-bottom:12px;border:1px solid #1b4e78;border-radius:20px;overflow:hidden;background:radial-gradient(circle at 50% 51%,#123b5f 0,#0a2238 22%,#071522 43%,#050a10 78%);box-shadow:0 24px 80px #000b,inset 0 0 90px #1683ff20}
  .cu-holo:before{content:"";position:absolute;inset:0;background-image:linear-gradient(#1683ff0d 1px,transparent 1px),linear-gradient(90deg,#1683ff0d 1px,transparent 1px);background-size:38px 38px;mask-image:radial-gradient(circle,#000 28%,transparent 82%);pointer-events:none}
  .cu-head{position:absolute;left:22px;top:18px;z-index:10}.cu-eyebrow{font-size:9px;letter-spacing:2px;color:#73c9ff;font-weight:900}.cu-title{font-size:20px;font-weight:900;margin-top:4px}.cu-sub{font-size:10px;color:#8aa2b8;margin-top:4px}
  .cu-corewrap{position:absolute;left:50%;top:53%;width:420px;height:420px;transform:translate(-50%,-50%)}
  .cu-ring{position:absolute;border-radius:50%;border:1px solid #1683ff7a;inset:4px;animation:cuSpin 30s linear infinite;box-shadow:0 0 22px #1683ff18,inset 0 0 28px #1683ff10}.cu-ring.r2{inset:68px;border-style:dashed;border-color:#39b8ff66;animation-duration:21s;animation-direction:reverse}.cu-ring.r3{inset:128px;border-color:#75d9ff70;animation-duration:14s;box-shadow:0 0 28px #37b9ff20,inset 0 0 28px #37b9ff18}
  .cu-core{position:absolute;left:50%;top:50%;width:158px;height:158px;transform:translate(-50%,-50%);border-radius:50%;display:grid;place-items:center;text-align:center;background:radial-gradient(circle at 38% 32%,#2d8bd3,#0c4169 42%,#071725 76%);border:1px solid #91dcffbb;box-shadow:0 0 38px #1683ff8a,0 0 120px #1683ff35,inset 0 0 36px #8bdcff1b;z-index:5}.cu-core:before{content:"";position:absolute;inset:10px;border-radius:50%;border:1px solid #8edaff45;box-shadow:inset 0 0 22px #1683ff20}.cu-core b{font-size:30px;letter-spacing:3px;text-shadow:0 0 18px #8edaff}.cu-core small{display:block;font-size:8px;letter-spacing:1.7px;color:#a8e2ff;margin-top:4px}.cu-core em{display:block;font-style:normal;font-size:9px;color:#74c9f5;margin-top:6px}
  .cu-orbit{--r:178px;--a:0deg;--d:22s;position:absolute;left:50%;top:50%;width:30px;height:30px;margin:-15px;border-radius:50%;border:1px solid #e2f7ff;background:radial-gradient(circle at 35% 30%,#fff,#6ed0ff 40%,#1677c6 76%);color:#04111d;font-size:9px;font-weight:950;display:grid;place-items:center;box-shadow:0 0 13px #6ed0ff,0 0 30px #1683ff66;z-index:7;cursor:pointer;animation:cuOrbit var(--d) linear infinite;animation-delay:calc(var(--i) * -0.65s)}
  .cu-orbit:hover{animation-play-state:paused;z-index:30;filter:brightness(1.25);box-shadow:0 0 18px #fff,0 0 44px #1683ff}
  .cu-orbit:after{content:attr(data-tip);position:absolute;left:50%;top:-40px;transform:translateX(-50%);padding:6px 8px;border-radius:7px;background:#07111cf2;border:1px solid #2b78aa;color:#e8f8ff;font-size:9px;font-weight:700;white-space:nowrap;opacity:0;pointer-events:none;box-shadow:0 8px 24px #000a}.cu-orbit:hover:after{opacity:1}
  .cu-legend{position:absolute;left:50%;bottom:18px;transform:translateX(-50%);font-size:9px;letter-spacing:1.1px;color:#6e8fa9;text-transform:uppercase;white-space:nowrap}
  @keyframes cuSpin{to{transform:rotate(360deg)}}@keyframes cuOrbit{from{transform:rotate(var(--a)) translateX(var(--r)) rotate(calc(-1 * var(--a)))}to{transform:rotate(calc(var(--a) + 360deg)) translateX(var(--r)) rotate(calc(-1 * (var(--a) + 360deg)))}}
  @media(max-width:800px){.cu-holo{min-height:590px}.cu-corewrap{width:350px;height:350px;top:52%}.cu-orbit{width:28px;height:28px;margin:-14px;font-size:8px}.cu-core{width:142px;height:142px}.cu-core b{font-size:27px}}
  @media(max-width:560px){.cu-holo{min-height:560px}.cu-head{left:16px;top:16px;right:14px}.cu-title{font-size:18px}.cu-sub{line-height:1.35}.cu-corewrap{width:310px;height:310px;top:54%}.cu-core{width:132px;height:132px}.cu-core b{font-size:26px}.cu-legend{font-size:7px;bottom:11px}.cu-orbit:after{font-size:8px;max-width:210px;overflow:hidden;text-overflow:ellipsis}}
  @media(prefers-reduced-motion:reduce){.cu-ring,.cu-orbit{animation:none!important}}
  `;document.head.appendChild(s);
}

function moneyText(v){return (v||'').trim()||'R$ 0,00';}
function getProfessionals(){
  return [...document.querySelectorAll('#promotorTable tbody tr')].map((tr,i)=>({rank:i+1,name:(tr.cells[1]?.textContent||'').trim(),vgv:moneyText(tr.cells[3]?.textContent||''),casais:(tr.cells[2]?.textContent||'').trim()})).filter(x=>x.name&&x.name!=='Não informado');
}
function radiusFor(i,total){
  const w=window.innerWidth||1024;
  const rings=w<=560?[78,105,132,150]:w<=800?[90,122,150,168]:[105,140,176,198];
  return rings[i%rings.length];
}
function syncOrbit(){
  const wrap=document.getElementById('cuOrbitLayer');if(!wrap)return;
  const list=getProfessionals();
  wrap.innerHTML=list.map((p,i)=>{const total=list.length,angle=(i*360/Math.max(1,total))+(i%4)*17,r=radiusFor(i,total),d=16+(i%9)*1.8;return `<button class="cu-orbit" type="button" style="--r:${r}px;--a:${angle}deg;--d:${d}s;--i:${i}" data-name="${escapeHtml(p.name)}" data-tip="${p.rank}º • ${escapeHtml(p.name)} • ${escapeHtml(p.vgv)}">${p.rank}</button>`}).join('');
  wrap.querySelectorAll('.cu-orbit').forEach(b=>b.addEventListener('click',()=>openProfile(b.dataset.name)));
  const c=document.getElementById('cuCount');if(c)c.textContent=list.length+' profissionais';
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
  const box=document.createElement('div');box.id='cuHolo';box.className='cu-holo';box.innerHTML=`<div class="cu-head"><div class="cu-eyebrow">CAPTAUP • PERFORMANCE LIVE</div><div class="cu-title">Central de Performance 360°</div><div class="cu-sub">Todos os profissionais orbitando • toque em uma bolinha para abrir a ficha completa</div></div><div class="cu-corewrap"><div class="cu-ring r1"></div><div class="cu-ring r2"></div><div class="cu-ring r3"></div><div id="cuOrbitLayer"></div><div class="cu-core"><div><b>UP</b><small>CAPTAUP 360°</small><em id="cuCount">carregando...</em></div></div></div><div class="cu-legend">ordem das bolinhas = ranking por VGV líquido ativo</div>`;
  const kpis=page.querySelector('.kpis');if(kpis)page.insertBefore(box,kpis);else page.prepend(box);
  syncOrbit();
  const table=document.getElementById('promotorTable');if(table)new MutationObserver(()=>requestAnimationFrame(syncOrbit)).observe(table,{childList:true,subtree:true});
  document.addEventListener('change',e=>{if(e.target&&['start','end','promotor','liner','closer','local'].includes(e.target.id))setTimeout(syncOrbit,50)});
  window.addEventListener('resize',()=>setTimeout(syncOrbit,80));
  setTimeout(syncOrbit,400);setTimeout(syncOrbit,1200);setTimeout(syncOrbit,2500);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();
