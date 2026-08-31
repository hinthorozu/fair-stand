from pathlib import Path
import json, struct

# 1) Rebuild tv.glb as a small valid GLB containing only bezel + screen.
def box_geometry(width, height, depth, z=0.0):
    x=width/2; y=height/2; d=depth/2
    # 24 vertices, 4 per face, with normals
    faces=[
      ((0,0,1), [(-x,-y,z+d),(x,-y,z+d),(x,y,z+d),(-x,y,z+d)]),
      ((0,0,-1), [(x,-y,z-d),(-x,-y,z-d),(-x,y,z-d),(x,y,z-d)]),
      ((1,0,0), [(x,-y,z+d),(x,-y,z-d),(x,y,z-d),(x,y,z+d)]),
      ((-1,0,0), [(-x,-y,z-d),(-x,-y,z+d),(-x,y,z+d),(-x,y,z-d)]),
      ((0,1,0), [(-x,y,z+d),(x,y,z+d),(x,y,z-d),(-x,y,z-d)]),
      ((0,-1,0), [(-x,-y,z-d),(x,-y,z-d),(x,-y,z+d),(-x,-y,z+d)]),
    ]
    pos=[]; normals=[]; indices=[]
    for fi,(n,verts) in enumerate(faces):
        base=len(pos)//3
        for v in verts:
            pos.extend(v); normals.extend(n)
        indices.extend([base,base+1,base+2, base,base+2,base+3])
    return pos,normals,indices

blobs=[]
views=[]
accessors=[]
meshes=[]

def align4(data):
    while len(data)%4: data += b'\x00'
    return data

binary=bytearray()
def add_blob(raw, target=None):
    global binary
    while len(binary)%4: binary.append(0)
    offset=len(binary); binary.extend(raw)
    idx=len(views)
    v={'buffer':0,'byteOffset':offset,'byteLength':len(raw)}
    if target: v['target']=target
    views.append(v)
    return idx

