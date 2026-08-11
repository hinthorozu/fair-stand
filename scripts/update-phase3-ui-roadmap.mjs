import fs from 'node:fs';

const path = 'ROADMAP.md';
const text = fs.readFileSync(path, 'utf8');
const from = `- [ ] 1. Zemin ayarlanması\n- [ ] 2. Projenin kaydedilmesi ve tekrar düzenlenebilmesi\n- [ ] 3. En üste lamba eklenmesi\n- [ ] 4. Render alınması\n- [ ] 5. Kendi modülünü oluşturma`;
const to = `- [x] 1. Zemin ayarlanması\n- [ ] 2. Projenin kaydedilmesi ve tekrar düzenlenebilmesi\n- [ ] 3. En üste lamba eklenmesi\n- [ ] 4. Render alınması\n- [ ] 5. Kendi modülünü oluşturma\n- [ ] 6. UI/UX düzenlemesi ve final polish`;

if (!text.includes(from)) throw new Error('FAZ 3 yapılacaklar bloğu bulunamadı.');
fs.writeFileSync(path, text.replace(from, to));
console.log('FAZ 3 roadmap güncellendi.');
