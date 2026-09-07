`panel_197` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Mevcut gerçek kimlik ve tanım

`panel_197` mevcut runtime kodunda bir production/BOM `partId` olarak tanımlıdır.

Kaynak: `src/productionParts.js:14`

```js
panel_197: Object.freeze({
  partId: 'panel_197',
  name: 'Panel 197 × 47 cm',
  type: 'panel',
  unit: 'adet',
  dimensions: Object.freeze({ widthCm: 197, heightCm: 47, thicknessCm: 0.8 }),
  panelRole: 'straight',
  nominalModuleWidthCm: 200
}),
```

Lookup: `src/productionParts.js:52-54`

```js
export function getProductionPart(partId) {
  return PRODUCTION_PARTS[partId] ?? null;
}
```

Bugünkü gerçek kimlik:

```text
partId = panel_197
```

Metadata:

```text
name = Panel 197 × 47 cm
type = panel
unit = adet
widthCm = 197
heightCm = 47
thicknessCm = 0.8
panelRole = straight
nominalModuleWidthCm = 200
```

`panel_197` için mevcut runtime kodunda bağımsız bir `catalogKey`, proje `id`'si veya ayrı module `type` yoktur. `MODULE_CATALOG` içinde standalone `panel_197` girdisi bulunmaz.

---

# 2. Doğrudan kod kullanımları

`src/` altında `panel_197` doğrudan iki dosyada geçer:

```text
src/productionParts.js
src/moduleRecipes.js
```

`src/moduleRecipes.js` içinde 7 recipe `panel_197` kullanır:

| Recipe | Resolver girdisi | Miktar |
|---|---|---:|
| `wall-straight-200` | `wall` / `flat-panel`, `200` | 7 |
| `shelf-wall-200-2` | `shelf`, `200`, `shelfCount=2` | 7 |
| `shelf-wall-200-3` | `shelf`, `200`, `shelfCount=3` | 7 |
| `counter-l-200` | `counter`, `200`, `shape=L` | 4 |
| `counter-200` | `counter`, `200` | 2 |
| `base-wall-200` | `base-wall`, `200` | 7 |
| `base-200` | `base`, `200` | 2 |

---

# 3. Düz duvar 200 zinciri

`src/moduleRecipes.js:13-15`:

```text
wall-straight-200
→ profile_190 × 2
→ upright_346_5 × 2
→ panel_197 × 7
→ connector_start × 2
→ connector_single × 13
→ innerCornerPanelPartId = panel_corner_192
```

Resolver:

`src/moduleRecipes.js:99-100`

```js
export function getStraightWallRecipe(nominalWidthCm) {
  return STRAIGHT_WALL_RECIPES[nominalWidthCm] ?? null;
}
```

`src/moduleRecipes.js:107-116` içinde `wall` ve `flat-panel` aynı straight-wall resolver'a gider.

Katalog karşılığı: `src/catalog.js:119`

```js
wall_200: { type: 'flat-panel', widthCm: 200, label: 'Düz Panel 200' },
```

Akış:

```text
wall_200
↓
type = flat-panel, widthCm = 200
↓
getModuleRecipe('flat-panel', 200)
↓
getStraightWallRecipe(200)
↓
panel_197 × 7
```

`wall_200` katalog kimliğidir; `panel_197` recipe içindeki production `partId`'dir.

---

# 4. Raflı duvar 200 zinciri

`src/moduleRecipes.js:29-31`:

```text
shelf-wall-200-2 → panel_197 × 7
```

`src/moduleRecipes.js:38-40`:

```text
shelf-wall-200-3 → panel_197 × 7
```

Resolver `src/moduleRecipes.js:109-112`:

```js
if (moduleType === 'shelf') {
  const shelfCount = Number(options.shelfCount);
  return MODULE_RECIPES[`shelf:${nominalWidthCm}:${shelfCount}`] ?? null;
}
```

Katalog: `src/catalog.js:127-128`

```text
wall_shelf_2_200 → type=shelf, widthCm=200, shelfCount=2
wall_shelf_3_200 → type=shelf, widthCm=200, shelfCount=3
```

---

# 5. Düz banko 200 zinciri

`src/moduleRecipes.js:74-76`:

```text
counter-200 → panel_197 × 2
```

Katalog: `src/catalog.js:209`

```text
desk_banko_200 → type=counter, widthCm=200, depthCm=50, heightCm=100
```

Akış:

```text
desk_banko_200
↓
getModuleRecipe('counter', 200)
↓
MODULE_RECIPES['counter:200']
↓
panel_197 × 2
```

---

# 6. L banko 200 zinciri

`src/moduleRecipes.js:64-66`:

```text
counter-l-200 → panel_197 × 4
```

