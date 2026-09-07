`panel_corner_42_5` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik

`src/productionParts.js:16`:

```text
partId = panel_corner_42_5
name = İç Köşe Paneli 42,5 × 47 cm
type = panel
unit = adet
dimensions = 42.5 × 47 × 0.8 cm
panelRole = inner-corner
nominalModuleWidthCm = 50
```

Lookup `src/productionParts.js:52-54` içindeki `getProductionPart(partId)` ile yapılır. Standalone catalog girdisi, project-state instance'ı veya ayrı runtime module type mevcut kodda yoktur.

# 2. Recipe referansı

`panel_corner_42_5` normal `recipe.items` satırı değildir. Yalnız `wall-straight-50` recipe'sinde variant metadata olarak geçer:

`src/moduleRecipes.js:4-6`

```text
wall-straight-50
items → profile_41_5, upright_346_5, panel_48_5, connector_start, connector_single
variants.innerCornerPanelPartId = panel_corner_42_5
```

İlgili catalog anahtarı `wall_50`'dir.

# 3. Resolver / lookup

`getStraightWallRecipe(50)` / `getModuleRecipe('wall'|'flat-panel',50)` recipe'yi döndürür. Ancak `expandRecipe()` (`src/moduleRecipes.js:119-122`) yalnız `recipe.items` listesini genişletir; `variants.innerCornerPanelPartId` için `getProductionPart()` çağırmaz.

Bu nedenle:

```text
recipe.variants.innerCornerPanelPartId = panel_corner_42_5
→ recipe metadata olarak kalır
→ expanded.items içine girmez
```

# 4. State / renderer

`src/designState.js:35-45` wall state'i yalnız generic 7 `strips` taşır; `panel_corner_42_5` partId yoktur.

`src/scene3d.js` productionParts/moduleRecipes import etmez (`1-33`). `createFlatPanelModule()` (`6511+`) module `widthCm` ve generic strip state'inden procedural geometri üretir. `innerCornerPanelPartId` alanını renderer/placement/state tarafında tüketen bir `src/` kod noktası bulunmadı.

# 5. BOM / UI runtime tüketimi

`src/rawBomDebug.js:35-55` yalnız `recipe.items` satırlarını render eder. `variants` veya `innerCornerPanelPartId` okuması yoktur.

Dolayısıyla mevcut runtime zinciri:

```text
wall 50 recipe variant metadata
→ panel_corner_42_5 referansı mevcut
→ placement'a göre panel_48_5'i değiştiren BOM resolver yok
→ Raw BOM terminal satırı olarak çıkmıyor
```

# 6. Persistence

`currentModules` snapshot/restore edilir (`src/main.js:1263-1264,1326+`), ancak state'te `panel_corner_42_5` production instance'ı bulunmadığından persistence'a ayrı instance yazılmaz.

# 7. Ownership

Production metadata sahibi `src/productionParts.js`; recipe variant metadata sahibi `src/moduleRecipes.js`; recipe BOM policy `src/moduleContracts.js:4-7`. Renderer ayrı `src/scene3d.js` sistemidir.

# 8. Testler

- `test/moduleRecipes.test.js:41-52` wall50 `variants.innerCornerPanelPartId = panel_corner_42_5` doğrular.
- `test/moduleRecipes.test.js:20-27` production panel genişlik listesinde 42.5 cm bulunduğunu doğrular.

Çalıştırılan ortak hedefli set: **49 test / 49 pass / 0 fail**.

# 9. Sonuç

```text
production partId                  EVET
production metadata                EVET
normal recipe items kalemi         HAYIR
recipe variant metadata            EVET
variant runtime BOM substitution   HAYIR
standalone catalog item            HAYIR
project-state production instance  HAYIR
render mesh partId identity        HAYIR
persistence production instance    HAYIR
Raw BOM terminal satırı            HAYIR
```

`panel_corner_42_5` bugün production registry + recipe variant metadata seviyesinde vardır; mevcut runtime'da otomatik inner-corner BOM substitution tüketicisi yoktur.

**Kod zinciri burada bitiyor.**