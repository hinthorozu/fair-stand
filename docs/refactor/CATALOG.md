# Catalog

Fair Stand katalog mekanizmasının canonical teknik sözleşmesi. Audit dökümü değildir.

Item tarafındaki üç alanın kısa kaydı: `docs/refactor/ITEMS.md`. Bu dosya Catalog’un nasıl çalıştığını anlatır; Item şemasını kopyalamaz.

Bu belgede **mevcut durum** ve **hedef durum** ayrı işaretlenir. Hedef, henüz yazılmamış kodu “var” göstermez.

---

## Amaç

Modül Kataloğu, sahneye sürüklenebilir / eklenebilir Item’ların kullanıcıya gösterilen listesidir.

Katalog:

- hangi Item’ın görüneceğini,
- hangi grupta duracağını,
- grup içinde kaçıncı sırada duracağını

tanımlar.

Katalog, placement, collision, BOM, recipe veya renderer davranışı tanımlamaz.

---

## UI karşılığı

Sol paneldeki **Modül Ekle** düğmesi (`#open-module-catalog`, `index.html`) katalog girişidir. Düğmenin hemen üstüne `createModuleDragSidebar` kart ızgarasını basar.

Bu yüzey “Modül Kataloğu”dur. Sağ tık **Modül Ekle** picker’ı (`moduleContextMenu.js`) aynı grup/Item kümesini ikinci bir katalog yüzeyi olarak gösterir.

---

## Item alanları

Her kayıtlı Item bu üç alanı taşır. Alanlar Item’ın kendisine aittir. Ayrı assignment tablosu yoktur.

### `catalogVisible`

- **Veri tipi:** boolean
- **Zorunluluk:** zorunlu alan; değer `true` veya `false`
- **Ne işe yarar:** Item sol katalogda (ve aynı katalog picker’ında) gösterilecek mi
- **Geçerli değer:** `true` | `false`
- **null davranışı:** alan `null` olmaz. Katalogda yoksa `false` yazılır
- **Örnek:** `wall_200` → `true`; `panel_197` → `false`

### `catalogCategory`

- **Veri tipi:** string veya `null`
- **Zorunluluk:** alan zorunlu; değer görünür Item’da category key, görünmeyende `null`
- **Ne işe yarar:** görünür Item’ın katalog grubu. UI label’ı değil, stabil key
- **Geçerli değer:** aşağıdaki canonical key’lerden biri, veya `null`
- **null davranışı:** `catalogVisible=false` ise `null`. `true` iken `null` yasak
- **Örnek:** `wall_200` → `"panel-wall"`; `panel_197` → `null`

`catalogCategory` yalnız UI gruplamasıdır. Runtime behavior, type, snap, BOM veya factory seçmez.

### `catalogItemIndex`

- **Veri tipi:** number veya `null`
- **Zorunluluk:** alan zorunlu; değer görünür Item’da 1 tabanlı tam sayı, görünmeyende `null`
- **Ne işe yarar:** Item’ın **kendi** `catalogCategory` grubu içindeki sırası
- **Geçerli değer:** `1..N` (N = o kategorideki görünür Item sayısı), veya `null`
- **null davranışı:** `catalogVisible=false` ise `null`. `true` iken `null` yasak
- **Örnek:** `wall_200` → `1` (Panel & Duvar grubunun ilk kartı); `panel_197` → `null`

`catalogItemIndex` global katalog sırası değildir. Başka kategorideki Item’ları saymaz.

---

## Catalog Category

Kaynak: canlı `MODULE_CATALOG_GROUPS` label’ları + her grubun üyesi Item’daki `catalogCategory`. Yeni grup uydurulmaz.

| Canonical key | UI label | Item sayısı |
|---|---|---|
| `panel-wall` | Panel & Duvar | 12 |
| `panel-addon` | Panel Ek Modül | 13 |
| `shelf-showcase` | Raf & Vitrin | 8 |
| `counter-base` | Banko & Baza | 9 |
| `extra` | Extra | 16 |
| `electronics-lighting` | Elektronik & Aydınlatma | 6 |

Toplam görünür Item: **64**. Kayıtlı Item: **104**.

---

## Sıralama

İki ayrı sıra vardır.

1. **Kategori sırası** — grupların soldan/yukarıdan dizilişi.
2. **Kategori içi Item sırası** — bir grubun kart sırası. Sahibi `catalogItemIndex` (1 = ilk kart).

