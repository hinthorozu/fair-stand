# Fair Stand Roadmap

> Not: ROADMAP'ın FAZ 1–2 ayrıntıları mevcut uygulama tarihçesini temsil eder. FAZ 3 ve FAZ 4 arasındaki kapsam çakışmaları 18 Ağustos 2026'da temizlenmiştir. FAZ 4, custom/parametrik modül üretiminin tek sahibi olarak kabul edilir.

## Proje durumu

- **FAZ 1: KAPANDI — 10 Ağustos 2026**
- **FAZ 2: YERLEŞİM MOTORU KAPANIŞ / POLISH AŞAMASI — 11 Ağustos 2026**
- **FAZ 2.1: temel tamamlandı; 4 yön rotasyon, magnetic snap, serbest yerleşim ve feedback aktif**
- **FAZ 3: PROJELEME / SUNUM / POLISH — final polish aşaması**
- **FAZ 4: PARAMETRİK / CUSTOM MODÜL SİSTEMİ — planlandı, uygulama sırası aşağıda**

---

# FAZ 3 — PROJELEME, SUNUM VE POLISH

FAZ 3'ün amacı stand tasarımını proje olarak saklanabilir, yeniden açılabilir, sunulabilir ve son kullanıcı için üretime hazır hale getirmektir. Parametrik/custom modül üretimi FAZ 4'e taşınmıştır; böylece iki faz aynı özelliğin sahibi değildir.

## FAZ 3 yapılacaklar

- [x] 1. Zemin ayarlanması
- [x] 2. Projenin kaydedilmesi ve tekrar düzenlenebilmesi
- [x] 3. En üste lamba eklenmesi
  - LED projektör tipi: siyah ince floodlight gövde + üst profil braketi + panel yüzüne gerçek SpotLight aydınlatması.
  - Üst aksesuar duvar kapasitesini ve zemin collision hesabını tüketmez; 350 cm üst kotta izin verilen duvar kenarlarına 50 cm snap ile yerleşir.
- [x] 4. Render alınması
  - Mevcut basic current-view render Faz 3 teslimi için yeterli kabul edilmiştir; gelişmiş render seçenekleri bu fazın kapanışını bloklamaz.
- [ ] 5. UI/UX düzenlemesi ve final polish

## FAZ 3 — Final polish checklist

Bu checklist yeni büyük özellik geliştirmek için değil, mevcut editörü Faz 4 öncesinde daha tutarlı ve profesyonel hale getirmek için kullanılacaktır.

- [ ] **1. Sabit dış sahne zemini / ortam görünümü — birinci öncelik.** Stand platformunun dışındaki mevcut boş/açık gri dünya zemini kaldırılacak; kullanıcı seçeneği olmadan sabit, koyu ve daha gerçekçi fuar/stüdyo zemini kullanılacak. Standın kendi 5 cm platform zemini ve zemin tipi sistemi bundan bağımsız kalacak.
- [ ] **2. Sol panel görsel hiyerarşisi.** Mevcut collapsible kartların başlık, spacing, buton ağırlığı ve bölüm ayrımları tutarlı hale getirilecek; Faz 4'te yeni kontroller eklendiğinde panelin dağılmaması hedeflenecek.
- [ ] **3. Sahne seçim feedback'i.** Seçili panel/modül/zemin ve aktif aracın sahnede ilk bakışta anlaşılması sağlanacak; mevcut seçim mantığı korunacak, yalnız görsel geri bildirim netleştirilecek.
- [ ] **4. Durum / başarı / uyarı / hata mesaj standardı.** `stageResult`, `selectionInfo`, `projectStatus`, `assetStatus` ve benzeri kullanıcı mesajları ortak bir UX dili ve görsel hiyerarşiyle sunulacak; kullanıcıya gösterilmesi gereken durumlar yalnız console mesajında kalmayacak.
- [ ] **5. Buton davranış standardı.** Primary / secondary / ghost / danger / disabled davranışları bütün panellerde tutarlı olacak; silme, temizleme ve yeni proje gibi destructive işlemler açık biçimde ayrıştırılacak.
- [ ] **6. Loading ve geçiş durumları.** Save/load, import/export ve görsel yükleme gibi işlemlerde kullanıcı işlemin başladığını, sürdüğünü ve bittiğini net görecek; mevcut loading overlay/state yapıları tutarlı hale getirilecek.
- [ ] **7. Laptop/düşük ekran yüksekliği regresyonu.** Mobil arayüz hedeflenmeden; yaygın laptop çözünürlükleri, düşük viewport yüksekliği ve makul browser zoom seviyelerinde sidebar, toolbar, modal/context menu ve buton taşmaları kontrol edilip düzeltilecek.

### Faz 3 kapanış kriteri

