# shelf_200 — Item Contract Definition

## Kanonik Item

- `itemKey`: `shelf_200`
- `type`: `shelf`
- `unit`: `adet`
- dimensions: `200 × 38 × 1.8 cm` (`lengthCm × depthCm × thicknessCm`)
- `material`: `sunta`
- `defaultColor`: `0xffffff` — kullanıcı kararıyla `panel_197` mevcut default surface görünümüyle aynı beyaz
- `nominalModuleWidthCm`: `200`

## Sahiplik

Intrinsic ürün gerçeğinin tek kaynağı `PRODUCTION_PARTS.shelf_200` kaydıdır. Leaf raf ayrı project entity değildir; yerleşim, move, rotation, snap/collision/connection, selection/drag, context menu, delete/duplicate/keyboard, kalıcılık ve reflow parent `shelf` module/type tarafından uygulanır.

`createShelfModule()` kanonik Item'dan `depthCm`, `thicknessCm` ve `defaultColor` tüketir. Renderer'ın `innerWidthM` ile frame içine oturtması explicit render/fit ezme boundary'sidir ve kanonik production `lengthCm=200` değerini değiştirmez. Raf seviyeleri parent shelf type layout kuralıdır, leaf Item ürüne özgü property'si değildir.

## BOM / bileşim

Tekil Item'dır. Parent recipe quantity sahibidir:

- `shelf-wall-200-2` → `shelf_200 × 2`
- `shelf-wall-200-3` → `shelf_200 × 3`

`shelf_leg` ayrı kanonik Item'dır; ayağın adet kuralı parent shelf recipe tarafından sahiplenilir.

## Kalıcılık

Leaf `shelf_200` ayrı persisted entity değildir. Parent shelf module `widthCm`, `shelfCount`, `shelfLightingOn`, yerleşim ve editable wall strip state'ini persist eder; kanonik product üstveri/defaultColor project snapshot'a ikinci tek kaynak olarak kopyalanmaz.

## Regresyon

`test/shelfItemsItemContract.test.js` kanonik identity/property/recipe/renderer-tüketici contract'ını kilitler. `test/shelfModule.test.js`, `test/moduleRecipes.test.js` ve `test/boardMaterialItemContract.test.js` mevcut runtime/BOM davranışını korur.
