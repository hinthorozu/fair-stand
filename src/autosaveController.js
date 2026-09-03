export const DEFAULT_AUTOSAVE_DELAY_MS = 5000;
export const DEFAULT_AUTOSAVE_WATCH_INTERVAL_MS = 1000;

export function createAutosaveController({
  getSignature,
  persist,
  setStatus = () => {},
  onError = () => {},
  setTimeoutFn = globalThis.setTimeout,
  clearTimeoutFn = globalThis.clearTimeout,
  setIntervalFn = globalThis.setInterval,
  clearIntervalFn = globalThis.clearInterval,
  delayMs = DEFAULT_AUTOSAVE_DELAY_MS,
  watchIntervalMs = DEFAULT_AUTOSAVE_WATCH_INTERVAL_MS,
} = {}) {
  if (typeof getSignature !== 'function') throw new TypeError('getSignature function is required.');
  if (typeof persist !== 'function') throw new TypeError('persist function is required.');
  if (typeof setTimeoutFn !== 'function' || typeof clearTimeoutFn !== 'function') {
    throw new TypeError('Timeout functions are required.');
  }
  if (typeof setIntervalFn !== 'function' || typeof clearIntervalFn !== 'function') {
    throw new TypeError('Interval functions are required.');
  }

  let enabled = false;
  let pendingTimer = null;
  let watchTimer = null;
  let observedSignature = null;

  function clearPending() {
    if (pendingTimer !== null) clearTimeoutFn(pendingTimer);
    pendingTimer = null;
  }

  function markCurrentState() {
    observedSignature = getSignature();
    return observedSignature;
  }

  function schedule() {
    if (!enabled) return false;
    clearPending();
    setStatus('Değişiklik var · 5 sn içinde otomatik kaydedilecek…');
    pendingTimer = setTimeoutFn(async () => {
      pendingTimer = null;
      if (!enabled) return;
      setStatus('Kaydediliyor…');
      try {
        await persist({ quiet: true });
        markCurrentState();
        setStatus('Kaydedildi · Otomatik');
      } catch (error) {
        onError(error);
        setStatus('Otomatik kayıt başarısız.');
      }
    }, delayMs);
    return true;
  }

  function checkForChanges() {
    if (!enabled) return false;
    const signature = getSignature();
    if (signature === observedSignature) return false;
    observedSignature = signature;
    schedule();
    return true;
  }

  function startWatching() {
    if (watchTimer !== null) return;
    watchTimer = setIntervalFn(checkForChanges, watchIntervalMs);
  }

  function stopWatching() {
    if (watchTimer !== null) clearIntervalFn(watchTimer);
    watchTimer = null;
  }

  function enableFromCurrentState() {
    clearPending();
    markCurrentState();
    enabled = true;
    startWatching();
  }

  function disable() {
    enabled = false;
    clearPending();
    observedSignature = null;
    stopWatching();
  }

  function markSavedState() {
    clearPending();
    return markCurrentState();
  }

  function isEnabled() {
    return enabled;
  }

  return Object.freeze({
    checkForChanges,
    clearPending,
    disable,
    enableFromCurrentState,
    isEnabled,
    markSavedState,
    schedule,
  });
}
