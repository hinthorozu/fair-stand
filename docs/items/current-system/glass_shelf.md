`glass_shelf` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik / tanım

`src/productionParts.js:38`:

```js
glass_shelf: Object.freeze({ partId: 'glass_shelf', name: 'Cam Raf', type: 'showcase-accessory', unit: 'adet' }),
```

Gerçek production/BOM kimliği `partId = glass_shelf`; lookup `src/productionParts.js:52-54` `getProductionPart(partId)` ile yapılır. Standalone catalog item veya proje instance entity’si mevcut runtime kodunda yok.

# 2. Recipe / BOM

- `src/moduleRecipes.js:43` → `showcase-2:100` → `glass_shelf ×2`
- `src/moduleRecipes.js:46` → `showcase-3:100` → `glass_shelf ×3`

Resolver `src/moduleRecipes.js:107-129` recipe item’ı `expandRecipe()` ile production registry’ye bağlar.

İlgili module catalog key’leri: `wall_showcase_100_2`, `wall_showcase_100_3`.

# 3. State / renderer paralel temsili

`src/designState.js:60-71` showcase state yalnız module id/type/width ve editable strip state taşır; ayrı `glass_shelf` instance listesi yoktur.

`src/scene3d.js:6949+` `createShowcaseModule()` cam raf geometrisini vitrinin renderer mantığı içinde procedural üretir. Renderer `productionParts.js` / `moduleRecipes.js` import etmediği için bu geometri `glass_shelf` production partId üzerinden üretilmez. Mesh/userData üzerinde `partId=glass_shelf` mevcut runtime kodunda yoktur.

# 4. UI/runtime

`src/selectionFeedback.js:57-59` vitrin seçim metnini üretir; `src/rawBomDebug.js:76-81` 2/3 gözlü vitrini recipe’ye resolve eder. `rawBomDebug.js:35-55` expanded recipe sonucu `2 × Cam Raf` veya `3 × Cam Raf` gösterebilir.

# 5. Persistence

`src/main.js:1257-1265` showcase module state’ini snapshot’a alır; `src/projectStore.js:39-56` persist eder; restore `src/main.js:1320-1331`. `glass_shelf` production instance’ları ayrı persistence kaydı değildir.

# 6. Ownership

```text
glass_shelf metadata → src/productionParts.js
adet kuralı → src/moduleRecipes.js
BOM policy → src/moduleContracts.js:4-7
showcase state → src/designState.js
showcase render → src/scene3d.js
Raw BOM UI → src/rawBomDebug.js
```

# 7. Testler

`test/showcaseRecipes.test.js` `Cam Raf` production adını, 2 gözlü vitrin için ×2, 3 gözlü için ×3 ve expanded resolver metadata’sını doğrular. Batch sonucu **45 test / 45 pass / 0 fail**.

# 8. Sonuç

`glass_shelf` aktif production/BOM accessory `partId` kimliğidir. İki showcase recipe’sinde 2 veya 3 adet kullanılır; state/persistence/renderer tarafında ayrı `glass_shelf` production identity mevcut runtime kodunda yoktur.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
