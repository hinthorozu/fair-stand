`showcase_2_100` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik / tanım

`src/productionParts.js:36`:

```js
showcase_2_100: Object.freeze({ partId: 'showcase_2_100', name: '2 Gözlü Vitrin 100 cm', type: 'showcase', unit: 'adet', eyeCount: 2, nominalModuleWidthCm: 100 }),
```

Gerçek production/BOM kimliği `partId = showcase_2_100`; lookup `src/productionParts.js:52-54` `getProductionPart(partId)` ile yapılır. Standalone `MODULE_CATALOG.showcase_2_100` yoktur.

# 2. Recipe / BOM

`src/moduleRecipes.js:42-44` içindeki `showcase-2:100` / `showcase-2-100` recipe’si:

```text
showcase_2_100 ×1
glass_shelf ×2
```

ve profil/dikme/panel/connector kalemlerini içerir. Resolver `src/moduleRecipes.js:107-129` → `getModuleRecipe('showcase-2',100)` → `expandRecipe()` → `getProductionPart('showcase_2_100')`.

Module catalog karşılığı `src/catalog.js:122` `wall_showcase_100_2` (`type=showcase-2`, `widthCm=100`). Catalog key production part kimliği değildir.

# 3. State / renderer

`src/designState.js:60-71` `createShowcaseModuleState('showcase-2',100)` generic module id/type/width + 7 editable strip state üretir; production partId state içinde yoktur.

`src/scene3d.js:6949+` `createShowcaseModule()` vitrini procedural üretir. `scene3d.js` productionParts/moduleRecipes import etmez; `showcase_2_100` partId mesh/userData identity’si değildir.

# 4. UI/runtime

`src/selectionFeedback.js:57-59` `2 Gözlü Vitrin 100 cm` seçim metnini üretir. `src/rawBomDebug.js:76-81` eyeCount/width bilgisini parse edip `getExpandedModuleRecipe('showcase-2',100)` yoluna gider; `rawBomDebug.js:35-55` `1 × 2 Gözlü Vitrin 100 cm` dahil recipe satırlarını gösterir.

# 5. Persistence

Module state `src/main.js:1257-1265` snapshot’ına girer ve `src/projectStore.js:39-56` ile persist edilir. `showcase_2_100` ayrı production instance olarak state/persistence’ta tutulmaz.

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

`test/showcaseRecipes.test.js` production adını, exact recipe’de `showcase_2_100 ×1`, `glass_shelf ×2` ve expanded part çözümünü doğrular. Batch sonucu **45 test / 45 pass / 0 fail**.

# 8. Sonuç

`showcase_2_100` production/BOM `partId` kimliğidir ve 2 gözlü vitrin recipe’sinde ×1 kullanılır. Ayrı project-state/persistence/render production identity mevcut runtime kodunda yoktur.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
