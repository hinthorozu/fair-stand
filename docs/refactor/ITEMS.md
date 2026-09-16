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

Item master Catalog’dan bağımsızdır. Bir Item’ın `getItem(itemKey)` ile var olması katalogda görünmesi değildir. `catalogVisible=false` Item’ı AutoDepot, Module Contract, BOM, renderer veya placement’tan kaldırmaz.

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

Görünür Item (`catalogVisible=true`) ek zorunlu Catalog alanı: `catalogPreview`. Gizli Item’da bu alan yoktur.

---

## Opsiyonel alanlar

| Alan | Tip | Kapsam |
|---|---|---|
| `dimensions` | object | Item master — fiziksel ürün ölçüleri |
| `sceneDimensions` | object \| yok | Item master — aynı field setinin runtime override katmanı |

`dimensions` Item’ın gerçek/fiziksel ölçülerini taşır. `sceneDimensions` sahne/runtime’da farklı bir değer gerekiyorsa aynı field adıyla override yazar. İkisi de şu canonical 5 alanı destekler: `widthCm`, `depthCm`, `heightCm`, `lengthCm`, `thicknessCm`. Aynı değerleri iki kere yazmak zorunlu değildir. Effective scene field: `sceneDimensions.field ?? dimensions.field ?? MISSING`. Aynı field adı yoksa fallback yoktur.

Eski kayıtlardaki `name`, `type`, `unit`, `composition` vb. runtime’da durur; bu şemaya otomatik alınmadı.

---

## Config blokları

Yeni mimaride onaylı tek config bloğu **Catalog Configuration**’dır.

---

## Catalog Configuration

Ayrıntı: `docs/refactor/CATALOG.md`.

| Field | Amaç |
|---|---|
| `catalogVisible` | Catalog UI’da görünürlük |
| `catalogCategory` | kategori key |
| `catalogItemIndex` | kategori içi sıra |
| `catalogPreview` | Catalog kart preview renderer key |

Catalog görünümü `Item.type` üzerinden belirlenmez. Catalog preview renderer seçimi yalnız `Item.catalogPreview` üzerinden yapılır.

### catalogVisible

- **Type:** boolean
- **Required:** yes
- **Scope:** Item master
- **Default:** yok; her Item açık değer taşır
- **Amaç:** Item’ın Modül Kataloğu’nda gösterilip gösterilmeyeceğini belirler
- **Canonical consumer:** Catalog mechanism
- **Canonical method:** `listCatalogItems()` / `listCatalogGroups()` — mevcut
- **Method parametresi:** üyelik filtresi (`true` görünür)
- **Runtime behavior üretmez**
- **Başka mekanizmada varlık/kullanılabilirlik üretmez**
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

### catalogPreview

- **Type:** string
- **Required:** `catalogVisible=true` Item’da yes; gizli Item’da alan yok
- **Scope:** Item master — Catalog config
- **Default:** yok; type fallback yoktur
- **Amaç:** Catalog kart preview renderer key. Asset/icon dosya yolu değildir; CSS/DOM silüet seçer
- **Canonical consumer:** Catalog UI (`CATALOG_PREVIEW_RENDERERS`)
- **Canonical method:** `getCatalogItem` / `listCatalogItems` projection → `createModuleCatalogPreview`
- **Catalog görünümü `Item.type` üzerinden belirlenmez**
- **Catalog preview renderer seçimi yalnız `Item.catalogPreview` üzerinden yapılır**
- **Kullanıcı değiştirir mi:** hayır
- **Project instance override:** hayır
- **Persistence:** Item master
- **Validation:** görünürken `CATALOG_PREVIEWS` üyesi; yok/bilinmiyor → fail-fast; gizlide alan yok
- **Örnek:** `KETTLE` → `"kettle"`; `TV_42` → `"tv"`; `VIDEO_WALL_2X2` → `"video-wall"`; `wall_200` → `"flat-panel"`; `profile_190` → `"profile"`

### dimensions

- **Type:** object (`widthCm?`, `depthCm?`, `heightCm?`, `lengthCm?`, `thicknessCm?` ve mevcut özel alanlar)
- **Required:** no — güvenilir fiziksel kaynak yoksa alan yazılmaz
- **Scope:** Item master — gerçek/fiziksel ürün ölçüleri
- **Default:** yok; tahmin/`0`/`1`/GLB bbox yasak
- **Amaç:** Ürünün fiziksel ölçüsü. Catalog, Recipe, type veya itemKey bu katmanı üretmez
- **Canonical consumer:** `resolveSceneDimensions` (same-field fallback), BOM/üretim okuyucuları, Catalog projection (okur, sahip olmaz)
- **Canonical method:** `item.dimensions` / `resolveSceneDimensions(item)`
- **Çapraz remap yok:** `lengthCm` width olmaz; `thicknessCm` depth olmaz
- **Kullanıcı değiştirir mi:** hayır (Item master)
- **Project instance override:** hayır; sahne ezmesi `sceneDimensions`’tadır
- **Persistence:** Item master
- **Örnek:** `profile_190` → `{ lengthCm: 190, thicknessCm: 8 }`

