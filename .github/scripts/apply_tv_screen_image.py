from pathlib import Path

path = Path('src/scene3d.js')
source = path.read_text()

import_line = "import { TV_SCREEN_DATA_URL } from './tvScreenImage.js';\n"
import_anchor = "import { getModuleGhostBehavior, getModuleRotationStepDeg, isFreePlacementModule, isTopPlacementModule, isWallOverlayModule } from './moduleBehavior.js';\n"
if import_line not in source:
    if import_anchor not in source:
        raise SystemExit('TV screen import anchor not found')
    source = source.replace(import_anchor, import_anchor + import_line, 1)

texture_anchor = "  const textureLoader = new THREE.TextureLoader();\n"
helper = """  const textureLoader = new THREE.TextureLoader();
  const tvScreenTexture = textureLoader.load(TV_SCREEN_DATA_URL);
  tvScreenTexture.colorSpace = THREE.SRGBColorSpace;
  tvScreenTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  function addTvScreenOverlay(group) {
    if (!group || group.getObjectByName('tv-screen-image-overlay')) return;
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.88, 0.495),
      new THREE.MeshBasicMaterial({
        map: tvScreenTexture,
        toneMapped: false,
        side: THREE.FrontSide,
      }),
    );
    screen.name = 'tv-screen-image-overlay';
    screen.position.set(0, 1.75, 0.041);
    screen.renderOrder = 50;
    screen.userData.kind = 'tv-screen-overlay';
    screen.userData.acceptsImage = false;
    group.add(screen);
  }
"""
if "function addTvScreenOverlay(group)" not in source:
    if texture_anchor not in source:
        raise SystemExit('TV screen texture anchor not found')
    source = source.replace(texture_anchor, helper, 1)

add_anchor = "      wallRoot.add(module.group);\n      surfaceMeshes.push(...module.surfaces);\n"
add_replacement = "      wallRoot.add(module.group);\n      if (moduleState.type === 'tv') addTvScreenOverlay(module.group);\n      surfaceMeshes.push(...module.surfaces);\n"
if "if (moduleState.type === 'tv') addTvScreenOverlay(module.group);" not in source:
    if add_anchor not in source:
        raise SystemExit('TV group add anchor not found')
    source = source.replace(add_anchor, add_replacement, 1)

path.write_text(source)
