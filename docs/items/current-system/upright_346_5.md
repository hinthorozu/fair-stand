`upright_346_5` mevcut kod zincirini çıkardım. **Hiçbir dosyada değişiklik yapmadım.**

## 1. Mevcut canonical tanım

Kaynak:

`src/productionParts.js:2`

```js
upright_346_5: Object.freeze({
  partId: 'upright_346_5',
  name: 'Dikme 346,5 cm',
  type: 'upright',
  unit: 'adet',
  dimensions: Object.freeze({
    lengthCm: 346.5,
    thicknessCm: 8
  })
})
```

Lookup:

`src/productionParts.js:52-54`

```js
export function getProductionPart(partId) {
  return PRODUCTION_PARTS[partId] ?? null;
}
```

Yani bugünkü yapıda kimliği:

```text
partId = upright_346_5
```

ve sahip olduğu metadata:

```text
name
type
unit
lengthCm
thicknessCm
```

Burası şu an **production/BOM parça kaynağı**.

---

# 2. Recipe zinciri

`src/moduleRecipes.js`

`upright_346_5`, toplam **18 ayrı recipe** içinde kullanılıyor ve mevcut recipe'lerin hepsinde:

```text
quantity = 2
```

### Düz duvarlar

```text
wall 50
wall 100
wall 150
wall 200
```

`src/moduleRecipes.js:3-16`

Akış:

```text
getStraightWallRecipe(width)
        ↓
STRAIGHT_WALL_RECIPES[width]
        ↓
{ partId: 'upright_346_5', quantity: 2 }
```

---

### Kapı

```text
door:100
```

`src/moduleRecipes.js:19-21`

```text
DOOR_100
→ module type: door
→ getModuleRecipe('door', 100)
→ upright_346_5 × 2
```

---

### Raflı duvarlar

Altı recipe:

```text
shelf 100 × 2 raf
shelf 150 × 2 raf
shelf 200 × 2 raf

shelf 100 × 3 raf
shelf 150 × 3 raf
shelf 200 × 3 raf
```

`src/moduleRecipes.js:23-40`

Hepsi:

```text
upright_346_5 × 2
```

---

### Vitrin

```text
showcase-2:100
showcase-3:100
```

`src/moduleRecipes.js:42-47`

İkisinde de:

```text
upright_346_5 × 2
```

---

### Separatör

```text
separator:50
separator:100
```

`src/moduleRecipes.js:49-54`

İkisinde de:

```text
upright_346_5 × 2
```

---

### Panel Bazalı

```text
base-wall:100
base-wall:150
base-wall:200
```

`src/moduleRecipes.js:78-86`

Hepsinde:

```text
upright_346_5 × 2
```

Burada ayrıca kısa dikme de ayrı BOM kalemi:

```text
upright_49_5 × 2
```

---

# 3. Recipe → production part çözümleme

Ana fonksiyon:

`src/moduleRecipes.js:119-122`

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

Dolayısıyla:

```text
recipe item
{ partId: 'upright_346_5', quantity: 2 }

        ↓

getProductionPart('upright_346_5')

        ↓

PRODUCTION_PARTS.upright_346_5

        ↓

{
  partId,
  name,
  type,
  unit,
  dimensions
}
```

Public resolver:

```text
getExpandedModuleRecipe(...)
```

`src/moduleRecipes.js:128-130`

Akış:

```text
getExpandedModuleRecipe()
        ↓
getModuleRecipe()
        ↓
recipe
        ↓
expandRecipe()
        ↓
getProductionPart()
        ↓
upright_346_5 metadata
```

---

# 4. Şu an browser'daki gerçek tüketici

Production recipe sisteminin `src/` altındaki doğrudan runtime tüketicisi:

`src/rawBomDebug.js`

Import:

```js
import { getExpandedModuleRecipe } from './moduleRecipes.js';
```

`src/rawBomDebug.js:1`

Asıl çağrı:

`src/rawBomDebug.js:35-36`

```js
function renderRecipe(moduleType, widthCm, label, options = {}) {
  const recipe = getExpandedModuleRecipe(moduleType, widthCm, options);
```

