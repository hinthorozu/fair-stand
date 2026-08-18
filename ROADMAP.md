# Fair Stand Roadmap

> Not: ROADMAP'ın FAZ 1–2 ayrıntıları mevcut uygulama tarihçesini temsil eder. FAZ 3 ve FAZ 4 arasındaki kapsam çakışmaları 18 Ağustos 2026'da temizlenmiştir. FAZ 4, custom/parametrik modül üretiminin tek sahibi olarak kabul edilir.

## Proje durumu

- **FAZ 1: KAPANDI — 10 Ağustos 2026**
- **FAZ 2: YERLEŞİM MOTORU KAPANIŞ / POLISH AŞAMASI — 11 Ağustos 2026**
- **FAZ 2.1: temel tamamlandı; 4 yön rotasyon, magnetic snap, serbest yerleşim ve feedback aktif**
- **FAZ 3: PROJELEME / SUNUM / POLISH — devam ediyor**
- **FAZ 4: PARAMETRİK / CUSTOM MODÜL SİSTEMİ — planlandı, uygulama sırası aşağıda**

---

# FAZ 3 — PROJELEME, SUNUM VE POLISH

FAZ 3'ün amacı stand tasarımını proje olarak saklanabilir, yeniden açılabilir, sunulabilir ve son kullanıcı için üretime hazır hale getirmektir. Parametrik/custom modül üretimi FAZ 4'e taşınmıştır; böylece iki faz aynı özelliğin sahibi değildir.

## FAZ 3 yapılacaklar

- [x] 1. Zemin ayarlanması
- [ ] 2. Projenin kaydedilmesi ve tekrar düzenlenebilmesi
- [ ] 3. En üste lamba eklenmesi
  - LED projektör tipi: siyah ince floodlight gövde + üst profil braketi + panel yüzüne gerçek SpotLight aydınlatması.
  - Üst aksesuar duvar kapasitesini ve zemin collision hesabını tüketmez; 350 cm üst kotta izin verilen duvar kenarlarına 50 cm snap ile yerleşir.
- [ ] 4. Render alınması
- [ ] 5. UI/UX düzenlemesi ve final polish

## FAZ 3 — Zemin teknik kararları

- Aktif stand platformu **daima 5 cm yüksekliğinde** kalacaktır; zemin tipi, renk ve texture değişiklikleri bu kotu değiştirmeyecektir.
- **Karolaj:** gerçek ölçekte 100 × 100 cm; aktif alan sonunda kalan ölçü otomatik kırpılır (ör. 450 cm = 100 + 100 + 100 + 100 + 50). Karolaj color picker ile boyanabilir, derz/grid çizgileri renk değişiminde görünür kalır.
- **Parke:** serbest boyama yerine üç hazır doku seçeneği kullanılacaktır: Açık/Kirli Beyaz, Açık Naturel-Sarı ve Grimsi. Referans görsellerdeki yazı, ölçü, ok, logo veya watermark kullanılmayacaktır; yalnızca renk ve yüzey karakteri referans alınacaktır.
- **Halı / Halıfleks:** rip halı/halıfleks karakterinde ince dokulu texture kullanılacaktır. Texture sabit kalırken color picker üzerinden renk değiştirilebilecek; renk değişimi doku detayını yok etmeyecektir.

---

# FAZ 4 — PARAMETRİK / CUSTOM MODÜL SİSTEMİ — PLANLANDI

FAZ 4'ün amacı mevcut modül kütüphanesini **referans/base modül** olarak koruyup, ortak bir kural motoru üzerinden yeni varyasyonlar, yapısal bağlantılar ve kullanıcıya özel custom modüller üretmektir.

## FAZ 4 temel ilkeleri

- Mevcut base modüller bozulmayacak ve hızlı kullanım için korunacak.
- Kullanıcı base modülü kopyalayarak kendi varyasyonunu oluşturabilecek.
- Custom modül; renk, görsel atama, cam panel, seçim, drag & drop, snap ve placement state gibi desteklenen base davranışlarını miras alacak.
- Sistem serbest CAD'e dönüşmeyecek; üretim tanımlı parametre, bağlantı ve validation kuralları içinde kalacak.
- Wizard ve sahne içi düzenleme **aynı parametrik veri modeli ve aynı validation motorunu** kullanacak; iki ayrı kural sistemi oluşturulmayacak.
- Base modül, custom modül ve sahne instance'ı birbirinden ayrılacak. Sahnedeki instance değişikliği yanlışlıkla base tanımını değiştirmeyecek.

