import json
from collections import Counter
from pathlib import Path
raw=json.loads(Path('data.json').read_text(encoding='utf-8'))
months=Counter()
dates=Counter()
for x in raw:
    d=str(x.get('_date') or '')
    if len(d)>=10:
        months[d[:7]]+=1
        dates[d]+=1
latest=json.loads(Path('data-latest.json').read_text(encoding='utf-8'))
info={
 'data_json_rows':len(raw),
 'months':dict(sorted(months.items())),
 'min_date':min(dates) if dates else None,
 'max_date':max(dates) if dates else None,
 'august_latest_rows':len(latest.get('r',[])),
 'latest_from':latest.get('from'),'latest_to':latest.get('to')
}
Path('data-diagnostic.json').write_text(json.dumps(info,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(info,ensure_ascii=False))