Sonra:

`src/rawBomDebug.js:50-53`

```js
recipe.items.forEach((item) => {
  const li = document.createElement('li');
  li.textContent =
    `${formatNumber(item.quantity)} × ${item.part?.name ?? item.partId}`;
});
```

Yani kullanıcı ekranda örneğin:

```text
2 × Dikme 346,5 cm
```

görüyor.

Tam mevcut BOM runtime zinciri:

```text
selection-info DOM metni
        ↓
rawBomDebug.syncFromSelection()
        ↓
regex ile moduleType / width çıkarılıyor
        ↓
renderRecipe(...)
        ↓
getExpandedModuleRecipe(...)
        ↓
getModuleRecipe(...)
        ↓
moduleRecipes.js
        ↓
upright_346_5 × 2
        ↓
expandRecipe(...)
        ↓
getProductionPart('upright_346_5')
        ↓
productionParts.js
        ↓
"Dikme 346,5 cm"
        ↓
Raw BOM debug UI
```

Önemli nokta: `rawBomDebug.js`, module state'i doğrudan okumuyor. `#selection-info` içindeki **görünen metni regex ile parse ediyor.**

---

# 5. Module contract tarafındaki mevcut sahiplik

`src/moduleContracts.js`

Recipe kullanan modüller için:

```js
const RECIPE_BOM_POLICY = Object.freeze({
  mode: 'recipe',
  source: 'src/moduleRecipes.js',
});
```

`src/moduleContracts.js:4-7`

Dolayısıyla mevcut sistem açıkça:

```text
module BOM owner
    =
src/moduleRecipes.js
```

diyor.

`upright_346_5` kullanan katalog aileleri de burada `RECIPE_BOM_POLICY` altında:

```text
wall_*
wall_separator_*
wall_showcase_*
wall_shelf_*
wall_base_*
DOOR_100
```

---

# 6. Render tarafı ayrı bir zincir

Burada kritik ayrım var.

`upright_346_5` **renderer tarafından okunmuyor.**

Renderer:

```text
productionParts.js
```

veya

```text
moduleRecipes.js
```

import etmiyor.

Sahnedeki dikey profiller ayrı sabitlerden üretiliyor.

### Global stand geometrisi

`src/catalog.js:3-10`

```js
export const STAND_DIMENSIONS = Object.freeze({
  height: 3.5,
  depth: 0.1,
  stripCount: 7,
  stripHeight: 0.5,
  frameWidth: 0.055,
  frameDepth: 0.1,
});
```

Yani renderer yüksekliği:

```text
350 cm
```

Production parça uzunluğu ise:

```text
346.5 cm
```

---

### Dikey profil render genişliği

`src/scene3d.js:39`

```js
const PANEL_VERTICAL_PROFILE_WIDTH_M = 0.040;
```

Yani render:

```text
4 cm
```

genişliğinde bir profil çiziyor.

Production metadata:

```text
thicknessCm: 8
```

Bunlar da birbirine bağlı değil.

---

# 7. Düz panel render zinciri

Katalog:

`src/catalog.js:116-119`

```text
wall_50  → flat-panel
wall_100 → flat-panel
wall_150 → flat-panel
wall_200 → flat-panel
```

State factory:

`src/designState.js:328-330`

```text
flat-panel
    ↓
createFlatPanelModuleState()
```

Renderer dispatch:

`src/scene3d.js:1489-1490`

```js
if (moduleState.type === 'flat-panel') {
  return createFlatPanelModule(...);
}
```

Dikey profiller:

`src/scene3d.js:6538-6544`

```js
const profileGeometry =
  new THREE.BoxGeometry(
    PANEL_VERTICAL_PROFILE_WIDTH_M,
    height,
    frameDepth
  );

for (const side of [-1, 1]) {
  ...
}
```

Yani sahnede gerçekten **iki dikey profil** oluşturuluyor.

Ama bunların identity'si:

```text
upright_346_5
```

değil.