### Mevcut durum

Kategori sırası `MODULE_CATALOG_GROUPS` dizi sırasıdır:

1. Panel & Duvar
2. Panel Ek Modül
3. Raf & Vitrin
4. Banko & Baza
5. Extra
6. Elektronik & Aydınlatma

Sol sidebar kart basımı `MODULE_CATALOG_KEYS` sırasıyla gride ekler. Picker `group.keys` sırasını kullanır. Bugün bu iki liste her grupta aynıdır ve Item’daki `catalogItemIndex` ile örtüşür. UI henüz `catalogItemIndex` okumaz.

### Hedef durum

Kategori sırası sabit canonical key sırasıdır (yukarıdaki tablo sırası).  
Kategori içi sıra yalnız `catalogItemIndex` artan sıradır.  
UI kendi key listesini hardcode etmez.

---

## Çalışma akışı

### Mevcut durum

```text
src/items.js  (getItem / listRegisteredItems)
        ↓
src/catalog.js  create*CatalogItem → MODULE_CATALOG
        ↓
MODULE_CATALOG_KEYS  +  MODULE_CATALOG_GROUPS  (üyelik ve sıra burada ayrı listelenir)
        ↓
main.js → createModuleDragSidebar  /  moduleContextMenu.renderPickerCatalog
        ↓
Modül Ekle UI
```

Uygulama açılınca `main.js` `#open-module-catalog` yanına sidebar kurar. Grup başlıkları `MODULE_CATALOG_GROUPS[].label`, kartlar `MODULE_CATALOG[moduleKey]`. Item’daki `catalogVisible` / `catalogCategory` / `catalogItemIndex` bu turda UI’ya bağlanmamıştır.

### Hedef durum

```text
Item kaynağı  (bugün JS; ileride SQLite/API)
        ↓
catalogVisible === true
        ↓
catalogCategory ile gruplama
        ↓
catalogItemIndex ile sıralama
        ↓
canonical katalog API
        ↓
Modül Kataloğu UI
```

---

## Canonical API / Method

Katalog listelemenin tek merkezi giriş noktası olmalıdır.

### Mevcut çalışma noktası

Merkezi membership listesi yoktur. UI doğrudan şunları okur:

- `MODULE_CATALOG_GROUPS` — grup label + `keys`
- `MODULE_CATALOG_KEYS` — sidebar kart basım sırası
- `MODULE_CATALOG` — kart descriptor’ı (`create*CatalogItem`)

Kimlik/etiket yardımcıları (üyelik listesi değildir):

- `resolveItemKey(descriptor)`
- `getModuleCatalogItem(descriptor)`
- `getModuleCatalogLabel(descriptor)`

Item koleksiyon kalıbı `src/items.js` içindedir: `listRegisteredItems`, `listLeafItems`, `listCompositeItems`, `listFloorItems`. `getCatalogItems` / `listCatalogItems` **yoktur**.

### Hedef (IMPLEMENT EDİLMEDİ)

Durum: henüz implement edilmedi.

Mevcut `list*` kalıbına uyum:

- `listCatalogItems()` — `catalogVisible=true` Item’lar; `catalogCategory`, sonra `catalogItemIndex` sırası
- `listCatalogGroups()` — canonical key sırasıyla gruplar; her grupta aynı sıradaki Item’lar ve UI label

Bu iki fonksiyon katalog UI’nın tek okuma noktası olur. `MODULE_CATALOG_GROUPS` / `MODULE_CATALOG_KEYS` membership kaynağı olmaktan çıkar. Bu turda yazılmadı.

---

## Kesin mimari kurallar

- Katalog üyeliği `type` üzerinden belirlenmez.
- Registry grubundan (`LEAF_ITEMS`, `COMPOSITE_ITEMS`, …) belirlenmez.
- Item Contract üzerinden belirlenmez.
- Item’ın `catalogVisible` alanı belirler.
- Kategori Item’ın `catalogCategory` alanından gelir.
- Kategori içi sıra `catalogItemIndex` alanından gelir.
- Katalog kategorisi Item davranışını belirlemez.
- Aynı katalog bilgisini ikinci bir tabloda tutmak hedef mimaride yasaktır.
- UI kendi başına Item listesi hardcode etmez.
- Katalog için alternatif ikinci kaynak oluşturulmaz.

---

## Yeni Item ekleme örneği

