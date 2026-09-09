# shelf_150 — Current System Inventory

Fresh `Version2` runtime doğrulaması ve ürün kararı sonrası güncel durum.

## Checklist

| # | Alan | Durum | Güncel gerçek / owner |
|---:|---|---|---|
| 1 | Identity / type | VAR | `itemKey=shelf_150`, `type=shelf`, `unit=adet`; canonical owner `src/productionParts.js`. |
| 2 | Intrinsic properties | VAR | `150 × 38 × 1.8 cm`; `material=sunta`; `defaultColor=0xffffff`; nominal module width `150`. `38 cm` mevcut runtime projection değerinden doğrulandı; `1.8 cm`, sunta ve panel_197'nin mevcut default surface görünümüyle aynı beyaz renk kullanıcı ürün kararıdır. |
| 3 | Default state | UYGULANMIYOR | Leaf production Item ayrı project state taşımaz. Raf levhasının doğrulanmış ürün rengi canonical `defaultColor` olarak Item'dadır; parent shelf module state içindeki `shelfLightingOn` ve duvar strip state'i farklı state sahipliğidir. |
| 4 | Factory / creation | PARENT-OWNED | Ayrı leaf project factory yok. `createShelfModuleState()` parent `shelf` module instance'ını üretir; BOM expansion canonical Item'ı `itemKey` ile çözer. |
| 5 | Placement | PARENT-OWNED | `type=shelf` parent module, `src/moduleBehavior.js` içindeki `WALL_BEHAVIOR` placement contract'ını kullanır. |
| 6 | Move | PARENT-OWNED | Parent shelf module move/continuous-wall akışı `modulePlacement` + `wallReflow` zincirindedir; leaf raf ayrı taşınmaz. |
| 7 | Rotation | PARENT-OWNED | `shelf` → `WALL_BEHAVIOR`; rotation step/default parent module contract'ıdır. |
| 8 | Snap / collision / connection | PARENT-OWNED | `WALL_BEHAVIOR`: wall placement, segment collision, standard magnetic snap/segment endpoint; leaf raf için ayrı spatial rule yoktur. |
| 9 | Selection / drag | PARENT-OWNED | Scene surface/module selection ve catalog/module drag parent shelf module üzerinden çalışır; leaf production Item seçilebilir ayrı scene entity değildir. |
| 10 | Context menu | PARENT-OWNED | `moduleContextMenu.js`; delete/duplicate yanında shelf module'a özel lighting toggle parent state'i değiştirir. Leaf raf için ayrı menu yoktur. |
| 11 | Delete / duplicate / keyboard | PARENT-OWNED | `main.js` module işlemleri, `duplicateModuleState()` ve view keyboard zinciri parent module üzerinde çalışır. |
| 12 | Persistence | PARENT-OWNED | `main.js` + `projectStore.js` parent module state'ini persist/restore eder. Leaf `shelf_150` ayrı persisted entity değildir; canonical product default'ları persistence'a kopyalanmaz. |
| 13 | Relationships / reflow | PARENT-OWNED | Parent shelf module continuous wall chain/reflow'a katılır. Leaf rafın ayrı persisted Item-to-Item relationship'i yoktur. |
| 14 | BOM / composition | VAR | Tekil production Item. `shelf_150` iki-raflı `150` recipe'de ×2, üç-raflı recipe'de ×3; shelf leg miktarları sırasıyla ×4/×6. Quantity parent recipe sahibidir. |
| 15 | Renderer / asset / override boundary | VAR | `createShelfModule()` artık canonical Item'dan `depthCm`, `thicknessCm`, `defaultColor` tüketir. `innerWidthM` parent frame içine görsel/teknik fit override'ıdır; shelf heights `SHELF_DIMENSIONS.heightsByCountCm` type-level layout kuralıdır. Ayrı asset yoktur. |
| 16 | Runtime owners | VAR | Product: `productionParts.js`; BOM: `moduleRecipes.js`; parent state: `designState.js`; behavior: `moduleBehavior.js`; placement/reflow: `modulePlacement.js` + `wallReflow.js`; context/UI: `moduleContextMenu.js` + `main.js`; persistence: `main.js` + `projectStore.js`; renderer: `scene3d.js`. |
| 17 | Regression | VAR | `test/shelfItemsItemContract.test.js`, `test/shelfModule.test.js`, `test/moduleRecipes.test.js`, `test/boardMaterialItemContract.test.js` + full suite/E2E. |
| 18 | Open decisions / completion | KAPALI / CI BEKLİYOR | Açık ürün property kararı yok: sunta, 18 mm, 38 cm depth ve beyaz default doğrulandı. Item ancak PR checks + squash merge + post-merge Version2 CI FULL GREEN sonrası operational olarak complete sayılır. |

## Canonical cutover

Eski `partId=shelf_150` recipe kimliği canonical `itemKey=shelf_150` kimliğine taşındı. `src/catalog.js` içindeki `SHELF_DIMENSIONS.projectionCm=38` ve `thicknessCm=3` ürün sabitleri kaldırıldı; renderer canonical Item'ın `depthCm=38` ve gerçek `thicknessCm=1.8` değerini tüketir. Eski renderer raf rengi `0xb8bcc1` kaldırıldı ve canonical `defaultColor=0xffffff` tüketilir.

`panel_197` bu batch'te yeniden açılmadı veya değiştirilmedi; renk referansı yalnız kullanıcı tarafından shelf ürün gerçeğini tarif etmek için verilmiştir.
