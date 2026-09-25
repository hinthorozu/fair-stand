/**
 * Admin montaj kilit — host/follower relative pose (oturum içi; DB’ye yazılmaz).
 * Absolute pose kaydı yeter; kilit sadece edit sırasında birlikte hareket içindir.
 */

export function assemblyPartKey(childItemKey, instanceIndex) {
  return `${String(childItemKey || '')}#${Number(instanceIndex) || 0}`;
}

/** Follower’ın host’a göre ofseti (parent-lokal cm + Euler °). */
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

/**
 * @returns {{
 *   host: { childItemKey: string, instanceIndex: number },
 *   follower: { childItemKey: string, instanceIndex: number },
 *   relative: ReturnType<typeof captureRelativePose>
 * } | null}
 */
export function createAssemblyLock(followerPart, hostPart, followerPose, hostPose) {
  if (!followerPart?.childItemKey || !hostPart?.childItemKey) return null;
  if (
    assemblyPartKey(followerPart.childItemKey, followerPart.instanceIndex)
    === assemblyPartKey(hostPart.childItemKey, hostPart.instanceIndex)
  ) {
    return null;
  }
  return {
    host: {
      childItemKey: String(hostPart.childItemKey),
      instanceIndex: Number(hostPart.instanceIndex) || 0,
    },
    follower: {
      childItemKey: String(followerPart.childItemKey),
      instanceIndex: Number(followerPart.instanceIndex) || 0,
    },
    relative: captureRelativePose(followerPose, hostPose),
  };
}
