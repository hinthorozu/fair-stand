# counter_top_52_60 — Item Contract Definition

## Canonical Item

- `itemKey`: `counter_top_52_60`
- `type`: `counter-top`
- `unit`: `adet`
- dimensions: `52 × 60 × 1.8 cm`
- `material`: `sunta`
- `defaultColor`: `0xf8fafc`
- `nominalModuleWidthCm`: `100`

Intrinsic/default source-of-truth Item kaydıdır. Parent counter state/behavior/context-menu/persistence zinciri leaf davranışını uygular. Renderer override edebilir; canonical `material` ve default değerleri değiştirmez. Quantity parent counter recipe sahibidir.

Regression: counter-top contract/defaultColor testleri + `test/boardMaterialItemContract.test.js`.
