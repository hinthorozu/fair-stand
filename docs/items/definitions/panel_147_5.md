# panel_147_5 — Item Contract Definition

## Canonical Item

- `itemKey`: `panel_147_5`
- `type`: `panel`
- `unit`: `adet`
- dimensions: `147.5 × 47 × 0.8 cm`
- `material`: `sunta`
- `panelRole`: `straight`
- `nominalModuleWidthCm`: `150`
- `defaultColor`: ürün default'u doğrulanmadığı için tanımlı değil; editor `#ffffff` değeri override/default-surface katmanıdır.

## Ownership

Intrinsic ürün gerçeğinin source-of-truth'u `PRODUCTION_PARTS.panel_147_5` kaydıdır. State, placement, move, rotation, snap, collision, selection, context-menu, delete/duplicate ve persistence parent module/type tarafından uygulanır. Renderer specialized override yapabilir ancak `material` dahil product source-of-truth'u değiştirmez.

## BOM / relationship

Tekil Item'dır; quantity parent recipe sahibidir. Inner-corner konfigürasyonunda matching straight panel quantity'si 1:1 canonical corner Item'a aktarılabilir.

## Regression

Mevcut panel contract testleri + `test/boardMaterialItemContract.test.js`.
