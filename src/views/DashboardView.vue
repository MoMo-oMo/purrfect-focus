<template>
  <div class="dashboard">
    <header class="dash-header">
      <div class="brand">
        <img :src="catImage" alt="" class="brand-icon" />
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
        <img :src="catImage" alt="" class="empty-cat" />
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
      <img :src="deskImage" alt="" class="desk-image" />
      <div class="counter-cat">
        <CatMascot />
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
  max-width: 1080px;
  margin: 0 auto 36px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.brand-title {
  margin: 0;
  font-size: 1.5rem;
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
  max-width: 1080px;
  margin: 0 auto;
}

.task-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
  gap: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 20px;
}

.empty-cat {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 16px;
  opacity: 0.9;
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

@media (max-width: 400px) {
  .brand-title {
    font-size: 1.2rem;
  }

  .brand-icon {
    width: 36px;
    height: 36px;
  }
}

.counter-strip {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  height: 120px;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.desk-image {
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: min(520px, 90vw);
  object-fit: contain;
  filter: drop-shadow(0 -6px 18px rgba(59, 36, 24, 0.12));
}

.counter-cat {
  position: relative;
  bottom: 96px;
  width: 110px;
  pointer-events: auto;
}

@media (max-width: 560px) {
  .counter-strip {
    height: 90px;
  }

  .desk-image {
    width: min(360px, 92vw);
  }

  .counter-cat {
    width: 80px;
    bottom: 70px;
  }

  .dashboard {
    padding-bottom: 110px;
  }
}
</style>
