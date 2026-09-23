import { getItem, getItemSnapSpec, itemProvidesSnapRule, resolveSceneDimensions } from './items.js';
import { getPlacementInterval } from './modulePlacement.js';

function hostHeightCm(host) {
  const item = host?.itemKey ? getItem(host.itemKey) : null;
  const scene = item ? resolveSceneDimensions(item) : {};
  const height = Number(host.heightCm ?? scene.heightCm);
  return Number.isFinite(height) ? height : 0;
}

function distanceSq(host, xCm, yCm) {
  const dx = Number(host.placement?.xCm ?? 0) - Number(xCm);
  const dy = Number(host.placement?.yCm ?? 0) - Number(yCm);
  return dx * dx + dy * dy;
}

/** Hosts that provide the required snap rule (self or recipe child). */
function listSnapHosts(modules, spec, movingId) {
  const hosts = [];
  for (const module of modules ?? []) {
    if (!module || module.id === movingId) continue;
    const item = module.itemKey ? getItem(module.itemKey) : null;
    if (itemProvidesSnapRule(item, spec)) {
      hosts.push(module);
      continue;
    }
    for (const row of item?.composition?.items ?? []) {
      const child = getItem(row.itemKey);
      if (itemProvidesSnapRule(child, spec)) {
        hosts.push(module);
        break;
      }
    }
  }
  return hosts;
}

function pickNearestHost(hosts, placement) {
  if (!hosts.length) return null;
  const wallId = placement?.wallId;
  const sameWall = wallId && wallId !== 'free'
    ? hosts.filter((host) => !host.placement?.wallId || host.placement.wallId === wallId || host.placement.wallId === 'free')
    : hosts;
  const pool = sameWall.length ? sameWall : hosts;
  const xCm = Number(placement?.xCm ?? 0);
  const yCm = Number(placement?.yCm ?? 0);
  return [...pool].sort((left, right) => distanceSq(left, xCm, yCm) - distanceSq(right, xCm, yCm))[0];
}

/**
 * Z from provider face/edge recipe on the host box.
 * face=top + edge=top (or any edge on top face) → host top.
 * face=front + edge=top → host base + height (same box top until virtual band lines land).
 */
function mountZCmFromFaceEdge(host, face, edge) {
  const zCm = Number(host.placement?.zCm) || 0;
  const heightCm = hostHeightCm(host);
  if (face === 'top' || (face === 'front' && edge === 'top') || (face === 'back' && edge === 'top')) {
    return zCm + heightCm;
  }
  if (face === 'bottom' || edge === 'bottom') return zCm;
  return zCm + heightCm;
}

function resolveProviderFaceEdge(host, spec) {
  const item = host?.itemKey ? getItem(host.itemKey) : null;
  if (itemProvidesSnapRule(item, spec)) {
    return { face: item.snapFace, edge: item.snapEdge };
  }
  for (const row of item?.composition?.items ?? []) {
    const child = getItem(row.itemKey);
    if (itemProvidesSnapRule(child, spec)) {
      return { face: child.snapFace, edge: child.snapEdge };
    }
  }
  return { face: null, edge: null };
}

/** Snap moving item to nearest host that provides the required rule. Null if no spec/host. */
export function snapPlacementToItemAnchor(moduleState, placement, modules = []) {
  const spec = getItemSnapSpec(moduleState);
  if ((!spec?.requiresRuleId && !spec?.requires) || !placement) return null;
  const host = pickNearestHost(listSnapHosts(modules, spec, moduleState?.id), placement);
  if (!host) return null;

  const { face, edge } = resolveProviderFaceEdge(host, spec);
  const next = { ...placement, zCm: mountZCmFromFaceEdge(host, face, edge) };
  if (edge === 'left' || edge === 'right') {
    const widthCm = Number(moduleState.widthCm) || 0;
    const interval = getPlacementInterval(host.placement, host.widthCm);
    if (interval) {
      const startCm = edge === 'left' ? interval.startCm : interval.endCm - widthCm;
      if (interval.axis === 'y') next.yCm = startCm;
      else next.xCm = startCm;
    }
  }
  return next;
}

export function resolveSnapAnchorZCm(moduleState, placement, modules = []) {
  return snapPlacementToItemAnchor(moduleState, placement, modules)?.zCm ?? null;
}
