`upright_49_5` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Mevcut gerçek kimlik ve tanım

Kaynak: `src/productionParts.js:4`

```js
upright_49_5: Object.freeze({
  partId: 'upright_49_5',
  name: 'Dikme 49,5 cm',
  type: 'upright',
  unit: 'adet',
  dimensions: Object.freeze({ lengthCm: 49.5, thicknessCm: 8 })
}),
```

Lookup `src/productionParts.js:52-54` içindeki `getProductionPart(partId)` ile yapılır. Bugünkü gerçek kimlik `partId = upright_49_5`'dir.

Bağımsız `MODULE_CATALOG` girdisi, proje instance `id`'si veya ayrı runtime module `type` mevcut kodda yoktur.

# 2. Doğrudan recipe kullanımları

`src/` altında exact `upright_49_5` iki dosyada geçer:

```text
src/productionParts.js
src/moduleRecipes.js
```

`src/moduleRecipes.js` içinde 6 recipe kullanır:

| Recipe | Satır | Miktar |
|---|---:|---:|
| `base-wall-100` | 78-80 | 2 |
| `base-wall-150` | 81-83 | 2 |
| `base-wall-200` | 84-86 | 2 |
| `base-100` | 88-90 | 4 |
| `base-150` | 91-93 | 4 |
| `base-200` | 94-96 | 4 |

# 3. Catalog → resolver → recipe

Katalog girdileri `src/catalog.js:211-216`:

```text
BASE_100/150/200      → type=base, heightCm=50
wall_base_100/150/200 → type=base-wall, heightCm=350, depthCm=50
```

`getModuleRecipe()` `src/moduleRecipes.js:107-116` bu aileler için fallback key üretir:

```text
base + width      → MODULE_RECIPES['base:<width>']
base-wall + width → MODULE_RECIPES['base-wall:<width>']
```

Sonra `expandRecipe()` `src/moduleRecipes.js:119-122` her recipe item'ını `getProductionPart(item.partId)` ile production metadata'ya bağlar.

Tam zincir:

```text
BASE_* / wall_base_* catalogKey
→ module type + width
→ getModuleRecipe(...)
→ upright_49_5 × 4 veya × 2
→ expandRecipe()
→ getProductionPart('upright_49_5')
→ Dikme 49,5 cm
```

# 4. State

`createBaseWallModuleState()` `src/designState.js:129-148`:

```text
id
type = base-wall
widthCm
depthCm = 50
heightCm = 350
strips
faces
```

`createBaseModuleState()` `src/designState.js:151-166`:

```text
id
type = base
widthCm
depthCm = 50
heightCm = 50
faces
```

`createModuleStateFromDescriptor()` `src/designState.js:357-378` module seviyesinde `catalogKey` resolve eder.

Bu state'lerin hiçbirinde `upright_49_5` `partId`'si, production parça instance'ı, `lengthCm=49.5` veya `thicknessCm=8` yoktur.

# 5. Renderer tarafı ayrı temsil

`src/scene3d.js` production part registry veya module recipe dosyasını tüketmez; `upright_49_5` identity'si renderer'da yoktur.

Baza renderer'ı `createBaseModule()` `src/scene3d.js:5969-6128`:

```js
const heightCm = Number(moduleState.heightCm) || 50;
const topThicknessM = 0.035;
const frameHeightM = Math.max(heightM - topThicknessM, profileM * 3);
```

50 cm baza için procedural post yüksekliği yaklaşık:

```text
50 - 3.5 = 46.5 cm
```

`src/scene3d.js:6015-6027` dört corner post mesh'i üretir.

Production tanımı ise:

```text
upright_49_5 = 49.5 cm
thicknessCm = 8
```

Dolayısıyla `BASE_*` BOM'unda `upright_49_5 ×4` ile renderer'daki dört post sayısal olarak aynı sayıda görünse de renderer post uzunluğu production metadata'dan alınmaz ve mesh'lerde partId yoktur.

