# A02 / F-005 Düzeltme Kapanışı

Bulgu: `F-005` — Change-gate yol/alan duvarı eksik; denetlenen 20/51 `src/` dosyasının zorunlu eşlemesi yoktu.
Önem: `P1`
Durum: **CLOSED**

## Düzeltme

- `src/systemChangeContract.js` içindeki kısmi yol kuralları ve dosya adı kalıbı yedek yolu `SOURCE_FILE_REQUIRED_DOMAINS` ile değiştirildi.
- `audit/evidence/A03_ARCHITECTURE.md` tarafından kurulan sahiplik haritası kullanılarak güncel **51 `src/` dosyasının** tümü açıkça sınıflandırıldı.
- Önceden eşlenmemiş yüksek değerli kaynakların artık zorunlu alanları vardır; bunlar arasında `main.js`, `tvConfig.js`, `standSetup.js`, `standCapacity.js`, `viewKeyboardShortcuts.js`, `colorEditorInputs.js`, `groundLayout.js` ve `wall.js` bulunur.
- Çok sorumluluklu orkestrasyon/renderer kaynakları, tek bir kazara dosya adı türevli sınıflandırma yerine bilinen çapraz-alan etkilerini gerektirir.
- Sahiplik otoritesi olarak genel `Controller|Feedback => ui` eşlemesi kaldırıldı; UI/controller dosyaları açıkça sınıflandırılır.

## Regresyon koruması

`test/systemChangeGate.test.js` artık gerçek `src/` dizinini sayar ve şunları doğrular:

1. her güncel kaynak dosyanın tam olarak bir açık harita girişi vardır,
2. her giriş en az bir zorunlu etki alanına çözülür,
3. her eşlenen alan kanonik 17-alan şemasına aittir,
4. yüksek riskli kaynaklar sahipliğe uygun alanlar taşır,
5. `main.js` bilinen çapraz-alan sorumluluklarını sessizce düşüremez.

Bu nedenle sınıflandırma olmadan eklenen gelecekteki bir `src` dosyası regresyon paketini düşürür.

## Doğrulama

PR: `#40 — Fix F-005 complete source impact-domain mapping`
Kapanış kayıtlarından önceki uygulama head: `dc8f654106cc7454042421f3fa217deb610e4143`
PR CI çalıştırması: `#107` / `33801523370`

Doğrulanan başarılı adımlar:

- Change contract gate: passed
- Install dependencies: passed
- Full `npm test`: passed, yeni kaynak-harita regresyonu dahil
- `npm run build`: passed

Hiçbir runtime ürün davranışı veya saklı-proje şeması değiştirilmedi.

## Sonuç

F-005 koşulu kaldırıldı: güncel kaynak dosyalar artık sıfır zorunlu etki alanı taşırken korunamaz ve yeni kaynak dosyalar açık bir sahiplik/alan sınıflandırması olmadan depoya giremez.
