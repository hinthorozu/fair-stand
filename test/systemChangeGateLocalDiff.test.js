import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  appendFileSync,
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

function git(cwd, args) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function localVerifierEnv(base = 'HEAD') {
  const env = { ...process.env, CHANGE_GATE_BASE: base };
  delete env.CHANGE_GATE_FILES;
  delete env.GITHUB_EVENT_NAME;
  delete env.GITHUB_EVENT_PATH;
  return env;
}

function runVerifier(cwd, base = 'HEAD') {
  return spawnSync(process.execPath, ['scripts/verify-change-contract.mjs'], {
    cwd,
    env: localVerifierEnv(base),
    encoding: 'utf8',
  });
}

test('local verifier enforces committed, staged, unstaged and untracked git changes without CI env', () => {
  const cwd = mkdtempSync(join(tmpdir(), 'fair-stand-change-gate-'));

  try {
    mkdirSync(join(cwd, '.github'), { recursive: true });
    mkdirSync(join(cwd, 'scripts'), { recursive: true });
    mkdirSync(join(cwd, 'src'), { recursive: true });

    copyFileSync(
      new URL('../.github/change-contract.json', import.meta.url),
      join(cwd, '.github/change-contract.json'),
    );
    copyFileSync(
      new URL('../scripts/verify-change-contract.mjs', import.meta.url),
      join(cwd, 'scripts/verify-change-contract.mjs'),
    );
    copyFileSync(
      new URL('../src/systemChangeContract.js', import.meta.url),
      join(cwd, 'src/systemChangeContract.js'),
    );
    writeFileSync(join(cwd, 'package.json'), '{"type":"module"}\n');

    git(cwd, ['init', '-q']);
    git(cwd, ['config', 'user.email', 'change-gate-test@example.invalid']);
    git(cwd, ['config', 'user.name', 'Change Gate Test']);
    git(cwd, ['add', '.']);
    git(cwd, ['commit', '-qm', 'baseline']);

    // Untracked guarded source without a declaration update must fail locally.
    writeFileSync(join(cwd, 'src/example.js'), 'export const example = true;\n');
    let result = runVerifier(cwd);
    assert.notEqual(result.status, 0);
    assert.match(result.stdout, /Diff source: local git diff against HEAD \+ staged\/unstaged\/untracked/);
    assert.match(result.stderr, /Guarded files changed but \.github\/change-contract\.json was not updated/);

    // Stage the source and make the declaration an unstaged tracked change; the union must pass.
    git(cwd, ['add', 'src/example.js']);
    appendFileSync(join(cwd, '.github/change-contract.json'), '\n');
    result = runVerifier(cwd);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Change contract accepted:/);

    // Commit both changes and verify local committed-diff enforcement against an explicit base.
    git(cwd, ['add', '.github/change-contract.json']);
    git(cwd, ['commit', '-qm', 'guarded change with declaration']);
    result = runVerifier(cwd, 'HEAD^');
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Diff source: local git diff against HEAD\^ \+ staged\/unstaged\/untracked/);
    assert.match(result.stdout, /Guarded files: 1/);
  } finally {
    rmSync(cwd, { recursive: true, force: true });
  }
});
