# 04 — File changes

Commit yok. Bu tur, başlangıç working-tree cleanup/atlas dosyalarını geri almadı.

## Bu turda değiştirilen / eklenen (remediation)

### Gate / CI
- `scripts/verify-change-contract.mjs`
- `.github/workflows/ci.yml`
- `.github/change-contract.json` (önceki cleanup beyanı üzerine Version2 domain + stale cjs + discovery)
- `SYSTEM_CHANGE_GATE.md`
- `test/systemChangeGateCiContract.test.js`
- `test/systemChangeGateLocalDiff.test.js`

### Inner-corner (test/docs view)
- `test/recipeParentItemKey.js`
- `test/cornerPanelsItemContract.test.js`
- `test/panelCorner192ItemContract.test.js`
- `test/panel197ItemContract.test.js`
- `test/showcaseRecipes.test.js`
- `test/straightPanelsItemContract.test.js`
- `test/wallFlatPanelItemsContract.test.js`
- `docs/items/audit/properties/properties/recipe.innerCornerPanelItemKey.md`
- `docs/items/inventory/ITEM_CAPABILITY_INVENTORY.md`

### Hotspot test
- `test/scene3dPublicContract.test.js` (yeni)

### Test kökü
- `test/autoDepot.test.js` (taşındı)
- `test/moduleBehavior.test.js` (taşındı)
- `tests/autoDepot.test.js` (silindi — taşıma)
- `tests/moduleBehavior.test.js` (silindi — taşıma)
- `src/featureContracts.js` (`regressionFiles` path)
- `test/systemDevelopmentContract.test.js`

### Schema docs (alan silinmedi)
- `docs/items/audit/properties/PROPERTY_INDEX.md`
- `docs/items/audit/properties/properties/static.shelfCount.md`
- `docs/items/audit/properties/properties/static.sizeInch.md`
- `docs/items/audit/properties/properties/catalog.sizeInch.md`
- `docs/items/audit/properties/properties/static.composition.options.shelfCount.md`

### Hijyen docs
- `docs/items/current-system/TV_42.md`, `TV_55.md`, `TV_65.md`, `VIDEO_WALL_2X2.md`, `VIDEO_WALL_3X3.md`
- `SYSTEM_AUDIT_CHECKLIST.md`
- `audit/evidence/A02_CHANGE_GATE.md`
- `RELEASE_HARDENING_ROADMAP.md` (§8/§9; dosya önceki turda da dirty idi)

### Rapor
- `CODE_ATLAS/REMEDIATION/*`

## Bu turda dokunulmayan (önceki working-tree / atlas)

Örnek: `AGENTS.md`, `src/moduleRecipes.js`, `audit/evidence/A21_*`, `docs/items/audit/items/TV_*.md` dump, `docs/items/audit/report/ITEM_SYSTEM_AUDIT.*`, silinmiş `scripts/patch-video-wall-*.cjs`, `CODE_ATLAS/ACTION_PLAN/`, `CODE_ATLAS/MASTER_AUDIT/`, `knip-*.json`, `CLAUDE.md`, `.claude/`.

## Runtime production source

`src/` bu turda yalnız `featureContracts.js` (GOVERNANCE regression path). `scene3d.js`, `main.js`, `items.js`, `itemBom.js`, `expandRecipe` değiştirilmedi.
