import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { FAIR_STAND_MARKUP } from '../src/configuratorMarkup.js';

import {
  beginHistoricalView,
  beginLiveSession,
  createRevisionSession,
  displayedRevisionNumber,
  formatProjectTitle,
  noteRevisionCreated,
  resolveRevisionWrite,
} from '../src/projectRevisionSession.js';

function sessionWithDesign(design) {
  const session = createRevisionSession();
  beginLiveSession(session, { projectId: 'project-1', designSignature: design });
  return session;
}

test('opening a project does not allocate a revision until the design changes', () => {
  const session = sessionWithDesign('live');
  const looked = resolveRevisionWrite({ session, reason: 'design', designSignature: 'live' });
  assert.deepEqual(looked, { revisionMode: 'none', revisionNumber: null, writePayload: true });
  assert.equal(session.hasCreatedRevision, false);
});

test('the first design persist creates a revision and later saves update it', () => {
  const session = sessionWithDesign('live');
  const created = resolveRevisionWrite({ session, reason: 'design', designSignature: 'edited' });
  assert.equal(created.revisionMode, 'create');
  noteRevisionCreated(session, 4);
  for (let index = 0; index < 500; index += 1) {
    const write = resolveRevisionWrite({
      session,
      reason: index % 2 === 0 ? 'design' : 'autosave',
      designSignature: `edited-${index}`,
    });
    assert.equal(write.revisionMode, 'update');
    assert.equal(write.revisionNumber, 4);
  }
  assert.equal(session.activeRevisionNumber, 4);
});

test('a reopened session allocates the next revision only on the first edit', () => {
  const first = sessionWithDesign('live');
  noteRevisionCreated(first, 1);
  const reopened = createRevisionSession();
  beginLiveSession(reopened, { projectId: 'project-1', designSignature: 'live' });
  assert.equal(
    resolveRevisionWrite({ session: reopened, reason: 'design', designSignature: 'live' }).revisionMode,
    'none',
  );
  assert.equal(
    resolveRevisionWrite({ session: reopened, reason: 'autosave', designSignature: 'next' }).revisionMode,
    'create',
  );
});

test('viewing a historical revision does not write until that snapshot is edited', () => {
  const session = createRevisionSession();
  beginHistoricalView(session, {
    projectId: 'project-1',
    revisionNumber: 1,
    designSignature: 'old',
  });
  const viewed = resolveRevisionWrite({ session, reason: 'design', designSignature: 'old' });
  assert.deepEqual(viewed, { revisionMode: 'none', revisionNumber: null, writePayload: false });
  const edited = resolveRevisionWrite({ session, reason: 'autosave', designSignature: 'changed-old' });
  assert.equal(edited.revisionMode, 'create');
  assert.equal(edited.writePayload, true);
  noteRevisionCreated(session, 4);
  const later = resolveRevisionWrite({ session, reason: 'design', designSignature: 'changed-old-2' });
  assert.deepEqual(later, { revisionMode: 'update', revisionNumber: 4, writePayload: true });
  assert.equal(session.mode, 'live');
});

test('rename does not start a revision and export does not create one for an unchanged scene', () => {
  const session = sessionWithDesign('live');
  assert.equal(
    resolveRevisionWrite({ session, reason: 'metadata', designSignature: 'live-renamed-name-only' }).revisionMode,
    'none',
  );
  assert.equal(
    resolveRevisionWrite({ session, reason: 'export', designSignature: 'live' }).revisionMode,
    'none',
  );
  noteRevisionCreated(session, 2);
  const exported = resolveRevisionWrite({ session, reason: 'export', designSignature: 'live' });
  assert.deepEqual(exported, { revisionMode: 'update', revisionNumber: 2, writePayload: true });
});

test('new project, save-as, and import create the first revision', () => {
  for (const reason of ['init', 'save-as', 'import']) {
    const session = sessionWithDesign(null);
    const write = resolveRevisionWrite({ session, reason, designSignature: 'scene' });
    assert.equal(write.revisionMode, 'create', reason);
  }
});

const PROJECT_NAME = 'Laminet-L_Sol_700_500';

