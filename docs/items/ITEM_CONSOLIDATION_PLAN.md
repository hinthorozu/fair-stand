# Item Consolidation Plan

Canonical Item identity lives in a single runtime file: `src/items.js`.

`src/productionParts.js` and `src/leafItems.js` are not owners. Recipes stay in `src/moduleRecipes.js`. Catalog descriptors stay in `src/catalog.js`.

## Registry groups in `src/items.js`

| Group | Role | `getItem()` |
|---|---|---|
| `LEAF_ITEMS` | Production / BOM leaves | yes, via `getProductionItem()` |
| `COMMERCIAL_ITEMS` | Standalone commercial products | yes |
| `FURNITURE_ITEMS` | Furniture / furniture clusters | yes |
| `INDOOR_PLANT_ITEMS` | Plant family | yes |
| `WALL_MEDIA_ITEMS` | TV / video-wall family | yes |
| `TOP_LIGHT_ITEMS` | Top lights | yes |
| `NON_CATALOG_ITEMS` | Runtime-only (illuminated-foam) | yes |
| `FLOOR_ITEMS` | Floor finishes | yes |
| `COMPOSITE_ITEMS` | Recipe parents (walls, banko, baza, raf, short-up, …) | yes |

`getProductionItem()` remains leaf-only so a composite parent cannot masquerade as a production leaf.

`listRegisteredItems()` returns every declared record.

## Faz 0 — dead-code cleanup

- Removed the parallel leaf registry (`src/productionParts.js`).
- Did not introduce an intermediate `src/leafItems.js`.
- Removed the duplicate `wall-short-up-1/*` and `wall-short-up-2/*` recipe block in `src/moduleRecipes.js`. The second copy was identical dead overwrite of the first.

## Owners after consolidation

| Concern | Owner |
|---|---|
| Item identity / leaf metadata | `src/items.js` |
| Recipe quantities / variants | `src/moduleRecipes.js` |
| Module BOM policy | `src/moduleContracts.js` |
| Catalog cards / resolve key | `src/catalog.js` |
