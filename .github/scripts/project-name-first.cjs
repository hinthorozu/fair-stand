const fs = require('fs');
const p = 'src/main.js';
let s = fs.readFileSync(p, 'utf8');

function replaceOnce(before, after, label) {
  if (!s.includes(before)) throw new Error(`Missing anchor: ${label}`);
  s = s.replace(before, after);
}

replaceOnce(
  "        preview.textContent = 'Proje adı: ' + prefix + (standName || '[Stand_Adi]');",
  "        preview.textContent = 'Proje adı: ' + (standName || '[Stand_Adi]') + '_' + prefix.replace(/_$/, '');",
  'project name preview order',
);

replaceOnce(
  "      const finalName = isRename ? name : prefix + name.replace(/\\s+/g, '_');",
  "      const finalName = isRename ? name : name.replace(/\\s+/g, '_') + '_' + prefix.replace(/_$/, '');",
  'project name final order',
);

fs.writeFileSync(p, s);
