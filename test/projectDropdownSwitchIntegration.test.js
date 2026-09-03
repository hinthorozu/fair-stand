import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const mainSource = await readFile(new URL('../src/main.js', import.meta.url), 'utf8');

test('project dropdown change asks for confirmation and opens the selected project', () => {
  assert.match(mainSource, /projectSelect\.addEventListener\('change', async \(\) => \{/);
  assert.match(mainSource, /shouldConfirmProjectSwitch\(activeProjectId, projectId\)/);
  assert.match(mainSource, /formatProjectSwitchMessage\(currentProjectName, targetProjectName\)/);
  assert.match(mainSource, /const opened = await openStoredProject\(projectId\)/);
});

test('cancelled or failed dropdown switch restores the active project selection', () => {
  assert.match(mainSource, /function restoreProjectSelectToActiveProject\(\)/);
  assert.match(mainSource, /if \(!confirmed\) \{[\s\S]*restoreProjectSelectToActiveProject\(\)/);
  assert.match(mainSource, /if \(!opened\) restoreProjectSelectToActiveProject\(\)/);
});

test('manual open button reuses the same stored-project loading path', () => {
  assert.match(mainSource, /openProjectButton\.addEventListener\('click', async \(\) => \{\n  await openStoredProject\(projectSelect\.value\);\n\}\);/);
});
