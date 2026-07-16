// Focus session timer. Tracks an absolute end timestamp rather than
// decrementing a counter each tick, so it stays accurate even when the
// browser throttles setInterval in a backgrounded tab.
import { reactive, computed } from "vue";

let tickInterval = null;

const state = reactive({
  activeTask: null,
  isRunning: false,
  isPaused: false,
  endAt: null,
  pausedRemainingMs: 0,
  remainingMs: 0,
  totalDurationMs: 0,
});

function tickLoop() {
  if (tickInterval) return;
  tickInterval = setInterval(() => {
    if (!state.isRunning || !state.endAt) return;
    const next = Math.max(0, state.endAt - Date.now());
    state.remainingMs = next;
    if (next <= 0) {
      state.isRunning = false;
      state.isPaused = false;
      state.endAt = null;
      state.pausedRemainingMs = 0;
      clearTick();
    }
  }, 250);
}

function clearTick() {
  if (!tickInterval) return;
  clearInterval(tickInterval);
  tickInterval = null;
}

function startSession(task, durationSeconds) {
  const durationMs = Math.max(0, durationSeconds * 1000);
  state.activeTask = task;
  state.totalDurationMs = durationMs;
  state.isRunning = true;
  state.isPaused = false;
  state.pausedRemainingMs = 0;
  state.endAt = Date.now() + durationMs;
  state.remainingMs = durationMs;
  tickLoop();
}

function pause() {
  if (!state.isRunning) return;
  state.isRunning = false;
  state.isPaused = true;
  state.pausedRemainingMs = state.remainingMs;
  state.endAt = null;
  clearTick();
}

function resume() {
  if (!state.activeTask || state.isRunning) return;
  const resumeMs = state.pausedRemainingMs || state.remainingMs;
  if (resumeMs <= 0) return;
  state.isRunning = true;
  state.isPaused = false;
  state.endAt = Date.now() + resumeMs;
  state.remainingMs = resumeMs;
  state.pausedRemainingMs = 0;
  tickLoop();
}

function stop() {
  state.isRunning = false;
  state.isPaused = false;
  state.endAt = null;
  state.pausedRemainingMs = 0;
  state.remainingMs = 0;
  state.totalDurationMs = 0;
  state.activeTask = null;
  clearTick();
}

function extend(minutes) {
  const addMs = Math.max(0, minutes * 60 * 1000);
  if (!addMs) return;
  state.totalDurationMs += addMs;
  if (state.isRunning && state.endAt) {
    state.endAt += addMs;
    state.remainingMs = Math.max(0, state.endAt - Date.now());
    return;
  }
  const baseMs = state.pausedRemainingMs || state.remainingMs;
  state.pausedRemainingMs = baseMs + addMs;
  state.remainingMs = state.pausedRemainingMs;
  state.isPaused = true;
}

const remainingFormatted = computed(() => {
  const totalSeconds = Math.ceil(state.remainingMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
});

const progress = computed(() => {
  if (!state.totalDurationMs) return 0;
  const raw = (state.totalDurationMs - state.remainingMs) / state.totalDurationMs;
  return Math.min(1, Math.max(0, raw));
});

export function useFocusTimer() {
  return { state, remainingFormatted, progress, startSession, pause, resume, stop, extend };
}