## 4.1 — Parametrik çekirdek ve kural motoru

- [ ] Ortak `ParametricModuleDefinition` / eşdeğer veri modeli oluşturulacak.
- [ ] Base modül kimliği, custom modül kimliği, kaynak/base ilişkisi ve schema/version metadata'sı tanımlanacak.
- [ ] Parametrik ana ölçüler varsayılan olarak **50–500 cm** arasında ve **50 cm katları** olacak.
- [ ] Modül türü gerektiğinde daha dar sınır tanımlayabilecek; ortak motor bu constraint'leri uygulayacak.
- [ ] Validation sonucu yalnızca true/false olmayacak; kullanıcıya hangi kuralın neden ihlal edildiğini bildirecek.
- [ ] Placement/collision, ölçü ve modül-spesifik kurallar tek doğrulama katmanında birleştirilecek.
- [ ] Parametrik tanımdan Three.js geometrisi/state'i deterministik olarak üretilecek; rebuild aynı girdiden aynı sonucu vermeli.
- [ ] Kural motoru için birim testleri yazılacak.

## 4.2 — Modül Wizard ve canlı önizleme

- [ ] Base modülden `Custom oluştur` akışı eklenecek.
- [ ] Wizard yalnızca seçilen modül tipinin izin verdiği parametreleri gösterecek.
- [ ] Sayısal alanlar 50 cm snap/constraint kurallarını anında doğrulayacak.
- [ ] Parametre değişiklikleri sahnede **live preview/ghost preview** olarak gösterilecek.
- [ ] Geçersiz konfigürasyon kaydedilemeyecek; sebebi kullanıcıya açıkça gösterilecek.
- [ ] Kaydedilmiş custom modül tekrar Wizard'da açılıp düzenlenebilecek.
- [ ] Sahnedeki instance üzerinden `Custom modülü düzenle` akışı tanımlanacak; düzenlemenin yalnız instance'a mı yoksa kayıtlı custom tanıma mı uygulanacağı kullanıcıya açık olacak.

## 4.3 — İlk referans implementasyon: Raflı Duvar

- [ ] Raflı sistem ayrı temel geometri değil, **duvar modülünün parametrik varyasyonu** olacak.
- [ ] Raf zemine/en alt profile doğrudan yerleştirilemeyecek.
- [ ] Raf en üst profile doğrudan yerleştirilemeyecek.
- [ ] Raflar arasındaki minimum mesafe **50 cm / 1 panel** olacak.
- [ ] Konfigürasyon `başlangıç yüksekliği + raf aralığı + raf adedi` parametreleriyle tanımlanacak.
- [ ] Bu parametrelerin toplamı izin verilen yüksekliği aşıyorsa işlem reddedilecek ve sığmama nedeni gösterilecek.
- [ ] Aynı raf validation'ı Wizard, live preview ve sahne içi düzenlemede ortak kullanılacak.
- [ ] Raflı duvar, renk/görsel/cam/selection/placement davranışlarında base duvar ile uyumlu kalacak.

## 4.4 — Yapısal bağlantı / Anchor sistemi

Bu bölüm, separatör–duvar ve benzeri yapısal elemanları koordinat tahminiyle değil açık bağlantı noktalarıyla bağlamak için temel oluşturur.

- [ ] Modüller gerektiğinde tipli **anchor/connection point** tanımlayabilecek.
- [ ] Anchor; dünya konumu, yön/normal, bağlantı tipi ve izin verilen hedef tiplerini taşıyacak.
- [ ] Duvar, separatör ve yapısal profiller için gerekli anchor noktaları üretilecek.
- [ ] Yakındaki uyumlu anchor'lar magnetic snap ile seçilebilecek; uyumsuz bağlantı reddedilecek.
- [ ] Bağlantı ilişkisi sadece koordinat olarak değil `sourceAnchor -> targetAnchor` referansı olarak state'e kaydedilecek.
- [ ] Bağlı eleman taşınır/döndürülürse bağımlı bağlantının yeniden hesaplanması veya kullanıcıya geçersiz bağlantı uyarısı verilmesi tanımlanacak.
- [ ] Separatör → duvar, duvar → separatör ve uygun olduğunda modül → modül bağlantıları aynı altyapıyı kullanacak.

## 4.5 — İki nokta arasında kayıt/profil çekme aracı

