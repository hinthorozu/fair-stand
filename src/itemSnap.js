import { getItem, getItemSnapSpec, resolveSceneDimensions } from './items.js';
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

function listSnapHosts(modules, targetItemType, movingId) {
  const hosts = [];
  for (const module of modules ?? []) {
    if (!module || module.id === movingId) continue;
    const item = module.itemKey ? getItem(module.itemKey) : null;
    if (item?.type === targetItemType) {
      hosts.push(module);
      continue;
    }
    for (const row of item?.composition?.items ?? []) {
      const child = getItem(row.itemKey);
      if (child?.type === targetItemType) {
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

function anchorZCm(host, anchor) {
  const zCm = Number(host.placement?.zCm) || 0;
  const heightCm = hostHeightCm(host);
  if (anchor === 'top') return zCm + heightCm;
  if (anchor === 'bottom') return zCm;
  return zCm;
}

/** Snap moving item to nearest host of snapTargetItemType at snapAnchor. Null if no spec/host. */
export function snapPlacementToItemAnchor(moduleState, placement, modules = []) {
  const spec = getItemSnapSpec(moduleState);
  if (!spec || !placement) return null;
  const host = pickNearestHost(
    listSnapHosts(modules, spec.targetItemType, moduleState?.id),
    placement,
  );
  if (!host) return null;

  const next = { ...placement, zCm: anchorZCm(host, spec.anchor) };
  if (spec.anchor === 'left' || spec.anchor === 'right') {
    const widthCm = Number(moduleState.widthCm) || 0;
    const interval = getPlacementInterval(host.placement, host.widthCm);
    if (interval) {
      const startCm = spec.anchor === 'left'
        ? interval.startCm
        : interval.endCm - widthCm;
      if (interval.axis === 'y') next.yCm = startCm;
      else next.xCm = startCm;
    }
  }
  return next;
}

export function resolveSnapAnchorZCm(moduleState, placement, modules = []) {
  return snapPlacementToItemAnchor(moduleState, placement, modules)?.zCm ?? null;
}
