# panel_98 — Current System Inventory

Fresh `Version2` doğrulaması ve ürün kararı sonrası güncel durum.

## 18-point checklist

| # | Alan | Durum | Güncel gerçek / owner |
|---:|---|---|---|
| 1 | Identity / type | VAR | `itemKey=panel_98`, `type=panel`, `unit=adet` |
| 2 | Intrinsic properties | VAR | `98 × 47 × 0.8 cm`, `material=sunta`, `panelRole=straight`, nominal `100` |
| 3 | Default state | UYGULANMIYOR | Leaf production Item ayrı state taşımaz; editable surface state parent module içindedir. |
| 4 | Oluşturma | UYGULANMIYOR | Ayrı project factory yok; parent module factory üretir. |
| 5 | Placement | PARENT-OWNED | Parent module behavior/placement zinciri. |
| 6 | Move | PARENT-OWNED | Parent module move/reflow zinciri. |
| 7 | Rotation | PARENT-OWNED | Parent module behavior family. |
| 8 | Snap | PARENT-OWNED | Parent module behavior family. |
| 9 | Collision | PARENT-OWNED | Parent module placement/collision motoru. |
| 10 | Selection | PARENT-OWNED | Scene surface/module selection; leaf production identity seçilmez. |
| 11 | Context menu | PARENT-OWNED | Module/surface context-menu zinciri. |
| 12 | Delete / duplicate | PARENT-OWNED | Parent module işlemleri. |
| 13 | Kalıcılık | PARENT-OWNED | Parent module state kaydedilir; leaf ayrı entity değildir. |
| 14 | Relationships / reflow | VAR | Straight panel, doğrulanmış inner-corner seçiminde 1:1 değiştirilebilir. |
| 15 | BOM / composition | VAR | Tekil Item; quantity parent recipe sahibidir. |
| 16 | Renderer / asset | OVERRIDE | Procedural renderer ayrı kalır; render değeri product source-of-truth değildir. |
| 17 | Runtime owners | VAR | `productionParts.js`, `moduleRecipes.js`, parent state/behavior/context/persistence/renderer zinciri. |
| 18 | Regression | VAR | Panel Item Contract testleri + `boardMaterialItemContract.test.js`. |

`#ffffff` editor surface başlangıç rengi product `defaultColor` olarak kabul edilmez. Üretim malzemesi için kanonik gerçek artık `material: 'sunta'`dır.
