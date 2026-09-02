from pathlib import Path
import re


def replace_exact(path, old, new, count=1):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    found = text.count(old)
    if found != count:
        raise SystemExit(f'{path}: expected {count} occurrences, found {found}: {old!r}')
    p.write_text(text.replace(old, new, count), encoding='utf-8')


def regex_replace_exact(path, pattern, replacement, count=1, flags=0):
    p = Path(path)
    text = p.read_text(encoding='utf-8')
    new_text, found = re.subn(pattern, replacement, text, count=count, flags=flags)
    if found != count:
        raise SystemExit(f'{path}: expected {count} regex matches, found {found}: {pattern!r}')
    p.write_text(new_text, encoding='utf-8')


# Catalog: remove the second plant item, key and Extra membership.
replace_exact(
    'src/catalog.js',
    "  EXTRA_INDOOR_PLANT_2: { type: 'indoor-plant-2', widthCm: 60, depthCm: 60, heightCm: 120, label: 'Yapay Çiçek 2' },\n",
    '',
)
replace_exact('src/catalog.js', "  'EXTRA_INDOOR_PLANT_2',\n", '')
replace_exact('src/catalog.js', ", 'EXTRA_INDOOR_PLANT_2']", "]")

# State factory now creates only the retained plant.
regex_replace_exact(
    'src/designState.js',
    r"export function createIndoorPlantModuleState\(variant = 1\) \{\n  const resolvedVariant = Number\(variant\) === 2 \? 2 : 1;\n  return \{\n    id: createId\('module'\),\n    type: resolvedVariant === 2 \? 'indoor-plant-2' : 'indoor-plant-1',\n    widthCm: 60,\n    depthCm: 60,\n    heightCm: 120,\n  \};\n\}",
    "export function createIndoorPlantModuleState() {\n  return {\n    id: createId('module'),\n    type: 'indoor-plant-1',\n    widthCm: 60,\n    depthCm: 60,\n    heightCm: 120,\n  };\n}",
)

# Catalog -> state creation only supports plant 1.
replace_exact("src/main.js", "  else if (module.type === 'indoor-plant-1') state = createIndoorPlantModuleState(1);\n", "  else if (module.type === 'indoor-plant-1') state = createIndoorPlantModuleState();\n")
replace_exact("src/main.js", "  else if (module.type === 'indoor-plant-2') state = createIndoorPlantModuleState(2);\n", '')

# Placement behavior for plant 2 is removed.
regex_replace_exact(
    'src/moduleBehavior.js',
    r"'indoor-plant-2': Object\.freeze\(\{\n  placement: 'free',\n  moveSnapCm: 10,\n  rotationStepDeg: 90,\n  defaultRotationDeg: 0,\n  allowSideInsert: true,\n  collision: 'footprint',\n\}\),\n",
    '',
)

# Catalog preview now has a single retained plant path with exactly two leaves.
regex_replace_exact(
    'src/moduleDragSidebar.js',
    r"  if \(module\.type === 'indoor-plant-1' \|\| module\.type === 'indoor-plant-2'\) \{\n    const plant = document\.createElement\('div'\);\n    const plantVariant = module\.type === 'indoor-plant-1' \? '1' : '2';\n    const leafCount = plantVariant === '1' \? 2 : 3;\n    plant\.className = `module-drag-plant module-drag-plant-\$\{plantVariant\}`;\n\n    \['pot', 'stem'\]\.forEach\(\(part\) => \{\n      const element = document\.createElement\('i'\);\n      element\.className = `module-drag-plant-\$\{part\}`;\n      plant\.appendChild\(element\);\n    \}\);\n\n    \['a', 'b', 'c'\]\.slice\(0, leafCount\)\.forEach\(\(leafName\) => \{\n      const leaf = document\.createElement\('i'\);\n      leaf\.className = `module-drag-plant-leaf leaf-\$\{leafName\}`;\n      plant\.appendChild\(leaf\);\n    \}\);\n\n    preview\.appendChild\(plant\);\n    return preview;\n  \}",
    "  if (module.type === 'indoor-plant-1') {\n    const plant = document.createElement('div');\n    plant.className = 'module-drag-plant module-drag-plant-1';\n\n    ['pot', 'stem'].forEach((part) => {\n      const element = document.createElement('i');\n      element.className = `module-drag-plant-${part}`;\n      plant.appendChild(element);\n    });\n\n    ['a', 'b'].forEach((leafName) => {\n      const leaf = document.createElement('i');\n      leaf.className = `module-drag-plant-leaf leaf-${leafName}`;\n      plant.appendChild(leaf);\n    });\n\n    preview.appendChild(plant);\n    return preview;\n  }",
)
replace_exact('src/moduleDragSidebar.js', "    .module-drag-plant-2 .leaf-d { display:none; }\n", '')

# Scene renderer only accepts and loads plant 1. The unused GLB stays in public/models.
replace_exact(
    'src/scene3d.js',
    "      } else if (moduleState.type === 'indoor-plant-1' || moduleState.type === 'indoor-plant-2') {\n",
    "      } else if (moduleState.type === 'indoor-plant-1') {\n",
)
replace_exact(
    'src/scene3d.js',
    "  const type = moduleState.type === 'indoor-plant-2' ? 'indoor-plant-2' : 'indoor-plant-1';\n  const modelFile = type === 'indoor-plant-2' ? 'indoor_plants2.glb' : 'indoor_plants.glb';\n",
    "  const type = 'indoor-plant-1';\n  const modelFile = 'indoor_plants.glb';\n",
)

# Regression: no runtime/catalog references remain, but the parked GLB is preserved.
Path('test/removedIndoorPlant2.test.js').write_text("""import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const sourceFiles = [
  '../src/catalog.js',
  '../src/designState.js',
  '../src/main.js',
  '../src/moduleBehavior.js',
  '../src/moduleDragSidebar.js',
  '../src/scene3d.js',
];
const source = sourceFiles
  .map((file) => readFileSync(new URL(file, import.meta.url), 'utf8'))
  .join('\\n');

test('Yapay Çiçek 2 is removed from every system code path', () => {
  assert.doesNotMatch(source, /indoor-plant-2/);
  assert.doesNotMatch(source, /EXTRA_INDOOR_PLANT_2/);
  assert.doesNotMatch(source, /Yapay Çiçek 2/);
  assert.doesNotMatch(source, /indoor_plants2\\.glb/);
});

test('indoor_plants2.glb remains parked in public models for possible future use', () => {
  assert.equal(existsSync(new URL('../public/models/indoor_plants2.glb', import.meta.url)), true);
});
""", encoding='utf-8')

print('Indoor Plant 2 system references removed; GLB preserved.')
