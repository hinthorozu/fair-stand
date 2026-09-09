# shelf_leg — Current System / Item Contract Mapping

## Canonical identity

`src/productionParts.js` içinde canonical production Item:

```js
shelf_leg: Object.freeze({
  itemKey: 'shelf_leg',
  name: 'Raf Ayağı',
  type: 'shelf-accessory',
  unit: 'adet',
}),
```

Doğrulanmış ürün ölçüsü, ağırlık, material veya defaultColor henüz yoktur; bu alanlar tahmin edilmez ve canonical Item'a eklenmez.

## BOM / recipe kullanımı

Parent shelf recipe quantity sahibidir:

- `shelf:100:2` → `shelf_leg ×4`
- `shelf:150:2` → `shelf_leg ×4`
- `shelf:200:2` → `shelf_leg ×6`
- `shelf:100:3` → `shelf_leg ×6`
- `shelf:150:3` → `shelf_leg ×6`
- `shelf:200:3` → `shelf_leg ×9`

Tüm altı recipe canonical `itemKey: 'shelf_leg'` kullanır. Migration quantity kuralını değiştirmez.

## State / behavior / renderer

`shelf_leg` ayrı project entity değildir. Placement, move, rotation, snap/collision/connection, selection/drag, context menu, delete/duplicate/keyboard, persistence ve reflow parent `shelf` module/type tarafından sahiplenilir.

Renderer'da `shelf_leg` identity'sine bağlı ayrı mesh yoktur. Bu migration renderer geometrisi üretmez ve BOM miktarını render mesh sayısından türetmez.

## Regression

`test/shelfLegItemContract.test.js` canonical kimliği, bilinmeyen product metadata'nın eklenmemesini ve altı recipe quantity parity'sini kilitler.
