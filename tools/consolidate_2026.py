import base64,gzip,json
from pathlib import Path

out=Path('data-diagnostic.json')
info={}
try:
    manifest=json.loads(Path('data-2026-full.json').read_text(encoding='utf-8'))
    info['manifest']=manifest
    chunks=manifest.get('chunks',[])
    info['chunk_sizes']={name:Path(name).stat().st_size for name in chunks}
    texts=[Path(name).read_text(encoding='utf-8').strip() for name in chunks]
    info['chunk_text_lengths']={name:len(text) for name,text in zip(chunks,texts)}
    b64=''.join(texts)
    info['b64_len']=len(b64)
    decoded=base64.b64decode(b64,validate=True)
    info['decoded_len']=len(decoded)
    raw=gzip.decompress(decoded)
    info['raw_len']=len(raw)
    data=json.loads(raw.decode('utf-8'))
    info['payload_type']=type(data).__name__
    info['payload_keys']=list(data.keys()) if isinstance(data,dict) else []
    info['rows']=len(data.get('r',[])) if isinstance(data,dict) else None
    info['from']=data.get('from') if isinstance(data,dict) else None
    info['to']=data.get('to') if isinstance(data,dict) else None
    if isinstance(data,dict) and isinstance(data.get('r'),list):
        info['vgv']=round(sum(float(r[5] or 0) for r in data['r']),2)
except Exception as e:
    info['error']=repr(e)
out.write_text(json.dumps(info,ensure_ascii=False,indent=2,default=str),encoding='utf-8')
print(json.dumps(info,ensure_ascii=False))
