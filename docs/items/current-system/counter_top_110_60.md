`counter_top_110_60` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik / tanım

`src/productionParts.js:40`:

```js
counter_top_110_60: Object.freeze({ partId: 'counter_top_110_60', name: 'Banko Üstü 110 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 110, depthCm: 60 }), nominalModuleWidthCm: 100 }),
```

Gerçek production/BOM kimliği `partId = counter_top_110_60`; lookup `src/productionParts.js:52-54` `getProductionPart(partId)` ile yapılır. Standalone `MODULE_CATALOG` girdisi veya ayrı project entity mevcut runtime kodunda yok.

# 2. Recipe / BOM

- `src/moduleRecipes.js:57` → `counter-l:100` / `counter-l-100` → `counter_top_110_60 ×1`
- `src/moduleRecipes.js:69` → `counter:100` / `counter-100` → `counter_top_110_60 ×1`

Resolver `src/moduleRecipes.js:107-129`: `getModuleRecipe('counter',100,{shape})` → recipe → `expandRecipe()` → production metadata.

İlgili module catalog key’leri: `desk_banko_100`, `desk_banko_100_L` (`src/catalog.js:205-206`).

# 3. State / renderer paralel temsili

`src/designState.js:109-126` `createCounterModuleState()` generic counter state üretir: module id/type, shape, width/depth/height ve editable face state. `counter_top_110_60` partId state içinde yoktur.

`src/scene3d.js:6131+` düz bankoyu, `src/scene3d.js:6309+` L bankoyu procedural çizer; renderer productionParts/moduleRecipes import etmez. L100 özelinde `src/scene3d.js:6350-6352` 1.10×0.60 m ana tablayı doğrudan `BoxGeometry` ölçüsüyle oluşturur. Ölçü production registry’den okunmaz; mesh üzerinde `counter_top_110_60` partId identity’si yoktur.

# 4. UI/runtime

`src/selectionFeedback.js:18-27` düz/L banko etiketini üretir. `src/rawBomDebug.js:91-94` `Köşe Banko 100×100` özel L branch’ini, `97-101` düz Banko 100 branch’ini recipe resolver’a taşır. Bu nedenle hem düz 100 hem L100 seçiminden `counter_top_110_60 ×1` Raw BOM’da gösterilebilir.

# 5. Persistence

`src/main.js:1257-1265` counter module state’ini snapshot’a alır, `src/projectStore.js:39-56` persist eder; restore `src/main.js:1320-1331`. Production top ayrı instance olarak persistence’a yazılmaz.

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

`test/counterRecipes.test.js` 110×60 metadata ve düz counter-100 recipe’sini; `test/lCounter100Contract.test.js` L100 exact BOM’da `counter_top_110_60 ×1` değerini doğrular. Batch hedefli test sonucu **45 test / 45 pass / 0 fail**.

# 8. Sonuç

`counter_top_110_60` production/BOM `partId` kimliğidir; düz 100 ve L100 recipe’lerinde ×1 kullanılır. Renderer aynı fiziksel ölçüye yakın geometri üretse de bunu production partId üzerinden yapmaz. Ayrı state/persistence/render identity mevcut runtime kodunda yoktur.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
