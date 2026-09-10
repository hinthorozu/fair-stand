# showcase_side_94_6_30 — Item Contract Definition

## Canonical Item

- `itemKey`: `showcase_side_94_6_30`
- `type`: `showcase-board`
- `unit`: `adet`
- dimensions: `94.6 × 30 × 1.8 cm` (`lengthCm × depthCm × thicknessCm`)
- `material`: `sunta`
- `defaultColor`: `0xffffff` — beyaz

## Ownership

Intrinsic ürün gerçeğinin source-of-truth'u `PRODUCTION_PARTS.showcase_side_94_6_30` kaydıdır. Bu Item 2 gözlü showcase gövdesinin iki yan suntasından biridir; orientation/yerleşim parent showcase composition/renderer sorumluluğudur.

Leaf board ayrı project entity değildir. Placement, move, rotation, snap/collision/connection, selection/drag, context menu, delete/duplicate/keyboard, persistence ve reflow parent showcase module/type tarafından uygulanır.

## Renk / override sınırı

Canonical ürün rengi beyazdır (`0xffffff`). Bu leaf Item tek başına renk-editable yüzey değildir ve bireysel renk override'ı taşımaz.

Showcase gövdesi renklendirildiğinde renk seçimi parent `wall_showcase_100_2` project instance'ına ait tek bir gövde renk override'ı olarak çözülecek ve iki yan + iki yatay olmak üzere dört sunta parçaya birlikte uygulanacaktır. Bu project override canonical `defaultColor` değerini değiştirmez. `glass_shelf` bu gövde rengi kapsamına girmez.

## BOM / composition

Tekil Item'dır; kendi doğrudan BOM çıktısı `showcase_side_94_6_30 × quantity`, birim `adet`tir. `wall_showcase_100_2` içindeki canonical quantity ve parent recipe cutover'u parent showcase migrationında tanımlanacaktır; mevcut legacy parent recipe bu batch'te değiştirilmez.

## Renderer / persistence

Ayrı leaf renderer veya persisted entity yoktur. Mevcut showcase procedural renderer gövdeyi parent seviyesinde üretmektedir. Canonical board ölçü/defaultColor tüketiminin parent renderer'a bağlanması `wall_showcase_100_2` composite migrationının parçasıdır; leaf Item'ın ürün gerçeği renderer geometrisinden türetilmez.

## Regression

`test/showcaseBodyBoardsItemContract.test.js` canonical identity, dimensions, material, defaultColor, direct BOM ve bireysel surface capability olmaması contract'ını kilitler. `test/boardMaterialItemContract.test.js` sunta material sınıflandırmasını kapsar.