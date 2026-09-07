`panel_48_5` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

Bu rapor mevcut çalışan kodu tarif eder. Hedef mimari veya gelecekte eklenecek kavramlar mevcut runtime gerçeği gibi kullanılmamıştır.

# 1. Mevcut gerçek kimlik ve tanım

Kaynak: `src/productionParts.js:11`

```text
partId = panel_48_5
name = Panel 48,5 × 47 cm
type = panel
unit = adet
dimensions = 48.5 × 47 × 0.8 cm
panelRole = straight
nominalModuleWidthCm = 50
```

Lookup `src/productionParts.js:52-54`:

```js
export function getProductionPart(partId) {
  return PRODUCTION_PARTS[partId] ?? null;
}
```

Bugünkü gerçek production/BOM kimliği `partId = panel_48_5`'dır. Bu parça için bağımsız bir `MODULE_CATALOG` girdisi, proje instance `id`'si veya ayrı runtime module `type`'ı mevcut runtime kodunda yoktur.

# 2. Gerçek recipe kullanımları

`panel_48_5` doğrudan normal BOM `items` kalemi olarak şu recipe'lerde geçer:

| Recipe | Resolver girdisi | nominalWidthCm | Miktar | Kaynak |
|---|---|---:|---:|---|
| `wall-straight-50` | `wall / flat-panel` | 50 | 7 | `src/moduleRecipes.js:4-6` |
| `counter-l-100` | `counter shape=L` | 100 | 4 | `src/moduleRecipes.js:56-58` |
| `counter-l-150` | `counter shape=L` | 150 | 4 | `src/moduleRecipes.js:60-62` |
| `counter-l-200` | `counter shape=L` | 200 | 4 | `src/moduleRecipes.js:64-66` |
| `counter-100` | `counter` | 100 | 4 | `src/moduleRecipes.js:68-70` |
| `counter-150` | `counter` | 150 | 4 | `src/moduleRecipes.js:71-73` |
| `counter-200` | `counter` | 200 | 4 | `src/moduleRecipes.js:74-76` |
| `base-wall-100` | `base-wall` | 100 | 2 | `src/moduleRecipes.js:78-80` |
| `base-wall-150` | `base-wall` | 150 | 2 | `src/moduleRecipes.js:81-83` |
| `base-wall-200` | `base-wall` | 200 | 2 | `src/moduleRecipes.js:84-86` |
| `base-100` | `base` | 100 | 2 | `src/moduleRecipes.js:88-90` |
| `base-150` | `base` | 150 | 2 | `src/moduleRecipes.js:91-93` |
| `base-200` | `base` | 200 | 2 | `src/moduleRecipes.js:94-96` |

Toplam **13 ayrı recipe** doğrudan `panel_48_5` kullanır.

# 3. Recipe resolver / production metadata çözümleme

`src/moduleRecipes.js:107-116` module `type`, nominal genişlik ve bazı seçeneklere göre recipe seçer.

`src/moduleRecipes.js:119-130` normal `recipe.items` satırlarını `getProductionPart(item.partId)` ile production metadata'ya genişletir.

```text
recipe item partId
→ getModuleRecipe(...)
→ expandRecipe(...)
→ getProductionPart(partId)
→ PRODUCTION_PARTS.panel_48_5
```

# 4. Catalog → recipe ilişkisi

`panel_48_5` bağımsız katalog girdisi değildir. Aşağıdaki katalog ürünlerinin recipe zincirlerinde yer alır:

```text
wall_50
desk_banko_100_L
desk_banko_150_L
desk_banko_200_L
desk_banko_100
desk_banko_150
desk_banko_200
wall_base_100
wall_base_150
wall_base_200
BASE_100
BASE_150
BASE_200
```

Katalog kimliği ile production `partId` aynı şey değildir. Catalog module state oluşturur; recipe resolver module `type`/genişlik/options üzerinden production parça ilişkisine gider.

# 5. State

İlgili module state'leri `src/designState.js` içinde production panel instance'ı taşımaz. Düz panel/shelf/door/showcase/base-wall tarafında generic `strips`, counter/base tarafında generic editable `faces` kullanılır (`src/designState.js:35-167`). Bu state nesnelerinde production panel `partId` alanı yoktur.

# 6. Renderer

`src/scene3d.js` `productionParts.js` veya `moduleRecipes.js` import etmez (`src/scene3d.js:1-33`). Render geometry module state ve renderer sabitlerinden procedural üretilir.

