// Task list persisted to localStorage — no backend needed.
import { reactive } from "vue";

const STORAGE_KEY = "purrfectFocusTasks";

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Failed to load tasks:", e);
    return [];
  }
}

const tasks = reactive(load());

function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error("Failed to save tasks:", e);
  }
}

function addTask({ title, subject, duration }) {
  tasks.push({
    id: crypto.randomUUID(),
    title,
    subject,
    duration, // seconds
    status: "pending", // pending | active | completed
    createdAt: Date.now(),
  });
  save();
}

function updateTaskStatus(id, status) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.status = status;
    save();
  }
}

function deleteTask(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index !== -1) {
    tasks.splice(index, 1);
    save();
  }
}

export function useTasks() {
  return { tasks, addTask, updateTaskStatus, deleteTask };
}
