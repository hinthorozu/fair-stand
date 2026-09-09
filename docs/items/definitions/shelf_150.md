# shelf_150 — Item Contract Definition

## Canonical Item

- `itemKey`: `shelf_150`
- `type`: `shelf`
- `unit`: `adet`
- dimensions: `150 × 38 × 1.8 cm` (`lengthCm × depthCm × thicknessCm`)
- `material`: `sunta`
- `defaultColor`: `0xffffff` — kullanıcı kararıyla `panel_197` mevcut default surface görünümüyle aynı beyaz
- `nominalModuleWidthCm`: `150`

## Ownership

Intrinsic ürün gerçeğinin source-of-truth'u `PRODUCTION_PARTS.shelf_150` kaydıdır. Leaf raf ayrı project entity değildir; placement, move, rotation, snap/collision/connection, selection/drag, context menu, delete/duplicate/keyboard, persistence ve reflow parent `shelf` module/type tarafından uygulanır.

`createShelfModule()` canonical Item'dan `depthCm`, `thicknessCm` ve `defaultColor` tüketir. Renderer'ın `innerWidthM` ile frame içine oturtması explicit render/fit override boundary'sidir ve canonical production `lengthCm=150` değerini değiştirmez. Raf seviyeleri parent shelf type layout kuralıdır, leaf Item intrinsic property'si değildir.

## BOM / composition

Tekil Item'dır. Parent recipe quantity sahibidir:

- `shelf-wall-150-2` → `shelf_150 × 2`
- `shelf-wall-150-3` → `shelf_150 × 3`

`shelf_leg` ayrı canonical Item'dır; ayağın adet kuralı parent shelf recipe tarafından sahiplenilir.

## Persistence

Leaf `shelf_150` ayrı persisted entity değildir. Parent shelf module `widthCm`, `shelfCount`, `shelfLightingOn`, placement ve editable wall strip state'ini persist eder; canonical product metadata/defaultColor project snapshot'a ikinci source-of-truth olarak kopyalanmaz.

## Regression

`test/shelfItemsItemContract.test.js` canonical identity/property/recipe/renderer-consumer contract'ını kilitler. `test/shelfModule.test.js`, `test/moduleRecipes.test.js` ve `test/boardMaterialItemContract.test.js` mevcut runtime/BOM davranışını korur.
