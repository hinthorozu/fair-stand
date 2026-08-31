from pathlib import Path

# 1) Extend the central module behavior contract with ghost behavior.
p = Path('src/moduleBehavior.js')
s = p.read_text()

s = s.replace(
"""const DEFAULT_BEHAVIOR = Object.freeze({
  placement: 'wall',
  moveSnapCm: 50,
  rotationStepDeg: 90,
  defaultRotationDeg: 0,
  allowSideInsert: true,
  collision: 'segment',
});""",
"""const DEFAULT_GHOST_BEHAVIOR = Object.freeze({
  kind: 'proxy',
  renderer: 'proxy',
  opacity: 0.30,
});

const DEFAULT_BEHAVIOR = Object.freeze({
  placement: 'wall',
  moveSnapCm: 50,
  rotationStepDeg: 90,
  defaultRotationDeg: 0,
  allowSideInsert: true,
  collision: 'segment',
  ghost: DEFAULT_GHOST_BEHAVIOR,
});""",
1,
)

replacements = {
"""  'sofa-set-classic': Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'footprint',
  }),""":
"""  'sofa-set-classic': Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'footprint',
    ghost: Object.freeze({ kind: 'custom', renderer: 'sofa-set-classic', opacity: 0.38 }),
  }),""",
"""  'table-chair-set-eames': Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'footprint',
  }),""":
"""  'table-chair-set-eames': Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 90,
    defaultRotationDeg: 0,
    allowSideInsert: true,
    collision: 'footprint',
    ghost: Object.freeze({ kind: 'custom', renderer: 'table-chair-set-eames', opacity: 0.38 }),
  }),""",
"""  'bar-stool': Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 45,
    defaultRotationDeg: 270,
    allowSideInsert: true,
    collision: 'footprint',
  }),""":
"""  'bar-stool': Object.freeze({
    placement: 'free',
    moveSnapCm: 10,
    rotationStepDeg: 45,
    defaultRotationDeg: 270,
    allowSideInsert: true,
    collision: 'footprint',
    ghost: Object.freeze({ kind: 'real-model', renderer: 'bar-stool', opacity: 0.38 }),
  }),""",
}
for old, new in replacements.items():
    if old not in s:
        raise SystemExit(f'moduleBehavior block not found: {old.splitlines()[0]}')
    s = s.replace(old, new, 1)

# Ensure all type-specific behaviors inherit a ghost even when not explicitly customized.
old_get = """  const base = TYPE_BEHAVIORS[type] ?? DEFAULT_BEHAVIOR;

  // Only the verified straight Banko family (100/150/200) gets 45-degree turns."""
new_get = """  const declared = TYPE_BEHAVIORS[type] ?? DEFAULT_BEHAVIOR;
  const base = declared.ghost
    ? declared
    : { ...declared, ghost: DEFAULT_GHOST_BEHAVIOR };

  // Only the verified straight Banko family (100/150/200) gets 45-degree turns."""
if old_get not in s:
    raise SystemExit('getModuleBehavior base block not found')
s = s.replace(old_get, new_get, 1)

append_after = """export function getModuleMoveSnapCm(moduleOrType) {
  return Number(getModuleBehavior(moduleOrType).moveSnapCm) || 50;
}
"""
append_new = append_after + """
export function getModuleGhostBehavior(moduleOrType) {
  return getModuleBehavior(moduleOrType).ghost ?? DEFAULT_GHOST_BEHAVIOR;
}
"""
if append_after not in s:
    raise SystemExit('getModuleMoveSnapCm block not found')
s = s.replace(append_after, append_new, 1)
p.write_text(s)

# 2) Route scene ghost selection through the behavior registry, not module type.
p = Path('src/scene3d.js')
s = p.read_text()
old_import = "import { getModuleRotationStepDeg, isFreePlacementModule, isTopPlacementModule } from './moduleBehavior.js';"
new_import = "import { getModuleGhostBehavior, getModuleRotationStepDeg, isFreePlacementModule, isTopPlacementModule } from './moduleBehavior.js';"
if old_import not in s:
    raise SystemExit('scene moduleBehavior import not found')
