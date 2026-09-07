`shelf_leg` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik / tanım

`src/productionParts.js:34`:

```js
shelf_leg: Object.freeze({ partId: 'shelf_leg', name: 'Raf Ayağı', type: 'shelf-accessory', unit: 'adet' }),
```

Gerçek production/BOM kimliği `partId = shelf_leg`. Lookup `src/productionParts.js:52-54` `getProductionPart(partId)` ile yapılır. Standalone catalog item/proje entity’si mevcut runtime kodunda yok.

# 2. Recipe / BOM kullanımları

- `src/moduleRecipes.js:24` → shelf 100 / 2 raf → `shelf_leg ×4`
- `src/moduleRecipes.js:27` → shelf 150 / 2 raf → `shelf_leg ×4`
- `src/moduleRecipes.js:30` → shelf 200 / 2 raf → `shelf_leg ×6`
- `src/moduleRecipes.js:33` → shelf 100 / 3 raf → `shelf_leg ×6`
- `src/moduleRecipes.js:36` → shelf 150 / 3 raf → `shelf_leg ×6`
- `src/moduleRecipes.js:39` → shelf 200 / 3 raf → `shelf_leg ×9`

Resolver `src/moduleRecipes.js:107-129` üzerinden recipe → `expandRecipe()` → production metadata akışı vardır.

İlgili module catalog seti altı `wall_shelf_2_*` / `wall_shelf_3_*` girdisidir.

# 3. State / renderer paralel temsili

`src/designState.js:74-89` shelf module state’inde yalnız width, shelfCount, lighting ve panel strip state vardır; ayrı `shelf_leg` instance’ı yoktur.

`src/scene3d.js:6393-6508` `createShelfModule()` raf, ön profil ve aydınlatma geometrisini procedural oluşturur. Renderer `productionParts.js` veya recipe’yi import etmez. `shelf_leg` adına/partId’sine bağlı mesh üretimi mevcut runtime kodunda yoktur. Yani BOM’daki raf ayağı adedi ile render geometrisi doğrudan production identity üzerinden bağlı değildir.

# 4. UI/runtime

`src/selectionFeedback.js:62-64` raf seçimi metni, `src/rawBomDebug.js:68-73` parser’ı üzerinden recipe resolver’a gider. `rawBomDebug.js:35-55` recipe’deki `shelf_leg` miktarını production adı `Raf Ayağı` ile gösterebilir.

# 5. Persistence

Project snapshot module state’i saklar (`src/main.js:1257-1265`, `src/projectStore.js:39-56`); ayrı raf ayağı instance listesi saklanmaz. Restore `src/main.js:1320-1331` module state/catalog ilişkisini çözer.

# 6. Ownership

```text
shelf_leg metadata → src/productionParts.js
adet kuralı → src/moduleRecipes.js
BOM policy → src/moduleContracts.js:4-7
module state → src/designState.js
procedural render → src/scene3d.js
Raw BOM UI → src/rawBomDebug.js
```

# 7. Testler

`test/moduleRecipes.test.js` `shelf_leg` adını ve tüm raf recipe miktarlarını doğrular. Batch hedefli test sonucu **45 test / 45 pass / 0 fail**.

# 8. Sonuç

`shelf_leg` aktif recipe/BOM kalemidir; 6 farklı raf recipe’sinde 4/4/6/6/6/9 adet kullanılır. Ancak ayrı state entity’si, persisted instance’ı veya render mesh `partId` identity’si mevcut runtime kodunda yoktur.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
