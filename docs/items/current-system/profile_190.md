`profile_190` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

## 1. Mevcut gerçek kimlik ve tanım

`profile_190` mevcut runtime kodunda bir `partId` olarak tanımlıdır.

Kaynak:

`src/productionParts.js:9`

```js
profile_190: Object.freeze({
  partId: 'profile_190',
  name: 'Profil 190 cm',
  type: 'profile',
  unit: 'adet',
  dimensions: Object.freeze({ lengthCm: 190 })
}),
```

Lookup:

`src/productionParts.js:52-54`

```js
export function getProductionPart(partId) {
  return PRODUCTION_PARTS[partId] ?? null;
}
```

Bugünkü gerçek kimlik:

```text
partId = profile_190
```

Taşıdığı metadata:

```text
name = Profil 190 cm
type = profile
unit = adet
dimensions.lengthCm = 190
```

`profile_190` için mevcut runtime kodunda ayrı bir `itemKey`, proje instance `id`si, `catalogKey` veya bağımsız module state yoktur.

Doğrudan runtime tanımının sahibi `src/productionParts.js` dosyasıdır.

---

## 2. Doğrudan runtime referansları

`profile_190` ifadesinin `src/` altındaki doğrudan kullanımları yalnızca iki dosyada bulunur:

```text
src/productionParts.js
src/moduleRecipes.js
```

Yani `scene3d.js`, `designState.js`, `catalog.js`, `projectStore.js`, `main.js` ve UI kodu `profile_190` anahtarını doğrudan okumaz.

Bunun sonucu olarak mevcut sistem iki katmana ayrılır:

```text
production/BOM kimliği
  profile_190

render/state temsili
  module width/type ve procedural geometry
```

Bu iki katman arasında `profile_190` kimliğiyle kurulmuş doğrudan bir runtime bağ yoktur.

---

## 3. Recipe kullanımları

`profile_190`, `src/moduleRecipes.js` içinde toplam **7 recipe** içinde kullanılır.

### 3.1 Düz duvar 200

`src/moduleRecipes.js:13-15`

```js
200: Object.freeze({
  recipeId: 'wall-straight-200',
  moduleType: 'wall',
  nominalWidthCm: 200,
  connectionMode: 'straight',
  items: Object.freeze([
    Object.freeze({ partId: 'profile_190', quantity: 2 }),
    ...
  ])
})
```

Miktar:

```text
profile_190 × 2
```

Resolver yolu:

```text
getStraightWallRecipe(200)
→ STRAIGHT_WALL_RECIPES[200]
→ profile_190 × 2
```

---

### 3.2 Raflı duvar 200 · 2 raf

`src/moduleRecipes.js:29-31`

```text
recipeId = shelf-wall-200-2
moduleType = shelf
nominalWidthCm = 200
shelfCount = 2
profile_190 × 2
```

Resolver:

```text
getModuleRecipe('shelf', 200, { shelfCount: 2 })
→ MODULE_RECIPES['shelf:200:2']
```

---

### 3.3 Raflı duvar 200 · 3 raf

`src/moduleRecipes.js:38-40`

```text
recipeId = shelf-wall-200-3
moduleType = shelf
nominalWidthCm = 200
shelfCount = 3
profile_190 × 2
```

Resolver:

```text
getModuleRecipe('shelf', 200, { shelfCount: 3 })
→ MODULE_RECIPES['shelf:200:3']
```

---

### 3.4 Köşe banko 200 × 200

`src/moduleRecipes.js:64-66`

```text
recipeId = counter-l-200
moduleType = counter
shape = L
nominalWidthCm = 200
profile_190 × 5
```

Resolver:

```text
getModuleRecipe('counter', 200, { shape: 'L' })
→ MODULE_RECIPES['counter-l:200']
```

---

### 3.5 Düz banko 200

`src/moduleRecipes.js:74-76`

```text
recipeId = counter-200
moduleType = counter
nominalWidthCm = 200
profile_190 × 3
```

Resolver:

```text
getModuleRecipe('counter', 200)
→ MODULE_RECIPES['counter:200']
```

---

### 3.6 Panel Bazalı 200

`src/moduleRecipes.js:84-86`

