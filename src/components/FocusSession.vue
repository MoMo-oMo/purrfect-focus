<template>
  <Modal @close="handleClose">
    <div class="session">
      <div ref="confettiRef" class="confetti-container" aria-hidden="true" />
      <h2 class="session-title">{{ task.title }}</h2>
      <p class="session-subject">{{ task.subject }}</p>

      <!-- Break mode -->
      <div v-if="isOnBreak" class="break-panel">
        <span class="break-label">Break</span>
        <div class="break-countdown">{{ breakFormatted }}</div>
        <p class="break-hint">Pet the cat below 🐾</p>
        <div class="cat-slot" @click="petCat">
          <CatMascot ref="catRef" />
        </div>
      </div>

      <!-- Focus mode -->
      <template v-else>
        <div class="ring-wrap" :class="{ 'ring-wrap--live': timer.state.isRunning && isSessionForThisTask }">
          <svg class="ring" viewBox="0 0 160 160">
            <defs>
              <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffb977" />
                <stop offset="100%" stop-color="#f0965a" />
              </linearGradient>
            </defs>
            <circle class="ring-track" cx="80" cy="80" r="70" />
            <circle
              class="ring-progress"
              cx="80" cy="80" r="70"
              :style="ringStyle"
            />
          </svg>
          <div class="ring-center">
            <span class="ring-time">{{ displayTime }}</span>
            <span class="ring-status">{{ statusLabel }}</span>
          </div>
        </div>

        <div class="session-actions">
          <button v-if="!timer.state.isRunning && !timer.state.isPaused" class="primary-btn" @click="start">
            ▶ Start focusing
          </button>
          <template v-else>
            <button class="icon-btn" @click="togglePause" :title="timer.state.isRunning ? 'Pause' : 'Resume'">
              {{ timer.state.isRunning ? "⏸" : "▶" }}
            </button>
          </template>
        </div>

        <div v-if="task.status === 'active'" class="perk-row">
          <button class="perk-btn" :disabled="snacksRemaining <= 0" @click="useSnack">
            <img :src="jarImage" alt="" class="perk-icon" />
            <span>Snack&nbsp;<strong>{{ snacksRemaining }}</strong></span>
          </button>
          <button class="perk-btn" :disabled="breakUsed" @click="startBreak">
            <img :src="bellImage" alt="" class="perk-icon" />
            <span>Break</span>
          </button>
          <div class="cat-corner">
            <CatMascot ref="catRef" />
          </div>
        </div>
      </template>

      <!-- Session finished decision -->
      <div v-if="showDecision" class="decision-overlay">
        <p class="decision-heading">Time's up!</p>
        <p class="decision-text">Mark this task done, or keep going a little longer.</p>
        <div class="extend-row">
          <input v-model.number="extraMinutes" type="number" min="1" class="extend-input" />
          <span>min</span>
          <button class="secondary-btn" @click="extendSession">Add time</button>
        </div>
        <button class="primary-btn" @click="finishTask">✓ Mark complete</button>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from "vue";
import Modal from "./BaseModal.vue";
import CatMascot from "./CatMascot.vue";
import { useFocusTimer } from "../composables/useFocusTimer";
import { useTasks } from "../composables/useTasks";
import { playBell, playTimerDone, playPurr } from "../sounds";
import jarImage from "../assets/pf jar.png";
import bellImage from "../assets/pf bell.png";

const props = defineProps({
  task: { type: Object, required: true },
});
const emit = defineEmits(["close"]);

const timer = useFocusTimer();
const { updateTaskStatus } = useTasks();

const RING_CIRCUMFERENCE = 2 * Math.PI * 70;

const snacksRemaining = ref(3);
const breakUsed = ref(false);
const isOnBreak = ref(false);
const breakSecondsLeft = ref(0);
const showDecision = ref(false);
const extraMinutes = ref(5);
const catRef = ref(null);
const confettiRef = ref(null);
let breakInterval = null;

const CONFETTI_COLORS = ["#f0965a", "#7fbfae", "#ea7089", "#ffcf6b", "#8ec6e6"];

