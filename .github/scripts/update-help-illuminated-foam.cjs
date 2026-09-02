const fs = require('fs');
const path = 'src/helpGuide.js';
let s = fs.readFileSync(path, 'utf8');
function rep(from,to,label){ if(!s.includes(from)) throw new Error(label); s=s.replace(from,to); }

rep(
"        <li><strong>Çoğalt Sağ / Sol:</strong> Aynı modülün kopyasını belirtilen tarafa ekler.</li>\n",
"        <li><strong>Çoğalt Sağ / Sol:</strong> Aynı modülün kopyasını belirtilen tarafa ekler.</li>\n        <li><strong>Boyutlandır…:</strong> Işıklı Strafor seçiliyken mevcut X/Y ölçülerini açar; yeni ölçüler girildiğinde aynı modül konumu ve ışık rengi korunarak yeniden boyutlandırılır.</li>\n",
'right click resize help'
);

const anchor = "  {\n    title: 'Cam Panel',";
const section = `  {\n    title: 'Işıklı Strafor',\n    html: \`\n      <p>Işıklı Strafor, SVG logoyu 3B strafor gövde ve arka halo ışığıyla duvar üzerine yerleştirir. Özellik yalnızca SVG görsellerde kullanılabilir.</p>\n      <h4>Oluşturma</h4>\n      <ol>\n        <li>SVG dosyasını Görsel Kütüphanesine yükle.</li>\n        <li>Görsel üzerinde <strong>sağ tık → Işıklı Strafora Dönüştür</strong> seç.</li>\n        <li>Açılan pencerede gerçek dış ölçüyü <strong>X · Genişlik (cm)</strong> ve <strong>Y · Yükseklik (cm)</strong> olarak gir.</li>\n        <li>Mouse ile duvara götürüp uygun konuma bırak.</li>\n      </ol>\n      <ul>\n        <li>Strafor gövde kalınlığı sabit <strong>3,5 cm</strong>'dir.</li>\n        <li>Duvar ile strafor arasında sabit <strong>1,5 cm</strong> ışık boşluğu vardır.</li>\n        <li>X ve Y ölçüleri birbirinden bağımsızdır; girilen değerler sahnedeki gerçek dış ölçüyü belirler.</li>\n        <li>Ön yüzde SVG'nin kendi renkleri korunur.</li>\n      </ul>\n      <h4>Sonradan boyutlandırma</h4>\n      <p>Sahnedeki strafora <strong>sağ tık → Boyutlandır…</strong> ile mevcut X/Y ölçülerini tekrar açabilirsin. Yeni ölçüler uygulandığında modülün mevcut konumu, SVG görseli ve ışık rengi korunur.</p>\n      <h4>Işık rengini değiştirme</h4>\n      <p>Işıklı Straforu seçtiğinde sol taraftaki <strong>Seçili yüzey</strong> bölümünde <strong>Işıklı Strafor · Işık rengi</strong> kontrolü görünür. Renk seçici yalnızca arkadaki halo ışığını değiştirir; SVG'nin ön yüz renklerini değiştirmez.</p>\n      <p class=\"help-guide-note\">Yerleştirme sırasında Esc tuşu ile işlem iptal edilebilir. Strafor, duvar üstü modül gibi taşınır ve kendi hareket snap adımını kullanır.</p>\n    \`,\n  },\n`;
if(!s.includes(anchor)) throw new Error('section anchor not found');
s=s.replace(anchor, section + anchor);

fs.writeFileSync(path,s);