- [ ] Sahneye ayrı bir **Kayıt/Profil aracı** eklenecek.
- [ ] Kullanıcı ilk geçerli anchor/noktayı seçerek başlangıcı belirleyecek.
- [ ] `Shift + ikinci nokta/anchor seçimi` ile bitiş belirlenecek ve aradaki profil otomatik üretilecek.
- [ ] İlk seçimden sonra ikinci seçim yapılana kadar ghost çizgi/profil önizlemesi gösterilecek.
- [ ] `Esc` işlemi iptal edecek; yeni profil ancak iki uç da geçerliyse oluşturulacak.
- [ ] Profil uzunluğu iki nokta arasından otomatik hesaplanacak; elle uzunluk girme zorunluluğu olmayacak.
- [ ] Profil yönü ve transform'u iki anchor'dan türetilecek; kullanıcı serbest açı girmek zorunda kalmayacak.
- [ ] Profil tipi/kesiti desteklenen katalogdan seçilebilecek; fiziksel kesit ve izin verilen maksimum/minimum uzunluk parametreleri tanımlanabilecek.
- [ ] Profil bağlantısı anchor referanslarıyla saklanacak; bağlı modül hareket ettiğinde profil yeniden hesaplanabilecek.
- [ ] Profil için collision/stand sınırı/uygun bağlantı doğrulamaları ortak kural motorundan geçecek.

## 4.6 — Custom modül yaşam döngüsü ve kütüphane

- [ ] Custom modüle ad, kategori, açıklama, base modül referansı ve parametrik config kaydedilecek.
- [ ] Kullanıcı custom modülü kopyalayabilecek, yeniden adlandırabilecek, düzenleyebilecek ve silebilecek.
- [ ] Base modüller read-only korunacak; custom işlemleri base tanımı mutate etmeyecek.
- [ ] Katalogda `Base Modüller` ve `Custom Modüller` ayrımı yapılacak; kategori/arama/filtreleme desteklenebilecek.
- [ ] Custom modül silindiğinde sahnedeki mevcut instance'ların davranışı açıkça tanımlanacak; proje açılışını bozmayacak snapshot/version yaklaşımı kullanılacak.
- [ ] Base modül şeması değiştiğinde custom modüller için schema version/migration stratejisi uygulanacak; sessiz veri bozulmasına izin verilmeyecek.

## 4.7 — Fair CRM / Kyrox Core entegrasyonu: kullanıcı sahipliği ve persistence

**Karar:** Faz 4'ün geometrik ve parametrik sistemi önce Fair Stand içinde bağımsız olarak tamamlanacaktır. Fair Stand içinde ikinci bir login, kullanıcı veya organizasyon sistemi geliştirilmeyecektir. Gerçek kullanıcı sahipliği, authorization ve kalıcı kullanıcı kütüphanesi; sistem oturduktan sonra mevcut **Fair CRM + Kyrox Core** kimlik altyapısına bağlanacaktır.

Fair Stand geliştirme aşamasında persistence katmanı doğrudan belirli bir backend'e kilitlenmeyecek. UI ve parametrik çekirdek, `CustomModuleRepository` / eşdeğer soyut bir repository contract üzerinden çalışacak. İlk geliştirme sırasında bu contract local/browser persistence ile uygulanabilir; Fair CRM entegrasyonunda aynı contract'ın backend implementasyonu devreye alınacaktır.

- [ ] Fair Stand içinde bağımsız kullanıcı/login sistemi **yapılmayacak**.
- [ ] Custom modül çekirdeği kullanıcı kimliğinden bağımsız çalışacak; ownership entegrasyon sınırında eklenecek.
- [ ] Local geliştirme için repository interface + local persistence adapter oluşturulacak; business logic `localStorage` veya başka bir storage API'sine doğrudan bağlanmayacak.
- [ ] Fair CRM entegrasyon aşamasında authentication/session kaynağı Kyrox Core olacak; Fair Stand kendi credential store'unu tutmayacak.
- [ ] Her custom modül backend tarafında Core/Fair CRM kimliğiyle eşleşen `ownerUserId` / eşdeğer sahiplik alanıyla ilişkilendirilecek.
- [ ] Kullanıcı varsayılan olarak yalnız kendi private custom modüllerini görecek ve değiştirecek.
- [ ] Sistem/base modüller kullanıcıdan bağımsız, global ve read-only kalacak.
- [ ] Listeleme/oluşturma/güncelleme/silme işlemlerinde ownership **server-side** doğrulanacak; yalnız frontend filtresine güvenilmeyecek.
- [ ] Organization üyeliği ve yetkileri gerekiyorsa mevcut Kyrox Core organization/permission modeli kullanılacak; Fair Stand içinde paralel role/permission sistemi oluşturulmayacak.
- [ ] İlk production tesliminde custom modül visibility'si `private` olabilir; ileride `organization/shared` aynı veri modeli genişletilerek eklenecek.
- [ ] Fair CRM/Kyrox Core entegrasyonu tamamlanmadan önce repository contract için contract testleri hazırlanacak; local adapter ile backend adapter aynı davranışı sağlamalı.

