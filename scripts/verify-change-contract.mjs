import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  isGuardedChangeFile,
  requiredDomainsForFile,
  validateSystemChangeContract,
} from '../src/systemChangeContract.js';

const CONTRACT_PATH = '.github/change-contract.json';

function readJson(path) {
  return JSON.parse(readFileSync(resolve(path), 'utf8'));
}

function gitText(args, { allowFailure = false } = {}) {
  try {
    return execFileSync('git', args, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim();
  } catch (error) {
    if (allowFailure) return null;
    const stderr = typeof error?.stderr === 'string' ? error.stderr.trim() : '';
    throw new Error(`git ${args.join(' ')} failed${stderr ? `: ${stderr}` : '.'}`);
  }
}

function splitFiles(output) {
  return output.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function uniqueFiles(files) {
  return [...new Set(files.filter(Boolean))];
}

function gitDiffFiles(base, head = 'HEAD') {
  return splitFiles(gitText(['diff', '--name-only', base, head]));
}

function gitRefExists(ref) {
  return gitText(['rev-parse', '--verify', '--quiet', ref], { allowFailure: true }) !== null;
}

function gitWorkingTreeFiles() {
  const unstaged = splitFiles(gitText(['diff', '--name-only', 'HEAD']));
  const staged = splitFiles(gitText(['diff', '--cached', '--name-only']));
  const untracked = splitFiles(gitText(['ls-files', '--others', '--exclude-standard']));
  return uniqueFiles([...unstaged, ...staged, ...untracked]);
}

function resolveLocalBaseRef() {
  const override = process.env.CHANGE_GATE_BASE?.trim();
  if (override) {
    if (!gitRefExists(override)) {
      throw new Error(`CHANGE_GATE_BASE does not resolve to a git ref: ${override}`);
    }
    return override;
  }

  const currentBranch = gitText(['branch', '--show-current'], { allowFailure: true }) ?? '';

  if (currentBranch === 'ROG') {
    if (gitRefExists('refs/remotes/origin/ROG')) return 'refs/remotes/origin/ROG';
    return 'HEAD';
  }

  for (const candidate of ['ROG', 'refs/remotes/origin/ROG']) {
    if (gitRefExists(candidate)) return candidate;
  }

  throw new Error(
    'Unable to resolve a local change-gate base. Fetch/create ROG or set CHANGE_GATE_BASE explicitly.',
  );
}

function changedFilesFromEnvironment() {
  if (process.env.CHANGE_GATE_FILES) {
    return {
      files: uniqueFiles(process.env.CHANGE_GATE_FILES.split(/[,\n]/).map((item) => item.trim())),
      source: 'CHANGE_GATE_FILES',
    };
  }

  const eventName = process.env.GITHUB_EVENT_NAME;
  const eventPath = process.env.GITHUB_EVENT_PATH;

  if (!eventName || !eventPath) return null;

  const event = readJson(eventPath);

  if (eventName === 'pull_request') {
    const baseSha = event.pull_request?.base?.sha;
    if (!baseSha) throw new Error('Unable to resolve pull request base SHA.');
    return {
      files: gitDiffFiles(baseSha, 'HEAD'),
      source: `GitHub pull_request base ${baseSha}`,
    };
  }

  if (eventName === 'push') {
    const before = event.before;
    const after = event.after || 'HEAD';
    return {
      files: !before || /^0+$/.test(before)
        ? gitDiffFiles('HEAD^', 'HEAD')
        : gitDiffFiles(before, after),
      source: `GitHub push ${before || '<new-ref>'}..${after}`,
    };
  }

  return null;
}

function changedFilesFromLocalGit() {
  const baseRef = resolveLocalBaseRef();
  const committedFiles = [];

  if (baseRef !== 'HEAD') {
    const mergeBase = gitText(['merge-base', baseRef, 'HEAD']);
    committedFiles.push(...gitDiffFiles(mergeBase, 'HEAD'));
  }

  const workingTreeFiles = gitWorkingTreeFiles();
  return {
    files: uniqueFiles([...committedFiles, ...workingTreeFiles]),
    source: `local git diff against ${baseRef} + staged/unstaged/untracked`,
  };
}

const contract = readJson(CONTRACT_PATH);
const schemaErrors = validateSystemChangeContract(contract);

if (schemaErrors.length) {
  console.error('System change contract is invalid:');
  for (const error of schemaErrors) console.error(`- ${error}`);
  process.exit(1);
}

let diff;
try {
  diff = changedFilesFromEnvironment() ?? changedFilesFromLocalGit();
} catch (error) {
  console.error(`Unable to enforce the system change contract diff: ${error.message}`);
  process.exit(1);
}

const changedFiles = diff.files;
console.log(`Diff source: ${diff.source}`);

const guardedFiles = changedFiles.filter(isGuardedChangeFile);
if (guardedFiles.length === 0) {
  console.log('No guarded system files changed.');
  process.exit(0);
}

if (!changedFiles.includes(CONTRACT_PATH)) {
  console.error(`Guarded files changed but ${CONTRACT_PATH} was not updated.`);
  console.error('Declare the change impact before implementation is accepted.');
  for (const file of guardedFiles) console.error(`- ${file}`);
  process.exit(1);
}

const requiredDomains = new Set();
for (const file of guardedFiles) {
  for (const domain of requiredDomainsForFile(file)) requiredDomains.add(domain);
}

const undeclaredRequiredDomains = [...requiredDomains]
  .filter((domain) => contract.impact?.[domain] !== 'affected');

if (undeclaredRequiredDomains.length) {
  console.error('Changed high-risk paths require these impact domains to be marked affected:');
  for (const domain of undeclaredRequiredDomains) console.error(`- ${domain}`);
  process.exit(1);
}

console.log(`Change contract accepted: ${contract.id}`);
console.log(`Guarded files: ${guardedFiles.length}`);
if (requiredDomains.size) console.log(`Path-required domains: ${[...requiredDomains].join(', ')}`);
