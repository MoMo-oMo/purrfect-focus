<template>
  <div
    class="task-card"
    :class="`status-${task.status}`"
    :style="{ animationDelay: `${Math.min(index, 10) * 45}ms`, '--accent': accentColor, '--tilt': `${tilt}deg` }"
    role="button"
    :tabindex="task.status === 'completed' ? -1 : 0"
    :aria-disabled="task.status === 'completed'"
    @click="task.status !== 'completed' && $emit('select', task)"
    @keydown.enter="task.status !== 'completed' && $emit('select', task)"
    @keydown.space.prevent="task.status !== 'completed' && $emit('select', task)"
  >
    <span class="pushpin" />
    <span class="coffee-stain" />
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
  </div>
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

// Small varied resting tilt so cards read like hand-pinned notes rather
// than a rigid grid.
const TILTS = [-2.4, 1.8, -1.2, 2.1, -1.6, 1.3];
const tilt = computed(() => TILTS[props.index % TILTS.length]);
</script>

<style scoped>
.task-card {
  position: relative;
  text-align: left;
  background: #fffaf2;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(139, 94, 60, 0.035) 0px,
    rgba(139, 94, 60, 0.035) 1px,
    transparent 1px,
    transparent 26px
  );
  border: 1px solid rgba(90, 58, 39, 0.12);
  border-radius: 10px;
  padding: 20px 20px 18px;
  cursor: pointer;
  box-shadow: 0 6px 16px rgba(59, 36, 24, 0.14);
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
  font: inherit;
  width: 100%;
  overflow: hidden;
  opacity: 0;
  transform: rotate(var(--tilt, 0deg));
  animation: card-in 0.45s ease both;
}

@keyframes card-in {
  from { opacity: 0; transform: translateY(14px) scale(0.97) rotate(var(--tilt, 0deg)); }
  to { opacity: 1; transform: translateY(0) scale(1) rotate(var(--tilt, 0deg)); }
}

.pushpin {
  position: absolute;
  top: -7px;
  left: 50%;
  transform: translateX(-50%);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #ff9d8a, #c1503a 70%);
  box-shadow: 0 3px 4px rgba(40, 20, 10, 0.35);
  z-index: 2;
}

.coffee-stain {
  position: absolute;
  bottom: -14px;
  right: -10px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid rgba(139, 94, 60, 0.08);
  pointer-events: none;
}

.task-card:not(.status-completed):hover {
  transform: rotate(0deg) translateY(-4px) scale(1.03);
  box-shadow: 0 16px 32px rgba(59, 36, 24, 0.22);
  border-color: var(--accent, rgba(193, 127, 78, 0.5));
  z-index: 3;
}

.task-card:not(.status-completed):active {
  transform: rotate(0deg) translateY(-1px) scale(0.99);
}

.task-card:focus-visible {
  outline: 2px solid var(--accent, #c17f4e);
  outline-offset: 2px;
}

.task-card.status-completed {
  cursor: default;
  opacity: 0.6;
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
  background: #c17f4e;
  box-shadow: 0 0 0 4px rgba(193, 127, 78, 0.2);
  animation: dot-pulse 1.6s ease-in-out infinite;
}
.dot-completed { background: #7fbfae; }

@keyframes dot-pulse {
  0%, 100% { box-shadow: 0 0 0 4px rgba(193, 127, 78, 0.2); }
  50% { box-shadow: 0 0 0 7px rgba(193, 127, 78, 0.3); }
}

.task-duration {
  font-size: 0.78rem;
  font-weight: 600;
  color: #8a7461;
  font-variant-numeric: tabular-nums;
}

.task-title {
  margin: 0 0 4px;
  font-size: 1.05rem;
  font-weight: 700;
  color: #3b2418;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-subject {
  margin: 0;
  font-size: 0.85rem;
  color: var(--accent, #8a7461);
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
  color: #b8a290;
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
