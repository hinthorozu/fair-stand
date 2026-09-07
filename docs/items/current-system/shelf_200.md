`shelf_200` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik / tanım

`src/productionParts.js:33`:

```js
shelf_200: Object.freeze({ partId: 'shelf_200', name: 'Raf 200 cm', type: 'shelf', unit: 'adet', dimensions: Object.freeze({ lengthCm: 200 }), nominalModuleWidthCm: 200 }),
```

Gerçek production/BOM kimliği `partId = shelf_200`; lookup `src/productionParts.js:52-54` `getProductionPart(partId)` ile yapılır. Standalone `MODULE_CATALOG` girdisi veya ayrı proje production instance’ı mevcut runtime kodunda yok.

# 2. Recipe / BOM

- `src/moduleRecipes.js:30` → `shelf:200:2` / `shelf-wall-200-2` → `shelf_200 × 2`
- `src/moduleRecipes.js:39` → `shelf:200:3` / `shelf-wall-200-3` → `shelf_200 × 3`

Resolver `src/moduleRecipes.js:107-129`: `getModuleRecipe()` → recipe item → `expandRecipe()` → `getProductionPart('shelf_200')`.

İlgili module catalog key’leri: `wall_shelf_2_200`, `wall_shelf_3_200`.

# 3. State / renderer

`src/designState.js:74-89` `createShelfModuleState()` generic shelf module state üretir; `shelf_200` `partId` state içinde yoktur.

`src/scene3d.js:6393-6508` `createShelfModule()` raf geometrisini module width/shelfCount ve `SHELF_DIMENSIONS` ile procedural üretir. Renderer productionParts/moduleRecipes tüketmez; mesh üzerinde `shelf_200` production kimliği mevcut runtime kodunda yok.

# 4. UI/runtime

`src/selectionFeedback.js:62-64` raf seçim metnini üretir. `src/rawBomDebug.js:68-73` 200 cm + 2/3 raf bilgisini parse edip expanded recipe’ye gider; `rawBomDebug.js:35-55` BOM satırlarını gösterir.

# 5. Persistence

`src/main.js:1257-1265`, `src/projectStore.js:39-56`, `src/main.js:1320-1331` module state’i persist/restore eder. `shelf_200` production instance olarak state’te olmadığı için ayrı persisted kayıt yoktur.

# 6. Ownership

```text
metadata → src/productionParts.js
recipe/quantity → src/moduleRecipes.js
BOM policy → src/moduleContracts.js:4-7
state → src/designState.js
renderer → src/scene3d.js
persistence → src/main.js + src/projectStore.js
Raw BOM UI → src/rawBomDebug.js
```

# 7. Testler

`test/moduleRecipes.test.js`: `shelf_200` metadata, iki raflı recipe’de ×2 + `shelf_leg ×6`, üç raflı recipe’de ×3 + `shelf_leg ×9`, expanded çözümlemeyi doğrular. Batch sonucu **45 test / 45 pass / 0 fail**.

# 8. Sonuç

`shelf_200` production/BOM `partId` kimliğidir; iki raflı recipe’de ×2, üç raflı recipe’de ×3 kullanılır. Ayrı state/persistence/render identity mevcut runtime kodunda yoktur.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
