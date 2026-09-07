`profile_41_5` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Mevcut gerçek kimlik ve tanım

Kaynak: `src/productionParts.js:6`

```js
profile_41_5: Object.freeze({
  partId: 'profile_41_5',
  name: 'Profil 41,5 cm',
  type: 'profile',
  unit: 'adet',
  dimensions: Object.freeze({ lengthCm: 41.5 })
}),
```

Lookup `src/productionParts.js:52-54` içindeki `getProductionPart(partId)` ile yapılır. Gerçek kimlik `partId = profile_41_5`'dir. Standalone `MODULE_CATALOG` girdisi veya proje-state production instance'ı mevcut kodda yoktur.

# 2. Recipe kullanımları

`src/` altında exact kullanım `src/productionParts.js` ve `src/moduleRecipes.js` dosyalarındadır.

`profile_41_5` toplam 14 recipe'de geçer:

| Recipe grubu | Recipe | Miktar |
|---|---|---:|
| düz duvar | `wall-straight-50` | 2 |
| separatör | `separator-50` | 2 |
| L banko | `counter-l-100` | 5 |
| L banko | `counter-l-150` | 4 |
| L banko | `counter-l-200` | 4 |
| düz banko | `counter-100` | 4 |
| düz banko | `counter-150` | 4 |
| düz banko | `counter-200` | 4 |
| panel bazalı | `base-wall-100` | 4 |
| panel bazalı | `base-wall-150` | 4 |
| panel bazalı | `base-wall-200` | 4 |
| baza | `base-100` | 4 |
| baza | `base-150` | 4 |
| baza | `base-200` | 4 |

Kaynak satırlar: `src/moduleRecipes.js:4-6,49-50,56-75,78-95`.

# 3. Resolver / katalog zincirleri

`getModuleRecipe()` `src/moduleRecipes.js:107-116` şu yolları çözer:

```text
flat-panel/wall, 50 → getStraightWallRecipe(50)
separator, 50       → separator:50
counter, width      → counter:<width>
counter + shape=L   → counter-l:<width>
base-wall, width    → base-wall:<width>
base, width         → base:<width>
```

İlgili katalog örnekleri `src/catalog.js:116,205-220`:

```text
wall_50
wall_separator_50
wall_separator_50_sarmasik
desk_banko_100/150/200
desk_banko_100_L/150_L/200_L
wall_base_100/150/200
BASE_100/150/200
```

`wall_separator_50` ve `wall_separator_50_sarmasik` ayrı catalog key'leridir; ikisi de `type=separator,widthCm=50` üzerinden aynı `separator:50` recipe'sine gider.

`expandRecipe()` `src/moduleRecipes.js:119-122` her `{partId,quantity}` satırını `getProductionPart()` ile metadata'ya bağlar.

# 4. State

Bu production parçasını kullanan üst modüllerin state'leri `src/designState.js` içinde module seviyesinde tutulur:

- flat panel: `createFlatPanelModuleState()` `35-44`
- separator: `createSeparatorModuleState()` `47-57`
- counter: `createCounterModuleState()` `109-126`
- base-wall: `createBaseWallModuleState()` `129-148`
- base: `createBaseModuleState()` `151-166`

`createModuleStateFromDescriptor()` `357-378` module `catalogKey`'ini resolve eder.

Bu state'lerde `profile_41_5`, `lengthCm=41.5` veya production profile instance'ı tutulmaz. State tarafında production part ownership mevcut runtime kodunda yoktur.

# 5. Renderer tarafında paralel profil geometrileri

`src/scene3d.js` `productionParts.js`/`moduleRecipes.js` tüketmez ve render mesh'lerine `profile_41_5` partId'si yazmaz.

Aynı fiziksel işleve benzeyen yatay profiller farklı procedural formüllerle çizilir:

## 50 cm düz duvar

`createFlatPanelModule()` `src/scene3d.js:6511-6559`:

```text
rail length = widthM - 2 × 0.040
50 cm için = 42 cm
```

BOM tarafı `profile_41_5 = 41.5 cm ×2`'dir. Renderer 42 cm rail üretir; production 41.5 cm değerini okumaz.

## Separatör 50

`createSeparatorModule()` `src/scene3d.js:6817-6860` `STAND_DIMENSIONS.frameWidth` üzerinden:

```text
cross rail length = widthM - 2 × frameWidth
frameWidth = 5.5 cm olduğundan 50 cm separatörde ≈39 cm
```

Recipe yine `profile_41_5 ×2` üretir. Doğrudan identity bağı yoktur.

## Düz bankolar

`createCounterModule()` `src/scene3d.js:6131-6211`:

```text
sidePanelWidthM = depthM - 2×profileM - 0.012
50 cm depth için ≈40.8 cm
```

