# showcase_side_94_6_30 — Current System Inventory

Fresh `Version2` runtime doğrulaması ve kullanıcı ürün kararı sonrası güncel durum.

## Checklist

| # | Alan | Durum | Güncel gerçek / owner |
|---:|---|---|---|
| 1 | Identity / type | VAR | `itemKey=showcase_side_94_6_30`, `type=showcase-board`, `unit=adet`; canonical owner `src/productionParts.js`. |
| 2 | Intrinsic properties | VAR | `94.6 × 30 × 1.8 cm` (`length × depth × thickness`), `material=sunta`, `defaultColor=0xffffff`; kullanıcı ürün kararı. |
| 3 | Default state | UYGULANMIYOR | Leaf board ayrı project state taşımaz. Beyaz ürün default'u canonical Item'dadır. Parent showcase instance ileride tek gövde renk override'ı taşıyacaktır. |
| 4 | Factory / creation | PARENT-OWNED | Ayrı leaf project factory yok. Parent `wall_showcase_100_2` / showcase module factory instance'ı üretir. |
| 5 | Placement | PARENT-OWNED | Leaf board ayrı yerleştirilmez; parent showcase wall placement contract'ını kullanır. |
| 6 | Move | PARENT-OWNED | Parent showcase module ile birlikte taşınır. |
| 7 | Rotation | PARENT-OWNED | Parent showcase module behavior contract'ıdır. |
| 8 | Snap / collision / connection | PARENT-OWNED | Parent showcase wall snap/collision/connection akışı geçerlidir. |
| 9 | Selection / drag | PARENT-OWNED | Leaf board ayrı selectable/drag entity değildir. |
| 10 | Context menu | PARENT-OWNED | Leaf board için ayrı context menu yoktur. |
| 11 | Delete / duplicate / keyboard | PARENT-OWNED | Parent showcase module üzerinde uygulanır. |
| 12 | Persistence | PARENT-OWNED | Canonical product metadata snapshot'a kopyalanmaz; parent instance state/override persist edilir. |
| 13 | Relationships / reflow | PARENT-OWNED | Leaf board ayrı spatial relationship taşımaz; parent showcase continuous-wall ilişkilerine katılır. |
| 14 | BOM / composition | VAR | Tekil Item; `resolveItemBom()` ile doğrudan canonical BOM satırı üretir. Parent `wall_showcase_100_2` içindeki quantity/cutover bir sonraki parent migrationında tanımlanacaktır. |
| 15 | Renderer / asset / override boundary | PARENT-OWNED / ENTEGRASYON BEKLİYOR | Ayrı leaf renderer yok. Mevcut procedural showcase renderer yan gövdeyi parent seviyesinde çizer. Canonical board ölçü/defaultColor tüketimi parent showcase migrationında bağlanacaktır. |
| 16 | Runtime owners | VAR | Product: `productionParts.js`; direct BOM: `itemBom.js`; parent state: `designState.js`; parent behavior/placement: shared module runtime; parent renderer: `scene3d.js`. |
| 17 | Regression | VAR | `test/showcaseBodyBoardsItemContract.test.js`, `test/boardMaterialItemContract.test.js` + full suite/E2E. |
| 18 | Open decisions / completion | LEAF KAPALI / PARENT ENTEGRASYON BEKLİYOR | Ürün property kararı kapalıdır. Bireysel renk edit'i bilinçli olarak yoktur. Parent recipe, renderer consumption ve tek gövde renk override'ı `wall_showcase_100_2` migrationında tamamlanacaktır. |

## Canonical cutover

`showcase_side_94_6_30` yeni canonical physical Item olarak tanımlandı. Ölçü, sunta material ve beyaz default artık `PRODUCTION_PARTS` kaydında tek ürün gerçeğidir.

Bu Item bireysel renk-editable değildir. Showcase gövdesine kullanıcı rengi verildiğinde gelecekte parent showcase instance tek bir gövde renk override'ı taşıyacak; override iki yan ve iki yatay suntaya birlikte uygulanacak, `glass_shelf` etkilenmeyecektir.

Mevcut `wall_showcase_100_2` legacy recipe ve procedural renderer bu child-only batch'te değiştirilmez.