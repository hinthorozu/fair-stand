const GUIDE_SECTIONS = [
  {
    title: 'Hızlı Başlangıç',
    open: true,
    html: `
      <p>Stand tipini seç, X ve Y ölçülerini gir ve <strong>Sahneyi Oluştur</strong> ile çalışmaya başla. Sonra katalogdan modül ekleyebilir, sahnedeki modülleri taşıyabilir ve panel yüzeylerini özelleştirebilirsin.</p>
      <div class="help-guide-callout"><strong>Temel akış:</strong> Sahne oluştur → Modül ekle → Yerleştir → Panel seç → Renk / görsel / cam / bez uygula → Kaydet veya Render Al.</div>
    `,
  },
  {
    title: 'Mouse Kontrolleri',
    html: `
      <table><tbody>
        <tr><th>Sol tık</th><td>Panel, modül veya zemini seçer.</td></tr>
        <tr><th>Modülü tut + sürükle</th><td>Modülü geçerli yerleşim kurallarına göre taşır.</td></tr>
        <tr><th>Ctrl/Cmd + tık</th><td>İlk panel ile tıklanan panel arasında çoklu panel seçimi yapar.</td></tr>
        <tr><th>Boş alanda sol sürükle</th><td>Kamerayı stand etrafında döndürür.</td></tr>
        <tr><th>Orta tuş / tekerleğe basılı sürükle</th><td>Kamerayı yatay-dikey kaydırır (pan).</td></tr>
        <tr><th>Mouse tekerleği</th><td>Yakınlaştırır / uzaklaştırır.</td></tr>
        <tr><th>Sağ tık</th><td>Modül veya panel için bağlama göre işlem menüsünü açar.</td></tr>
      </tbody></table>
    `,
  },
  {
    title: 'Klavye Kısayolları',
    html: `
      <table><tbody>
        <tr><th>R</th><td>Seçili modülü saat yönünde döndürür. Sürükleme sırasında da kullanılabilir.</td></tr>
        <tr><th>Shift + R</th><td>Seçili modülü ters yönde döndürür.</td></tr>
        <tr><th>↑ ↓ ← →</th><td>Seçili modülü kendi snap adımına göre ekranda görülen yöne taşır.</td></tr>
        <tr><th>Delete</th><td>Sahnede tek modül seçiliyse modülü siler. Görsel kütüphanesinde bir görsel seçili/odaktaysa görsel silme uyarısını açar.</td></tr>
        <tr><th>Esc</th><td>Açık sağ tık menüsü, katalog veya yardım penceresini kapatır.</td></tr>
        <tr><th>Enter</th><td>X/Y alanlarında uygunsa sahne oluşturmayı; proje adı alanında kaydetmeyi tetikler.</td></tr>
      </tbody></table>
      <p class="help-guide-note">Not: Döndürme adımı modüle göre değişebilir. Standart modüllerde çoğunlukla 90°, bazı banko ve ürünlerde 45° kullanılabilir.</p>
    `,
  },
  {
    title: 'Sağ Tık Menüsü',
    html: `
      <p>Menü içeriği seçilen modül veya panelin desteklediği özelliklere göre değişir.</p>
      <ul>
        <li><strong>Sil:</strong> Modülü sahneden kaldırır.</li>
        <li><strong>Çoğalt Sağ / Sol:</strong> Aynı modülün kopyasını belirtilen tarafa ekler.</li>
        <li><strong>Cam Panele Çevir / Normal Panele Çevir:</strong> Uygun panelin cam durumunu değiştirir.</li>
        <li><strong>Lightbox Kumaşa Çevir / Lightbox Kumaştan Çıkar:</strong> Uygun panel bloğunu tek parça lightbox bezine dönüştürür veya geri alır.</li>
        <li><strong>Lightbox aydınlatmayı aç / kapat:</strong> Bez yüzeyinin aydınlatmasını kontrol eder.</li>
        <li><strong>Raf altı aydınlatmayı aç / kapat:</strong> Raf modülündeki LED görünümünü kontrol eder.</li>
        <li><strong>Ekle Sağ / Sol Tarafa…:</strong> Hedef modülün yanına katalogdan yeni modül ekler.</li>
      </ul>
    `,
  },
  {
    title: 'Panel Seçimi ve Çoklu Seçim',
    html: `
      <p>Tek panel için normal sol tık kullanılır. Çoklu seçimde önce başlangıç panelini seç, ardından <strong>Ctrl/Cmd + tık</strong> ile diğer sınır paneline tıkla.</p>
      <ul>
        <li>Panel seçimi fiziksel panel yüzeylerini esas alır.</li>
        <li>Bağlı duvar/köşe düzenlerinde seçim duvar zinciri boyunca devam edebilir.</li>
        <li>Bez oluşturma için seçim daha katıdır: eksiksiz dikdörtgen ve aynı düzlem şarttır.</li>
      </ul>
    `,
  },
  {
    title: 'Modül Taşıma, Döndürme ve Yerleşim',
    html: `
      <p>Modüller serbestçe görünse de bırakıldıkları konum sistem kurallarıyla doğrulanır. Stand sınırı, çarpışma ve modülün kendi snap adımı kontrol edilir.</p>
      <ul>
        <li>Duvar modülleri çoğunlukla 50 cm adımla hareket eder.</li>
        <li>Mobilya ve bazı serbest objeler genellikle 10 cm adım kullanır.</li>
        <li>LED projektör gibi üst elemanlarda farklı snap adımı uygulanabilir.</li>
        <li>Geçersiz yerleşim kabul edilmez; modül eski/geçerli konumunda kalır.</li>
        <li>Birden fazla modülü kaplayan tek parça beze bağlı modül tek başına taşınamaz veya döndürülemez; önce bez kaldırılmalıdır.</li>
      </ul>
    `,
  },
  {
    title: 'Renk Uygulama',
    html: `
      <p>Uygun panel, modül yüzeyi veya boyanabilir zemin seçildikten sonra aktif renk uygulanabilir.</p>
      <ul>
        <li>HEX, RGB ve CMYK alanları birbirine senkron çalışır.</li>
        <li>RGB aralığı 0–255, CMYK aralığı %0–100'dür.</li>
        <li>Hazır parke kaplamalarında doğrudan renk boyama yerine hazır malzeme kullanılır.</li>
      </ul>
    `,
  },
  {
    title: 'Görsel Kütüphanesi ve Görsel Uygulama',
    html: `
      <ul>
        <li><strong>Dosya Seç:</strong> Görseli aktif projenin görsel arşivine ekler.</li>
        <li><strong>Doldur:</strong> Alanı tamamen kaplar; gerekirse görüntüyü kırpar.</li>
        <li><strong>Sığdır:</strong> Görselin tamamını seçili alana sığdırır.</li>
        <li><strong>Kaldır:</strong> Görseli panel/bez üzerinden kaldırır; kütüphaneden silmez.</li>
        <li>Dikdörtgen çoklu panel seçiminde tek büyük görsel panellere bölünerek uygulanabilir.</li>
        <li>Lightbox bezine görsel tek parça olarak uygulanır.</li>
      </ul>
      <h4>Görsel silme</h4>
      <p>İki yöntem vardır: görsel üzerinde <strong>sağ tık → Sil</strong> veya görsele normal tıklayıp <strong>Delete</strong> tuşuna basmak.</p>
      <p>Görsel sahnede kullanılıyorsa önce uyarı gösterilir. Onaylanırsa görsel hem kütüphaneden silinir hem de atandığı panel/bezlerden anında kaldırılır.</p>
    `,
  },
  {
    title: 'Cam Panel',
    html: `
      <p>Cam özelliğini destekleyen paneli seçip sağ tık menüsünden <strong>Cam Panele Çevir</strong> seçeneğini kullanabilirsin. Aynı menüden tekrar normal panele döndürülebilir.</p>
      <p class="help-guide-note">Cam görsel/şeffaf baskı davranışları geliştikçe bu bölüm güncellenecektir.</p>
    `,
  },
  {
    title: 'Bez / Lightbox',
    html: `
      <p>Bez oluşturmak için en az iki panel seçilmeli; seçim eksiksiz dikdörtgen ve aynı düzlemde olmalıdır.</p>
      <ul>
        <li>Beze renk ve görsel uygulanabilir.</li>
        <li>Doldur ve Sığdır seçenekleri kullanılabilir.</li>
        <li>Lightbox aydınlatması açılıp kapatılabilir.</li>
        <li>Lightbox Kumaştan Çıkar ile normal panel sistemine dönülür.</li>
        <li>Tek parça bez birden fazla modülü kapsıyorsa bu modüllerden biri tek başına taşınamaz/döndürülemez.</li>
      </ul>
    `,
  },
  {
    title: 'Raf Aydınlatması',
    html: `
      <p>Raf modülünde sağ tık menüsünde <strong>Raf altı aydınlatmayı aç / kapat</strong> seçeneği görünür. Bu seçenek sadece destekleyen raf modüllerinde gösterilir.</p>
    `,
  },
  {
    title: 'Modül Ekleme ve Katalog',
    html: `
      <ul>
        <li>Sahne oluşturulduktan sonra Modül Ekle aktif olur.</li>
        <li>Katalogdan bir veya birden fazla modül seçilebilir.</li>
        <li>Aynı modül birden fazla kez seçim sırasına eklenebilir.</li>
        <li>Seçim sırasındaki modüller sürüklenerek yeniden sıralanabilir.</li>
        <li>Modüller duvarın sonuna veya seçili modülün sağ/sol tarafına eklenebilir.</li>
        <li>Yerleşim bırakılmadan önce sistem tarafından doğrulanır.</li>
      </ul>
    `,
  },
  {
    title: 'Stand Oluşturma ve Sistem Standartları',
    html: `
      <table><tbody>
        <tr><th>Sistem yüksekliği</th><td>350 cm</td></tr>
        <tr><th>Sistem derinliği</th><td>10 cm</td></tr>
        <tr><th>Düz panel</th><td>7 × 50 cm yatay bölüm</td></tr>
        <tr><th>Standart genişlikler</th><td>50 / 100 / 150 / 200 cm</td></tr>
        <tr><th>Zemin grid</th><td>100 × 100 cm</td></tr>
        <tr><th>Stand ölçü adımı</th><td>50 cm ve katları</td></tr>
        <tr><th>Pasif çevre alanı</th><td>100 cm gri alan</td></tr>
        <tr><th>Maksimum stand alanı</th><td>5000 × 5000 cm (50 × 50 m)</td></tr>
      </tbody></table>
      <p>Stand tipleri: Sırt Duvar, U Stand, L Stand Sol, L Stand Sağ ve Ada Stand.</p>
    `,
  },
  {
    title: 'Zemin',
    html: `
      <p>Mevcut seçenekler: Karolaj 100 × 100 cm, Halı, Beyaz Meşe, Sarı Meşe ve Beton Parke.</p>
      <p>Boyanabilir zemin seçiliyse Aktif renk uygulanabilir. Hazır parke tipleri kendi malzemelerini kullanır.</p>
    `,
  },
  {
    title: 'Proje Kaydetme, Açma ve Yedekleme',
    html: `
      <ul>
        <li><strong>Yeni:</strong> Yeni çalışma başlatır; kaydedilmemiş değişiklikler için uyarı verir.</li>
        <li><strong>Kaydet:</strong> Stand, modüller, yerleşimler ve proje durumunu kaydeder.</li>
        <li><strong>Otomatik kayıt:</strong> Kayıtlı/açılmış projede değişiklik algılandıktan yaklaşık 5 saniye sonra çalışır.</li>
        <li><strong>Aç:</strong> Kayıtlı projeyi görselleriyle birlikte yükler.</li>
        <li><strong>Dışarı Aktar:</strong> Proje ve görselleri ZIP dosyasına paketler.</li>
        <li><strong>İçe Aktar:</strong> Uyumlu proje ZIP paketini sisteme alır.</li>
        <li><strong>Sil:</strong> Projeyi ve projeye ait görselleri onay sonrası kaldırır.</li>
      </ul>
    `,
  },
  {
    title: 'Render Al',
    html: `
      <p><strong>Render Al</strong>, mevcut kamera görünümünü yüksek çözünürlüklü PNG olarak indirir. Dosya adı proje adından üretilir.</p>
      <p>Seçim çerçeveleri ve yardımcı duvar çizgileri render çıktısına dahil edilmez.</p>
    `,
  },
  {
    title: 'Önemli Kurallar ve Uyarılar',
    html: `
      <ul>
        <li>Çoklu panel seçimi ile bez oluşturma aynı kural değildir; bez için aynı düzlem ve eksiksiz dikdörtgen zorunludur.</li>
        <li>Geçersiz modül yerleşimleri ve çarpışmalar sistem tarafından engellenir.</li>
        <li>Kütüphaneden kullanılan bir görsel silinirse, onay sonrası atandığı yüzeylerden de kaldırılır.</li>
        <li>Birden fazla modülü kapsayan tek parça bez varken bağlı modüller ayrı ayrı taşınamaz/döndürülemez.</li>
        <li>Sağ tık menüsündeki seçenekler her modülde aynı değildir; yalnız desteklenen işlemler gösterilir.</li>
      </ul>
    `,
  },
];

