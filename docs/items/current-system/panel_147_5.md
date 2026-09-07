`panel_147_5` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Gerçek kimlik

`src/productionParts.js:13`:

```text
partId = panel_147_5
name = Panel 147,5 × 47 cm
type = panel
unit = adet
dimensions = 147.5 × 47 × 0.8 cm
panelRole = straight
nominalModuleWidthCm = 150
```

Lookup `src/productionParts.js:52-54` içindeki `getProductionPart(partId)` ile yapılır. Standalone catalog girdisi veya project-state instance kimliği mevcut runtime kodunda yoktur.

# 2. Recipe kullanımları

`panel_147_5` normal BOM `items` kalemi olarak 7 recipe'de kullanılır:

| Recipe | Miktar | Kaynak |
|---|---:|---|
| `wall-straight-150` | 7 | `src/moduleRecipes.js:10-12` |
| `shelf-wall-150-2` | 7 | `26-28` |
| `shelf-wall-150-3` | 7 | `35-37` |
| `counter-l-150` | 4 | `60-62` |
| `counter-150` | 2 | `71-73` |
| `base-wall-150` | 7 | `81-83` |
| `base-150` | 2 | `91-93` |

İlgili catalog anahtarları: `wall_150`, `wall_shelf_2_150`, `wall_shelf_3_150`, `desk_banko_150_L`, `desk_banko_150`, `wall_base_150`, `BASE_150`.

# 3. Resolver / lookup

`src/moduleRecipes.js:107-116` module type/genişlik/options ile recipe seçer. `119-130` `recipe.items` içindeki `partId` değerlerini `getProductionPart()` ile genişletir.

```text
module type + width 150
→ getModuleRecipe(...)
→ { partId:'panel_147_5', quantity:N }
→ expandRecipe()
→ getProductionPart('panel_147_5')
```

# 4. State

`src/designState.js:35-167` ilgili modüllerde generic `strips` ve `faces` kullanır. `panel_147_5` production partId state'e yazılmaz.

# 5. Renderer

`src/scene3d.js` productionParts/moduleRecipes import etmez (`1-33`). Wall/shelf `createFlatPanelModule()` (`6511+`), counter/L-counter `createCounterModule()` / `createLCounterModule()` (`6131-6390`), base/base-wall procedural geometri üretir. Production `147.5 × 47 × 0.8 cm` ölçüsü renderer tarafından okunmaz ve mesh `userData` içinde `panel_147_5` yoktur.

# 6. BOM / UI

`src/rawBomDebug.js:35-55` expanded recipe items'ı ekrana basar. `58-131` selection metnini parse eder. Wall150, shelf150, straight counter150, base-wall150 ve base150 desteklenen akışlarda `panel_147_5` production adıyla Raw BOM'a gelir.

L150 recipe kodda vardır; ancak `rawBomDebug.js:91-95` özel L-counter parser yalnız 100×100'ü yakalar. Bu nedenle L150 recipe doğrudan bu özel UI branch'inden tüketilmez.

# 7. Persistence

`src/main.js:1263-1264,1326+` module state snapshot/restore yapar; `src/projectStore.js` proje state'ini saklar. State içinde production partId olmadığı için ayrı `panel_147_5` instance'ı persistence'a yazılmaz.

# 8. Ownership

`src/moduleContracts.js:4-7` recipe BOM source olarak `src/moduleRecipes.js` tanımlar.

```text
metadata   → src/productionParts.js
quantity   → src/moduleRecipes.js
BOM policy → src/moduleContracts.js
UI debug   → src/rawBomDebug.js
renderer   → src/scene3d.js (ayrı)
```

# 9. Testler

- `test/moduleRecipes.test.js:54-72` wall150 → `×7`.
- `87-138` shelf150 2/3 raf → `×7`.
- `test/counterRecipes.test.js` counter150 → `×2`.
- `test/lCounter150Contract.test.js:33-40` L150 → `×4` ve BOM/renderer ayrımını doğrular.
- `test/baseWallRecipes.test.js` base-wall150 → `×7`.
- `test/baseRecipes.test.js` base150 → `×2`.

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

State/render tarafı generic module state ve procedural geometry ile ayrı temsil edilir; production identity bağı mevcut runtime kodunda yoktur.

**Kod zinciri burada bitiyor.**