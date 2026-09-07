`counter_top_160_60` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik / tanım

`src/productionParts.js:42`:

```js
counter_top_160_60: Object.freeze({ partId: 'counter_top_160_60', name: 'Banko Üstü 160 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 160, depthCm: 60 }), nominalModuleWidthCm: 150 }),
```

Gerçek production/BOM kimliği `partId = counter_top_160_60`; lookup `src/productionParts.js:52-54` ile yapılır. Standalone catalog/project entity yoktur.

# 2. Recipe / BOM

- `src/moduleRecipes.js:61` → `counter-l:150` / `counter-l-150` → `counter_top_160_60 ×1`
- `src/moduleRecipes.js:72` → `counter:150` / `counter-150` → `counter_top_160_60 ×1`

Resolver `src/moduleRecipes.js:107-129`: counter module type + width/shape → recipe → `expandRecipe()` → `getProductionPart('counter_top_160_60')`.

Module catalog yolları `src/catalog.js:207-208`: `desk_banko_150`, `desk_banko_150_L`.

# 3. State / renderer

`src/designState.js:109-126` `createCounterModuleState()` generic counter state üretir; production top partId state içinde yoktur.

`src/scene3d.js:6131+` düz bankoyu, `6309+` L bankoyu procedural çizer. L150/L200 branch’i `src/scene3d.js:6353-6374` tabla ölçülerini module width/depth + 2 cm overhang ile hesaplar; `counter_top_160_60` production ölçüsünü okumaz. Mesh üzerinde production partId identity yoktur.

# 4. UI/runtime

`src/selectionFeedback.js:18-27` düz/L counter seçim etiketini üretir. `src/rawBomDebug.js:97-101` düz `Banko 150 cm` seçimini recipe’ye resolve ettiği için düz 150 kullanımında `counter_top_160_60 ×1` Raw BOM’da görünür.

**Mevcut sınır:** `src/rawBomDebug.js:91-94` özel L branch yalnız `Köşe Banko 100×100` eşleşmesini destekler. Bu nedenle aynı parçanın `counter-l:150` kullanımı L150 seçiminden Raw BOM’a ulaşmaz.

# 5. Persistence

Counter module state `src/main.js:1257-1265` snapshot’ında, `src/projectStore.js:39-56` IndexedDB’de saklanır; restore `src/main.js:1320-1331`. `counter_top_160_60` ayrı persisted production instance değildir.

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

`test/counterRecipes.test.js` 160×60 metadata ve düz counter-150 miktarını; `test/lCounter150Contract.test.js` L150 exact BOM’da `counter_top_160_60 ×1` değerini doğrular. Batch sonucu **45 test / 45 pass / 0 fail**.

# 8. Sonuç

`counter_top_160_60` düz 150 ve L150 recipe’lerinde ×1 kullanılan production/BOM `partId` kimliğidir. Düz kullanım Raw BOM UI’a ulaşır; L150 kullanımı mevcut özel parser nedeniyle ulaşmaz. Ayrı state/persistence/render partId identity yoktur.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
