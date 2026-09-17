# 03 — TEST_SUPPORT hizası (DECISION-04 A, DECISION-05 B)

## groundLayout

`createGroundLayout` TEST_SUPPORT. Production `scene3d.createRectangularGrid`. Import yok. Dosya başlığı + `test/groundLayout.test.js` kilit.

## cornerPlacement

Production insert: `planContinuousWallInsertion`. `src/main.js` / `moduleMove.js` / `automaticWall.js` / `scene3d.js` `cornerPlacement` import etmez.

Eski helper senaryoları `test/wallReflow.test.js` üzerinden production API ile yazıldı. 270° sağ duvar yalnız `planContinuousWallLayout`. `test/cornerPlacement.test.js` artık production-parallel davranış assert etmez.

`src/cornerPlacement.js` durur (silinmedi); başlık TEST_SUPPORT, production temsil etmez. wallReflow refactor / ortak core yok.