Sadece anonim Three.js mesh'leri.

---

# 8. Diğer upright\_346\_5 kullanan renderer'lar

Aynı fiziksel BOM parçasını kullanan modüllerin renderer tarafı da ayrı ayrı oluşturuluyor.

### Shelf

```text
createShelfModule()
    ↓
createFlatPanelModule()
```

`src/scene3d.js:6393-6394`

Dolayısıyla aynı iki anonim dikey profil.

### Door

`createDoorModule()`

`src/scene3d.js:6636`

Dikey profiller:

`src/scene3d.js:6665-6671`

Yine:

```text
2 adet procedural mesh
```

ama `upright_346_5` bağlantısı yok.

### Separator

`createSeparatorModule()`

`src/scene3d.js:6817`

Dikey profiller:

`src/scene3d.js:6842-6848`

Yine iki mesh.

### Showcase

`createShowcaseModule()`

`src/scene3d.js:6949`

Dikey profiller:

`src/scene3d.js:6985-6991`

Yine iki mesh.

### Base-wall

`createBaseWallModule()`

`src/scene3d.js:1401`

Şunu yapıyor:

```text
base-wall
    ↓
wallState.type = flat-panel
    ↓
createFlatPanelModule()
```

Dolayısıyla uzun dikmeler yine `createFlatPanelModule()` tarafından procedural oluşturuluyor.

---

# 9. State tarafında da upright yok

Örneğin normal düz duvar state'i:

`src/designState.js:35-44`

```js
{
  id,
  type: 'flat-panel',
  widthCm,
  strips: [...]
}
```

Burada:

```text
itemKey
partId
upright
upright_346_5
```

yok.

Aynı durum shelf / door / separator / showcase state'lerinde de geçerli.

Yani proje persistence içinde de ayrı bir:

```text
upright_346_5 instance
```

bulunmuyor.

---

# 10. Test zinciri

`upright_346_5` bugün esas olarak **BOM recipe regression** seviyesinde korunuyor.

Başlıca testler:

```text
test/moduleRecipes.test.js
test/baseWallRecipes.test.js
test/showcaseRecipes.test.js
test/separatorRecipes.test.js
```

Örneğin:

`test/moduleRecipes.test.js:159-165`

```js
const expanded = getExpandedStraightWallRecipe(200);

assert.equal(
  expanded.items[1].part.dimensions.lengthCm,
  346.5
);
```

Dolayısıyla test edilen ilişki:

```text
recipe partId
→ productionParts metadata
→ lengthCm = 346.5
```

Renderer ile production part arasında bir identity testi yok.

---

# Mevcut zincirin özeti

Bugünkü gerçek yapı iki paralel kola ayrılmış durumda:

```text
                    MODULE / CATALOG
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
        BOM / PRODUCTION              RENDER
              │                         │
     moduleRecipes.js              designState.js
              │                         │
 upright_346_5 × 2                module type/state
              │                         │
              ▼                         ▼
  productionParts.js               scene3d.js
              │                         │
 length = 346.5 cm              STAND_DIMENSIONS.height
 thickness = 8 cm                    = 350 cm
 unit = adet                          │
              │                  procedural mesh ×2
              ▼                         │
     rawBomDebug.js                   ▼
              │                 anonymous geometry
              ▼
 "2 × Dikme 346,5 cm"
```

## En kritik mevcut durum

**`upright_346_5`** **bugün yalnızca production/BOM kimliği.**

Şu anda:

```text
canonical Item değil
runtime Item instance değil
project state içinde değil
renderer identity'si değil
mesh identity'si değil
catalog item değil
persistence entity'si değil
```

Ve özellikle:

> `upright_346_5` production tanımı ile sahnede çizilen iki dikey profil arasında doğrudan kod bağı yok.

BOM tarafı `346.5 cm / 8 cm` metadata taşırken renderer bağımsız olarak `350 cm` yüksekliği ve `4 cm` dikey profil genişliğini kullanıyor.

**Kod zinciri burada bitiyor. Entegrasyon veya tasarım tarafına geçmedim.**