`profile_140_5` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Mevcut gerçek kimlik ve tanım

Kaynak: `src/productionParts.js:8`

```js
profile_140_5: Object.freeze({
  partId: 'profile_140_5',
  name: 'Profil 140,5 cm',
  type: 'profile',
  unit: 'adet',
  dimensions: Object.freeze({ lengthCm: 140.5 })
}),
```

Lookup `src/productionParts.js:52-54` içindeki `getProductionPart(partId)` ile yapılır. Bugünkü gerçek kimlik `partId = profile_140_5`'dir.

Standalone `MODULE_CATALOG` girdisi, ayrı proje entity/id'si veya production profile instance state'i mevcut runtime kodunda yoktur.

# 2. Recipe kullanımları

`src/` altında exact kullanım `src/productionParts.js` ve `src/moduleRecipes.js` dosyalarındadır.

Toplam 8 recipe'de geçer:

| Recipe | Satır | Miktar |
|---|---:|---:|
| `wall-straight-150` | 10-12 | 2 |
| `shelf-wall-150-2` | 26-28 | 2 |
| `shelf-wall-150-3` | 35-37 | 2 |
| `counter-l-150` | 60-62 | 5 |
| `counter-l-200` | 64-66 | 1 |
| `counter-150` | 71-73 | 3 |
| `base-wall-150` | 81-83 | 4 |
| `base-150` | 91-93 | 4 |

# 3. Catalog → resolver → recipe zinciri

İlgili catalog key'ler `src/catalog.js:118,125-126,207-210,212,215`:

```text
wall_150
wall_shelf_2_150
wall_shelf_3_150
desk_banko_150
desk_banko_150_L
desk_banko_200_L
wall_base_150
BASE_150
```

Resolver `src/moduleRecipes.js:99-116`:

```text
wall/flat-panel → getStraightWallRecipe(150)
shelf            → shelf:150:<count>
counter straight → counter:150
counter L150     → counter-l:150
counter L200     → counter-l:200
base-wall        → base-wall:150
base             → base:150
```

`expandRecipe()` `src/moduleRecipes.js:119-122` her recipe `partId`'sini `getProductionPart()` üzerinden metadata'ya resolve eder.

# 4. State

Üst modüllerin state'i `src/designState.js` içinde module-level olarak tutulur:

- flat panel `35-44`
- shelf `74-89`
- counter `109-126`
- base-wall `129-148`
- base `151-166`

`createModuleStateFromDescriptor()` `357-378` module `catalogKey`'ini resolve eder.

Bu state'lerde `profile_140_5` partId'si, `lengthCm=140.5` veya production profile instance'ı bulunmaz.

# 5. Renderer tarafında paralel procedural rail sistemi

`src/scene3d.js` `productionParts.js` veya `moduleRecipes.js` import etmez. `profile_140_5` render mesh identity'si değildir.

## Wall / shelf 150

`createFlatPanelModule()` `src/scene3d.js:6511-6559` yatay rail uzunluğunu:

```text
150 cm - 2×4 cm = 142 cm
```

olarak procedural üretir. Shelf `src/scene3d.js:6393-6410` aynı flat-panel renderer'ını kullanır.

Production tarafı `profile_140_5 = 140.5 cm`'dir. Renderer bu değeri okumaz.

## Düz counter 150

`createCounterModule()` `src/scene3d.js:6131-6211` front rail span'ını:

```text
150 - 2×4 - 1.2 = 140.8 cm
```

hesaplar. Recipe `profile_140_5 ×3` üretir. Geometrik değer yakın olsa da direct `partId` bağı mevcut değildir.

## L counter 150 / 200

`createLCounterModule()` `src/scene3d.js:6309-6347` module width/depth ve `armM=0.50` üzerinden rail'leri üretir.

L150 BOM: `profile_140_5 ×5`.

L200 BOM: `profile_140_5 ×1`; aynı recipe ayrıca `profile_190 ×5` ve `profile_41_5 ×4` taşır. Renderer rail mesh'leri production part kimlikleriyle etiketlenmediği için hangi procedural rail'in `profile_140_5 ×1` olduğu mevcut runtime kodunda tanımlı değildir.

## Base / base-wall 150