```text
recipeId = base-wall-200
moduleType = base-wall
nominalWidthCm = 200
profile_190 × 4
```

Resolver:

```text
getModuleRecipe('base-wall', 200)
→ MODULE_RECIPES['base-wall:200']
```

---

### 3.7 Baza 200

`src/moduleRecipes.js:94-96`

```text
recipeId = base-200
moduleType = base
nominalWidthCm = 200
profile_190 × 4
```

Resolver:

```text
getModuleRecipe('base', 200)
→ MODULE_RECIPES['base:200']
```

---

## 4. Recipe → production part çözümleme zinciri

Ana resolver'lar:

`src/moduleRecipes.js:99-130`

```js
export function getStraightWallRecipe(nominalWidthCm) {
  return STRAIGHT_WALL_RECIPES[nominalWidthCm] ?? null;
}

export function getModuleRecipe(moduleType, nominalWidthCm, options = {}) {
  if (moduleType === 'wall' || moduleType === 'flat-panel') {
    return getStraightWallRecipe(nominalWidthCm);
  }
  if (moduleType === 'shelf') {
    const shelfCount = Number(options.shelfCount);
    return MODULE_RECIPES[`shelf:${nominalWidthCm}:${shelfCount}`] ?? null;
  }
  if (moduleType === 'counter' && options.shape === 'L') {
    return MODULE_RECIPES[`counter-l:${nominalWidthCm}`] ?? null;
  }
  return MODULE_RECIPES[`${moduleType}:${nominalWidthCm}`] ?? null;
}

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

export function getExpandedModuleRecipe(moduleType, nominalWidthCm, options = {}) {
  return expandRecipe(getModuleRecipe(moduleType, nominalWidthCm, options));
}
```

`profile_190` için çözümleme:

```text
module type + width + options
        ↓
getModuleRecipe(...)
        ↓
recipe item
{ partId: 'profile_190', quantity: N }
        ↓
expandRecipe(...)
        ↓
getProductionPart('profile_190')
        ↓
PRODUCTION_PARTS.profile_190
        ↓
{
  partId: 'profile_190',
  name: 'Profil 190 cm',
  type: 'profile',
  unit: 'adet',
  dimensions: { lengthCm: 190 }
}
```

Burada recipe miktarının sahibi `src/moduleRecipes.js`, production parça metadata'sının sahibi `src/productionParts.js` dosyasıdır.

---

## 5. `profile_190` kullanan katalog modülleri

Recipe zinciriyle eşleşen mevcut katalog kayıtları:

`src/catalog.js:119,127-128,209-210,213,216`

```text
wall_200
  type = flat-panel
  widthCm = 200

wall_shelf_2_200
  type = shelf
  widthCm = 200
  shelfCount = 2

wall_shelf_3_200
  type = shelf
  widthCm = 200
  shelfCount = 3

desk_banko_200
  type = counter
  widthCm = 200
  depthCm = 50
  heightCm = 100

desk_banko_200_L
  type = counter
  shape = L
  widthCm = 200
  depthCm = 200
  heightCm = 100

BASE_200
  type = base
  widthCm = 200
  depthCm = 50
  heightCm = 50

wall_base_200
  type = base-wall
  widthCm = 200
  depthCm = 50
  heightCm = 350
```

Bu katalog kayıtlarının hiçbirinde `profile_190` alanı yoktur.

Katalog yalnız module descriptor üretir; BOM parçası ilişkisi daha sonra recipe lookup ile kurulur.

---

## 6. Module contract tarafındaki BOM sahipliği

`src/moduleContracts.js:4-7`

```js
const RECIPE_BOM_POLICY = Object.freeze({
  mode: 'recipe',
  source: 'src/moduleRecipes.js',
});
```

`profile_190` kullanan ilgili katalog modüllerinin tamamı bu BOM policy'yi kullanır:

`src/moduleContracts.js:94,107,110,114,119,122,125`

```text
wall_200             → RECIPE_BOM_POLICY
wall_shelf_3_200     → RECIPE_BOM_POLICY
wall_shelf_2_200     → RECIPE_BOM_POLICY
wall_base_200        → RECIPE_BOM_POLICY
desk_banko_200       → RECIPE_BOM_POLICY
desk_banko_200_L     → RECIPE_BOM_POLICY
BASE_200             → RECIPE_BOM_POLICY
```

