# Catalog

Fair Stand katalog mekanizmasının canonical teknik sözleşmesi. Audit dökümü değildir.

Item tarafındaki Catalog config alanlarının kısa kaydı: `docs/refactor/ITEMS.md`. Bu dosya Catalog’un nasıl çalıştığını anlatır; Item şemasını kopyalamaz.

---

## Amaç

Modül Kataloğu, sahneye sürüklenebilir / eklenebilir Item’ların kullanıcıya gösterilen listesidir.

Katalog yalnız UI organizasyonudur. Placement, collision, BOM, recipe, rotation, color, image veya renderer davranışı tanımlamaz.

**Catalog bir Item runtime repository değildir.**

`catalogVisible=false` yalnız Catalog UI görünürlüğünü etkiler; Item’ın başka mekanizmalardaki varlığını veya kullanılabilirliğini etkilemez.

---

## Domain sınırı

Catalog yalnız şunlardan sorumludur:

- Item katalogda görünsün mü?
- Hangi `catalogCategory` altında görünsün?
- Kategori kaçıncı sırada?
- Item kategori içinde kaçıncı sırada?
- Katalog kartı UI projection’ı nasıl üretilir?

Catalog şunların veri kaynağı değildir: AutoDepot, Item Contract, BOM, Recipe, Placement, runtime Item lookup.

```text
Item master
    ↓
Catalog projection
    ↓
Catalog UI

Item master → AutoDepot
Item master → Module Contract
Item master → Recipe / BOM
```

Yasak:

```text
AutoDepot → Catalog
ModuleContract → Catalog
BOM → Catalog
Recipe → Catalog
Catalog → Recipe
```

Canonical API (`getCatalogItem`, `listCatalogItems`, `listCatalogGroups`, `listCatalogCategories`, `getCatalogCategory`) Catalog/UI içindir.

---

## UI karşılığı

Sol paneldeki **Modül Ekle** düğmesi (`#open-module-catalog`, `index.html`) katalog girişidir. Düğmenin hemen üstüne `createModuleDragSidebar` kart ızgarasını basar.

Bu yüzey “Modül Kataloğu”dur. Sağ tık **Modül Ekle** picker’ı (`renderPickerCatalog`) aynı `listCatalogGroups()` sonucunu kullanır.

---

## Catalog modeli

Canonical kaynak: `src/catalog.js` `CATALOG_CATEGORIES`.

```text
Catalog {
  catalogKey: string
  catalogName: string
  catalogIndex: integer
}
```

### catalogKey

- Stabil kategori kimliği
- Benzersiz
- UI label değildir
- Item.catalogCategory bu değere bağlanır
- Mevcut key’ler önceki turda Item’lara yazılan `catalogCategory` değerleridir; bu turda yeni key uydurulmadı

### catalogName

- Modül Ekle panelinde görünen kategori adı
- Boş olamaz

### catalogIndex

- Kategorilerin yukarıdan aşağıya 1 tabanlı sırası
- 1 = en üst kategori
- Duplicate yok; `1..N` kesintisiz
- `catalogItemIndex` ile karıştırılmaz

`catalogItemIndex` = Item’ın **kendi kategorisi** içindeki sırası.

---

## Item bağlantısı

Catalog UI yalnız Item’ın Catalog config’ini okur.

```text
Item.catalogVisible          → kategoride gösterilsin mi
Item.catalogCategory         → Catalog.catalogKey
Item.catalogItemIndex        → kategori içi 1 tabanlı sıra
Item.catalogPreview          → Catalog kart preview renderer key
Item.name                    → kart label
```

`catalogCategory` görünen label saklamaz. Ad yalnız `catalogName` üzerinden gelir.

**Catalog görünümü Item.type üzerinden belirlenmez.**

**Catalog preview renderer seçimi yalnız Item.catalogPreview üzerinden yapılır.**

`catalogPreview` asset/icon dosya yolu değildir. Mevcut UI CSS/DOM silüet çizer; renderer map anahtarıdır (`CATALOG_PREVIEW_RENDERERS`). `catalogIcon` bu turda yoktur.

Görünür Item’da `catalogPreview` yoksa veya `CATALOG_PREVIEWS` dışında ise projection fail-fast atar. `type` fallback, registry grubu fallback, `itemKey` hardcode map yoktur.

---

## Item master vs Catalog projection

Item master ürünün gerçek özelliğidir (`src/items.js`). Catalog projection Item’dan UI için türetilen görünümdür; ikinci source-of-truth değildir.