function createGuideSection(section) {
  const details = document.createElement('details');
  details.className = 'help-guide-section';
  details.open = Boolean(section.open);

  const summary = document.createElement('summary');
  summary.innerHTML = `<span>${section.title}</span><span class="help-guide-chevron" aria-hidden="true"></span>`;

  const body = document.createElement('div');
  body.className = 'help-guide-section-body';
  body.innerHTML = section.html;

  details.append(summary, body);
  return details;
}

export function initHelpGuide() {
  if (document.querySelector('#help-guide-button')) return;

  const button = document.createElement('button');
  button.id = 'help-guide-button';
  button.className = 'help-guide-button';
  button.type = 'button';
  button.textContent = '?';
  button.title = 'Kullanım kılavuzu';
  button.setAttribute('aria-label', 'Kullanım kılavuzunu aç');
  button.setAttribute('aria-expanded', 'false');

  const backdrop = document.createElement('div');
  backdrop.id = 'help-guide-backdrop';
  backdrop.className = 'help-guide-backdrop';
  backdrop.hidden = true;
  backdrop.innerHTML = `
    <section class="help-guide-dialog" role="dialog" aria-modal="true" aria-labelledby="help-guide-title">
      <header class="help-guide-header">
        <div>
          <p class="help-guide-eyebrow">MAXIMA STAND KONFİGÜRATÖRÜ</p>
          <h2 id="help-guide-title">Kullanım Kılavuzu</h2>
          <p>Mouse, klavye, seçim, modül, görsel, lightbox, proje ve sistem kuralları.</p>
        </div>
        <button type="button" class="help-guide-close" aria-label="Kılavuzu kapat">×</button>
      </header>
      <div class="help-guide-content"></div>
    </section>
  `;

  const content = backdrop.querySelector('.help-guide-content');
  GUIDE_SECTIONS.forEach((section) => content.appendChild(createGuideSection(section)));

  document.body.append(button, backdrop);

  const closeButton = backdrop.querySelector('.help-guide-close');
  let previousFocus = null;

  function openGuide() {
    previousFocus = document.activeElement;
    backdrop.hidden = false;
    document.body.classList.add('help-guide-open');
    button.setAttribute('aria-expanded', 'true');
    closeButton.focus({ preventScroll: true });
  }

  function closeGuide() {
    if (backdrop.hidden) return;
    backdrop.hidden = true;
    document.body.classList.remove('help-guide-open');
    button.setAttribute('aria-expanded', 'false');
    if (previousFocus?.focus) previousFocus.focus({ preventScroll: true });
    else button.focus({ preventScroll: true });
  }

  button.addEventListener('click', openGuide);
  closeButton.addEventListener('click', closeGuide);
  backdrop.addEventListener('pointerdown', (event) => {
    if (event.target === backdrop) closeGuide();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !backdrop.hidden) {
      event.preventDefault();
      closeGuide();
    }
  });
}
