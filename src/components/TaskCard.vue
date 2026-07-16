<template>
  <button
    class="task-card"
    :class="`status-${task.status}`"
    :style="{ animationDelay: `${Math.min(index, 10) * 45}ms`, '--accent': accentColor }"
    :disabled="task.status === 'completed'"
    @click="$emit('select', task)"
  >
    <span class="accent-bar" />
    <div class="task-card-top">
      <span class="task-status-dot" :class="`dot-${task.status}`" />
      <span class="task-duration">{{ durationLabel }}</span>
    </div>
    <h3 class="task-title">{{ task.title }}</h3>
    <p class="task-subject">{{ task.subject }}</p>
    <button
      class="task-delete"
      aria-label="Delete task"
      @click.stop="$emit('delete', task.id)"
    >✕</button>
  </button>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  task: { type: Object, required: true },
  index: { type: Number, default: 0 },
});
defineEmits(["select", "delete"]);

const durationLabel = computed(() => {
  const s = props.task.duration || 0;
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  if (m > 0 && sec > 0) return `${m}m ${sec}s`;
  if (m > 0) return `${m}m`;
  return `${sec}s`;
});

// Deterministic, pleasant hue per subject so the board reads with a bit
// of color variety instead of every card looking identical.
const accentColor = computed(() => {
  const str = props.task.subject || "";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 65%, 62%)`;
});
</script>

<style scoped>
.task-card {
  position: relative;
  text-align: left;
  background: #fffdf9;
  border: 1px solid rgba(45, 36, 32, 0.08);
  border-radius: 18px;
  padding: 18px 20px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(40, 28, 20, 0.06);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
  font: inherit;
  width: 100%;
  overflow: hidden;
  opacity: 0;
  animation: card-in 0.45s ease both;
}

@keyframes card-in {
  from { opacity: 0; transform: translateY(14px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.accent-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--accent, #f0965a);
}

.task-card:hover:not(:disabled) {
  transform: translateY(-4px) scale(1.015);
  box-shadow: 0 14px 30px rgba(40, 28, 20, 0.14);
  border-color: var(--accent, rgba(240, 150, 90, 0.4));
}

.task-card:active:not(:disabled) {
  transform: translateY(-1px) scale(0.99);
}

.task-card:disabled {
  cursor: default;
  opacity: 0.55 !important;
  animation: card-in 0.45s ease both;
}

.task-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.task-status-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
}
.dot-pending { background: #d8cfc4; }
.dot-active {
  background: #f0965a;
  box-shadow: 0 0 0 4px rgba(240, 150, 90, 0.18);
  animation: dot-pulse 1.6s ease-in-out infinite;
}
.dot-completed { background: #7fbfae; }

@keyframes dot-pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(240, 150, 90, 0.18); }
  50% { box-shadow: 0 0 0 7px rgba(240, 150, 90, 0.28); }
}

.task-duration {
  font-size: 0.78rem;
  font-weight: 600;
  color: #9a8a7d;
  font-variant-numeric: tabular-nums;
}

.task-title {
  margin: 0 0 4px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #2d2420;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-subject {
  margin: 0;
  font-size: 0.85rem;
  color: var(--accent, #9a8a7d);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-completed .task-title {
  text-decoration: line-through;
}

.task-delete {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #c2b7ab;
  font-size: 0.7rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s ease, background 0.15s ease, color 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.task-card:hover .task-delete {
  opacity: 1;
}

.task-delete:hover {
  background: rgba(211, 47, 47, 0.1);
  color: #d32f2f;
}

@media (hover: none) {
  .task-delete {
    opacity: 1;
  }
}
</style>