**Catalog ölçülerin sahibi değildir.** Catalog yalnız Item’daki physical / effective scene ölçülerini okur. `catalogWidthCm` kaldırıldı.

| Projection alanı | Kaynak |
|---|---|
| `label` | `item.name` |
| `catalogPreview` | `item.catalogPreview` |
| `widthCm` / `depthCm` / `heightCm` | `resolveSceneDimensions(item)` — `sceneDimensions.field ?? dimensions.field`. Catalog ölçü üretmez; Recipe/type/itemKey/catalogWidthCm okumaz. TV kart CSS sabit px silüettir; descriptor `heightCm` canonical resolved height’tir |
| `modelFile` / `variant` / `stripOccupancy` / `eyeCount` / `shape` | Item root, varsa |
| `videoWallRows` / `videoWallCols` | `item.videoWall.rows` / `item.videoWall.cols`, varsa |
| `type` | `item.type` — **Catalog UI preview seçmez.** Yalnız `createModuleStateFromDescriptor` factory uyumu (sahneye sürükleme). |

Yeni görünen Item için `MODULE_CATALOG.my_item = ...` yazılmaz.

---

## Kategoriler

| catalogKey | catalogName | catalogIndex | Item sayısı |
|---|---|---|---|
| `panel-wall` | Panel & Duvar | 1 | 9 |
| `panel-addon` | Panel Ek Modül | 2 | 13 |
| `shelf-showcase` | Raf & Vitrin | 3 | 2 |
| `counter-base` | Banko & Baza | 4 | 9 |
| `extra` | Extra | 5 | 16 |
| `electronics-lighting` | Elektronik & Aydınlatma | 6 | 6 |

Toplam görünür Item: **55**. Kayıtlı Item: **96**.

---

## Sıralama

1. **Kategori sırası** = `Catalog.catalogIndex`
2. **Kategori içi Item sırası** = `Item.catalogItemIndex`

---

## Çalışma akışı

```text
ITEM
  ↓
catalogVisible
catalogCategory
catalogItemIndex
catalogPreview
name
  ↓
Catalog projection  (getCatalogItem / listCatalogItems)
  ↓
Catalog UI  (CATALOG_PREVIEW_RENDERERS[catalogPreview])
```

Kart descriptor’ı Item kaydından türetilir. Hardcoded Item key listesi yoktur.

`MODULE_CATALOG` / `MODULE_CATALOG_GROUPS` / `MODULE_CATALOG_KEYS` derived compatibility export’tur; ikinci source-of-truth değildir.

---

## Canonical API / Method

| Method | Durum |
|---|---|
| `listCatalogCategories()` | mevcut — kategoriler, `catalogIndex` sırası |
| `getCatalogCategory(catalogKey)` | mevcut |
| `getCatalogItem(itemKey)` | mevcut — görünür Item’dan catalog descriptor |
| `listCatalogItems()` | mevcut — `catalogVisible=true` Item projection listesi |
| `listCatalogGroups()` | mevcut — kategori + Item key listesi (`catalogItemIndex` sırası) |

UI okur: `listCatalogGroups()` + `group.catalogName` + `getCatalogItem(itemKey)`.

`resolveItemKey` Item identity helper’dır (`src/items.js`); Catalog üyeliği kontrol etmez. `src/catalog.js` test ve mevcut runtime import uyumu için re-export eder (`src/designState.js`, `src/main.js`). Bu turda `designState.js` frozen state/persistence yüzeyi açılmadı.

Catalog UI yardımcıları: `getModuleCatalogItem`, `getModuleCatalogLabel` — görünür Catalog projection döner. Drag badge (`src/scene3d.js`) katalog kart önizlemesi için bunları okur.

---

## Kesin mimari kurallar

- Katalog üyeliği `type` üzerinden belirlenmez
- Catalog görünümü `Item.type` üzerinden belirlenmez
- Catalog preview renderer seçimi yalnız `Item.catalogPreview` üzerinden yapılır
- `if (item.type === ...)`, `switch(type)`, `type` → CSS/icon/kart tipi Catalog UI’da yasaktır
- Registry grubundan belirlenmez
- Item Contract üzerinden belirlenmez
- `catalogVisible` üyelik, `catalogCategory` grup, `catalogItemIndex` sıra, `catalogPreview` kart silüeti belirler
- `catalogVisible=false` Item’ı AutoDepot / ModuleContract / BOM / renderer / placement’tan silmez
- `catalogCategory` rotation / color / image / collision / renderer / placement belirlemez
- Kategori adı yalnız `catalogName`
- Kategori sırası yalnız `catalogIndex`
- Aynı kategori tanımı ikinci hardcoded listede tutulmaz
- UI kendi başına kategori listesi hardcode etmez

