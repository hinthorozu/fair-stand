# DECISION-04 — groundLayout

**KONU:** `src/groundLayout.js` `createGroundLayout` TEST_SUPPORT olarak mı kalsın, sahneye mi bağlansın, test modeli kaldırılsın mı?

## MEVCUT GERÇEK DURUM

`createGroundLayout(totalWallWidthM)` kare ızgara: default 30 m, padding 5 m, 10 m adım, `cellSizeM: 1`. Dönen: `sizeM`, `divisions`, `centerX`, `leftX`, `rightX`.

GitNexus: 1 caller — `test/groundLayout.test.js`. `src/` import 0. Process 0. Risk LOW.

Production zemin ızgarası: `scene3d.js` `createRectangularGrid(widthM, depthM)` — stand X×Y + `SCENE_SURROUND_M`, LineSegments. **Aynı algoritma değil:** biri tek eksen duvar uzunluğundan kare; diğeri dikdörtgen stand + surround.

Change-gate map: `groundLayout.js` → renderer+placement. Sahne o dosyayı kullanmaz.

Sınıf: TEST_SUPPORT orphan-to-runtime. Production reference modeli **değil** (çıktı/girdi farklı). Gelecek bağ için repo kanıtı (yorum, TODO, contract “sahne bunu kullansın”) yok.

## NEDEN KARAR GEREKİYOR

Gate map vs runtime kopuk. Dosya “ölü” değil (test canlı). Silme SAFE_TO_REMOVE değil.

---

## OPTION A — TEST_SUPPORT olarak koru

**Ne yapılır?** Dosya + `groundLayout.test.js` kalır. Docs/gate: TEST_SUPPORT; production grid `createRectangularGrid`.

**Avantajları:** Kod 0. Testler yeşil.

**Dezavantajları:** İki grid modeli. Test production ızgarayı kilitlemez.

**Runtime / compatibility / migration:** Yok.

**Test etkisi:** Mevcut 3 unit durur. Sahne grid regresyonu bu dosyada yok.

**Test güvenilirliği:** Bu helper’ın kendi matematiği COVERED. Production grid UNCOVERED by this file.

## OPTION B — Runtime ile ortak implementation

**Ne yapılır?** `createStandScene` grid’i `createGroundLayout` (veya ortak fonksiyon) ile üretir.

**Avantajları:** Tek ızgara kuralı. Gate map doğru.

**Dezavantajları:** API uyumsuz (kare vs dikdörtgen). Ya sahne kareye döner (görünüm değişir) ya helper dikdörtgene genişler (test beklentisi değişir). `scene3d` hotspot.

**Runtime etkisi:** Zemin çizgisi boyutu/konumu.

**Backward compatibility:** Görsel; persist yok.

**Test etkisi:** `groundLayout.test.js` + sahne/e2e duman.

**Migration:** Renderer bağ. Orta–yüksek regression (hotspot).

**Test güvenilirliği:** Production’ı kilitler **ancak** mevcut helper semantiği production ile aynı değil; birleştirme semantik seçim ister.

## OPTION C — Test modelini kaldır; production’ı doğrudan test et

**Ne yapılır?** `groundLayout.js` + test silinir veya test `createRectangularGrid` / sahne kontratına taşınır.

**Avantajları:** Dual model biter. Test hedefi production.

**Dezavantajları:** SAFE_TO_REMOVE=0 iken silme kararı. WebGL’siz `createRectangularGrid` extract gerekebilir. 3 unit kaybı.

**Runtime etkisi:** Yok (yalnız test/helper).

**Compatibility:** Yok.

**Test etkisi:** Yeni sahne/grid testi yazılmadan coverage düşer.

**Test güvenilirliği:** Helper kalkınca **o** matematiğin kilidi gider; production kilidi ancak yeni test varsa artar.

## DO NOTHING

Dosya + 3 test + yanlış gate çağrışımı. Risk: ajan sahneyi `createGroundLayout` sanır. MA-009 açık.

## Eksenler (seçim değil)

| Eksen | Seçenek |
| --- | --- |
| Mevcut davranışla en uyumlu | A |
| En az migration | A |
| En az regression | A (C runtime 0 ama test silme) |
| En temiz uzun vadeli model | B (ortak grid) veya C (tek production test hedefi) |

Blok: MA-009. WP-07. `scene3d.js` B’de dokunulur — hotspot kuralı.
