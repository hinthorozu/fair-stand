import fs from 'node:fs';

const scenePath = 'src/scene3d.js';
let scene = fs.readFileSync(scenePath, 'utf8');
const keydownNeedle = "  window.addEventListener('keydown', (event) => {\n    if (String(event.key).toLowerCase() !== 'r') return;";
if (!scene.includes(keydownNeedle)) throw new Error('scene keydown handler not found');
scene = scene.replace(keydownNeedle, `  window.addEventListener('keydown', (event) => {
    const pressedKey = String(event.key).toLowerCase();
    if (pressedKey === 'delete') {
      const target = event.target;
      const tagName = String(target?.tagName ?? '').toLowerCase();
      const isEditing = tagName === 'input'
        || tagName === 'textarea'
        || tagName === 'select'
        || Boolean(target?.isContentEditable);
      if (isEditing) return;

      const moduleGroup = getSingleSelectedModuleGroup();
      if (!moduleGroup) return;
      event.preventDefault();
      window.dispatchEvent(new CustomEvent('fair-stand:delete-selected-module', {
        detail: {
          moduleId: moduleGroup.userData?.moduleId ?? null,
          moduleIndex: moduleGroup.userData?.moduleIndex ?? null,
        },
      }));
      return;
    }

    if (pressedKey !== 'r') return;`);
fs.writeFileSync(scenePath, scene);

const mainPath = 'src/main.js';
let main = fs.readFileSync(mainPath, 'utf8');
const anchor = '\nfunction normalizeContinuousSide(context, side) {';
if (!main.includes(anchor)) throw new Error('delete function anchor not found');
main = main.replace(anchor, `
window.addEventListener('fair-stand:delete-selected-module', (event) => {
  const detail = event?.detail;
  if (!detail?.moduleId && !Number.isInteger(detail?.moduleIndex)) return;
  deleteContextModule(detail);
});

function normalizeContinuousSide(context, side) {`);
fs.writeFileSync(mainPath, main);
