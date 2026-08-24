import json,re
from pathlib import Path

RAW=Path('data.json')
AUG=Path('data-latest.json')
EXTRA=Path('data-extra-2026-08-23.json')
OUT=Path('data-2026.json')

raw=json.loads(RAW.read_text(encoding='utf-8'))
aug=json.loads(AUG.read_text(encoding='utf-8'))
extra=json.loads(EXTRA.read_text(encoding='utf-8'))

# Dicionários compact-v2: promotor, liner, closer, local, Q/NQ, cidade, profissão, renda
dicts=[[],[],[],[],[],[],[],[]]
indexes=[{} for _ in range(8)]
def didx(di,value):
    value=str(value or '').strip()
    if value not in indexes[di]:
        indexes[di][value]=len(dicts[di]);dicts[di].append(value)
    return indexes[di][value]

def num(v):
    try:return float(v or 0)
    except:
        s=str(v or '').replace('R$','').replace(' ','').replace('.','').replace(',','.')
        try:return float(s)
        except:return 0.0

def gifts(text):
    s=str(text or '')
    m=re.search(r'TOTAL:\s*(\d+)',s,re.I)
    qty=int(m.group(1)) if m else 0
    vals=[]
    for x in re.findall(r'VALOR:\s*([0-9.,]+)',s,re.I):
        try: vals.append(float(x.replace(',','.')))
        except: pass
    return qty,round(sum(vals),2)

def income_label(v):
    n=num(v)
    if not n:return ''
    return 'R$ '+f'{n:,.2f}'.replace(',','X').replace('.',',').replace('X','.')

rows=[]
# Jan-Jul: fonte bruta completa (3.097 casais)
for x in raw:
    date=str(x.get('_date') or '').strip()
    if not date or date>='2026-08-01':continue
    v=num(x.get('_v') if x.get('_v') not in (None,'') else x.get('Valor vendido'))
    status=str(x.get('Status do contrato') or '').strip().upper()
    parts=[p.strip() for p in status.split('#') if p.strip()]
    sales=len(parts) if v>0 and parts else (1 if v>0 else 0)
    active_count=sum(1 for p in parts if p.startswith('ATIVO'))
    active_sales=active_count if v>0 else 0
    if sales and active_count==sales: active_v=v
    elif active_count==0: active_v=0.0
    else: active_v=round(v*(active_count/sales),2)
    q=str(x.get('_q') or x.get('Qualificação') or x.get('Motivo de qualificação') or '').strip().upper()
    if q not in ('Q','NQ'): q=''
    gq,gc=gifts(x.get('Brindes efetivos'))
    hour=str(x.get('_hour') or '').strip()
    if not hour:
        cadastro=str(x.get('Data/Hora do cadastro') or '')
        mm=re.search(r'(\d{2}:\d{2})',cadastro);hour=mm.group(1) if mm else ''
    age=int(num(x.get('Idade 1')) or 0)
    rows.append([
        date,didx(0,x.get('Promotor de marketing')),didx(1,x.get('Liner')),didx(2,x.get('Closer')),didx(3,x.get('Local Captação')),
        round(v,2),didx(4,q),sales,round(active_v,2),active_sales,gq,gc,didx(5,x.get('Cidade')),didx(6,x.get('Profissão 1')),didx(7,income_label(x.get('_income') or x.get('Renda'))),age,hour
    ])

if len(rows)!=3097:raise SystemExit(f'Jan-Jul divergente: {len(rows)}')

# Agosto 01-22: base compacta oficial com 276 casais
P,L,C,O,Q=aug['d'][:5]
for a in aug['r']:
    date=f"2026-08-{int(a[0]):02d}"
    v=num(a[5]);sales=int(num(a[7]));active_v=num(a[13]) if len(a)>13 else v;active_sales=int(num(a[14])) if len(a)>14 else sales
    rows.append([date,didx(0,P[a[1]]),didx(1,L[a[2]]),didx(2,C[a[3]]),didx(3,O[a[4]]),round(v,2),didx(4,Q[a[6]] if a[6] is not None else ''),sales,round(active_v,2),active_sales,0,0.0,didx(5,''),didx(6,''),didx(7,''),0,str(a[12] if len(a)>12 and a[12] else '')])

# 23/08: 21 registros detalhados, remapeados para os mesmos dicionários
EP,EL,EC,EO,EQ,ECI,EPR,EIN=extra['d']
for a in extra['r']:
    rows.append([a[0],didx(0,EP[a[1]]),didx(1,EL[a[2]]),didx(2,EC[a[3]]),didx(3,EO[a[4]]),num(a[5]),didx(4,EQ[a[6]]),int(num(a[7])),num(a[8]),int(num(a[9])),int(num(a[10])),num(a[11]),didx(5,ECI[a[12]]),didx(6,EPR[a[13]]),didx(7,EIN[a[14]]),int(num(a[15])),str(a[16] or '')])

rows.sort(key=lambda r:(r[0],str(dicts[0][r[1]])))
if len(rows)!=3394:raise SystemExit(f'Total divergente: {len(rows)}')
if sum(1 for r in rows if r[0]=='2026-08-23')!=21:raise SystemExit('23/08 divergente')
gross=round(sum(num(r[5]) for r in rows),2)
if gross!=65648789.96:raise SystemExit(f'VGV bruto divergente: {gross}')

payload={'v':2,'from':'2026-01-01','to':'2026-08-23','schema':'compact-v2','source':'notorio.csv','generated_from_report':'24/08/2026','d':dicts,'r':rows}
OUT.write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')),encoding='utf-8')

# Validação pós-gravação
check=json.loads(OUT.read_text(encoding='utf-8'))
if len(check['r'])!=3394:raise SystemExit('Arquivo final não validou')
print('OK BASE OFICIAL',len(check['r']),check['from'],check['to'],gross)

# Limpa somente bases antigas depois do arquivo final estar validado.
for pattern in ['data-2026-??.json','data-extra-*.json','data-2026-full.json','data-2026-full.part*.txt','data-latest.json']:
    for p in Path('.').glob(pattern):
        if p.exists() and p!=OUT:p.unlink()
for name in ['data.json','daily-extra.js','data-diagnostic.json']:
    p=Path(name)
    if p.exists():p.unlink()
