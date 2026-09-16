# Catalog

Fair Stand katalog mekanizmasının canonical teknik sözleşmesi. Audit dökümü değildir.

Item tarafındaki üç alanın kısa kaydı: `docs/refactor/ITEMS.md`. Bu dosya Catalog’un nasıl çalıştığını anlatır; Item şemasını kopyalamaz.

---

## Amaç

Modül Kataloğu, sahneye sürüklenebilir / eklenebilir Item’ların kullanıcıya gösterilen listesidir.

Katalog yalnız UI organizasyonudur. Placement, collision, BOM, recipe, rotation, color, image veya renderer davranışı tanımlamaz.

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

```text
Item.catalogVisible          → kategoride gösterilsin mi
Item.catalogCategory         → Catalog.catalogKey
Item.catalogItemIndex        → kategori içi 1 tabanlı sıra
```

`catalogCategory` görünen label saklamaz. Ad yalnız `catalogName` üzerinden gelir.

---

## Kategoriler

| catalogKey | catalogName | catalogIndex | Item sayısı |
|---|---|---|---|
| `panel-wall` | Panel & Duvar | 1 | 12 |
| `panel-addon` | Panel Ek Modül | 2 | 13 |
| `shelf-showcase` | Raf & Vitrin | 3 | 8 |
| `counter-base` | Banko & Baza | 4 | 9 |
| `extra` | Extra | 5 | 16 |
| `electronics-lighting` | Elektronik & Aydınlatma | 6 | 6 |

Toplam görünür Item: **64**. Kayıtlı Item: **104**.

---

## Sıralama

1. **Kategori sırası** = `Catalog.catalogIndex`
2. **Kategori içi Item sırası** = `Item.catalogItemIndex`

---

## Çalışma akışı

```text
Catalog definitions (CATALOG_CATEGORIES)
        ↓ catalogIndex sıralama
Catalog categories
        ↓
catalogVisible=true Item'lar
        ↓ catalogCategory ile eşleşme (catalogKey)
Kategori
        ↓ catalogItemIndex sıralama
Item listesi
        ↓
Modül Ekle UI
```

Canonical method karşılığı: `listCatalogCategories()` → `listCatalogGroups()` → UI `catalogName` + `keys`.

`MODULE_CATALOG_GROUPS` / `MODULE_CATALOG_KEYS` bu listeden türetilir; ikinci hardcoded kategori tablosu değildir. `label` alanı `catalogName` kopyasıdır (eski test uyumu).

Kart descriptor’ı hâlâ `MODULE_CATALOG` (`create*CatalogItem`).

### Kalan hedef

`listCatalogItems()` henüz ayrı export değildir. Kart ölçü/etiket descriptor’ı hâlâ `MODULE_CATALOG` üzerinden okunur.

---

## Canonical API / Method

| Method | Durum |
|---|---|
| `listCatalogCategories()` | mevcut — kategoriler, `catalogIndex` sırası |
| `getCatalogCategory(catalogKey)` | mevcut |
| `listCatalogGroups()` | mevcut — kategori + Item key listesi (`catalogItemIndex` sırası) |
| `listCatalogItems()` | henüz yok |

UI okur: `listCatalogGroups()` + `group.catalogName` + `group.keys`.

Kimlik yardımcıları (üyelik listesi değildir): `resolveItemKey`, `getModuleCatalogItem`, `getModuleCatalogLabel`.

---

## Kesin mimari kurallar

- Katalog üyeliği `type` üzerinden belirlenmez
- Registry grubundan belirlenmez
- Item Contract üzerinden belirlenmez
- `catalogVisible` üyelik, `catalogCategory` grup, `catalogItemIndex` sıra belirler
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
  "catalogItemIndex": 3
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
- `catalogVisible=false` → category/index null
- Aynı kategoride duplicate `catalogItemIndex` yasak

---

## Testler

| Test | Ne doğrular |
|---|---|
| `test/catalogCategories.test.js` | Catalog modeli, key eşleşmesi, sıra/label/adet regression |
| `test/itemCatalogFields.test.js` | 104/104 Item alanları, CATALOG.md tablosu, UI `listCatalogGroups` |
| `test/catalogSingleSource.test.js` | Her katalog Item tam bir grupta |
| `test/systemModuleCatalogDoc.test.js` | `SYSTEM_MODULE_CATALOG.md` key snapshot |
| `e2e/smoke.spec.mjs` | `#open-module-catalog` |

---

## Kaynak dosyalar

- `src/catalog.js` — `CATALOG_CATEGORIES`, `listCatalogCategories`, `listCatalogGroups`, türetilmiş `MODULE_CATALOG_GROUPS` / `MODULE_CATALOG_KEYS`
- `src/items.js` — Item katalog alanları
- `src/moduleDragSidebar.js` — sol katalog UI
- `src/moduleContextMenu.js` — picker katalog UI
- `src/main.js` — `#open-module-catalog` bağlama
- `docs/refactor/CATALOG.md` — bu sözleşme
- `docs/refactor/ITEMS.md` — Item şeması
- `docs/refactor/REFACTOR.md` — günlük

---

## Gelecek DB/API geçişi

Bugün Item ve Catalog JS kaynağındandır. Gelecekte SQLite / API / PostgreSQL.

Katalog UI ve canonical method’lar değişmemelidir. Yalnız repository / data source değişir.
