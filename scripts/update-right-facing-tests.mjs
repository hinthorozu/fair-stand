import fs from 'node:fs';

function replaceRequired(source, needle, replacement, label) {
  if (!source.includes(needle)) throw new Error(`Patch target not found: ${label}`);
  return source.replaceAll(needle, replacement);
}

{
  const file = 'test/moduleMove.test.js';
  let source = fs.readFileSync(file, 'utf8');
  source = replaceRequired(
    source,
    "function right(xCm, yCm) {\n  return { xCm, yCm, zCm: 0, rotationZDeg: 90, wallId: 'right' };\n}",
    "function right(xCm, yCm) {\n  return { xCm, yCm, zCm: 0, rotationZDeg: 270, wallId: 'right' };\n}",
    'moduleMove right helper',
  );
  source = source.replace(
    "test('dragging from the back wall to a free right-wall slot keeps a 90 degree placement'",
    "test('dragging from the back wall to a free right-wall slot keeps a 270 degree placement'",
  );
  source = source.replace(
    "  assert.equal(result.movingPlacement.rotationZDeg, 90);\n  assert.equal(result.movingPlacement.wallId, 'right');",
    "  assert.equal(result.movingPlacement.rotationZDeg, 270);\n  assert.equal(result.movingPlacement.wallId, 'right');",
  );
  fs.writeFileSync(file, source);
}

{
  const file = 'test/wallReflow.test.js';
  let source = fs.readFileSync(file, 'utf8');
  source = replaceRequired(
    source,
    "rotationZDeg: 90,\n    wallId: 'right'",
    "rotationZDeg: 270,\n    wallId: 'right'",
    'wallReflow right expectations',
  );
  fs.writeFileSync(file, source);
}
