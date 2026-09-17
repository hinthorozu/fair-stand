# 03 — SKIPPED_UNCERTAIN

Bu turda **SKIPPED_UNCERTAIN yok.**

Geri alınan patch yok. Test kırılınca production expectation yeşile çekilmedi:

- `test/autoDepot.test.js` taşıma sırasında syntax bozuldu → production planner değil, kopya düzeltildi.
- `scene3dPublicContract` CRLF + `scene3d.js` import regex false-positive → test parser düzeltildi; `scene3d.js` değişmedi.
