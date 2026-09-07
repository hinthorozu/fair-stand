`shelf_100` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik / tanım

`src/productionParts.js:31`:

```js
shelf_100: Object.freeze({ partId: 'shelf_100', name: 'Raf 100 cm', type: 'shelf', unit: 'adet', dimensions: Object.freeze({ lengthCm: 100 }), nominalModuleWidthCm: 100 }),
```

Mevcut production/BOM kimliği `partId = shelf_100`. Lookup `src/productionParts.js:52-54` içindeki `getProductionPart(partId)` ile yapılır. `shelf_100` için standalone `MODULE_CATALOG` girdisi, proje instance `id`’si veya ayrı persisted production entity mevcut runtime kodunda yok.

# 2. Recipe / BOM zinciri

- `src/moduleRecipes.js:24` → `shelf:100:2` / `shelf-wall-100-2` → `shelf_100 × 2`
- `src/moduleRecipes.js:33` → `shelf:100:3` / `shelf-wall-100-3` → `shelf_100 × 3`

Resolver: `src/moduleRecipes.js:107-129`:

```text
moduleType + width/options
→ getModuleRecipe(...)
→ recipe item { partId: 'shelf_100', quantity }
→ expandRecipe(...)
→ getProductionPart('shelf_100')
→ production metadata
```

İlgili module catalog yolları: `wall_shelf_2_100`, `wall_shelf_3_100`. Bunlar module `catalogKey` değerleridir; `shelf_100` production kimliği değildir.

# 3. State / renderer paralel temsili

İlgili state: `src/designState.js:74-89` → `createShelfModuleState()`. State `id`, `type=shelf`, `widthCm`, `shelfCount`, `shelfLightingOn` ve generic panel strip state taşır; `shelf_100` `partId`’si state’e ayrı instance olarak yazılmaz.

Renderer: `src/scene3d.js:6393-6508` → `createShelfModule()`. Renderer `productionParts.js` veya `moduleRecipes.js` import etmez. Raf geometrisini `moduleState.widthCm`, `shelfCount` ve `SHELF_DIMENSIONS` üzerinden procedural oluşturur; mesh/userData üzerinde `shelf_100` `partId` bağı mevcut runtime kodunda yok.

# 4. UI / runtime tüketimi

`src/selectionFeedback.js:62-64` raf seçimini `Raf <width> cm · <count> raflı` metnine dönüştürür. `src/rawBomDebug.js:68-73` bu metni regex ile parse edip `getExpandedModuleRecipe('shelf',100,{shelfCount})` çağırır. `rawBomDebug.js:35-55` sonucu `quantity × part.name` olarak gösterir.

# 5. Persistence

`src/main.js:1257-1265` module state’i snapshot’a alır; `src/projectStore.js:39-56` IndexedDB’ye yazar; `src/main.js:1320-1331` restore eder. State içinde `shelf_100` production instance’ı olmadığı için persistence’ta ayrı `shelf_100` kaydı yoktur.

# 6. Ownership / source-of-truth

```text
production metadata  → src/productionParts.js
recipe + quantity    → src/moduleRecipes.js
module BOM policy    → src/moduleContracts.js:4-7
state                → src/designState.js
renderer             → src/scene3d.js
persistence          → src/main.js + src/projectStore.js
Raw BOM UI           → src/rawBomDebug.js
```

# 7. Testler

`test/moduleRecipes.test.js` production tanımını, 2/3 raf recipe miktarlarını ve expanded metadata çözümünü doğrular.

Batch hedefli test sonucu: **45 test / 45 pass / 0 fail**.

# 8. Sonuç

`shelf_100` mevcut sistemde production/BOM `partId` kimliğidir. Recipe’de 100 cm iki raflı modülde ×2, üç raflı modülde ×3 kullanılır. Ayrı project-state entity’si, persisted production instance’ı veya renderer mesh identity’si mevcut runtime kodunda yoktur.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
