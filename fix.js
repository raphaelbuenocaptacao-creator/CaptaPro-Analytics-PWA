(function(){
'use strict';
const $=id=>document.getElementById(id);
let data=[];
function money(v){return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v)||0)}
function num(v){return new Intl.NumberFormat('pt-BR').format(Number(v)||0)}
function pct(v){return (Number(v)||0).toLocaleString('pt-BR',{maximumFractionDigits:1})+'%'}
function val(v){if(v==null||v==='')return 0;let s=String(v).replace(/R\$|\s/g,'').replace(/\./g,'').replace(',','.');return Number(s)||0}
function date(v){let m=String(v||'').match(/(\d{2})\/(\d{2})\/(\d{4})/);return m?m[3]+'-'+m[2]+'-'+m[1]:''}
function prep(r){return Object.assign({},r,{_date:date(r['Data de atendimento']),_v:val(r['Valor vendido']),_q:String(r['Qualificação']||'').trim().toUpperCase()})}
function filtered(){let a=$('start')?.value,b=$('end')?.value,p=$('promotor')?.value,l=$('liner')?.value,c=$('closer')?.value,lo=$('local')?.value;return data.filter(x=>(!a||x._date>=a)&&(!b||x._date<=b)&&(!p||x['Promotor de marketing']===p)&&(!l||x.Liner===l)&&(!c||x.Closer===c)&&(!lo||x['Local Captação']===lo))}
function fill(id,key){let e=$(id);if(!e)return;let values=[...new Set(data.map(x=>x[key]).filter(Boolean))].sort((a,b)=>String(a).localeCompare(String(b),'pt-BR'));let old=e.value;e.innerHTML='<option value="">Todos</option>'+values.map(v=>'<option></option>').join('');values.forEach((v,i)=>e.options[i+1].textContent=v);values.forEach((v,i)=>e.options[i+1].value=v);e.value=old}
function render(){let a=filtered(),s=a.filter(x=>x._v>0),v=s.reduce((t,x)=>t+x._v,0),conv=a.length?s.length/a.length*100:0,t=s.length?v/s.length:0,q=a.filter(x=>x._q==='Q').length,nq=a.filter(x=>x._q==='NQ').length;
if($('vgv'))$('vgv').textContent=money(v);if($('vgvSub'))$('vgvSub').textContent=num(s.length)+' vendas · '+pct(conv)+' conversão';if($('casais'))$('casais').textContent=num(a.length);if($('vendas'))$('vendas').textContent=num(s.length);if($('conv'))$('conv').textContent=pct(conv);if($('convSub'))$('convSub').textContent='Q: '+num(q)+' · NQ: '+num(nq);if($('ticket'))$('ticket').textContent=money(t);if($('vgvCasal'))$('vgvCasal').textContent=money(a.length?v/a.length:0);if($('count'))$('count').textContent=num(a.length)+' registros';
if($('vgvProg'))$('vgvProg').style.width=Math.min(100,v/20000000*100)+'%';
if($('alerts'))$('alerts').innerHTML=conv<20?'<div class="alert">⚠️ <b>Conversão abaixo de 20%.</b> Revise abordagem e qualificação.</div>':'<div class="info">✅ Conversão atual: <b>'+pct(conv)+'</b></div>';
if($('funnel'))$('funnel').innerHTML='<div class="funnelrow"><div class="funnelbar">ABORDAGENS</div><div class="ftxt">'+num(a.length)+'</div></div><div class="funnelrow"><div class="funnelbar q">QUALIFICADOS</div><div class="ftxt">'+num(q)+'</div></div><div class="funnelrow"><div class="funnelbar s">VENDAS</div><div class="ftxt">'+num(s.length)+'</div></div>';
if($('funnel2'))$('funnel2').innerHTML=$('funnel').innerHTML;
}
function nav(){document.querySelectorAll('[data-page]').forEach(b=>{b.onclick=function(){let p=this.dataset.page;document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===p));document.querySelectorAll('main>section').forEach(x=>x.hidden=x.id!=='page-'+p);if($('pageTitle'))$('pageTitle').textContent={visao:'Visão 360°',equipe:'Equipe',funil:'Funil de Vendas',ranking:'Ranking',operacao:'Operação',perfil:'Perfil do Cliente',alertas:'Alertas',dados:'Dados'}[p]||'FluxoHub';}})}
function start(){nav();['promotor','liner','closer','local','start','end'].forEach(id=>{let e=$(id);if(e)e.addEventListener('change',render)});if($('reset'))$('reset').onclick=function(){['promotor','liner','closer','local'].forEach(id=>{if($(id))$(id).value=''});let ds=data.map(x=>x._date).filter(Boolean).sort();if($('start'))$('start').value=ds[0]||'';if($('end'))$('end').value=ds[ds.length-1]||'';render()};if($('close'))$('close').onclick=()=>{$('modal').classList.remove('open')};render()}
fetch('./data.json?fix='+Date.now(),{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('data.json '+r.status);return r.json()}).then(j=>{data=(Array.isArray(j)?j:(j.data||j.rows||[])).map(prep);let ds=data.map(x=>x._date).filter(Boolean).sort();if($('start'))$('start').value=ds[0]||'';if($('end'))$('end').value=ds[ds.length-1]||'';fill('promotor','Promotor de marketing');fill('liner','Liner');fill('closer','Closer');fill('local','Local Captação');start()}).catch(e=>{console.error(e);nav();if($('alerts'))$('alerts').innerHTML='<div class="alert"><b>Erro ao carregar a base.</b> '+e.message+'</div>'});
})();
