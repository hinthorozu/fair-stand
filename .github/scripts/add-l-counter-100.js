const fs = require('fs');
const replaceOnce = (path, oldText, newText) => {
  let text = fs.readFileSync(path, 'utf8');
  if (!text.includes(oldText)) throw new Error(`${path}: target not found`);
  text = text.replace(oldText, newText);
  fs.writeFileSync(path, text);
};

replaceOnce('src/catalog.js',
  "  desk_banko_100: { type: 'counter', widthCm: 100, depthCm: 50, heightCm: 100, label: 'Banko 100' },",
  "  desk_banko_100: { type: 'counter', widthCm: 100, depthCm: 50, heightCm: 100, label: 'Banko 100' },\n  desk_banko_100_L: { type: 'counter', shape: 'L', widthCm: 100, depthCm: 100, heightCm: 100, label: 'Köşe Banko 100×100' },"
);
replaceOnce('src/catalog.js', "  'desk_banko_100',\n]);", "  'desk_banko_100',\n  'desk_banko_100_L',\n]);");

replaceOnce('src/designState.js',
`export function createCounterModuleState(widthCm) {
  const width = Number(widthCm);
  if (![100, 150, 200].includes(width)) return null;

  return {
    id: createId('module'),
    type: 'counter',
    widthCm: width,
    depthCm: 50,
    heightCm: 100,
    faces: {
      frontLower: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
      frontUpper: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
      leftLower: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
      leftUpper: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
      rightLower: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
      rightUpper: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
    },
  };
}`,
`export function createCounterModuleState(widthCm, options = {}) {
  const width = Number(widthCm);
  if (![100, 150, 200].includes(width)) return null;
  const shape = options.shape === 'L' ? 'L' : 'straight';
  const depthCm = shape === 'L' ? 100 : (Number(options.depthCm) || 50);
  const faces = {
    frontLower: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
    frontUpper: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
    leftLower: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
    leftUpper: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
    rightLower: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
    rightUpper: createEditablePanelState(null, DEFAULT_PANEL_COLOR),
  };
  if (shape === 'L') {
    faces.returnLower = createEditablePanelState(null, DEFAULT_PANEL_COLOR);
    faces.returnUpper = createEditablePanelState(null, DEFAULT_PANEL_COLOR);
  }
  return { id: createId('module'), type: 'counter', shape, widthCm: width, depthCm, heightCm: 100, faces };
}`);

replaceOnce('src/main.js',
  "  else if (module.type === 'counter') state = createCounterModuleState(module.widthCm);",
  "  else if (module.type === 'counter') state = createCounterModuleState(module.widthCm, { shape: module.shape, depthCm: module.depthCm });"
);
replaceOnce('src/main.js',
  "        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · Banko ' + widthCm + ' cm · ' + faceLabel + ' cephe · renk + görsel uygulanabilir.';",
  "        const counterLabel = surface.userData.counterShape === 'L' ? 'Köşe Banko 100×100' : ('Banko ' + widthCm + ' cm');\n        selectionInfo.textContent = 'Modül ' + (moduleIndex + 1) + ' · ' + counterLabel + ' · ' + faceLabel + ' cephe · renk + görsel uygulanabilir.';"
);

replaceOnce('src/productionParts.js',
  "  counter_top_110_60: Object.freeze({ partId: 'counter_top_110_60', name: 'Banko Üstü 110 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 110, depthCm: 60 }), nominalModuleWidthCm: 100 }),",
  "  counter_top_110_60: Object.freeze({ partId: 'counter_top_110_60', name: 'Banko Üstü 110 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 110, depthCm: 60 }), nominalModuleWidthCm: 100 }),\n  counter_top_52_60: Object.freeze({ partId: 'counter_top_52_60', name: 'Banko Üstü 52 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 52, depthCm: 60 }), nominalModuleWidthCm: 100 }),"
);

