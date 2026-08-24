import base64
import gzip
import json
from pathlib import Path

BASE = Path('data-2026.json')
MANIFEST = Path('data-2026-full.json')
EXTRA = Path('data-extra-2026-08-23.json')

# 1) Reconstrói a base anual íntegra (01/01 a 22/08) a partir do backup comprimido.
manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
chunks = manifest.get('chunks') or []
if not chunks:
    raise SystemExit('Manifesto anual sem chunks')

b64 = ''.join(Path(name).read_text(encoding='utf-8').strip() for name in chunks)
raw = gzip.decompress(base64.b64decode(b64))
base = json.loads(raw.decode('utf-8'))

if not isinstance(base.get('d'), list) or not isinstance(base.get('r'), list):
    raise SystemExit('Backup anual inválido')
if len(base['r']) != 3373:
    raise SystemExit(f'Backup deveria ter 3373 registros; recebeu {len(base["r"])}')
if base.get('from') != '2026-01-01' or base.get('to') != '2026-08-22':
    raise SystemExit(f'Período inesperado no backup: {base.get("from")} a {base.get("to")}')

# 2) Acrescenta 23/08, remapeando os índices dos dicionários compactados.
extra = json.loads(EXTRA.read_text(encoding='utf-8'))
if not isinstance(extra.get('d'), list) or not isinstance(extra.get('r'), list):
    raise SystemExit('Extra de 23/08 inválido')
if len(extra['r']) != 21:
    raise SystemExit(f'Extra de 23/08 deveria ter 21 registros; recebeu {len(extra["r"])}')

row_pos = [1, 2, 3, 4, 6, 12, 13, 14]
maps = []
for di in range(8):
    target = base['d'][di]
    index = {str(v): i for i, v in enumerate(target)}
    mp = []
    for v in extra['d'][di]:
        key = str(v)
        if key not in index:
            index[key] = len(target)
            target.append(v)
        mp.append(index[key])
    maps.append(mp)

for row in extra['r']:
    nr = list(row)
    for di, pos in enumerate(row_pos):
        nr[pos] = maps[di][row[pos]]
    base['r'].append(nr)

base['v'] = 2
base['from'] = '2026-01-01'
base['to'] = '2026-08-23'
base['schema'] = 'compact-v2'
base['source'] = 'notorio.csv'
base['source_report_date'] = '24/08/2026'

# 3) Validação forte antes de publicar.
rows_2308 = sum(1 for r in base['r'] if r and r[0] == '2026-08-23')
if len(base['r']) != 3394:
    raise SystemExit(f'Esperado total 3394, recebido {len(base["r"])}')
if rows_2308 != 21:
    raise SystemExit(f'Esperado 21 registros em 23/08, recebido {rows_2308}')

gross = round(sum(float(r[5] or 0) for r in base['r']), 2)
if gross != 65648789.96:
    raise SystemExit(f'VGV bruto divergente: {gross}')

BASE.write_text(json.dumps(base, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
print('BASE VALIDADA:', len(base['r']), 'registros;', rows_2308, 'em 23/08; VGV', gross)

# 4) Só após a base final existir e estar validada, remove fontes antigas/fragmentadas.
obsolete = []
for pattern in ['data-2026-??.json', 'data-extra-*.json', 'data-2026-full.json', 'data-2026-full.part*.txt']:
    obsolete.extend(Path('.').glob(pattern))
obsolete.append(Path('daily-extra.js'))
for p in obsolete:
    if p.exists() and p != BASE:
        p.unlink()
        print('REMOVIDO', p)
