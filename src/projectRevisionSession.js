export function createRevisionSession() {
  return {
    projectId: null,
    mode: 'live',
    activeRevisionNumber: null,
    hasCreatedRevision: false,
    baselineDesign: null,
    viewingRevisionNumber: null,
    historicalEditArmed: false,
    revisions: [],
  };
}

export function beginLiveSession(session, { projectId, designSignature = null, revisions = [] } = {}) {
  session.projectId = projectId ?? null;
  session.mode = 'live';
  session.activeRevisionNumber = null;
  session.hasCreatedRevision = false;
  session.baselineDesign = designSignature;
  session.viewingRevisionNumber = null;
  session.historicalEditArmed = false;
  session.revisions = Array.isArray(revisions) ? revisions : [];
}

export function beginHistoricalView(session, {
  projectId,
  revisionNumber,
  designSignature = null,
  revisions = [],
} = {}) {
  session.projectId = projectId ?? null;
  session.mode = 'historical';
  session.activeRevisionNumber = null;
  session.hasCreatedRevision = false;
  session.baselineDesign = designSignature;
  session.viewingRevisionNumber = revisionNumber ?? null;
  session.historicalEditArmed = false;
  session.revisions = Array.isArray(revisions) ? revisions : [];
}

export function maxRevisionNumber(revisions) {
  const numbers = (revisions || [])
    .map((revision) => Number(revision.revisionNumber))
    .filter((number) => Number.isInteger(number) && number > 0);
  if (!numbers.length) return null;
  return Math.max(...numbers);
}

export function displayedRevisionNumber(session) {
  if (!session) return null;
  if (session.mode === 'historical') {
    const viewing = Number(session.viewingRevisionNumber);
    if (Number.isInteger(viewing) && viewing > 0) return viewing;
  }
  const active = Number(session.activeRevisionNumber);
  if (session.hasCreatedRevision && Number.isInteger(active) && active > 0) return active;
  return maxRevisionNumber(session.revisions);
}

export function formatProjectTitle(projectName, revisionNumber) {
  const name = String(projectName || '').trim() || 'Adsız Proje';
  const number = Number(revisionNumber);
  if (!Number.isInteger(number) || number <= 0) return name;
  return `${name} - R${number}`;
}

export function noteRevisionCreated(session, revisionNumber) {
  session.hasCreatedRevision = true;
  session.activeRevisionNumber = revisionNumber;
  session.mode = 'live';
  session.viewingRevisionNumber = null;
  session.historicalEditArmed = false;
}

export function resolveRevisionWrite({ session, reason = 'design', designSignature }) {
  const changed = designSignature !== session.baselineDesign;
  const historicalHold = session.mode === 'historical' && !session.hasCreatedRevision;

  if (reason === 'metadata') {
    return {
      revisionMode: 'none',
      revisionNumber: null,
      writePayload: !historicalHold,
    };
  }

  if (reason === 'export') {
    if (session.hasCreatedRevision) {
      return {
        revisionMode: 'update',
        revisionNumber: session.activeRevisionNumber,
        writePayload: true,
      };
    }
    if (changed) {
      return { revisionMode: 'create', revisionNumber: null, writePayload: true };
    }
    return { revisionMode: 'none', revisionNumber: null, writePayload: !historicalHold };
  }

  if (reason === 'init' || reason === 'save-as' || reason === 'import') {
    if (session.hasCreatedRevision) {
      return {
        revisionMode: 'update',
        revisionNumber: session.activeRevisionNumber,
        writePayload: true,
      };
    }
    return { revisionMode: 'create', revisionNumber: null, writePayload: true };
  }

  if (historicalHold && !changed) {
    return { revisionMode: 'none', revisionNumber: null, writePayload: false };
  }

  if (!session.hasCreatedRevision) {
    if (!changed) {
      return {
        revisionMode: 'none',
        revisionNumber: null,
        writePayload: session.mode === 'live',
      };
    }
    return { revisionMode: 'create', revisionNumber: null, writePayload: true };
  }

  return {
    revisionMode: 'update',
    revisionNumber: session.activeRevisionNumber,
    writePayload: true,
  };
}
