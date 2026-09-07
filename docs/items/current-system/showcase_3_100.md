`showcase_3_100` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik / tanım

`src/productionParts.js:37`:

```js
showcase_3_100: Object.freeze({ partId: 'showcase_3_100', name: '3 Gözlü Vitrin 100 cm', type: 'showcase', unit: 'adet', eyeCount: 3, nominalModuleWidthCm: 100 }),
```

Gerçek production/BOM kimliği `partId = showcase_3_100`; lookup `src/productionParts.js:52-54` `getProductionPart(partId)` ile yapılır. Standalone `MODULE_CATALOG.showcase_3_100` yoktur.

# 2. Recipe / BOM

`src/moduleRecipes.js:45-47` içindeki `showcase-3:100` / `showcase-3-100` recipe’si:

```text
showcase_3_100 ×1
glass_shelf ×3
```

ve profil/dikme/panel/connector kalemlerini içerir. Resolver `src/moduleRecipes.js:107-129` → `getModuleRecipe('showcase-3',100)` → `expandRecipe()` → `getProductionPart('showcase_3_100')`.

Module catalog karşılığı `src/catalog.js:121` `wall_showcase_100_3` (`type=showcase-3`, `widthCm=100`).

# 3. State / renderer

`src/designState.js:60-71` `createShowcaseModuleState('showcase-3',100)` generic module state üretir; `showcase_3_100` production partId state içinde yoktur.

`src/scene3d.js:6949+` `createShowcaseModule()` vitrini procedural üretir. Renderer productionParts/moduleRecipes tüketmez ve mesh/userData üzerinde `showcase_3_100` partId identity’si bulunmaz.

# 4. UI/runtime

`src/selectionFeedback.js:57-59` `3 Gözlü Vitrin 100 cm` seçim metnini üretir. `src/rawBomDebug.js:76-81` eyeCount=3 ve width=100 değerlerini parse edip expanded recipe resolver’a gider; `rawBomDebug.js:35-55` `1 × 3 Gözlü Vitrin 100 cm` dahil BOM satırlarını gösterir.

# 5. Persistence

Module state `src/main.js:1257-1265` snapshot’ına girer ve `src/projectStore.js:39-56` ile persist edilir. `showcase_3_100` ayrı production instance olarak persistence’a yazılmaz; restore `src/main.js:1320-1331` module state/catalog ilişkisini çözer.

# 6. Ownership

```text
metadata → src/productionParts.js
recipe/adet → src/moduleRecipes.js
BOM policy → src/moduleContracts.js:4-7
state → src/designState.js
renderer → src/scene3d.js
Raw BOM UI → src/rawBomDebug.js
```

# 7. Testler

`test/showcaseRecipes.test.js` production adını, exact recipe’de `showcase_3_100 ×1`, `glass_shelf ×3` ve expanded metadata çözümünü doğrular. Batch sonucu **45 test / 45 pass / 0 fail**.

# 8. Sonuç

`showcase_3_100` production/BOM `partId` kimliğidir ve 3 gözlü vitrin recipe’sinde ×1 kullanılır. Ayrı project-state entity’si, persisted production instance’ı veya renderer partId identity’si mevcut runtime kodunda yoktur.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
