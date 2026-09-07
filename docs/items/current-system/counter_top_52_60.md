`counter_top_52_60` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik / tanım

`src/productionParts.js:41`:

```js
counter_top_52_60: Object.freeze({ partId: 'counter_top_52_60', name: 'Banko Üstü 52 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 52, depthCm: 60 }), nominalModuleWidthCm: 100 }),
```

Gerçek production/BOM kimliği `partId = counter_top_52_60`; lookup `src/productionParts.js:52-54` ile yapılır. Standalone catalog/project entity mevcut runtime kodunda yok.

# 2. Recipe / BOM

`src/moduleRecipes.js:57` → `counter-l:100` / `counter-l-100` → `counter_top_52_60 ×1`.

Resolver `src/moduleRecipes.js:107-129`: `getModuleRecipe('counter',100,{shape:'L'})` → recipe → `expandRecipe()` → `getProductionPart('counter_top_52_60')`.

Module catalog yolu `src/catalog.js:206` `desk_banko_100_L` (`type=counter`, `shape=L`, `widthCm=100`, `depthCm=100`).

# 3. State / renderer

`src/designState.js:109-126` L counter state’inde width/depth/shape ve 8 editable face state vardır; `counter_top_52_60` partId yoktur.

`src/scene3d.js:6309+` `createLCounterModule()` L bankoyu procedural üretir. L100 özelinde `src/scene3d.js:6350-6352` ikinci tabla `BoxGeometry(0.52, topThickness, 0.60)` ile doğrudan çizilir. Bu 52×60 ölçü production registry’den okunmaz. Mesh/userData üzerinde `counter_top_52_60` identity mevcut runtime kodunda yoktur.

# 4. UI/runtime

`src/selectionFeedback.js:18-27` `Köşe Banko 100×100` etiketini üretir. `src/rawBomDebug.js:91-94` tam bu etiketi özel branch ile `getExpandedModuleRecipe('counter',100,{shape:'L'})` yoluna taşır; böylece Raw BOM `counter_top_52_60 ×1` satırını production adıyla gösterebilir.

# 5. Persistence

Module counter state `src/main.js:1257-1265` snapshot’ında persist edilir; `src/projectStore.js:39-56` IndexedDB’ye yazar, restore `src/main.js:1320-1331`. Top production parçası ayrı instance olarak tutulmaz.

# 6. Ownership

```text
metadata → src/productionParts.js
quantity/recipe → src/moduleRecipes.js
BOM policy → src/moduleContracts.js:4-7
state → src/designState.js
renderer → src/scene3d.js
Raw BOM UI → src/rawBomDebug.js
```

# 7. Testler

`test/lCounter100Contract.test.js` L100 exact BOM içinde `counter_top_52_60 ×1` doğrular. Batch hedefli test sonucu **45 test / 45 pass / 0 fail**.

# 8. Sonuç

`counter_top_52_60` yalnız L100 recipe’sinde aktif production/BOM `partId` kalemidir. Renderer 52×60 geometriyi doğrudan sabitle çizer fakat production part registry/identity’sini tüketmez. Ayrı state/persistence/render partId identity mevcut runtime kodunda yoktur.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
