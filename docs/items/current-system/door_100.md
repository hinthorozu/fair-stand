`door_100` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik / tanım

`src/productionParts.js:29`:

```js
door_100: Object.freeze({ partId: 'door_100', name: 'Kapı 100 cm', type: 'door', unit: 'adet', nominalModuleWidthCm: 100 }),
```

Mevcut production/BOM kimliği `partId = door_100`. Lookup `src/productionParts.js:52-54` içindeki `getProductionPart(partId)` ile yapılır. `door_100` için standalone `MODULE_CATALOG` girdisi, proje instance `id`’si veya ayrı persisted production entity mevcut runtime kodunda yok.

# 2. Recipe / BOM zinciri

- `src/moduleRecipes.js:20` → `door:100` / `door-100` → `door_100 × 1`

Resolver: `src/moduleRecipes.js:107-129`:

```text
moduleType + width/options
→ getModuleRecipe(...)
→ recipe item { partId: 'door_100', quantity }
→ expandRecipe(...)
→ getProductionPart('door_100')
→ production metadata
```

İlgili module catalog yolları: `DOOR_100`. Bunlar module `catalogKey` değerleridir; `door_100` production kimliği değildir.

# 3. State / renderer paralel temsili

İlgili state: `src/designState.js` → createDoorModuleState (92-106). State module `id`, `type`, ölçü/konfigürasyon ve düzenlenebilir yüzeyleri taşır; `door_100` `partId`’si state’e ayrı instance olarak yazılmaz.

Renderer: `src/scene3d.js` → createDoorModule (6636+). `scene3d.js:1-33` içinde `productionParts.js` veya `moduleRecipes.js` import edilmez. Renderer `door_100` metadata’sını resolve etmez; module state + catalog/renderer sabitleriyle procedural geometri üretir. Mesh/userData üzerinde `door_100` `partId` bağı mevcut runtime kodunda yok.

# 4. UI / runtime tüketimi

İlgili seçim metni `src/selectionFeedback.js` tarafından module/surface metadata’dan üretilir. Raw BOM yolu: `rawBomDebug 62-65`. `src/rawBomDebug.js:35-55` expanded recipe items’ını `quantity × part.name` olarak gösterir; module state’i doğrudan okumak yerine `#selection-info` metnini regex ile parse eder.

# 5. Persistence

`src/main.js:1257-1265` `currentModules` state’ini snapshot’a alır; `src/projectStore.js:39-56` bunu IndexedDB’ye yazar; restore `src/main.js:1320-1331` module `catalogKey`’ini yeniden resolve eder. State içinde `door_100` production instance’ı olmadığı için persistence’ta ayrı `door_100` kaydı yoktur.

# 6. Ownership / source-of-truth

```text
production metadata  → src/productionParts.js
recipe + quantity    → src/moduleRecipes.js
module BOM policy    → src/moduleContracts.js:4-7 (RECIPE_BOM_POLICY)
state                → src/designState.js
renderer             → src/scene3d.js
persistence          → src/main.js + src/projectStore.js
Raw BOM UI           → src/rawBomDebug.js
```

`src/systemChangeContract.js:110,114,116,119,122,125,127` bu alan sahipliklerini architecture/BOM/persistence/renderer/UI domainleri olarak sınıflandırır.

# 7. Testler

Doğrudan ilgili testler: `moduleRecipes.test.js`.

Bu batch sırasında çalıştırıldı:

```text
node --test test/moduleRecipes.test.js test/showcaseRecipes.test.js test/counterRecipes.test.js test/baseRecipes.test.js test/baseWallRecipes.test.js test/lCounter100Contract.test.js test/lCounter150Contract.test.js test/lCounter200Contract.test.js
```

Sonuç: **45 test / 45 pass / 0 fail**.

# 8. Sonuç

`door_100` mevcut sistemde production/BOM `partId` kimliğidir. Recipe quantity + production metadata zinciri vardır; ayrı project-state entity’si, persisted production instance’ı veya renderer mesh identity’si mevcut runtime kodunda yoktur. Production/BOM ve state/render temsilleri paralel sistemlerdir ve aralarında doğrudan `door_100` `partId` bağı yoktur.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
