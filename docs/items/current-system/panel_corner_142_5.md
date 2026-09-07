`panel_corner_142_5` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik

`src/productionParts.js:18`:

```text
partId = panel_corner_142_5
name = İç Köşe Paneli 142,5 × 47 cm
type = panel
unit = adet
dimensions = 142.5 × 47 × 0.8 cm
panelRole = inner-corner
nominalModuleWidthCm = 150
```

Lookup `src/productionParts.js:52-54` içindeki `getProductionPart(partId)` ile yapılır. Standalone catalog girdisi veya project-state production instance mevcut runtime kodunda yoktur.

# 2. Gerçek recipe referansları

`panel_corner_142_5` normal `recipe.items` kalemi değildir; 4 recipe'de `variants.innerCornerPanelPartId` olarak geçer:

| Recipe | Kaynak |
|---|---|
| `wall-straight-150` | `src/moduleRecipes.js:10-12` |
| `shelf-wall-150-2` | `26-28` |
| `shelf-wall-150-3` | `35-37` |
| `base-wall-150` | `81-83` |

İlgili catalog anahtarları: `wall_150`, `wall_shelf_2_150`, `wall_shelf_3_150`, `wall_base_150`.

# 3. Resolver / lookup davranışı

`getModuleRecipe()` `src/moduleRecipes.js:107-116` recipe'yi seçer. `expandRecipe()` `119-122` yalnız `recipe.items` elemanlarını production metadata'ya genişletir. `variants.innerCornerPanelPartId` otomatik çözülmez.

```text
variants.innerCornerPanelPartId = panel_corner_142_5
→ recipe metadata olarak mevcut
→ expanded.items içinde yok
→ Raw BOM terminal item'ı değil
```

# 4. State / renderer

`src/designState.js` ilgili wall/shelf/base-wall modüllerinde generic `strips` ve `faces` kullanır; production corner partId state'e yazılmaz.

`src/scene3d.js` productionParts/moduleRecipes import etmez (`1-33`). `createFlatPanelModule()` (`6511+`) ve base-wall composition (`1401+`) module ölçülerinden procedural geometri üretir. `innerCornerPanelPartId` alanını renderer/placement tarafında tüketen kod mevcut runtime kodunda yoktur.

# 5. BOM / UI

`src/rawBomDebug.js:35-55` yalnız `recipe.items` listesini render eder; `variants` okumaz. Placement'a göre normal `panel_147_5` miktarını azaltıp `panel_corner_142_5` ekleyen runtime BOM resolver bulunmadı.

Dolayısıyla production registry + variant metadata vardır, fakat Raw BOM terminal satırı olarak kullanılmaz.

# 6. Persistence

`src/main.js:1263-1264,1326+` generic module state snapshot/restore yapar. `panel_corner_142_5` production instance state'te olmadığı için persistence'a ayrı instance yazılmaz.

# 7. Ownership

```text
production metadata → src/productionParts.js
variant metadata    → src/moduleRecipes.js
BOM policy          → src/moduleContracts.js
Raw BOM UI          → src/rawBomDebug.js (variant tüketmiyor)
renderer            → src/scene3d.js
```

# 8. Testler

- `test/moduleRecipes.test.js:54-70` wall150 corner variant.
- `87-138` shelf150 2/3 raf corner variant.
- `test/baseWallRecipes.test.js:6-29` base-wall150 corner variant.
- `test/moduleRecipes.test.js:20-27` 142.5 cm production panel genişliği doğrulanır.

Çalıştırılan ortak hedefli set: **49 test / 49 pass / 0 fail**.

# 9. Sonuç

```text
production partId                 EVET
production metadata               EVET
normal recipe items kalemi        HAYIR
recipe variant metadata           EVET
variant runtime BOM substitution  HAYIR
standalone catalog item           HAYIR
project-state production instance HAYIR
render mesh partId identity       HAYIR
persistence production instance   HAYIR
Raw BOM terminal satırı           HAYIR
```

**Kod zinciri burada bitiyor.**