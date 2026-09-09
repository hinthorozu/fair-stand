# panel_corner_92 — Item Contract Definition

## 1. Canonical kimlik ve intrinsic properties
`PRODUCTION_PARTS.panel_corner_92`: `itemKey`, `type=panel`, `unit=adet`, `92 × 47 × 0.8 cm`, `panelRole=inner-corner`, nominal `100`; Tekil Item. Doğrulanmış material/product defaultColor yoktur.

## 2. Canonical creation / state
`getProductionItem('panel_corner_92')`; ayrı leaf scene/project factory/state yoktur.

## 3. Behavior / capability ownership
Independent leaf behavior/context-menu lifecycle'ı yoktur; parent module/type behavior ve relationship layer geçerlidir.

## 4. Canonical relationship-derived BOM
`panel_98 ×N` → `panel_corner_92 ×N` 1:1 replacement. Variant refs: wall100 `×7`, door100 `×3`, shelf100 2/3 `×7`, showcase2 `×5`, showcase3 `×4`, base-wall100 `×7`. Quantity korunur; duplicate yoktur. Placement→variant parent/composite scope'udur.

## 5. Persistence
Leaf ayrı persisted entity değildir.

## 6. Renderer boundary
Renderer ayrı corner itemKey source-of-truth kullanmaz; specialized override izinlidir.

## 7. Regression
`test/cornerPanelsItemContract.test.js`.

## Checklist sonucu
Identity/dimensions/role **VAR**; material/defaultColor **YOK**; canonical variant/replacement **VAR**; independent leaf behavior/state/persistence **UYGULANMIYOR**; renderer override **izinli**; regression **VAR**.
