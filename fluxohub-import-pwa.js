(function(){
'use strict';
let deferred=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;});

function brandCAPTAUP(){
  document.title='CAPTAUP | Resultados 360°';
  const brand=document.querySelector('.brand');
  if(brand)brand.innerHTML='CAPTAUP<small>RESULTADOS 360°</small>';
  const mark=document.querySelector('.mark');
  if(mark)mark.textContent='C';
}

function installPWA(){
  const btn=document.getElementById('installPWA');
  if(!btn)return;
  btn.style.display='inline-flex';
  btn.addEventListener('click',async()=>{
    if(deferred){deferred.prompt();try{await deferred.userChoice;}finally{deferred=null;}return;}
    alert('A instalação automática não está disponível neste momento. No Chrome, use o ícone de instalação na barra de endereço ou o menu ⋮ > Instalar CAPTAUP.');
  });
}

function addHoloStyles(){
  if(document.getElementById('captaup-holo-style'))return;
  const s=document.createElement('style');
  s.id='captaup-holo-style';
  s.textContent=`
  .fx-holo{position:relative;min-height:520px;margin:0 0 14px;border:1px solid #18324d;border-radius:18px;overflow:hidden;background:radial-gradient(circle at 50% 48%,#0c243a 0,#08131f 32%,#060b12 72%);box-shadow:0 24px 80px #0009,inset 0 0 70px #0b5ba71c}
  .fx-holo:before{content:"";position:absolute;inset:0;background-image:linear-gradient(#1683ff0c 1px,transparent 1px),linear-gradient(90deg,#1683ff0c 1px,transparent 1px);background-size:38px 38px;mask-image:radial-gradient(circle at center,#000 25%,transparent 78%);pointer-events:none}
  .fx-holo-head{position:absolute;left:22px;top:18px;z-index:8}.fx-holo-eyebrow{font-size:9px;letter-spacing:2.2px;color:#64bbff;text-transform:uppercase;font-weight:900}.fx-holo-title{margin-top:4px;font-size:18px;font-weight:900;color:#f4f8ff}.fx-holo-sub{margin-top:3px;font-size:10px;color:#7890a8}
  .fx-core-wrap{position:absolute;left:50%;top:52%;width:310px;height:310px;transform:translate(-50%,-50%)}
  .fx-ring{position:absolute;inset:0;border-radius:50%;border:1px solid #1683ff75;box-shadow:0 0 22px #1683ff26,inset 0 0 22px #1683ff1c}.fx-ring.r1{inset:18px;border-style:dashed;animation:fxSpin 18s linear infinite}.fx-ring.r2{inset:45px;border-color:#00d4ff66;animation:fxSpinR 11s linear infinite}.fx-ring.r3{inset:77px;border-color:#1683ff3d;animation:fxPulse 3.4s ease-in-out infinite}.fx-ring.r1:before,.fx-ring.r2:before{content:"";position:absolute;width:7px;height:7px;border-radius:50%;background:#5ec4ff;box-shadow:0 0 16px #1683ff;left:50%;top:-4px}
  .fx-core{position:absolute;left:50%;top:50%;width:126px;height:126px;transform:translate(-50%,-50%);border-radius:50%;display:grid;place-items:center;text-align:center;background:radial-gradient(circle at 42% 35%,#1f75bc,#0b3150 42%,#071523 73%);border:1px solid #52baff8c;box-shadow:0 0 28px #1683ff55,0 0 90px #1683ff23,inset 0 0 30px #66c7ff22;z-index:4}.fx-core:before{content:"";position:absolute;inset:8px;border-radius:50%;border:1px solid #8cd6ff55}.fx-core-logo{font-size:27px;font-weight:950;letter-spacing:2px;color:#eaf7ff;text-shadow:0 0 14px #56bcff}.fx-core small{display:block;font-size:7px;letter-spacing:1.6px;color:#89cfff;margin-top:4px}
  .fx-ranker{--r:130px;position:absolute;left:50%;top:50%;width:24px;height:24px;margin:-12px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 35% 30%,#d8f3ff,#47baff 42%,#1269b8 75%);border:1px solid #c7eeff;color:#05111d;font-size:9px;font-weight:950;box-shadow:0 0 13px #52bdff,0 0 30px #1683ff66;z-index:6;cursor:pointer;animation:fxOrbitRank 12s linear infinite;transition:filter .2s,box-shadow .2s}.fx-ranker:hover{filter:brightness(1.25);box-shadow:0 0 18px #fff,0 0 42px #1683ff;z-index:20}.fx-ranker.s1{--r:142px;animation-duration:11s;animation-delay:-2s}.fx-ranker.s2{--r:124px;animation-duration:13s;animation-delay:-7s}.fx-ranker.s3{--r:106px;animation-duration:15s;animation-delay:-11s}.fx-ranker.s4{--r:88px;animation-duration:17s;animation-delay:-4s}.fx-ranker.s5{--r:70px;animation-duration:19s;animation-delay:-14s}
  .fx-ranker:after{content:attr(data-tip);position:absolute;left:50%;top:-33px;transform:translateX(-50%);min-width:max-content;max-width:220px;padding:5px 7px;border-radius:7px;background:#07111cee;border:1px solid #2b6e9d;color:#dff5ff;font-size:8px;font-weight:750;letter-spacing:.2px;opacity:0;pointer-events:none;white-space:nowrap;box-shadow:0 8px 20px #0009}.fx-ranker:hover:after{opacity:1}
  .fx-top5-label{position:absolute;left:50%;top:66%;transform:translateX(-50%);z-index:5;font-size:7px;letter-spacing:1.5px;text-transform:uppercase;color:#4a8fbf;white-space:nowrap}
  .fx-node{position:absolute;z-index:7;min-width:150px;padding:12px 14px;border-radius:12px;border:1px solid #1e5b86;background:linear-gradient(145deg,#0d1e2dcc,#08131dcc);backdrop-filter:blur(10px);box-shadow:0 10px 34px #0008,0 0 24px #1683ff12;transition:.25s ease;cursor:pointer}.fx-node:hover{transform:translateY(-3px) scale(1.02);border-color:#45aef2;box-shadow:0 14px 40px #0009,0 0 30px #1683ff2c}.fx-node span{display:block;font-size:9px;letter-spacing:1px;text-transform:uppercase;color:#7f9ab2;font-weight:850}.fx-node strong{display:block;margin-top:5px;font-size:19px;color:#f6fbff}.fx-node em{display:block;margin-top:4px;font-style:normal;font-size:9px;color:#4faef0}.fx-node.n1{left:8%;top:24%}.fx-node.n2{right:8%;top:24%}.fx-node.n3{left:8%;bottom:18%}.fx-node.n4{right:8%;bottom:18%}
  .fx-link{position:absolute;height:1px;background:linear-gradient(90deg,transparent,#1683ff66,transparent);transform-origin:left center;z-index:2;opacity:.55}.fx-link.l1{width:24%;left:22%;top:35%;transform:rotate(11deg)}.fx-link.l2{width:24%;right:22%;top:35%;transform:rotate(-11deg)}.fx-link.l3{width:24%;left:22%;bottom:29%;transform:rotate(-11deg)}.fx-link.l4{width:24%;right:22%;bottom:29%;transform:rotate(11deg)}.fx-holo-foot{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);font-size:9px;letter-spacing:1.4px;color:#49677f;text-transform:uppercase;white-space:nowrap}
  @keyframes fxSpin{to{transform:rotate(360deg)}}@keyframes fxSpinR{to{transform:rotate(-360deg)}}@keyframes fxPulse{0%,100%{opacity:.45;transform:scale(.97)}50%{opacity:1;transform:scale(1.03)}}@keyframes fxOrbitRank{from{transform:rotate(0deg) translateX(var(--r)) rotate(0deg)}to{transform:rotate(360deg) translateX(var(--r)) rotate(-360deg)}}
  @media(max-width:900px){.fx-holo{min-height:560px}.fx-node{min-width:132px;padding:10px}.fx-node.n1{left:3%;top:19%}.fx-node.n2{right:3%;top:19%}.fx-node.n3{left:3%;bottom:15%}.fx-node.n4{right:3%;bottom:15%}.fx-core-wrap{width:270px;height:270px}.fx-core{width:112px;height:112px}.fx-core-logo{font-size:23px}}
  @media(max-width:620px){.fx-holo{min-height:610px}.fx-holo-head{left:14px;top:14px}.fx-core-wrap{top:45%;width:238px;height:238px}.fx-ranker.s1{--r:112px}.fx-ranker.s2{--r:97px}.fx-ranker.s3{--r:82px}.fx-ranker.s4{--r:67px}.fx-ranker.s5{--r:53px}.fx-top5-label{top:66%}.fx-node{min-width:calc(50% - 20px);max-width:calc(50% - 20px)}.fx-node.n1{left:10px;top:auto;bottom:95px}.fx-node.n2{right:10px;top:auto;bottom:95px}.fx-node.n3{left:10px;bottom:18px}.fx-node.n4{right:10px;bottom:18px}.fx-link{display:none}.fx-holo-foot{display:none}}
  @media(prefers-reduced-motion:reduce){.fx-ring,.fx-ranker{animation:none!important}.fx-node{transition:none}}
  `;
  document.head.appendChild(s);
}

