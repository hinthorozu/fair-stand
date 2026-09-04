import test from 'node:test';
import assert from 'node:assert/strict';
import { planAutomaticDepot } from '../src/autoDepot.js';

test('L-left depot uses existing back and left walls', () => {
  const p = planAutomaticDepot({ standType:'l-left', standXCm:500, standYCm:400, sizeKey:'150x100' });
  assert.equal(p.ok,true); assert.equal(p.originXCm,0); assert.equal(p.originYCm,0);
  assert.equal(p.specs.filter(s=>s.kind==='door').length,1);
  assert.equal(p.specs.filter(s=>s.kind==='wall').length,2);
});

test('back wall depot is centered', () => {
  const p = planAutomaticDepot({ standType:'back-wall', standXCm:500, standYCm:400, sizeKey:'200x100' });
  assert.equal(p.originXCm,150); assert.equal(p.originYCm,0);
});

test('island depot is centered and contains four sides', () => {
  const p = planAutomaticDepot({ standType:'island', standXCm:600, standYCm:500, sizeKey:'200x200', includeContents:true });
  assert.equal(p.originXCm,200); assert.equal(p.originYCm,150);
  assert.equal(p.specs.filter(s=>['mini-fridge','kettle','coat-rack'].includes(s.kind)).length,3);
  const fridge = p.specs.find((s) => s.kind === 'mini-fridge');
  assert.deepEqual([fridge.widthCm, fridge.depthCm], [50, 50]);
});
