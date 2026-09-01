from pathlib import Path
import base64
import re

image_source_path = Path('src/tvScreenImage.js')
img_src = image_source_path.read_text()
m = re.search(r"data:image/jpeg;base64,([^']+)", img_src)
if not m:
    raise SystemExit('TV base64 payload not found')

payload = re.sub(r'\s+', '', m.group(1)).replace('-', '+').replace('_', '/')
payload += '=' * (-len(payload) % 4)
raw = base64.b64decode(payload, validate=False)
if not raw.startswith(b'\xff\xd8'):
    raise SystemExit('decoded TV payload is not JPEG')
Path('public/tv-screen.jpg').write_bytes(raw)

scene_path = Path('src/scene3d.js')
s = scene_path.read_text()
s = s.replace("import { TV_SCREEN_DATA_URL } from './tvScreenImage.js';\n", '')

start = s.find('let tvScreenBlob = null;')
end = s.find('\nlet barStoolModelPromise = null;', start)
if start < 0 or end < 0:
    raise SystemExit('TV blob/texture helper block not found')
replacement = """function createTvScreenTexture() {
  const texture = new THREE.TextureLoader().load(import.meta.env.BASE_URL + 'tv-screen.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

"""
s = s[:start] + replacement + s[end + 1:]
scene_path.write_text(s)

# Inline data URI is no longer runtime source of truth.
image_source_path.unlink()

test_path = Path('test/tv42Module.test.js')
t = test_path.read_text()
old_texture_test = re.compile(
    r"test\('TV texture avoids loading the data URI as a URL', \(\) => \{.*?\n\}\);\n",
    re.S,
)
new_texture_test = """test('TV texture loads from a real public JPEG asset', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /load\(import\.meta\.env\.BASE_URL \+ 'tv-screen\\.jpg'\)/);
  assert.match(source, /texture\\.colorSpace = THREE\\.SRGBColorSpace/);
  assert.doesNotMatch(source, /atob\\(/);
  assert.doesNotMatch(source, /TV_SCREEN_DATA_URL/);
  assert.equal(fs.existsSync(new URL('../public/tv-screen.jpg', import.meta.url)), true);
});
"""
t, count = old_texture_test.subn(new_texture_test, t, count=1)
if count != 1:
    raise SystemExit('TV texture test block not found')

old_asset_test = re.compile(
    r"test\('TV no longer depends on a GLB asset', \(\) => \{.*?\n\}\);\n",
    re.S,
)
new_asset_test = """test('TV uses the public JPEG asset and no GLB or inline data module', () => {
  assert.equal(fs.existsSync(new URL('../public/models/tv.glb', import.meta.url)), false);
  assert.equal(fs.existsSync(new URL('../src/tvScreenImage.js', import.meta.url)), false);
  assert.equal(fs.existsSync(new URL('../public/tv-screen.jpg', import.meta.url)), true);
});
"""
t, count = old_asset_test.subn(new_asset_test, t, count=1)
if count != 1:
    raise SystemExit('TV asset dependency test block not found')

test_path.write_text(t)
