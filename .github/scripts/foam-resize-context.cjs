const fs = require('fs');
function rep(s,a,b,label){if(!s.includes(a)) throw new Error(label); return s.replace(a,b);}

let s = fs.readFileSync('src/moduleContextMenu.js','utf8');
s = rep(s,
"  onDuplicate,\n  onAdd,",
"  onDuplicate,\n  onResize,\n  onAdd,",
'menu signature');
s = rep(s,
"    <button type=\"button\" data-module-action=\"duplicate-left\">Çoğalt Sol Tarafa</button>\n    <div class=\"module-context-separator\"></div>",
"    <button type=\"button\" data-module-action=\"duplicate-left\">Çoğalt Sol Tarafa</button>\n    <button type=\"button\" data-module-action=\"resize-foam\" hidden>Boyutlandır…</button>\n    <div class=\"module-context-separator\"></div>",
'menu resize button');
s = rep(s,
"  const shelfLightingButton = menu.querySelector('[data-module-action=\"toggle-shelf-light\"]');",
"  const shelfLightingButton = menu.querySelector('[data-module-action=\"toggle-shelf-light\"]');\n  const foamResizeButton = menu.querySelector('[data-module-action=\"resize-foam\"]');",
'menu resize const');
s = rep(s,
"    const isShelf = (context.moduleType ?? context.type) === 'shelf';",
"    const moduleType = context.moduleType ?? context.type;\n    const isFoam = moduleType === 'illuminated-foam';\n    foamResizeButton.hidden = !isFoam;\n    const isShelf = moduleType === 'shelf';",
'menu open foam');
s = rep(s,
"    if (action === 'duplicate-right' || action === 'duplicate-left') {",
"    if (action === 'resize-foam' && (context.moduleType ?? context.type) === 'illuminated-foam') {\n      close();\n      onResize?.(context);\n      return;\n    }\n\n    if (action === 'duplicate-right' || action === 'duplicate-left') {",
'menu click resize');
fs.writeFileSync('src/moduleContextMenu.js',s);

s = fs.readFileSync('src/main.js','utf8');
const anchor = "const moduleContextMenu = createModuleContextMenu({\n";
if(!s.includes(anchor)) throw new Error('main context anchor');
const fn = [
"async function resizeContextIlluminatedFoam(context) {",
"  const index = findContextModuleIndex(context);",
"  if (index < 0 || currentModules[index]?.type !== 'illuminated-foam') return;",
"  const moduleState = currentModules[index];",
"  const dimensions = await requestIlluminatedFoamDimensions(moduleState.widthCm, moduleState.heightCm);",
"  if (!dimensions) return;",
"  moduleState.widthCm = dimensions.widthCm;",
"  moduleState.heightCm = dimensions.heightCm;",
"  rebuildWall({ resetView: false });",
"  selectionInfo.textContent = `Modül ${index + 1} · Işıklı Strafor · ${moduleState.widthCm} × ${moduleState.heightCm} cm · ${moduleState.depthCm || 3.5} cm kalınlık · ışık ${moduleState.haloColor || '#ffffff'}.`;",
"}",
"",
].join('\n');
s = s.replace(anchor, fn + anchor);
s = rep(s,
"  onDuplicate: duplicateContextModule,\n  onAdd: addCatalogModule,",
"  onDuplicate: duplicateContextModule,\n  onResize: resizeContextIlluminatedFoam,\n  onAdd: addCatalogModule,",
'main resize callback');
fs.writeFileSync('src/main.js',s);
