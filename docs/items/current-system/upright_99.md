`upright_99` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Mevcut gerçek kimlik ve tanım

Kaynak: `src/productionParts.js:3`

```js
upright_99: Object.freeze({
  partId: 'upright_99',
  name: 'Dikme 99 cm',
  type: 'upright',
  unit: 'adet',
  dimensions: Object.freeze({ lengthCm: 99, thicknessCm: 8 })
}),
```

Lookup: `src/productionParts.js:52-54`

```js
export function getProductionPart(partId) {
  return PRODUCTION_PARTS[partId] ?? null;
}
```

Bugünkü gerçek kimlik `partId = upright_99`'dur. `upright_99` için bağımsız `MODULE_CATALOG` girdisi, proje instance `id`'si veya ayrı runtime module `type` mevcut kodda yoktur.

# 2. Doğrudan kod noktaları ve recipe kullanımları

`src/` altında exact `upright_99` kullanımı iki dosyadadır:

```text
src/productionParts.js
src/moduleRecipes.js
```

`src/moduleRecipes.js` içinde 6 recipe kullanır:

| Recipe | Satır | Miktar |
|---|---:|---:|
| `counter-l-100` | 56-58 | 5 |
| `counter-l-150` | 60-62 | 5 |
| `counter-l-200` | 64-66 | 5 |
| `counter-100` | 68-70 | 4 |
| `counter-150` | 71-73 | 4 |
| `counter-200` | 74-76 | 4 |

Dolayısıyla mevcut BOM kullanımı yalnız banko ailesindedir.

# 3. Catalog → resolver → recipe zinciri

Banko katalog girdileri `src/catalog.js:205-210`:

```text
desk_banko_100   → type=counter, widthCm=100
desk_banko_100_L → type=counter, shape=L, widthCm=100, depthCm=100
desk_banko_150   → type=counter, widthCm=150
desk_banko_150_L → type=counter, shape=L, widthCm=150, depthCm=150
desk_banko_200   → type=counter, widthCm=200
desk_banko_200_L → type=counter, shape=L, widthCm=200, depthCm=200
```

Resolver `src/moduleRecipes.js:107-116`:

```js
if (moduleType === 'counter' && options.shape === 'L') {
  return MODULE_RECIPES[`counter-l:${nominalWidthCm}`] ?? null;
}
return MODULE_RECIPES[`${moduleType}:${nominalWidthCm}`] ?? null;
```

Akış:

```text
desk_banko_* catalogKey
→ descriptor.type = counter
→ widthCm / shape
→ getModuleRecipe('counter', widthCm, { shape })
→ counter:<width> veya counter-l:<width>
→ upright_99 × 4 veya × 5
```

Recipe metadata çözümleme `src/moduleRecipes.js:119-129`:

```text
recipe item { partId:'upright_99', quantity:N }
→ expandRecipe()
→ getProductionPart('upright_99')
→ PRODUCTION_PARTS.upright_99
```

# 4. State tarafı

Counter state `src/designState.js:109-126` ile oluşturulur. State şunları taşır:

```text
id
type = counter
shape
widthCm
depthCm
heightCm = 100
faces
```

L counter'da 8 editable face vardır; düz counter'da 6 face vardır. `createModuleStateFromDescriptor()` `src/designState.js:357-378` module seviyesinde `catalogKey` resolve eder.

State içinde `partId = upright_99`, production parça instance'ı, `lengthCm = 99` veya `thicknessCm = 8` tutulmaz. Bu ilişki mevcut runtime kodunda yoktur.

# 5. Renderer tarafı paralel sistemdir

`src/scene3d.js` `productionParts.js` veya `moduleRecipes.js` import etmez; `upright_99` string'i renderer'da yoktur.

Düz banko renderer'ı `createCounterModule()` `src/scene3d.js:6131-6307`:

```js
const heightM = heightCm / 100;
const topThicknessM = 0.04;
const frameHeightM = Math.max(heightM - topThicknessM, profileM * 3);
```

100 cm bankoda procedural dikey post yüksekliği yaklaşık:

```text
100 cm - 4 cm = 96 cm
```

`src/scene3d.js:6177-6190` dört corner post üretir.

L banko `createLCounterModule()` `src/scene3d.js:6309-6390` içinde aynı `height=100 cm`, `topThickness=4 cm` yaklaşımıyla yaklaşık 96 cm post üretir ve `src/scene3d.js:6330-6340` beş post oluşturur.

Production tarafı ise:

```text
upright_99 = 99 cm, thicknessCm = 8
```

Yani L bankoda BOM adedi 5 ve renderer post adedi 5 olsa da bunları bağlayan `partId` ilişkisi yoktur; renderer yüksekliği de production 99 cm değerinden okunmaz.

Renderer `group.userData` ve surface `userData` alanları module `id/type/width/depth/surface` bilgilerini taşır (`src/scene3d.js:6152-6161`, `6271-6287`, `6326-6329`, `6383`), fakat `upright_99` `partId`'si taşımaz.

