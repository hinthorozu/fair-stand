function normalizeProjectName(value) {
  const name = String(value ?? '').trim();
  return name || 'Adsız Proje';
}

export function formatProjectSwitchMessage(fromProjectName, toProjectName) {
  const fromName = normalizeProjectName(fromProjectName);
  const toName = normalizeProjectName(toProjectName);
  return `"${fromName}" projeden "${toName}" projeye geçilecek.\n\nDevam edilsin mi?`;
}

export function shouldConfirmProjectSwitch(activeProjectId, selectedProjectId) {
  if (!selectedProjectId) return false;
  return selectedProjectId !== activeProjectId;
}