s = s.replace(old_import, new_import, 1)

signature = "  function ensurePlacementGhost(moduleOrWidthCm) {\n"
if signature not in s:
    raise SystemExit('ensurePlacementGhost signature not found')
s = s.replace(signature, signature + "    const ghostBehavior = getModuleGhostBehavior(moduleOrWidthCm);\n", 1)

for old, new in [
    ("if (moduleOrWidthCm?.type === 'sofa-set-classic') {", "if (ghostBehavior.renderer === 'sofa-set-classic') {"),
    ("if (moduleOrWidthCm?.type === 'table-chair-set-eames') {", "if (ghostBehavior.renderer === 'table-chair-set-eames') {"),
    ("if (moduleOrWidthCm?.type === 'bar-stool') {", "if (ghostBehavior.renderer === 'bar-stool') {"),
]:
    if old not in s:
        raise SystemExit(f'ghost renderer branch not found: {old}')
    s = s.replace(old, new, 1)

# Standard proxy opacity now also comes from the registry.
s = s.replace(
    "opacity: PLACEMENT_GHOST_OPACITY,",
    "opacity: Number(ghostBehavior.opacity) || PLACEMENT_GHOST_OPACITY,",
    1,
)
p.write_text(s)

# 3) Extend regression coverage for the standard contract.
p = Path('tests/moduleBehavior.test.js')
s = p.read_text()
s = s.replace(
"""  getModuleDefaultRotationDeg,
  getModuleMoveSnapCm,
  getModuleRotationStepDeg,
""",
"""  getModuleDefaultRotationDeg,
  getModuleGhostBehavior,
  getModuleMoveSnapCm,
  getModuleRotationStepDeg,
""",
1,
)

extra = r'''

test('ghost behavior is part of the central module contract', () => {
  assert.deepEqual(getModuleGhostBehavior({ type: 'bar-stool' }), {
    kind: 'real-model', renderer: 'bar-stool', opacity: 0.38,
  });
  assert.deepEqual(getModuleGhostBehavior({ type: 'table-chair-set-eames' }), {
    kind: 'custom', renderer: 'table-chair-set-eames', opacity: 0.38,
  });
  assert.deepEqual(getModuleGhostBehavior({ type: 'sofa-set-classic' }), {
    kind: 'custom', renderer: 'sofa-set-classic', opacity: 0.38,
  });
});

test('new or unknown modules get a safe proxy ghost by default', () => {
  assert.deepEqual(getModuleGhostBehavior({ type: 'future-module' }), {
    kind: 'proxy', renderer: 'proxy', opacity: 0.30,
  });
});
'''
if "ghost behavior is part of the central module contract" not in s:
    s += extra
p.write_text(s)

# 4) Document the contract for every future module addition.
doc = r'''# Module Behavior Standard

`src/moduleBehavior.js` is the single source of truth for editor behavior that differs by module type.

Every new module must use this contract instead of adding scattered type checks for placement behavior. The behavior record covers:

- `placement`: `wall`, `free`, or `top`
- `moveSnapCm`: movement/grid step in centimetres
- `rotationStepDeg`: R / Shift+R rotation step
- `defaultRotationDeg`: initial facing
- `allowSideInsert`: whether context left/right insertion is allowed
- `collision`: collision strategy
- `ghost`: placement preview strategy

## Ghost contract

Every module has a ghost definition. Missing/unknown module types automatically receive the safe proxy ghost:

```js
{ kind: 'proxy', renderer: 'proxy', opacity: 0.30 }
```

For modules that need a real model or composed preview, declare it in `TYPE_BEHAVIORS`:

```js
ghost: {
  kind: 'real-model', // or 'custom'
  renderer: 'bar-stool',
  opacity: 0.38,
}
```

`scene3d.js` must route ghost creation through `getModuleGhostBehavior()` and the declared `renderer`. Do not introduce a new module-type decision for choosing a ghost outside this registry.

When adding a new module, add/verify its behavior contract and a regression test in the same change.
'''
Path('MODULE_BEHAVIOR_STANDARD.md').write_text(doc)

print('Ghost behavior standard applied.')
