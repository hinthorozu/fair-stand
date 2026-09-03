# TEMP WORK — Selection Feedback Extraction

Bu dosya yalnızca `refactor/extract-selection-feedback` işi tamamlanana kadar tutulacak.

Kural: Maddeler **tek tek** uygulanacak. Bir madde tamamlanıp doğrulanmadan sonraki maddeye geçilmeyecek.

## Checklist

- [ ] 1. `src/main.js` içine `selectionFeedback.js` importlarını ekle:
  - `DEFAULT_SELECTION_HINT`
  - `describeFloorSelection`
  - `describeSurfaceSelection`
- [ ] 2. Bu import değişikliğini test et.
- [ ] 3. `src/main.js` içindeki lokal `DEFAULT_SELECTION_HINT` sabitini kaldır.
- [ ] 4. Sabit kaldırma değişikliğini test et.
- [ ] 5. Yalnızca `createStandScene(...)` içindeki **surface selection callback** karar mantığını `describeSurfaceSelection(surfaces, currentModules)` helper'ına bağla. `main.js` içinde yalnızca UI state/DOM yazımı kalsın.
- [ ] 6. Surface selection değişikliğini test et.
- [ ] 7. Yalnızca **floor selection callback** mesaj kararını `describeFloorSelection(floorSelection)` helper'ına bağla.
- [ ] 8. Floor selection değişikliğini test et.
- [ ] 9. Selection feedback'e ait eski duplicate karar kodunun `main.js` içinde kalmadığını kontrol et ve yalnızca bu scope içindeki artıkları temizle.
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
