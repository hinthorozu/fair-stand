import fs from 'node:fs';

const path = 'ROADMAP.md';
let text = fs.readFileSync(path, 'utf8');

text = text.replace(
  '- [ ] 1. Zemin ayarlanması\n- [ ] 2. Projenin kaydedilmesi ve tekrar düzenlenebilmesi\n- [ ] 3. En üste lamba eklenmesi\n- [ ] 4. Render alınması\n- [ ] 5. Kendi modülünü oluşturma',
  '- [x] 1. Zemin ayarlanması — tamamlandı\n- [ ] 2. Projenin kaydedilmesi ve tekrar düzenlenebilmesi\n- [ ] 3. En üste lamba eklenmesi\n- [ ] 4. Render alınması\n- [ ] 5. Kendi modülünü oluşturma\n- [ ] 6. UI/UX düzenlemesi ve final polish',
);

fs.writeFileSync(path, text);
console.log('FAZ 3 roadmap updated');
