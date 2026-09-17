# 02 — SKIPPED_DECISION

İnsan/mimari ürün kararı verilmedi. Davranış değiştirilmedi.

| ID | Konu | Bağlı WP / finding | Neden skip |
| --- | --- | --- | --- |
| DECISION-01 | BOM kullanıcıya açılsın mı? | WP-04, MA-001, MA-011 | Production UI / e2e satır kapsamı ürün kararı |
| DECISION-02 | `moduleContracts` runtime SoT mu? | WP-03, MA-002 | Docs SoT vs `itemBom`+`moduleBehavior`; blast HIGH |
| DECISION-03 | `featureContracts` planner’a bağlansın mı? | WP-03, MA-003 | Registry GOVERNANCE; planner okumaz |
| DECISION-04 | `groundLayout` sahneye alınsın mı? | WP-07, MA-009 | TEST_SUPPORT; scene3d 0 import |
| DECISION-05 | `cornerPlacement` live reflow ile birleşsin mi? | WP-07, MA-004 | Production `wallReflow` |
| DECISION-06 | `composition.moduleType` / `options` dursun mu? | WP-06, MA-006 | SCHEMA_ONLY; `getItem` CRITICAL |
| DECISION-07 | F-045 Python yama betikleri | WP-09, MA-019, MA-020 | Silme vs dondurma |
| DECISION-08 | Connector BOM API | WP-06, MA-013 | Data live; API TEST_ONLY |
| (SoT) | `itemCapabilities` vs `scene3d.acceptsImage` | WP-02, MA-007 | İki surface kuralı; birleştirme ürün/mimari |

WP-02, WP-03, WP-04 tamamen SKIPPED_DECISION. WP-06/07/09 karar kesiti skip, bağımsız teknik kesit uygulandı.
