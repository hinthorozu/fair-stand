# Fair Stand — Item mimarisi refactor günlüğü

Bu dosya Item mimarisine geçişin tek merkezi değişiklik kaydıdır. Audit dökümü değildir; yalnız gerçekten uygulanan adımlar ve o adımdan sonra geçerli kurallar yazılır.

- Item modeli: `docs/refactor/ITEMS.md`
- Katalog mekanizması: `docs/refactor/CATALOG.md`

---

## 2026-09-16 — MODULE_CATALOG Item tekrarının kaldırılması

### Eski yapı

64 katalog kartı `src/catalog.js` içinde `MODULE_CATALOG` hardcoded key listesi + `create*CatalogItem` builder’ları ile ikinci kez tanımlanıyordu. Item kaydı varken kart descriptor’ı ayrı tutuluyordu.

### Kaldırılan duplicate kaynak

- `MODULE_CATALOG = { wall_200: createFlatPanelCatalogItem('wall_200'), ... }` literal 64 key
- `createFlatPanelCatalogItem`, `createUprightCatalogItem`, `createProfileCatalogItem`, `createShelfCatalogItem`, `createCounterCatalogItem`, `createBaseCatalogItem`, `createBaseWallCatalogItem`, `createSeparatorCatalogItem`, `createWallMediaCatalogItem`, `createTopLightCatalogItem`, `createCommercialCatalogItem`, `createIndoorPlantCatalogItem`, `createFurnitureCatalogItem`

### Yeni canonical method

- `getCatalogItem(itemKey)` — `catalogVisible=true` Item’dan catalog descriptor
- `listCatalogItems()` — görünür Item’lar, kategori `catalogIndex` + `catalogItemIndex` sırası
- `listCatalogGroups()` aynı üyelik alanlarını okur; UI `getCatalogItem` ile kart üretir

### Item’a taşınan gerçek alanlar

Yok. Descriptor alanları zaten Item’da duruyordu (`name`, `dimensions`, `modelFile`, `eyeCount`, `sizeInch`, `videoWall`, `stripOccupancy`, `shape`, `shelfCount`, `variant`, rotation metadata). Projection alias’ı Item’a kopyalanmadı (`label` = `name`; kök `widthCm` = `dimensions.widthCm` veya türetilmiş oturum).

Profil kart `widthCm` Item’da yoktur; düz duvar reçetesi `nominalWidthCm` türevidir. Dikme `thicknessCm`/`lengthCm` → kare oturum. TV/video-wall `resolveWallMediaMetrics` türevidir.

### Compatibility export

`MODULE_CATALOG` / `MODULE_CATALOG_KEYS` / `MODULE_CATALOG_GROUPS` kaldı; hardcoded liste değildir, `listCatalogItems` / `listCatalogGroups` türevidir. Mevcut testler bu export’u okumaya devam eder.

### Doğrulama

- kayıtlı Item 104; catalogVisible=true 64; projection 64
- hardcoded katalog Item key listesi: 0
- 64/64 descriptor regression: itemKey/label/widthCm/depthCm/heightCm/type/modelFile/eyeCount/shelfCount/shape/variant/stripOccupancy/unit/TV alanları birebir
- kategori sayısı/sırası/adları/üye sayısı/Item sırası değişmedi
- `npm test`: 740 pass / 0 fail
- `npm run build`: geçti
- `CHANGE_GATE_BASE=origin/RefactorItem npm run contract:verify`: geçti (`catalog-item-projection`)
- targeted E2E `e2e/smoke.spec.mjs`: geçti

### Sonraki adım

SQLite/API yok. Rotation/color/image bu turda yok.

---

## 2026-09-16 — Catalog category modelinin merkezileştirilmesi

### Neden yapıldı

Modül Kataloğu kategori yapısı hardcoded `MODULE_CATALOG_GROUPS` (yalnız `label` + `keys`) olarak duruyordu. Kategori kimliği, UI adı ve yukarıdan aşağıya sıra ayrı canonical alanlar değildi. Item.catalogCategory key’leri vardı ama kategori tanımı merkezi Catalog modelinde açık değildi.

### Hangi eski yapı değişti

- Kaldırılan hardcoded kaynak: `src/catalog.js` içindeki `MODULE_CATALOG_GROUPS` literal listesi (`label` + `keys`)
- Kaldırılan ikinci hardcoded üyelik listesi: ayrı `MODULE_CATALOG_KEYS` literal dizisi
- Sidebar / picker artık `MODULE_CATALOG_GROUPS` sabitini okumaz; `listCatalogGroups()` ve `group.catalogName` okur

### Yeni alanlar

Catalog (canonical kaynak `CATALOG_CATEGORIES`):

