# 00 — Decision overview

**Amaç:** Kalan insan kararlarını tek seferde karar verilebilir hale getirmek.  
**Tur:** source değiştirilmedi.  
**GitNexus:** repo `fair-stand`, indeks `8e9950b` / `2026-09-17T20:06:24.591Z`. Graph + `src/` + `test/` + `e2e/` + docs.

Bu belge seçim yapmaz. Ayrı dosyalar seçenekleri ve teknik sonuçları listeler. “Önerilen / doğru” yok.

## Karar seti (9 konu)

| ID | Konu | Blokladığı finding |
| --- | --- | --- |
| DECISION-01 | BOM kullanıcı UI | MA-001 (B), MA-011 (A) |
| DECISION-02 | `moduleContracts` rolü | MA-002 (B) |
| DECISION-03 | `featureContracts` rolü | MA-003 (B) |
| DECISION-04 | `groundLayout` | MA-009 (B) |
| DECISION-05 | `cornerPlacement` vs `wallReflow` | MA-004 (B) |
| DECISION-06 | SCHEMA_ONLY composition alanları | MA-006 (B) |
| DECISION-07 | Python yama / F-045 | MA-019 (A), MA-020 (B) |
| DECISION-08 | Connector BOM API | MA-013 (B) |
| MA-007 | `itemCapabilities` vs `scene3d.acceptsImage` | MA-007 (A) |

B finding’ler kodla kapanmaz. Kalan ACTION_REQUIRED (A): MA-007, MA-011, MA-019. Hepsi bir karara bağlı; bağımsız `READY_FOR_FINAL_REMEDIATION` yok.

## Bu turda seçilmeyen değerlendirme eksenleri

Her kararda dört eksen **ayrı** yazılır; biri diğerini ezmez:

- mevcut davranışla en uyumlu
- en az migration
- en az regression
- en temiz uzun vadeli model

## Kanıt özeti (kaynak)

- Production BOM UI: `main.js:62-63` `import.meta.env.DEV && ?rawBom` → `rawBomDebug.renderItemBom` → `resolveItemBom`. Quote/order/fiyat `src/` yok.
- `resolveModuleContract`: GitNexus 19 test caller, 0 production process. `src/` import 0.
- `getFeatureContract`: 1 test. Planner’lar `autoDepot.js` / `automaticWall.js` doğrudan.
- `createGroundLayout`: 1 test. Sahne `createRectangularGrid(widthM, depthM)`.
- Production insert: `planContinuousWallInsertion` (`main.js`, `moduleMove.js`). `resolveAdjacentPlacement` yalnız 2 test.
- `composition.moduleType`: 28 recipe parent yazar; `src/` okuma 0. `composition.options`: 3 L-banko.
- Python 3 script `package.json`/CI yok; hedef string’ler güncel `catalog.js`’te yok.
- `getConnectorItemKey` / `resolveConnectorBom`: `items.js` + `connectorBom.test.js`. Recipe satırları `itemKey` taşır.
- Capability map yalnız `door-leaf`. Panel/banko/baza `acceptsImage: true` hardcoded.

## Dosyalar

`01`–`09` tek karar, `10` kalan A finding, `FINAL_DECISION_MATRIX.md` tablolar.
