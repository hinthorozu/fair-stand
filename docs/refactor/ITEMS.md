# Item

Fair Stand yeni Item modelinin yaşayan canonical sözleşmesi. Audit dökümü değildir.

Bu belgede yalnız **yeni mimaride karar verilmiş** alanlar durur. Eski sistemdeki property envanteri buraya taşınmaz. Bir alan ancak bir refactor adımında Item modeline kabul edilmişse şemaya girer.

Ayrıntılı mekanizma sözleşmeleri ayrı dosyadadır. ITEMS.md o dosyaları kopyalamaz; Item config’in hangi mekanizmaya bağlandığını gösterir.

| Belge | Rol |
|---|---|
| `docs/refactor/REFACTOR.md` | Kronolojik değişiklik günlüğü |
| `docs/refactor/ITEMS.md` | Item modelinin güncel canonical sözleşmesi |
| `docs/refactor/CATALOG.md` | Catalog mekanizmasının ayrıntılı sözleşmesi |

İleride `ROTATION.md`, `COLOR.md`, `IMAGE.md`, `LIGHTING.md`, `DELETE.md` vb. eklendiğinde bu belge yalnız bağlantı satırını tutar.

---

## Item nedir?

BOM, üretim veya maliyet hesabına girebilen her fiziksel ürün/parça bir **Item**’dır.

Tekil kimlik `itemKey`’dir. Label, GLB dosya adı, renderer node adı veya katalog grubu ürün kimliği değildir.

Item, davranış algoritmasını içermez. Item, canonical mechanism’in okuduğu master veriyi ve config parametrelerini taşır.

---

## Zorunlu temel alanlar

Yeni mimaride şu ana kadar onaylanan zorunlu alanlar:

| Alan | Tip | Kapsam |
|---|---|---|
| `itemKey` | string | Item master — kanonik ürün kimliği |
| `catalogVisible` | boolean | Item master — Catalog config |
| `catalogCategory` | string \| null | Item master — Catalog config |
| `catalogItemIndex` | integer \| null | Item master — Catalog config |

`itemKey` her Item’da dolu string’dir. Üç katalog alanı her Item’da **alan olarak** zorunludur; görünmeyen Item’da category/index değeri `null` olur.

---

## Opsiyonel alanlar

Yeni mimaride henüz onaylanmış opsiyonel Item alanı yoktur.

Eski kayıtlardaki `name`, `type`, `dimensions`, `unit`, `composition` vb. runtime’da durur; bu şemaya otomatik alınmadı.

---

## Config blokları

Yeni mimaride onaylı tek config bloğu **Catalog Configuration**’dır.

---

## Catalog Configuration

Ayrıntı: `docs/refactor/CATALOG.md`.

### catalogVisible

- **Type:** boolean
- **Required:** yes
- **Scope:** Item master
- **Default:** yok; her Item açık değer taşır
- **Amaç:** Item’ın Modül Kataloğu’nda gösterilip gösterilmeyeceğini belirler
- **Canonical consumer:** Catalog mechanism
- **Canonical method:** `listCatalogGroups()` — mevcut. `listCatalogItems()` henüz yok
- **Method parametresi:** üyelik filtresi (`true` görünür)
- **Runtime behavior üretmez**
- **Kullanıcı değiştirir mi:** hayır
- **Project instance override:** hayır
- **Persistence:** Item master (bugün `src/items.js`); proje blob’una yazılmaz
- **Validation:** `true` veya `false`; `null` yasak
- **Örnek:** `wall_200` → `true`; `panel_197` → `false`

### catalogCategory

- **Type:** string \| null
- **Required:** yes (alan zorunlu; görünmeyende değer `null`)
- **Scope:** Item master
- **Default:** yok
- **Amaç:** `catalogVisible=true` Item’ın hangi katalog grubunda duracağını belirler. Değer `Catalog.catalogKey` ile eşleşir; UI label saklamaz
- **Canonical consumer:** Catalog mechanism
- **Canonical method:** `listCatalogGroups()` — mevcut
- **Method parametresi:** `catalogKey`
- **Davranış / type belirlemez**
- **Kullanıcı değiştirir mi:** hayır
- **Project instance override:** hayır
- **Persistence:** Item master
- **Validation:** görünürken canonical key; gizliyken `null`
- **Örnek:** `wall_200` → `"panel-wall"`; `panel_197` → `null`

### catalogItemIndex

- **Type:** integer \| null
- **Required:** yes (alan zorunlu; görünmeyende değer `null`)
- **Scope:** Item master
- **Default:** yok
- **Amaç:** Item’ın kendi katalog kategorisi içindeki 1 tabanlı sırasını belirler
- **Canonical consumer:** Catalog mechanism
- **Canonical method:** `listCatalogGroups()` — mevcut
- **Method parametresi:** kategori içi sıra
- **Kullanıcı değiştirir mi:** hayır
- **Project instance override:** hayır
- **Persistence:** Item master
- **Validation:** görünürken `1..N` kesintisiz, kategoride unique; gizliyken `null`
- **Örnek:** `wall_200` → `1`; `panel_197` → `null`

---

## Canonical Mechanism Connections

Item config → canonical mechanism. Gerçekleşmemiş method “var” yazılmaz.

| Item config | Canonical mechanism | Canonical method | Durum |
|---|---|---|---|
| `catalogVisible` / `catalogCategory` / `catalogItemIndex` | Catalog | `listCatalogCategories` / `listCatalogGroups` | mevcut |
| `itemKey` | Item identity | `getItem` / `listRegisteredItems` | mevcut |
| rotation | Rotation | henüz belirlenmedi | yapılmadı |
| color | Color | henüz belirlenmedi | yapılmadı |
| image | Image | henüz belirlenmedi | yapılmadı |
| lighting | Lighting | henüz belirlenmedi | yapılmadı |
| delete | Delete | henüz belirlenmedi | yapılmadı |

Catalog satırı: UI `listCatalogGroups()` ve `catalogName` okur. `listCatalogItems()` henüz yoktur.

`ROTATION.md` vb. yokken bu satırlar yer tutucudur; config şeması değildir.

---

## Item Schema

Yalnız yeni mimaride onaylanan alanlar.

```text
Item {
  itemKey: string

  catalogVisible: boolean
  catalogCategory: string | null    // Catalog.catalogKey
  catalogItemIndex: integer | null  // kategori içi sıra; Catalog.catalogIndex değil
}
```

104 kayıtlı Item bu şemayı taşır. Katalogda görünen 64 kayıt `catalogVisible=true` ve dolu category/index taşır.

---

## Architectural Rules

- Her ürün/parça Item’dır.
- Item davranışı `type` tarafından belirlenmez.
- Registry grubu Item davranışı belirlemez.
- Catalog category Item davranışı belirlemez.
- Item config davranışın parametrelerini taşır.
- Algoritma / canonical mechanism kodda bulunur.
- Aynı davranış için ikinci implementasyon oluşturulmaz.
- Yeni Item eklemek mümkün olduğunca kod değişikliği gerektirmemelidir.
- Item’ın desteklediği capability/config üzerinden mevcut canonical mechanism çalıştırılır.

---

## Validation (onaylı şema)

- Her Item `itemKey` taşır
- Her Item `catalogVisible`, `catalogCategory`, `catalogItemIndex` alanını taşır
- `catalogVisible=true` → category ve index dolu
- `catalogVisible=false` → category ve index `null`
- Aynı kategoride duplicate `catalogItemIndex` yasak
- Index her kategoride `1..N` kesintisiz

Test: `test/itemCatalogFields.test.js`