Katalog: `src/catalog.js:210`

```text
desk_banko_200_L → type=counter, shape=L, widthCm=200, depthCm=200, heightCm=100
```

Resolver `src/moduleRecipes.js:113-115`:

```js
if (moduleType === 'counter' && options.shape === 'L') {
  return MODULE_RECIPES[`counter-l:${nominalWidthCm}`] ?? null;
}
```

---

# 7. Panel Bazalı 200 zinciri

`src/moduleRecipes.js:84-86`:

```text
base-wall-200 → panel_197 × 7
innerCornerPanelPartId = panel_corner_192
```

Katalog: `src/catalog.js:216`

```text
wall_base_200 → type=base-wall, widthCm=200, depthCm=50, heightCm=350
```

Akış:

```text
wall_base_200
↓
getModuleRecipe('base-wall', 200)
↓
base-wall-200
↓
panel_197 × 7
```

Önemli: recipe'de `innerCornerPanelPartId = panel_corner_192` metadata'sı vardır; ancak mevcut `src/` runtime kodunda placement ilişkisini okuyup `panel_197` yerine otomatik `panel_corner_192` uygulayan bir BOM tüketicisi bulunmadı. `rawBomDebug.js` bu variant metadata'sını kullanmıyor.

---

# 8. Baza 200 zinciri

`src/moduleRecipes.js:94-96`:

```text
base-200 → panel_197 × 2
```

Katalog: `src/catalog.js:213`

```text
BASE_200 → type=base, widthCm=200, depthCm=50, heightCm=50
```

---

# 9. Recipe → production metadata çözümleme

`src/moduleRecipes.js:119-122`:

```js
export function expandRecipe(recipe) {
  if (!recipe) return null;
  return {
    ...recipe,
    items: recipe.items.map((item) => ({
      ...item,
      part: getProductionPart(item.partId)
    }))
  };
}
```

Public resolver `src/moduleRecipes.js:128-130`:

```js
export function getExpandedModuleRecipe(moduleType, nominalWidthCm, options = {}) {
  return expandRecipe(getModuleRecipe(moduleType, nominalWidthCm, options));
}
```

`panel_197` zinciri:

```text
{ partId: 'panel_197', quantity: N }
↓
expandRecipe()
↓
getProductionPart('panel_197')
↓
PRODUCTION_PARTS.panel_197
↓
name / unit / dimensions / panelRole / nominalModuleWidthCm
```

---

# 10. Browser Raw BOM tüketimi

Doğrudan browser recipe tüketicisi `src/rawBomDebug.js`.

Import `src/rawBomDebug.js:1`:

```js
import { getExpandedModuleRecipe } from './moduleRecipes.js';
```

`renderRecipe()` `src/rawBomDebug.js:35-36` recipe'yi çözer; `src/rawBomDebug.js:50-53` her satırı:

```text
N × <production part name>
```

olarak yazdırır.

200 cm düz duvar için sonuç örneği:

```text
7 × Panel 197 × 47 cm
```

`rawBomDebug.js` gerçek module state'i doğrudan okumaz; `#selection-info` görünür metnini regex ile parse eder. `#selection-info` `index.html:120`, Raw BOM script'i `index.html:160` içinde yüklenir.

UI akışı:

```text
scene selection
↓
describeSurfaceSelection()
↓
selectionInfo.textContent
↓
rawBomDebug MutationObserver
↓
metin regex parse
↓
getExpandedModuleRecipe()
↓
panel_197 metadata
```

## L banko 200 Raw BOM sınırı

`rawBomDebug.js:91-95` köşe banko özel eşleşmesini yalnız `Köşe Banko 100×100` için tanımlar. Mevcut 200 L seçim etiketi `Köşe Banko 200×200` olur. Bu nedenle `counter-l-200` recipe kodda/testlerde var olsa da mevcut seçim metni parser'ı üzerinden L 200 Raw BOM gösterimine ulaşan özel branch yoktur.

---

# 11. BOM ownership / source-of-truth

`src/moduleContracts.js:4-7`:

```js
const RECIPE_BOM_POLICY = Object.freeze({
  mode: 'recipe',
  source: 'src/moduleRecipes.js',
});
```

`panel_197` kullanan ilgili catalog modülleri recipe BOM policy altındadır:

```text
wall_200
wall_shelf_2_200
wall_shelf_3_200
wall_base_200
desk_banko_200
desk_banko_200_L
BASE_200
```

Mevcut kaynak ayrımı:

```text
Production part metadata:
  src/productionParts.js

Recipe / quantity:
  src/moduleRecipes.js

Module-level BOM policy:
  src/moduleContracts.js
```

