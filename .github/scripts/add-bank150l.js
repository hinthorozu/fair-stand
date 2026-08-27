import fs from 'node:fs';

function replaceOnce(file, from, to, label) {
  let text = fs.readFileSync(file, 'utf8');
  if (!text.includes(from)) throw new Error(`Missing patch target: ${label}`);
  text = text.replace(from, to);
  fs.writeFileSync(file, text);
}

function insertBeforeOnce(file, needle, addition, label) {
  let text = fs.readFileSync(file, 'utf8');
  if (!text.includes(needle)) throw new Error(`Missing insert target: ${label}`);
  text = text.replace(needle, addition + needle);
  fs.writeFileSync(file, text);
}

const catalogSource = fs.readFileSync('src/catalog.js', 'utf8');
const alreadyApplied = catalogSource.includes('desk_banko_150_L:');

if (!alreadyApplied) {
  replaceOnce(
    'src/catalog.js',
    "  desk_banko_150: { type: 'counter', widthCm: 150, depthCm: 50, heightCm: 100, label: 'Banko 150' },",
    "  desk_banko_150: { type: 'counter', widthCm: 150, depthCm: 50, heightCm: 100, label: 'Banko 150' },\n  desk_banko_150_L: { type: 'counter', shape: 'L', widthCm: 150, depthCm: 150, heightCm: 100, label: 'Köşe Banko 150×150' },",
    'catalog entry',
  );
  replaceOnce(
    'src/catalog.js',
    "  'desk_banko_150',\n  'desk_banko_100',",
    "  'desk_banko_150',\n  'desk_banko_150_L',\n  'desk_banko_100',",
    'catalog key',
  );

  replaceOnce(
    'src/designState.js',
    "  const depthCm = shape === 'L' ? 100 : (Number(options.depthCm) || 50);",
    "  const depthCm = shape === 'L' ? (Number(options.depthCm) || width) : (Number(options.depthCm) || 50);",
    'L depth state',
  );

  replaceOnce(
    'src/productionParts.js',
    "  counter_top_160_60: Object.freeze({ partId: 'counter_top_160_60', name: 'Banko Üstü 160 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 160, depthCm: 60 }), nominalModuleWidthCm: 150 }),",
    "  counter_top_160_60: Object.freeze({ partId: 'counter_top_160_60', name: 'Banko Üstü 160 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 160, depthCm: 60 }), nominalModuleWidthCm: 150 }),\n  counter_top_102_60: Object.freeze({ partId: 'counter_top_102_60', name: 'Banko Üstü 102 × 60 cm', type: 'counter-top', unit: 'adet', dimensions: Object.freeze({ widthCm: 102, depthCm: 60 }), nominalModuleWidthCm: 150 }),",
    '150 L return top part',
  );

  insertBeforeOnce(
    'src/moduleRecipes.js',
    "  'counter:100': Object.freeze(",
    "  'counter-l:150': Object.freeze({ recipeId: 'counter-l-150', moduleType: 'counter', shape: 'L', nominalWidthCm: 150, items: Object.freeze([\n    Object.freeze({ partId: 'profile_140_5', quantity: 5 }), Object.freeze({ partId: 'profile_91', quantity: 1 }), Object.freeze({ partId: 'profile_41_5', quantity: 4 }), Object.freeze({ partId: 'upright_99', quantity: 5 }), Object.freeze({ partId: 'panel_147_5', quantity: 4 }), Object.freeze({ partId: 'panel_48_5', quantity: 4 }), Object.freeze({ partId: 'connector_start', quantity: 8 }), Object.freeze({ partId: 'connector_single', quantity: 16 }), Object.freeze({ partId: 'counter_top_160_60', quantity: 1 }), Object.freeze({ partId: 'counter_top_102_60', quantity: 1 }),\n  ]) }),\n\n",
    '150 L recipe',
  );

  let scene = fs.readFileSync('src/scene3d.js', 'utf8');
  const start = scene.indexOf('function createLCounterModule(moduleState, moduleIndex, onSurfaceReady) {');
  const end = scene.indexOf('\nfunction createShelfModule(moduleState, moduleIndex, onSurfaceReady) {', start);
  if (start < 0 || end < 0) throw new Error('L renderer boundaries not found');

  const replacement = `function createLCounterModule(moduleState, moduleIndex, onSurfaceReady) {
  const widthCm = Number(moduleState.widthCm) || 100;
  const depthCm = Number(moduleState.depthCm) || widthCm;
  const widthM = widthCm / 100;
  const depthM = depthCm / 100;
  const armM = 0.50;
  const heightM = Number(moduleState.heightCm || 100) / 100;
  const profileM = PANEL_VERTICAL_PROFILE_WIDTH_M;
  const frameDepthM = Number(STAND_DIMENSIONS.frameDepth);
  const railHeightM = PANEL_RAIL_HEIGHT_M;
  const topThicknessM = 0.04;
  const frameHeightM = heightM - topThicknessM;
  const stripHeightM = frameHeightM / 2;
  const panelHeightM = Math.max(stripHeightM - railHeightM - PANEL_VERTICAL_CLEARANCE_M, 0.05);
  const frontPanelM = Math.max(widthM - profileM * 2 - 0.012, 0.05);
  const rightPanelM = Math.max(depthM - profileM * 2 - 0.012, 0.05);
  const shortPanelM = Math.max(armM - profileM * 2 - 0.012, 0.05);
  const group = new THREE.Group();
  group.userData = { kind:'module', moduleIndex, moduleId:moduleState.id, type:'counter', widthCm, depthCm, heightCm:100, counterShape:'L' };
  const frameMaterial = new THREE.MeshStandardMaterial({ color:FRAME_COLOR, metalness:0.68, roughness:0.28 });
  const addProfile = (geometry, position) => { const mesh = new THREE.Mesh(geometry, frameMaterial.clone()); mesh.position.copy(position); mesh.castShadow=true; mesh.receiveShadow=true; group.add(mesh); return mesh; };
  const postGeometry = new THREE.BoxGeometry(profileM, frameHeightM, profileM);
  [
    [-widthM / 2 + profileM / 2, -depthM / 2 + profileM / 2],
    [widthM / 2 - profileM / 2, -depthM / 2 + profileM / 2],
    [widthM / 2 - profileM / 2, depthM / 2 - profileM / 2],
    [widthM / 2 - armM + profileM / 2, depthM / 2 - profileM / 2],
    [-widthM / 2 + profileM / 2, -depthM / 2 + armM - profileM / 2],
  ].forEach(([x, z]) => addProfile(
    postGeometry.clone(),
    new THREE.Vector3(x, frameHeightM / 2, z),
  ));
  const railYs=[0,stripHeightM,frameHeightM];
  const addRailX=(length,x,z)=>railYs.forEach(y=>addProfile(new THREE.BoxGeometry(length,railHeightM,frameDepthM),new THREE.Vector3(x,y,z)));
  const addRailZ=(length,x,z)=>railYs.forEach(y=>addProfile(new THREE.BoxGeometry(frameDepthM,railHeightM,length),new THREE.Vector3(x,y,z)));
  addRailX(frontPanelM,0,-depthM/2+frameDepthM/2);
  addRailZ(rightPanelM,widthM/2-frameDepthM/2,0);
  addRailZ(shortPanelM,-widthM/2+frameDepthM/2,-depthM/2+armM/2);
  addRailX(shortPanelM,widthM/2-armM/2,depthM/2-frameDepthM/2);

  const topMaterial = new THREE.MeshStandardMaterial({ color:0xf8fafc, roughness:0.58, metalness:0 });
  if (widthCm === 100 && depthCm === 100) {
    const topA=new THREE.Mesh(new THREE.BoxGeometry(1.10,topThicknessM,0.60),topMaterial.clone()); topA.position.set(0,frameHeightM+topThicknessM/2,-0.25); topA.castShadow=true; topA.receiveShadow=true; group.add(topA);
    const topB=new THREE.Mesh(new THREE.BoxGeometry(0.52,topThicknessM,0.60),topMaterial.clone()); topB.rotation.y=Math.PI/2; topB.position.set(0.25,frameHeightM+topThicknessM/2,0.29); topB.castShadow=true; topB.receiveShadow=true; group.add(topB);
  } else {
    // Banko 150 L, normal Banko 150 renderer mantığını kullanır: 2 cm tabla taşması.
    const topOverhangM = 0.02;
    const topA = new THREE.Mesh(
      new THREE.BoxGeometry(widthM + topOverhangM * 2, topThicknessM, armM + topOverhangM * 2),
      topMaterial.clone(),
    );
    topA.position.set(0, frameHeightM + topThicknessM / 2, -depthM / 2 + armM / 2);
    topA.castShadow = true;
    topA.receiveShadow = true;
    group.add(topA);

    const returnExtensionM = Math.max(depthM - armM, 0.02);
    const topB = new THREE.Mesh(
      new THREE.BoxGeometry(returnExtensionM + topOverhangM * 2, topThicknessM, armM + topOverhangM * 2),
      topMaterial.clone(),
    );
    topB.rotation.y = Math.PI / 2;
    topB.position.set(widthM / 2 - armM / 2, frameHeightM + topThicknessM / 2, armM / 2);
    topB.castShadow = true;
    topB.receiveShadow = true;
    group.add(topB);
  }

  const surfaces=[];
  const addFace=(surfaceRole,panelLevel,surfaceState,faceWidthM,position,rotationY=0,outward=1)=>{
    if(!surfaceState)return;
    const backing=new THREE.Mesh(new THREE.BoxGeometry(faceWidthM,panelHeightM,0.012),new THREE.MeshStandardMaterial({color:PANEL_BACK_COLOR,roughness:0.74,metalness:0})); backing.position.copy(position); backing.rotation.y=rotationY; backing.castShadow=true; backing.receiveShadow=true; group.add(backing);
    const surface=new THREE.Mesh(new THREE.PlaneGeometry(faceWidthM,panelHeightM),new THREE.MeshStandardMaterial({color:surfaceState.imageAssetId?0xffffff:surfaceState.color,roughness:0.72,metalness:0,side:THREE.DoubleSide,emissive:0x000000,emissiveIntensity:0})); surface.position.copy(position); surface.rotation.y=rotationY; if(Math.abs(rotationY)<0.01)surface.position.z+=0.007*outward;else surface.position.x+=0.007*outward;
    const selectionFrame=createSelectionFrame(faceWidthM,panelHeightM); selectionFrame.visible=false; surface.add(selectionFrame);
    surface.userData={kind:'surface',moduleType:'counter',counterShape:'L',selectionMode:'module',acceptsImage:true,moduleIndex,moduleId:moduleState.id,widthCm,depthCm,stripIndex:panelLevel==='lower'?0:1,stripNumber:panelLevel==='lower'?1:2,surfaceRole,panelLevel,surfaceId:surfaceState.id,surfaceState,selectionFrame,backing}; group.add(surface); surfaces.push(surface); onSurfaceReady?.(surface);
  };
  const lowerY=stripHeightM/2, upperY=stripHeightM+stripHeightM/2;
  addFace('front','lower',moduleState.faces?.frontLower,frontPanelM,new THREE.Vector3(0,lowerY,-depthM/2),0,-1); addFace('front','upper',moduleState.faces?.frontUpper,frontPanelM,new THREE.Vector3(0,upperY,-depthM/2),0,-1);
  addFace('right','lower',moduleState.faces?.rightLower,rightPanelM,new THREE.Vector3(widthM/2,lowerY,0),Math.PI/2,1); addFace('right','upper',moduleState.faces?.rightUpper,rightPanelM,new THREE.Vector3(widthM/2,upperY,0),Math.PI/2,1);
  addFace('left','lower',moduleState.faces?.leftLower,shortPanelM,new THREE.Vector3(-widthM/2,lowerY,-depthM/2+armM/2),-Math.PI/2,-1); addFace('left','upper',moduleState.faces?.leftUpper,shortPanelM,new THREE.Vector3(-widthM/2,upperY,-depthM/2+armM/2),-Math.PI/2,-1);
  addFace('return','lower',moduleState.faces?.returnLower,shortPanelM,new THREE.Vector3(widthM/2-armM/2,lowerY,depthM/2),0,1); addFace('return','upper',moduleState.faces?.returnUpper,shortPanelM,new THREE.Vector3(widthM/2-armM/2,upperY,depthM/2),0,1);
  return {group,surfaces};
}
`;
  scene = scene.slice(0, start) + replacement + scene.slice(end);
  fs.writeFileSync('src/scene3d.js', scene);

  replaceOnce(
    'src/scene3d.js',
    "    if (moduleState?.type === 'counter') return moduleState.shape === 'L' ? 'Köşe Banko 100×100' : `Banko ${widthCm}`;",
    "    if (moduleState?.type === 'counter') return moduleState.shape === 'L' ? ('Köşe Banko ' + widthCm + '×' + (Number(moduleState.depthCm) || widthCm)) : `Banko ${widthCm}`;",
    'drag label',
  );
  replaceOnce(
    'src/main.js',
    "        const counterLabel = surface.userData.counterShape === 'L' ? 'Köşe Banko 100×100' : ('Banko ' + widthCm + ' cm');",
    "        const counterLabel = surface.userData.counterShape === 'L' ? ('Köşe Banko ' + widthCm + '×' + (Number(surface.userData.depthCm) || widthCm)) : ('Banko ' + widthCm + ' cm');",
    'selection label',
  );
}

