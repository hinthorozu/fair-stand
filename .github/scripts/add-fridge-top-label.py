from pathlib import Path

path = Path('src/scene3d.js')
text = path.read_text(encoding='utf-8')

marker = 'function createMiniFridgeModule(moduleState, moduleIndex) {'
if marker not in text:
    raise SystemExit('createMiniFridgeModule not found')

if 'function createMiniFridgeTopLabel(' not in text:
    helper = '''function createMiniFridgeTopLabel(heightCm) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const context = canvas.getContext('2d');
  if (!context) return null;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '800 128px Arial, Helvetica, sans-serif';
  context.lineJoin = 'round';
  context.lineWidth = 24;
  context.strokeStyle = 'rgba(255,255,255,0.96)';
  context.strokeText('BUZ DOLABI', canvas.width / 2, canvas.height / 2);
  context.fillStyle = '#111827';
  context.fillText('BUZ DOLABI', canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.38, 0.095),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
    }),
  );
  label.rotation.x = -Math.PI / 2;
  label.position.set(0, Number(heightCm) / 100 + 0.004, -0.12);
  label.renderOrder = 30;
  label.userData.kind = 'decoration';
  label.userData.role = 'mini-fridge-top-label';
  return label;
}

'''
    text = text.replace(marker, helper + marker, 1)

start = text.index(marker)
end_marker = 'function createKettleModule(moduleState, moduleIndex) {'
end = text.index(end_marker, start)
block = text[start:end]

if 'const topLabel = createMiniFridgeTopLabel(heightCm);' not in block:
    target = '  const group = new THREE.Group();\n'
    if target not in block:
        raise SystemExit('mini fridge group creation not found')
    replacement = target + '  const topLabel = createMiniFridgeTopLabel(heightCm);\n  if (topLabel) group.add(topLabel);\n'
    block = block.replace(target, replacement, 1)
    text = text[:start] + block + text[end:]

path.write_text(text, encoding='utf-8')

Path('test/miniFridgeTopLabel.test.js').write_text('''import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('mini fridge owns BUZ DOLABI top label', () => {
  const source = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /function createMiniFridgeTopLabel\\(heightCm\\)/);
  assert.match(source, /strokeText\\('BUZ DOLABI'/);
  assert.match(source, /fillText\\('BUZ DOLABI'/);
  assert.match(source, /const topLabel = createMiniFridgeTopLabel\\(heightCm\\)/);
  assert.match(source, /role = 'mini-fridge-top-label'/);
});
''', encoding='utf-8')
