from pathlib import Path

p = Path('src/modulePlacement.js')
s = p.read_text()
start = s.find('function getVisualRightVector(rotationZDeg)')
if start < 0:
    start = s.find('function getVisualRightAxisDirection(rotationZDeg)')
end = s.find('export function planFreeSideInsertion', start)
if start < 0 or end < 0:
    raise SystemExit('free-side placement markers not found')
new_side = '''function getVisualRightVector(rotationZDeg) {
  const radians = normalizeModuleRotationZDeg(rotationZDeg) * Math.PI / 180;
  return { x: Math.cos(radians), y: -Math.sin(radians) };
}

export function createFreeSidePlacement({
  sourcePlacement,
  sourceWidthCm,
  insertedWidthCm,
  side = 'right',
} = {}) {
  if (!sourcePlacement || (side !== 'left' && side !== 'right')) return null;
  const sourceWidth = Number(sourceWidthCm);
  const insertedWidth = Number(insertedWidthCm);
  if (![sourceWidth, insertedWidth].every(Number.isFinite) || sourceWidth <= 0 || insertedWidth <= 0) return null;

  const rotationZDeg = normalizeModuleRotationZDeg(sourcePlacement.rotationZDeg);
  const sourceCenter = getPlacementCenterCm(sourcePlacement, sourceWidth);
  if (!sourceCenter) return null;
  const right = getVisualRightVector(rotationZDeg);
  const direction = side === 'right' ? 1 : -1;
  const centerDistance = (sourceWidth + insertedWidth) / 2;

  return placementFromCenterCm({
    centerXCm: sourceCenter.xCm + right.x * centerDistance * direction,
    centerYCm: sourceCenter.yCm + right.y * centerDistance * direction,
    widthCm: insertedWidth,
    rotationZDeg,
    template: {
      zCm: sourcePlacement.zCm ?? 0,
      wallId: 'free',
    },
  });
}

'''
s = s[:start] + new_side + s[end:]
p.write_text(s)
print('Repaired free-side placement block deterministically.')
