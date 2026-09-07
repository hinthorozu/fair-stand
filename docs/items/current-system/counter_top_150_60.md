`counter_top_150_60` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik / tanım

`src/productionParts.js:45`:

```js
counter_top_150_60: Object.freeze({ partId: 'counter_top_150_60', name: 'Banko Üstü 150 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 150, depthCm: 60 }), nominalModuleWidthCm: 200 }),
```

Gerçek production/BOM kimliği `partId = counter_top_150_60`; lookup `src/productionParts.js:52-54` ile yapılır. Standalone catalog/project entity mevcut runtime kodunda yok.

# 2. Recipe / BOM

`src/moduleRecipes.js:65` → `counter-l:200` / `counter-l-200` → `counter_top_150_60 ×1`.

Resolver `src/moduleRecipes.js:107-129`: `getModuleRecipe('counter',200,{shape:'L'})` → recipe → `expandRecipe()` → `getProductionPart('counter_top_150_60')`.

Module catalog karşılığı `src/catalog.js:210` `desk_banko_200_L` (`shape=L`, 200×200).

# 3. State / renderer

`src/designState.js:109-126` L counter state’i module id/type, shape, width/depth ve 8 editable face state taşır; `counter_top_150_60` partId state içinde yoktur.

`src/scene3d.js:6309+` `createLCounterModule()` L200’ü procedural üretir. `src/scene3d.js:6353-6374` tablo geometri ölçülerini module width/depth ve 2 cm overhang hesabından çıkarır; `counter_top_150_60` production metadata’sını resolve etmez. Mesh/userData üzerinde bu production partId mevcut runtime kodunda yoktur.

# 4. UI/runtime

`src/selectionFeedback.js:18-27` `Köşe Banko 200×200` seçim etiketini üretebilir. Ancak `src/rawBomDebug.js:91-94` özel L parser yalnız `Köşe Banko 100×100` eşleşmesini destekler. Bu nedenle `counter_top_150_60` mevcut seçim-metni Raw BOM UI akışında görünmez.

Recipe resolver kod seviyesinde vardır ve `getExpandedModuleRecipe('counter',200,{shape:'L'})` ile çözülebilir; eksik olan L200 Raw BOM UI parser bağlantısıdır.

# 5. Persistence

Counter module state `src/main.js:1257-1265` snapshot’ına alınır, `src/projectStore.js:39-56` persist eder, restore `src/main.js:1320-1331`. Production top ayrı instance olarak saklanmaz.

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

`test/lCounter200Contract.test.js:39-41` exact L200 BOM’da `counter_top_150_60 ×1` ve production width=150 değerini doğrular. Batch hedefli test sonucu **45 test / 45 pass / 0 fail**.

# 8. Sonuç

`counter_top_150_60` yalnız L200 recipe’sinde ×1 kullanılan production/BOM `partId` kimliğidir. Recipe resolver vardır; mevcut Raw BOM özel L parser’ı L200’ü desteklemez. Ayrı state/persistence/render production identity mevcut runtime kodunda yoktur.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