## 4.8 — Proje kaydı, versiyonlama ve geriye uyumluluk

- [ ] Proje kaydı custom modül instance'larını tekrar açabilecek yeterli parametrik snapshot ile saklayacak.
- [ ] Proje açılırken custom tanım silinmiş/değişmiş olsa bile mümkün olduğunca kaydedilmiş snapshot render edilecek.
- [ ] Parametrik schema version proje dosyasına/state'ine yazılacak.
- [ ] Eski projeler için migration/fallback stratejisi olacak.
- [ ] Base modül güncellemesinin mevcut custom modülleri otomatik ve sessiz biçimde değiştirmesine izin verilmeyecek.

## 4.9 — Test ve Faz 4 kapanış kriterleri

- [ ] Ölçü constraint'leri ve modül-spesifik validation testleri.
- [ ] Raflı duvar kural testleri.
- [ ] Anchor compatibility ve snap testleri.
- [ ] İki noktalı profil üretimi ve bağlı eleman hareketi testleri.
- [ ] Custom modül create/edit/duplicate/delete testleri.
- [ ] Project save/load round-trip testleri.
- [ ] Fair CRM/Kyrox Core entegrasyonu devreye alındığında ownership/authorization testleri.
- [ ] Local repository adapter ile backend repository adapter arasında contract testleri.
- [ ] Mevcut base modüller için regresyon: renk, görsel, cam, seçim, drag/drop, snap ve placement davranışları bozulmayacak.
- [ ] `npm test` ve `npm run build` başarılı olmadan Faz 4 tamamlanmış sayılmayacak.

## Önerilen uygulama sırası

1. **4.1 Parametrik çekirdek ve kural motoru** — diğer her şey bunun üstüne kurulacak.
2. **4.2 Wizard + live preview** — parametrik modeli kullanıcıya açan ilk yüzey.
3. **4.3 Raflı Duvar** — çekirdeği gerçek ve sınırlı bir modülle doğrulayan pilot implementasyon.
4. **4.4 Anchor sistemi** — yapısal ilişkileri koordinat hack'lerinden kurtaran temel.
5. **4.5 İki noktalı Kayıt/Profil aracı** — anchor altyapısının ilk güçlü sahne aracı.
6. **4.6 Custom modül yaşam döngüsü/kütüphane** — üretimi gerçek kullanıcı iş akışına dönüştürür; bu aşamada repository contract/local adapter yeterlidir.
7. **4.8 Proje kaydı + versiyonlama entegrasyonu** — custom içerik kalıcı proje state'ine güvenli biçimde girer.
8. **4.7 Fair CRM/Kyrox Core entegrasyonu** — sistem oturduktan sonra auth, gerçek ownership ve backend persistence mevcut CRM/Core altyapısına bağlanır.
9. **4.9 Regresyon, repository contract, authorization ve Faz 4 kapanışı**.

### Sıralama gerekçesi

- Profil aracını anchor sisteminden önce yapmak, sonradan bağlantı modelini yeniden yazdırır.
- Fair CRM/Kyrox Core entegrasyonunu parametrik/geometrik model oturmadan yapmak API ve DB sözleşmesini gereksiz yere birkaç kez değiştirebilir.
- Fair Stand içinde ayrı login/role/permission sistemi kurmak mevcut Core kimlik altyapısını tekrar etmek olur; bundan özellikle kaçınılacaktır.
- Repository abstraction sayesinde Fair Stand geliştirilirken local persistence kullanılabilir; production entegrasyonunda parametrik business logic değiştirilmeden backend adapter'a geçilir.
- Raflı duvarı erken yapmak kural motorunu küçük ama gerçek bir problem üzerinde test eder.
- Proje save/load ile custom module persistence aynı şey değildir: proje bir **instance snapshot'ı**, custom kütüphane ise yeniden kullanılabilir **definition** saklar. İkisi ayrı tutulmalıdır.
- Faz 3'teki eski `Kendi modülünü oluşturma` maddesi Faz 4'e taşındı; böylece roadmap'te aynı özellik iki farklı fazda tekrar etmiyor.
