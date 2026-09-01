from pathlib import Path

scene_path = Path('src/scene3d.js')
lighting_test_path = Path('test/lightboxFabricLighting.test.js')
performance_test_path = Path('test/lightboxFabricPerformance.test.js')
ctrl_test_path = Path('test/ctrlMultiSelect.test.js')
scene = scene_path.read_text()
lighting_test = lighting_test_path.read_text()
performance_test = performance_test_path.read_text()

old = """    const backing = surface.userData?.backing;\n    if (backing) backing.visible = false;\n"""
new = """    const backing = surface.userData?.backing;\n    // Bez yalnızca ön baskı yüzeyini devralır; modülün arka paneli korunur.\n    if (backing) backing.visible = true;\n"""
if old not in scene:
    raise SystemExit('backing suspend block not found')
scene = scene.replace(old, new, 1)

old = "material.emissiveIntensity = 1.60;"
new = "material.emissiveIntensity = 1.08;"
if old not in scene:
    raise SystemExit('lit emissive intensity not found')
scene = scene.replace(old, new, 1)

old = """        context.fillStyle = '#ffffff';\n        context.fillRect(0, 0, canvas.width, canvas.height);\n        context.drawImage(\n          image,\n"""
new = """        context.fillStyle = '#ffffff';\n        context.fillRect(0, 0, canvas.width, canvas.height);\n        // Lightbox baskısında emissive parlamanın yaptığı solmayı telafi et.\n        context.filter = 'saturate(1.08) contrast(1.06)';\n        context.drawImage(\n          image,\n"""
if old not in scene:
    raise SystemExit('fabric canvas draw block not found')
scene = scene.replace(old, new, 1)

old = """          color: baseColor,\n          roughness: 0.86,\n          metalness: 0,\n          emissive: 0x000000,\n          emissiveIntensity: 0,\n          side: THREE.DoubleSide,\n          polygonOffset: true,\n"""
new = """          color: baseColor,\n          roughness: 0.86,\n          metalness: 0,\n          emissive: 0x000000,\n          emissiveIntensity: 0,\n          // Baskı ön yüzde kalır; arkadan normal panel/backing görünür.\n          side: THREE.FrontSide,\n          polygonOffset: true,\n"""
if old not in scene:
    raise SystemExit('fabric material side block not found')
scene = scene.replace(old, new, 1)

pointer_marker = """  renderer.domElement.addEventListener('pointerdown', (event) => {\n    if (event.button !== 0) return;\n\n    const rectangleSelect = event.ctrlKey || event.metaKey;\n"""
ctrl_capture = """  // Ctrl/Cmd + sol tık çoklu panel seçimini OrbitControls'tan önce yakala.\n  // Capture fazı kamera döndürme listener'ının seçimi bozmasını engeller.\n  renderer.domElement.addEventListener('pointerdown', (event) => {\n    if (event.button !== 0 || !(event.ctrlKey || event.metaKey)) return;\n    event.preventDefault();\n    event.stopImmediatePropagation();\n    handleSurfaceSelectionAt(event.clientX, event.clientY, true);\n  }, { capture: true });\n\n""" + pointer_marker
if pointer_marker not in scene:
    raise SystemExit('pointerdown multi-select block not found')
scene = scene.replace(pointer_marker, ctrl_capture, 1)

old = "assert.match(scene, /material\\.emissiveIntensity = 1\\.60/);"
new = "assert.match(scene, /material\\.emissiveIntensity = 1\\.08/);\n  assert.match(scene, /context\\.filter = 'saturate\\(1\\.08\\) contrast\\(1\\.06\\)'/);\n  assert.match(scene, /side: THREE\\.FrontSide/);\n  assert.match(scene, /if \\(backing\\) backing\\.visible = true/);"
if old not in lighting_test:
    raise SystemExit('lighting test intensity assertion not found')
lighting_test = lighting_test.replace(old, new, 1)

old = "assert.match(scene, /backing\\) backing\\.visible = false/);"
new = "assert.match(scene, /backing\\) backing\\.visible = true/);"
if old not in performance_test:
    raise SystemExit('performance backing assertion not found')
performance_test = performance_test.replace(old, new, 1)

ctrl_test = """import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

test('Ctrl/Cmd left click is captured before OrbitControls for rectangle multi-select', () => {
  const scene = readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(scene, /if \(event\.button !== 0 \|\| !\(event\.ctrlKey \|\| event\.metaKey\)\) return/);
  assert.match(scene, /event\.preventDefault\(\);\s*event\.stopImmediatePropagation\(\);\s*handleSurfaceSelectionAt\(event\.clientX, event\.clientY, true\)/s);
  assert.match(scene, /\}, \{ capture: true \}\);/);
});
"""

scene_path.write_text(scene)
lighting_test_path.write_text(lighting_test)
performance_test_path.write_text(performance_test)
ctrl_test_path.write_text(ctrl_test)
