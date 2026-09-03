# TEMP WORK — Selection Feedback Extraction

Bu dosya yalnızca `refactor/extract-selection-feedback` işi tamamlanana kadar tutulacak.

Kural: Maddeler **tek tek** uygulanacak. Bir madde tamamlanıp doğrulanmadan sonraki maddeye geçilmeyecek.

> Not: `DEFAULT_SELECTION_HINT` importu tek başına build edilemiyor; aynı isimdeki lokal `const` ile çakışıyor. Bu nedenle 1–4 teknik olarak tek atomik hazırlık adımı olarak uygulandı ve birlikte doğrulandı. Surface/floor callback mantığına bu adımda dokunulmadı.

## Checklist

- [x] 1. `src/main.js` içine `selectionFeedback.js` importlarını ekle:
  - `DEFAULT_SELECTION_HINT`
  - `describeFloorSelection`
  - `describeSurfaceSelection`
- [x] 2. Import hazırlığını doğrula.
- [x] 3. `src/main.js` içindeki lokal `DEFAULT_SELECTION_HINT` sabitini kaldır.
- [x] 4. Atomik import + lokal sabit kaldırma değişikliğini test/build ile doğrula.
- [x] 5. Yalnızca `createStandScene(...)` içindeki **surface selection callback** karar mantığını `describeSurfaceSelection(surfaces, currentModules)` helper'ına bağla. `main.js` içinde yalnızca UI state/DOM yazımı kalsın.
- [x] 6. Surface selection değişikliğini helper testleri + build ile doğrula.
- [x] 7. Yalnızca **floor selection callback** mesaj kararını `describeFloorSelection(floorSelection)` helper'ına bağla.
- [x] 8. Floor selection değişikliğini focused selection testleri + integration guard + build ile doğrula.
- [x] 9. `createStandScene(...)` selection wiring bloğunda eski duplicate karar kodunun kalmadığını doğrula; ek temizlik gerekmedi.
- [ ] 10. Tam doğrulama çalıştır:
  - `npm ci`
  - `npm test`
  - `npm run build`
- [ ] 11. Gerçek `src/main.js` değişikliği branch'e commit edildikten ve doğrulamalar yeşil olduktan sonra `.github/workflows/temp-selection-feedback-extraction.yml` dosyasını kaldır.
- [ ] 12. Final branch diff'ini kontrol et. Selection-feedback işi dışında değişiklik olmamalı.
- [ ] 13. PR CI yeşil olduktan ve iş tamamlandıktan sonra **bu `TEMP_WORK.md` dosyasını sil**.

## Final hedef

`main.js` selection mesajının ne olacağına karar vermeyecek.

Akış:

`selection geldi -> selectionFeedback helper karar verdi -> main.js sonucu UI'a yazdı`

Bu checklist tamamlanmadan başka bir `main.js` refactor işine başlanmayacak.