Dokümantasyon örneği; bu `itemKey`’ler kayıtlı ürün değildir.

Katalogda görünen:

```json
{
  "itemKey": "example_item",
  "catalogVisible": true,
  "catalogCategory": "panel-wall",
  "catalogItemIndex": 3
}
```

Katalogda görünmeyen (leaf / child / zemin vb.):

```json
{
  "itemKey": "example_child",
  "catalogVisible": false,
  "catalogCategory": null,
  "catalogItemIndex": null
}
```

Canlı kayıt örnekleri:

```json
{
  "itemKey": "wall_200",
  "catalogVisible": true,
  "catalogCategory": "panel-wall",
  "catalogItemIndex": 1
}
```

```json
{
  "itemKey": "panel_197",
  "catalogVisible": false,
  "catalogCategory": null,
  "catalogItemIndex": null
}
```

Yeni görünür Item eklerken: mevcut kategorilerden bir key seçilir, o kategorideki `1..N` kesintisiz kalacak şekilde index verilir, yeni kategori uydurulmaz.

---

## Validation

- `catalogVisible=true` → `catalogCategory` zorunlu (null değil)
- `catalogVisible=true` → `catalogItemIndex` zorunlu (null değil)
- `catalogVisible=false` → `catalogCategory === null`
- `catalogVisible=false` → `catalogItemIndex === null`
- Aynı kategoride duplicate `catalogItemIndex` yasak
- Index her kategoride `1..N` kesintisiz

---

## Testler

| Test | Ne doğrular |
|---|---|
| `test/itemCatalogFields.test.js` | 104/104 alan, 64 görünür, null kuralları, duplicate/gap yok, grup/Item sırası `MODULE_CATALOG_GROUPS` ile aynı, UI henüz yeni alanları okumaz, bu belgedeki category key tablosu canlı gruplarla örtüşür |
| `test/catalogSingleSource.test.js` | Her katalog Item tam bir grupta; `resolveItemKey` / label tek kaynak |
| `test/systemModuleCatalogDoc.test.js` | `SYSTEM_MODULE_CATALOG.md` key snapshot’ı `MODULE_CATALOG_KEYS` ile aynı (BOM/indeks dokümanı; bu sözleşme değil) |
| `test/catalogDragKeyboardIntegration.test.js` | Katalog sürükleme / Shift+R |
| `e2e/smoke.spec.mjs` | `#open-module-catalog` görünür ve sahne sonrası aktif |

---

## Kaynak dosyalar

Katalog mekanizmasına dokunan gerçek dosyalar:

- `src/items.js` — Item kaydı ve üç katalog alanı
- `src/catalog.js` — `MODULE_CATALOG`, `MODULE_CATALOG_KEYS`, `MODULE_CATALOG_GROUPS`, `resolveItemKey`, `getModuleCatalogItem`, `getModuleCatalogLabel`
- `src/moduleDragSidebar.js` — sol katalog UI; `createModuleDragSidebar`, `createModuleCatalogPreview`
- `src/moduleContextMenu.js` — picker katalog UI; `renderPickerCatalog`
- `src/main.js` — `#open-module-catalog` bağlama
- `src/scene3d.js` — sürükleme önizleme etiketi (`getModuleCatalogLabel`)
- `src/moduleContracts.js` — katalog descriptor üzerinden contract çözümleme
- `src/autoDepot.js` — ticari Item ölçülerini `MODULE_CATALOG`’dan okur
- `src/helpGuide.js` — “Modül Ekleme ve Katalog”
- `src/style.css` — katalog kart stilleri
- `index.html` — Modül Ekle düğmesi
- `docs/refactor/CATALOG.md` — bu sözleşme
- `docs/refactor/REFACTOR.md` — değişiklik günlüğü

`SYSTEM_MODULE_CATALOG.md` okunabilir key/BOM indeksidir; katalog membership kaynağı değildir.

---

## Gelecek DB/API geçişi

Bugün Item verisi JS kaynağından gelir (`src/items.js`).

Gelecekte SQLite / API / PostgreSQL üzerinden gelecek.

Katalog UI ve canonical katalog mekanizması değişmemelidir.

Yalnız Item repository / data source değişmelidir. `listCatalogItems` / `listCatalogGroups` aynı Item alanlarını (`catalogVisible`, `catalogCategory`, `catalogItemIndex`) okumaya devam eder.