# 6. Browser Raw BOM tüketimi

`src/rawBomDebug.js:1` doğrudan `getExpandedModuleRecipe` import eder. `renderRecipe()` `src/rawBomDebug.js:35-56` recipe item'larını:

```text
N × <production part name>
```

olarak gösterir. Düz bankolarda kullanıcı `4 × Dikme 99 cm`, desteklenen L bankoda `5 × Dikme 99 cm` görebilir.

Selection metni `src/selectionFeedback.js:18-27` banko etiketini üretir. Raw BOM parser `src/rawBomDebug.js:91-101`:

- `Köşe Banko 100×100` için özel L branch'e sahiptir.
- Düz `Banko 100/150/200 cm` için genel branch'e sahiptir.
- `Köşe Banko 150×150` ve `Köşe Banko 200×200` için özel L branch yoktur.

Bu yüzden `counter-l-150` ve `counter-l-200` recipe'lerinde `upright_99 × 5` mevcut olmasına rağmen mevcut selection-text Raw BOM akışından bu iki L recipe'ye ulaşılmaz.

# 7. Persistence

`buildProjectSnapshot()` `src/main.js:1257-1265` yalnız stand ve module state'lerini klonlar. `restoreProject()` `src/main.js:1320-1331` module state'lerini geri yükleyip module `catalogKey`'ini yeniden resolve eder. `saveProject()` `src/projectStore.js:39-56` proje nesnesini IndexedDB `projects` store'una yazar.

Counter state içinde `upright_99` kimliği bulunmadığı için persistence'ta ayrı `upright_99` instance'ı saklanmaz.

# 8. BOM ownership / source-of-truth

`src/moduleContracts.js:4-7`:

```js
const RECIPE_BOM_POLICY = Object.freeze({
  mode: 'recipe',
  source: 'src/moduleRecipes.js',
});
```

Altı banko catalog key'i `src/moduleContracts.js:119-124` altında bu policy'yi kullanır.

Mevcut sahiplik ayrımı:

```text
production metadata → src/productionParts.js
recipe/adet         → src/moduleRecipes.js
module BOM policy   → src/moduleContracts.js
renderer geometry   → src/scene3d.js
project persistence → src/main.js + src/projectStore.js
```

`src/systemChangeContract.js:114-122` de `moduleRecipes.js` ve `productionParts.js` dosyalarını `bom`, `rawBomDebug.js` dosyasını `bom + ui` domain'inde sınıflandırır.

# 9. Testler

Doğrudan `upright_99` geçen testler:

```text
test/counterRecipes.test.js
test/lCounter100Contract.test.js
test/lCounter150Contract.test.js
test/lCounter200Contract.test.js
```

Başlıca doğrulamalar:

- `test/counterRecipes.test.js:7-8`: production uzunluğu 99 cm.
- `test/counterRecipes.test.js:14-25`: banko 100 → `upright_99 × 4`.
- `test/counterRecipes.test.js:28-49`: banko 150/200 → `upright_99 × 4`.
- `test/counterRecipes.test.js:52-55`: expanded recipe production adını resolve eder.
- `test/lCounter100Contract.test.js:10`: L100 → `upright_99 × 5`.
- `test/lCounter150Contract.test.js:33-40`: L150 → `upright_99 × 5`; BOM ile renderer geometry'nin ayrı olduğunu test adı açıkça belirtir.
- `test/lCounter200Contract.test.js:33-40`: L200 → `upright_99 × 5`; BOM ile renderer geometry ayrı tutulur.

Bu çalışma sırasında ilgili ortak hedefli test seti çalıştırıldı:

```text
node --test test/moduleRecipes.test.js test/counterRecipes.test.js test/baseRecipes.test.js test/baseWallRecipes.test.js test/showcaseRecipes.test.js test/separatorRecipes.test.js test/lCounter100Contract.test.js test/lCounter150Contract.test.js test/lCounter200Contract.test.js
```

Sonuç: `49 test / 49 pass / 0 fail`.

# 10. Mevcut zincirin sonucu

```text
partId olarak var                      EVET
production metadata olarak var         EVET
recipe BOM kalemi olarak var            EVET (6 recipe)
standalone MODULE_CATALOG girdisi       HAYIR
ayrı project-state entity/instance      HAYIR
render mesh partId identity             HAYIR
persistence upright_99 instance         HAYIR
UI selection identity upright_99        HAYIR
renderer productionParts tüketimi       HAYIR
renderer moduleRecipes tüketimi         HAYIR
```

Bugün `upright_99` production/BOM tarafında açık bir `partId`'dir. Banko state/render tarafında aynı fiziksel işlev procedural corner-post geometrisiyle temsil edilir; fakat production kimliği ve ölçüsüyle doğrudan bağlı değildir.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
