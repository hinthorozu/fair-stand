# 09 — Runtime ↔ contract hizası

Canonical tablo: `SYSTEM_DEVELOPMENT_CONTRACT.md` §2. Runtime: `src/main.js` import grafı + item/BOM path.

| Sözleşme kaydı | Runtime executable | Hiza | Finding |
| --- | --- | --- | --- |
| Item kök / itemKey | `src/items.js` `ITEMS` / `getItem` | Hizalı | — |
| Katalog | `src/catalog.js` projeksiyon | Hizalı (dar alan kasıtlı) | — |
| Modül contract profile | `src/moduleContracts.js` | Test/governance; insert/BOM okumaz | MA-002 |
| Feature contract | `src/featureContracts.js` | Planner okumaz; `autoDepot`/`automaticWall` doğrudan | MA-003 |
| Placement/collision | `moduleBehavior` + `modulePlacement` + `wallReflow` | Hizalı | MA-004 (ikinci model test) |
| State construction | `designState.js` | Hizalı | MA-037 hub |
| Üretim reçetesi | `moduleRecipes.expandRecipe` + `item.composition` | Hizalı | MA-005 ad sapması docs/test |
| BOM resolver | `itemBom.resolveItemBom` | Kod hizalı; kullanıcı UI DEV | MA-001 |
| Renderer | `scene3d.createStandScene` | Hizalı; test gap | MA-008/010 |
| Change gate | `systemChangeContract` + verify | Path map sıkı; CI penceresi gevşek | MA-015 |
| Surface capabilities docs | `itemCapabilities` | Yalnız door-leaf; sahne hardcoded image | MA-007 |
| `groundLayout` gate map | sahne import 0 | Map vs runtime | MA-009 |
| `static.*` / shelfCount / sizeInch / tvConfig | docs | Runtime yok | MA-021–024 |
| `composition.moduleType` / `options` | ITEMS | Production okunmaz | MA-006 |

## BOM zinciri (doğrulandı)

```
DEV && ?rawBom
  → rawBomDebug.renderItemBom(itemKey)
    → resolveItemBom
      → composition.mode === 'recipe' ? expandRecipe(item)
        → innerCorner.panelItemKey inline
```

Production entry (`index.html` → `main.js`) bu zinciri import etmez.

## Planner zinciri

```
main.js → planAutomaticDepot (autoDepot.js)
main.js → composeAutomaticStandWall (automaticWall.js)
         → wallReflow.planContinuousWallLayout
featureContracts: okunmaz
```

## Inner-corner SoT

Tek production: `composition.innerCorner.panelItemKey` (+ `itemReplacements`).  
Test view ve docs ikinci ad.

## Change contract vs Item

Contract inner-corner taşımayı anlatır; `behavior`/`renderer` not-applicable. Item hub ve scene3d bu dalda varsa beyan eksik (08).
