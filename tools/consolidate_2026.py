import json
from pathlib import Path

BASE=Path('data-2026.json')
EXTRA=Path('data-extra-2026-08-23.json')

base=json.loads(BASE.read_text(encoding='utf-8'))
extra=json.loads(EXTRA.read_text(encoding='utf-8'))

if not isinstance(base.get('d'), list) or not isinstance(base.get('r'), list):
    raise SystemExit('Base invalida')
if not isinstance(extra.get('d'), list) or not isinstance(extra.get('r'), list):
    raise SystemExit('Extra invalido')

row_pos=[1,2,3,4,6,12,13,14]
maps=[]
for di in range(8):
    target=base['d'][di]
    index={str(v):i for i,v in enumerate(target)}
    mp=[]
    for v in extra['d'][di]:
        key=str(v)
        if key not in index:
            index[key]=len(target)
            target.append(v)
        mp.append(index[key])
    maps.append(mp)

if not any(r and r[0]=='2026-08-23' for r in base['r']):
    for row in extra['r']:
        nr=list(row)
        for di,pos in enumerate(row_pos):
            nr[pos]=maps[di][row[pos]]
        base['r'].append(nr)

base['from']='2026-01-01'
base['to']='2026-08-23'
base['v']=2
count=sum(1 for r in base['r'] if r and r[0]=='2026-08-23')
if count!=21:
    raise SystemExit(f'Esperado 21 registros em 23/08, recebido {count}')
if len(base['r'])!=3394:
    raise SystemExit(f'Esperado total 3394, recebido {len(base["r"])}')

BASE.write_text(json.dumps(base,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print('OK',len(base['r']),count,base['to'])
