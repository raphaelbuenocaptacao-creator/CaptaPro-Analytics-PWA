(function(){'use strict';
/* FluxoHub: melhoria visual do desempenho + instalação PWA */
const css=`
#dailyWrap{min-height:360px;width:100%;display:flex;flex-direction:column}
#daily{width:100%!important;height:320px!important;display:block;border-radius:14px}
.daily-empty{height:320px;display:flex;align-items:center;justify-content:center;opacity:.6;border:1px dashed rgba(255,255,255,.12);border-radius:14px}
#installPWA{display:none;align-items:center;gap:7px;margin-left:8px;padding:9px 14px;border-radius:9px;border:1px solid rgba(255,255,255,.14);cursor:pointer;font-weight:700}
#installPWA.show{display:inline-flex}
`;const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
let deferred=null;
function installButton(){let actions=document.querySelector('.actions')||document.querySelector('header')||document.body;if(!actions||document.getElementById('installPWA'))return;let b=document.createElement('button');b.id='installPWA';b.type='button';b.innerHTML='📲 Instalar App';b.title='Instalar FluxoHub no dispositivo';b.onclick=async()=>{if(deferred){deferred.prompt();try{await deferred.userChoice}catch(e){}deferred=null;b.classList.remove('show')}else{alert('Se a opção de instalação não aparecer, use o menu do navegador e escolha “Instalar app” ou “Adicionar à tela inicial”.')}};actions.appendChild(b)}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;installButton();document.getElementById('installPWA')?.classList.add('show')});
window.addEventListener('appinstalled',()=>{deferred=null;document.getElementById('installPWA')?.classList.remove('show')});
function improveDaily(){let c=document.getElementById('daily');if(!c)return;let p=c.parentElement;if(p&&!document.getElementById('dailyWrap')){let w=document.createElement('div');w.id='dailyWrap';p.insertBefore(w,c);w.appendChild(c)}c.style.width='100%';c.style.height='320px';c.width=Math.max(600,c.parentElement.clientWidth*devicePixelRatio);c.height=320*devicePixelRatio;}
function boot(){installButton();improveDaily();setTimeout(improveDaily,1000);setTimeout(improveDaily,3000)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();