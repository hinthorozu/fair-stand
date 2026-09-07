`counter_top_210_60` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik / tanım

`src/productionParts.js:44`:

```js
counter_top_210_60: Object.freeze({ partId: 'counter_top_210_60', name: 'Banko Üstü 210 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 210, depthCm: 60 }), nominalModuleWidthCm: 200 }),
```

Gerçek production/BOM kimliği `partId = counter_top_210_60`; lookup `src/productionParts.js:52-54` ile yapılır. Standalone catalog/project entity mevcut runtime kodunda yok.

# 2. Recipe / BOM

- `src/moduleRecipes.js:65` → `counter-l:200` / `counter-l-200` → `counter_top_210_60 ×1`
- `src/moduleRecipes.js:75` → `counter:200` / `counter-200` → `counter_top_210_60 ×1`

Resolver `src/moduleRecipes.js:107-129`: counter type + width/shape → recipe → `expandRecipe()` → production metadata.

Module catalog yolları `src/catalog.js:209-210`: `desk_banko_200`, `desk_banko_200_L`.

# 3. State / renderer

`src/designState.js:109-126` `createCounterModuleState()` production top instance’ı değil generic counter state üretir.

`src/scene3d.js:6131+` düz, `6309+` L counter renderer’dır. L150/L200 tabla branch’i `src/scene3d.js:6353-6374` module width/depth + 2 cm overhang hesabını kullanır; `counter_top_210_60` production metadata’sını okumaz. Mesh/userData üzerinde bu partId mevcut runtime kodunda yoktur.

# 4. UI/runtime

`src/selectionFeedback.js:18-27` banko etiketini üretir. `src/rawBomDebug.js:97-101` düz `Banko 200 cm` seçimini recipe resolver’a gönderdiğinden düz 200 kullanımında `counter_top_210_60 ×1` Raw BOM’da gösterilir.

**Mevcut sınır:** özel L regex `src/rawBomDebug.js:91-94` yalnız 100×100 destekler. Bu parçanın `counter-l:200` kullanımı L200 seçiminden Raw BOM UI’a ulaşmaz.

# 5. Persistence

Counter module state `src/main.js:1257-1265` snapshot’ında, `src/projectStore.js:39-56` IndexedDB’de persist edilir; restore `src/main.js:1320-1331`. `counter_top_210_60` ayrı production instance değildir.

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

`test/counterRecipes.test.js` 210×60 metadata ve düz 200 miktarını; `test/lCounter200Contract.test.js` L200 exact BOM’da `counter_top_210_60 ×1` değerini doğrular. Batch sonucu **45 test / 45 pass / 0 fail**.

# 8. Sonuç

`counter_top_210_60` düz 200 ve L200 recipe’lerinde ×1 kullanılan production/BOM `partId` kimliğidir. Düz kullanım Raw BOM UI’a ulaşır; L200 mevcut parser sınırı nedeniyle ulaşmaz. Ayrı state/persistence/render production identity mevcut runtime kodunda yoktur.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
