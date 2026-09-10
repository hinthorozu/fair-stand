# door_100 — Current System Inventory

`ITEM_CONTRACT.md` ve `ITEM_CONTRACT_CHECKLIST.md` fresh okunarak `Version2` runtime zincirinden çıkarılan ilk Bileşik Item envanteri.

## 18-point checklist

| # | Alan | Durum | Canonical gerçek / owner |
|---:|---|---|---|
| 1 | Identity / type | VAR | `itemKey=door_100`, `type=door`, `unit=adet`; eski uppercase katalog kimliği kaldırılır. |
| 2 | Intrinsic properties | VAR | Parent için doğrulanmış `widthCm=100`; unverified material/defaultColor/özel height-depth uydurulmaz. |
| 3 | Default state | VAR | Parent state canonical `itemKey/type/width` ile oluşur; child leaf kendi beyaz default'unu taşır. |
| 4 | Factory / creation | VAR | `createDoorModuleState` → `getItem('door_100')`; catalog girişi aynı canonical Item'dan türetilir. |
| 5 | Placement | VAR | `type=door` → `WALL_BEHAVIOR.placement=wall`. |
| 6 | Move | VAR | Ortak module move motoru; `moveSnapCm=50`. |
| 7 | Rotation | VAR | Ortak behavior; `rotationStepDeg=90`, default 0°. |
| 8 | Snap | VAR | Standard magnetic snap + stand-edge boundary. |
| 9 | Collision / connection | VAR | Segment collision, physical depth, segment endpoint; mevcut parity korunur. |
| 10 | Selection / drag | VAR | Parent module drag/selection mevcut ortak motoru kullanır; leaf surface module selection modundadır. |
| 11 | Context menu | VAR | Parent module delete/duplicate/side-add devam eder; leaf panel-only glass/Lightbox/Mesh açmaz. |
| 12 | Delete / duplicate / keyboard | VAR | Ortak parent module zinciri; duplicate nested child override'larını clone eder ve yeni instance/surface id üretir. |
| 13 | Persistence | VAR | Parent `itemKey=door_100`, type/width/placement/nested surfaces proje state'inde saklanır; leaf `itemKey=door_leaf_100` korunur. |
| 14 | Relationships / reflow | VAR | Parent continuous wall relationship/reflow motoruna katılır; child composition business ilişkisi recipe üzerinden tanımlıdır. |
| 15 | BOM / composition | VAR | `door_100` recipe-backed Bileşik Item; 6 child satırı tek canonical recipe'den gelir; `resolveItemBom` recursive leaf BOM üretir. |
| 16 | Renderer / asset boundary | VAR | Parent procedural door renderer `type=door` üzerinden çalışır; leaf color/image capability Item'dan; renderer BOM kaynağı değildir. |
| 17 | Runtime owners | VAR | `items.js`, `catalog.js`, `designState.js`, `moduleBehavior.js`, `moduleContracts.js`, `moduleRecipes.js`, `itemBom.js`, `scene3d.js`, persistence/main. |
| 18 | Regression / completion | VAR | Composite identity, recipe parity, recursive BOM, factory/persistence identity, behavior/contract ve browser catalog construction testleri zorunlu. |

## Canonical chain

```text
door_100 Item
→ type=door / WALL_BEHAVIOR
→ createDoorModuleState()
→ project instance id + itemKey=door_100
→ existing placement / move / rotation / context / renderer / persistence
→ composition: door:100 recipe
→ recursive Item BOM
→ profile_91 / upright_346_5 / panel_98 / connectors / door_leaf_100
```

Eski uppercase katalog kimliği için runtime compatibility bağı tutulmaz.
