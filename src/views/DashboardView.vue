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
          v-for="task in sortedTasks"
          :key="task.id"
          :task="task"
          @select="selectedTask = task"
          @delete="deleteTask"
        />
      </div>
    </main>

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
import { useTasks } from "../composables/useTasks";
import { useFocusTimer } from "../composables/useFocusTimer";
import catImage from "../assets/pf cat.png";

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
  min-height: 100vh;
  padding: clamp(20px, 4vw, 48px);
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
  background: #f0965a;
  box-shadow: 0 0 0 3px rgba(240, 150, 90, 0.18);
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
  color: #d97f42;
  font-variant-numeric: tabular-nums;
}

.pop-enter-active, .pop-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.pop-enter-from, .pop-leave-to { opacity: 0; transform: scale(0.9); }

.add-btn {
  padding: 12px 22px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #f7ab58, #f0965a);
  color: #fff;
  font: inherit;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(240, 150, 90, 0.3);
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
</style>
