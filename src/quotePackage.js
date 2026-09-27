const PROJECTS_PREFIX = '/api/v1/fair-stand/projects';

export function standRenderUrl(projectId, assetId) {
  if (!projectId || !assetId) return null;
  return `${PROJECTS_PREFIX}/${projectId}/assets/${assetId}`;
}

export function formatCostTotal(snapshot) {
  if (!snapshot?.total?.currency || snapshot.total.amount == null) return '';
  return `${snapshot.total.amount} ${snapshot.total.currency}`;
}

/**
 * CRM teklif kaydına gidecek paket. Foreign key yok; proje kimliği düz UUID.
 */
export function buildQuotePackage({ snapshot, projectId, standRenderAssetId = null } = {}) {
  const id = projectId ?? snapshot?.projectId ?? null;
  return Object.freeze({
    standProjectId: id == null ? null : String(id),
    costSnapshot: snapshot ?? null,
    standRenderUrl: standRenderUrl(id, standRenderAssetId),
  });
}
