# Autosave Integration Invariants

Bu dosya canlı autosave akışını controller'a bağlarken korunması gereken davranışları sabitler.

- Watch interval: 1000 ms.
- Değişiklik algılanınca save debounce: 5000 ms.
- Aynı signature tekrar görülürse yeni save planlanmaz.
- Yeni değişiklik mevcut pending save'i iptal edip 5 saniyeyi yeniden başlatır.
- Autosave persist çağrısı `{ quiet: true }` ile yapılır.
- Başarılı autosave sonrası güncel state signature baseline olur.
- Persist hatasında autosave enabled kalır ve kullanıcıya `Otomatik kayıt başarısız.` gösterilir.
- Yeni proje oluşturma / proje restore / beforeunload sırasında autosave disable edilir.
- İlk başarılı proje kaydı ve proje restore sonrası autosave güncel state'ten enable edilir.
- Manuel save ve rename öncesi pending autosave iptal edilir; başarılı kayıt sonrası güncel state baseline yapılır.
- Asset silme sırasında referans temizliği kalıcılaştırılıyorsa pending autosave iptal edilir; persist sonrası güncel state baseline yapılır.

`src/autosaveController.js` ve `test/autosaveController.test.js` bu davranışın controller kontratını korur. `test/autosaveMainIntegration.test.js` ise `main.js` içinde ikinci bir legacy timer/state döngüsünün tekrar oluşmasını engeller.
