import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const projectStoreSource = readFileSync(new URL('../src/projectStore.js', import.meta.url), 'utf8');
const mainSource = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');

test('whole-project deletion uses one readwrite transaction for project and asset stores', () => {
  const functionStart = projectStoreSource.indexOf('export async function deleteProjectWithAssets');
  assert.ok(functionStart >= 0, 'deleteProjectWithAssets must be the canonical whole-project delete API');
  const functionSource = projectStoreSource.slice(functionStart);

  assert.match(functionSource, /db\.transaction\(\s*\[PROJECT_STORE_NAME, ASSET_STORE_NAME\],\s*'readwrite'/);
  assert.match(functionSource, /projectStore\.delete\(projectId\)/);
  assert.match(functionSource, /assetStore\.index\(ASSET_PROJECT_INDEX\)/);
  assert.match(functionSource, /assetIndex\.openCursor\(projectId\)/);
  assert.match(functionSource, /cursor\.delete\(\)/);
  assert.match(functionSource, /tx\.oncomplete/);
  assert.match(functionSource, /tx\.onabort/);
});

test('main uses the atomic whole-project delete for user deletion and import rollback', () => {
  assert.match(mainSource, /import \{ createProjectId, deleteProjectWithAssets, listProjects, loadProject, saveProject \} from '\.\/projectStore\.js';/);
  assert.doesNotMatch(mainSource, /deleteProjectImageAssets/);

  const importHandlerStart = mainSource.indexOf("importProjectFileInput.addEventListener('change'");
  const importHandlerEnd = mainSource.indexOf('async function openStoredProject', importHandlerStart);
  assert.ok(importHandlerStart >= 0 && importHandlerEnd > importHandlerStart);
  const importHandler = mainSource.slice(importHandlerStart, importHandlerEnd);
  assert.match(importHandler, /await deleteProjectWithAssets\(importedProjectId\)/);

  const deleteHandlerStart = mainSource.indexOf("deleteProjectButton.addEventListener('click'");
  const deleteHandlerEnd = mainSource.indexOf("fillImageButton.addEventListener('click'", deleteHandlerStart);
  assert.ok(deleteHandlerStart >= 0 && deleteHandlerEnd > deleteHandlerStart);
  const deleteHandler = mainSource.slice(deleteHandlerStart, deleteHandlerEnd);
  assert.match(deleteHandler, /await deleteProjectWithAssets\(projectId\)/);
  assert.doesNotMatch(deleteHandler, /await deleteProject\(projectId\)/);
});