`src/systemChangeContract.js:114-116,122` da `moduleRecipes.js` ve `productionParts.js` dosyalarını `bom`, `rawBomDebug.js` dosyasını `bom + ui` domain'lerinde sınıflandırır.

---

# 12. Proje state tarafında `panel_197` kimliği yok

Düz panel state `src/designState.js:35-44`:

```text
id
type = flat-panel
widthCm
strips[0..6]
```

Her editable yüzey `src/designState.js:25-32`:

```text
id
stripIndex
color
imageAssetId
imageTransform
```

Burada `partId = panel_197` veya production ölçüleri yoktur.

Shelf state (`src/designState.js:74-89`) generic `strips` taşır.

Counter state (`src/designState.js:109-126`) production panel instance'ları yerine generic editable `faces` taşır.

Base-wall state (`src/designState.js:129-148`) generic `strips` + `faces` taşır.

Base state (`src/designState.js:151-166`) generic `faces` taşır.

Sonuç: `panel_197` production kimliği proje state'ine ayrı entity/instance olarak yazılmaz.

---

# 13. Persistence

`src/main.js:1257-1265` proje snapshot'ında `currentModules` olduğu gibi klonlanır.

`src/main.js:1320-1331` restore sırasında `project.modules` tekrar `currentModules` olur ve module `catalogKey` yeniden resolve edilir.

`src/projectStore.js:39-56` proje nesnesini IndexedDB `projects` store'una yazar.

Module state içinde `panel_197` `partId` bulunmadığı için persistence'a ayrı `panel_197` instance'ı yazılmaz.

---

# 14. Renderer tarafı ayrı sistem

`src/scene3d.js`, `productionParts.js` veya `moduleRecipes.js` import etmez. Render geometrisi module state + renderer sabitlerinden procedural üretilir.

Global stand ölçüleri `src/catalog.js:3-10`:

```text
height = 3.5 m
depth = 0.1 m
stripCount = 7
stripHeight = 0.5 m
frameDepth = 0.1 m
```

Renderer sabitleri `src/scene3d.js:37-39`:

```text
PANEL_RAIL_HEIGHT_M = 0.004
PANEL_VERTICAL_CLEARANCE_M = 0
PANEL_VERTICAL_PROFILE_WIDTH_M = 0.040
```

## Düz duvar / shelf 200

`createFlatPanelModule()` `src/scene3d.js:6511-6564`:

```text
innerWidth = widthM - 2×0.040 - 0.012
panelHeight = stripHeight - railHeight
panelDepth = depth - 0.026
```

200 cm module için yaklaşık render backing ölçüsü:

```text
190.8 × 49.6 × 7.4 cm
```

Production metadata:

```text
panel_197 = 197 × 47 × 0.8 cm
```

Bu ölçüler doğrudan birbirine bağlı değildir.

`createShelfModule()` `src/scene3d.js:6393-6410` önce `createFlatPanelModule()` çağırır; 200 cm shelf arka yüzeyleri aynı procedural yapıyı kullanır.

## Panel Bazalı 200

`createBaseWallModule()` `src/scene3d.js:1401-1412`:

```text
base-wall
↓
createFlatPanelModule(wallState)
+
createBaseModule(baseState)
```

Recipe'deki `panel_197 × 7` ile renderer'daki 7 wall strip arasında `partId` bağı yoktur.

## Düz banko 200

`createCounterModule()` `src/scene3d.js:6131-6151` 200 cm front face genişliğini procedural olarak yaklaşık `190.8 cm`, panel yüksekliğini yaklaşık `47.6 cm` hesaplar. Recipe `panel_197 × 2` üretir; renderer yüzeylerinde `partId` yoktur.

## L banko 200

`createLCounterModule()` `src/scene3d.js:6309-6389` için 200×200 durumda yaklaşık:

```text
frontPanelM = 190.8 cm
rightPanelM = 190.8 cm
shortPanelM = 40.8 cm
```

Recipe tarafındaki `panel_197 × 4` mesh'lere production identity ile bağlanmaz.

## Baza 200

`createBaseModule()` `src/scene3d.js:5969-5987` 200 cm front render panel genişliğini `192 cm` hesaplar. Recipe'deki `panel_197 × 2` yine renderer yüzeylerine `partId` olarak yazılmaz.

---

# 15. UI selection identity

`src/selectionFeedback.js:11-108` selection mesajını renderer surface `userData` alanlarından üretir:

```text
moduleType
widthCm
stripNumber
surfaceRole
```

Normal 200 cm flat-panel seçimi `Modül N · 200 cm · alttan X. panel ...` biçimindedir.

UI seçili yüzeye `panel_197` kimliği vermez; mesh üzerinde `partId = panel_197` bulunmaz.

---

# 16. `panel_corner_192` ilişkisi

