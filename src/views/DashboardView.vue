<template>
  <div class="dashboard">
    <header class="dash-header">
      <div class="brand">
        <span class="brand-icon-halo">
          <img :src="catImage" alt="" class="brand-icon" />
        </span>
        <h1 class="brand-title">Purrfect Focus</h1>
      </div>

      <div class="header-actions">
        <Transition name="pop">
          <button v-if="activeMiniTask" class="mini-session" @click="selectedTask = activeMiniTask">
            <span class="mini-dot" />
            <span class="mini-title">{{ activeMiniTask.title }}</span>
            <span class="mini-time">{{ timer.remainingFormatted.value }}</span>
          </button>
        </Transition>
        <button class="add-btn" @click="showAddModal = true">+ New task</button>
      </div>
    </header>

    <main class="dash-body">
      <div v-if="tasks.length === 0" class="empty-state">
        <p class="empty-title">No tasks yet</p>
        <p class="empty-hint">Add a task and start your first focus session.</p>
        <button class="add-btn" @click="showAddModal = true">+ New task</button>
      </div>

      <div v-else class="task-grid">
        <TaskCard
          v-for="(task, i) in sortedTasks"
          :key="task.id"
          :task="task"
          :index="i"
          @select="selectedTask = task"
          @delete="deleteTask"
        />
      </div>
    </main>

    <footer class="counter-strip" aria-hidden="true">
      <div class="counter-inner">
        <img :src="deskImage" alt="" class="desk-image" />
        <div class="cat-collection">
          <span
            v-for="n in earnedCatSlots"
            :key="n"
            class="mini-cat"
            :style="miniCatStyle(n)"
          >
            <img :src="catImage" alt="" />
          </span>
        </div>
        <div class="counter-cat">
          <CatMascot />
        </div>
        <div v-if="catsEarned > 0" class="cats-earned-badge">
          🐾 {{ catsEarned }} cat{{ catsEarned === 1 ? '' : 's' }} earned
        </div>
      </div>
    </footer>

    <AddTaskModal
      v-if="showAddModal"
      @close="showAddModal = false"
      @add="handleAddTask"
    />

    <FocusSession
      v-if="selectedTask"
      :task="selectedTask"
      @close="selectedTask = null"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import TaskCard from "../components/TaskCard.vue";
import AddTaskModal from "../components/AddTaskModal.vue";
import FocusSession from "../components/FocusSession.vue";
import CatMascot from "../components/CatMascot.vue";
import { useTasks } from "../composables/useTasks";
import { useFocusTimer } from "../composables/useFocusTimer";
import catImage from "../assets/pf cat.png";
import deskImage from "../assets/pf desk.png";

const { tasks, addTask, deleteTask } = useTasks();
const timer = useFocusTimer();

const showAddModal = ref(false);
const selectedTask = ref(null);

const statusOrder = { active: 0, pending: 1, completed: 2 };
const sortedTasks = computed(() =>
  [...tasks].sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || b.createdAt - a.createdAt),
);

// Every completed task leaves a little cat behind on the counter — a
// growing collection that persists across sessions (derived straight from
// completed task count, so no extra storage needed).
const MAX_VISIBLE_CATS = 10;
const catsEarned = computed(() => tasks.filter((t) => t.status === "completed").length);
const earnedCatSlots = computed(() => Math.min(catsEarned.value, MAX_VISIBLE_CATS));

// Deterministic per-slot placement/variety so the collection looks
// hand-scattered rather than a uniform row, and never overlaps the
// interactive cat parked at the counter's center.
function miniCatStyle(n) {
  const i = n - 1;
  const side = i % 2 === 0 ? -1 : 1;
  const step = Math.floor(i / 2);
  const leftPct = 50 + side * (16 + step * 11);
  const hue = (i * 47) % 360;
  const rotate = (i % 2 === 0 ? -1 : 1) * (4 + (i % 3) * 3);
  return {
    left: `${leftPct}%`,
    filter: `hue-rotate(${hue}deg)`,
    transform: `translateX(-50%) rotate(${rotate}deg)`,
    animationDelay: `${i * 0.35}s`,
  };
}

// The mini pill in the header shows whenever a session is running/paused,
// even if its modal is closed — lets you glance at remaining time.
const activeMiniTask = computed(() => {
  if (!timer.state.activeTask) return null;
  if (!timer.state.isRunning && !timer.state.isPaused) return null;
  return tasks.find((t) => t.id === timer.state.activeTask.id) || null;
});

function handleAddTask(payload) {
  addTask(payload);
  showAddModal.value = false;
}
</script>

<style scoped>
.dashboard {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  padding: clamp(20px, 4vw, 48px);
  padding-bottom: 140px;
}

.dash-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
  max-width: min(1500px, 92vw);
  margin: 0 auto 36px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon-halo {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: clamp(64px, 7.5vw, 120px);
  height: clamp(64px, 7.5vw, 120px);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(193, 127, 78, 0.28), rgba(193, 127, 78, 0) 72%);
}