---

## Yeni Item ekleme örneği

Dokümantasyon örneği; bu `itemKey`’ler kayıtlı ürün değildir.

```json
{
  "itemKey": "example_item",
  "catalogVisible": true,
  "catalogCategory": "panel-wall",
  "catalogItemIndex": 3,
  "catalogPreview": "flat-panel"
}
```

```json
{
  "itemKey": "example_child",
  "catalogVisible": false,
  "catalogCategory": null,
  "catalogItemIndex": null
}
```

Yeni görünen Item yalnız Item kaydına yazılır (`catalogVisible=true` + `catalogCategory` + `catalogItemIndex` + `catalogPreview`). `MODULE_CATALOG` satırı eklenmez. `catalogPreview` `CATALOG_PREVIEWS` üyesi olmalıdır.

Yeni kategori gerekirse yalnız `CATALOG_CATEGORIES` içine `catalogKey` / `catalogName` / `catalogIndex` eklenir.

---

## Validation

- Catalog category sayısı: 6
- `catalogKey` benzersiz
- `catalogName` boş: 0
- `catalogIndex` null: 0
- duplicate `catalogIndex`: 0
- `catalogIndex` 1..N kesintisiz
- `catalogVisible=true` ve geçersiz `catalogCategory`: 0
- catalog projection Item: 55
- `catalogVisible=true` ve `catalogPreview` yok/bilinmiyor: fail-fast
- hardcoded katalog Item key listesi: 0
- Catalog UI preview `type` branch: 0
- `catalogVisible=false` → category/index null
- `catalogVisible=false` → `getCatalogItem` null; `getItem` dolu
- Aynı kategoride duplicate `catalogItemIndex` yasak
- Catalog Recipe import etmez
- Catalog ölçülerin sahibi değildir; physical / effective scene ölçülerini Item’dan okur
- AutoDepot / moduleContracts Catalog import etmez

---

## Testler

| Test | Ne doğrular |
|---|---|
| `test/catalogItemProjection.test.js` | 55/55 Item-driven projection, eski descriptor regression |
| `test/catalogPreviewConfig.test.js` | 55/55 `catalogPreview`; type branch yok; CSS kök sınıf regression |
| `test/catalogDomainBoundary.test.js` | Catalog/AutoDepot/ModuleContract katman sınırı; `catalogVisible=false` ≠ Item yok |
| `test/catalogCategories.test.js` | Catalog modeli, key eşleşmesi, sıra/label/adet regression |
| `test/itemCatalogFields.test.js` | 96/96 Item alanları, CATALOG.md tablosu, UI `listCatalogGroups` |
| `test/itemSceneDimensions.test.js` | dimensions / sceneDimensions same-field fallback; catalogWidthCm yok; Recipe/Catalog dimension fallback yok |
| `test/catalogSingleSource.test.js` | Her katalog Item tam bir grupta |
| `test/systemModuleCatalogDoc.test.js` | `SYSTEM_MODULE_CATALOG.md` key snapshot |
| `e2e/smoke.spec.mjs` | `#open-module-catalog` |

---

## Kaynak dosyalar

- `src/catalog.js` — `CATALOG_CATEGORIES`, `CATALOG_PREVIEWS`, `getCatalogItem`, `listCatalogItems`, `listCatalogGroups`; derived `MODULE_CATALOG` / `MODULE_CATALOG_GROUPS` / `MODULE_CATALOG_KEYS`
- `src/items.js` — Item master; `catalogPreview`; `dimensions` / `sceneDimensions`; `resolveSceneDimensions`; `resolveItemKey`
- `src/moduleDragSidebar.js` — sol katalog UI; `CATALOG_PREVIEW_RENDERERS[catalogPreview]`
- `src/moduleContextMenu.js` — picker katalog UI
- `src/scene3d.js` — drag badge katalog önizlemesi (`getModuleCatalogItem` / `getModuleCatalogLabel`)
- `src/main.js` — `#open-module-catalog` bağlama
- `docs/refactor/CATALOG.md` — bu sözleşme
- `docs/refactor/ITEMS.md` — Item şeması
- `docs/refactor/REFACTOR.md` — günlük

---

## Gelecek DB/API geçişi

Bugün Item ve Catalog JS kaynağındandır. Gelecekte SQLite / API / PostgreSQL.

Katalog UI ve canonical method’lar değişmemelidir. Yalnız repository / data source değişir.
