(function(){
'use strict';
const money=v=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',minimumFractionDigits:2}).format(Number(v)||0);
const num=v=>Number(String(v??0).replace(/[^0-9,.-]/g,'').replace(/\.(?=.*\.)/g,'').replace(',','.'))||0;
function val(r){ return num(r['Valor vendido'] ?? r._v ?? 0); }
function filtered(rows){
 const s=document.getElementById('start')?.value||'', e=document.getElementById('end')?.value||'', p=document.getElementById('promotor')?.value||'', l=document.getElementById('liner')?.value||'', c=document.getElementById('closer')?.value||'', loc=document.getElementById('local')?.value||'';
 return rows.filter(r=>{const d=r._date||'';return(!s||d>=s)&&(!e||d<=e)&&(!p||String(r['Promotor de marketing']||'')===p)&&(!l||String(r.Liner||'')===l)&&(!c||String(r.Closer||'')===c)&&(!loc||String(r['Local Captação']||'')===loc)});
}
function populate(rows){[['promotor','Promotor de marketing'],['liner','Liner'],['closer','Closer'],['local','Local Captação']].forEach(([id,k])=>{const el=document.getElementById(id);if(!el)return;const old=el.value, vals=[...new Set(rows.map(r=>String(r[k]||'').trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt-BR'));el.innerHTML='<option value="">Todos</option>'+vals.map(v=>'<option></option>').join('');[...el.options].slice(1).forEach((o,i)=>o.value=o.textContent=vals[i]);el.value=vals.includes(old)?old:'';});}
function render(rows){
 const rs=filtered(rows), atend=rs.length, sales=rs.filter(r=>val(r)>0), vgv=sales.reduce((a,r)=>a+val(r),0), conv=atend?100*sales.length/atend:0, ticket=sales.length?vgv/sales.length:0, casal=atend?vgv/atend:0;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set('vgv',money(vgv));set('casais',atend.toLocaleString('pt-BR'));set('vendas',sales.length.toLocaleString('pt-BR'));set('conv',conv.toFixed(1).replace('.',',')+'%');set('ticket',money(ticket));set('vgvCasal',money(casal));set('vgvSub',sales.length.toLocaleString('pt-BR')+' vendas · '+conv.toFixed(1).replace('.',',')+'% conversão');
 const prog=document.getElementById('vgvProg');if(prog)prog.style.width=Math.min(100,vgv/15000000*100)+'%';
 document.querySelectorAll('[data-rank]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-rank]').forEach(x=>x.classList.remove('active'));b.classList.add('active');rank(rows,b.dataset.rank)});
 rank(rs,'vgv');
}
function rank(rs,mode){const m={};rs.forEach(r=>{const n=String(r['Promotor de marketing']||'Sem promotor').trim();if(!m[n])m[n]={n,vgv:0,vendas:0,casais:0};m[n].casais++;m[n].vgv+=val(r);if(val(r)>0)m[n].vendas++});let a=Object.values(m);a.forEach(x=>x.conv=x.casais?100*x.vendas/x.casais:0);a.sort((x,y)=>y[mode]-x[mode]);const el=document.getElementById('rankingTable');if(!el)return;el.innerHTML='<div class="tablewrap"><table><thead><tr><th>#</th><th>Promotor</th><th>Casais</th><th>Vendas</th><th>Conversão</th><th>VGV</th></tr></thead><tbody>'+a.slice(0,15).map((x,i)=>`<tr><td>${i+1}</td><td>${x.n}</td><td>${x.casais}</td><td>${x.vendas}</td><td>${x.conv.toFixed(1).replace('.',',')}%</td><td class="money">${money(x.vgv)}</td></tr>`).join('')+'</tbody></table></div>'}
function init(rows){populate(rows);render(rows);['start','end','promotor','liner','closer','local'].forEach(id=>document.getElementById(id)?.addEventListener('change',()=>render(rows)));document.getElementById('reset')?.addEventListener('click',()=>{['start','end','promotor','liner','closer','local'].forEach(id=>{const e=document.getElementById(id);if(e)e.value=''});render(rows)});document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>{const p=b.dataset.page;document.querySelectorAll('[id^="page-"]').forEach(s=>s.hidden=s.id!=='page-'+p);document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('active',x===b));const t=document.getElementById('pageTitle');if(t)t.textContent=b.textContent.trim()}));}
fetch('./data.json?cb='+Date.now(),{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('data.json '+r.status);return r.json()}).then(rows=>{window.__FLUXOHUB_ROWS__=Array.isArray(rows)?rows:[];init(window.__FLUXOHUB_ROWS__)}).catch(e=>console.error('FluxoHub data error',e));
})();
