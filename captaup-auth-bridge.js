(function(){
'use strict';
const ENG='captaup_engagement_v1';
const PROFILE_KEYS=['captaup_user_profile_v2','captaup_user_profile_v1'];
function read(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}}
function currentProfile(){for(const k of PROFILE_KEYS){const p=read(k,null);if(p)return p}return null}
function sync(profile,reload){
  if(!profile||!profile.name)return;
  const st=read(ENG,{me:{role:'promotor',name:''},sx:{},posts:[],challenges:[],history:[],redemptions:[]});
  st.me=st.me||{};st.me.name=profile.name;st.me.role=profile.performanceRole||'promotor';st.sx=st.sx||{};
  if(!Number.isFinite(st.sx[profile.name]))st.sx[profile.name]=1000;
  localStorage.setItem(ENG,JSON.stringify(st));
  if(reload&&!sessionStorage.getItem('captaup_identity_synced_v2')){sessionStorage.setItem('captaup_identity_synced_v2','1');location.reload()}
}
function load(src,id){if(document.getElementById(id))return;const s=document.createElement('script');s.id=id;s.src=src+'?v=20260824-accessrank34';s.defer=true;document.head.appendChild(s)}
function bootExtras(){load('./adm-access.js','captaup-adm-loader');load('./ranking-controls.js','captaup-ranking-loader')}
window.addEventListener('captaup-auth-changed',e=>sync(e.detail,true));
sync(currentProfile(),false);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bootExtras);else bootExtras();
})();