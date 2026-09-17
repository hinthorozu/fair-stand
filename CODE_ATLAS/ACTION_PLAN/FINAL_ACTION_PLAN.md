# Final Action Plan

**Repo:** fair-stand  
**Dal:** `RefactorItem`  
**GitNexus:** `8e9950b` / `2026-09-17T20:06:24.591Z`  
**Tur:** doğrula / sınıflandır / önceliklendir. Source değiştirilmedi.

## Sayılar

| Metrik | Değer |
| --- | --- |
| Toplam finding | **40** |
| A ACTION_REQUIRED | **17** |
| B DESIGN_DECISION_REQUIRED | **8** |
| C NO_ACTION / DOCUMENT_ONLY | **15** |
| P0 work package | **0** |
| P1 work package | **4** |
| P2 work package | **4** |
| P3 work package | **1** |
| SAFE_TO_REMOVE | **0** |
| İnsan kararı | **8** |

## Work package sırası

1. WP-01 Change gate (P1)  
2. WP-02 Surface capability (P1)  
3. WP-03 Contract rol kararı (P1)  
4. WP-04 BOM ürün kararı (P1)  
5. WP-05 Inner-corner adlandırma (P2)  
6. WP-08 Hotspot koruması (P2)  
7. WP-06 Item schema (P2)  
8. WP-07 Legacy / test-support (P2)  
9. WP-09 Docs / hijyen (P3)  

## İlk 5 iş

1. Change-contract + CI penceresini Version2 birikmiş diff ile hizala (MA-015, MA-031).  
2. `itemCapabilities` vs `scene3d.acceptsImage` tek kural (MA-007).  
3. `moduleContracts` / `featureContracts` rol kararı (MA-002, MA-003).  
4. BOM production vs DEV-only kararı (MA-001).  
5. Inner-corner docs/test adını `composition.innerCorner.panelItemKey` yap (MA-005, MA-014).

## İşlem gerektirmeyen finding’ler (C)

MA-008, MA-016, MA-017, MA-018, MA-026, MA-027, MA-029, MA-032, MA-034, MA-035, MA-036, MA-037, MA-038, MA-039, MA-040.

## Özet tablo

| Finding | Severity | Bucket | Work Package | Priority | Action | Confidence |
| --- | --- | --- | --- | --- | --- | --- |
| MA-001 | HIGH | B | WP-04 | P1 | BOM UI ürün kararı | CONFIRMED |
| MA-002 | HIGH | B | WP-03 | P1 | Contract rol kararı | CONFIRMED |
| MA-003 | HIGH | B | WP-03 | P1 | Feature contract rol kararı | CONFIRMED |
| MA-004 | HIGH | B | WP-07 | P2 | cornerPlacement vs wallReflow kararı | HIGH |
| MA-005 | HIGH | A | WP-05 | P2 | Docs/test adını JS path’e çek | CONFIRMED |
| MA-006 | HIGH | B | WP-06 | P2 | SCHEMA_ONLY alan kararı | CONFIRMED |
| MA-007 | HIGH | A | WP-02 | P1 | Capability SoT hizala | HIGH |
| MA-008 | HIGH | C | WP-08 | P2 | Refactor yok; test koruması | CONFIRMED |
| MA-009 | MEDIUM | B | WP-07 | P2 | groundLayout sahne kararı | CONFIRMED |
| MA-010 | MEDIUM | A | WP-08 | P2 | Targeted scene3d test | CONFIRMED |
| MA-011 | MEDIUM | A | WP-04 | P2 | BOM e2e satır / skip | HIGH |
| MA-012 | MEDIUM | A | WP-07 | P3 | Tek test kökü | CONFIRMED |
| MA-013 | MEDIUM | B | WP-06 | P2 | Connector API kararı | CONFIRMED |
| MA-014 | MEDIUM | A | WP-05 | P2 | recipeView TEST_PROJECTION | CONFIRMED |
| MA-015 | MEDIUM | A | WP-01 | P1 | Gate/CI Version2 hizası | HIGH |
| MA-016 | MEDIUM | C | — | — | İki stripCount kavramı belgede | MEDIUM |
| MA-017 | MEDIUM | C | — | — | İki rotation alanı distinct | HIGH |
| MA-018 | MEDIUM | C | — | — | STAND_AXES iç USED | CONFIRMED |
| MA-019 | MEDIUM | A | WP-09 | P3 | py script sınıflandır | HIGH |
| MA-020 | MEDIUM | B | WP-09 | P3 | F-045 kapatma kararı | CONFIRMED |
| MA-021 | LOW | A | WP-06 | P3 | shelfCount docs | CONFIRMED |
| MA-022 | LOW | A | WP-06 | P3 | sizeInch docs | CONFIRMED |
| MA-023 | LOW | A | WP-06 | P3 | static.* notation işareti | CONFIRMED |
| MA-024 | LOW | A | WP-09 | P3 | tvConfig ghost path | CONFIRMED |
| MA-025 | LOW | A | WP-05 | P3 | silinmiş helper MD | HIGH |
| MA-026 | LOW | C | — | — | knip e2e false-positive | CONFIRMED |
| MA-027 | LOW | C | — | — | knip playwright false-positive | CONFIRMED |
| MA-028 | LOW | A | WP-09 | P3 | trigger txt sil/belgele | CONFIRMED |
| MA-029 | LOW | C | — | — | export iç USED | CONFIRMED |
| MA-030 | LOW | A | WP-07 | P3 | tests/ taşı | CONFIRMED |
| MA-031 | LOW | A | WP-01 | P3 | stale cjs affectedFiles | CONFIRMED |
| MA-032 | LOW | C | — | — | validateImported iç CALLS | CONFIRMED |
| MA-033 | LOW | A | WP-09 | P3 | A02.04 checklist | CONFIRMED |
| MA-034 | LOW | C | WP-09 | P3 | cjs silindi; iş yok | CONFIRMED |
| MA-035 | INFO | C | WP-08 | — | getItem hub kapısı | CONFIRMED |
| MA-036 | INFO | C | WP-08 | — | getModuleBehavior hub | CONFIRMED |
| MA-037 | INFO | C | WP-08 | — | state factory hub | CONFIRMED |
| MA-038 | INFO | C | — | — | cycle 0 | CONFIRMED |
| MA-039 | INFO | C | — | — | Worker 0 | CONFIRMED |
| MA-040 | INFO | C | — | — | preview map USED | HIGH |

Tablo satır sayısı: 40.

## Derin doğrulama özeti

- **MA-001:** INTENTIONAL_DEV_FEATURE + DESIGN_DECISION. Production UX yok. Quote/order yok.  
- **MA-002:** GOVERNANCE + TEST_ORACLE. Runtime SoT değil.  
- **MA-003:** GOVERNANCE. Planner okumaz.  
- **MA-004:** TEST_SUPPORT + ALTERNATIVE_MODEL. Production wallReflow.  
- **MA-005:** Production tek path. Docs/test alias riski.  
- **MA-006:** SCHEMA_ONLY / TEST_READ.  
- **MA-007:** Capability map door-leaf; diğer yüzeyler scene3d hardcoded.  
- **MA-008:** 7803 LOC / createStandScene ~4680; impact 1 caller LOW.  
- **MA-015:** CI Version2 birikmiş yüzeyi kaçırabilir; yanlış negatif gerçek.

## Source doğrulaması (bu tur)

Yazılan yollar yalnız `CODE_ATLAS/ACTION_PLAN/`. `src/`, `test/`, `e2e/`, `scripts/`, `package.json` bu turda değiştirilmedi.