Mevcut sistemde BOM kompozisyonunun belirtilmiş source'u:

```text
src/moduleRecipes.js
```

`profile_190` ise module contract değildir; recipe içinde kullanılan production `partId`dir.

---

## 7. State tarafı

`profile_190` proje state'ine bağımsız kayıt olarak girmez.

İlgili module state factory'leri:

`src/designState.js`

```text
createFlatPanelModuleState(widthCm)       : 35-45
createShelfModuleState(widthCm, count)    : 74-90
createCounterModuleState(widthCm, ...)    : 109-127
createBaseWallModuleState(widthCm)        : 129-149
createBaseModuleState(widthCm)            : 151-167
```

Bu state'lerde kullanılan gerçek alanlar örneğin:

```text
id
type
widthCm
depthCm
heightCm
shape
shelfCount
strips
faces
catalogKey   // descriptor çözümünden sonra eklenebilir
placement    // placement akışında eklenebilir
```

Ama şu alan yoktur:

```text
profile_190
partId = profile_190
productionParts
```

`createModuleStateFromDescriptor()`:

`src/designState.js:357-378`

factory ile module state'i oluşturur ve uygun olduğunda `catalogKey` ekler. Production recipe veya `profile_190` state'e kopyalanmaz.

Dolayısıyla mevcut sistemde ayrı bir `profile_190` runtime instance state'i yoktur.

---

## 8. Persistence tarafı

`profile_190` bağımsız olarak persist edilmez.

Proje snapshot'ı:

`src/main.js:1257-1265`

```js
function buildProjectSnapshot() {
  return {
    id: activeProjectId,
    name: ...,
    version: 1,
    createdAt: activeProjectCreatedAt,
    stand: cloneProjectState(currentStand),
    modules: cloneProjectState(currentModules),
  };
}
```

Kalıcı kayıt:

`src/projectStore.js:39-57`

```text
saveProject(project)
→ IndexedDB projects store
```

Restore:

`src/main.js:1320-1332`

```text
project.modules
→ currentModules
→ resolveModuleCatalogKey(moduleState)
→ catalogKey restore/normalize
```

ZIP export da aynı proje snapshot'ını `project.json` içine koyar:

`src/main.js:1843-1848`

Sonuç:

```text
persist edilen = module state
persist edilmeyen = profile_190 production part instance'ı
```

BOM gerektiğinde module type/width/options üzerinden recipe tekrar çözülür.

---

## 9. Browser/UI tüketimi — Raw BOM Debug

Production recipe sisteminin doğrudan browser tüketicisi:

`src/rawBomDebug.js`

Import:

`src/rawBomDebug.js:1`

```js
import { getExpandedModuleRecipe } from './moduleRecipes.js';
```

Asıl çağrı:

`src/rawBomDebug.js:35-36`

```js
function renderRecipe(moduleType, widthCm, label, options = {}) {
  const recipe = getExpandedModuleRecipe(moduleType, widthCm, options);
```

Listeleme:

`src/rawBomDebug.js:50-53`

```js
recipe.items.forEach((item) => {
  const li = document.createElement('li');
  li.textContent = `${formatNumber(item.quantity)} × ${item.part?.name ?? item.partId}`;
});
```

Bu nedenle uygun 200 cm recipe seçildiğinde UI şu tür satırlar üretebilir:

```text
2 × Profil 190 cm
3 × Profil 190 cm
4 × Profil 190 cm
```

recipe'ye göre miktar değişir.

### UI'dan recipe seçimi

`rawBomDebug.js`, module state'i doğrudan okumaz. `#selection-info` DOM metnini regex ile parse eder.

İlgili yollar:

```text
Raf 200 cm · 2/3 raflı
→ renderRecipe('shelf', 200, ..., { shelfCount })

Banko 200 cm
→ renderRecipe('counter', 200, ...)

Panel Bazalı 200
→ renderRecipe('base-wall', 200, ...)

Baza 200 cm
→ renderRecipe('base', 200, ...)

normal 200 cm düz duvar selection metni
→ renderRecipe('wall', 200, ...)
```

