# A21 F-045 kapanışı

Bulgu: **F-045 — tek-seferlik kaynak-yeniden-yazan yama betikleri kanonik araçların yanında kalır**

Durum: **CLOSED** (DECISION-07 ARCHIVE; PR/post-merge CI bu turda yok)

## Düzeltme

Üç Python rewriter aktif `scripts/` yüzeyinden alındı:

- `scripts/archive/add-tv-sizes.py`
- `scripts/archive/add-video-wall-2x2.py`
- `scripts/archive/fix-tv-screen-face.py`

`scripts/archive/README.md` bunların aktif tooling olmadığını yazar. `package.json` / CI çalıştırmaz. `test/pythonPatchArchive.test.js` arşiv yolunu ve aktif path yokluğunu kilitler.

## Doğrulama

Bu kapanış commit/push beklemez. Runtime/BOM/UI etkisi yok.
