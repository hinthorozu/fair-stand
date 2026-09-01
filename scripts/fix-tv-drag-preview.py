from pathlib import Path
p=Path('src/scene3d.js')
s=p.read_text()
old="""      } else if (moduleState?.type === 'showcase-2' || moduleState?.type === 'showcase-3') {
        preview.style.background = 'linear-gradient(to bottom,#f7f7f5 0 32%,#d8eadb 32% 72%,#f7f7f5 72% 100%)';
      } else {
        preview.style.background = 'repeating-linear-gradient(to bottom,#f7f7f5 0 5px,#c4c9ce 5px 6px)';
      }
"""
new="""      } else if (moduleState?.type === 'showcase-2' || moduleState?.type === 'showcase-3') {
        preview.style.background = 'linear-gradient(to bottom,#f7f7f5 0 32%,#d8eadb 32% 72%,#f7f7f5 72% 100%)';
      } else if (moduleState?.type === 'tv') {
        preview.style.width = '48px';
        preview.style.height = '42px';
        preview.style.border = '0';
        preview.style.background = 'transparent';
        const screen = document.createElement('span');
        screen.style.cssText = 'position:absolute;left:3px;top:2px;width:42px;height:25px;box-sizing:border-box;border:3px solid #34383d;background:#f8fafc;border-radius:2px';
        const stem = document.createElement('span');
        stem.style.cssText = 'position:absolute;left:21px;top:27px;width:6px;height:7px;background:#34383d';
        const base = document.createElement('span');
        base.style.cssText = 'position:absolute;left:13px;top:34px;width:22px;height:4px;background:#34383d;border-radius:2px';
        preview.append(screen, stem, base);
      } else {
        preview.style.background = 'repeating-linear-gradient(to bottom,#f7f7f5 0 5px,#c4c9ce 5px 6px)';
      }
"""
if old not in s: raise SystemExit('drag badge target not found')
s=s.replace(old,new,1)
# Make TV placement ghost visually screen-like rather than a generic panel slab.
old2="""    const ghostMaterial = new THREE.MeshBasicMaterial({
      color: PLACEMENT_VALID_COLOR,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.93, 0.523, 0.05),
      ghostMaterial,
    );
    mesh.position.set(0, 1.75, 0.025);
    mesh.renderOrder = 10000;
    root.add(mesh);
"""
new2="""    const ghostMaterial = new THREE.MeshBasicMaterial({
      color: PLACEMENT_VALID_COLOR,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
      depthTest: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.93, 0.523, 0.05),
      ghostMaterial,
    );
    mesh.position.set(0, 1.75, 0.055);
    mesh.renderOrder = 10000;
    root.add(mesh);

    const bezelMaterial = ghostMaterial.clone();
    bezelMaterial.opacity = 0.9;
    const bezel = new THREE.LineSegments(
      new THREE.EdgesGeometry(new THREE.BoxGeometry(0.93, 0.523, 0.05)),
      new THREE.LineBasicMaterial({
        color: PLACEMENT_VALID_COLOR,
        transparent: true,
        opacity: 0.95,
        depthTest: false,
      }),
    );
    bezel.position.copy(mesh.position);
    bezel.renderOrder = 10001;
    root.add(bezel);
"""
if old2 not in s: raise SystemExit('tv ghost target not found')
s=s.replace(old2,new2,1)
p.write_text(s)