Düz panel/shelf duvar tarafında `createFlatPanelModule()` (`src/scene3d.js:6511-6814`) `widthCm`, `STAND_DIMENSIONS` ve renderer sabitlerini kullanır. Counter tarafında `createCounterModule()` (`6131-6307`) ve `createLCounterModule()` (`6309-6390`) panel genişliklerini `widthCm/depthCm` ile hesaplar. Base tarafında `createBaseModule()` (`5969+`), base-wall tarafında `createBaseWallModule()` (`1401-1420`) procedural geometri kullanır.

Render mesh/surface `userData` içinde module/surface kimlikleri vardır; `panel_48_5` production `partId`'si yoktur.

# 7. BOM / UI runtime tüketimi

`src/rawBomDebug.js:35-55` `getExpandedModuleRecipe()` çağırır ve `recipe.items` satırlarını `quantity × production part name` olarak gösterir. `syncFromSelection()` (`58-131`) görünür `#selection-info` metnini regex ile parse eder.

Desteklenen seçim akışlarında `panel_48_5` production adıyla Raw BOM listesinde görüntülenebilir. Raw BOM state'i doğrudan okumaz; UI seçim metnini parse eder.

L-counter sınırı: `src/rawBomDebug.js:91-95` özel L counter eşleşmesi yalnız `Köşe Banko 100×100` içindir. 150×150 ve 200×200 L counter recipe'leri kod/testte mevcut olsa da bu özel UI parser branch'i üzerinden L recipe'lerine ulaşılmaz.

# 8. Persistence

`src/main.js:1263-1264` stand ve `currentModules` snapshot'ını oluşturur; restore sırasında `src/main.js:1326+` `project.modules` tekrar `currentModules` olur. `src/projectStore.js` proje nesnesini persistence/storage katmanına yazar.

Module state içinde `panel_48_5` production `partId` instance'ı bulunmadığından persistence'a ayrı `panel_48_5` instance'ı yazılmaz.

# 9. BOM ownership / source-of-truth

`src/moduleContracts.js:4-7` recipe kullanan modüllerde BOM kaynağını `src/moduleRecipes.js` olarak tanımlar. Mevcut ayrım:

```text
Production part metadata → src/productionParts.js
Recipe + quantity         → src/moduleRecipes.js
Module BOM policy         → src/moduleContracts.js
Debug browser tüketimi    → src/rawBomDebug.js
```

`src/systemChangeContract.js:110-122` da `moduleRecipes.js` ve `productionParts.js` dosyalarını `bom`, `rawBomDebug.js` dosyasını `bom + ui`, `scene3d.js` dosyasını renderer/state tarafında sınıflandırır.

# 10. Test zinciri

Doğrudan/ilgili regression noktaları:

- `test/moduleRecipes.test.js:41-52` — wall 50 içinde `panel_48_5 × 7`.
- `test/counterRecipes.test.js` — düz bankolarda `panel_48_5 × 4`.
- `test/lCounter100Contract.test.js:10`, `lCounter150Contract.test.js:33-40`, `lCounter200Contract.test.js:33-40` — L bankolarda `×4`.
- `test/baseWallRecipes.test.js:12-29` — base-wall 100/150/200 içinde `×2`.
- `test/baseRecipes.test.js:32-45` — base 100/150/200 içinde `×2`.

Çalıştırılan hedefli test seti: `moduleRecipes`, `separatorRecipes`, `showcaseRecipes`, `counterRecipes`, `baseRecipes`, `baseWallRecipes`, `lCounter100/150/200Contract`.

```text
49 test
49 pass
0 fail
```

# 11. Mevcut zincirin özeti

| Nokta | Durum |
|---|---|
| production `partId` | EVET |
| production metadata | EVET |
| recipe BOM kalemi | EVET |
| standalone catalog item | HAYIR |
| project-state instance | HAYIR |
| render mesh `partId` identity | HAYIR |
| persistence instance | HAYIR |
| Raw BOM tüketimi | EVET (desteklenen seçimlerde) |

Bugün `panel_48_5` production/BOM tarafında tanımlı bir kimliktir. State/render/persistence tarafı aynı fiziksel kavramı module ölçüsü ve generic yüzey/geometri üzerinden ayrı temsil eder; production `partId` ile doğrudan identity bağı mevcut runtime kodunda yoktur.

**Kod zinciri burada bitiyor. Entegrasyon veya hedef mimari tasarımı yapılmadı.**