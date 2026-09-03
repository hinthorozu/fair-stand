import test from 'node:test';
import assert from 'node:assert/strict';

import {
  buildAutomaticProjectNameSuffix,
  createProjectNamingController,
  getEditableProjectName,
  normalizeProjectName,
} from '../src/projectNaming.js';

test('normalizeProjectName trims names and preserves the unnamed fallback', () => {
  assert.equal(normalizeProjectName('  Ferromet  '), 'Ferromet');
  assert.equal(normalizeProjectName(''), 'Adsız Proje');
  assert.equal(normalizeProjectName(null), 'Adsız Proje');
});

test('automatic project suffix keeps the existing stand type naming contract', () => {
  assert.equal(buildAutomaticProjectNameSuffix('l-left', 400, 300), 'L_Sol_400_300');
  assert.equal(buildAutomaticProjectNameSuffix('l-right', 400.4, 299.6), 'L_Sag_400_300');
  assert.equal(buildAutomaticProjectNameSuffix('u-stand', 500, 400), 'U_500_400');
  assert.equal(buildAutomaticProjectNameSuffix('island', 600, 600), 'Ada_600_600');
  assert.equal(buildAutomaticProjectNameSuffix('back-wall', 300, 200), 'Sirt_300_200');
  assert.equal(buildAutomaticProjectNameSuffix('unknown', 250, 150), 'Stand_250_150');
});

test('editable project name removes only the known automatic suffix', () => {
  const suffix = 'L_Sol_400_300';
  assert.equal(getEditableProjectName('Ferromet-L_Sol_400_300', suffix), 'Ferromet');
  assert.equal(getEditableProjectName('Ferromet_L_Sol_400_300', suffix), 'Ferromet');
  assert.equal(getEditableProjectName('Ferromet', suffix), 'Ferromet');
  assert.equal(getEditableProjectName(' Ferromet '), 'Ferromet');
});

test('project naming controller syncs input and display without owning application state', () => {
  const projectNameInput = { value: '' };
  const projectNameDisplay = { textContent: '' };
  const controller = createProjectNamingController({
    documentRef: null,
    projectNameInput,
    projectNameDisplay,
  });

  assert.equal(controller.setProjectName('  Demo  '), 'Demo');
  assert.equal(projectNameInput.value, 'Demo');
  assert.equal(projectNameDisplay.textContent, 'Demo');
});
