from pathlib import Path

scene = Path('src/scene3d.js')
s = scene.read_text(encoding='utf-8')
old = """  // Each rendered TV owns its texture clone. disposeWall() may dispose module maps\n  // during rebuilds without invalidating the cached source texture used by later TVs.\n  const screenTexture = getTvScreenTexture().clone();\n  screenTexture.needsUpdate = true;\n"""
new = """  // Each rendered TV owns a real TextureLoader result. Cloning the cached texture\n  // before its async image load completes leaves clone.image empty and WebGL warns\n  // \"Texture marked for update but no image data found\".\n  const screenTexture = new THREE.TextureLoader().load(TV_SCREEN_DATA_URL);\n  screenTexture.colorSpace = THREE.SRGBColorSpace;\n"""
if old not in s:
    raise SystemExit('TV cloned texture block not found')
s = s.replace(old, new, 1)
scene.write_text(s, encoding='utf-8')

test = Path('test/tv42Module.test.js')
t = test.read_text(encoding='utf-8')
t = t.replace("assert.match(tvSource, /getTvScreenTexture\\(\\)\\.clone\\(\\)/);", "assert.match(tvSource, /new THREE\\.TextureLoader\\(\\)\\.load\\(TV_SCREEN_DATA_URL\\)/);\n  assert.match(tvSource, /screenTexture\\.colorSpace = THREE\\.SRGBColorSpace/);\n  assert.doesNotMatch(tvSource, /getTvScreenTexture\\(\\)\\.clone\\(\\)/);")
test.write_text(t, encoding='utf-8')