replaceOnce('src/moduleRecipes.js',
  "  'counter:100': Object.freeze({ recipeId: 'counter-100', moduleType: 'counter', nominalWidthCm: 100, items: Object.freeze([",
  "  'counter-l:100': Object.freeze({ recipeId: 'counter-l-100', moduleType: 'counter', shape: 'L', nominalWidthCm: 100, items: Object.freeze([\n    Object.freeze({ partId: 'profile_91', quantity: 5 }), Object.freeze({ partId: 'profile_41_5', quantity: 5 }), Object.freeze({ partId: 'upright_99', quantity: 5 }), Object.freeze({ partId: 'panel_98', quantity: 4 }), Object.freeze({ partId: 'panel_48_5', quantity: 4 }), Object.freeze({ partId: 'connector_start', quantity: 8 }), Object.freeze({ partId: 'connector_single', quantity: 16 }), Object.freeze({ partId: 'counter_top_110_60', quantity: 1 }), Object.freeze({ partId: 'counter_top_52_60', quantity: 1 }),\n  ]) }),\n\n  'counter:100': Object.freeze({ recipeId: 'counter-100', moduleType: 'counter', nominalWidthCm: 100, items: Object.freeze(["
);
replaceOnce('src/moduleRecipes.js',
`  if (moduleType === 'shelf') {
    const shelfCount = Number(options.shelfCount);
    return MODULE_RECIPES[\`shelf:${nominalWidthCm}:${shelfCount}\`] ?? null;
  }
  return MODULE_RECIPES[\`${moduleType}:${nominalWidthCm}\`] ?? null;`,
`  if (moduleType === 'shelf') {
    const shelfCount = Number(options.shelfCount);
    return MODULE_RECIPES[\`shelf:${nominalWidthCm}:${shelfCount}\`] ?? null;
  }
  if (moduleType === 'counter' && options.shape === 'L') {
    return MODULE_RECIPES[\`counter-l:${nominalWidthCm}\`] ?? null;
  }
  return MODULE_RECIPES[\`${moduleType}:${nominalWidthCm}\`] ?? null;`);

