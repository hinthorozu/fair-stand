from pathlib import Path

scene = Path('src/scene3d.js')
s = scene.read_text()

old = """let tvScreenTexture = null;\n\nfunction getTvScreenTexture() {\n  if (!tvScreenTexture) {\n    tvScreenTexture = new THREE.TextureLoader().load(TV_SCREEN_DATA_URL);\n    tvScreenTexture.colorSpace = THREE.SRGBColorSpace;\n  }\n  return tvScreenTexture;\n}\n"""
new = """let tvScreenBlob = null;\n\nfunction getTvScreenBlob() {\n  if (tvScreenBlob) return tvScreenBlob;\n  const marker = 'base64,';\n  const markerIndex = TV_SCREEN_DATA_URL.indexOf(marker);\n  if (markerIndex < 0) throw new Error('TV screen image is not a base64 data URL.');\n  const payload = TV_SCREEN_DATA_URL.slice(markerIndex + marker.length);\n  const binary = window.atob(payload);\n  const bytes = new Uint8Array(binary.length);\n  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);\n  tvScreenBlob = new Blob([bytes], { type: 'image/jpeg' });\n  return tvScreenBlob;\n}\n\nfunction createTvScreenTexture() {\n  const objectUrl = URL.createObjectURL(getTvScreenBlob());\n  const texture = new THREE.TextureLoader().load(\n    objectUrl,\n    () => URL.revokeObjectURL(objectUrl),\n    undefined,\n    () => URL.revokeObjectURL(objectUrl),\n  );\n  texture.colorSpace = THREE.SRGBColorSpace;\n  return texture;\n}\n"""
if old not in s:
    raise SystemExit('global TV texture helper block not found')
s = s.replace(old, new, 1)

stale = """  const textureLoader = new THREE.TextureLoader();\n  const tvScreenTexture = textureLoader.load(TV_SCREEN_DATA_URL);\n  tvScreenTexture.colorSpace = THREE.SRGBColorSpace;\n  tvScreenTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();\n\n"""
if stale not in s:
    raise SystemExit('stale scene-local TV texture block not found')
s = s.replace(stale, '', 1)

old_create = "  const screenTexture = new THREE.TextureLoader().load(TV_SCREEN_DATA_URL);\n  screenTexture.colorSpace = THREE.SRGBColorSpace;"
new_create = "  const screenTexture = createTvScreenTexture();"
if old_create not in s:
    raise SystemExit('TV module direct data URL load not found')
s = s.replace(old_create, new_create, 1)

scene.write_text(s)

test = Path('test/tv42Module.test.js')
t = test.read_text()
t = t.replace("  assert.match(tvSource, /new THREE\\.TextureLoader\\(\\)\\.load\\(TV_SCREEN_DATA_URL\\)/);\n", "  assert.match(tvSource, /createTvScreenTexture\\(\\)/);\n")
t = t.replace("  assert.match(tvSource, /screenTexture\\.colorSpace = THREE\\.SRGBColorSpace/);\n", "")
needle = "test('TV 42 does not inherit flat panel state'"
guard = """test('TV texture avoids loading the data URI as a URL', () => {\n  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n  assert.match(source, /function getTvScreenBlob\\(\\)/);\n  assert.match(source, /URL\\.createObjectURL\\(getTvScreenBlob\\(\\)\\)/);\n  assert.match(source, /texture\\.colorSpace = THREE\\.SRGBColorSpace/);\n  assert.doesNotMatch(source, /load\\(TV_SCREEN_DATA_URL\\)/);\n});\n\n"""
if guard not in t:
    t = t.replace(needle, guard + needle, 1)
test.write_text(t)