function burstConfetti() {
  const container = confettiRef.value;
  if (!container) return;
  for (let i = 0; i < 20; i++) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    const angle = Math.random() * Math.PI * 2;
    const distance = 70 + Math.random() * 70;
    piece.style.setProperty("--tx", `${Math.cos(angle) * distance}px`);
    piece.style.setProperty("--ty", `${Math.sin(angle) * distance - 30}px`);
    piece.style.setProperty("--rot", `${(Math.random() - 0.5) * 480}deg`);
    piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    piece.addEventListener("animationend", () => piece.remove());
    container.appendChild(piece);
  }
}

const isSessionForThisTask = computed(
  () => timer.state.activeTask && timer.state.activeTask.id === props.task.id,
);

const displayMs = computed(() =>
  isSessionForThisTask.value ? timer.state.remainingMs : props.task.duration * 1000,
);
const displayProgress = computed(() => (isSessionForThisTask.value ? timer.progress.value : 0));

const displayTime = computed(() => {
  const totalSeconds = Math.ceil(displayMs.value / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
});

const statusLabel = computed(() => {
  if (isSessionForThisTask.value && timer.state.isRunning) return "focusing…";
  if (isSessionForThisTask.value && timer.state.isPaused) return "paused";
  return "ready";
});

const ringStyle = computed(() => {
  const offset = RING_CIRCUMFERENCE * (1 - displayProgress.value);
  return {
    strokeDasharray: `${RING_CIRCUMFERENCE}`,
    strokeDashoffset: offset,
  };
});

const breakFormatted = computed(() => {
  const m = Math.floor(breakSecondsLeft.value / 60);
  const s = breakSecondsLeft.value % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
});

function start() {
  updateTaskStatus(props.task.id, "active");
  timer.startSession(props.task, props.task.duration);
}

function togglePause() {
  if (timer.state.isRunning) timer.pause();
  else timer.resume();
}

function useSnack() {
  if (snacksRemaining.value <= 0) return;
  snacksRemaining.value--;
  timer.extend(2);
}

function startBreak() {
  if (breakUsed.value || isOnBreak.value) return;
  playBell();
  timer.pause();
  isOnBreak.value = true;
  breakUsed.value = true;
  breakSecondsLeft.value = 5 * 60;
  breakInterval = setInterval(() => {
    breakSecondsLeft.value--;
    if (breakSecondsLeft.value <= 0) endBreak();
  }, 1000);
}

function endBreak() {
  isOnBreak.value = false;
  clearBreakInterval();
}

function clearBreakInterval() {
  if (breakInterval) {
    clearInterval(breakInterval);
    breakInterval = null;
  }
}

function petCat() {
  catRef.value?.pet();
  playPurr();
}

function extendSession() {
  if (!extraMinutes.value || extraMinutes.value <= 0) return;
  timer.extend(extraMinutes.value);
  timer.resume();
  showDecision.value = false;
}

function finishTask() {
  updateTaskStatus(props.task.id, "completed");
  timer.stop();
  showDecision.value = false;
  burstConfetti();
  setTimeout(() => emit("close"), 700);
}

function handleClose() {
  if (props.task.status !== "active") {
    updateTaskStatus(props.task.id, "pending");
  }
  emit("close");
}

watch(
  () => timer.state.remainingMs,
  (next, prev) => {
    if (isSessionForThisTask.value && prev > 0 && next <= 0) {
      playTimerDone();
      showDecision.value = true;
    }
  },
);

onBeforeUnmount(clearBreakInterval);
</script>

<style scoped>
.session {
  text-align: center;
  position: relative;
}

.confetti-container {
  position: absolute;
  inset: 0;
  overflow: visible;
  pointer-events: none;
  z-index: 5;
}

.confetti-container :deep(.confetti-piece) {
  position: absolute;
  left: 50%;
  top: 20%;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  animation: confetti-burst 0.8s cubic-bezier(0.2, 0.7, 0.4, 1) forwards;
}

@keyframes confetti-burst {
  0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); opacity: 1; }
  100% {
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) rotate(var(--rot)) scale(0.4);
    opacity: 0;
  }
}

.session-title {
  margin: 0 0 2px;
  font-size: 1.35rem;
  font-weight: 700;
  color: #2d2420;
}

