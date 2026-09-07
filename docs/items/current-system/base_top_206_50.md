`base_top_206_50` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik / tanım

`src/productionParts.js:49`:

```js
base_top_206_50: Object.freeze({ partId: 'base_top_206_50', name: 'Baza Üstü 206 × 50 cm', type: 'base-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 206, depthCm: 50 }), nominalModuleWidthCm: 200 }),
```

Gerçek production/BOM kimliği `partId = base_top_206_50`; lookup `src/productionParts.js:52-54` ile yapılır. Standalone catalog/project production entity mevcut runtime kodunda yok.

# 2. Recipe / BOM

- `src/moduleRecipes.js:85` → `base-wall:200` / `base-wall-200` → `base_top_206_50 ×1`
- `src/moduleRecipes.js:95` → `base:200` / `base-200` → `base_top_206_50 ×1`

Resolver `src/moduleRecipes.js:107-129`: module type/width → recipe → `expandRecipe()` → `getProductionPart('base_top_206_50')`.

İlgili module catalog yolları `src/catalog.js:213,216`: `BASE_200`, `wall_base_200`.

# 3. State / renderer paralel temsili

`src/designState.js:151-166` `createBaseModuleState(200)`; `129-148` `createBaseWallModuleState(200)` generic module state üretir. Production top partId state içinde yoktur.

Renderer `src/scene3d.js:5969+` `createBaseModule()` ve `1401-1417` `createBaseWallModule()` procedural geometri üretir. Renderer productionParts/moduleRecipes import etmez; `base_top_206_50` production metadata’sını resolve ederek mesh oluşturmaz. Mesh/userData üzerinde bu partId identity’si mevcut runtime kodunda yoktur.

# 4. UI/runtime

`src/selectionFeedback.js:30-44` base/base-wall seçim etiketlerini üretir. `src/rawBomDebug.js:104-115` `Panel Bazalı 200` ve `Baza 200 cm` seçimlerini recipe resolver’a gönderir; her iki durumda expanded recipe `base_top_206_50 ×1` satırını production adıyla gösterebilir.

# 5. Persistence

Base/base-wall module state `src/main.js:1257-1265` snapshot’ına girer; `src/projectStore.js:39-56` persist eder; restore `src/main.js:1320-1331`. `base_top_206_50` ayrı production instance olarak saklanmaz.

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

`test/baseRecipes.test.js` 206×50 metadata ve base-200 top partId’sini; `test/baseWallRecipes.test.js` base-wall-200 top mapping’ini doğrular. Batch hedefli test sonucu **45 test / 45 pass / 0 fail**.

# 8. Sonuç

`base_top_206_50` hem `BASE_200` hem `wall_base_200` recipe’lerinde ×1 kullanılan production/BOM `partId` kimliğidir. Ayrı project-state entity’si, persisted production instance’ı veya renderer partId identity’si mevcut runtime kodunda yoktur.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
