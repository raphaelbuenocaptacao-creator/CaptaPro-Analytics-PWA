(function(){
'use strict';
const KEY='captaup_engagement_v1';
const ITEMS=[
 {id:'sair-cedo',name:'Sair mais cedo',cost:2500,cat:'TEMPO',desc:'Saída antecipada combinada com a liderança.'},
 {id:'chegar-tarde',name:'Chegar mais tarde',cost:3000,cat:'TEMPO',desc:'Entrada mais tarde em um dia combinado.'},
 {id:'folga',name:'Folga',cost:4500,cat:'FOLGA',desc:'1 dia de folga prêmio, mediante aprovação.'},
 {id:'folga-dupla',name:'Folga dupla',cost:7500,cat:'FOLGA PREMIUM',desc:'2 dias de folga prêmio combinados.'},
 {id:'folga-tripla',name:'Folga tripla',cost:12000,cat:'FOLGA ELITE',desc:'3 dias de folga prêmio combinados.'}
];
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[m]));
const now=()=>new Date().toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
function read(){try{return JSON.parse(localStorage.getItem(KEY))||{}}catch{return {}}}
function write(s){localStorage.setItem(KEY,JSON.stringify(s))}
function toast(msg){const d=document.createElement('div');d.className='eng-toast';d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),2200)}
function current(){const s=read();s.me=s.me||{role:'promotor',name:''};s.sx=s.sx||{};s.redemptions=s.redemptions||[];s.history=s.history||[];if(s.me.name&&!Number.isFinite(s.sx[s.me.name]))s.sx[s.me.name]=1000;return s}
function moneySX(n){return Number(n||0).toLocaleString('pt-BR')+' SX'}
function render(){
 const el=document.getElementById('eng-store');if(!el||!el.classList.contains('active'))return;
 if(el.dataset.storeV2Rendering==='1')return;
 el.dataset.storeV2Rendering='1';
 const s=current(),name=s.me.name||'',bal=name?(s.sx[name]??1000):1000;
 el.innerHTML=`<div class="eng-head"><div><div class="eng-title">Loja SX</div><div class="eng-sub">Recompensas que exigem disputa, vitórias e acúmulo. Nenhum prêmio abaixo de 2.000 SX.</div></div><div class="eng-balance">${moneySX(bal)}</div></div><div class="eng-card" style="margin-top:12px;border-color:#245c44;background:linear-gradient(135deg,#071b15,#08131e)"><b>REGRA DA LOJA</b><div style="font-size:9px;color:#89a79c;margin-top:6px;line-height:1.5">O profissional começa com 1.000 SX e precisa vencer desafios para alcançar as recompensas. Quanto maior o benefício, maior o valor em SX.</div></div><div class="eng-store">${ITEMS.map(i=>`<div class="eng-product"><div class="cat">${esc(i.cat)}</div><b>${esc(i.name)}</b><div style="font-size:8px;color:#7891a4;line-height:1.35">${esc(i.desc)}</div><div class="cost">${moneySX(i.cost)}</div><button class="eng-btn" data-store-v2="${i.id}" ${!name||bal<i.cost?'disabled':''}>RESGATAR</button></div>`).join('')}</div><div class="eng-note">Todo resgate gera uma solicitação e depende de aprovação da liderança. SX é moeda interna de gamificação e não possui saque.</div>`;
 el.querySelectorAll('[data-store-v2]').forEach(b=>b.onclick=()=>buy(b.dataset.storeV2));
 delete el.dataset.storeV2Rendering;
}
function buy(id){const s=current(),name=s.me.name||'',item=ITEMS.find(i=>i.id===id);if(!name)return toast('Seu perfil precisa estar vinculado ao login.');if(!item)return;const bal=s.sx[name]??1000;if(bal<item.cost)return toast('Você ainda não tem SX suficiente.');s.sx[name]=bal-item.cost;s.redemptions.push({user:name,item:item.name,cost:item.cost,status:'Aguardando aprovação',time:now()});s.history.push({user:name,amount:-item.cost,desc:'Resgate solicitado: '+item.name,time:now()});write(s);toast('Resgate solicitado à liderança.');render();}
function boot(){
 document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-eng="store"]');if(b)setTimeout(render,20)},true);
 const obs=new MutationObserver(()=>{const el=document.getElementById('eng-store');if(el&&el.classList.contains('active')&&!el.dataset.storeV2Rendering)setTimeout(render,0)});
 obs.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
 setTimeout(render,700);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();