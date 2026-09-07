`profile_91` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Mevcut gerçek kimlik ve tanım

Kaynak: `src/productionParts.js:7`

```js
profile_91: Object.freeze({
  partId: 'profile_91',
  name: 'Profil 91 cm',
  type: 'profile',
  unit: 'adet',
  dimensions: Object.freeze({ lengthCm: 91 })
}),
```

Lookup `src/productionParts.js:52-54` içindeki `getProductionPart(partId)` ile yapılır. Bugünkü gerçek kimlik `partId = profile_91`'dir.

Standalone `MODULE_CATALOG.profile_91`, ayrı proje entity'si/id'si veya production profile instance state'i mevcut runtime kodunda yoktur.

# 2. Recipe kullanımları

`src/` altında exact `profile_91` kullanımı `src/productionParts.js` ve `src/moduleRecipes.js` dosyalarındadır.

Toplam 12 recipe'de geçer:

| Recipe | Satır | Miktar |
|---|---:|---:|
| `wall-straight-100` | 7-9 | 2 |
| `door-100` | 19-21 | 1 |
| `shelf-wall-100-2` | 23-25 | 2 |
| `shelf-wall-100-3` | 32-34 | 2 |
| `showcase-2-100` | 42-44 | 4 |
| `showcase-3-100` | 45-47 | 4 |
| `separator-100` | 52-54 | 2 |
| `counter-l-100` | 56-58 | 5 |
| `counter-l-150` | 60-62 | 1 |
| `counter-100` | 68-70 | 3 |
| `base-wall-100` | 78-80 | 4 |
| `base-100` | 88-90 | 4 |

# 3. Catalog → resolver → recipe zincirleri

İlgili catalog key'ler `src/catalog.js:117,121-125,203,205-218` çevresindedir:

```text
wall_100
DOOR_100
wall_shelf_2_100
wall_shelf_3_100
wall_showcase_100_2
wall_showcase_100_3
wall_separator_100
wall_separator_100_sarmasik
desk_banko_100
desk_banko_100_L
desk_banko_150_L
wall_base_100
BASE_100
```

`wall_separator_100` ve `_sarmasik` ayrı catalog key olmasına rağmen ikisi de `type=separator,widthCm=100` ile aynı `separator:100` recipe'sine gider.

Resolver `src/moduleRecipes.js:99-116`:

```text
wall/flat-panel → getStraightWallRecipe(width)
shelf            → shelf:<width>:<shelfCount>
counter + L      → counter-l:<width>
diğerleri        → <moduleType>:<width>
```

`expandRecipe()` `src/moduleRecipes.js:119-122` recipe item'larını `getProductionPart(item.partId)` ile production metadata'ya bağlar.

# 4. State

`profile_91` kullanan üst modüller module-level state'lerle temsil edilir:

- flat panel `src/designState.js:35-44`
- separator `47-57`
- showcase `60-71`
- shelf `74-89`
- door `92-106`
- counter `109-126`
- base-wall `129-148`
- base `151-166`

`createModuleStateFromDescriptor()` `357-378` module `catalogKey`'ini resolve eder.

Bu state nesnelerinde `profile_91` partId'si, 91 cm production ölçüsü veya profile instance kimliği bulunmaz.

# 5. Renderer tarafı paralel ve bağlama göre farklıdır

`src/scene3d.js` production part registry veya module recipe'yi import etmez; render mesh'lerinde `profile_91` identity'si yoktur.

## 100 cm wall / shelf / door / showcase

`createFlatPanelModule()` `src/scene3d.js:6511-6559`, `createDoorModule()` `6636-6685` ve `createShowcaseModule()` `6949-7005` yatay rail genişliğini temel olarak:

```text
widthM - 2 × PANEL_VERTICAL_PROFILE_WIDTH_M
100 cm - 2×4 cm = 92 cm
```

şeklinde procedural üretir. Production BOM ise `profile_91 = 91 cm` kullanır.

Shelf renderer `src/scene3d.js:6393-6410` önce `createFlatPanelModule()` çağırdığı için aynı procedural wall frame'ini kullanır.

## Separator 100

`createSeparatorModule()` `src/scene3d.js:6817-6860` farklı `frameWidth` (`STAND_DIMENSIONS.frameWidth = 5.5 cm`) kullanır:

```text
100 - 2×5.5 = 89 cm
```

Recipe `profile_91 ×2` olmasına rağmen render cross rail yaklaşık 89 cm'dir.

## Counter 100

`createCounterModule()` `src/scene3d.js:6131-6211` ön rail span'ını:

```text
100 - 2×4 - 1.2 = 90.8 cm
```

hesaplar; recipe `profile_91 ×3` üretir.

L100 recipe'de `profile_91 ×5`, L150 recipe'de `profile_91 ×1` vardır. `createLCounterModule()` `src/scene3d.js:6309-6347` rail span'larını module width/depth ve sabit 50 cm arm üzerinden hesaplar; production `91 cm` değerini okumaz.

