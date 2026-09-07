`shelf_150` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik / tanım

`src/productionParts.js:32`:

```js
shelf_150: Object.freeze({ partId: 'shelf_150', name: 'Raf 150 cm', type: 'shelf', unit: 'adet', dimensions: Object.freeze({ lengthCm: 150 }), nominalModuleWidthCm: 150 }),
```

Gerçek production/BOM kimliği `partId = shelf_150`; lookup `src/productionParts.js:52-54` `getProductionPart(partId)` ile yapılır. Standalone `MODULE_CATALOG` girdisi veya ayrı proje production instance’ı mevcut runtime kodunda yok.

# 2. Recipe / BOM

- `src/moduleRecipes.js:27` → `shelf:150:2` / `shelf-wall-150-2` → `shelf_150 × 2`
- `src/moduleRecipes.js:36` → `shelf:150:3` / `shelf-wall-150-3` → `shelf_150 × 3`

Resolver `src/moduleRecipes.js:107-129`: `getModuleRecipe()` → recipe item → `expandRecipe()` → `getProductionPart('shelf_150')`.

İlgili module catalog key’leri: `wall_shelf_2_150`, `wall_shelf_3_150`. Bunlar module kimliğidir; production kimliği değildir.

# 3. State / renderer

`src/designState.js:74-89` `createShelfModuleState()`; state `type=shelf`, `widthCm`, `shelfCount`, `shelfLightingOn`, strip yüzeyleri taşır. `shelf_150` `partId` state içinde yoktur.

`src/scene3d.js:6393-6508` `createShelfModule()` rafı `moduleState.widthCm`, `shelfCount` ve `SHELF_DIMENSIONS` ile procedural çizer. `scene3d.js` productionParts/moduleRecipes import etmez; mesh üzerinde `shelf_150` production identity mevcut runtime kodunda yok.

# 4. UI/runtime

`src/selectionFeedback.js:62-64` raf seçim metnini üretir. `src/rawBomDebug.js:68-73` width/shelfCount regex’i ile recipe resolver’a gider; `rawBomDebug.js:35-55` expanded recipe satırlarını `quantity × part.name` gösterir.

# 5. Persistence

`src/main.js:1257-1265` module state snapshot’ını, `src/projectStore.js:39-56` IndexedDB persistence’ını yönetir; `src/main.js:1320-1331` restore eder. State içinde `shelf_150` production instance’ı olmadığı için ayrı persisted kayıt yoktur.

# 6. Ownership

```text
metadata → src/productionParts.js
quantity/recipe → src/moduleRecipes.js
BOM policy → src/moduleContracts.js:4-7
state → src/designState.js
renderer → src/scene3d.js
persistence → src/main.js + src/projectStore.js
UI/BOM debug → src/rawBomDebug.js
```

# 7. Testler

`test/moduleRecipes.test.js` production metadata, 150 cm 2/3 raf recipe’leri ve çözümlemeyi doğrular. Batch hedefli test sonucu: **45/45 pass, 0 fail**.

# 8. Sonuç

`shelf_150` production/BOM `partId` kimliğidir; recipe’de iki raflı modülde ×2, üç raflı modülde ×3 kullanılır. Ayrı state entity’si, persisted production instance’ı veya renderer `partId` identity’si mevcut runtime kodunda yoktur.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