Kaynak:

`src/rawBomDebug.js:68-73,97-115,118-130`

### Köşe banko 200 × 200 için mevcut ayrım

`src/rawBomDebug.js:91-95` içinde özel köşe banko regex'i yalnız şunu tanır:

```js
/Köşe\s+Banko\s+100[×x]100/i
```

Buna karşılık gerçek selection feedback L bankolar için genişliği dinamik üretir:

`src/selectionFeedback.js:24-27`

```text
Köşe Banko <widthCm>×<depthCm>
```

Dolayısıyla `counter-l:200` recipe kodda vardır ve programatik olarak çözülebilir; fakat mevcut Raw BOM Debug selection parser'ında `Köşe Banko 200×200` için açık bir eşleşme yolu yoktur.

Bu rapor bunu düzeltmez; yalnız mevcut davranışı kaydeder.

---

## 10. Renderer tarafı `profile_190` kimliğini kullanmıyor

`src/scene3d.js` dosyasında `profile_190` metni hiç geçmez.

Renderer production part tanımını veya module recipe'yi import etmez.

Profil benzeri procedural geometri şu ayrı sabitlerden türetilir:

`src/scene3d.js:35-39`

```js
const FRAME_COLOR = ALUMINUM_PROFILE_COLOR;
const PANEL_RAIL_HEIGHT_M = 0.004;
const PANEL_VERTICAL_PROFILE_WIDTH_M = 0.040;
```

Global module geometrisi:

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

Yani renderer'daki metal profil/rail mesh'leri `profile_190` partId'sini taşımaz.

---

## 11. Düz duvar 200 render zinciri

Katalog:

```text
wall_200
→ type = flat-panel
→ widthCm = 200
```

State:

```text
createFlatPanelModuleState(200)
→ type = flat-panel
→ widthCm = 200
→ strips[0..6]
```

Dispatch:

`src/scene3d.js:1489-1490`

```js
if (moduleState.type === 'flat-panel') {
  return createFlatPanelModule(...);
}
```

Horizontal rail üretimi:

`src/scene3d.js:6546-6559`

```js
const railGeometry = new THREE.BoxGeometry(
  Math.max(widthM - PANEL_VERTICAL_PROFILE_WIDTH_M * 2, 0.02),
  railHeight,
  frameDepth,
);

for (const y of [0, stripCount * stripHeight]) {
  const rail = new THREE.Mesh(...);
  group.add(rail);
}
```

200 cm module için bu geometri hesabı:

```text
widthM = 2.00 m
vertical profile width = 0.04 m × 2
rail render length = 1.92 m = 192 cm
rail count = 2
```

BOM recipe ise:

```text
profile_190 × 2
lengthCm = 190
```

Dolayısıyla adet sayısı iki tarafta 2 olsa da render rail uzunluğu `192 cm`, production parça metadata'sı `190 cm`dir.

Kodda bu iki temsil arasında identity veya ölçü resolver bağı yoktur.

---

## 12. Raflı duvar 200 render zinciri

Shelf renderer:

`src/scene3d.js:6393-6400`

```text
createShelfModule(...)
→ createFlatPanelModule(...)
```

Bu nedenle duvar gövdesi düz panel renderer'ındaki iki horizontal rail'i üretir.

Ayrıca her raf için ayrı ön profil mesh'i oluşturulur:

`src/scene3d.js:6438-6448`

```js
const frontProfile = new THREE.Mesh(
  new THREE.BoxGeometry(innerWidthM, 0.025, 0.025),
  frameMaterial.clone(),
);
```

200 cm shelf için:

```text
innerWidthM = 2.00 - (0.04 × 2) - 0.012
            = 1.908 m
            = 190.8 cm
```

Recipe ise hem 2 raflı hem 3 raflı varyantta:

```text
profile_190 × 2
```

Rafların önündeki procedural `frontProfile` mesh'leri `profile_190` olarak etiketlenmez ve recipe'deki iki adet production profile ile doğrudan ilişkilendirilmez.

---

## 13. Düz banko 200 render zinciri

State:

```text
createCounterModuleState(200)
→ type = counter
→ shape = straight
→ widthCm = 200
→ depthCm = 50
→ heightCm = 100
```

