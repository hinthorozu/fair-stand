# 04 — Öncelik planı

Graph CRITICAL ≠ P0. P0 yalnız aktif runtime yanlışlığı / veri kaybı / ciddi kaçan regression.

## P0 — 0 paket

CONFIRMED runtime bug yok. Hub impact (`getItem` 60/79 CRITICAL) P0 yapılmadı.

## P1 — 4 paket

| Sıra | WP | Neden P1 |
| --- | --- | --- |
| 1 | WP-01 Change gate | CI Version2 birikmiş yüzeyi görmez; `not-applicable` + hub dosyalar yanlış yeşil üretebilir |
| 2 | WP-02 Capability SoT | İki surface kuralı; docs geniş, map dar |
| 3 | WP-03 Contract rolü | Canonical SoT tablosu executable değil; karar şart |
| 4 | WP-04 BOM kararı | HIGH ürün boşluğu; kod ikinci |

## P2 — 4 paket

| Sıra | WP | Neden P2 |
| --- | --- | --- |
| 5 | WP-05 Inner-corner ad | Production path tek; docs/test alias |
| 6 | WP-08 Hotspot test | Bakım / regression kalkanı |
| 7 | WP-06 Schema | Unread/stale alan; silme kararı şart |
| 8 | WP-07 Test-support | Dual planner / groundLayout / iki test kökü |

## P3 — 1 paket

| Sıra | WP | Neden P3 |
| --- | --- | --- |
| 9 | WP-09 Docs/hijyen | Ghost path, py, trigger txt |

## Uygulama kuralı

1. P1 kapı (WP-01) önce: sonraki işlerin contract’ı gerçek yüzeyi görsün.  
2. B paketleri (WP-03, WP-04, WP-06/07’nin karar kısımları) kararsız implemente edilmez.  
3. `getItem` / `getModuleBehavior` / `createStandScene` gövdesi bu planın refactor hedefi değil.  
4. Inner-corner production expand path’ine dokunulmaz (WP-05 yalnız ad).
