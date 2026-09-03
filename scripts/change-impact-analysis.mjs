import { posix as path } from 'node:path';

const TEST_PREFIXES = ['test/', 'tests/'];
const AUDIT_PREFIX = 'audit/';
const DOC_SUFFIXES = ['.md'];

function isTestPath(filePath) {
  return TEST_PREFIXES.some((prefix) => filePath.startsWith(prefix));
}

function isDocPath(filePath) {
  return DOC_SUFFIXES.some((suffix) => filePath.endsWith(suffix));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

export function extractLocalReferenceSpecifiers(source) {
  const specifiers = [];
  const patterns = [
    /\b(?:import|export)\s+(?:[^;'"`]*?\s+from\s*)?['"]([^'"]+)['"]/g,
    /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
    /new\s+URL\s*\(\s*['"]([^'"]+)['"]\s*,\s*import\.meta\.url\s*\)/g,
    /['"]((?:\.\.\/|\.\/)[^'"]+)['"]/g,
  ];

  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const specifier = match[1]?.trim();
      if (specifier?.startsWith('.')) specifiers.push(specifier);
    }
  }

  return unique(specifiers);
}

export function resolveLocalReference(fromFile, specifier, knownPaths = new Set()) {
  const raw = path.normalize(path.join(path.dirname(fromFile), specifier));
  const candidates = unique([
    raw,
    `${raw}.js`,
    `${raw}.mjs`,
    `${raw}.cjs`,
    `${raw}.json`,
    `${raw}.css`,
    path.join(raw, 'index.js'),
  ]);

  for (const candidate of candidates) {
    if (knownPaths.has(candidate)) return candidate;
  }

  return raw;
}

export function buildReverseReferenceGraph(fileContents) {
  const knownPaths = new Set(Object.keys(fileContents));
  const reverse = new Map();

  for (const [fromFile, source] of Object.entries(fileContents)) {
    for (const specifier of extractLocalReferenceSpecifiers(source)) {
      const target = resolveLocalReference(fromFile, specifier, knownPaths);
      if (!reverse.has(target)) reverse.set(target, new Set());
      reverse.get(target).add(fromFile);
    }
  }

  return reverse;
}

export function collectReverseDependents(changedFiles, reverseGraph) {
  const roots = new Set(changedFiles);
  const visited = new Set(changedFiles);
  const queue = [...changedFiles];
  const dependents = new Set();

  while (queue.length) {
    const target = queue.shift();
    for (const dependent of reverseGraph.get(target) ?? []) {
      if (visited.has(dependent)) continue;
      visited.add(dependent);
      dependents.add(dependent);
      queue.push(dependent);
    }
  }

  for (const root of roots) dependents.delete(root);
  return [...dependents].sort();
}

function addToken(tokens, value) {
  if (!value) return;
  const token = value.trim();
  if (token.length < 5) return;
  if (/^(?:true|false|null|undefined|return|import|export|function|const|class|async|await)$/i.test(token)) return;
  tokens.add(token);
}

export function extractImpactTokensFromPatch(patchText) {
  const tokens = new Set();
  const changedLines = patchText
    .split(/\r?\n/)
    .filter((line) => (/^[+-]/.test(line) && !/^\+\+\+|^---/.test(line)))
    .map((line) => line.slice(1));

  for (const line of changedLines) {
    for (const match of line.matchAll(/\b(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g)) addToken(tokens, match[1]);
    for (const match of line.matchAll(/\bclass\s+([A-Za-z_$][\w$]*)/g)) addToken(tokens, match[1]);
    for (const match of line.matchAll(/\b([A-Za-z_$][\w$]*(?:State|Controller|Registry|Contract|Module|Descriptor|Factory|Handler|Action|Policy|Config))\b/g)) addToken(tokens, match[1]);
    for (const match of line.matchAll(/\bid\s*=\s*['"]([^'"]+)['"]/g)) addToken(tokens, match[1]);
    for (const match of line.matchAll(/\bdata-[\w-]+\s*=\s*['"]([^'"]+)['"]/g)) addToken(tokens, match[1]);
    for (const match of line.matchAll(/\bclass\s*=\s*['"]([^'"]+)['"]/g)) {
      for (const className of match[1].split(/\s+/)) addToken(tokens, className);
    }
    for (const match of line.matchAll(/#([A-Za-z][\w-]{4,})\b/g)) addToken(tokens, match[1]);
  }

  return [...tokens].sort();
}

function containsToken(source, token) {
  if (/^[A-Za-z_$][\w$]*$/.test(token)) {
    return new RegExp(`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).test(source);
  }
  return source.includes(token);
}

export function collectTokenReferences(fileContents, tokens, changedFiles = []) {
  if (!tokens.length) return [];
  const roots = new Set(changedFiles);
  const matches = [];

  for (const [filePath, source] of Object.entries(fileContents)) {
    if (roots.has(filePath)) continue;
    if (tokens.some((token) => containsToken(source, token))) matches.push(filePath);
  }

  return matches.sort();
}

function findingHeadingId(line) {
  const match = line.match(/\b(F-\d{3})\b/);
  return match?.[1] ?? null;
}

export function discoverCandidateFindings(fileContents, tokens, changedFiles = []) {
  const roots = new Set(changedFiles);
  const candidates = new Set();

  for (const [filePath, source] of Object.entries(fileContents)) {
    if (!filePath.startsWith(AUDIT_PREFIX) || roots.has(filePath) || !filePath.endsWith('.md')) continue;
    const lines = source.split(/\r?\n/);
    let currentFinding = null;

    for (const line of lines) {
      if (/^#{1,6}\s+/.test(line)) {
        const headingFinding = findingHeadingId(line);
        if (headingFinding) currentFinding = headingFinding;
      }
      if (!currentFinding) continue;
      if (tokens.some((token) => containsToken(line, token))) candidates.add(currentFinding);
    }
  }

  return [...candidates].sort();
}

export function analyzeChangeImpact({ changedFiles, tokenFiles = changedFiles, fileContents, patchText = '' }) {
  const roots = unique(changedFiles).sort();
  const tokenRoots = unique(tokenFiles).sort();
  const reverseGraph = buildReverseReferenceGraph(fileContents);
  const dependencyRefs = collectReverseDependents(roots, reverseGraph);
  const patchTokens = extractImpactTokensFromPatch(patchText);
  const pathTokens = tokenRoots.flatMap((filePath) => [filePath, path.basename(filePath)]);
  const tokens = unique([...patchTokens, ...pathTokens]).filter((token) => token.length >= 5);
  const tokenRefs = collectTokenReferences(fileContents, tokens, roots);
  const allRefs = unique([...dependencyRefs, ...tokenRefs]).sort();

  const affectedTests = allRefs.filter(isTestPath);
  const affectedDocs = allRefs.filter((filePath) => !isTestPath(filePath) && isDocPath(filePath));
  const affectedFiles = allRefs.filter((filePath) => !isTestPath(filePath) && !isDocPath(filePath) && !filePath.startsWith(AUDIT_PREFIX));
  const candidateFindings = discoverCandidateFindings(fileContents, tokens, roots);

  return {
    tokens,
    affectedFiles,
    affectedTests,
    affectedDocs,
    candidateFindings,
  };
}
