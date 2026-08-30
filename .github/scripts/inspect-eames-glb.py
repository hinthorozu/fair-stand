import json, struct
from pathlib import Path
p=Path('public/models/eames_chair.glb')
data=p.read_bytes(); o=12
while o < len(data):
    chunk_len, chunk_type=struct.unpack_from('<II',data,o); o+=8
    chunk=data[o:o+chunk_len]; o+=chunk_len
    if chunk_type == 0x4E4F534A:
        doc=json.loads(chunk.decode('utf-8').rstrip('\x00 '))
        mats=doc.get('materials',[]); acc=doc.get('accessors',[])
        for mi,m in enumerate(doc.get('meshes', [])):
            for pi,pr in enumerate(m.get('primitives',[])):
                ai=pr.get('attributes',{}).get('POSITION')
                a=acc[ai] if ai is not None else {}
                mat=pr.get('material'); name=mats[mat].get('name') if mat is not None else None
                print('MESH',mi,m.get('name'),'MAT',mat,name,'MIN',a.get('min'),'MAX',a.get('max'),'COUNT',a.get('count'))
        break