function readMetric(id,fallback='—'){const el=document.getElementById(id),t=(el&&el.textContent||'').trim();return t&&t!=='—'?t:fallback;}
function syncHolo(){const map={hCasais:'casais',hVgv:'activeVgv',hVendas:'vendas',hConv:'conv'};Object.entries(map).forEach(([dst,src])=>{const d=document.getElementById(dst);if(d)d.textContent=readMetric(src,d.textContent||'—');});}
function readTop5VGV(){
  const rows=[...document.querySelectorAll('#promotorTable tbody tr')];
  return rows.slice(0,5).map((tr,i)=>({pos:i+1,name:(tr.cells[1]?.textContent||'').trim(),vgv:(tr.cells[3]?.textContent||'').trim()})).filter(x=>x.name);
}
function syncTop5(){
  const top=readTop5VGV();
  for(let i=1;i<=5;i++){
    const el=document.querySelector(`.fx-ranker.s${i}`),p=top[i-1];
    if(!el)continue;
    if(p){el.textContent=String(i);el.dataset.tip=`${i}º • ${p.name} • ${p.vgv}`;el.title=`${i}º colocado por VGV — ${p.name} — ${p.vgv}`;el.style.display='grid';el.dataset.name=p.name;}
    else{el.style.display='none';el.dataset.name='';}
  }
}
function selectProfessional(name){const sel=document.getElementById('promotor');if(!sel||!name)return;const opt=[...sel.options].find(o=>o.text.trim()===name||o.value.trim()===name);if(opt){sel.value=opt.value;sel.dispatchEvent(new Event('change',{bubbles:true}));}}
function go(page){const btn=document.querySelector(`[data-page="${page}"]`);if(btn)btn.click();}

