import json
from pathlib import Path

chunks=[f'data-2026-full.part{i}.txt' for i in range(1,5)]
texts=[Path(p).read_text(encoding='utf-8').strip() for p in chunks]
alltext=''.join(texts)
markers={
 'p1_start':'H4sIAHOpi2oC/5y9TXMcOZYg+FdosjWbHjNWjgNwwN3zFqIoJVX8UJGUerra+hAiQ8rIIRmsCIYmO/fU',
 'p1_end':'69mJeHdhLhDU367C3lrcwXfXCCWecvw4s08t8TeW0lJay4rWq5wmwkBDxiC5loZXYF+Wy/ohcJSZbF8g',
 'p2_start':'9sBlRjQ0Cl0NRHNAJA4/dSKJ3Bz4tt12B0tNJAbRBSo12thBC2mkqnyFcl4beacXmz9CQjUkMStUnB/G',
 'p2_end':'Uj+OCyqhLtqBt/20oZ7OElEnEvWbux11Cb60yaMiybalP11qUZnqr8PE/SqRqr1EKjjzminfR+VN8szw',
 'p3_start':'c1ifaHuR3si8vUDp4HqGdaDeBcsVi8KGCCauaFtbcKXHQotwVpqkTK1JMF2f3DHS21gE1NHE2Ze4Mp+4',
 'p3_end':'5HPD2VnTA9DBS8lG7eimF49ofF9PUZxLueNG8ndNKETIFhVg1lW0icfC6ZZ6KY5BndJn18755Q2wHfsT',
 'p4_start':'m43QXjVYdMD2UmLotbhWPTg+TzbtMKQ6lhz9Q3KaNwBUU5AtH+DBFaoxCZHcA46vkm27dwjJneBI0MB4',
 'p4_end':'dBiwAxQU61RyY9syWOe5aBvHtSDbB488IAaM85Ss1zQDC73rSnZuL6SVkB4jwv/3//v/AW5ntJtwvgMA'
}
info={'lengths':[len(x) for x in texts],'total':len(alltext),'positions':{k:alltext.find(v) for k,v in markers.items()}}
for i,t in enumerate(texts,1):
    info[f'part{i}_start']=t[:100]
    info[f'part{i}_end']=t[-100:]
Path('data-diagnostic.json').write_text(json.dumps(info,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(info,ensure_ascii=False))
