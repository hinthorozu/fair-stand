`panel_corner_192` mevcut kod zincirini çıkardım. **Lokal runtime kodunda hiçbir dosyada değişiklik yapmadım.**

Kaynak çalışma ağacı: `/mnt/data/Version2_local`

# 1. Mevcut gerçek kimlik ve tanım

`panel_corner_192` mevcut kodda bir production/BOM `partId` olarak tanımlıdır.

Kaynak: `src/productionParts.js:19`

```js
panel_corner_192: Object.freeze({
  partId: 'panel_corner_192',
  name: 'İç Köşe Paneli 192 × 47 cm',
  type: 'panel',
  unit: 'adet',
  dimensions: Object.freeze({ widthCm: 192, heightCm: 47, thicknessCm: 0.8 }),
  panelRole: 'inner-corner',
  nominalModuleWidthCm: 200
}),
```

Lookup: `src/productionParts.js:52-54`

```js
export function getProductionPart(partId) {
  return PRODUCTION_PARTS[partId] ?? null;
}
```

Bugünkü gerçek kimlik `partId = panel_corner_192`'dir. Metadata sahibi `src/productionParts.js` dosyasıdır.

Mevcut runtime kodunda `panel_corner_192` için bağımsız `catalogKey`, module `id`, module `type` veya project-state instance'ı yoktur.

# 2. Doğrudan runtime referansları

`src/` altında `panel_corner_192` yalnızca iki dosyada doğrudan geçer:

```text
src/productionParts.js
src/moduleRecipes.js
```

`scene3d.js`, `designState.js`, `catalog.js`, `projectStore.js`, `main.js`, `rawBomDebug.js`, `modulePlacement.js` ve `cornerPlacement.js` bu `partId`yi doğrudan kullanmaz.

# 3. Recipe içindeki yeri: item değil variant metadata

`panel_corner_192` normal `recipe.items` listelerinde bulunmaz. Dört 200 cm recipe'nin `variants.innerCornerPanelPartId` alanında bulunur:

| Recipe | Kaynak | Değer |
|---|---|---|
| `wall-straight-200` | `src/moduleRecipes.js:13-15` | `panel_corner_192` |
| `shelf-wall-200-2` | `src/moduleRecipes.js:29-31` | `panel_corner_192` |
| `shelf-wall-200-3` | `src/moduleRecipes.js:38-40` | `panel_corner_192` |
| `base-wall-200` | `src/moduleRecipes.js:84-86` | `panel_corner_192` |

Örnek:

```js
200: Object.freeze({
  recipeId: 'wall-straight-200',
  moduleType: 'wall',
  nominalWidthCm: 200,
  connectionMode: 'straight',
  items: Object.freeze([
    // panel_corner_192 burada yok
  ]),
  variants: Object.freeze({ innerCornerPanelPartId: 'panel_corner_192' })
})
```

Bu nedenle mevcut recipe tanımı `panel_corner_192` için bir miktar (`quantity`) üretmez.

# 4. Resolver / expand davranışı

Recipe lookup `src/moduleRecipes.js` üzerinden yapılır. Bu Item migrationı başlamadan hemen önce ortak `expandRecipe()` zinciri, daha önce migrate edilen Item'lar nedeniyle mixed identity compatibility kullanır:

```js
getRecipeItemKey(item)
  = item?.itemKey ?? item?.partId ?? null

expandRecipe(recipe)
  -> recipe.items
  -> getProductionItem(getRecipeItemKey(item))
```

Bu pre-migration durumda `variants.innerCornerPanelPartId` aynen string metadata olarak kalır; ortak `expandRecipe()` yalnız `recipe.items` satırlarını genişlettiği için bu variant değerini BOM satırına dönüştürmez.

Mevcut `src/` kodunda `recipe.variants.innerCornerPanelPartId` alanını okuyup `panel_corner_192` metadata'sına veya bir BOM satırına dönüştüren başka bir runtime tüketici bulunmadı.

# 5. İlgili katalog modülleri

Variant metadata'sını taşıyan recipe'lere karşılık gelen katalog modülleri:

```text
wall_200
wall_shelf_2_200
wall_shelf_3_200
wall_base_200
```

Katalog tanımları `src/catalog.js:119,127-128,216` içindedir. Bu katalog kayıtlarının hiçbirinde `panel_corner_192` alanı yoktur; ilişki yalnız recipe'nin `variants` metadata'sındadır.

# 6. BOM ownership / source-of-truth

