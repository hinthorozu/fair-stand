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

function gitDiffFiles(base, head = 'HEAD') {
  const output = execFileSync('git', ['diff', '--name-only', base, head], { encoding: 'utf8' });
  return output.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
}

function changedFilesFromEnvironment() {
  if (process.env.CHANGE_GATE_FILES) {
    return process.env.CHANGE_GATE_FILES.split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
  }

  const eventName = process.env.GITHUB_EVENT_NAME;
  const eventPath = process.env.GITHUB_EVENT_PATH;

  if (!eventName || !eventPath) return null;

  const event = readJson(eventPath);

  if (eventName === 'pull_request') {
    const baseSha = event.pull_request?.base?.sha;
    if (!baseSha) throw new Error('Unable to resolve pull request base SHA.');
    return gitDiffFiles(baseSha, 'HEAD');
  }

  if (eventName === 'push') {
    const before = event.before;
    const after = event.after || 'HEAD';
    if (!before || /^0+$/.test(before)) return gitDiffFiles('HEAD^', 'HEAD');
    return gitDiffFiles(before, after);
  }

  return null;
}

const contract = readJson(CONTRACT_PATH);
const schemaErrors = validateSystemChangeContract(contract);

if (schemaErrors.length) {
  console.error('System change contract is invalid:');
  for (const error of schemaErrors) console.error(`- ${error}`);
  process.exit(1);
}

const changedFiles = changedFilesFromEnvironment();
if (!changedFiles) {
  console.log('System change contract schema is valid. Diff enforcement skipped outside CI.');
  process.exit(0);
}

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