- Yukarıdaki polish checklist tamamlanacak.
- Mevcut proje save/load, LED projektör ve basic render davranışları regresyona uğramayacak.
- `npm test` ve `npm run build` temiz olacak.
- Faz 3 kapandıktan sonra geliştirme odağı Faz 4 Sprint 1 — Parametrik Core'a geçecek.

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
- [ ] Raflar `lighting: none | led` benzeri tek bir parametrik özellik üzerinden **ışıksız / ışıklı** olarak seçilebilecek; iki ayrı temel modül oluşturulmayacak.
- [ ] Işıklı rafta görsel LED etkisi gerçek geometri/material state'inin parçası olacak; mümkün olduğunda emissive yüzey + kontrollü gerçek ışık kullanılarak alt yüzeye hafif aydınlatma verilecek.
- [ ] İlk sürümde LED seçeneği yalnız **açık/kapalı** olacak; renk sıcaklığı, dimmer veya LED konumu gibi ileri ayarlar ancak ortak parametre modeli bozulmadan eklenebilecek şekilde tasarlanacak.
- [ ] Raf lighting state'i Wizard, live preview, save/load ve custom module definition içinde korunacak.
- [ ] İleride BOM/maliyet motorunun okuyabilmesi için ışıklı raf, LED şerit/profil/difüzör/kablo/driver gibi maliyet kalemlerini türetebilecek yeterli metadata taşıyacak; Faz 4'te fiyat hesabı yapılmayacak.
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

## 4.9 — Test, BOM-readiness ve Faz 4 kapanış kriterleri

- [ ] Ölçü constraint'leri ve modül-spesifik validation testleri.
- [ ] Raflı duvar kural testleri.
- [ ] Işıklı/ışıksız raf state'i, preview ve save/load regresyon testleri.
- [ ] Anchor compatibility ve snap testleri.
- [ ] İki noktalı profil üretimi ve bağlı eleman hareketi testleri.
- [ ] Custom modül create/edit/duplicate/delete testleri.
- [ ] Project save/load round-trip testleri.
- [ ] Fair CRM/Kyrox Core entegrasyonu devreye alındığında ownership/authorization testleri.
- [ ] Local repository adapter ile backend repository adapter arasında contract testleri.
- [ ] Mevcut base modüller için regresyon: renk, görsel, cam, seçim, drag/drop, snap ve placement davranışları bozulmayacak.
- [ ] Faz 5/6 assembly-aware BOM için sahne state'i modül kimliği, parametrik ölçüler, panel/yüzey bilgisi ve gerçek `sourceAnchor -> targetAnchor` bağlantılarını kaybetmeden sunabilmeli.
- [ ] BOM-readiness kabul senaryosu: yan yana 4 × 200 cm duvarın dört ayrı instance ve üç gerçek yapısal bağlantı olduğu state üzerinden deterministik biçimde tespit edilebilmeli.
- [ ] `npm test` ve `npm run build` başarılı olmadan Faz 4 tamamlanmış sayılmayacak.

## FAZ 4 yürütme planı — Sprint 1–7

Bu sıra yalnız öneri değildir; Faz 4 geliştirmesinin varsayılan yürütme sırasıdır. Bir sprint kapanmadan sonraki sprintin ona bağımlı production implementasyonuna geçilmez. Gerekirse bağımsız araştırma/prototip paralel yapılabilir.

### Sprint 1 — Parametrik Core (4.1)

**Hedef:** Three.js/UI'dan mümkün olduğunca ayrılmış parametrik veri modeli ve ortak Rule Engine.

- `ParametricModuleDefinition`, base/custom/instance ayrımı ve schema version.
- Ölçü constraint'leri ve açıklanabilir validation sonuçları.
- Parametrik tanımdan deterministik geometry/state üretimi.
- Unit testler.

**Sprint çıkışı:** UI olmadan geçerli bir parametrik tanım doğrulanabilmeli ve aynı girdiden aynı sahne geometrisi/state'i üretilebilmeli.

### Sprint 2 — Wizard + Raflı Duvar pilotu (4.2 + 4.3)

**Hedef:** Çekirdeği gerçek kullanıcı akışında ve gerçek bir parametrik varyasyonda doğrulamak.

- Base modülden `Custom oluştur`.
- Live/ghost preview ve anlık validation.
- Raflı duvarın başlangıç yüksekliği, raf aralığı, raf adedi ve sınır kuralları.
- Raf için ışıklı/ışıksız parametresi; ışıklı durumda emissive/aydınlatma state'i ve gelecekte BOM'a aktarılacak LED metadata'sı.
- Kaydedilmiş custom tanımı tekrar açıp düzenleme.

**Sprint çıkışı:** Kullanıcı kod yazmadan geçerli raflı duvar varyasyonu oluşturabilmeli; aynı varyasyonda ışıklı/ışıksız seçimi yapılabilmeli; Wizard ve sahne aynı Rule Engine'i kullanmalı.

