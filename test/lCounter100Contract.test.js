import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { MODULE_CATALOG, MODULE_CATALOG_KEYS } from '../src/catalog.js';
import { createCounterModuleState } from '../src/designState.js';
import { getExpandedModuleRecipe } from '../src/moduleRecipes.js';

test('desk_banko_100_L catalog contract',()=>{const item=MODULE_CATALOG.desk_banko_100_L;assert.equal(item.type,'counter');assert.equal(item.shape,'L');assert.equal(item.widthCm,100);assert.equal(item.depthCm,100);assert.ok(MODULE_CATALOG_KEYS.includes('desk_banko_100_L'));});
test('L counter editable state',()=>{const state=createCounterModuleState(100,{shape:'L',depthCm:100});assert.equal(state.type,'counter');assert.equal(state.shape,'L');assert.equal(state.depthCm,100);assert.equal(Object.keys(state.faces).length,8);Object.values(state.faces).forEach(face=>assert.ok('imageAssetId' in face));});
test('L counter BOM exact',()=>{const recipe=getExpandedModuleRecipe('counter',100,{shape:'L'});const q=Object.fromEntries(recipe.items.map(item=>[item.partId,item.quantity]));assert.deepEqual(q,{profile_91:5,profile_41_5:5,upright_99:5,panel_98:4,panel_48_5:4,connector_start:8,connector_single:16,counter_top_110_60:1,counter_top_52_60:1});});
test('L counter renderer routing',()=>{const source=fs.readFileSync(new URL('../src/scene3d.js',import.meta.url),'utf8');assert.match(source,/moduleState\.shape === 'L'/);assert.match(source,/createLCounterModule/);assert.match(source,/counterShape:'L'/);});