def add_mesh(name, width,height,depth,z,material):
    pos,nrm,idx=box_geometry(width,height,depth,z)
    pv=add_blob(struct.pack('<%sf'%len(pos),*pos),34962)
    nv=add_blob(struct.pack('<%sf'%len(nrm),*nrm),34962)
    iv=add_blob(struct.pack('<%sH'%len(idx),*idx),34963)
    pacc=len(accessors); accessors.append({'bufferView':pv,'componentType':5126,'count':len(pos)//3,'type':'VEC3','min':[-width/2,-height/2,z-depth/2],'max':[width/2,height/2,z+depth/2]})
    nacc=len(accessors); accessors.append({'bufferView':nv,'componentType':5126,'count':len(nrm)//3,'type':'VEC3'})
    iacc=len(accessors); accessors.append({'bufferView':iv,'componentType':5123,'count':len(idx),'type':'SCALAR'})
    meshes.append({'name':name,'primitives':[{'attributes':{'POSITION':pacc,'NORMAL':nacc},'indices':iacc,'material':material}]})

add_mesh('Object_4',1.10,0.62,0.028,0.0,0)
add_mesh('Object_5',1.055,0.575,0.006,0.018,1)

gltf={
 'asset':{'version':'2.0','generator':'fair-stand TV asset repair'},
 'scene':0,
 'scenes':[{'nodes':[0,1]}],
 'nodes':[{'mesh':0,'name':'Object_4'},{'mesh':1,'name':'Object_5'}],
 'meshes':meshes,
 'materials':[
   {'name':'TV Bezel','pbrMetallicRoughness':{'baseColorFactor':[0.015,0.015,0.018,1],'metallicFactor':0.15,'roughnessFactor':0.32}},
   {'name':'TV Screen','pbrMetallicRoughness':{'baseColorFactor':[0.02,0.025,0.035,1],'metallicFactor':0.0,'roughnessFactor':0.18}},
 ],
 'accessors':accessors,
 'bufferViews':views,
 'buffers':[{'byteLength':len(binary)}],
}
json_bytes=json.dumps(gltf,separators=(',',':')).encode('utf-8')
json_bytes += b' ' * ((4-len(json_bytes)%4)%4)
bin_bytes=bytes(binary) + b'\x00'*((4-len(binary)%4)%4)
total=12+8+len(json_bytes)+8+len(bin_bytes)
glb=struct.pack('<4sII',b'glTF',2,total)+struct.pack('<I4s',len(json_bytes),b'JSON')+json_bytes+struct.pack('<I4s',len(bin_bytes),b'BIN\x00')+bin_bytes
Path('public/models/tv.glb').write_bytes(glb)
assert len(glb)==total and total>1000

# 2) TV is a wall overlay accessory: it may sit in front of an existing wall module.
p=Path('src/moduleBehavior.js')
s=p.read_text()
s=s.replace("  tv: Object.freeze({\n    placement: 'wall',\n    moveSnapCm: 50,", "  tv: Object.freeze({\n    placement: 'wall-overlay',\n    moveSnapCm: 10,")
s=s.replace("    allowSideInsert: true,\n    collision: 'segment',\n    ghost: Object.freeze({ kind: 'real-model', renderer: 'tv', opacity: 0.38 }),\n  }),", "    allowSideInsert: false,\n    collision: 'none',\n    ghost: Object.freeze({ kind: 'real-model', renderer: 'tv', opacity: 0.38 }),\n  }),")
anchor="export function isTopPlacementModule(moduleOrType) {\n  return getModuleBehavior(moduleOrType).placement === 'top';\n}"
assert anchor in s
s=s.replace(anchor, anchor+"\n\nexport function isWallOverlayModule(moduleOrType) {\n  return getModuleBehavior(moduleOrType).placement === 'wall-overlay';\n}")
p.write_text(s)

# 3) Scene: bypass normal wall-chain collision/insertion for wall overlays.
p=Path('src/scene3d.js')
s=p.read_text()
s=s.replace("import { getModuleGhostBehavior, getModuleRotationStepDeg, isFreePlacementModule, isTopPlacementModule } from './moduleBehavior.js';", "import { getModuleGhostBehavior, getModuleRotationStepDeg, isFreePlacementModule, isTopPlacementModule, isWallOverlayModule } from './moduleBehavior.js';")

catalog_anchor="""    if (isTopFixtureType(moduleState.type)) {
      const isFreeTopFixture = snapped.placement.wallId === 'free';"""
assert catalog_anchor in s
# Insert overlay block immediately before top fixture block.
overlay_block="""    if (isWallOverlayModule(moduleState.type)) {
      const placement = { ...snapped.placement };
      showPlacementGhost(moduleState, placement, true);
      clearPlacementFeedback();
      return {
        ok: true,
        placement,
        message: null,
        plan: {
          ok: true,
          movingPlacement: { ...placement },
          placements: new Map([[moduleState.id, { ...placement }]]),
        },
        snap: { mode: 'wall-overlay' },
      };
    }

"""
s=s.replace(catalog_anchor, overlay_block+catalog_anchor,1)

# Existing-module drag has a second snapped-placement block; insert before its second top-fixture branch.
second_anchor="""    if (isTopFixtureType(moduleState.type)) {
      const placement = snapTopFixturePlacement(
        snapped.placement,
        ground,
        moduleState.widthCm,
      );"""
assert second_anchor in s
move_overlay="""    if (isWallOverlayModule(moduleState.type)) {
      const placement = { ...snapped.placement };
      dragSession.preview = {
        placement,
        valid: true,
        message: null,
        plan: {
          ok: true,
          movingPlacement: { ...placement },
          placements: new Map([[moduleState.id, { ...placement }]]),
        },
        snap: { mode: 'wall-overlay' },
      };
      showPlacementGhost(moduleState, placement, true);
      clearPlacementFeedback();
      return;
    }

"""
s=s.replace(second_anchor, move_overlay+second_anchor,1)
p.write_text(s)

# 4) Regression tests.
p=Path('test/tv42Module.test.js')
s=p.read_text()
s=s.replace("import { getModuleGhostBehavior } from '../src/moduleBehavior.js';", "import { getModuleBehavior, getModuleGhostBehavior, isWallOverlayModule } from '../src/moduleBehavior.js';")
if "TV asset GLB header length matches actual file size" not in s:
    s += """

test('TV asset GLB header length matches actual file size', () => {
  const data = fs.readFileSync(new URL('../public/models/tv.glb', import.meta.url));
  assert.equal(data.subarray(0, 4).toString('ascii'), 'glTF');
  assert.equal(data.readUInt32LE(4), 2);
  assert.equal(data.readUInt32LE(8), data.length);
  assert.ok(data.length > 1000);
});

test('TV is a non-colliding wall overlay accessory', () => {
  const behavior = getModuleBehavior({ type: 'tv' });
  assert.equal(behavior.placement, 'wall-overlay');
  assert.equal(behavior.collision, 'none');
  assert.equal(behavior.allowSideInsert, false);
  assert.equal(isWallOverlayModule({ type: 'tv' }), true);
});
"""
p.write_text(s)
