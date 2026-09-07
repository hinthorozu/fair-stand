`base_top_157_50` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik / tanım

`src/productionParts.js:48`:

```js
base_top_157_50: Object.freeze({ partId: 'base_top_157_50', name: 'Baza Üstü 157 × 50 cm', type: 'base-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 157, depthCm: 50 }), nominalModuleWidthCm: 150 }),
```

Gerçek production/BOM kimliği `partId = base_top_157_50`; lookup `src/productionParts.js:52-54` ile yapılır. Standalone catalog/project production entity mevcut runtime kodunda yok.

# 2. Recipe / BOM

- `src/moduleRecipes.js:82` → `base-wall:150` / `base-wall-150` → `base_top_157_50 ×1`
- `src/moduleRecipes.js:92` → `base:150` / `base-150` → `base_top_157_50 ×1`

Resolver `src/moduleRecipes.js:107-129`: module type/width → recipe → `expandRecipe()` → `getProductionPart('base_top_157_50')`.

İlgili module catalog yolları `src/catalog.js:212,215`: `BASE_150`, `wall_base_150`.

# 3. State / renderer paralel temsili

`src/designState.js:151-166` `createBaseModuleState(150)`; `129-148` `createBaseWallModuleState(150)` generic module state üretir. Production top partId state içinde yoktur.

Renderer `src/scene3d.js:5969+` `createBaseModule()` ve `1401-1417` `createBaseWallModule()` procedural geometri üretir. `scene3d.js` productionParts/moduleRecipes import etmez; `base_top_157_50` metadata’sını resolve ederek mesh oluşturmaz. Mesh/userData üzerinde bu partId identity’si mevcut runtime kodunda yoktur.

# 4. UI/runtime

`src/selectionFeedback.js:30-44` base/base-wall seçim etiketlerini üretir. `src/rawBomDebug.js:104-115` `Panel Bazalı 150` ve `Baza 150 cm` seçimlerini recipe resolver’a taşır; her iki durumda expanded recipe `base_top_157_50 ×1` satırını production adıyla gösterebilir.

# 5. Persistence

Base/base-wall module state `src/main.js:1257-1265` snapshot’ında persist edilir; `src/projectStore.js:39-56` IndexedDB’ye yazar; restore `src/main.js:1320-1331`. Production top ayrı instance değildir.

# 6. Ownership

```text
metadata → src/productionParts.js
recipe/quantity → src/moduleRecipes.js
BOM policy → src/moduleContracts.js:4-7
state → src/designState.js
renderer → src/scene3d.js
Raw BOM UI → src/rawBomDebug.js
```

# 7. Testler

`test/baseRecipes.test.js` 157×50 metadata ve base-150 top partId’sini; `test/baseWallRecipes.test.js` base-wall-150 top mapping’ini doğrular. Batch hedefli test sonucu **45 test / 45 pass / 0 fail**.

# 8. Sonuç

`base_top_157_50` hem `BASE_150` hem `wall_base_150` recipe’lerinde ×1 kullanılan production/BOM `partId` kimliğidir. Ayrı project-state entity’si, persisted production instance’ı veya renderer partId identity’si mevcut runtime kodunda yoktur.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
