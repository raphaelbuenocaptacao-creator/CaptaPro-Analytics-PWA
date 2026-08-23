(function(){
'use strict';
/* Mantém apenas a instalação do PWA. A carga de dados fica exclusivamente no app.js. */
let deferred=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;});
function boot(){
  const btn=document.getElementById('installPWA');
  if(!btn)return;
  btn.style.display='inline-flex';
  btn.addEventListener('click',async()=>{
    if(deferred){deferred.prompt();try{await deferred.userChoice;}finally{deferred=null;}return;}
    alert('A instalação automática não está disponível neste momento. No Chrome, use o ícone de instalação na barra de endereço ou o menu ⋮ > Instalar FluxoHub.');
  });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
