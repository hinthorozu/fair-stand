import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const mainSource = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');

test('main.js delegates generic project UI helpers to projectUi module', () => {
  assert.match(mainSource, /import \{ createProjectLoadingController, setButtonBusy \} from '\.\/projectUi\.js';/);
  assert.equal(mainSource.includes('function setButtonBusy('), false);
  assert.equal(mainSource.includes('function showProjectLoading('), false);
  assert.equal(mainSource.includes('function hideProjectLoading('), false);
  assert.match(mainSource, /const projectLoading = createProjectLoadingController\(\{/);
  assert.equal((mainSource.match(/projectLoading\.show\(/g) || []).length, 2);
  assert.equal((mainSource.match(/projectLoading\.hide\(\)/g) || []).length, 2);
});
