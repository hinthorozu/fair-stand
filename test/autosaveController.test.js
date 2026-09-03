import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DEFAULT_AUTOSAVE_DELAY_MS,
  DEFAULT_AUTOSAVE_WATCH_INTERVAL_MS,
  createAutosaveController,
} from '../src/autosaveController.js';

function createFakeClock() {
  let nextId = 1;
  const timeouts = new Map();
  const intervals = new Map();
  const clearedTimeouts = [];
  const clearedIntervals = [];

  return {
    setTimeoutFn(callback, delay) {
      const id = nextId++;
      timeouts.set(id, { callback, delay });
      return id;
    },
    clearTimeoutFn(id) {
      clearedTimeouts.push(id);
      timeouts.delete(id);
    },
    setIntervalFn(callback, delay) {
      const id = nextId++;
      intervals.set(id, { callback, delay });
      return id;
    },
    clearIntervalFn(id) {
      clearedIntervals.push(id);
      intervals.delete(id);
    },
    timeouts,
    intervals,
    clearedTimeouts,
    clearedIntervals,
  };
}

test('autosave constants preserve the current 5s debounce / 1s watch contract', () => {
  assert.equal(DEFAULT_AUTOSAVE_DELAY_MS, 5000);
  assert.equal(DEFAULT_AUTOSAVE_WATCH_INTERVAL_MS, 1000);
});

test('enable captures current signature and starts exactly one watcher', () => {
  const clock = createFakeClock();
  let signature = 'initial';
  const controller = createAutosaveController({
    getSignature: () => signature,
    persist: async () => {},
    ...clock,
  });

  controller.enableFromCurrentState();
  controller.enableFromCurrentState();

  assert.equal(controller.isEnabled(), true);
  assert.equal(clock.intervals.size, 1);
  assert.equal([...clock.intervals.values()][0].delay, 1000);
  signature = 'changed';
  assert.equal(controller.checkForChanges(), true);
  assert.equal(clock.timeouts.size, 1);
});

test('unchanged state does not schedule autosave', () => {
  const clock = createFakeClock();
  const controller = createAutosaveController({
    getSignature: () => 'same',
    persist: async () => {},
    ...clock,
  });

  controller.enableFromCurrentState();

  assert.equal(controller.checkForChanges(), false);
  assert.equal(clock.timeouts.size, 0);
});

test('changed state schedules one debounce and a later change replaces it', () => {
  const clock = createFakeClock();
  const statuses = [];
  let signature = 'a';
  const controller = createAutosaveController({
    getSignature: () => signature,
    persist: async () => {},
    setStatus: (value) => statuses.push(value),
    ...clock,
  });

  controller.enableFromCurrentState();
  signature = 'b';
  controller.checkForChanges();
  const firstTimerId = [...clock.timeouts.keys()][0];

  signature = 'c';
  controller.checkForChanges();
  const secondTimerId = [...clock.timeouts.keys()][0];

  assert.notEqual(firstTimerId, secondTimerId);
  assert.deepEqual(clock.clearedTimeouts, [firstTimerId]);
  assert.equal(clock.timeouts.size, 1);
  assert.equal([...clock.timeouts.values()][0].delay, 5000);
  assert.equal(statuses.at(-1), 'Değişiklik var · 5 sn içinde otomatik kaydedilecek…');
});

test('scheduled persist uses quiet mode and marks the persisted signature as observed', async () => {
  const clock = createFakeClock();
  const statuses = [];
  const persistCalls = [];
  let signature = 'a';
  const controller = createAutosaveController({
    getSignature: () => signature,
    persist: async (options) => { persistCalls.push(options); },
    setStatus: (value) => statuses.push(value),
    ...clock,
  });

  controller.enableFromCurrentState();
  signature = 'b';
  controller.checkForChanges();

  const timeout = [...clock.timeouts.values()][0];
  await timeout.callback();

  assert.deepEqual(persistCalls, [{ quiet: true }]);
  assert.deepEqual(statuses.slice(-2), ['Kaydediliyor…', 'Kaydedildi · Otomatik']);
  assert.equal(controller.checkForChanges(), false);
});

test('persist failure reports error and preserves enabled state', async () => {
  const clock = createFakeClock();
  const errors = [];
  const statuses = [];
  let signature = 'a';
  const failure = new Error('storage failed');
  const controller = createAutosaveController({
    getSignature: () => signature,
    persist: async () => { throw failure; },
    setStatus: (value) => statuses.push(value),
    onError: (error) => errors.push(error),
    ...clock,
  });

  controller.enableFromCurrentState();
  signature = 'b';
  controller.checkForChanges();
  const timeout = [...clock.timeouts.values()][0];
  await timeout.callback();

  assert.equal(controller.isEnabled(), true);
  assert.deepEqual(errors, [failure]);
  assert.equal(statuses.at(-1), 'Otomatik kayıt başarısız.');
});

test('disable cancels pending debounce and watcher without persisting', async () => {
  const clock = createFakeClock();
  let signature = 'a';
  let persistCount = 0;
  const controller = createAutosaveController({
    getSignature: () => signature,
    persist: async () => { persistCount += 1; },
    ...clock,
  });

  controller.enableFromCurrentState();
  const watcherId = [...clock.intervals.keys()][0];
  signature = 'b';
  controller.checkForChanges();
  const timeoutId = [...clock.timeouts.keys()][0];
  const pendingCallback = clock.timeouts.get(timeoutId).callback;

  controller.disable();
  await pendingCallback();

  assert.equal(controller.isEnabled(), false);
  assert.equal(persistCount, 0);
  assert.deepEqual(clock.clearedTimeouts, [timeoutId]);
  assert.deepEqual(clock.clearedIntervals, [watcherId]);
  assert.equal(clock.timeouts.size, 0);
  assert.equal(clock.intervals.size, 0);
});

test('markSavedState cancels pending debounce and re-baselines the current signature', () => {
  const clock = createFakeClock();
  let signature = 'a';
  const controller = createAutosaveController({
    getSignature: () => signature,
    persist: async () => {},
    ...clock,
  });

  controller.enableFromCurrentState();
  signature = 'b';
  controller.checkForChanges();
  const timeoutId = [...clock.timeouts.keys()][0];

  controller.markSavedState();

  assert.deepEqual(clock.clearedTimeouts, [timeoutId]);
  assert.equal(clock.timeouts.size, 0);
  assert.equal(controller.checkForChanges(), false);
});
