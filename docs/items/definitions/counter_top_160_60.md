# counter_top_160_60 — Item Contract Definition

## Kanonik Item

- `itemKey`: `counter_top_160_60`
- `type`: `counter-top`
- `unit`: `adet`
- dimensions: `160 × 60 × 1.8 cm`
- `material`: `sunta`
- `defaultColor`: `0xf8fafc`
- `nominalModuleWidthCm`: `150`

Intrinsic/default tek kaynak Item kaydıdır. Parent counter state/behavior/context-menu/kalıcılık zinciri leaf davranışını uygular. Renderer ezebilir; kanonik `material` ve default değerleri değiştirmez. Quantity parent counter recipe sahibidir.

Regression: counter-top contract/defaultColor testleri + `test/boardMaterialItemContract.test.js`.
