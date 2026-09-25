/**
 * Admin montaj kilit — N parçalık oturum grubu (DB’ye yazılmaz).
 * Absolute pose kaydı yeter; kilit sadece edit sırasında birlikte hareket içindir.
 */

export function assemblyPartKey(childItemKey, instanceIndex) {
  return `${String(childItemKey || '')}#${Number(instanceIndex) || 0}`;
}

export function partRefFromPart(part) {
  if (!part?.childItemKey) return null;
  return {
    childItemKey: String(part.childItemKey),
    instanceIndex: Number(part.instanceIndex) || 0,
  };
}

/** Follower’ın host’a göre ofseti (cm + Euler °). */
export function captureRelativePose(followerPose, hostPose) {
  return {
    xCm: Number(followerPose.xCm) - Number(hostPose.xCm),
    yCm: Number(followerPose.yCm) - Number(hostPose.yCm),
    zCm: Number(followerPose.zCm) - Number(hostPose.zCm),
    rotationXDeg: Number(followerPose.rotationXDeg) - Number(hostPose.rotationXDeg),
    rotationYDeg: Number(followerPose.rotationYDeg) - Number(hostPose.rotationYDeg),
    rotationZDeg: Number(followerPose.rotationZDeg) - Number(hostPose.rotationZDeg),
  };
}

/** Host pose + relative → follower absolute pose. */
export function applyRelativePose(hostPose, relative) {
  return {
    xCm: Number(hostPose.xCm) + Number(relative.xCm),
    yCm: Number(hostPose.yCm) + Number(relative.yCm),
    zCm: Number(hostPose.zCm) + Number(relative.zCm),
    rotationXDeg: Number(hostPose.rotationXDeg) + Number(relative.rotationXDeg),
    rotationYDeg: Number(hostPose.rotationYDeg) + Number(relative.rotationYDeg),
    rotationZDeg: Number(hostPose.rotationZDeg) + Number(relative.rotationZDeg),
  };
}

/** Sürüklenen parçanın delta’sı (grup hareketi). */
export function poseDelta(fromPose, toPose) {
  return {
    xCm: Number(toPose.xCm) - Number(fromPose.xCm),
    yCm: Number(toPose.yCm) - Number(fromPose.yCm),
    zCm: Number(toPose.zCm) - Number(fromPose.zCm),
    rotationXDeg: Number(toPose.rotationXDeg) - Number(fromPose.rotationXDeg),
    rotationYDeg: Number(toPose.rotationYDeg) - Number(fromPose.rotationYDeg),
    rotationZDeg: Number(toPose.rotationZDeg) - Number(fromPose.rotationZDeg),
  };
}

export function applyPoseDelta(pose, delta) {
  return {
    xCm: Number(pose.xCm) + Number(delta.xCm),
    yCm: Number(pose.yCm) + Number(delta.yCm),
    zCm: Number(pose.zCm) + Number(delta.zCm),
    rotationXDeg: Number(pose.rotationXDeg) + Number(delta.rotationXDeg),
    rotationYDeg: Number(pose.rotationYDeg) + Number(delta.rotationYDeg),
    rotationZDeg: Number(pose.rotationZDeg) + Number(delta.rotationZDeg),
  };
}

export function lockContainsPart(lock, part) {
  const ref = partRefFromPart(part);
  if (!lock?.members?.length || !ref) return false;
  const key = assemblyPartKey(ref.childItemKey, ref.instanceIndex);
  return lock.members.some(
    (m) => assemblyPartKey(m.childItemKey, m.instanceIndex) === key,
  );
}

/**
 * @param {Array<{ childItemKey: string, instanceIndex?: number }>} parts
 * @returns {{ members: Array<{ childItemKey: string, instanceIndex: number }> } | null}
 */
export function createAssemblyLockGroup(parts) {
  const members = [];
  const seen = new Set();
  for (const part of parts || []) {
    const ref = partRefFromPart(part);
    if (!ref) continue;
    const key = assemblyPartKey(ref.childItemKey, ref.instanceIndex);
    if (seen.has(key)) continue;
    seen.add(key);
    members.push(ref);
  }
  if (members.length < 2) return null;
  return { members };
}

/** Mevcut gruba yeni parça ekle (zaten varsa aynı lock). */
export function addPartToLockGroup(lock, part) {
  if (!lock?.members?.length) {
    return createAssemblyLockGroup([part]);
  }
  const ref = partRefFromPart(part);
  if (!ref) return lock;
  if (lockContainsPart(lock, ref)) return lock;
  return { members: [...lock.members, ref] };
}

/**
 * Parçayı gruptan çıkar. 2’den az kalırsa kilit sipariş edilir (null).
 * @returns {{ members: Array<{ childItemKey: string, instanceIndex: number }> } | null}
 */
export function removePartFromLockGroup(lock, part) {
  if (!lock?.members?.length) return null;
  const ref = partRefFromPart(part);
  if (!ref) return lock;
  const key = assemblyPartKey(ref.childItemKey, ref.instanceIndex);
  const members = lock.members.filter(
    (m) => assemblyPartKey(m.childItemKey, m.instanceIndex) !== key,
  );
  if (members.length < 2) return null;
  return { members };
}

/**
 * İkili kilit (geriye uyum). members + host/follower/relative.
 * @returns {object | null}
 */
export function createAssemblyLock(followerPart, hostPart, followerPose, hostPose) {
  const group = createAssemblyLockGroup([hostPart, followerPart]);
  if (!group) return null;
  return {
    ...group,
    host: { ...group.members[0] },
    follower: { ...group.members[1] },
    relative: captureRelativePose(followerPose, hostPose),
  };
}