.brand-icon {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter:
    drop-shadow(0 0 3px rgba(90, 58, 39, 0.4))
    drop-shadow(0 3px 6px rgba(59, 36, 24, 0.3));
}

.brand-title {
  margin: 0;
  font-size: clamp(1.5rem, 2.6vw, 2.6rem);
  font-weight: 800;
  color: #2d2420;
  letter-spacing: -0.01em;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.mini-session {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  border-radius: 999px;
  border: 1px solid rgba(45, 36, 32, 0.1);
  background: #fffdf9;
  box-shadow: 0 6px 16px rgba(40, 28, 20, 0.08);
  cursor: pointer;
  font: inherit;
}

.mini-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #c17f4e;
  box-shadow: 0 0 0 3px rgba(193, 127, 78, 0.18);
}

.mini-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: #2d2420;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mini-time {
  font-size: 0.82rem;
  font-weight: 700;
  color: #a8663a;
  font-variant-numeric: tabular-nums;
}

.pop-enter-active, .pop-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.9); }

.add-btn {
  padding: 12px 22px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #d9a066, #c17f4e);
  color: #fff;
  font: inherit;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(193, 127, 78, 0.3);
  transition: transform 0.15s ease;
  white-space: nowrap;
}

.add-btn:hover {
  transform: translateY(-1px);
}

.dash-body {
  max-width: min(1500px, 92vw);
  margin: 0 auto;
}

.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(clamp(230px, 18vw, 280px), 1fr));
  gap: clamp(16px, 1.6vw, 26px);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 20px;
}


.empty-title {
  margin: 0 0 4px;
  font-size: 1.15rem;
  font-weight: 700;
  color: #2d2420;
}

.empty-hint {
  margin: 0 0 22px;
  font-size: 0.9rem;
  color: #9a8a7d;
}

@media (max-width: 560px) {
  .dash-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    justify-content: space-between;
  }

  .mini-title {
    max-width: 90px;
  }

  .add-btn {
    padding: 11px 18px;
    font-size: 0.85rem;
  }
}


.counter-strip {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

/* Sized to the desk artwork's real aspect ratio (1536×1024) and scaled by
   width alone, so every child positioned by percentage below scales and
   stretches together with it instead of drifting out of place. */
/* Driven by height, not width — the desk artwork's aspect ratio (1536×1024,
   with a lot of transparent padding above the shelf) means locking its box
   to full viewport width made it balloon tall enough to float mid-page on
   wide screens instead of hugging the bottom. Height stays bounded and
   scales gently with viewport height; width simply follows from it. */
.counter-inner {
  position: relative;
  height: clamp(170px, 27vh, 440px);
  aspect-ratio: 1536 / 1024;
  max-width: 94vw;
}

.desk-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: bottom;
  filter: drop-shadow(0 -6px 18px rgba(59, 36, 24, 0.12));
}

/* The desk artwork's top (transparent) padding ends and the shelf surface
   begins at 37.5% down the image — i.e. 62.5% up from the bottom. Anchoring
   here is what makes the cat look like it's standing on the counter. */
.counter-cat {
  position: absolute;
  left: 50%;
  /* CatMascot's own artwork has empty padding below the character too, so
     this sits a bit lower than the shelf-surface line to compensate. */
  bottom: 54%;
  transform: translateX(-50%);
  width: 13%;
  pointer-events: auto;
}

.counter-cat :deep(.cat-mascot-outer) {
  width: 100%;
}

.cat-collection {
  position: absolute;
  left: 50%;
  bottom: 62.5%;
  transform: translateX(-50%);
  width: 84%;
  height: 0;
  pointer-events: none;
}

.mini-cat {
  position: absolute;
  bottom: 0;
  width: 6%;
  aspect-ratio: 1;
  border-radius: 50%;
  overflow: hidden;
  display: block;
  background: #fffaf2;
  border: 2px solid rgba(255, 250, 242, 0.9);
  box-shadow: 0 4px 8px rgba(59, 36, 24, 0.22);
  animation: mini-cat-bob 3.4s ease-in-out infinite;
}

/* The source art has a lot of padding around the character — zoom/crop so
   the face actually reads at this small size (same trick as CatMascot). */
.mini-cat img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(2.7) translateY(6%);
}

@keyframes mini-cat-bob {
  0%, 100% { margin-bottom: 0; }
  50% { margin-bottom: 4px; }
}

.cats-earned-badge {
  position: absolute;
  bottom: 78%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 250, 242, 0.92);
  border: 1px solid rgba(90, 58, 39, 0.14);
  border-radius: 999px;
  padding: clamp(4px, 0.6vw, 7px) clamp(10px, 1.4vw, 18px);
  font-size: clamp(0.68rem, 1vw, 0.9rem);
  font-weight: 700;
  color: #6b4a30;
  box-shadow: 0 4px 12px rgba(59, 36, 24, 0.1);
  white-space: nowrap;
}

@media (max-width: 560px) {
  .counter-inner {
    height: clamp(120px, 16vh, 200px);
    max-width: 98vw;
  }

  .dashboard {
    padding-bottom: 110px;
  }
}
</style>
