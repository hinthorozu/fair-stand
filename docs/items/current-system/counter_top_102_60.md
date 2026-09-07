`counter_top_102_60` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik / tanım

`src/productionParts.js:43`:

```js
counter_top_102_60: Object.freeze({ partId: 'counter_top_102_60', name: 'Banko Üstü 102 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 102, depthCm: 60 }), nominalModuleWidthCm: 150 }),
```

Gerçek production/BOM kimliği `partId = counter_top_102_60`; lookup `src/productionParts.js:52-54` ile yapılır. Standalone catalog/project entity mevcut runtime kodunda yok.

# 2. Recipe / BOM

`src/moduleRecipes.js:61` → `counter-l:150` / `counter-l-150` → `counter_top_102_60 ×1`.

Resolver `src/moduleRecipes.js:107-129`: `getModuleRecipe('counter',150,{shape:'L'})` → recipe → `expandRecipe()` → production metadata.

Module catalog karşılığı `src/catalog.js:208` `desk_banko_150_L` (`shape=L`, 150×150).

# 3. State / renderer

`src/designState.js:109-126` L counter state’i width/depth/shape + 8 editable face state taşır; `counter_top_102_60` partId yoktur.

`src/scene3d.js:6309+` L counter’ı procedural çizer. L150/L200 branch’i `src/scene3d.js:6353-6374` tablaları module width/depth ve 2 cm overhang hesabından üretir. Production `counter_top_102_60` metadata’sı renderer tarafından okunmaz ve mesh üzerinde bu partId identity’si yoktur.

# 4. UI/runtime

`src/selectionFeedback.js:18-27` `Köşe Banko 150×150` etiketini üretebilir. Ancak `src/rawBomDebug.js:91-94` özel L-counter parser yalnız `Köşe Banko 100×100` eşleşmesini destekler. Dolayısıyla `counter_top_102_60` mevcut seçim-metni Raw BOM akışında UI’a ulaşmaz.

Recipe resolver kod düzeyinde mevcuttur ve testlerden doğrudan çağrılabilir; eksik olan L150 UI parser bağlantısıdır.

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

`test/lCounter150Contract.test.js:39-41` exact L150 BOM’da `counter_top_102_60 ×1` ve production width=102 değerini doğrular. Batch hedefli test sonucu **45 test / 45 pass / 0 fail**.

# 8. Sonuç

`counter_top_102_60` yalnız L150 recipe’sinde ×1 kullanılan production/BOM `partId` kimliğidir. Recipe/runtime resolver vardır; fakat mevcut Raw BOM UI özel L parser’ı L150’yi desteklemez. Ayrı state/persistence/render identity mevcut runtime kodunda yoktur.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