- `catalogKey` — stabil kategori kimliği; Item.catalogCategory bu değere bağlanır
- `catalogName` — Modül Ekle panelindeki kategori adı
- `catalogIndex` — kategorilerin 1 tabanlı yukarıdan aşağıya sırası

Item bağlantısı değişmedi: `catalogVisible`, `catalogCategory` → `catalogKey`, `catalogItemIndex` (kategori içi sıra).

Yeni method’lar: `listCatalogCategories()`, `getCatalogCategory(catalogKey)`, `listCatalogGroups()`.

### Gerçek catalogKey’ler

Bu turda yeni key uydurulmadı. Key’ler önceki turda Item kayıtlarına yazılan `catalogCategory` değerleridir.

| catalogKey | catalogName | catalogIndex | Item sayısı |
|---|---|---|---|
| `panel-wall` | Panel & Duvar | 1 | 12 |
| `panel-addon` | Panel Ek Modül | 2 | 13 |
| `shelf-showcase` | Raf & Vitrin | 3 | 8 |
| `counter-base` | Banko & Baza | 4 | 9 |
| `extra` | Extra | 5 | 16 |
| `electronics-lighting` | Elektronik & Aydınlatma | 6 | 6 |

`MODULE_CATALOG_KEYS` artık `listCatalogGroups().flatMap(keys)` türevidir. Global snapshot sırası kategori sırasına hizalandı (eski literal KEYS listesinde raf/vitrin, `wall_base` / `door_100` satırlarından önce duruyordu). Modül Ekle UI kategori sırası, kategori adları ve kategori içi Item sırası değişmedi.

### Yeni kural

- Katalog yalnız UI organizasyonudur
- Kategori adı yalnız `catalogName`
- Kategori sırası yalnız `catalogIndex`
- `catalogCategory` yalnız `catalogKey` saklar; label saklamaz
- `type` / Item Contract / registry grubu kategori belirlemez
- `catalogCategory` rotation / color / image / collision / renderer / placement belirlemez

### Doğrulama

- Catalog category sayısı: 6 (önceki grup sayısıyla aynı)
- `catalogKey` benzersiz: %100
- `catalogName` boş: 0
- `catalogIndex` null: 0
- duplicate `catalogIndex`: 0
- `catalogIndex` sırası: 1..6 kesintisiz
- geçersiz `catalogKey` bakan Item: 0
- `catalogVisible=true` ve geçersiz category: 0
- kategori UI sırası / adları / kategori içi Item sırası / görünen Item sayısı (64): değişmedi
- `npm test`: 737 pass / 0 fail
- `npm run build`: geçti
- `CHANGE_GATE_BASE=origin/RefactorItem npm run contract:verify`: geçti (`catalog-category-model`)
- targeted E2E `e2e/smoke.spec.mjs`: geçti

### Sonraki adım

`listCatalogItems()` henüz ayrı export değildir. Kart descriptor’ı hâlâ `MODULE_CATALOG` üzerindendir. SQLite/API bu turda yoktur.

---

## 2026-09-16 — Item katalog metadata alanları

### Amaç

Katalog görünürlüğünü ve katalog içi konumu Item’ın kendi verisine taşımak. Bu tur katalog UI’yı yeni alanlardan okutmaz; yalnız 104 Item kaydını hazırlar.

### Yapılan değişiklikler

- Eklenen Item alanları: `catalogVisible`, `catalogCategory`, `catalogItemIndex`
- Değer kaynağı: canlı `MODULE_CATALOG_GROUPS` üyeliği ve `MODULE_CATALOG_KEYS` ile aynı grup içi UI sırası
- Kaldırılan alan yok
- `createCommercialCatalogItem` bu üç alanı katalog descriptor’ına kopyalamaz; `MODULE_CATALOG` şekli korunur
- Etkilenen dosyalar: `src/items.js`, `src/catalog.js`, `test/itemCatalogFields.test.js`, `test/shelfLegItemContract.test.js`

Canonical `catalogCategory` key’leri (mevcut 6 grup, yeni grup yok):

| key | grup label | Item sayısı |
|---|---|---|
| `panel-wall` | Panel & Duvar | 12 |
| `panel-addon` | Panel Ek Modül | 13 |
| `shelf-showcase` | Raf & Vitrin | 8 |
| `counter-base` | Banko & Baza | 9 |
| `extra` | Extra | 16 |
| `electronics-lighting` | Elektronik & Aydınlatma | 6 |

`wall_200`: `catalogVisible=true`, `catalogCategory=panel-wall`, `catalogItemIndex=1` (grupta ilk kart).
`panel_197`: `catalogVisible=false`, `catalogCategory=null`, `catalogItemIndex=null`.

### Yeni kural

