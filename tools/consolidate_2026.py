import json
from pathlib import Path

src=Path('data.json')
out=Path('data-diagnostic.json')
info={'exists':src.exists(),'size':src.stat().st_size if src.exists() else 0}
try:
    data=json.loads(src.read_text(encoding='utf-8'))
    info['type']=type(data).__name__
    if isinstance(data,dict):
        info['keys']=list(data.keys())[:50]
        for k,v in data.items():
            if isinstance(v,list):
                info['list_key']=k
                info['list_len']=len(v)
                if v:
                    info['first_type']=type(v[0]).__name__
                    if isinstance(v[0],dict):
                        info['first_keys']=list(v[0].keys())[:100]
                        info['first_sample']={kk:v[0].get(kk) for kk in list(v[0].keys())[:25]}
                    else:
                        info['first_sample']=v[0]
                break
    elif isinstance(data,list):
        info['list_len']=len(data)
        if data:
            info['first_type']=type(data[0]).__name__
            if isinstance(data[0],dict):
                info['first_keys']=list(data[0].keys())[:100]
                info['first_sample']={kk:data[0].get(kk) for kk in list(data[0].keys())[:25]}
            else:
                info['first_sample']=data[0]
except Exception as e:
    info['error']=repr(e)
out.write_text(json.dumps(info,ensure_ascii=False,indent=2,default=str),encoding='utf-8')
print(json.dumps(info,ensure_ascii=False))
