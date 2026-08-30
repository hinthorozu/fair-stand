import json, struct
from pathlib import Path
p=Path('public/models/eames_chair.glb')
data=p.read_bytes()
magic,version,length=struct.unpack_from('<4sII',data,0)
o=12
while o < len(data):
    chunk_len, chunk_type=struct.unpack_from('<II',data,o); o+=8
    chunk=data[o:o+chunk_len]; o+=chunk_len
    if chunk_type == 0x4E4F534A:
        doc=json.loads(chunk.decode('utf-8').rstrip('\x00 '))
        print('MATERIALS')
        for i,m in enumerate(doc.get('materials', [])):
            print(i, m.get('name'), m.get('pbrMetallicRoughness',{}).get('baseColorFactor'))
        print('MESHES')
        for i,m in enumerate(doc.get('meshes', [])):
            print(i, m.get('name'), [pr.get('material') for pr in m.get('primitives',[])])
        print('NODES')
        for i,n in enumerate(doc.get('nodes', [])):
            if 'mesh' in n: print(i, n.get('name'), 'mesh=', n['mesh'])
        break