`base-wall` renderer `src/scene3d.js:1401-1412` içinde `createFlatPanelModule(...) + createBaseModule(...)` bileşimidir. Recipe tarafında `upright_49_5 ×2` bulunmasına rağmen alt `createBaseModule()` procedural olarak dört corner post oluşturur. Bu, production BOM ile render geometrisinin doğrudan bire bir identity eşlemesi olmadığını açıkça gösterir.

# 6. UI / Raw BOM

`src/selectionFeedback.js:30-44` base-wall ve base seçim etiketlerini module type/width üzerinden üretir; `upright_49_5` UI selection identity'si olarak kullanılmaz.

`src/rawBomDebug.js:104-115` hem `Panel Bazalı 100/150/200` hem `Baza 100/150/200` seçimlerini parse edip `getExpandedModuleRecipe()` çağırır. `renderRecipe()` `src/rawBomDebug.js:35-56` ile:

```text
Panel Bazalı → 2 × Dikme 49,5 cm
Baza         → 4 × Dikme 49,5 cm
```

gösterilebilir.

# 7. Persistence

`src/main.js:1257-1265` snapshot'a module state'lerini klonlar; `src/main.js:1320-1331` restore eder ve module `catalogKey`'ini yeniden resolve eder. `src/projectStore.js:39-56` tüm project nesnesini IndexedDB'ye yazar.

Base/base-wall state içinde production `partId` bulunmadığından `upright_49_5` ayrı persistence entity/instance olarak saklanmaz.

# 8. BOM ownership / source-of-truth

`src/moduleContracts.js:4-7` recipe BOM kaynağını `src/moduleRecipes.js` olarak tanımlar. İlgili catalog key'ler `src/moduleContracts.js:114-116,125-127` altında `RECIPE_BOM_POLICY` kullanır.

Mevcut sahiplik:

```text
metadata        → src/productionParts.js
recipe/adet     → src/moduleRecipes.js
BOM policy      → src/moduleContracts.js
render geometry → src/scene3d.js
state           → src/designState.js
persistence     → src/main.js + src/projectStore.js
```

`src/systemChangeContract.js:114-122` `moduleRecipes.js` ve `productionParts.js` dosyalarını BOM domain'inde; `rawBomDebug.js` dosyasını BOM + UI domain'inde sınıflandırır.

# 9. Testler

Doğrudan test noktaları:

```text
test/baseRecipes.test.js
test/baseWallRecipes.test.js
```

- `test/baseRecipes.test.js:7-8`: production length 49.5 cm.
- `test/baseRecipes.test.js:32-45`: BASE 100/150/200 → `upright_49_5 ×4`.
- `test/baseRecipes.test.js:48-51`: expanded recipe `Dikme 49,5 cm` adını resolve eder.
- `test/baseWallRecipes.test.js:12-29`: wall_base 100/150/200 → `upright_49_5 ×2`, ayrıca tüm recipe item'larının production part'a resolve olduğunu kontrol eder.

Bu çalışma sırasında ortak hedefli test seti çalıştırıldı ve sonuç `49 test / 49 pass / 0 fail` oldu.

# 10. Sonuç

```text
partId olarak var                       EVET
production metadata olarak var          EVET
recipe BOM kalemi olarak var             EVET (6 recipe)
standalone MODULE_CATALOG girdisi        HAYIR
ayrı project-state entity/instance       HAYIR
render mesh partId identity              HAYIR
persistence upright_49_5 instance        HAYIR
UI selection identity upright_49_5       HAYIR
renderer productionParts tüketimi        HAYIR
renderer moduleRecipes tüketimi          HAYIR
```

`upright_49_5` mevcut sistemde production/BOM parçasıdır. Base ve base-wall render tarafında kısa dikme işlevine benzeyen procedural post geometrileri vardır; ancak bunların production `partId`/ölçüsüyle doğrudan kod bağı mevcut runtime kodunda yoktur.

**Kod zinciri burada bitiyor. Hedef mimari veya entegrasyon tasarımı yapılmadı.**
