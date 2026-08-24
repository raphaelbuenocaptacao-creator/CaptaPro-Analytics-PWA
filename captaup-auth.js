(function(){
'use strict';
const USERS_KEY='captaup_auth_users_v1';
const SESSION_KEY='captaup_auth_session_v1';
const PROFILE_KEY='captaup_user_profile_v1';
const DEMO_USERS=[
  {email:'raphaelbueno.captacao@gmail.com',name:'RAPHAEL BUENO DA SILVA',accessRole:'Administrador',performanceRole:'promotor',active:true}
];
const $=id=>document.getElementById(id);
const norm=s=>String(s||'').trim().toLowerCase();
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
function read(k,fallback){try{return JSON.parse(localStorage.getItem(k))||fallback}catch{return fallback}}
function write(k,v){localStorage.setItem(k,JSON.stringify(v))}
function users(){
  const saved=read(USERS_KEY,{});
  for(const seed of DEMO_USERS){
    const key=norm(seed.email);
    if(!saved[key])saved[key]={...seed,email:key,created:false,passwordHash:'',salt:''};
  }
  write(USERS_KEY,saved);return saved;
}
function session(){return read(SESSION_KEY,null)}
function setSession(user){
  const s={email:user.email,name:user.name,accessRole:user.accessRole,performanceRole:user.performanceRole,at:Date.now()};
  write(SESSION_KEY,s);write(PROFILE_KEY,s);window.__captaupUser=s;window.dispatchEvent(new CustomEvent('captaup-auth-changed',{detail:s}));
}
async function hash(text){
  const bytes=new TextEncoder().encode(text);
  const out=await crypto.subtle.digest('SHA-256',bytes);
  return [...new Uint8Array(out)].map(b=>b.toString(16).padStart(2,'0')).join('');
}
function randomSalt(){const a=new Uint8Array(16);crypto.getRandomValues(a);return [...a].map(b=>b.toString(16).padStart(2,'0')).join('')}
function css(){if($('captaup-auth-css'))return;const s=document.createElement('style');s.id='captaup-auth-css';s.textContent=`
#captaupAuth{position:fixed;inset:0;z-index:100000;background:radial-gradient(circle at 50% 15%,#0d2740 0,#07111b 38%,#02070d 100%);display:grid;place-items:center;padding:20px;font-family:inherit;color:#eaf7ff}.ca-box{width:min(440px,100%);border:1px solid #1c4e72;border-radius:22px;background:linear-gradient(155deg,#091724,#06101a);box-shadow:0 34px 90px #000c,0 0 70px #138cf522;padding:26px}.ca-logo{display:flex;align-items:center;gap:12px;margin-bottom:20px}.ca-mark{width:46px;height:46px;border-radius:14px;background:linear-gradient(135deg,#1683ff,#5f4dff);display:grid;place-items:center;font-size:24px;font-weight:950;box-shadow:0 0 30px #1683ff44}.ca-brand{font-weight:950;font-size:20px}.ca-brand small{display:block;font-size:8px;letter-spacing:2px;color:#7696ae;margin-top:2px}.ca-title{font-size:22px;font-weight:950;margin:8px 0 5px}.ca-sub{font-size:10px;line-height:1.5;color:#86a0b4;margin-bottom:18px}.ca-field{margin-top:10px}.ca-field label{display:block;font-size:8px;color:#7893a7;margin:0 0 6px;letter-spacing:1px}.ca-field input{width:100%;box-sizing:border-box;border-radius:12px;border:1px solid #23465e;background:#05101a;color:#f5fbff;padding:13px 14px;outline:none}.ca-field input:focus{border-color:#1683ff;box-shadow:0 0 0 3px #1683ff1f}.ca-btn{width:100%;margin-top:14px;border:0;border-radius:12px;padding:13px;background:linear-gradient(135deg,#1683ff,#3f6bff);color:#fff;font-weight:950;cursor:pointer}.ca-btn.secondary{background:#102231;border:1px solid #284b62;color:#c9dfed}.ca-msg{min-height:16px;margin-top:10px;color:#ff9b9b;font-size:9px}.ca-safe{margin-top:14px;padding:10px;border:1px solid #183a51;border-radius:10px;background:#071521;color:#6f8da2;font-size:8px;line-height:1.5}.ca-user{display:flex;align-items:center;gap:8px;margin-left:auto;padding:6px 8px;border:1px solid #1d4d6f;background:#071724;border-radius:999px}.ca-avatar{width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#1683ff,#6d4cff);display:grid;place-items:center;font-size:10px;font-weight:950}.ca-meta{font-size:8px;line-height:1.2;color:#88a2b6}.ca-meta b{display:block;color:#eaf7ff;font-size:9px;max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ca-logout{border:0;background:transparent;color:#7ba8c5;font-size:8px;cursor:pointer;padding:5px}@media(max-width:700px){.ca-user{margin-left:6px}.ca-meta{display:none}}
`;document.head.appendChild(s)}
function initials(name){return String(name||'CU').split(/\s+/).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()}
function renderUserChip(user){const top=document.querySelector('.top');if(!top)return;let chip=$('captaupUserChip');if(!chip){chip=document.createElement('div');chip.id='captaupUserChip';top.appendChild(chip)}chip.className='ca-user';chip.innerHTML=`<div class="ca-avatar">${esc(initials(user.name))}</div><div class="ca-meta"><b>${esc(user.name)}</b>${esc(user.accessRole)}</div><button class="ca-logout" id="captaupLogout">SAIR</button>`;$('captaupLogout').onclick=()=>{localStorage.removeItem(SESSION_KEY);localStorage.removeItem(PROFILE_KEY);location.reload()}}
function showLogin(){
  let root=$('captaupAuth');if(root)root.remove();root=document.createElement('div');root.id='captaupAuth';root.innerHTML=`<div class="ca-box"><div class="ca-logo"><div class="ca-mark">C</div><div class="ca-brand">CAPTAUP<small>CAPTAUP ID</small></div></div><div id="caBody"></div></div>`;document.body.appendChild(root);showEmail();
}
function showEmail(){const body=$('caBody');body.innerHTML=`<div class="ca-title">Entrar na operação</div><div class="ca-sub">Use o e-mail autorizado pela gestão. No primeiro acesso você cria sua própria senha.</div><div class="ca-field"><label>E-MAIL</label><input id="caEmail" type="email" autocomplete="email" placeholder="seuemail@empresa.com"></div><button class="ca-btn" id="caContinue">CONTINUAR</button><div class="ca-msg" id="caMsg"></div><div class="ca-safe">Protótipo visual: a senha é transformada em hash no aparelho e não é salva como texto. Quando conectarmos ao servidor, autenticação, autorização e recuperação de senha passam para o backend.</div>`;$('caEmail').focus();$('caContinue').onclick=()=>checkEmail();$('caEmail').onkeydown=e=>{if(e.key==='Enter')checkEmail()}}
async function checkEmail(){const email=norm($('caEmail').value);const all=users();const user=all[email];if(!user||!user.active){$('caMsg').textContent='Este e-mail ainda não está autorizado no CAPTAUP.';return}user.email=email;if(!user.created||!user.passwordHash){showFirstAccess(user)}else showPassword(user)}
function showFirstAccess(user){const body=$('caBody');body.innerHTML=`<div class="ca-title">Primeiro acesso</div><div class="ca-sub">Olá, ${esc(user.name)}. Crie sua senha para ativar seu CAPTAUP ID.</div><div class="ca-field"><label>NOVA SENHA</label><input id="caPass1" type="password" autocomplete="new-password" placeholder="Mínimo 6 caracteres"></div><div class="ca-field"><label>CONFIRMAR SENHA</label><input id="caPass2" type="password" autocomplete="new-password"></div><button class="ca-btn" id="caCreate">CRIAR CONTA E ENTRAR</button><button class="ca-btn secondary" id="caBack">VOLTAR</button><div class="ca-msg" id="caMsg"></div>`;$('caCreate').onclick=async()=>{const p1=$('caPass1').value,p2=$('caPass2').value;if(p1.length<6){$('caMsg').textContent='Use pelo menos 6 caracteres.';return}if(p1!==p2){$('caMsg').textContent='As senhas não conferem.';return}const all=users(),u=all[user.email],salt=randomSalt();u.salt=salt;u.passwordHash=await hash(salt+p1);u.created=true;all[user.email]=u;write(USERS_KEY,all);setSession(u);$('captaupAuth').remove();renderUserChip(u)};$('caBack').onclick=showEmail}
function showPassword(user){const body=$('caBody');body.innerHTML=`<div class="ca-title">Bem-vindo de volta</div><div class="ca-sub">${esc(user.name)} • ${esc(user.accessRole)}</div><div class="ca-field"><label>SENHA</label><input id="caPass" type="password" autocomplete="current-password" placeholder="Sua senha"></div><button class="ca-btn" id="caEnter">ENTRAR</button><button class="ca-btn secondary" id="caBack">TROCAR E-MAIL</button><div class="ca-msg" id="caMsg"></div>`;const enter=async()=>{const value=$('caPass').value;const all=users(),u=all[user.email];const got=await hash((u.salt||'')+value);if(got!==u.passwordHash){$('caMsg').textContent='Senha incorreta.';return}setSession(u);$('captaupAuth').remove();renderUserChip(u)};$('caEnter').onclick=enter;$('caPass').onkeydown=e=>{if(e.key==='Enter')enter()};$('caBack').onclick=showEmail;$('caPass').focus()}
function boot(){css();const s=session();if(s&&s.email){window.__captaupUser=s;write(PROFILE_KEY,s);renderUserChip(s);window.dispatchEvent(new CustomEvent('captaup-auth-changed',{detail:s}));}else showLogin()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();