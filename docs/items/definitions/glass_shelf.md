# glass_shelf — Item Contract Definition

## Canonical Item

- `itemKey`: `glass_shelf`
- `type`: `showcase-accessory`
- `unit`: `adet`
- dimensions: `87.3 × 28.5 × 0.6 cm` (`lengthCm × depthCm × thicknessCm`)
- `material`: `cam`

## Ownership

Intrinsic ürün gerçeğinin source-of-truth'u `PRODUCTION_PARTS.glass_shelf` kaydıdır. Cam raf ayrı project entity değildir; placement, move, rotation, snap/collision/connection, selection/drag, context menu, delete/duplicate/keyboard, persistence ve reflow parent `showcase-2` / `showcase-3` module/type tarafından uygulanır.

`createShowcaseModule()` canonical Item'dan `lengthCm`, `depthCm`, `thicknessCm` ve `material` tüketir. `material=cam` ortak `GLASS_APPEARANCE` standardına çözülür. Normal cam görünümü product ölçüsü değildir; `theme.js` renderer appearance kaynağıdır. Masa camı `TABLE_GLASS_APPEARANCE` ile explicit specialized render override kullanır; panel camı ortak normal cam yüzeyine ek olarak panel-only `PANEL_GLASS_BACKING_APPEARANCE` backing efekti kullanır. Projektör lensi özel optik/emissive renderer olarak bu standardın dışındadır.

## BOM / composition

Tekil production Item'dır. Parent recipe quantity sahibidir:

- `showcase-2:100` → `glass_shelf × 1`
- `showcase-3:100` → `glass_shelf × 2`

Kullanıcı ürün doğrulamasıyla eski ×2/×3 recipe miktarı düzeltilmiştir. Fiziksel ürün kuralı `eyeCount - 1` cam raftır: 2 gözlüde ×1, 3 gözlüde ×2. BOM yine renderer mesh sayısından türetilmez; aynı doğrulanmış ürün gerçeği recipe ve renderer tarafından bağımsız rollerinde tüketilir.

## Persistence

Leaf `glass_shelf` ayrı persisted entity değildir. Parent showcase module placement ve editable strip state'ini persist eder; canonical product metadata project snapshot'a ikinci source-of-truth olarak kopyalanmaz.

## Regression

`test/glassShelfItemContract.test.js` canonical identity/property/recipe/renderer-consumer contract'ını kilitler. `test/showcaseRecipes.test.js`, `test/showcaseDepthDirection.test.js`, `test/materialAppearance.test.js` ve full suite/E2E mevcut showcase ve cam görünüm davranışını korur.
