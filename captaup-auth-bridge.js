(function(){
'use strict';
const ENG='captaup_engagement_v1';
const PROFILE='captaup_user_profile_v1';
function read(k,f){try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}}
function sync(profile,reload){
  if(!profile||!profile.name)return;
  const st=read(ENG,{me:{role:'promotor',name:''},sx:{},posts:[],challenges:[],history:[],redemptions:[]});
  st.me=st.me||{};
  st.me.name=profile.name;
  st.me.role=profile.performanceRole||'promotor';
  st.sx=st.sx||{};
  if(!Number.isFinite(st.sx[profile.name]))st.sx[profile.name]=1000;
  localStorage.setItem(ENG,JSON.stringify(st));
  if(reload&&!sessionStorage.getItem('captaup_identity_synced')){
    sessionStorage.setItem('captaup_identity_synced','1');
    location.reload();
  }
}
window.addEventListener('captaup-auth-changed',e=>sync(e.detail,true));
sync(read(PROFILE,null),false);
})();