Dispatch:

`src/scene3d.js:1447-1448`

```text
counter
→ createCounterModule(...)
```

Renderer:

`src/scene3d.js:6131-6211`

Front horizontal rail genişliği:

```text
frontPanelWidthM = widthM - profileM × 2 - 0.012
                 = 2.00 - 0.08 - 0.012
                 = 1.908 m
                 = 190.8 cm
```

Renderer yalnız procedural geometry üretir; mesh üzerinde `partId = profile_190` yoktur.

Recipe:

```text
counter:200
→ profile_190 × 3
```

Renderer'daki hangi mesh'in recipe'deki hangi `profile_190` adedine karşılık geldiğini tanımlayan mevcut bir mapping yoktur.

---

## 14. Köşe banko 200 × 200 render zinciri

State:

```text
createCounterModuleState(200, { shape: 'L', depthCm: 200 })
→ type = counter
→ shape = L
→ widthCm = 200
→ depthCm = 200
```

Renderer dispatch:

`src/scene3d.js:6131-6132`

```text
createCounterModule(...)
→ shape === L
→ createLCounterModule(...)
```

L renderer:

`src/scene3d.js:6309-6347`

200 cm ana ön panel/rail hesabı yine:

```text
frontPanelM = 1.908 m = 190.8 cm
```

Renderer birden fazla X/Z yönlü rail mesh'i procedural olarak üretir. Bunlar `profile_190`, `profile_140_5` veya `profile_41_5` partId'leriyle etiketlenmez.

Recipe ise açıkça:

```text
profile_190   × 5
profile_140_5 × 1
profile_41_5  × 4
```

`test/lCounter200Contract.test.js` içinde de BOM ile renderer geometrisinin ayrı kaldığı açıkça test edilir.

---

## 15. Baza 200 render zinciri

State:

```text
createBaseModuleState(200)
→ type = base
→ widthCm = 200
→ depthCm = 50
→ heightCm = 50
```

Dispatch:

`src/scene3d.js:1444-1445`

```text
base
→ createBaseModule(...)
```

Renderer:

`src/scene3d.js:5969-6046`

Front rail render genişliği:

```text
frontPanelWidthM = widthM - profileM × 2
                 = 2.00 - 0.08
                 = 1.92 m
                 = 192 cm
```

Baza renderer ayrıca side rail'ler ve corner post'lar üretir.

Recipe:

```text
base:200
→ profile_190 × 4
→ profile_41_5 × 4
→ upright_49_5 × 4
...
```

Ancak render mesh'leri production partId taşımadığı için `profile_190 ×4` ile procedural mesh'ler arasında birebir runtime mapping yoktur.

---

## 16. Panel Bazalı 200 render zinciri

State:

```text
createBaseWallModuleState(200)
→ type = base-wall
→ widthCm = 200
→ depthCm = 50
→ heightCm = 350
```

Dispatch:

```text
base-wall
→ createBaseWallModule(...)
```

`src/scene3d.js:1401-1412`

Bu renderer iki ayrı mevcut renderer'ı birleştirir:

```text
wallState.type = flat-panel
→ createFlatPanelModule(...)

baseState.type = base
→ createBaseModule(...)
```

Recipe:

```text
base-wall:200
→ profile_190 × 4
```

Render tarafında ise flat-panel ve base procedural rail geometrileri birleşir. Bunların hiçbirine `profile_190` identity'si verilmez.

---

## 17. Test zinciri

`profile_190` mevcut testlerde ağırlıklı olarak production recipe/BOM seviyesinde korunur.

Başlıca testler:

```text
test/moduleRecipes.test.js
test/baseWallRecipes.test.js
test/counterRecipes.test.js
test/baseRecipes.test.js
test/lCounter200Contract.test.js
```

### Düz duvar ve shelf

`test/moduleRecipes.test.js:54-65`

200 cm straight wall için beklenen profile:

```text
profile_190
quantity = 2
```

`test/moduleRecipes.test.js:107-115`

```text
200 cm · 2 raf
profile_190 = 2
```

`test/moduleRecipes.test.js:140-148`

```text
200 cm · 3 raf
profile_190 = 2
```