fs.writeFileSync('test/lCounterSideGeometry.test.js', `import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
const start = source.indexOf('function createLCounterModule');
const end = source.indexOf('function createShelfModule', start);
const block = source.slice(start, end);

test('L counter short side panels close the two outer arm ends parametrically', () => {
  assert.match(block, /new THREE\\.Vector3\\(-widthM\\/2,lowerY,-depthM\\/2\\+armM\\/2\\),-Math\\.PI\\/2,-1/);
  assert.match(block, /new THREE\\.Vector3\\(widthM\\/2-armM\\/2,lowerY,depthM\\/2\\),0,1/);
  assert.doesNotMatch(block, /new THREE\\.Vector3\\(-0\\.25,lowerY,0\\),0,1/);
});

test('L counter side posts use the same profile inset clearance for every size', () => {
  assert.match(block, /\\[widthM \\/ 2 - armM \\+ profileM \\/ 2, depthM \\/ 2 - profileM \\/ 2\\]/);
  assert.match(block, /\\[-widthM \\/ 2 \\+ profileM \\/ 2, -depthM \\/ 2 \\+ armM - profileM \\/ 2\\]/);
  assert.doesNotMatch(block, /\\[0,0\\.5\\]/);
  assert.doesNotMatch(block, /\\[-0\\.5,0\\]/);
});
`);

