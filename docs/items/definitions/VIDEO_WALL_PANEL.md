# VIDEO_WALL_PANEL — Kanonik Item

Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md).

## Kimlik, özellikler ve ölçüler
`src/items.js > NON_CATALOG_ITEMS.VIDEO_WALL_PANEL`. `itemKey = VIDEO_WALL_PANEL`. `catalogVisible=false`. `name = Video Wall Panel`. `type = video-wall-panel` (ayrı factory/behavior yok; yerleştirilmez). Fiziksel panel: `dimensions.widthCm=108.5`, `dimensions.heightCm=61`. `depthCm` mevcut sistemde panel kaynağı olarak yok; yazılmadı. Unit/BOM tahmini yok.

## Parent ilişki
`VIDEO_WALL_2X2` ve `VIDEO_WALL_3X3` `videoWall.panelItemKey = 'VIDEO_WALL_PANEL'` taşır. `rows` / `cols` parent’ta kalır. Panel genişlik/yükseklik parent `videoWall` içinde kopyalanmaz.

## Tüketiciler
`resolveWallMediaMetrics` ve `src/scene3d.js` `createTvModule` panel ölçüsünü `getItem(panelItemKey).dimensions` üzerinden okur. Catalog kartı yoktur.
