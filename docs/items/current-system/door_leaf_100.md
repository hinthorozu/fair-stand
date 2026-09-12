> **TARİHÎ ENVANTER.** Güncel sistem değildir. Aktif kanonik tanım `docs/items/definitions/` (veya `src/items.js`). Gövdedeki `catalogKey` / `DEPOT_*` / `floorType` tarihî örnektir; runtime kimliği `itemKey`.

# door_leaf_100 — Tarihî envanter

`ITEM_CONTRACT.md` ve `ITEM_CONTRACT_CHECKLIST.md` üzerinden fresh runtime doğrulaması sonrası ahşap kapı kanadı envanteri.

## 18-point checklist

| # | Alan | Durum | Güncel gerçek / owner |
|---:|---|---|---|
| 1 | Identity / type | VAR | `itemKey=door_leaf_100`, `type=door-leaf`, `unit=adet`; eski `door_100 partId` kaldırılır. |
| 2 | Intrinsic properties | VAR | `100 × 200 × 8 cm`, `material=ahşap`, `defaultColor=0xffffff`, `nominalModuleWidthCm=100`. |
| 3 | Default state | VAR | Parent door state içindeki child surface `itemKey=door_leaf_100`, kanonik beyazdan başlar. |
| 4 | Oluşturma | VAR | `createDoorModuleState(100)` → `getDoorLeafProductionItem(100)` → child editable surface. |
| 5 | Placement | PARENT-OWNED | Ahşap kanat bağımsız yerleştirilmez; parent `door` module placement sahibidir. |
| 6 | Move | PARENT-OWNED | Leaf bağımsız taşınmaz; parent module move zinciri uygulanır. |
| 7 | Rotation | PARENT-OWNED | Leaf bağımsız dönmez; parent `door` WALL behavior dönüşü uygulanır. |
| 8 | Snap | PARENT-OWNED | Leaf için ayrı snap yok; parent module snap/collision contract'ı uygulanır. |
| 9 | Collision | PARENT-OWNED | Leaf ayrı collision entity değildir. |
| 10 | Selection | VAR | Kapı kanadı tek surface olarak seçilir; `selectionMode=module`, panel-range seçimine katılmaz. |
| 11 | Context menu | VAR | Sağ click parent module menüsünü açar; leaf için glass/Lightbox/Mesh capability kapalıdır. |
| 12 | Delete / duplicate | PARENT-OWNED | Parent module silinir/çoğaltılır; duplicate leaf surface override'larını korur, yeni surface id üretir. |
| 13 | Kalıcılık | VAR | `surface.itemKey/color/imageAssetId/imageTransform` parent project state içinde saklanır; eski door surface state restore sırasında `door_leaf_100` ile normalize edilir. |
| 14 | Relationships / reflow | VAR | `door_leaf_100`, 100 cm door module'ünün fiziksel child/BOM Item'ıdır; bağımsız reflow yoktur. |
| 15 | BOM / composition | VAR | Parent `door:100` recipe `door_leaf_100 ×1`; unit kanonik Item'dan `adet`. |
| 16 | Renderer / asset | VAR | Procedural door surface effective `color/imageAssetId` state'ini tüketir; image capability type-level Item capability resolver'dan gelir. Product dimensions renderer mesh ölçüsü için zorunlu source değildir; procedural fit specialized renderer sınırıdır. |
| 17 | Runtime owners | VAR | `productionParts.js`, `itemCapabilities.js`, `designState.js`, `moduleRecipes.js`, parent door behavior/context/persistence, `scene3d.js`. |
| 18 | Regression / gaps | VAR | `doorLeafItemContract`, `designState`, `moduleRecipes` testleri identity, dimensions/default, capability, state migration, BOM ve renderer consumer bağını kilitler. |

## Effective value akışı

```text
door_leaf_100.defaultColor (0xffffff)
→ createDoorModuleState child surface default
→ project surface.color / imageAssetId override
→ scene renderer effective görünüm
```

Renk ve görsel kullanıcı override'ıdır; kanonik Item default'unu değiştirmez. `glass`, `lightbox` ve `mesh` bu Item için capability değildir.
