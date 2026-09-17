# `static.connectorType`

> **STATUS QUO (DECISION-08).** Item `connectorType` data canlıdır. `getConnectorItemKey` / `resolveConnectorBom` TEST_ONLY API’dir; production BOM `composition.items` `itemKey` taşır. Bu turda silinmedi, UI’ye bağlanmadı.

**Özellik ID:** `static.connectorType`
**İnsan tarafından anlaşılır adı:** Aparat sınıfı
**Kategori:** kanonik-kayit
**Veri tipi:** string
**Birim:** yok / birimsiz
**İzin verilen değerler / enum / aralık:** `start` | `single` | `double` | `corner` (`CONNECTOR_ITEM_KEYS_BY_TYPE`)

## Ne işe yarar

`getConnectorItemKey` / `resolveConnectorBom` sınıfı.

## Canonical owner

- katman: kanonik Item kaydı
- dosya: `src/items.js`
- sembol: `LEAF_ITEMS / COMPOSITE_ITEMS / … + getItem`

## Tanımlandığı yerler

- `src/items.js` `LEAF_ITEMS` :25 [define]
- `src/items.js` `getDoorLeafItem` :71 [define]
- `src/items.js` `getConnectorItemKey` :78 [read]
- `src/items.js` `for` :98 [write]
- `src/items.js` `if` :101 [write-or-literal]

## Okuyan yerler

- `src/items.js` `getConnectorItemKey` :78 [read]
- `test/connectorBom.test.js` (dosya düzeyi) :4 [test]
- `test/moduleRecipes.test.js` (dosya düzeyi) :29 [test]

## Yazan / değiştiren yerler

- `src/items.js` `LEAF_ITEMS` :25 [define]
- `src/items.js` `getDoorLeafItem` :71 [define]
- `src/items.js` `for` :98 [write]
- `src/items.js` `if` :101 [write-or-literal]

## Default değeri

Item default: yalnız `src/items.js` dondurulmuş kayıt. Type default yok. Factory bu alanı kopyalamaz (eşdeğer `state.*` ayrı sütun).

## Override zinciri

Kaynak yalnız `src/items.js` dondurulmuş kayıt. Override yok. (Zemin persist `stand.itemKey` kimliği seçer, kaydı değiştirmez.)

## Hangi item'larda kullanılıyor

- dolu TSV satırı: **4** / 104
- seçim kuralı: TSV hücresi boş olmayan kayıtlar (aşağıda tam liste).
- type'lar: `connector`
- itemKey: `connector_start`, `connector_single`, `connector_double`, `connector_corner`

## Hangi item'larda gerçekten etkili

- sahneye çıkabilir (katalog / foam / zemin): **0**
- yalnızca tanımlı, factory/katalog yok (leaf BOM vb.): **4**
- tanımlı ama sahneye çıkmayan: `connector_start`, `connector_single`, `connector_double`, `connector_corner`

## Kullanıcı değiştirebilir mi

hayır

## Kullanıcı nereden değiştirir

yok

## Persistence

Kod kaydı. Project DB'ye yazılmaz.

## Renderer etkisi

doğrudan yok veya dolaylı (kanıt bölümü).

## Placement / collision etkisi

yok veya dolaylı değil.

## BOM / composition etkisi

Etkiler: `resolveItemBom` / recipe items / inner-corner variant. Miktar uydurulmaz; recipe satırı kanoniktir.

## Validation

validation yok (genel proje şeması yok).

## Bağımlılıklar

- kök katman: `static`

## Değiştirmenin yan etkileri

Kanonik kayıt değişirse catalog, factory, BOM, davranış çözümü ve test kilitleri birlikte etkilenir. Bu turda değiştirilmedi.

## CRUD sınıflandırması

ITEM_READONLY

## CRUD gerekçesi

Kanonik `src/items.js` kaydı. Runtime kullanıcı bu alanları item tanımı olarak değiştirmez; kopyalar factory/catalog/BOM tarafında okunur.

## Kanıt

- src dosya sayısı (unique): **1**
- src dosyaları: `src/items.js`

- `src/items.js` `LEAF_ITEMS` :25 [define]
- `src/items.js` `getDoorLeafItem` :71 [define]
- `src/items.js` `getConnectorItemKey` :78 [read]
- `src/items.js` `for` :98 [write]
- `src/items.js` `if` :101 [write-or-literal]
- `test/connectorBom.test.js` (dosya düzeyi) :4 [test]
- `test/moduleRecipes.test.js` (dosya düzeyi) :29 [test]

- indeks: 14 / 188