- `catalogVisible`: Item sol katalogda gösterilecek mi
- `catalogCategory`: Item’ın ait olduğu katalog category key; yalnız UI gruplamasıdır, runtime behavior belirlemez
- `catalogItemIndex`: kendi kategorisi içinde 1 tabanlı sıra
- Bu üç alan type’tan, Item Contract’tan veya registry grubundan türetilmez
- Her Item kendi değerini taşır; ayrı assignment tablosu yoktur
- Katalogda görünmeyen Item: `false / null / null`
- Bu turda katalog UI hâlâ `MODULE_CATALOG_GROUPS` okur

### Doğrulama

- Toplam Item: 104 / 104
- `catalogVisible` / `catalogCategory` / `catalogItemIndex` alanı: 104 / 104
- `catalogVisible=true`: 64 (canlı katalog Item sayısıyla aynı)
- visible=true olup category veya index null: 0
- visible=false olup category veya index dolu: 0
- Aynı kategoride duplicate index: 0
- Her kategoride index 1..N kesintisiz
- Katalog grup sırası, grup içi Item sırası ve görünen Item sayısı değişmedi
- `npm test`: 732 pass / 0 fail
- `npm run build`: geçti
- targeted E2E `e2e/smoke.spec.mjs`: geçti

### Sonraki adım

Katalog UI’yı `MODULE_CATALOG_GROUPS` yerine Item’daki `catalogVisible` / `catalogCategory` / `catalogItemIndex` alanlarından okutmak. Bu adım henüz yapılmaz.

---

## 2026-09-16 — Katalog teknik sözleşmesi

### Amaç

Katalog mekanizmasını kalıcı tek belgede sabitlemek ve refactor günlüğünü `docs/refactor/` altına almak.

### Yapılan değişiklikler

- Eklenen: `docs/refactor/CATALOG.md` (katalog canonical sözleşmesi)
- Taşınan: değişiklik günlüğü `docs/REFACTOR.md` → `docs/refactor/REFACTOR.md`
- `docs/REFACTOR.md` yönlendirme bırakır
- Katalog UI, Item Contract, recipe, behavior, DB/API bu adımda değişmez
- Etkilenen dosyalar: `docs/refactor/CATALOG.md`, `docs/refactor/REFACTOR.md`, `docs/REFACTOR.md`, `test/itemCatalogFields.test.js`

### Yeni kural

- Refactor adımlarının tek günlüğü `docs/refactor/REFACTOR.md`
- Katalog nasıl çalışır / nasıl çalışmalıdır: yalnız `docs/refactor/CATALOG.md`
- Mevcut UI hâlâ `MODULE_CATALOG_GROUPS` okur; `listCatalogItems` / `listCatalogGroups` henüz yoktur

### Doğrulama

- `test/itemCatalogFields.test.js` category key tablosunu canlı gruplarla karşılaştırır
- `listCatalogItems` / `listCatalogGroups` src içinde yok
- `npm test`: 733 pass / 0 fail
- Katalog UI sırası ve Item alanları önceki adımla aynı kalır

### Sonraki adım

`listCatalogItems` / `listCatalogGroups` eklemek ve UI’yı bu API’den okutmak. Bu adım henüz yapılmaz.

---

## 2026-09-16 — Item canonical sözleşmesi

### Amaç

Yeni Item modelinin yaşayan teknik sözleşmesini `docs/refactor/ITEMS.md` altında tutmak. Audit dökümü değildir; yalnız onaylanmış alanlar yazılır.

### Yapılan değişiklikler

- Eklenen: `docs/refactor/ITEMS.md`
- Onaylı şemaya alınan Item alanları: `itemKey`, `catalogVisible`, `catalogCategory`, `catalogItemIndex`
- Eski 188 property / type / registry alanları şemaya taşınmadı
- Catalog ayrıntısı `CATALOG.md`’de kalır; ITEMS.md yalnız config bağlantısını tutar
- Etkilenen dosyalar: `docs/refactor/ITEMS.md`, `docs/refactor/REFACTOR.md`, `docs/REFACTOR.md`, `test/itemCatalogFields.test.js`

### Yeni kural

- Item modelinin tek güncel cevabı `docs/refactor/ITEMS.md`
- Yeni Item alanı/config aynı commit içinde ITEMS.md’ye yazılır
- Gerçekleşmemiş method veya config gerçekleşmiş gibi yazılmaz
- Rotation / color / image / lighting / delete mekanizmaları henüz belirlenmedi

### Doğrulama

- `test/itemCatalogFields.test.js` ITEMS.md katalog alanlarını ve “henüz yok” kaydını doğrular
- `npm test`: 734 pass / 0 fail
- Katalog UI değişmez

### Sonraki adım

`listCatalogItems` / `listCatalogGroups` eklemek. ITEMS.md bağlantı satırı o commit’te “mevcut” yapılır.
