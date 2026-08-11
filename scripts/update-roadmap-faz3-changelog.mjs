import fs from 'node:fs';

const roadmapPath = 'ROADMAP.md';
let roadmap = fs.readFileSync(roadmapPath, 'utf8');
const faz3 = `\n\n---\n\n# FAZ 3 — PROJELEME, SUNUM VE ÖZELLEŞTİRME\n\nFAZ 3'ün amacı, stand tasarımını yalnızca sahnede düzenlemekten çıkarıp proje olarak saklanabilir, yeniden açılıp düzenlenebilir, görsel olarak sunulabilir ve kullanıcı tarafından genişletilebilir hale getirmektir.\n\n## FAZ 3 yapılacaklar\n\n- [ ] 1. Zemin ayarlanması\n- [ ] 2. Projenin kaydedilmesi ve tekrar düzenlenebilmesi\n- [ ] 3. En üste lamba eklenmesi\n- [ ] 4. Render alınması\n- [ ] 5. Kendi modülünü oluşturma\n`;

if (!roadmap.includes('# FAZ 3 — PROJELEME, SUNUM VE ÖZELLEŞTİRME')) {
  roadmap = roadmap.trimEnd() + faz3 + '\n';
  fs.writeFileSync(roadmapPath, roadmap);
}

const changelogPath = 'Changelog.md';
let changelog = fs.readFileSync(changelogPath, 'utf8');
const today = `\n\n## 11 Ağustos 2026 — Serbest mobilya modülleri ve FAZ 3 planlaması\n\n- Koltuk Takımı toplam footprint'i 150 × 150 cm olarak kesinleştirildi.\n- Tekli koltuklar 65 cm genişlikte korunarak iki tekin toplam dış hizası 150 cm olacak şekilde düzenlendi.\n- Koltuk Takımı serbest yerleşimde 50 cm grid ile hareket edecek ve duvarlı standlarda 10 cm duvarın 5 cm iç yüz referansına sıfır yanaşacak şekilde snap mantığı düzeltildi.\n- Koltuk Takımı iç geometrisinde tekli ve çiftli koltuk derinlikleri azaltılarak orta sehpa görünürlüğü artırıldı; 150 × 150 dış footprint korunmaya devam etti.\n- Masa Sandalye Takımı eklendi: 150 × 150 cm dış footprint, 4 sandalye ve ortada tek ayaklı yuvarlak masa.\n- Masa Sandalye Takımı serbest gezme, 50 cm grid ve duvar iç yüzüne sıfır yanaşma davranışlarını Koltuk Takımı ile aynı yerleşim altyapısı üzerinden kullanacak şekilde entegre edildi.\n- Bar Taburesi eklendi: 50 × 50 cm footprint, 80 cm yükseklik; sırtlıklı oturak, dört ayak ve ayak koyma halkası geometrisi oluşturuldu.\n- Bar Taburesi serbest gezme, 50 cm grid ve duvar iç yüzüne sıfır yanaşma davranışlarıyla entegre edildi.\n- FAZ 3 planlandı: zemin ayarlanması, proje kaydetme/yeniden düzenleme, üst lamba, render alma ve kullanıcının kendi modülünü oluşturması.\n`;

if (!changelog.includes('## 11 Ağustos 2026 — Serbest mobilya modülleri ve FAZ 3 planlaması')) {
  changelog = changelog.trimEnd() + today + '\n';
  fs.writeFileSync(changelogPath, changelog);
}
