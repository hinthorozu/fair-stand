# DECISION-05 — cornerPlacement vs wallReflow

**KONU:** `resolveAdjacentPlacement` TEST_SUPPORT mi kalsın, testler production `wallReflow`’a mı çekilsin, yoksa ortak core mu (bu turda refactor yok; yalnız seçenek maliyeti)?

## MEVCUT GERÇEK DURUM

### Production consumer

- `src/main.js`: `planContinuousWallInsertion`, `getContinuousWallSegments` (`wallReflow.js`).
- `src/moduleMove.js`: aynı `planContinuousWallInsertion`.
- `src/automaticWall.js`: `planContinuousWallLayout`.
- `src/cornerPlacement.js`: `src/` import **0**.

GitNexus: `resolveAdjacentPlacement` 2 test, 0 process, LOW. `planContinuousWallLayout` 3 direct, process `rebuildSceneFromSetup`.

### Test consumer

- `test/cornerPlacement.test.js` — helper’ın kendi senaryoları.
- `test/rightWallOrientation.test.js` — 270° sağ duvar: helper ile `planContinuousWallLayout` **aynı orientation** assert.
- `test/wallReflow.test.js` — production planner.

### Ortak sorumluluk

Aktif duvara bitişik yerleşim; sağ duvar `rotationZDeg: 270`.

### Farklı davranış

| | `resolveAdjacentPlacement` | `wallReflow` |
| --- | --- | --- |
| Girdi | tek kaynak placement + eklenen genişlik + side | modül listesi / zincir insert |
| İş | aynı duvarda kaydır veya köşe wrap (`getCornerTransition`) | segment cursor, tam zincir, insert gap |
| Çıktı | `{ ok, wrapped, placement, nextSide }` | `{ ok, placements, orderedModuleIds }` |
| Köşe | explicit wrap kuralları | segment geçişi |

Canıtlı production sapması yok; dual model riski: helper yeşil, reflow kırık (veya tersi) yalnız paylaşılan 270° senaryoda yakalanır.

Gerçek runtime modeli: **wallReflow**.

## NEDEN KARAR GEREKİYOR

İki planner. TEST_SUPPORT production bug’ını gizleyebilir.

---

## OPTION A — cornerPlacement TEST_SUPPORT kalır

**Ne yapılır?** Dosya + `cornerPlacement.test.js` + 270° karşılaştırma durur. Docs: reference/helper; insert path `planContinuousWallInsertion`.

**Avantajları:** Kod 0. 270° kilidi durur.

**Dezavantajları:** Dual model. Helper senaryoları production insert’i kapsamaz.

**Runtime / migration:** Yok.

**Test etkisi:** Mevcut suite.

**Test güvenilirliği:** Helper kendi API’sine güvenilir; production insert `wallReflow.test.js` + e2e’ye bağlı.

## OPTION B — Testler wallReflow production davranışına taşınır

**Ne yapılır?** Yeni senaryolar `planContinuousWallInsertion` / `planContinuousWallLayout` üzerinden. Helper testleri daralır veya 270° yalnız reflow. Helper dosyası durabilir (kullanımsız) veya sonra silinir (ayrı SAFE_TO_REMOVE kararı).

**Avantajları:** Test hedefi runtime. Dual kilidin yanlış yeşili azalır.

**Dezavantajları:** `cornerPlacement.test.js` senaryolarının reflow eşleniğini yazmak. Helper senaryosu 1:1 insert değil (tek adım wrap vs zincir).

**Runtime:** Yok (test-only).

**Compatibility:** Yok.

**Test etkisi:** Rewrite; coverage kaybı riski eşleme eksikse.

**Test güvenilirliği:** Production’a yaklaşır. Eşlenmeyen helper kenarları kaybolur.

## OPTION C — Ortak core (refactor; bu brief’te uygulanmaz)

**Ne yapılır?** Wrap/orientation tek fonksiyon; reflow ve helper onu çağırır. Veya helper ince sarmalayıcı.

**Avantajları:** Dual model biter.

**Dezavantajları:** `wallReflow` + testler + `scene3d`/`main` insert. Hotspot bitişiği. Bu turda yasak sınıf (refactor).

**Runtime etkisi:** Insert/reflow sapması mümkün.

**Migration:** Kod; persist yok. Yüksek regression.

**Test:** wallReflow + corner + rightWall + e2e placement.

## DO NOTHING

A ile kod özdeş. MA-004 açık. Risk: iki planner.

## Eksenler (seçim değil)

| Eksen | Seçenek |
| --- | --- |
| Mevcut davranışla en uyumlu | A |
| En az migration | A |
| En az regression | A (C en yüksek) |
| En temiz uzun vadeli model | C (tek core) veya B (test = production, core sonra) |

Blok: MA-004. WP-07.
