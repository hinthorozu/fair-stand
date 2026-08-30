from pathlib import Path

path = Path('src/scene3d.js')
text = path.read_text()
old = """      const isLoveseat = placement.meshName === 'beigechair2seatsofa_tripo_mat_0691346e_0';
      const loveseatSizeCorrection = isLoveseat ? 1.50 : 1;
      const uniformScale = orientedSize.x > 0
        ? (placement.targetWidthM / orientedSize.x) * loveseatSizeCorrection
        : loveseatSizeCorrection;
"""
new = """      const isLoveseat = placement.meshName === 'beigechair2seatsofa_tripo_mat_0691346e_0';
      const loveseatSizeCorrection = isLoveseat ? 1.50 : 1;
      const sourceSize = sourceBox.getSize(new THREE.Vector3());
      const physicalWidthM = isLoveseat
        ? orientedSize.x
        : Math.max(sourceSize.x, sourceSize.z);
      const uniformScale = physicalWidthM > 0
        ? (placement.targetWidthM / physicalWidthM) * loveseatSizeCorrection
        : loveseatSizeCorrection;
"""
if old not in text:
    raise SystemExit('Expected beige sofa scale block not found')
text = text.replace(old, new, 1)
path.write_text(text)