`createBaseModule()` `src/scene3d.js:5969-6046` front rail span'ını `150 - 2×4 = 142 cm` hesaplar. `createBaseWallModule()` `1401-1412` flat-panel ve base renderer'larını birleştirir. Recipe'deki `profile_140_5 ×4` mesh'lere production identity ile bağlanmaz.

# 6. UI / Raw BOM

`src/selectionFeedback.js` selection identity'sini module type/width üzerinden üretir; `profile_140_5` UI selection identity değildir.

`src/rawBomDebug.js` şu yollarla ilgili 150 cm recipe'lerini gösterebilir:

- shelf150 `68-73`
- düz counter150 `97-101`
- base-wall150 `104-109`
- base150 `111-115`
- wall150 `118-130`

Bunlar `renderRecipe()` `35-56` üzerinden `N × Profil 140,5 cm` satırı üretir.

`counter-l-150` ve `counter-l-200` recipe'leri kodda mevcuttur; fakat Raw BOM parser yalnız `Köşe Banko 100×100` için özel L branch taşır (`91-95`). Bu nedenle L150/L200 içindeki `profile_140_5` kullanımları mevcut selection-text UI zincirinden gösterilmez.

# 7. Persistence

`src/main.js:1257-1265` module state'lerini project snapshot'a alır; `1320-1331` restore eder ve module `catalogKey`'ini resolve eder. `src/projectStore.js:39-56` project'i IndexedDB'ye yazar.

State içinde production `profile_140_5` identity'si bulunmadığından persistence içinde ayrı profile instance'ı yoktur.

# 8. BOM ownership / source-of-truth

`src/moduleContracts.js:4-7` recipe BOM source'unu `src/moduleRecipes.js` olarak tanımlar. İlgili wall/shelf/counter/base-wall/base catalog key'leri `src/moduleContracts.js:94-127` altında `RECIPE_BOM_POLICY` kullanır.

Mevcut sahiplik:

```text
production metadata → src/productionParts.js
recipe/adet         → src/moduleRecipes.js
module BOM policy   → src/moduleContracts.js
state               → src/designState.js
renderer geometry   → src/scene3d.js
persistence         → src/main.js + src/projectStore.js
UI BOM              → src/rawBomDebug.js
```

`src/systemChangeContract.js:114-122` production/recipe kaynaklarını BOM domain'inde sınıflandırır.

# 9. Testler

Doğrudan `profile_140_5` geçen testler:

```text
test/moduleRecipes.test.js
test/counterRecipes.test.js
test/baseRecipes.test.js
test/baseWallRecipes.test.js
test/lCounter150Contract.test.js
test/lCounter200Contract.test.js
```

Başlıca doğrulamalar:

- `test/moduleRecipes.test.js:54-70`: wall150 → `profile_140_5 ×2`.
- `test/moduleRecipes.test.js:87-136`: shelf150 2/3 raf → `profile_140_5 ×2`.
- `test/counterRecipes.test.js:28-37`: counter150 → `profile_140_5 ×3`.
- `test/baseRecipes.test.js:14-45`: base150 → `profile_140_5 ×4`.
- `test/baseWallRecipes.test.js:6-29`: base-wall150 → `profile_140_5 ×4`.
- `test/lCounter150Contract.test.js:33-40`: L150 → `profile_140_5 ×5`; test BOM ile renderer geometry'nin ayrı olduğunu açıkça doğrular.
- `test/lCounter200Contract.test.js:33-40`: L200 → `profile_140_5 ×1`; BOM/render ayrımı korunur.

Bu çalışma sırasında ortak hedefli test seti çalıştırıldı: `49 test / 49 pass / 0 fail`.

# 10. Sonuç

```text
partId olarak var                         EVET
production metadata olarak var            EVET
recipe BOM kalemi olarak var               EVET (8 recipe)
standalone MODULE_CATALOG girdisi          HAYIR
ayrı project-state entity/instance         HAYIR
render mesh partId identity                HAYIR
persistence profile_140_5 instance         HAYIR
UI selection identity profile_140_5        HAYIR
renderer productionParts tüketimi          HAYIR
renderer moduleRecipes tüketimi            HAYIR
```

`profile_140_5` production/BOM tarafında 150 cm modüllerde ve ayrıca L200 recipe'sinde kullanılan gerçek `partId`'dir. Renderer benzer rail geometrilerini module ölçülerinden procedural hesaplar; production kimliği ve `140.5 cm` metadata'sı renderer'a doğrudan bağlı değildir.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
