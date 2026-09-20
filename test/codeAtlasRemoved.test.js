import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

test('stale CODE_ATLAS reports are not in the repository', () => {
  const atlas = fileURLToPath(new URL('../CODE_ATLAS', import.meta.url));
  assert.equal(existsSync(atlas), false);
});
