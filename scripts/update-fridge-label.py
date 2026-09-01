from pathlib import Path

scene_path = Path('src/scene3d.js')
scene = scene_path.read_text(encoding='utf-8')
start = scene.index('function createMiniFridgeTopLabel(heightCm) {')
end = scene.index('\nfunction createMiniFridgeModule(moduleState, moduleIndex) {', start)
new_block = '''function createMiniFridgeTopLabel(heightCm) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const context = canvas.getContext('2d');
  if (!context) return null;

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '800 220px Arial, Helvetica, sans-serif';
  context.lineJoin = 'round';
  context.lineWidth = 32;
  context.strokeStyle = 'rgba(255,255,255,0.96)';

  const centerX = canvas.width / 2;
  context.strokeText('BUZ', centerX, 245);
  context.strokeText('DOLABI', centerX, 525);
  context.fillStyle = '#111827';
  context.fillText('BUZ', centerX, 245);
  context.fillText('DOLABI', centerX, 525);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  const label = new THREE.Mesh(
    new THREE.PlaneGeometry(0.40, 0.30),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
    }),
  );
  label.rotation.x = -Math.PI / 2;
  label.position.set(0, Number(heightCm) / 100 + 0.004, -0.04);
  label.renderOrder = 30;
  label.userData.kind = 'decoration';
  label.userData.role = 'mini-fridge-top-label';
  return label;
}
'''
scene_path.write_text(scene[:start] + new_block + scene[end:], encoding='utf-8')

test_path = Path('test/miniFridgeTopLabel.test.js')
test_path.write_text("""import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('mini fridge owns centered two-line BUZ DOLABI top label', () => {
  const source = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /function createMiniFridgeTopLabel\\(heightCm\\)/);
  assert.match(source, /const centerX = canvas\\.width \\/ 2/);
  assert.match(source, /strokeText\\('BUZ', centerX/);
  assert.match(source, /strokeText\\('DOLABI', centerX/);
  assert.match(source, /fillText\\('BUZ', centerX/);
  assert.match(source, /fillText\\('DOLABI', centerX/);
  assert.match(source, /PlaneGeometry\\(0\\.40, 0\\.30\\)/);
  assert.match(source, /const topLabel = createMiniFridgeTopLabel\\(heightCm\\)/);
  assert.match(source, /role = 'mini-fridge-top-label'/);
});
""", encoding='utf-8')
