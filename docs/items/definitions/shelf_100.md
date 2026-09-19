# shelf_100 — Item Contract Definition

## Kanonik Item

- `itemKey`: `shelf_100`
- `type`: `shelf`
- `unit`: `adet`
- dimensions: `100 × 38 × 1.8 cm` (`lengthCm × depthCm × thicknessCm`)
- `sceneDimensions`: `widthCm=100`, `heightCm=1.8` (thickness karşılığı); `depthCm` fiziksel `dimensions.depthCm=38`
- `material`: `sunta`
- `defaultColor`: `0xffffff`
- `nominalModuleWidthCm`: `100`
- Catalog: `catalogVisible=true`, `categoryId=3`, `catalogItemIndex=3`, `catalogPreview=shelf`

## Sahiplik

Intrinsic ürün gerçeğinin tek kaynağı `LEAF_ITEMS.shelf_100` kaydıdır. Raf kendisi Catalog’dan sürüklenebilen standalone Item’dır. `wall_shelf_*` parent Item yoktur.

`createShelfModule()` tek fiziksel raf tahtası çizer: scene width × thickness × depth. Duvar/panel üretmez.

## BOM / bileşim

Tekil Item’dır. Self BOM: `shelf_100 × 1 adet`. `wall_shelf` recipe yoktur.

## Kalıcılık

Module state `itemKey`, `type`, `widthCm`, `depthCm`, `heightCm`, `shelfLightingOn` ve overlay `placement` taşır.

## Regresyon

`test/shelfCatalogPanelSeam.test.js`, `test/shelfItemsItemContract.test.js`, `test/shelfModule.test.js`.
