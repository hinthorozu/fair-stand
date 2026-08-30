from pathlib import Path
import re

p = Path('src/scene3d.js')
s = p.read_text(encoding='utf-8')

new_helpers = r'''function separateBeigeSofaWoodMaterial(object, upholsteryColor = '#ffffff') {
  if (!object?.isMesh || !object.geometry || !object.material) return;

  const sourceGeometry = object.geometry;
  const position = sourceGeometry.getAttribute('position');
  if (!position || position.count < 3) return;

  const geometry = sourceGeometry.clone();
  object.geometry = geometry;

  const index = geometry.index;
  const triangleCount = Math.floor((index ? index.count : position.count) / 3);
  if (!triangleCount) return;

  const vertexKey = (vertexIndex) => {
    const x = position.getX(vertexIndex).toFixed(5);
    const y = position.getY(vertexIndex).toFixed(5);
    const z = position.getZ(vertexIndex).toFixed(5);
    return `${x}|${y}|${z}`;
  };

  const triangleKeys = new Array(triangleCount);
  const keyToTriangles = new Map();
  let globalMinY = Infinity;
  let globalMaxY = -Infinity;

  for (let tri = 0; tri < triangleCount; tri += 1) {
    const ids = index
      ? [index.getX(tri * 3), index.getX(tri * 3 + 1), index.getX(tri * 3 + 2)]
      : [tri * 3, tri * 3 + 1, tri * 3 + 2];
    const keys = ids.map(vertexKey);
    triangleKeys[tri] = { ids, keys };

    ids.forEach((vertexIndex) => {
      const y = position.getY(vertexIndex);
      globalMinY = Math.min(globalMinY, y);
      globalMaxY = Math.max(globalMaxY, y);
    });

    keys.forEach((key) => {
      const list = keyToTriangles.get(key) || [];
      list.push(tri);
      keyToTriangles.set(key, list);
    });
  }

  const componentByTriangle = new Int32Array(triangleCount);
  componentByTriangle.fill(-1);
  const components = [];

  for (let start = 0; start < triangleCount; start += 1) {
    if (componentByTriangle[start] !== -1) continue;
    const componentIndex = components.length;
    const queue = [start];
    componentByTriangle[start] = componentIndex;
    const triangles = [];
    let minY = Infinity;
    let maxY = -Infinity;

    while (queue.length) {
      const tri = queue.pop();
      triangles.push(tri);
      const entry = triangleKeys[tri];
      entry.ids.forEach((vertexIndex) => {
        const y = position.getY(vertexIndex);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      });
      entry.keys.forEach((key) => {
        (keyToTriangles.get(key) || []).forEach((neighbor) => {
          if (componentByTriangle[neighbor] !== -1) return;
          componentByTriangle[neighbor] = componentIndex;
          queue.push(neighbor);
        });
      });
    }

    components.push({ triangles, minY, maxY });
  }

  const totalHeight = Math.max(globalMaxY - globalMinY, 1e-6);
  const woodComponents = new Set();
  components.forEach((component, componentIndex) => {
    const componentHeight = component.maxY - component.minY;
    const nearFloor = component.minY <= globalMinY + totalHeight * 0.08;
    const staysLow = component.maxY <= globalMinY + totalHeight * 0.34;
    const isSmall = component.triangles.length <= triangleCount * 0.14;
    const isLegSized = componentHeight <= totalHeight * 0.36;
    if (nearFloor && staysLow && isSmall && isLegSized) woodComponents.add(componentIndex);
  });

  const sourceMaterials = Array.isArray(object.material) ? object.material : [object.material];
  const sourceMaterial = sourceMaterials[0];
  const upholsteryMaterial = sourceMaterial.clone();
  upholsteryMaterial.map = null;
  upholsteryMaterial.color?.set(upholsteryColor);
  upholsteryMaterial.userData = { ...(upholsteryMaterial.userData || {}), sofaUpholstery: true };

  const woodMaterial = sourceMaterial.clone();
  woodMaterial.color?.set('#ffffff');
  woodMaterial.userData = { ...(woodMaterial.userData || {}), sofaFixedWood: true };

  geometry.clearGroups();
  let runStart = 0;
  let runMaterial = woodComponents.has(componentByTriangle[0]) ? 1 : 0;
  for (let tri = 1; tri <= triangleCount; tri += 1) {
    const nextMaterial = tri < triangleCount && woodComponents.has(componentByTriangle[tri]) ? 1 : 0;
    if (tri < triangleCount && nextMaterial === runMaterial) continue;
    geometry.addGroup(runStart * 3, (tri - runStart) * 3, runMaterial);
    runStart = tri;
    runMaterial = nextMaterial;
  }

  object.material = [upholsteryMaterial, woodMaterial];
}

function applyBeigeSofaUpholsteryColor(target, hexColor) {
  if (!target?.material) return;
  const materials = Array.isArray(target.material) ? target.material : [target.material];
  materials.forEach((material) => {
    if (!material || material.userData?.sofaFixedWood) return;
    material.map?.dispose?.();
    material.map = null;
    material.color?.set(hexColor);
    material.needsUpdate = true;
  });
}

'''

pattern = re.compile(r"const beigeUpholsteryTextureCache = new WeakMap\(\);.*?(?=function createBeigeSofaSetModule)", re.S)
if not pattern.search(s):
    raise SystemExit('sofa texture helper block not found')
s = pattern.sub(new_helpers, s, count=1)

old = '''        if (Array.isArray(object.material)) {
          object.material = object.material.map((material) => cloneBeigeSofaMaterial(material, moduleState.surface?.color ?? '#ffffff'));
        } else if (object.material) {
          object.material = cloneBeigeSofaMaterial(object.material, moduleState.surface?.color ?? '#ffffff');
        }
        colorTargets.push(object);'''
new = '''        separateBeigeSofaWoodMaterial(object, moduleState.surface?.color ?? '#ffffff');
        colorTargets.push(object);'''
if old not in s:
    raise SystemExit('sofa traversal material block not found')
s = s.replace(old, new, 1)

p.write_text(s, encoding='utf-8')
