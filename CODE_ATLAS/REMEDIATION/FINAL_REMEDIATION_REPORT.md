# FINAL_REMEDIATION_REPORT

**Tur:** ACTION_REQUIRED teknik düzeltme (kararsız WP skip)  
**Commit/push:** yok

## 1. Başlangıç finding sayısı

**40** (MASTER_AUDIT / ACTION_PLAN). A 17 / B 8 / C 15.

## 2. Work package sonuçları

| WP | Priority | Status | Findings | Files Changed | Validation |
| --- | --- | --- | --- | --- | --- |
| WP-01 | P1 | APPLIED | MA-015, MA-031 | verify script, ci.yml, change-contract, SYSTEM_CHANGE_GATE, gate testleri | gate test + `contract:verify` Version2 |
| WP-02 | P1 | SKIPPED_DECISION | MA-007 | — | — |
| WP-03 | P1 | SKIPPED_DECISION | MA-002, MA-003 | — | — |
| WP-04 | P1/P2 | SKIPPED_DECISION | MA-001, MA-011 | — | — |
| WP-05 | P2 | APPLIED | MA-005, MA-014, MA-025 | recipeView + contract test + property/inventory MD | inner-corner unit |
| WP-08 | P2 | APPLIED | MA-010 (MA-008/035–037 koruma) | `test/scene3dPublicContract.test.js` | façade test |
| WP-06 | P2 | PARTIALLY_APPLIED | MA-021–023 docs; MA-006/013 skip | property STALE banner | unit suite |
| WP-07 | P2 | PARTIALLY_APPLIED | MA-012, MA-030; MA-004/009 skip | tests/ → test/; featureContracts path | autoDepot + moduleBehavior + contract test |
| WP-09 | P3 | PARTIALLY_APPLIED | MA-024, MA-033, MA-028; MA-019/020 skip | TV current-system, checklist, A02, roadmap | docs + full suite |

C finding’ler (MA-008,016,017,018,026,027,029,032,034,035–040) NO_ACTION; kod yok.

## 3. Uygulanan finding’ler

MA-005, MA-010, MA-012, MA-014, MA-015, MA-021, MA-022, MA-023, MA-024, MA-025, MA-028 (belgelendi), MA-030, MA-031, MA-033.

## 4. Çözülen ACTION_REQUIRED sayısı

**14** / 17.

## 5. Kalan ACTION_REQUIRED sayısı

**3:** MA-007, MA-011, MA-019.

## 6. İnsan kararı bekleyenler

DECISION-01 BOM UI  
DECISION-02 `moduleContracts` rolü  
DECISION-03 `featureContracts` planner bağ  
DECISION-04 `groundLayout` sahne  
DECISION-05 `cornerPlacement` vs `wallReflow`  
DECISION-06 SCHEMA_ONLY `composition.moduleType`/`options`  
DECISION-07 F-045 Python yama  
DECISION-08 connector BOM API  
+ MA-007 capability SoT seçimi

## 7. Değiştirilen source dosyaları

- `scripts/verify-change-contract.mjs`
- `.github/workflows/ci.yml`
- `.github/change-contract.json`
- `src/featureContracts.js` (yalnız regressionFiles path)

`src/scene3d.js`, `src/main.js`, `src/items.js`, `src/moduleRecipes.js` (`expandRecipe`) bu turda değiştirilmedi.

## 8. Eklenen/değiştirilen testler

**Yeni:** `test/scene3dPublicContract.test.js`, `test/autoDepot.test.js`, `test/moduleBehavior.test.js`  
**Taşıma silme:** `tests/autoDepot.test.js`, `tests/moduleBehavior.test.js`  
**Güncellenen:** `test/recipeParentItemKey.js`, corner/panel/showcase/straight/wallFlat contract, `systemChangeGateCiContract`, `systemChangeGateLocalDiff`, `systemDevelopmentContract`

## 9. Validation sonuçları

- `npm run syntax:check` — geçti  
- `npm test` — 779 pass / 0 fail  
- `npm run build` — geçti  
- `npm run contract:verify` — geçti (`origin/Version2` + working tree)  
- Playwright — çalıştırılmadı (runtime UI yok)

## 10. Regression

Yok. Production behavior kilidi; test parser hataları test tarafında düzeltildi.

## 11. Kalan sıradaki work package

Karar bekleyen ilk P1: **WP-02**. Sonra WP-03, WP-04. Kararsız kesitler olmadan WP-06/07/09 kalanı.

## 12. Human decision alınırsa açılacak işler

`CODE_ATLAS/REMEDIATION/02_SKIPPED_DECISIONS.md` ve ACTION_PLAN `07_HUMAN_DECISIONS.md`. Karar A/B netleşince ilgili WP tek başına kodlanabilir; bu turda karar uydurulmadı.
