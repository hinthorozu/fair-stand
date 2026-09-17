# FINAL_DECISION_MATRIX

Seçim yok. Eksen sütunları “hangi seçenek o eksende öne çıkar” — öneri değil.

GitNexus indeks: `fair-stand` `8e9950b` / `2026-09-17T20:06:24.591Z`.

## Karar matrisi

| Decision | Current State | Option A | Option B | Option C | Lowest Regression | Lowest Migration | Long-term Model | Blocks Which Findings |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| DECISION-01 BOM UI | Resolver live; UI `DEV && ?rawBom`; quote yok | Debug kalsın | Production UI | Resolver durur, UI ertelenir | A / C | A / C | B (veya C sonra B) | MA-001, MA-011 |
| DECISION-02 moduleContracts | 19 test, 0 src import; BOM `itemBom`; behavior `getModuleBehavior` CRITICAL | GOVERNANCE/oracle | Runtime SoT | Ayrı spec katmanı belgelenir | A / C | A / C | B veya C | MA-002 |
| DECISION-03 featureContracts | Planner doğrudan; `getFeatureContract` 1 test | Governance, okunmaz | Planner okur | Test/owner manifest | A / C | A / C | B veya C | MA-003 |
| DECISION-04 groundLayout | TEST_SUPPORT; sahne `createRectangularGrid` (farklı API) | TEST_SUPPORT koru | Ortak runtime grid | Helper kalkar, production test | A | A | B veya C | MA-009 |
| DECISION-05 cornerPlacement | Production `planContinuousWallInsertion`; helper 2 test | TEST_SUPPORT kalır | Testler wallReflow’a | Ortak core (refactor) | A | A | C veya B | MA-004 |
| DECISION-06 composition schema | `moduleType` 28 Item P unread; `options.shape` 3; mode/items/innerCorner live | KEEP_SCHEMA | REMOVE_SCHEMA | DEPRECATE (D: RESERVE dosyada) | A / C | A / C | B veya live options | MA-006 |
| DECISION-07 Python / F-045 | 3 py stale, güncel API yok, F-045 OPEN | KEEP | ARCHIVE | REMOVE (REWRITE 07 dosyasında 4.) | KEEP / REMOVE / ARCHIVE | KEEP | REMOVE / ARCHIVE | MA-019, MA-020, F-045 |
| DECISION-08 connector BOM API | Data recipe itemKey live; API test-only | API BOM’a bağlanır | API helper/sil | Status quo belgelenir | C | C | B veya A | MA-013 |
| MA-007 capability SoT | Map door-leaf; `acceptsImage` birçok mesh true | Map canonical | scene3d canonical | Derive | D (09) | D | A/C (map doldurulmuş) | MA-007 |

DECISION-06 Option C tabloda DEPRECATE; RESERVE_FOR_FUTURE `06_COMPOSITION_SCHEMA.md` Option D.

DECISION-07 Option C tabloda REMOVE; REWRITE `07_PYTHON_PATCH_F045.md`.

MA-007 Option D (ayrı kavram) 09 dosyasında; tabloda lowest-regression sütunu D.

## Finding matrisi

| Finding | Current Status | Blocking Decision | Ready After Decision? |
| --- | --- | --- | --- |
| MA-007 | ACTION_REQUIRED | MA-007 SoT A–D | Evet |
| MA-011 | ACTION_REQUIRED | DECISION-01 | Evet (A/C DEV satır e2e veya B production e2e) |
| MA-019 | ACTION_REQUIRED | DECISION-07 | Evet |
| MA-001 | DESIGN_DECISION_REQUIRED | DECISION-01 | Evet (B kod; A/C docs) |
| MA-002 | DESIGN_DECISION_REQUIRED | DECISION-02 | Evet |
| MA-003 | DESIGN_DECISION_REQUIRED | DECISION-03 | Evet |
| MA-004 | DESIGN_DECISION_REQUIRED | DECISION-05 | Evet |
| MA-006 | DESIGN_DECISION_REQUIRED | DECISION-06 | Evet |
| MA-009 | DESIGN_DECISION_REQUIRED | DECISION-04 | Evet |
| MA-013 | DESIGN_DECISION_REQUIRED | DECISION-08 | Evet |
| MA-020 | DESIGN_DECISION_REQUIRED | DECISION-07 | Evet (F-045 metni) |

## Bağımlılık

Kararlar birbirini kod kilidi olarak **zorunlu sıralamaz**. Aynı sınıftakiler: 02+03 (registry rolü), 04+05 (TEST_SUPPORT), 01+MA-011 (BOM yüzey). MA-007 `scene3d` hotspot — A/C2 WP-08 koruması altında.

`READY_FOR_FINAL_REMEDIATION` (kararsız A finding): **yok.**
