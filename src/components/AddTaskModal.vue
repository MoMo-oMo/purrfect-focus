<template>
  <Modal @close="$emit('close')">
    <h2 class="form-title">New focus task</h2>

    <form @submit.prevent="submit">
      <label class="field-label" for="task-title">Title</label>
      <input
        id="task-title"
        v-model="title"
        class="field-input"
        type="text"
        placeholder="e.g. Finish essay draft"
        autofocus
      />

      <label class="field-label" for="task-subject">Subject</label>
      <input
        id="task-subject"
        v-model="subject"
        class="field-input"
        type="text"
        placeholder="e.g. English Lit"
      />

      <span class="field-label">Duration</span>
      <div class="duration-row">
        <div class="duration-field">
          <input v-model.number="hours" class="field-input" type="number" min="0" max="23" />
          <span class="duration-unit">hr</span>
        </div>
        <div class="duration-field">
          <input v-model.number="minutes" class="field-input" type="number" min="0" max="59" />
          <span class="duration-unit">min</span>
        </div>
        <div class="duration-field">
          <input v-model.number="seconds" class="field-input" type="number" min="0" max="59" />
          <span class="duration-unit">sec</span>
        </div>
      </div>

      <p v-if="touched && !isValid" class="form-error">
        {{ !title.trim() || !subject.trim() ? "Title and subject are required." : "Duration must be greater than 0." }}
      </p>

      <button type="submit" class="submit-btn">Add task</button>
    </form>
  </Modal>
</template>

<script setup>
import { ref, computed } from "vue";
import Modal from "./BaseModal.vue";

const emit = defineEmits(["close", "add"]);

const title = ref("");
const subject = ref("");
const hours = ref(0);
const minutes = ref(25);
const seconds = ref(0);
const touched = ref(false);

const totalSeconds = computed(
  () => (Number(hours.value) || 0) * 3600 + (Number(minutes.value) || 0) * 60 + (Number(seconds.value) || 0),
);
const isValid = computed(() => !!title.value.trim() && !!subject.value.trim() && totalSeconds.value > 0);

function submit() {
  touched.value = true;
  if (!isValid.value) return;
  emit("add", { title: title.value.trim(), subject: subject.value.trim(), duration: totalSeconds.value });
}
</script>

<style scoped>
.form-title {
  margin: 0 0 20px;
  font-size: 1.3rem;
  font-weight: 700;
  color: #2d2420;
}

.field-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #7a6a5e;
  margin: 14px 0 6px;
}

.field-input {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 14px;
  border-radius: 12px;
  border: 1.5px solid rgba(45, 36, 32, 0.12);
  background: #fbf7f1;
  font: inherit;
  font-size: 0.95rem;
  color: #2d2420;
  outline: none;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.field-input:focus {
  border-color: #f0965a;
  background: #fff;
}

.duration-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 10px;
}

.duration-field {
  position: relative;
}

.duration-field .field-input {
  padding-right: 38px;
}

.duration-unit {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75rem;
  color: #a89686;
  pointer-events: none;
}

.form-error {
  margin: 12px 0 0;
  font-size: 0.8rem;
  color: #d32f2f;
}

.submit-btn {
  width: 100%;
  margin-top: 22px;
  padding: 13px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #f7ab58, #f0965a);
  color: #fff;
  font: inherit;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  box-shadow: 0 10px 22px rgba(240, 150, 90, 0.35);
  transition: transform 0.15s ease;
}

.submit-btn:hover {
  transform: translateY(-1px);
}
</style>
