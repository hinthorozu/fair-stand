# Final Master Audit

**Repo:** fair-stand (`C:\Users\hinthorozu\Kyrox\fair-stand\fair-stand-atlas`)  
**Dal:** `RefactorItem`  
**GitNexus:** 13482 sembol, 543 process, indeks `2026-09-17T20:06:24.591Z`, commit `8e9950b`.  
**Kaynak:** bu turda `src/` / `test/` / `e2e/` / `scripts/` / `package.json` yazılmadı.

Knip hüküm değil. Sıfır caller unused değil.

## 1. Top critical findings

**CRITICAL (runtime yanlışlığı / veri kaybı): 0 CONFIRMED.**

Hub `getItem` / `getModuleBehavior` graph `risk: CRITICAL` — bunlar **değişiklik blast radius**, açık bug değil (MA-035…037 INFO).

## 2. Top high-risk findings

1. **MA-001** BOM kullanıcıya kapalı (`DEV && ?rawBom`).
2. **MA-002** `moduleContracts` runtime BOM/behavior okumaz.
3. **MA-003** `featureContracts` planner’lar okumaz.
4. **MA-004** `cornerPlacement` production insert’te yok (`wallReflow` live).
5. **MA-005** inner-corner docs/test view adı ≠ JS path.
6. **MA-006** `composition.moduleType` / `composition.options` production okunmuyor.
7. **MA-007** surface capabilities yalnız `door-leaf`.
8. **MA-008** `createStandScene` impact LOW; dosya sorumluluğu HIGH.

## 3. Proven cleanup candidates

**PROVEN_UNUSED (bağsız sil): 0.**

Güvenli-ish (TEST/docs/script bağı var):

- Python yama betikleri + `video-wall-build-trigger.txt` (SCRIPT_ONLY_STALE) — F-045
- Docs: `tvConfig.js`, `static.shelfCount`, `catalog.sizeInch`, src `getRecipeInnerCornerPanelKey` bahsi
- Knip ignore: e2e + playwright.config
- Opsiyonel: `STAND_AXES` dış export, `getConnectorItemKey` API (data silinmez)

Zaten yapılmış: patch-video-wall `*.cjs`, src `getRecipeInnerCornerPanelKey`.

## 4. Contract/runtime mismatches

`06_CONTRACT_RUNTIME_MISMATCH.md`: static.* notation, shelfCount/sizeInch stale, inner-corner ad, feature/module contract SoT okunmuyor, tvConfig ghost, groundLayout map vs sahne, capabilities genişliği, composition.options unread.

## 5. Item fields never read at runtime (production src)

**CONFIRMED unread (P):**

- `composition.moduleType`
- `composition.options` (shape Item `shape` üzerinden gider)
- `shelfCount` — alan yok
- `sizeInch` — alan yok
- `item.static.*` — yok

**Data USED, API TEST_ONLY:** `connectorType` via `getConnectorItemKey`.

## 6. Orphan features

groundLayout; featureContracts; moduleContracts (runtime); cornerPlacement; connector BOM API; kullanıcı BOM UI; docs-only shelfCount/sizeInch/tvConfig.

## 7. Test gaps

- `scene3d.js` dosya unit yok
- BOM e2e yok
- Governance testleri runtime’ı doğrulamaz
- `test/` + `tests/`

Inner-corner helper cleanup sonrası Item composition path’i doğrular. `recipeView.variants` hâlâ test-only projeksiyon.

## 8. Highest-risk hotspots

`getItem` 60/79 CRITICAL; `getModuleBehavior` 21/45 CRITICAL; `createModuleStateFromDescriptor` CRITICAL; `items.js` tek tablo; `scene3d.js` tek caller + dev façade; `main.js` orkestrasyon.

## 9. Safe cleanup candidates

Docs stale path’ler; knip ignore; trigger txt; (ürün onayıyla) py patch scripts. **src TEST_SUPPORT/GOVERNANCE dosyalarını silme.**

## 10. Requires human decision

- BOM kullanıcıya açılsın mı?
- module/feature contract runtime’a bağlansın mı yoksa “yalnız test/governance” mi?
- groundLayout sahneye alınsın mı?
- cornerPlacement live reflow ile birleşsin mi?
- composition.moduleType/options dursun mı?
- F-045 kalan py scriptler?

## En kritik 10 (özet)

1. MA-001 BOM UX  
2. MA-002 moduleContracts SoT  
3. MA-003 featureContracts SoT  
4. MA-004 dual placement  
5. MA-008 scene3d hotspot + test gap  
6. MA-006 unread composition fields  
7. MA-005 inner-corner naming  
8. MA-007 capabilities dar  
9. MA-009 groundLayout kopuk  
10. MA-015 change-contract vs Version2  

## Severity sayımı (14_FULL_FINDINGS_TABLE)

| Severity | Adet |
| --- | --- |
| CRITICAL | 0 |
| HIGH | 8 |
| MEDIUM | 12 |
| LOW | 14 |
| INFO | 6 |
| **Toplam** | **40** |

## Döngü / worker / knip

Cycle 0. Worker 0. Knip e2e false-positive. 96 Item, 58 katalog.
