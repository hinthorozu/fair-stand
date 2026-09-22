# Item audit arşivi

**Güncel Item sözleşmesi:** [`docs/refactor/ITEMS.md`](../../refactor/ITEMS.md), ölçüler [`docs/refactor/ITEM_DIMENSIONS.md`](../../refactor/ITEM_DIMENSIONS.md).

Bu klasördeki audit raporları (2026 öncesi tarama) referans içindir. `dimensions.lengthCm` / `dimensions.thicknessCm` artık geçerli değildir; canonical kutu alanları yalnız **`widthCm`**, **`heightCm`**, **`depthCm`**.

Boyut satırlarını seed ile hizalamak: `python scripts/sync-item-docs-whd-from-seed.py` ve `python scripts/refresh-item-ozellik-matrix-whd.py`.

`report/ITEM_SYSTEM_AUDIT.md` / `.html` / `audit-data.json` — üretilmiş snapshot; güncel mimari için refactor belgelerine bakın.