function mountHolo(){
  if(document.getElementById('fxHolo'))return;
  const page=document.getElementById('page-visao');if(!page)return;
  addHoloStyles();
  const box=document.createElement('div');box.id='fxHolo';box.className='fx-holo';
  box.innerHTML=`
    <div class="fx-holo-head"><div class="fx-holo-eyebrow">CAPTAUP • LIVE PERFORMANCE</div><div class="fx-holo-title">Painel de Performance 360°</div><div class="fx-holo-sub">Visão rápida dos indicadores que movem a operação</div></div>
    <div class="fx-link l1"></div><div class="fx-link l2"></div><div class="fx-link l3"></div><div class="fx-link l4"></div>
    <div class="fx-core-wrap">
      <div class="fx-ring r1"></div><div class="fx-ring r2"></div><div class="fx-ring r3"></div>
      <button class="fx-ranker s1" type="button" aria-label="1º colocado por VGV">1</button><button class="fx-ranker s2" type="button" aria-label="2º colocado por VGV">2</button><button class="fx-ranker s3" type="button" aria-label="3º colocado por VGV">3</button><button class="fx-ranker s4" type="button" aria-label="4º colocado por VGV">4</button><button class="fx-ranker s5" type="button" aria-label="5º colocado por VGV">5</button>
      <div class="fx-core"><div><div class="fx-core-logo">UP</div><small>CAPTAUP 360°</small></div></div><div class="fx-top5-label">TOP 5 • VGV</div>
    </div>
    <button class="fx-node n1" type="button" data-hgo="promotores"><span>Casais</span><strong id="hCasais">—</strong><em>volume de captação</em></button>
    <button class="fx-node n2" type="button" data-hgo="promotores"><span>VGV líquido ativo</span><strong id="hVgv">—</strong><em>resultado financeiro</em></button>
    <button class="fx-node n3" type="button" data-hgo="closers"><span>Vendas</span><strong id="hVendas">—</strong><em>contratos realizados</em></button>
    <button class="fx-node n4" type="button" data-hgo="profissional"><span>Conversão</span><strong id="hConv">—</strong><em>eficiência comercial</em></button>
    <div class="fx-holo-foot">Top 5 orbital por VGV • dados sincronizados com os filtros do CAPTAUP</div>`;
  const kpis=page.querySelector('.kpis');if(kpis)page.insertBefore(box,kpis);else page.prepend(box);
  box.querySelectorAll('[data-hgo]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.hgo)));
  box.querySelectorAll('.fx-ranker').forEach(b=>b.addEventListener('click',()=>selectProfessional(b.dataset.name)));
  syncHolo();syncTop5();
  const targets=['casais','activeVgv','vendas','conv'].map(id=>document.getElementById(id)).filter(Boolean),mo=new MutationObserver(syncHolo);targets.forEach(t=>mo.observe(t,{childList:true,subtree:true,characterData:true}));
  const rank=document.getElementById('promotorTable');if(rank)new MutationObserver(()=>requestAnimationFrame(syncTop5)).observe(rank,{childList:true,subtree:true});
  document.addEventListener('change',e=>{if(e.target&&['start','end','promotor','liner','closer','local'].includes(e.target.id))setTimeout(()=>{syncHolo();syncTop5();},60)});
  setTimeout(syncTop5,250);setTimeout(syncTop5,900);
}

function boot(){brandCAPTAUP();installPWA();mountHolo();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
