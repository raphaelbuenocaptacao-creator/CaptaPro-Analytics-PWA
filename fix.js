(()=>{
'use strict';
const clean=()=>{document.querySelectorAll('.modal').forEach(m=>{if(!m.classList.contains('open')){m.style.display='none';m.style.pointerEvents='none'}});document.documentElement.style.pointerEvents='auto';document.body.style.pointerEvents='auto'};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',clean);else clean();
window.addEventListener('error',e=>console.error('FluxoHub UI error:',e.error||e.message));
})();