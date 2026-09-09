# panel_corner_92 — Item Contract Definition

## Canonical Item

- `itemKey`: `panel_corner_92`
- `type`: `panel`
- `unit`: `adet`
- dimensions: `92 × 47 × 0.8 cm`
- `material`: `sunta`
- `panelRole`: `inner-corner`
- `nominalModuleWidthCm`: `100`

## Ownership / behavior

Intrinsic ürün gerçeğinin source-of-truth'u Item kaydıdır. Leaf ayrı scene/project instance değildir; placement/move/rotation/snap/collision/context-menu/persistence parent module/relationship zincirindedir. Renderer override edebilir fakat product `material` değişmez.

## Relationship / BOM

`innerCornerPanelItemKey` üzerinden matching `panel_98 × N` satırını `panel_corner_92 × N` olarak 1:1 değiştirir. Quantity parent recipe'den korunur.

## Regression

Corner panel contract testleri + `test/boardMaterialItemContract.test.js`.
