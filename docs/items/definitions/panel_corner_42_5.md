# panel_corner_42_5 — Item Contract Definition

## Canonical Item

- `itemKey`: `panel_corner_42_5`
- `type`: `panel`
- `unit`: `adet`
- dimensions: `42.5 × 47 × 0.8 cm`
- `material`: `sunta`
- `panelRole`: `inner-corner`
- `nominalModuleWidthCm`: `50`

## Ownership / behavior

Intrinsic ürün gerçeğinin source-of-truth'u Item kaydıdır. Leaf ayrı scene/project instance değildir; placement/move/rotation/snap/collision/context-menu/persistence parent module/relationship zincirindedir. Renderer override edebilir fakat product `material` değişmez.

## Relationship / BOM

`innerCornerPanelItemKey` üzerinden matching `panel_48_5 × N` satırını `panel_corner_42_5 × N` olarak 1:1 değiştirir. Quantity parent recipe'den korunur.

## Regression

Corner panel contract testleri + `test/boardMaterialItemContract.test.js`.
