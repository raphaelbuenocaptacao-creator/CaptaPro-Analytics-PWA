import json
from collections import Counter
from pathlib import Path
raw=json.loads(Path('data.json').read_text(encoding='utf-8'))
raw=[x for x in raw if str(x.get('_date') or '')<'2026-08-01']
statuses=Counter(str(x.get('Status do contrato') or '').strip() for x in raw)
examples=[]
for x in raw:
    v=float(x.get('_v') or 0)
    if v>0 and len(examples)<20:
        examples.append({'status':x.get('Status do contrato'),'v':v,'date':x.get('_date'),'promotor':x.get('Promotor de marketing')})
info={'rows':len(raw),'nonzero_vgv_rows':sum(1 for x in raw if float(x.get('_v') or 0)>0),'status_top':statuses.most_common(30),'examples':examples}
Path('data-diagnostic.json').write_text(json.dumps(info,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(info,ensure_ascii=False))
