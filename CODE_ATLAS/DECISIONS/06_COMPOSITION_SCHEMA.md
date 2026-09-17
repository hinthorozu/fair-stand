# DECISION-06 — SCHEMA_ONLY composition alanları

**KONU:** Item `composition` üzerinde production’ın okumadığı alanlar duracak mı, kalkacak mı, deprecate/rezerve mi?

Seçim bu dosyada yapılmaz. Her alan için dört kova **adaydır:** KEEP_SCHEMA, REMOVE_SCHEMA, DEPRECATE, RESERVE_FOR_FUTURE.

## MEVCUT GERÇEK DURUM

`listRegisteredItems` 96 Item. `composition` yazan kayıtlar `src/items.js` freeze. Proje blob Item master taşımaz; `designState` `composition` kopyalamaz (`src/designState.js` `composition` 0). Serialization compatibility: **Item master / git; eski proje JSON bu alanları taşımaz.**

Production BOM `composition.mode` + `composition.items` (+ inner-corner). `src/` içinde `composition.moduleType` / `composition.options` okuma **0**.

---

## Alan matrisleri

### `composition.mode`

| | |
| --- | --- |
| #Item | recipe parent’lar + cluster (sofa/eames `items` var, `mode` yok) |
| Runtime read | `itemBom.resolveRecipe`: `mode !== 'recipe' → null` |
| Test | COVERED |
| Sınıf | **ACTIVE_RUNTIME** — bu kararın SCHEMA_ONLY kesiti değil |
| Kovalar | KEEP (fiili). REMOVE BOM’u kırar. |

### `composition.items`

ACTIVE_RUNTIME (`expandRecipe`). Kovalar: KEEP.

### `composition.innerCorner.panelItemKey` / `itemReplacements`

ACTIVE_RUNTIME. Kovalar: KEEP. (WP-05 ad hizası yapıldı; alan duruyor.)

### `composition.moduleType`

| | |
| --- | --- |
| #Item | **28** recipe parent (`door`, 3 `base`, 6 `counter`, 4 `wall`, 4 `wall-short-up-2`, 4 `wall-short-up-1`, 4 `separator`, 2 showcase) |
| Runtime read P | **0** |
| Test read | `doorCompositeItemContract`, `wallFlatPanelItemsContract`, `wallShowcaseItemContract`, `wallSeparatorItemsContract` |
| Docs | `static.composition.moduleType` audit notation |
| Serialization | Item freeze; proje state yok |
| Gelecek kanıt | `src/` TODO/okuma yok. Test helper `recipeParentItemKey(moduleType, width)` **string birleştirme**; Item alanı değil |
| Sınıf | SCHEMA_ONLY + TEST_READ |

Kova etkileri:

- **KEEP_SCHEMA:** 28 satır + testler durur. Production aynı. Drift: `item.type` / factory type ile `moduleType` string’leri (`showcase-2` vs type `showcase-2`) insan senkronu.
- **REMOVE_SCHEMA:** 28 Item + contract testleri. `getItem` CRITICAL. Persist yok; git history. Testler `item.type` / `itemKey`’e çekilir.
- **DEPRECATE:** Alan durur; docs/test “okunmaz” banner. Runtime 0.
- **RESERVE_FOR_FUTURE:** KEEP + “ileride recipe id”. Repo’da okuyacak kod yok; rezervasyon ürün vaadi.

### `composition.options.shape`

| | |
| --- | --- |
| #Item | **3** (`desk_banko_100_L`, `_150_L`, `_200_L`) değer `{ shape: 'L' }` |
| Runtime read P | **0** (`composition.options`) |
| Live kimlik | `item.shape === 'L'` — factory, `resolveItemKey`, `createLCounterModule` |
| Test | `item.shape` COVERED; `composition.options` src test 0 |
| Serialization | Item master |

- **KEEP_SCHEMA:** 3 satır yinelenen L işareti.
- **REMOVE_SCHEMA:** 3 satır; identity `item.shape`. Test yoksa düşük. `getItem` hâlâ CRITICAL (ITEMS dokunuşu).
- **DEPRECATE:** banner.
- **RESERVE_FOR_FUTURE:** parametrik options vaadi; bugün yalnız shape ve `item.shape` zaten var.

### `composition.options.shelfCount`

| | |
| --- | --- |
| #Item | **0** (Item’da yok) |
| Docs | `static.composition.options.shelfCount` STALE (WP-06 banner) |
| Kovalar | REMOVE_SCHEMA (kodda yok). Docs STALE. RESERVE ayrı ürün kararı |

### `composition.nominalWidthCm` / diğer composition çocukları

`nominalModuleWidthCm` Item kökünde ACTIVE (inner-corner). `composition` altında ayrı `nominalWidthCm` production alanı değil.

---

## OPTION A — KEEP_SCHEMA (moduleType + options.shape)

Alanlar durur; docs SCHEMA_ONLY.

**Runtime:** 0. **Migration:** hayır. **Test:** mevcut assert. **Risk:** okunmayan şema.

## OPTION B — REMOVE_SCHEMA

28+3 satır + test path. `getItem` CRITICAL. **Migration:** Item master; proje blob yok. **Regression:** contract test rewrite.

## OPTION C — DEPRECATE

Banner + test “P unread”. Silme sonra. **Migration:** hayır.

## OPTION D — RESERVE_FOR_FUTURE

KEEP + gelecekte recipe/options okuma. Repo kanıtı yok; vaat.

## DO NOTHING

SCHEMA_ONLY kalır (fiilen A). MA-006 açık. `getItem` dokunulmaz.

## Eksenler (seçim değil)

| Eksen | Seçenek |
| --- | --- |
| Mevcut davranışla en uyumlu | A / DO NOTHING / C |
| En az migration | A / C |
| En az regression | A / C (`getItem` yok) |
| En temiz uzun vadeli model | B (unread şema yok) veya D+okuma (alan live) |

Blok: MA-006. WP-06. `getItem` CRITICAL — REMOVE öncesi impact.
