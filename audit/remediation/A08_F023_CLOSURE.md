# A08 F-023 kapanışı

Bulgu: **F-023 — Tüm proje silme, proje ve asset store’lar arasında atomik değil**

Durum: **CLOSED / POST-MERGE VERIFIED**

## Kök neden

Tüm-proje silme, proje görüntü varlıklarını ve proje kaydını ayrı IndexedDB işlemleriyle kaldırıyordu. Bu işlemler arasında bir hata bu yüzden kalıcılığı kısmen silinmiş durumda bırakabilirdi: varlıklar kaldırılıp proje kaydı hayatta kalabilir veya temizlik davranışı iki store arasında başka şekilde sapabilirdi.

## Düzeltme

Uygulama PR **#73 — Fix F-023 atomic whole-project deletion** o bölünmüş akışı tek kanonik tüm-proje silme işlemiyle değiştirdi.

Düzeltme:

- `src/projectStore.js` içinde `deleteProjectWithAssets(projectId)` ekledi,
- hem `projects` hem `image-assets` üzerinde bir `readwrite` işlemi açar,
- hedef projeye ait her görüntü varlığını ve proje kaydını aynı işlem içinde siler,
- kullanıcı tetikli proje silmesini o tek atomik işlemi çağırır hale getirir,
- başarısız-içe-aktarma geri alımını aynı atomik temizlik yolunu kullanır hale getirir,
- tek-görüntü silmeyi ve mevcut IndexedDB/şema sürümlerini değiştirmeden bırakır.

Hiçbir Item/BOM, yerleşim, renderer, katalog, proje-şeması veya arşiv-formatı davranışı kasıtlı olarak değiştirilmedi.

## Doğrulama

Son uygulama PR head: `a78d48ea570873d86899f762e1cf03e32f528349`.

PR CI çalıştırması **#308 / run `33997615392`** başarıyla tamamlandı:

- change contract gate: success,
- full unit/integration test suite: success,
- production build: success,
- Playwright runner + Chromium install: success,
- Chromium E2E: success.

Hedefli kapsam, tüm-proje silmenin tek bir store-aşırı işlem kullandığını, ana silme yolunun ve başarısız-içe-aktarma geri alımının her ikisinin kanonik atomik API'yi kullandığını ve Chromium'un başka bir projenin verisine dokunmadan hedef projeyi artı varlıklarını kaldırdığını kanıtlar.

PR #73, `c118c6d4269a335334972bb88e36a3fc7491c9bc` olarak `ROG`'a birleştirildi.

Birleştirme sonrası `ROG` CI çalıştırması **#309 / run `33997841213`** başarıyla tamamlandı:

- change contract gate: success,
- full unit/integration test suite: success,
- production build: success,
- Playwright runner + Chromium install: success,
- Chromium E2E: success.

## Sonuç

Tüm-proje silme artık IndexedDB işlem sınırında proje kaydı ve görüntü varlıkları boyunca hep-ya-da-hiç'tir. İşlem başarısız olursa veritabanı kısmi bir tüm-proje silmeyi commit etmez.

A08, F-021 ve F-022 ayrı açık kalıcılık bulguları olduğu için daha geniş bir `GAP` bölümü olarak kalır.

**F-023 is CLOSED.**
