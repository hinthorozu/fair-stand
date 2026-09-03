const fs=require('fs');
const p='src/main.js';
let s=fs.readFileSync(p,'utf8');
function rep(a,b){if(!s.includes(a))throw new Error('pattern not found: '+a.slice(0,80));s=s.replace(a,b);}
rep("function requestProjectName({ defaultName = '', mode = 'create' } = {}) {",`function buildAutomaticProjectNamePrefix(standType, xCm, yCm) {
  const typePrefix = {
    'l-left': 'L_Sol',
    'l-right': 'L_Sag',
    'u-stand': 'U',
    island: 'Ada',
    'back-wall': 'Sirt',
  }[standType] || 'Stand';
  return \`${'${typePrefix}'}_${'${Math.round(Number(xCm) || 0)}'}_${'${Math.round(Number(yCm) || 0)}'}_\`;
}

function requestProjectName({ defaultName = '', mode = 'create', prefix = '' } = {}) {`);
rep("description.textContent = isRename\n      ? 'Mevcut proje için yeni adı gir.'\n      : 'Sahne oluşturulmadan önce proje adını gir.';",`description.textContent = isRename
      ? 'Mevcut proje için yeni adı gir.'
      : 'Stand adını gir; proje adı stand tipi ve ölçülerle otomatik oluşturulacak.';`);
rep("label.textContent = 'Proje adı';",`label.textContent = isRename ? 'Proje adı' : 'Stand adı';`);
rep("input.placeholder = 'Örn. İstanbul Fuar Standı';",`input.placeholder = isRename ? 'Örn. İstanbul Fuar Standı' : 'Örn. Ferromet';
    const preview = document.createElement('span');
    if (!isRename && prefix) {
      preview.style.cssText = 'font-weight:700;color:#334155;word-break:break-word';
      const updatePreview = () => {
        const standName = input.value.trim().replace(/\\s+/g, '_');
        preview.textContent = 'Proje adı: ' + prefix + (standName || '[Stand_Adi]');
      };
      input.addEventListener('input', updatePreview);
      updatePreview();
      label.appendChild(preview);
    }`);
rep("      finish(name);\n    });",`      const finalName = isRename ? name : prefix + name.replace(/\\s+/g, '_');
      finish(finalName);
    });`);
rep("  const projectName = await requestProjectName({ mode: 'create' });",`  const projectNamePrefix = buildAutomaticProjectNamePrefix(setup.standType, setup.xCm, setup.yCm);
  const projectName = await requestProjectName({ mode: 'create', prefix: projectNamePrefix });`);
fs.writeFileSync(p,s);
