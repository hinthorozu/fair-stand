from pathlib import Path
import base64,re

img_src=Path('src/tvScreenImage.js').read_text()
m=re.search(r"data:image/jpeg;base64,([^']+)",img_src)
if not m:
    raise SystemExit('TV base64 payload not found')
payload=re.sub(r'\s+','',m.group(1)).replace('-','+').replace('_','/')
payload += '=' * (-len(payload) % 4)
raw=base64.b64decode(payload, validate=False)
if not raw.startswith(b'\xff\xd8'):
    raise SystemExit('decoded TV payload is not JPEG')
Path('public/tv-screen.jpg').write_bytes(raw)

scene=Path('src/scene3d.js')
s=scene.read_text()
# Remove blob/atob helper block and replace with direct real-file loader.
start=s.find('let tvScreenBlob = null;')
end=s.find('\nfunction createTvScreenTexture()', start)
if start < 0 or end < 0:
    raise SystemExit('TV blob helper start not found')
func_end=s.find('\n}', end)+2
replacement="""function createTvScreenTexture() {
  const texture = new THREE.TextureLoader().load('/tv-screen.jpg');
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}"""
s=s[:start]+replacement+s[func_end:]
Path('src/scene3d.js').write_text(s)

test=Path('test/tv42Module.test.js')
t=test.read_text()
t=t.replace("test('TV texture avoids loading the data URI as a URL', () => {\n  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n  assert.match(source, /function getTvScreenBlob\\(\\)/);\n  assert.match(source, /URL\\.createObjectURL\\(getTvScreenBlob\\(\\)\\)/);\n  assert.doesNotMatch(source, /load\\(TV_SCREEN_DATA_URL\\)/);\n});\n\n", "test('TV texture loads from a real public JPEG asset', () => {\n  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');\n  assert.match(source, /load\\('\/tv-screen\\.jpg'\\)/);\n  assert.doesNotMatch(source, /atob\\(/);\n  assert.equal(fs.existsSync(new URL('../public/tv-screen.jpg', import.meta.url)), true);\n});\n\n")
Path('test/tv42Module.test.js').write_text(t)
