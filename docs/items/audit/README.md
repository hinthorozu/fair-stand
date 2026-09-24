# Item audit arşivi

**Güncel Item sözleşmesi:** [`docs/refactor/ITEMS.md`](../../refactor/ITEMS.md), ölçüler [`docs/refactor/ITEM_DIMENSIONS.md`](../../refactor/ITEM_DIMENSIONS.md), CRM: [`docs/refactor/FAIR_STAND_DB_KULLANIM_KILAVUZU.md`](../../refactor/FAIR_STAND_DB_KULLANIM_KILAVUZU.md).

Bu klasör **tarihsel snapshot**tır (~500 md). Silinmez; kod doğrulanmadan “güncelleme” adı altında toplu rewrite yapılmaz. Tip davranışı artık JS `TYPE_BEHAVIORS` değil — `fair_stand_item_type` (bkz. refactor `TYPE_BEHAVIORS_DB_ROADMAP.md` + `DATABASE.md`).

`dimensions.lengthCm` / `dimensions.thicknessCm` artık geçerli değildir; canonical kutu alanları yalnız **`widthCm`**, **`heightCm`**, **`depthCm`**.

Boyut satırlarını seed ile hizalamak: `python scripts/sync-item-docs-whd-from-seed.py` ve `python scripts/refresh-item-ozellik-matrix-whd.py`.

`report/ITEM_SYSTEM_AUDIT.md` / `.html` / `audit-data.json` — üretilmiş snapshot; güncel mimari için refactor belgelerine bakın.