function revisionsOf(...numbers) {
  return numbers.map((revisionNumber) => ({ revisionNumber }));
}

test('a loaded revision number is the project title suffix', () => {
  const session = createRevisionSession();
  beginLiveSession(session, { projectId: 'project-1', revisions: revisionsOf(1) });
  noteRevisionCreated(session, 1);
  assert.equal(formatProjectTitle(PROJECT_NAME, displayedRevisionNumber(session)), `${PROJECT_NAME} - R1`);

  noteRevisionCreated(session, 2);
  assert.equal(formatProjectTitle(PROJECT_NAME, displayedRevisionNumber(session)), `${PROJECT_NAME} - R2`);

  const latest = createRevisionSession();
  beginLiveSession(latest, { projectId: 'project-1', revisions: revisionsOf(1, 2, 3) });
  assert.equal(displayedRevisionNumber(latest), 3);
  assert.equal(formatProjectTitle(PROJECT_NAME, displayedRevisionNumber(latest)), `${PROJECT_NAME} - R3`);
});

test('a historical revision title follows the opened snapshot and switches when a new revision is created', () => {
  const session = createRevisionSession();
  beginHistoricalView(session, {
    projectId: 'project-1',
    revisionNumber: 1,
    designSignature: 'old',
    revisions: revisionsOf(1, 2, 3),
  });
  assert.equal(displayedRevisionNumber(session), 1);
  assert.equal(formatProjectTitle(PROJECT_NAME, displayedRevisionNumber(session)), `${PROJECT_NAME} - R1`);

  const edited = resolveRevisionWrite({ session, reason: 'design', designSignature: 'changed-old' });
  assert.equal(edited.revisionMode, 'create');
  noteRevisionCreated(session, 4);
  assert.equal(session.mode, 'live');
  assert.equal(displayedRevisionNumber(session), 4);
  assert.equal(formatProjectTitle(PROJECT_NAME, displayedRevisionNumber(session)), `${PROJECT_NAME} - R4`);
});

test('same-session save and autosave keep the revision suffix', () => {
  const session = createRevisionSession();
  beginLiveSession(session, { projectId: 'project-1', designSignature: 'scene', revisions: revisionsOf(2) });
  noteRevisionCreated(session, 2);
  const before = formatProjectTitle(PROJECT_NAME, displayedRevisionNumber(session));
  for (const reason of ['autosave', 'design']) {
    const write = resolveRevisionWrite({ session, reason, designSignature: `${reason}-edit` });
    assert.equal(write.revisionMode, 'update');
    assert.equal(write.revisionNumber, 2);
    assert.equal(formatProjectTitle(PROJECT_NAME, displayedRevisionNumber(session)), before);
    assert.equal(before, `${PROJECT_NAME} - R2`);
  }
});

test('a project with no revision has no revision suffix', () => {
  const session = createRevisionSession();
  beginLiveSession(session, { projectId: 'project-1', revisions: [] });
  assert.equal(displayedRevisionNumber(session), null);
  const title = formatProjectTitle(PROJECT_NAME, displayedRevisionNumber(session));
  assert.equal(title, PROJECT_NAME);
  assert.equal(title.includes('R0'), false);
  assert.equal(formatProjectTitle(PROJECT_NAME, 0), PROJECT_NAME);
});

test('the current-scene button is gone and a revision click shows the loader', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const main = readFileSync(new URL('../src/main.js', import.meta.url), 'utf8');
  for (const source of [html, FAIR_STAND_MARKUP, main]) {
    assert.equal(source.includes('Güncel sahne'), false);
    assert.equal(source.includes('project-revision-live'), false);
  }
  assert.match(html, /id="project-name-display"/);
  assert.match(FAIR_STAND_MARKUP, /id="project-name-display"/);
  assert.match(main, /projectLoading\.show\(`R\$\{revisionNumber\} yükleniyor…`, 'Revizyon sahnesi hazırlanıyor\.'\)/);
  assert.match(main, /formatProjectTitle\(name, displayedRevisionNumber\(revisionSession\)\)/);
});
