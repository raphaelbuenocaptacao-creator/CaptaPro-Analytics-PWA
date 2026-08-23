(()=>{
'use strict';
let deferredPrompt=null;
function isStandalone(){return window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;}
function mount(){
  const header=document.querySelector('.top');
  if(!header||document.getElementById('installApp'))return;
  const btn=document.createElement('button');
  btn.id='installApp';
  btn.type='button';
  btn.className='btn primary';
  btn.textContent=isStandalone()?'App instalado':'Instalar App';
  btn.style.marginLeft='10px';
  btn.style.whiteSpace='nowrap';
  if(isStandalone()){btn.disabled=true;btn.style.opacity='.65';}
  btn.addEventListener('click',async()=>{
    if(isStandalone())return;
    if(deferredPrompt){
      deferredPrompt.prompt();
      try{await deferredPrompt.userChoice;}catch(e){}
      deferredPrompt=null;
      return;
    }
    const ua=navigator.userAgent||'';
    if(/iphone|ipad|ipod/i.test(ua)){
      alert('No iPhone/iPad: abra no Safari, toque em Compartilhar e depois em “Adicionar à Tela de Início”.');
    }else{
      alert('Se a instalação automática não abrir, use o menu do navegador e escolha “Instalar app” ou “Adicionar à tela inicial”.');
    }
  });
  header.appendChild(btn);
}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;mount();});
window.addEventListener('appinstalled',()=>{deferredPrompt=null;const b=document.getElementById('installApp');if(b){b.textContent='App instalado';b.disabled=true;b.style.opacity='.65';}});
if('serviceWorker'in navigator){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
})();