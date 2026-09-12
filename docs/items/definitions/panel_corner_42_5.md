# panel_corner_42_5 — Item Contract Definition

## Kanonik Item

- `itemKey`: `panel_corner_42_5`
- `type`: `panel`
- `unit`: `adet`
- dimensions: `42.5 × 47 × 0.8 cm`
- `material`: `sunta`
- `panelRole`: `inner-corner`
- `nominalModuleWidthCm`: `50`

## Sahiplik / davranış

Intrinsic ürün gerçeğinin tek kaynağı Item kaydıdır. Leaf ayrı scene/proje örneği değildir; yerleşim/move/rotation/snap/collision/context-menu/kalıcılık parent module/relationship zincirindedir. Renderer ezebilir fakat product `material` değişmez.

## İlişki / BOM

`innerCornerPanelItemKey` üzerinden matching `panel_48_5 × N` satırını `panel_corner_42_5 × N` olarak 1:1 değiştirir. Quantity parent recipe'den korunur.

## Regresyon

Corner panel contract testleri + `test/boardMaterialItemContract.test.js`.
