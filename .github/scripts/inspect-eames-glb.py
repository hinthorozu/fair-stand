import json, struct
from pathlib import Path
p=Path('public/models/eames_chair.glb')
data=p.read_bytes(); o=12
while o < len(data):
    chunk_len, chunk_type=struct.unpack_from('<II',data,o); o+=8
    chunk=data[o:o+chunk_len]; o+=chunk_len
    if chunk_type == 0x4E4F534A:
        doc=json.loads(chunk.decode('utf-8').rstrip('\x00 '))
        print('IMAGES', [(i,x.get('name'),x.get('mimeType')) for i,x in enumerate(doc.get('images',[]))])
        print('TEXTURES', [(i,x.get('name'),x.get('source')) for i,x in enumerate(doc.get('textures',[]))])
        print('MATERIALS')
        for i,m in enumerate(doc.get('materials', [])):
            print(i, m.get('name'), json.dumps(m.get('pbrMetallicRoughness',{}), ensure_ascii=False))
        break
