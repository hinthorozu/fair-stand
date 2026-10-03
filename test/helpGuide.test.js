import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const mainSource = fs.readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
const styleEntry = fs.readFileSync(new URL('../src/configuratorStyles.js', import.meta.url), 'utf8');
const guideSource = fs.readFileSync(new URL('../src/helpGuide.js', import.meta.url), 'utf8');
const guideCss = fs.readFileSync(new URL('../src/helpGuide.css', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../index.html', import.meta.url), 'utf8');

test('in-app help guide is wired into the application', () => {
  assert.match(styleEntry, /import '\.\/helpGuide\.css';/);
  assert.match(html, /src="\/src\/configuratorStyles\.js"/);
  assert.match(mainSource, /import \{ initHelpGuide \} from '\.\/helpGuide\.js';/);
  assert.match(mainSource, /initHelpGuide\(\);/);
});

test('help guide exposes a fixed question-mark launcher and collapsible sections', () => {
  assert.match(guideSource, /button\.textContent = '\?';/);
  assert.match(guideSource, /document\.createElement\('details'\)/);
  assert.match(guideSource, /Kullanım Kılavuzu/);
  assert.match(guideSource, /Mouse Kontrolleri/);
  assert.match(guideSource, /Klavye Kısayolları/);
  assert.match(guideSource, /Sağ Tık Menüsü/);
  assert.match(guideSource, /Stand Oluşturma ve Sistem Standartları/);
  assert.match(guideSource, /<strong>Kaydet:<\/strong> sahne varken/);
  assert.match(guideSource, /değişiklik en geç 60 saniye içinde kaydedilir/);
  assert.match(guideSource, /<strong>Farklı Kaydet:<\/strong> sahne varken aktiftir/);
  assert.match(guideSource, /müşteri aynı kalır/);
  assert.match(guideSource, /Sahne yokken kapalıdır/);
  assert.match(guideSource, /Çöp Kutusu/);
  assert.match(guideSource, /katalog kartı sahneye sürüklenebilir/);
  assert.match(guideSource, /Sahneyi Sıfırla/);
  assert.match(guideSource, /Ölçü \/ opacity…/);
  assert.match(guideSource, /o yüz panellerdeki gibi mavi çerçeve ile seçilir/);
  assert.match(guideSource, /item satırındaki bayraklardan açılır/);
  assert.match(guideSource, /Lightbox aydınlatması yalnız o yüzde yanar/);
  assert.match(guideSource, /küpün gövdesi yanmaz/);
  assert.match(guideSource, /Kutu yürütme/);
  assert.match(guideSource, /Taban zeminin altına inmez/);
  assert.match(guideSource, /Kutunun tepesi stand tavanını geçmez/);
  assert.match(guideSource, /title: 'Kutu Blok'/);
  assert.match(guideSource, /Duvara yapışmaz/);
  assert.match(guideSource, /Üst ve alt yüze görsel, Lightbox veya Mesh uygulanmaz/);
  assert.match(guideSource, /Adım 10 cm’dir/);
  assert.match(guideSource, /Kutuyu zeminde sürüklemek yüksekliği bozmaz/);
  assert.match(guideSource, /Shift\+R<\/strong> kutuyu 90° döndürür/);
  assert.match(guideSource, /Aynı ölçü penceresi panel, Lightbox ve Mesh için geçerlidir/);
  assert.match(guideSource, /Panel, Lightbox ve Mesh görseli aynı pencereden ölçülür/);
  assert.match(guideSource, /Küpü sürüklemek kamerayı döndürür/);
  assert.match(guideSource, /Üretim Listesi/);
  assert.match(guideSource, /<strong>Metin indir<\/strong>/);
  assert.match(guideSource, /görselin dosya adı, cm ölçüsü ve m²/);
  assert.match(guideSource, /altında o görselin toplam m²/);
  assert.match(guideSource, /panelin rengi hex olarak yazar/);
  assert.match(guideSource, /scene dimensions varsa oradan, o alan boşsa item dimensions/);
  assert.match(guideSource, /Tüm Özellikleri Kaldır/);
});

test('help guide describes the single floor rectangle and reset clearing it', () => {
  assert.match(guideSource, /title: 'Zemin'/);
  assert.match(guideSource, /<strong>Zemin Kaplaması<\/strong> standın tamamının baz kaplamasıdır/);
  assert.match(guideSource, /<strong>Zemin Alanı Ekle<\/strong>/);
  assert.match(guideSource, /50 cm ve katlarıdır ve standın içinde kalır/);
  assert.match(guideSource, /<strong>Sahnede Çiz<\/strong>/);
  assert.match(guideSource, /<strong>Zemin Alanını Sil<\/strong>/);
  assert.match(guideSource, /Aynı anda yalnız bir alan vardır/);
  assert.match(guideSource, /Hazır parke kendi malzemesini kullanır ve boyanmaz/);
  assert.match(guideSource, /Alanın rengi baz renkten ayrıdır/);
  assert.match(guideSource, /sahnedeki modüller ve zemin alanı silinir/);
});

test('help guide supports close button, backdrop click and Escape', () => {
  assert.match(guideSource, /help-guide-close/);
  assert.match(guideSource, /event\.target === backdrop/);
  assert.match(guideSource, /event\.key === 'Escape'/);
  assert.match(guideCss, /\.help-guide-button\s*\{/);
  assert.match(guideCss, /\.help-guide-backdrop\s*\{/);
});