### sceneDimensions

- **Type:** object (`widthCm?`, `depthCm?`, `heightCm?`, `lengthCm?`, `thicknessCm?`)
- **Required:** no — physical ile aynı field aynı değerdeyse yazılmaz
- **Scope:** Item master — scene/runtime override
- **Default:** yok; `null`, `{}` ve `{ field: null }` override yok demektir
- **Amaç:** Sahnede kullanılacak ölçü. Yalnız physical’dan farklıysa veya scene’in ihtiyaç duyduğu field physical’da aynı isimle yoksa yazılır
- **Canonical consumer:** factory, identity, Catalog footprint, collision/ghost
- **Canonical method:** `resolveSceneDimensions(item)`
- **Effective field:** `sceneDimensions.field ?? dimensions.field ?? MISSING`
- **Recipe/Catalog/type/itemKey/STAND Item-specific scene source değildir**
- **Kullanıcı değiştirir mi:** hayır (Item master)
- **Persistence:** Item master
- **Örnek:** `profile_190` → `{ widthCm: 200, depthCm: 8, heightCm: 350 }`

---

## Canonical Mechanism Connections

Item config → canonical mechanism. Gerçekleşmemiş method “var” yazılmaz.

| Item config | Canonical mechanism | Canonical method | Durum |
|---|---|---|---|
| `catalogVisible` / `catalogCategory` / `catalogItemIndex` | Catalog | `listCatalogCategories` / `listCatalogItems` / `getCatalogItem` / `listCatalogGroups` | mevcut |
| `catalogPreview` | Catalog | `getCatalogItem` / `listCatalogItems` → `CATALOG_PREVIEW_RENDERERS` | mevcut |
| `dimensions` / `sceneDimensions` | Item ölçü | `resolveSceneDimensions` | mevcut |
| `itemKey` | Item identity | `getItem` / `listRegisteredItems` / `resolveItemKey` | mevcut |
| rotation | Rotation | henüz belirlenmedi | yapılmadı |
| color | Color | henüz belirlenmedi | yapılmadı |
| image | Image | henüz belirlenmedi | yapılmadı |
| lighting | Lighting | henüz belirlenmedi | yapılmadı |
| delete | Delete | henüz belirlenmedi | yapılmadı |

Catalog satırı: UI `listCatalogGroups()` + `getCatalogItem()`. Kart descriptor’ı Item master’dan türetilir (`label` = `name`). `listCatalogItems()` mevcuttur.

Item master ile Catalog projection ayrıdır. Projection alias’ları (`label`, kök `widthCm`) Item alanı değildir. Item master Catalog’dan bağımsızdır.

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
  catalogPreview?: string           // catalogVisible=true ise zorunlu renderer key; gizlide yok
  dimensions?: {
    widthCm?: number
    depthCm?: number
    heightCm?: number
    lengthCm?: number
    thicknessCm?: number
  }
  sceneDimensions?: {
    widthCm?: number
    depthCm?: number
    heightCm?: number
    lengthCm?: number
    thicknessCm?: number
  }
}
```

104 kayıtlı Item bu şemayı taşır. Katalogda görünen 64 kayıt `catalogVisible=true`, dolu category/index ve `catalogPreview` taşır.

---

## Architectural Rules

- Her ürün/parça Item’dır.
- Item davranışı `type` tarafından belirlenmez.
- Registry grubu Item davranışı belirlemez.
- Catalog category Item davranışı belirlemez.
- Catalog, Item runtime repository değildir.
- `catalogVisible=false` Item’ı yok etmez.
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
- `catalogVisible=true` → `catalogPreview` dolu ve `CATALOG_PREVIEWS` üyesi
- `catalogVisible=false` → category ve index `null`
- `catalogVisible=false` → `catalogPreview` alanı yok
- `catalogVisible=false` → Item `getItem` ile durur; `getCatalogItem` null döner
- `catalogWidthCm` yoktur
- Effective scene field yalnız same-field: `sceneDimensions.field ?? dimensions.field ?? MISSING`
- Aynı kategoride duplicate `catalogItemIndex` yasak
- Index her kategoride `1..N` kesintisiz

Test: `test/itemCatalogFields.test.js`, `test/itemSceneDimensions.test.js`