Recipe düz bankolarda `profile_41_5 ×4` üretir. Renderer side rail geometrisi production 41.5 cm'den hesaplanmaz.

## L bankolar

`createLCounterModule()` `src/scene3d.js:6309-6347` içinde `armM=0.50` ve `shortPanelM = armM - 2×profileM - 0.012` ile yaklaşık 40.8 cm kısa rail geometrisi kurulur. L100 recipe `profile_41_5 ×5`, L150/L200 `×4` üretir; renderer mesh'lerinde production identity yoktur.

## Baza / panel bazalı

`createBaseModule()` `src/scene3d.js:5969-6046` 50 cm derinlikte side rail uzunluğunu `depthM - 2×profileM = 42 cm` hesaplar. `createBaseWallModule()` ise base renderer'ını düz duvar renderer'ıyla birleştirir. Recipe tarafında her base/base-wall için `profile_41_5 ×4` vardır; renderer doğrudan bu partId'yi tüketmez.

# 6. UI / Raw BOM

Selection UI `src/selectionFeedback.js:11-108` module type/width/surface üzerinden konuşur; `profile_41_5` selection identity değildir.

`src/rawBomDebug.js:35-56` expanded recipe satırını `N × Profil 41,5 cm` olarak gösterebilir. Parser yolları:

- düz wall 50: `118-130`
- separator 50: `84-89`
- düz counter 100/150/200: `97-101`
- L100: `91-95`
- base-wall 100/150/200: `104-109`
- base 100/150/200: `111-115`

`counter-l-150` ve `counter-l-200` recipe'leri kodda olsa da Raw BOM seçim parser'ında bu L ölçüler için branch yoktur.

# 7. Persistence

`src/main.js:1257-1265` module state'i snapshot'a alır, `1320-1331` restore eder. `src/projectStore.js:39-56` project'i IndexedDB'ye yazar.

Module state'lerinde `profile_41_5` production kimliği bulunmadığından ayrı profile instance'ı persistence'a yazılmaz.

# 8. BOM ownership / source-of-truth

`src/moduleContracts.js:4-7` recipe BOM source'unu `src/moduleRecipes.js` olarak belirler. İlgili wall/separator/counter/base-wall/base catalog key'leri `RECIPE_BOM_POLICY` kullanır (`src/moduleContracts.js:94-127`).

Mevcut ayrım:

```text
production metadata → src/productionParts.js
recipe/adet         → src/moduleRecipes.js
module BOM policy   → src/moduleContracts.js
state               → src/designState.js
renderer            → src/scene3d.js
persistence         → src/main.js + src/projectStore.js
```

`src/systemChangeContract.js:114-122` de production/recipe kaynaklarını BOM domain'ine, `rawBomDebug.js`'i BOM + UI domain'ine koyar.

# 9. Testler

Doğrudan `profile_41_5` geçen testler:

```text
test/moduleRecipes.test.js
test/separatorRecipes.test.js
test/counterRecipes.test.js
test/baseRecipes.test.js
test/baseWallRecipes.test.js
test/lCounter100Contract.test.js
test/lCounter150Contract.test.js
test/lCounter200Contract.test.js
```

Önemli doğrulamalar:

- `test/moduleRecipes.test.js:41-51`: wall50 → `profile_41_5 ×2`.
- `test/separatorRecipes.test.js:12-21`: separator50 → `profile_41_5 ×2`.
- `test/counterRecipes.test.js:14-49`: düz bankolar → `profile_41_5 ×4`.
- `test/baseRecipes.test.js:32-45`: bazalar → `profile_41_5 ×4`.
- `test/baseWallRecipes.test.js:12-29`: panel bazalılar → `profile_41_5 ×4`.
- L100/L150/L200 contract testleri ilgili L recipe miktarlarını doğrular.

Bu çalışma sırasında ortak hedefli test seti çalıştırıldı: `49 test / 49 pass / 0 fail`.

# 10. Sonuç

```text
partId olarak var                        EVET
production metadata olarak var           EVET
recipe BOM kalemi olarak var              EVET (14 recipe)
standalone MODULE_CATALOG girdisi         HAYIR
ayrı project-state entity/instance        HAYIR
render mesh partId identity               HAYIR
persistence profile_41_5 instance         HAYIR
UI selection identity profile_41_5        HAYIR
renderer productionParts tüketimi         HAYIR
renderer moduleRecipes tüketimi           HAYIR
```

`profile_41_5` çok sayıda recipe tarafından ortak kullanılan production/BOM profilidir. Renderer tarafında 50 cm genişlik/derinlik çevresindeki çeşitli yatay rail geometrileri procedural olarak üretilir; fakat tek bir `profile_41_5` production identity'sine bağlı değildir ve geometrik değerler de bağlama göre 39/40.8/42 cm gibi farklı sonuçlar verir.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