.session-subject {
  margin: 0 0 22px;
  font-size: 0.9rem;
  color: #9a8a7d;
}

.ring-wrap {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
  border-radius: 50%;
  transition: filter 0.3s ease;
}

.ring-wrap--live {
  animation: ring-glow 2.4s ease-in-out infinite;
}

@keyframes ring-glow {
  0%, 100% { filter: drop-shadow(0 0 0 rgba(240, 150, 90, 0)); }
  50% { filter: drop-shadow(0 0 14px rgba(240, 150, 90, 0.45)); }
}

.ring {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-track {
  fill: none;
  stroke: rgba(45, 36, 32, 0.08);
  stroke-width: 10;
}

.ring-progress {
  fill: none;
  stroke: url(#ringGradient);
  stroke-width: 10;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.25s linear;
}

.ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.ring-time {
  font-size: 2.1rem;
  font-weight: 800;
  color: #2d2420;
  font-variant-numeric: tabular-nums;
}

.ring-status {
  font-size: 0.78rem;
  font-weight: 600;
  color: #b5a698;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.session-actions {
  margin-top: 22px;
  display: flex;
  justify-content: center;
}

.primary-btn {
  padding: 13px 28px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #f7ab58, #f0965a);
  color: #fff;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(240, 150, 90, 0.35);
  transition: transform 0.15s ease;
}
.primary-btn:hover { transform: translateY(-1px); }
.primary-btn:active { transform: scale(0.96); }

.secondary-btn {
  padding: 10px 18px;
  border: 1.5px solid rgba(240, 150, 90, 0.5);
  border-radius: 999px;
  background: transparent;
  color: #d97f42;
  font: inherit;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.15s ease;
}
.secondary-btn:active { transform: scale(0.95); }

.icon-btn {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: none;
  background: #fff2e4;
  color: #d97f42;
  font-size: 1.2rem;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;
}
.icon-btn:hover { transform: scale(1.08); background: #ffe6cc; }
.icon-btn:active { transform: scale(0.92); }

.perk-row {
  margin-top: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  padding-top: 18px;
  border-top: 1px solid rgba(45, 36, 32, 0.08);
}

.perk-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
  border: 1px solid rgba(45, 36, 32, 0.1);
  border-radius: 14px;
  background: #fbf7f1;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6b5a50;
  cursor: pointer;
  transition: transform 0.15s ease, background 0.15s ease;
}
.perk-btn:hover:not(:disabled) { transform: translateY(-2px); background: #fff2e4; }
.perk-btn:active:not(:disabled) { transform: scale(0.94); }
.perk-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.perk-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
}

.cat-corner {
  margin-left: auto;
  width: 68px;
}

.break-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}

.break-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: #7fa89a;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.break-countdown {
  font-size: 2.4rem;
  font-weight: 800;
  color: #2d2420;
  font-variant-numeric: tabular-nums;
  margin: 6px 0;
}

.break-hint {
  margin: 0 0 14px;
  font-size: 0.85rem;
  color: #9a8a7d;
}

.cat-slot {
  cursor: pointer;
}

.decision-overlay {
  margin-top: 22px;
  padding-top: 20px;
  border-top: 1px solid rgba(45, 36, 32, 0.08);
}

.decision-heading {
  margin: 0 0 4px;
  font-size: 1.1rem;
  font-weight: 700;
  color: #2d2420;
}

.decision-text {
  margin: 0 0 14px;
  font-size: 0.85rem;
  color: #9a8a7d;
}

.extend-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 14px;
  color: #6b5a50;
  font-size: 0.85rem;
}

.extend-input {
  width: 56px;
  padding: 8px;
  border-radius: 10px;
  border: 1.5px solid rgba(45, 36, 32, 0.12);
  text-align: center;
  font: inherit;
}

@media (max-width: 480px) {
  .ring-wrap {
    width: 168px;
    height: 168px;
  }

  .ring-time {
    font-size: 1.7rem;
  }

  .perk-row {
    gap: 10px;
  }

  .perk-btn {
    padding: 8px 10px;
  }

  .cat-corner {
    width: 56px;
  }

  .break-countdown {
    font-size: 2rem;
  }
}
</style>
