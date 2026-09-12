# counter_top_110_60 — Current System Inventory

Fresh `Version2` doğrulaması ve ürün kararı sonrası güncel durum.

## 18-point checklist

| # | Alan | Durum | Güncel gerçek / owner |
|---:|---|---|---|
| 1 | Identity / type | VAR | `itemKey=counter_top_110_60`, `type=counter-top`, `unit=adet` |
| 2 | Intrinsic properties | VAR | `110 × 60 × 1.8 cm`, `material=sunta`, `defaultColor=0xf8fafc`, nominal `100` |
| 3 | Default state | PARENT-OWNED | Counter face state parent counter instance içindedir. |
| 4 | Oluşturma | PARENT-OWNED | Parent counter factory/state oluşturma zinciri. |
| 5 | Placement | PARENT-OWNED | `counter` behavior family. |
| 6 | Move | PARENT-OWNED | Parent counter move zinciri. |
| 7 | Rotation | PARENT-OWNED | Parent counter behavior family. |
| 8 | Snap | PARENT-OWNED | Parent counter behavior family. |
| 9 | Collision | PARENT-OWNED | Parent counter footprint/collision zinciri. |
| 10 | Selection | PARENT-OWNED | Parent module/surface selection. |
| 11 | Context menu | PARENT-OWNED | Parent module context-menu. |
| 12 | Delete / duplicate | PARENT-OWNED | Parent counter instance işlemleri. |
| 13 | Kalıcılık | PARENT-OWNED | Counter module state persist edilir; top leaf ayrı entity değildir. |
| 14 | Relationships / reflow | PARENT-OWNED | Straight/L counter composition tarafından belirlenir. |
| 15 | BOM / composition | VAR | Tekil Item; quantity parent counter recipe sahibidir. |
| 16 | Renderer / asset | OVERRIDE | Specialized counter renderer görsel override yapabilir. |
| 17 | Runtime owners | VAR | `productionParts.js`, `moduleRecipes.js`, counter state/behavior/context/persistence/renderer. |
| 18 | Regression | VAR | Counter-top contract/defaultColor testleri + `boardMaterialItemContract.test.js`. |

Kanonik üretim malzemesi `material: 'sunta'`dır.