`panel_197`:

```text
panelRole = straight
nominalModuleWidthCm = 200
```

`panel_corner_192` `src/productionParts.js:19`:

```text
partId = panel_corner_192
panelRole = inner-corner
nominalModuleWidthCm = 200
192 × 47 × 0.8 cm
```

200 cm wall/shelf/base-wall recipe'leri `innerCornerPanelPartId = panel_corner_192` metadata'sı taşır. Ancak mevcut runtime'da placement'a göre `panel_197` miktarını otomatik azaltıp `panel_corner_192` ekleyen resolver bulunmadı. Variant metadata Raw BOM'u kendi başına değiştirmiyor.

---

# 17. Test zinciri

`panel_197` doğrudan şu testlerde korunuyor:

```text
test/moduleRecipes.test.js
test/counterRecipes.test.js
test/baseRecipes.test.js
test/baseWallRecipes.test.js
test/lCounter200Contract.test.js
```

Başlıca doğrulamalar:

- `test/moduleRecipes.test.js:20-27`: production panel genişlik setinde `197` var.
- `test/moduleRecipes.test.js:54-71`: wall 200 → `panel_197 × 7`, corner variant `panel_corner_192`.
- `test/moduleRecipes.test.js:107-117`: shelf 200 / 2 raf → `panel_197 × 7`.
- `test/moduleRecipes.test.js:140-150`: shelf 200 / 3 raf → `panel_197 × 7`.
- `test/moduleRecipes.test.js:159-165`: expanded metadata `widthCm = 197`.
- `test/counterRecipes.test.js:40-50`: düz banko 200 → `panel_197 × 2`.
- `test/baseRecipes.test.js:25-45`: baza 200 → `panel_197 × 2`.
- `test/baseWallRecipes.test.js:6-29`: panel bazalı 200 → `panel_197 × 7`, corner `panel_corner_192`.
- `test/lCounter200Contract.test.js:33-40`: L banko 200 → `panel_197 × 4`; aynı test BOM ile renderer geometry'nin ayrı olduğunu doğrular.

Bu çalışma sırasında çalıştırılan hedefli testler:

```text
node --test test/moduleRecipes.test.js test/counterRecipes.test.js test/baseRecipes.test.js test/baseWallRecipes.test.js test/lCounter200Contract.test.js
```

Sonuç:

```text
33 test
33 pass
0 fail
```

---

# 18. Mevcut zincirin özeti

```text
                    PRODUCTION / BOM
                           │
                           ▼
                  productionParts.js
                   partId = panel_197
                   197 × 47 × 0.8 cm
                           │
                           ▼
                    moduleRecipes.js
                           │
        ┌──────────────────┼───────────────────┐
        ▼                  ▼                   ▼
     wall/shelf         counter            base/base-wall
     200 ×7             200 ×2             base 200 ×2
                        L200 ×4             base-wall 200 ×7
        └──────────────────┬───────────────────┘
                           ▼
                     expandRecipe()
                           │
                           ▼
              getProductionPart(partId)
                           │
                           ▼
                   rawBomDebug.js
              (desteklenen seçimlerde)
                           │
                           ▼
               N × Panel 197 × 47 cm

-------------------------------------------------

                     STATE / RENDER
                           │
                           ▼
                       catalog.js
                module width/type/shape
                           │
                           ▼
                    designState.js
             generic strips / faces state
                           │
                           ▼
                      scene3d.js
             procedural surface/backing mesh

          panel_197 partId doğrudan bağlı değil
```

# 19. En kritik mevcut durum

```text
partId olarak var                         EVET
production metadata olarak var            EVET
recipe BOM kalemi olarak var               EVET
standalone MODULE_CATALOG girdisi          HAYIR
ayrı project-state entity/instance         HAYIR
render mesh partId identity                HAYIR
persistence içinde panel_197 instance      HAYIR
UI selection identity olarak panel_197     HAYIR
renderer productionParts.js tüketimi       HAYIR
renderer moduleRecipes.js tüketimi         HAYIR
```

Bugün aynı panel kavramı iki paralel sistemde temsil ediliyor:

```text
BOM tarafı:
  panel_197
  197 × 47 × 0.8 cm
  adet

State/render tarafı:
  module width/type + generic strip/face state
  procedural geometry
  partId yok
```

Bu iki temsil arasında doğrudan production-part identity bağı mevcut runtime kodunda yoktur.

Ayrıca `panel_corner_192` variant metadata'sı recipe'lerde mevcut olsa da placement'a göre `panel_197` ile otomatik değiştiren runtime BOM tüketimi bulunmadı.

**Kod zinciri burada bitiyor. Herhangi bir entegrasyon veya hedef mimari tasarımı yapılmadı.**