# shelf_200 — Item Contract Definition

## Canonical Item

- `itemKey`: `shelf_200`
- `type`: `shelf`
- `unit`: `adet`
- dimensions: `200 × 38 × 1.8 cm` (`lengthCm × depthCm × thicknessCm`)
- `material`: `sunta`
- `defaultColor`: `0xffffff` — kullanıcı kararıyla `panel_197` mevcut default surface görünümüyle aynı beyaz
- `nominalModuleWidthCm`: `200`

## Ownership

Intrinsic ürün gerçeğinin source-of-truth'u `PRODUCTION_PARTS.shelf_200` kaydıdır. Leaf raf ayrı project entity değildir; placement, move, rotation, snap/collision/connection, selection/drag, context menu, delete/duplicate/keyboard, persistence ve reflow parent `shelf` module/type tarafından uygulanır.

`createShelfModule()` canonical Item'dan `depthCm`, `thicknessCm` ve `defaultColor` tüketir. Renderer'ın `innerWidthM` ile frame içine oturtması explicit render/fit override boundary'sidir ve canonical production `lengthCm=200` değerini değiştirmez. Raf seviyeleri parent shelf type layout kuralıdır, leaf Item intrinsic property'si değildir.

## BOM / composition

Tekil Item'dır. Parent recipe quantity sahibidir:

- `shelf-wall-200-2` → `shelf_200 × 2`
- `shelf-wall-200-3` → `shelf_200 × 3`

`shelf_leg` bu batch'in Item'ı değildir ve legacy kimliğinde kalır.

## Persistence

Leaf `shelf_200` ayrı persisted entity değildir. Parent shelf module `widthCm`, `shelfCount`, `shelfLightingOn`, placement ve editable wall strip state'ini persist eder; canonical product metadata/defaultColor project snapshot'a ikinci source-of-truth olarak kopyalanmaz.

## Regression

`test/shelfItemsItemContract.test.js` canonical identity/property/recipe/renderer-consumer contract'ını kilitler. `test/shelfModule.test.js`, `test/moduleRecipes.test.js` ve `test/boardMaterialItemContract.test.js` mevcut runtime/BOM davranışını korur.
