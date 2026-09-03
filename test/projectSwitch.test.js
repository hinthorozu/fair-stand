import test from 'node:test';
import assert from 'node:assert/strict';

import { formatProjectSwitchMessage, shouldConfirmProjectSwitch } from '../src/projectSwitch.js';

test('project switch confirmation names both source and target projects', () => {
  assert.equal(
    formatProjectSwitchMessage('Havrano-L_Sol_900_300', 'Test_Proje_BOM-L_Sol_1000_1000'),
    '"Havrano-L_Sol_900_300" projeden "Test_Proje_BOM-L_Sol_1000_1000" projeye geçilecek.\n\nDevam edilsin mi?',
  );
});

test('project switch confirmation uses safe project-name fallbacks', () => {
  assert.equal(
    formatProjectSwitchMessage('', ''),
    '"Adsız Proje" projeden "Adsız Proje" projeye geçilecek.\n\nDevam edilsin mi?',
  );
});

test('same or empty project selection does not require confirmation', () => {
  assert.equal(shouldConfirmProjectSwitch('a', 'a'), false);
  assert.equal(shouldConfirmProjectSwitch('a', ''), false);
  assert.equal(shouldConfirmProjectSwitch('a', null), false);
  assert.equal(shouldConfirmProjectSwitch('a', 'b'), true);
  assert.equal(shouldConfirmProjectSwitch(null, 'b'), true);
});