`src/moduleContracts.js:4-7`:

```js
const RECIPE_BOM_POLICY = Object.freeze({
  mode: 'recipe',
  source: 'src/moduleRecipes.js',
});
```

İlgili katalog modülleri `src/moduleContracts.js:94,107,110,114` altında bu policy'yi kullanır.

Mevcut sahiplik ayrımı:

```text
production metadata owner = src/productionParts.js
recipe variant owner       = src/moduleRecipes.js
module BOM policy source   = src/moduleRecipes.js
```

Ancak mevcut BOM akışı `variants.innerCornerPanelPartId` değerini aktif bir BOM kalemine dönüştürmez.

# 7. Browser/UI runtime tüketimi

`src/rawBomDebug.js:35-56`, `getExpandedModuleRecipe()` sonucunun yalnız `recipe.items` listesini render eder:

```js
recipe.items.forEach((item) => {
  const li = document.createElement('li');
  li.textContent = `${formatNumber(item.quantity)} × ${item.part?.name ?? item.partId}`;
});
```

`panel_corner_192` `items` içinde olmadığı için mevcut Raw BOM Debug UI'da otomatik olarak görünmez.

Bu nedenle standart akış:

```text
200 cm module seçimi
→ getExpandedModuleRecipe(...)
→ recipe.items
→ panel_197 vb. normal item'lar
→ Raw BOM UI
```

şeklindedir; `variants.innerCornerPanelPartId = panel_corner_192` bu UI zincirine dahil değildir.

# 8. State ve persistence

İlgili module state'leri `src/designState.js` içinde `type`, `widthCm`, `strips`, `faces`, `shelfCount`, `catalogKey`, `placement` gibi module-level alanlar taşır. `panel_corner_192` veya `innerCornerPanelPartId` state'e kopyalanmaz.

Proje snapshot'ı `src/main.js:1257-1265` içinde `stand` ve `modules` state'lerini saklar; `saveProject()` bunları `src/projectStore.js:39-56` üzerinden IndexedDB'ye yazar.

Sonuç: bağımsız `panel_corner_192` instance'ı persistence'a yazılmaz.

# 9. Renderer ve köşe placement sistemi ayrı

`src/scene3d.js` içinde `panel_corner_192` metni yoktur ve renderer `productionParts.js` / `moduleRecipes.js` üzerinden bu parçayı çözmez.

Ayrıca placement tarafında `src/modulePlacement.js:790-815,964-987` içinde ayrı bir `snapKind = 'corner'` kavramı vardır. Bu, modüllerin geometrik snap ilişkisini tarif eder. `src/modulePlacement.js:1057-1064` bu değeri transient snap sonucu olarak döndürür; `scene3d.js:2582-2586,2923-2927` preview bilgisinde taşır, fakat kalıcı state'e yalnız `placement` yazılır (`scene3d.js:2951-2961`).

Bu `snapKind = 'corner'` ile `panel_corner_192` arasında mevcut kodda mapping veya resolver yoktur.

# 10. Test zinciri

Başlıca mevcut testler:

- `test/moduleRecipes.test.js:54-70` — 200 cm straight-wall variant'ının `panel_corner_192` olduğunu doğrular.
- `test/moduleRecipes.test.js:107-117` — 200 cm 2 raflı recipe variant'ını doğrular.
- `test/moduleRecipes.test.js:140-150` — 200 cm 3 raflı recipe variant'ını doğrular.
- `test/baseWallRecipes.test.js:6-28` — 200 cm base-wall için `panel_corner_192` variant'ını doğrular.
- `test/moduleRecipes.test.js:20-26` — production panel genişlikleri arasında 192 cm kaydının bulunduğunu doğrular.

İlgili hedefli test seti çalıştırıldı: **49 pass / 0 fail**.

# Mevcut zincirin özeti

```text
PRODUCTION_PARTS.panel_corner_192
        │
        └── partId + metadata

200 cm recipe'ler
        │
        └── variants.innerCornerPanelPartId = 'panel_corner_192'
                    │
                    └── aktif runtime tüketici yok

recipe.items → expandRecipe → Raw BOM
                    │
                    └── panel_corner_192 bu listede yok
```

En kritik mevcut durum: **`panel_corner_192` bugün production tanımı ve recipe variant metadata'sı olarak vardır; fakat mevcut runtime kodunda otomatik BOM substitution, ayrı state/persistence entity'si veya renderer identity'si değildir.**