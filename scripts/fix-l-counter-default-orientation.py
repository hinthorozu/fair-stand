from pathlib import Path

path = Path('src/moduleBehavior.js')
text = path.read_text()
old = """  // Only the verified straight Banko family (100/150/200) gets 45-degree turns.\n  if (\n    type === 'counter'\n    && module.shape !== 'L'\n    && STRAIGHT_COUNTER_WIDTHS_CM.has(Number(module.widthCm))\n  ) {\n    return { ...base, rotationStepDeg: 45 };\n  }\n\n  return base;\n"""
new = """  // Corner Bankos all enter the scene with the verified customer-facing L orientation.\n  // Keep their geometry and 90-degree rotation behavior unchanged.\n  if (type === 'counter' && module.shape === 'L') {\n    return { ...base, defaultRotationDeg: 180 };\n  }\n\n  // Only the verified straight Banko family (100/150/200) gets 45-degree turns.\n  if (\n    type === 'counter'\n    && module.shape !== 'L'\n    && STRAIGHT_COUNTER_WIDTHS_CM.has(Number(module.widthCm))\n  ) {\n    return { ...base, rotationStepDeg: 45 };\n  }\n\n  return base;\n"""
if old not in text:
    raise SystemExit('target block not found')
path.write_text(text.replace(old, new))

# Add focused regression coverage.
test = Path('test/lCounterDefaultOrientation.test.js')
test.write_text("""import test from 'node:test';\nimport assert from 'node:assert/strict';\n\nimport { getModuleDefaultRotationDeg, getModuleRotationStepDeg } from '../src/moduleBehavior.js';\n\nfor (const widthCm of [100, 150, 200]) {\n  test(`corner counter ${widthCm} defaults to the same orientation`, () => {\n    const module = { type: 'counter', shape: 'L', widthCm };\n    assert.equal(getModuleDefaultRotationDeg(module), 180);\n    assert.equal(getModuleRotationStepDeg(module), 90);\n  });\n}\n\ntest('straight counter default orientation is unchanged', () => {\n  const module = { type: 'counter', widthCm: 150 };\n  assert.equal(getModuleDefaultRotationDeg(module), 0);\n  assert.equal(getModuleRotationStepDeg(module), 45);\n});\n""")