## Base 100 / base-wall 100

`createBaseModule()` `src/scene3d.js:5969-6046` front rail span'ını `100 - 2×4 = 92 cm` hesaplar. `createBaseWallModule()` base ile flat-panel renderer'ını birleştirir. Recipe `profile_91 ×4` üretir; mesh'lerde partId yoktur.

Sonuç: `profile_91` ile fiziksel işlev olarak ilişkili görünen procedural rail'ler 89/90.8/92 cm gibi farklı render boyları kullanır; production `lengthCm=91` renderer source-of-truth'u değildir.

# 6. UI / runtime Raw BOM

`src/selectionFeedback.js:11-108` seçim metnini module type/width/surface üzerinden üretir; `profile_91` kullanıcı seçim kimliği değildir.

`src/rawBomDebug.js` recipe'leri seçim metninden resolve eder:

- door100 `62-65`
- shelf100 `68-73`
- showcase100 `76-81`
- separator100 `84-89`
- L100 `91-95`
- düz counter100 `97-101`
- base-wall100 `104-109`
- base100 `111-115`
- wall100 `118-130`

Bu yollar `renderRecipe()` `35-56` üzerinden `N × Profil 91 cm` satırı üretebilir.

`counter-l-150` recipe'sinde `profile_91 ×1` vardır; ancak `Köşe Banko 150×150` için Raw BOM parser branch'i mevcut değildir. Bu kullanım browser seçim akışından gösterilmez.

# 7. Persistence

`src/main.js:1257-1265` project snapshot'a module state'lerini alır; `1320-1331` geri yükler ve module-level `catalogKey` resolve eder. `src/projectStore.js:39-56` project'i IndexedDB'ye yazar.

State içinde production `profile_91` identity'si olmadığı için persistence içinde ayrı profile instance'ı yoktur.

# 8. BOM ownership / source-of-truth

`src/moduleContracts.js:4-7` recipe BOM source'unu `src/moduleRecipes.js` olarak tanımlar. İlgili catalog aileleri `src/moduleContracts.js:94-127` içindeki `RECIPE_BOM_POLICY` altındadır.

Mevcut sahiplik:

```text
profile metadata → src/productionParts.js
recipe/adet      → src/moduleRecipes.js
BOM policy       → src/moduleContracts.js
state            → src/designState.js
render geometry  → src/scene3d.js
persistence      → src/main.js + src/projectStore.js
UI BOM           → src/rawBomDebug.js
```

`src/systemChangeContract.js:114-122` production/recipe dosyalarını BOM domain'inde sınıflandırır.

# 9. Testler

Doğrudan `profile_91` geçen testler:

```text
test/moduleRecipes.test.js
test/showcaseRecipes.test.js
test/separatorRecipes.test.js
test/counterRecipes.test.js
test/baseRecipes.test.js
test/baseWallRecipes.test.js
test/lCounter100Contract.test.js
test/lCounter150Contract.test.js
```

Başlıca doğrulamalar:

- `test/moduleRecipes.test.js:54-70`: wall100 profile = `profile_91 ×2`.
- `test/moduleRecipes.test.js:74-84`: door100 → `profile_91 ×1`.
- `test/moduleRecipes.test.js:87-136`: shelf100 2/3 raf → `profile_91 ×2`.
- `test/showcaseRecipes.test.js:13-38`: showcase 2/3 → `profile_91 ×4`.
- `test/separatorRecipes.test.js:24-32`: separator100 → `profile_91 ×2`.
- `test/counterRecipes.test.js:14-25`: counter100 → `profile_91 ×3`.
- `test/lCounter100Contract.test.js:10`: L100 → `profile_91 ×5`.
- `test/lCounter150Contract.test.js:33-40`: L150 → `profile_91 ×1`.
- `test/baseRecipes.test.js:14-45`: base100 → `profile_91 ×4`.
- `test/baseWallRecipes.test.js:6-29`: base-wall100 → `profile_91 ×4`.

Bu çalışma sırasında ortak hedefli test seti çalıştırıldı: `49 test / 49 pass / 0 fail`.

# 10. Sonuç

```text
partId olarak var                     EVET
production metadata olarak var        EVET
recipe BOM kalemi olarak var           EVET (12 recipe)
standalone MODULE_CATALOG girdisi      HAYIR
ayrı project-state entity/instance     HAYIR
render mesh partId identity            HAYIR
persistence profile_91 instance        HAYIR
UI selection identity profile_91       HAYIR
renderer productionParts tüketimi      HAYIR
renderer moduleRecipes tüketimi        HAYIR
```

`profile_91` mevcut production/BOM sisteminde birçok 100 cm modülün yanı sıra L150 bankoda da kullanılan ortak parçadır. State/render tarafında aynı işler procedural rail geometrileriyle temsil edilir; production `partId` ve 91 cm ölçüsü doğrudan renderer'a bağlı değildir.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
