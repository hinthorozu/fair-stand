import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

test('project import validates and prepares archive before saving', () => {
  const handlerStart = source.indexOf("importProjectFileInput.addEventListener('change'");
  const handlerEnd = source.indexOf("openProjectButton.addEventListener('click'", handlerStart);
  assert.ok(handlerStart >= 0 && handlerEnd > handlerStart);
  const handler = source.slice(handlerStart, handlerEnd);

  assert.match(handler, /manifest\.project\.id/);
  assert.match(handler, /Array\.isArray\(manifest\.assets\)/);
  assert.match(handler, /const preparedAssets = \[\]/);
  assert.match(handler, /entry\.async\('blob'\)/);
  assert.ok(handler.indexOf("entry.async('blob')") < handler.indexOf('await saveProject(importedProject)'));
});

test('failed import rolls back project and assets atomically', () => {
  const handlerStart = source.indexOf("importProjectFileInput.addEventListener('change'");
  const handlerEnd = source.indexOf("openProjectButton.addEventListener('click'", handlerStart);
  const handler = source.slice(handlerStart, handlerEnd);

  assert.match(handler, /importStorageTouched/);
  assert.match(handler, /await deleteProjectWithAssets\(importedProjectId\)/);
  assert.doesNotMatch(handler, /deleteProjectImageAssets\(importedProjectId\)/);
  assert.doesNotMatch(handler, /await deleteProject\(importedProjectId\)/);
  assert.match(handler, /error\?\.message/);
});
