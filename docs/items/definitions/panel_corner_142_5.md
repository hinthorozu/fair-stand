# panel_corner_142_5 — Item Contract Definition

## 1. Canonical kimlik ve intrinsic properties
`PRODUCTION_PARTS.panel_corner_142_5`: `itemKey`, `type=panel`, `unit=adet`, `142.5 × 47 × 0.8 cm`, `panelRole=inner-corner`, nominal `150`; Tekil Item. Doğrulanmış material/product defaultColor yoktur.

## 2. Canonical creation / state
`getProductionItem('panel_corner_142_5')`; ayrı leaf factory/state yoktur.

## 3. Behavior / capability ownership
Independent leaf behavior/context-menu lifecycle'ı yoktur; parent behavior/relationship layer geçerlidir.

## 4. Canonical relationship-derived BOM
`panel_147_5 ×N` → `panel_corner_142_5 ×N` 1:1 replacement. Variant refs: wall150 `×7`, shelf150 2/3 `×7`, base-wall150 `×7`. Placement→variant parent/composite Item scope'udur.

## 5. Persistence
Leaf ayrı persisted entity değildir.

## 6. Renderer boundary
Renderer ayrı corner identity source-of-truth değildir; specialized override izinlidir.

## 7. Regression
`test/cornerPanelsItemContract.test.js`.

## Checklist sonucu
Identity/dimensions/role **VAR**; material/defaultColor **YOK**; canonical variant/replacement **VAR**; independent leaf behavior/state/persistence **UYGULANMIYOR**; renderer override **izinli**; regression **VAR**.