fs.writeFileSync('test/lCounter150Contract.test.js', `import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import { createCounterModuleState } from '../src/designState.js';
import { getModuleRecipe } from '../src/moduleRecipes.js';
import { getProductionPart } from '../src/productionParts.js';

test('desk_banko_150_L is a 150 x 150 catalog module', () => {
  assert.deepEqual(MODULE_CATALOG.desk_banko_150_L, {
    type: 'counter', shape: 'L', widthCm: 150, depthCm: 150, heightCm: 100, label: 'Köşe Banko 150×150',
  });
  assert.ok(MODULE_CATALOG_KEYS.includes('desk_banko_150_L'));
});

test('150 L counter state keeps 150 cm physical depth and eight editable faces', () => {
  const state = createCounterModuleState(150, { shape: 'L', depthCm: 150 });
  assert.equal(state.widthCm, 150);
  assert.equal(state.depthCm, 150);
  assert.equal(state.shape, 'L');
  assert.equal(Object.keys(state.faces).length, 8);
});

test('150 L counter renderer is 150 x 150 with a 50 cm arm and 100 cm return extension', () => {
  const source = fs.readFileSync(new URL('../src/scene3d.js', import.meta.url), 'utf8');
  assert.match(source, /const widthCm = Number\\(moduleState\\.widthCm\\) \\|\\| 100;/);
  assert.match(source, /const depthCm = Number\\(moduleState\\.depthCm\\) \\|\\| widthCm;/);
  assert.match(source, /const armM = 0\\.50;/);
  assert.match(source, /const returnExtensionM = Math\\.max\\(depthM - armM, 0\\.02\\);/);
  assert.match(source, /widthM \\+ topOverhangM \\* 2/);
});

test('150 L counter BOM remains separate from renderer geometry', () => {
  const recipe = getModuleRecipe('counter', 150, { shape: 'L' });
  assert.equal(recipe.recipeId, 'counter-l-150');
  assert.deepEqual(recipe.items.map(({ partId, quantity }) => [partId, quantity]), [
    ['profile_140_5', 5], ['profile_91', 1], ['profile_41_5', 4], ['upright_99', 5],
    ['panel_147_5', 4], ['panel_48_5', 4], ['connector_start', 8], ['connector_single', 16],
    ['counter_top_160_60', 1], ['counter_top_102_60', 1],
  ]);
  assert.equal(getProductionPart('counter_top_102_60').dimensions.widthCm, 102);
});
`);
