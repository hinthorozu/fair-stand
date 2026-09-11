# VIDEO_WALL_2X2 — Canonical Item

Migration öncesi tam envanter: [current-system/VIDEO_WALL_2X2](../current-system/VIDEO_WALL_2X2.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Identity, properties ve ölçüler
`src/items.js > WALL_MEDIA_ITEMS.VIDEO_WALL_2X2` canonical itemKey/name/type/sizeInch/videoWall/dimensions sahibidir. **Tekil parametrik Item'dır**; parametreler `videoWall.rows × cols` grid'i ve verified panel ölçüsüdür (`panelScreenWidthCm=108.5`, `panelScreenHeightCm=61`). Toplam ekran/modül ölçüleri panel × grid'den türetilir (`217 × 122 cm`); `depthCm=5`, `sizeInch=55`. `catalogKey = itemKey = VIDEO_WALL_2X2`. Bu Item N adet ayrı `TV_55`'in bileşimi DEĞİLDİR; composite BOM üretilmez. Doğrulanmış unit YOK; unit/malzeme/renk tahmin edilmedi.

## Factory, state ve persistence
`src/designState.js > createTvModuleState` canonical Item'ı `resolveWallMediaMetrics` ile çözer; toplam ölçüler panel × grid'den derive edilir. Instance `id`, `itemKey`, `catalogKey`, `type`, türetilmiş toplam ölçüler, `sizeInch`, `videoWallRows/Cols=2` ve panel ölçülerini taşır; `heightCm` toplam ekran yüksekliğidir. `tv` state factory tek oluşturma yoludur; dış descriptor ürün defaultlarını tanımlayamaz. Proje load'unda `normalizeModuleItemState` `catalogKey → itemKey` hydration'ı yapar; `resolveModuleCatalogKey` legacy state'i `widthCm/sizeInch` üzerinden `VIDEO_WALL_2X2`'ye çözer. Alias/dual-write yoktur.

## Behavior, placement ve renderer sınırı
`src/moduleBehavior.js > tv: overlayBehavior()` type kaynağıdır: `wall-overlay` placement, move snap `10 cm`, rotation step `90°`, collision/magnetic snap `none`. `src/scene3d.js > createTvModule()` tek instance olarak `2×2` grid için 1 cm black seam mesh'leri ekler; bu görsel temsildir, business material/BOM değildir.

## BOM ve tüketiciler
`src/moduleContracts.js` mevcut `wall-media` profilini, `decision-required` politikasını ve `source: null` değerini korur. Reçete/unit/resolver eklenmedi. Değişiklik yalnız canonical kimlik, source-of-truth ownership ve identity routing'i kapsar; ölçü/BOM/placement/render parity korunur.

## Regression ve açık kapsam
`test/wallMediaItemsContract.test.js`: canonical properties, panel×grid türetimi, tekil parametrik yapı (composite reddi), catalog/state parity, `catalogKey → itemKey` hydration, `decision-required` BOM. `e2e/wall-media-items-contract.spec.mjs`: katalog kartı drag akışı ve kaydedilen projede `itemKey/catalogKey` + grid parametreleri. Yeni bir `video-wall` type açılmadı; renderer/GLB parity korundu.