let scene = fs.readFileSync('src/scene3d.js', 'utf8');
const marker = 'function createCounterModule(moduleState, moduleIndex, onSurfaceReady) {';
const markerIndex = scene.indexOf(marker);
if (markerIndex < 0) throw new Error('counter renderer marker not found');
const lRenderer = `function createLCounterModule(moduleState, moduleIndex, onSurfaceReady) {
  const widthCm = 100, depthCm = 100, widthM = 1, depthM = 1, armM = 0.50;
  const heightM = Number(moduleState.heightCm || 100) / 100;
  const profileM = PANEL_VERTICAL_PROFILE_WIDTH_M;
  const frameDepthM = Number(STAND_DIMENSIONS.frameDepth);
  const railHeightM = PANEL_RAIL_HEIGHT_M;
  const topThicknessM = 0.04;
  const frameHeightM = heightM - topThicknessM;
  const stripHeightM = frameHeightM / 2;
  const panelHeightM = Math.max(stripHeightM - railHeightM - PANEL_VERTICAL_CLEARANCE_M, 0.05);
  const longPanelM = Math.max(widthM - profileM * 2 - 0.012, 0.05);
  const shortPanelM = Math.max(armM - profileM * 2 - 0.012, 0.05);
  const group = new THREE.Group();
  group.userData = { kind:'module', moduleIndex, moduleId:moduleState.id, type:'counter', widthCm, depthCm, heightCm:100, counterShape:'L' };
  const frameMaterial = new THREE.MeshStandardMaterial({ color:FRAME_COLOR, metalness:0.68, roughness:0.28 });
  const addProfile = (geometry, position) => { const mesh = new THREE.Mesh(geometry, frameMaterial.clone()); mesh.position.copy(position); mesh.castShadow=true; mesh.receiveShadow=true; group.add(mesh); return mesh; };
  const postGeometry = new THREE.BoxGeometry(profileM, frameHeightM, profileM);
  [[-0.5,-0.5],[0.5,-0.5],[0.5,0.5],[0,0.5],[0,0]].forEach(([x,z]) => addProfile(postGeometry.clone(), new THREE.Vector3(x + (x<0?profileM/2:x>0?-profileM/2:0), frameHeightM/2, z + (z<0?profileM/2:z>0?-profileM/2:0))));
  const railYs=[0,stripHeightM,frameHeightM];
  const addRailX=(length,x,z)=>railYs.forEach(y=>addProfile(new THREE.BoxGeometry(length,railHeightM,frameDepthM),new THREE.Vector3(x,y,z)));
  const addRailZ=(length,x,z)=>railYs.forEach(y=>addProfile(new THREE.BoxGeometry(frameDepthM,railHeightM,length),new THREE.Vector3(x,y,z)));
  addRailX(longPanelM,0,-0.5+frameDepthM/2); addRailZ(longPanelM,0.5-frameDepthM/2,0); addRailX(shortPanelM,-0.25,frameDepthM/2); addRailZ(shortPanelM,frameDepthM/2,0.25);
  const topMaterial = new THREE.MeshStandardMaterial({ color:0xf8fafc, roughness:0.58, metalness:0 });
  const topA=new THREE.Mesh(new THREE.BoxGeometry(1.10,topThicknessM,0.60),topMaterial.clone()); topA.position.set(0,frameHeightM+topThicknessM/2,-0.20); topA.castShadow=true; topA.receiveShadow=true; group.add(topA);
  const topB=new THREE.Mesh(new THREE.BoxGeometry(0.52,topThicknessM,0.60),topMaterial.clone()); topB.rotation.y=Math.PI/2; topB.position.set(0.25,frameHeightM+topThicknessM/2,0.25); topB.castShadow=true; topB.receiveShadow=true; group.add(topB);
  const surfaces=[];
  const addFace=(surfaceRole,panelLevel,surfaceState,faceWidthM,position,rotationY=0,outward=1)=>{
    if(!surfaceState)return;
    const backing=new THREE.Mesh(new THREE.BoxGeometry(faceWidthM,panelHeightM,0.012),new THREE.MeshStandardMaterial({color:PANEL_BACK_COLOR,roughness:0.74,metalness:0})); backing.position.copy(position); backing.rotation.y=rotationY; backing.castShadow=true; backing.receiveShadow=true; group.add(backing);
    const surface=new THREE.Mesh(new THREE.PlaneGeometry(faceWidthM,panelHeightM),new THREE.MeshStandardMaterial({color:surfaceState.imageAssetId?0xffffff:surfaceState.color,roughness:0.72,metalness:0,side:THREE.DoubleSide,emissive:0x000000,emissiveIntensity:0})); surface.position.copy(position); surface.rotation.y=rotationY; if(Math.abs(rotationY)<0.01)surface.position.z+=0.007*outward;else surface.position.x+=0.007*outward;
    const selectionFrame=createSelectionFrame(faceWidthM,panelHeightM); selectionFrame.visible=false; surface.add(selectionFrame);
    surface.userData={kind:'surface',moduleType:'counter',counterShape:'L',selectionMode:'module',acceptsImage:true,moduleIndex,moduleId:moduleState.id,widthCm,stripIndex:panelLevel==='lower'?0:1,stripNumber:panelLevel==='lower'?1:2,surfaceRole,panelLevel,surfaceId:surfaceState.id,surfaceState,selectionFrame,backing}; group.add(surface); surfaces.push(surface); onSurfaceReady?.(surface);
  };
  const lowerY=stripHeightM/2, upperY=stripHeightM+stripHeightM/2;
  addFace('front','lower',moduleState.faces?.frontLower,longPanelM,new THREE.Vector3(0,lowerY,-0.5),0,-1); addFace('front','upper',moduleState.faces?.frontUpper,longPanelM,new THREE.Vector3(0,upperY,-0.5),0,-1);
  addFace('right','lower',moduleState.faces?.rightLower,longPanelM,new THREE.Vector3(0.5,lowerY,0),Math.PI/2,1); addFace('right','upper',moduleState.faces?.rightUpper,longPanelM,new THREE.Vector3(0.5,upperY,0),Math.PI/2,1);
  addFace('left','lower',moduleState.faces?.leftLower,shortPanelM,new THREE.Vector3(-0.25,lowerY,0),0,1); addFace('left','upper',moduleState.faces?.leftUpper,shortPanelM,new THREE.Vector3(-0.25,upperY,0),0,1);
  addFace('return','lower',moduleState.faces?.returnLower,shortPanelM,new THREE.Vector3(0,lowerY,0.25),Math.PI/2,-1); addFace('return','upper',moduleState.faces?.returnUpper,shortPanelM,new THREE.Vector3(0,upperY,0.25),Math.PI/2,-1);
  return {group,surfaces};
}

`;
scene = scene.slice(0, markerIndex) + lRenderer + scene.slice(markerIndex);
scene = scene.replace(marker, marker + "\n  if (moduleState.shape === 'L') return createLCounterModule(moduleState, moduleIndex, onSurfaceReady);");
scene = scene.replace("    if (moduleState?.type === 'counter') return `Banko ${widthCm}`;", "    if (moduleState?.type === 'counter') return moduleState.shape === 'L' ? 'Köşe Banko 100×100' : `Banko ${widthCm}`;");
fs.writeFileSync('src/scene3d.js', scene);

