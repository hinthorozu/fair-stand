from pathlib import Path
p=Path('src/scene3d.js')
s=p.read_text()
old="""        if (object.material) object.material = object.material.clone();
        if (object.material?.name === 'plastic_wit') {
          object.material.color.set(moduleState.surface?.color ?? '#ffffff');
          colorTargets.push(object);
        }
"""
new="""        if (object.material) object.material = object.material.clone();
        if (object.material?.name === 'plastic_wit') {
          object.material.color.set(moduleState.surface?.color ?? '#ffffff');
          colorTargets.push(object);
        } else if (object.material?.name === 'Material1') {
          // Eames GLB: Material1 is the four wooden chair legs.
          object.material.color.set('#a66b3d');
          object.material.metalness = 0;
          object.material.roughness = 0.58;
        }
"""
if old not in s: raise SystemExit('eames material block not found')
p.write_text(s.replace(old,new,1))
