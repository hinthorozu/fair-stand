# panel_corner_42_5 — Item Contract Definition

## 1. Canonical kimlik ve intrinsic properties
`PRODUCTION_PARTS.panel_corner_42_5`: canonical `itemKey`, `type=panel`, `unit=adet`, `42.5 × 47 × 0.8 cm`, `panelRole=inner-corner`, nominal `50`; Tekil Item. Doğrulanmış material/product defaultColor yoktur.

## 2. Canonical creation / state
`getProductionItem('panel_corner_42_5')`; ayrı scene/project leaf factory/state yoktur.

## 3. Behavior / capability ownership
Independent leaf placement/move/rotation/snap/collision/context-menu lifecycle'ı yoktur; parent module/type behavior ve relationship layer geçerlidir.

## 4. Canonical relationship-derived BOM
`panel_48_5 ×N -- panelVariant=inner-corner --> panel_corner_42_5 ×N`. `innerCornerPanelItemKey` canonical ref'tir. `wall-straight-50` için replacement quantity `×7`; duplicate straight+corner yoktur. Placement→variant üretimi parent/composite Item relationship scope'udur.

## 5. Persistence
Leaf ayrı persisted entity değildir.

## 6. Renderer boundary
Renderer ayrı corner production identity kullanmaz; specialized visual override BOM source-of-truth değildir.

## 7. Regression
`test/cornerPanelsItemContract.test.js`.

## Checklist sonucu
Identity/dimensions/role **VAR**; material/defaultColor **YOK**; canonical variant/replacement **VAR**; independent leaf behavior/state/persistence **UYGULANMIYOR**; renderer override **izinli**; regression **VAR**.