Aynı test dosyası expanded recipe'de production metadata'nın çözüldüğünü de kontrol eder:

```text
Profil 190 cm
```

### Panel Bazalı

`test/baseWallRecipes.test.js:6-18`

200 cm için:

```text
profile = profile_190
quantity = 4
```

### Düz banko

`test/counterRecipes.test.js:40-47`

```text
counter 200
profile_190 = 3
```

### Baza

`test/baseRecipes.test.js:25-38`

```text
base 200
profilePartId = profile_190
quantity = 4
```

### Köşe banko 200 × 200

`test/lCounter200Contract.test.js:33-41`

```text
counter-l-200
profile_190 = 5
```

Test adı da mevcut ayrımı açıkça ifade eder:

```text
200 L counter BOM remains separate from renderer geometry
```

### Bu analiz sırasında çalıştırılan hedefli testler

Aşağıdaki test dosyaları lokalde çalıştırıldı:

```text
test/moduleRecipes.test.js
test/baseWallRecipes.test.js
test/counterRecipes.test.js
test/baseRecipes.test.js
test/lCounter200Contract.test.js
```

Sonuç:

```text
33 test
33 pass
0 fail
```

Bu test çalıştırması kaynak dosyalarda değişiklik yapmadı.

---

## 18. Ownership / source-of-truth özeti

Mevcut kodda sorumluluklar şu şekilde dağılmıştır:

```text
profile_190 kimliği + metadata
→ src/productionParts.js

profile_190 hangi recipe'de kaç adet
→ src/moduleRecipes.js

module BOM source bildirimi
→ src/moduleContracts.js
  source = src/moduleRecipes.js

module katalog kimliği / ölçüsü
→ src/catalog.js

proje module state'i
→ src/designState.js

module state persistence
→ src/main.js + src/projectStore.js

profil benzeri görsel geometri
→ src/scene3d.js

Raw BOM debug gösterimi
→ src/rawBomDebug.js
```

`profile_190` için tek bir birleşik runtime entity yoktur.

---

# Mevcut zincirin özeti

```text
                         CATALOG / MODULE STATE
                                  │
                 ┌────────────────┴────────────────┐
                 │                                 │
                 ▼                                 ▼
           BOM / PRODUCTION                    RENDER
                 │                                 │
        moduleRecipes.js                    designState.js
                 │                                 │
      profile_190 × N                      type + widthCm
                 │                                 │
                 ▼                                 ▼
      productionParts.js                    scene3d.js
                 │                                 │
      partId = profile_190             procedural rail/profile mesh
      lengthCm = 190                         │
      unit = adet                            │
                 │                           │
                 ▼                           ▼
        rawBomDebug.js               profile_190 identity yok
                 │
                 ▼
       "N × Profil 190 cm"
```

## En kritik mevcut durum

`profile_190` bugün mevcut runtime kodunda **production/BOM `partId` kimliğidir**.

Şu anda:

```text
partId olarak var
productionParts metadata'sı var
7 recipe içinde kullanılıyor
recipe quantity'leri var
Raw BOM debug üzerinden bazı module seçimlerinde görüntülenebiliyor

bağımsız module state değil
project state içinde ayrı instance değil
catalogKey değil
renderer identity'si değil
mesh identity'si değil
persistence entity'si değil
```

Özellikle production/BOM tanımı ile procedural render geometrisi birbirinden bağımsızdır.

Production tarafı:

```text
profile_190
length = 190 cm
unit = adet
```

Renderer tarafında 200 cm modüllerde profile benzeyen yatay mesh uzunlukları akışa göre örneğin:

```text
192 cm
190.8 cm
```

olarak hesaplanır ve bu mesh'ler `profile_190` partId'siyle işaretlenmez.

Ayrıca `counter-l:200` recipe mevcut olmasına rağmen Raw BOM Debug parser'ı köşe banko için yalnız `100×100` özel regex'i taşıdığı için `Köşe Banko 200×200` selection metni için doğrudan debug recipe yolu mevcut görünmemektedir.

**Kod zinciri burada bitiyor. Herhangi bir entegrasyon, refactor veya hedef mimari tasarımı yapılmadı.**
