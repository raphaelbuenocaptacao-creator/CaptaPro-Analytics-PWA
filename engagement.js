(function(){
'use strict';
const KEY='captaup_community_v2';
const LEGACY_KEY='captaup_engagement_v1';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const now=()=>new Date().toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
function people(){
 const set=new Set();
 ['promotor','liner','closer'].forEach(id=>{const s=$(id);if(!s)return;[...s.options].forEach(o=>{const v=(o.value||o.textContent||'').trim();if(v&&!/^todos/i.test(v)&&!/^selecione/i.test(v))set.add(v)})});
 if(Array.isArray(window.CAPTAUP_ACTIVE_PROFESSIONALS))window.CAPTAUP_ACTIVE_PROFESSIONALS.forEach(n=>set.add(n));
 return [...set].sort((a,b)=>a.localeCompare(b,'pt-BR'));
}
function migrate(){
 try{
  const current=JSON.parse(localStorage.getItem(KEY)||'null');if(current)return current;
  const old=JSON.parse(localStorage.getItem(LEGACY_KEY)||'null');
  if(old&&Array.isArray(old.posts)){
   const comments=old.posts.map(p=>({id:p.id||Date.now()+Math.random(),author:p.author||'Equipe',text:p.text||'',time:p.time||'',likes:(+p.likes||0)+(+p.fire||0)+(+p.clap||0)+(+p.rocket||0)}));
   return {name:old.me?.name||'',comments};
  }
 }catch{}
 return {name:'',comments:[]};
}
let state=migrate();
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function addCss(){if($('community-css'))return;const s=document.createElement('style');s.id='community-css';s.textContent=`
#cuEngage{margin:12px 0 16px;border:1px solid #6d3ac7;border-radius:14px;background:linear-gradient(145deg,#140c20,#0d1018 62%);box-shadow:0 12px 30px #0005;overflow:hidden}.community-head{padding:13px 14px;border-bottom:1px solid #4b287f;background:linear-gradient(90deg,#3b1769,#1b1029);display:flex;align-items:center;justify-content:space-between;gap:10px}.community-title{font-size:14px;font-weight:900;color:#f5edff}.community-title small{display:block;margin-top:3px;font-size:9px;font-weight:500;color:#bea9dc}.community-badge{font-size:8px;font-weight:900;letter-spacing:.9px;color:#f1dcff;border:1px solid #8e5ad4;background:#4d2180;border-radius:999px;padding:6px 8px}.community-body{padding:13px}.community-form{display:grid;grid-template-columns:180px minmax(0,1fr) auto;gap:8px;align-items:end}.community-field label{display:block;font-size:8px;color:#a994c7;margin:0 0 5px}.community-field select,.community-field textarea{width:100%;box-sizing:border-box;border:1px solid #4c326d;background:#0b0d13;color:#f4effc;border-radius:9px;padding:9px;font:inherit;outline:none}.community-field textarea{min-height:42px;max-height:110px;resize:vertical}.community-btn{border:1px solid #8b55ce;background:#6f35b5;color:#fff;border-radius:9px;padding:10px 13px;font-size:9px;font-weight:900;cursor:pointer}.community-btn:hover{background:#7d40c4}.community-list{display:grid;gap:8px;margin-top:12px}.community-item{border:1px solid #30233f;background:#0c0f15;border-radius:10px;padding:10px}.community-meta{font-size:8px;color:#957fac}.community-author{font-size:10px;font-weight:900;color:#f2e9ff}.community-text{font-size:10px;line-height:1.45;margin:6px 0 8px;white-space:pre-wrap}.community-like{border:1px solid #553877;background:#181020;color:#cdb5eb;border-radius:8px;padding:6px 9px;font-size:9px;font-weight:800;cursor:pointer}.community-like:hover{background:#2a163e;color:#fff}.community-empty{padding:12px;text-align:center;color:#8e7b9f;font-size:9px}.community-toast{position:fixed;right:16px;bottom:74px;z-index:9999;background:#21112f;border:1px solid #8351bc;color:#fff;padding:9px 11px;border-radius:9px;font-size:9px;box-shadow:0 10px 26px #0008}@media(max-width:760px){.community-form{grid-template-columns:1fr}.community-head{align-items:flex-start}.community-badge{margin-top:1px}}
`;document.head.appendChild(s)}
function toast(msg){const d=document.createElement('div');d.className='community-toast';d.textContent=msg;document.body.appendChild(d);setTimeout(()=>d.remove(),1800)}
function render(){
 const host=$('cuEngage');if(!host)return;const names=people();if(state.name&&!names.includes(state.name))names.unshift(state.name);
 const comments=state.comments.slice().reverse().slice(0,30);
 host.innerHTML=`<div class="community-head"><div class="community-title">COMUNIDADE CAPTAUP<small>Comentários rápidos da equipe</small></div><div class="community-badge">COMUNIDADE</div></div><div class="community-body"><div class="community-form"><div class="community-field"><label>SEU NOME</label><select id="communityName"><option value="">Selecione</option>${names.map(n=>`<option ${state.name===n?'selected':''}>${esc(n)}</option>`).join('')}</select></div><div class="community-field"><label>COMENTÁRIO</label><textarea id="communityText" maxlength="500" placeholder="Escreva um comentário para a equipe..."></textarea></div><button class="community-btn" id="communitySend">COMENTAR</button></div><div class="community-list">${comments.length?comments.map(c=>`<div class="community-item"><div><span class="community-author">${esc(c.author)}</span> <span class="community-meta">• ${esc(c.time)}</span></div><div class="community-text">${esc(c.text)}</div><button class="community-like" data-like="${c.id}">Curtir · ${Number(c.likes)||0}</button></div>`).join(''):'<div class="community-empty">Ainda não há comentários.</div>'}</div></div>`;
 $('communityName').onchange=e=>{state.name=e.target.value;save()};
 $('communitySend').onclick=()=>{const text=$('communityText').value.trim();if(!state.name)return toast('Selecione seu nome.');if(!text)return;state.comments.push({id:Date.now(),author:state.name,text,time:now(),likes:0});save();render();toast('Comentário publicado.')};
 host.querySelectorAll('[data-like]').forEach(b=>b.onclick=()=>{const c=state.comments.find(x=>String(x.id)===String(b.dataset.like));if(!c)return;c.likes=(Number(c.likes)||0)+1;save();render()});
}
function mount(){addCss();const filters=document.querySelector('.filters');if(!filters||$('cuEngage'))return;const box=document.createElement('section');box.id='cuEngage';filters.insertAdjacentElement('afterend',box);render()}
function start(){let n=0;const t=setInterval(()=>{n++;if(document.querySelector('.filters')){clearInterval(t);mount()}else if(n>40)clearInterval(t)},150)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();