replaceOnce('src/rawBomDebug.js',
`  const counterMatch = text.match(/Banko\\s+(100|150|200)\\s*cm/i);
  if (counterMatch) {
    const widthCm = Number(counterMatch[1]);
    renderRecipe('counter', widthCm, \`Banko ${widthCm} cm\`);
    return;
  }`,
`  const cornerCounterMatch = text.match(/Köşe\\s+Banko\\s+100[×x]100/i);
  if (cornerCounterMatch) {
    renderRecipe('counter', 100, 'Köşe Banko 100×100', { shape: 'L' });
    return;
  }

  const counterMatch = text.match(/Banko\\s+(100|150|200)\\s*cm/i);
  if (counterMatch) {
    const widthCm = Number(counterMatch[1]);
    renderRecipe('counter', widthCm, \`Banko ${widthCm} cm\`);
    return;
  }`);

fs.writeFileSync('test/lCounter100Contract.test.js', `import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import { createCounterModuleState } from '../src/designState.js';
import { getExpandedModuleRecipe } from '../src/moduleRecipes.js';

test('desk_banko_100_L catalog contract',()=>{const item=MODULE_CATALOG.desk_banko_100_L;assert.equal(item.type,'counter');assert.equal(item.shape,'L');assert.equal(item.widthCm,100);assert.equal(item.depthCm,100);assert.ok(MODULE_CATALOG_KEYS.includes('desk_banko_100_L'));});
test('L counter editable state',()=>{const state=createCounterModuleState(100,{shape:'L',depthCm:100});assert.equal(state.type,'counter');assert.equal(state.shape,'L');assert.equal(state.depthCm,100);assert.equal(Object.keys(state.faces).length,8);Object.values(state.faces).forEach(face=>assert.ok('imageAssetId' in face));});
test('L counter BOM exact',()=>{const recipe=getExpandedModuleRecipe('counter',100,{shape:'L'});const q=Object.fromEntries(recipe.items.map(item=>[item.partId,item.quantity]));assert.deepEqual(q,{profile_91:5,profile_41_5:5,upright_99:5,panel_98:4,panel_48_5:4,connector_start:8,connector_single:16,counter_top_110_60:1,counter_top_52_60:1});});
test('L counter renderer routing',()=>{const source=fs.readFileSync(new URL('../src/scene3d.js',import.meta.url),'utf8');assert.match(source,/moduleState\\.shape === 'L'/);assert.match(source,/createLCounterModule/);assert.match(source,/counterShape:'L'/);});
`);
