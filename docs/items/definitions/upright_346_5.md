# upright_346_5 — Item Contract

## Kanonik kimlik
- `itemKey`: `upright_346_5`
- `name`: `Dikme 346,5 cm`
- `type`: `upright`
- `unit`: `adet`
- structure: Tekil Item

## Kanonik ürüne özgü özellikler
- `dimensions.lengthCm = 346.5`
- `dimensions.thicknessCm = 8`
- `material = 'alüminyum'`
- `defaultColor = 0xd0d3d4`

These values are product defaults owned by the Item. Explicit project/runtime/render ezmes may replace presentation where applicable without changing the kanonik default.

Katalog/saha yerleşimi `thicknessCm` değerini `widthCm`/`depthCm`, `lengthCm` değerini `heightCm` olarak okur; ikinci bir ölçü kaynağı değildir.

## Bileşim / BOM
The Item is a leaf BOM component. It is consumed by 18 doğrulanmış parent recipes, quantity `2` in each. Parent recipes own quantity; `src/productionParts.js` owns product üstveri.

Sahaya elle konan her örnek ayrı instance'dır. Seçilince `resolveItemBom('upright_346_5')` `upright_346_5 × 1 adet` üretir. Parent reçetelere otomatik eklenmez.

## Davranış / state / kalıcılık
Katalog grubu `Panel Ek Modül`. Snap `short-up-1` / `short-up-2` uçları, saha `profile` uçları ve `counter` (banko) uçlarıdır (`magneticSnap: short-up-joint`). Banko/profil altındaki çarpışma short-up ile aynı şekilde dikmeyi engellemez. Snap yoksa bırakılmaz. Düz `wall_*` kimliği ve reçetesi değişmez. Katalog kartı `module-drag-upright` ile düz alüminyum dikme gösterir; 7 şeritli panel kartı kullanılmaz.

## Renderer ezme sınırı
Saha örneği kare kolondur: plan `STAND_DIMENSIONS.depth` × `STAND_DIMENSIONS.depth` (10×10 cm), boy `STAND_DIMENSIONS.height` (3,5 m), `FRAME_COLOR` / metalness 0.68 / roughness 0.28. İki `wall_200` köşe silüetiyle aynı kare kesit. Üretim `lengthCm=346.5` ve `thicknessCm=8` değişmez.

## Regresyon sözleşmesi
`test/upright3465ItemContract.test.js` 18 recipe ×2 miktarını korur. `test/uprightFieldPlacement.test.js` katalog, self BOM, short-up, saha profil ve banko uç snap'ini korur.

## Tamamlanma
Kanonik ürün kimliği aynı kalır. Saha örneği ek runtime yeteneğidir; leaf üretim kaydı ikinci Item değildir.
