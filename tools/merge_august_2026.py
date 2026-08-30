import json
from pathlib import Path

BASE=Path('data-2026.json')
DICT=Path('data-august-2026-dicts.json')
PARTS=[Path(f'data-august-2026-part{i}.json') for i in range(1,5)]

base=json.loads(BASE.read_text(encoding='utf-8'))
aug_meta=json.loads(DICT.read_text(encoding='utf-8'))
aug_rows=[]
for p in PARTS:
    aug_rows.extend(json.loads(p.read_text(encoding='utf-8')))

assert base.get('v')==2
assert isinstance(base.get('d'),list) and len(base['d'])>=8
assert isinstance(base.get('r'),list)
assert len(aug_rows)==366, f'August rows: {len(aug_rows)}'
assert min(r[0] for r in aug_rows)=='2026-08-01'
assert max(r[0] for r in aug_rows)=='2026-08-29'

# Janeiro a julho ficam exatamente como já estavam.
keep=[r for r in base['r'] if not str(r[0]).startswith('2026-08')]
assert len(keep)==3097, f'Jan-Jul inesperado: {len(keep)}'

# Remapeia índices dos dicionários do arquivo novo para os dicionários anuais.
dict_positions={1:0,2:1,3:2,4:3,6:4,12:5,13:6,14:7}
for row in aug_rows:
    row=list(row)
    for pos,didx in dict_positions.items():
        value=aug_meta['d'][didx][row[pos]]
        master=base['d'][didx]
        try:
            row[pos]=master.index(value)
        except ValueError:
            master.append(value)
            row[pos]=len(master)-1
    keep.append(row)

keep.sort(key=lambda r:r[0])
assert len(keep)==3463, len(keep)
assert min(r[0] for r in keep)=='2026-01-01'
assert max(r[0] for r in keep)=='2026-08-29'
assert sum(1 for r in keep if str(r[0]).startswith('2026-08'))==366

base['r']=keep
base['from']='2026-01-01'
base['to']='2026-08-29'
base['source']='histórico oficial preservado + agosto atualizado até 29/08/2026'
base['generated_from_report']='30/08/2026'
BASE.write_text(json.dumps(base,ensure_ascii=False,separators=(',',':')),encoding='utf-8')
print(json.dumps({'total':3463,'jan_jul':3097,'august':366,'from':base['from'],'to':base['to']}))
