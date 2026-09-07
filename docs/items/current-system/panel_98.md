`panel_98` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Mevcut gerçek kimlik ve tanım

Kaynak: `src/productionParts.js:12`

```text
partId = panel_98
name = Panel 98 × 47 cm
type = panel
unit = adet
dimensions = 98 × 47 × 0.8 cm
panelRole = straight
nominalModuleWidthCm = 100
```

Lookup `src/productionParts.js:52-54`: `getProductionPart(partId) → PRODUCTION_PARTS[partId] ?? null`.

Bu parça için bağımsız `MODULE_CATALOG` girdisi, proje instance `id`'si veya ayrı runtime module `type`'ı mevcut runtime kodunda yoktur.

# 2. Gerçek recipe kullanımları

`panel_98` normal BOM `items` kalemi olarak 10 recipe'de geçer:

| Recipe | Miktar | Kaynak |
|---|---:|---|
| `wall-straight-100` | 7 | `src/moduleRecipes.js:7-9` |
| `door-100` | 3 | `19-21` |
| `shelf-wall-100-2` | 7 | `23-25` |
| `shelf-wall-100-3` | 7 | `32-34` |
| `showcase-2-100` | 5 | `42-44` |
| `showcase-3-100` | 4 | `45-47` |
| `counter-l-100` | 4 | `56-58` |
| `counter-100` | 2 | `68-70` |
| `base-wall-100` | 7 | `78-80` |
| `base-100` | 2 | `88-90` |

# 3. Resolver / lookup zinciri

`src/moduleRecipes.js:107-116` module `type`, nominal genişlik ve options ile recipe seçer. `src/moduleRecipes.js:119-130` `recipe.items` satırlarını `getProductionPart(item.partId)` ile genişletir.

```text
catalog module/type/width/options
→ getModuleRecipe(...)
→ recipe item { partId: 'panel_98', quantity: N }
→ expandRecipe(...)
→ getProductionPart('panel_98')
→ production metadata
```

İlgili catalog anahtarları: `wall_100`, `DOOR_100`, `wall_shelf_2_100`, `wall_shelf_3_100`, `wall_showcase_100_2`, `wall_showcase_100_3`, `desk_banko_100_L`, `desk_banko_100`, `wall_base_100`, `BASE_100`.

# 4. State

`src/designState.js` production panel instance'ı taşımaz. İlgili modüller generic `strips`, `surface` veya editable `faces` kullanır (`createFlatPanelModuleState`, `createDoorModuleState`, `createShelfModuleState`, `createShowcaseModuleState`, `createCounterModuleState`, `createBaseWallModuleState`, `createBaseModuleState`; `src/designState.js:35-167`). `panel_98` `partId`'si state'e yazılmaz.

# 5. Renderer

`src/scene3d.js` `productionParts.js` veya `moduleRecipes.js` import etmez (`src/scene3d.js:1-33`).

- wall/shelf tarafı `createFlatPanelModule()` (`6511-6814`) ile procedural geometri üretir;
- counter `createCounterModule()` / `createLCounterModule()` (`6131-6390`) ile module ölçülerinden yüzey üretir;
- base/base-wall `createBaseModule()` ve `createBaseWallModule()` ile procedural üretilir.

Renderer production `98 × 47 × 0.8 cm` metadata'sını okumaz; mesh/surface `userData` içinde `panel_98` partId bulunmaz.

# 6. BOM / UI runtime tüketimi

`src/rawBomDebug.js:35-55` `getExpandedModuleRecipe()` çağırır ve `recipe.items` satırlarını `quantity × production part name` olarak gösterir. `syncFromSelection()` (`58-131`) selection metninden wall/door/shelf/showcase/counter/base-wall/base recipe'sine gider.

Bu nedenle desteklenen seçimlerde `panel_98`, `Panel 98 × 47 cm` adıyla Raw BOM listesine ulaşır. L100 counter özel branch'i de `src/rawBomDebug.js:91-95` üzerinden desteklenir.

# 7. Persistence

`src/main.js:1263-1264` `currentModules` snapshot'ını saklar; `1326+` restore eder. `src/projectStore.js` proje nesnesini persistence katmanına yazar. Module state içinde `panel_98` instance'ı olmadığı için ayrı production-part instance persistence'a yazılmaz.

# 8. Ownership / source-of-truth

`src/moduleContracts.js:4-7` recipe BOM kaynağını `src/moduleRecipes.js` olarak tanımlar.

```text
production metadata → src/productionParts.js
recipe / quantity   → src/moduleRecipes.js
module BOM policy   → src/moduleContracts.js
browser debug BOM   → src/rawBomDebug.js
renderer            → src/scene3d.js (ayrı procedural sistem)
```

`src/systemChangeContract.js:110-122` bu ayrımı domain seviyesinde de doğrular.

# 9. Testler

Doğrudan/ilgili doğrulamalar:

- `test/moduleRecipes.test.js:54-72` wall 100 → `panel_98 × 7`.
- `74-85` door 100 → `×3`.
- `87-138` shelf 100, 2/3 raf → `×7`.
- `test/showcaseRecipes.test.js` showcase-2 → `×5`, showcase-3 → `×4`.
- `test/counterRecipes.test.js` counter100 → `×2`.
- `test/lCounter100Contract.test.js:10` L100 → `×4`.
- `test/baseWallRecipes.test.js` base-wall100 → `×7`.
- `test/baseRecipes.test.js` base100 → `×2`.

Çalıştırılan ortak hedefli set: **49 test / 49 pass / 0 fail**.

# 10. Sonuç

```text
production partId                 EVET
production metadata               EVET
recipe BOM kalemi                 EVET
standalone catalog item           HAYIR
project-state production instance HAYIR
render mesh partId identity       HAYIR
persistence production instance   HAYIR
Raw BOM tüketimi                  EVET (desteklenen seçimlerde)
```

`panel_98` production/BOM tarafında aktif bir partId'dir. State/render/persistence tarafında aynı fiziksel kavram production identity taşımadan generic module state ve procedural geometry ile temsil edilir.

**Kod zinciri burada bitiyor. Entegrasyon veya hedef mimari tasarımı yapılmadı.**