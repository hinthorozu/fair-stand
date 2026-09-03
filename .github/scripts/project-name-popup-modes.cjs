const fs = require('fs');
function rep(s,a,b,l){if(!s.includes(a)) throw new Error(l); return s.replace(a,b);}
const p='src/main.js';
let s=fs.readFileSync(p,'utf8');
s=rep(s,
"function requestNewProjectName(defaultName = '') {\n  return new Promise((resolve) => {",
"function requestProjectName({ defaultName = '', mode = 'create' } = {}) {\n  return new Promise((resolve) => {",
'popup function signature');
s=rep(s,
"    title.textContent = 'Yeni Proje';\n    title.style.fontSize = '16px';\n    const description = document.createElement('span');\n    description.textContent = 'Sahne oluşturulmadan önce proje adını gir.';",
"    const isRename = mode === 'rename';\n    title.textContent = isRename ? 'Proje Adını Değiştir' : 'Yeni Proje';\n    title.style.fontSize = '16px';\n    const description = document.createElement('span');\n    description.textContent = isRename\n      ? 'Mevcut proje için yeni adı gir.'\n      : 'Sahne oluşturulmadan önce proje adını gir.';",
'popup title description');
s=rep(s,
"    submitButton.textContent = 'Projeyi Oluştur';",
"    submitButton.textContent = isRename ? 'Kaydet' : 'Projeyi Oluştur';",
'popup submit label');
s=rep(s,
"  const projectName = await requestNewProjectName('');",
"  const projectName = await requestProjectName({ mode: 'create' });",
'create popup call');
s=rep(s,
"  const nextName = await requestNewProjectName(currentName);",
"  const nextName = await requestProjectName({ defaultName: currentName, mode: 'rename' });",
'rename popup call');
fs.writeFileSync(p,s);
