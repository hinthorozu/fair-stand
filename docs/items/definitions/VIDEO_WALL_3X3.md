# VIDEO_WALL_3X3 — Kanonik Item

Migration öncesi tam envanter: [current-system/VIDEO_WALL_3X3](../current-system/VIDEO_WALL_3X3.md).
Sözleşme: [ITEM_CONTRACT](../contract/ITEM_CONTRACT.md), [ITEM_CONTRACT_CHECKLIST](../contract/ITEM_CONTRACT_CHECKLIST.md).

## Kimlik, özellikler ve ölçüler
`src/items.js > WALL_MEDIA_ITEMS.VIDEO_WALL_3X3` kanonik itemKey/name/type/sizeInch/videoWall/dimensions sahibidir. **Tekil parametrik Item'dır**; parametreler `videoWall.rows × cols` grid'i ve doğrulanmış panel ölçüsüdür (`panelScreenWidthCm=108.5`, `panelScreenHeightCm=61`). Toplam ekran/modül ölçüleri panel × grid'den türetilir (`325.5 × 183 cm`); `depthCm=5`, `sizeInch=55`. `itemKey = VIDEO_WALL_3X3`. Bu Item N adet ayrı `TV_55`'in bileşimi DEĞİLDİR; composite BOM üretilmez. Doğrulanmış unit YOK; unit/malzeme/renk tahmin edilmedi.

## Oluşturma, state ve kalıcılık
`src/designState.js > createTvModuleState` kanonik Item'ı `resolveWallMediaMetrics` ile çözer; toplam ölçüler panel × grid'den derive edilir. Örnek `id`, `itemKey`, `type`, türetilmiş toplam ölçüler, `sizeInch`, `videoWallRows/Cols=3` ve panel ölçülerini taşır; `heightCm` toplam ekran yüksekliğidir. `tv` state oluşturucu tek oluşturma yoludur; dış tanım ürün defaultlarını tanımlayamaz. Proje load'unda `normalizeModuleItemState` `itemKey` doldurur; `resolveItemKey` eski kaydı `widthCm/sizeInch` üzerinden `VIDEO_WALL_3X3`'e çözer. Takma ad /çift yazım yoktur.

## Davranış, yerleşim ve renderer sınırı
`src/moduleBehavior.js > tv: overlayBehavior()` type kaynağıdır: `wall-overlay` yerleşim, move snap `10 cm`, rotation step `90°`, collision/magnetic snap `none`. `src/scene3d.js > createTvModule()` tek örnek olarak `3×3` grid için 1 cm black seam mesh'leri ekler; bu görsel temsildir, business material/BOM değildir.

## BOM ve tüketiciler
`src/moduleContracts.js` mevcut `wall-media` profilini, `decision-required` politikasını ve `source: null` değerini korur. Reçete/unit/resolver eklenmedi. Değişiklik yalnız kanonik kimlik, tek kaynak sahiplik ve kimlik yönlendirmesini kapsar; ölçü/BOM/yerleşim/render aynı yapı korunur.

## Regresyon ve açık kapsam
`test/wallMediaItemsContract.test.js`: kanonik özellikler, panel×grid türetimi, tekil parametrik yapı (composite reddi), catalog/state eşyapı, `itemKey` doldurma, `decision-required` BOM. `e2e/wall-media-items-contract.spec.mjs`: katalog kartı drag akışı ve kaydedilen projede `itemKey` + grid parametreleri. Yeni bir `video-wall` type açılmadı; renderer/GLB eşyapı korundu.