### Sprint 3 — Anchor / Connection Graph (4.4)

**Hedef:** Yapısal ilişkileri koordinat yakınlığı tahmininden çıkarıp açık bağlantı grafiğine taşımak.

- Tipli anchor/connection point'ler.
- Anchor compatibility ve magnetic snap.
- `sourceAnchor -> targetAnchor` state ilişkisi.
- Taşıma/rotasyon sonrası bağlantı yeniden hesaplama veya geçersizlik bildirimi.

**Sprint çıkışı:** Sistem iki modülün yalnız yakın olduğunu değil, hangi anchor'lar üzerinden gerçekten bağlı olduğunu bilmeli. Bu veri ileride shared-part/BOM normalization için kullanılabilir olmalı.

### Sprint 4 — İki Noktalı Kayıt/Profil Aracı (4.5)

**Hedef:** Anchor altyapısını gerçek yapısal üretim aracında kullanmak.

- İlk anchor seçimi.
- `Shift + ikinci anchor` ile profil üretimi.
- Ghost preview, `Esc` iptali.
- Otomatik uzunluk/yön/transform.
- Bağlı modül hareketinde profil ilişkisinin korunması veya açık invalid-state.

**Sprint çıkışı:** Profil koordinat hack'iyle değil iki gerçek anchor referansıyla üretilebilmeli ve state'e kaydedilmeli.

### Sprint 5 — Custom Module Library (4.6)

**Hedef:** Parametrik üretimi tekrar kullanılabilir kullanıcı iş akışına dönüştürmek.

- Create/edit/duplicate/rename/delete.
- Base ve Custom katalog ayrımı.
- `CustomModuleRepository` contract.
- Local/browser persistence adapter; business logic storage API'sine doğrudan bağlanmayacak.

**Sprint çıkışı:** Fair CRM entegrasyonu olmadan custom modüller local adapter üzerinden kalıcı biçimde yönetilebilmeli ve adapter değiştirilebilir olmalı.

### Sprint 6 — Project Save/Load + Versioning (4.8)

**Hedef:** Custom/parametrik sahnenin uzun ömürlü proje state'ine güvenli girmesi.

- Definition ile scene instance ayrımı.
- Instance snapshot.
- Schema version ve migration/fallback.
- Custom tanım silinse/değişse bile eski projenin mümkün olduğunca açılabilmesi.

**Sprint çıkışı:** Parametrik/custom içerikli proje save → close/reload → load round-trip sonrasında aynı yapısal state ve bağlantıları korumalı.

### Sprint 7 — Regresyon + BOM-readiness + Faz 4 kapanışı (4.9)

**Hedef:** Faz 4'ü Fair CRM entegrasyonuna ve sonraki assembly-aware BOM/maliyet fazlarına hazır halde kapatmak.

- Base modül regresyonları.
- Parametrik, raf, anchor, profil, custom library ve save/load testleri.
- Işıklı/ışıksız raf state'i ve BOM metadata regresyonu.
- BOM-readiness state doğrulaması.
- Kabul senaryosu: 4 × 200 cm yan yana duvar = 4 instance + 3 gerçek yapısal bağlantı.
- `npm test` ve `npm run build` temiz.

**Sprint çıkışı:** Faz 5/6 BOM motoru, sahne geometrisini yeniden tahmin etmek zorunda kalmadan modül/bağlantı/yüzey verisini tüketebilmeli.

## Faz 4 sonrası entegrasyon kapısı — Fair CRM / Kyrox Core (4.7)

4.7 bilinçli olarak Sprint 1–7'nin sonrasındadır. Önce Fair Stand'ın parametrik/geometrik contract'ları stabilize edilir; ardından local repository adapter production backend adapter ile değiştirilir.

- Authentication/session: Kyrox Core.
- User/organization/permission: mevcut Core modeli.
- Custom module ownership ve backend persistence: Fair CRM/Core entegrasyon katmanı.
- Fair Stand içinde ikinci login/role/permission sistemi yok.

Bu entegrasyon tamamlandıktan sonra `ROADMAP_PHASE_5_6.md` içindeki assembly-aware BOM ve Fair CRM costing hattına geçilir.

## Önerilen uygulama sırası — kısa referans

1. **Sprint 1 / 4.1:** Parametrik çekirdek ve kural motoru.
2. **Sprint 2 / 4.2 + 4.3:** Wizard + Raflı Duvar pilotu.
3. **Sprint 3 / 4.4:** Anchor sistemi.
4. **Sprint 4 / 4.5:** İki noktalı Kayıt/Profil aracı.
5. **Sprint 5 / 4.6:** Custom modül yaşam döngüsü/kütüphane + local repository adapter.
6. **Sprint 6 / 4.8:** Proje save/load + versiyonlama.
7. **Sprint 7 / 4.9:** Regresyon + BOM-readiness + Faz 4 kapanışı.