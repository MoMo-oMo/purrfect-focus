<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-panel">
          <button class="modal-close" aria-label="Close" @click="$emit('close')">✕</button>
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineEmits(["close"]);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(30, 22, 18, 0.45);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal-panel {
  position: relative;
  background: #fffdf9;
  border-radius: 24px;
  padding: 32px;
  width: 100%;
  max-width: 420px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 24px 60px rgba(40, 28, 20, 0.28);
}

@media (max-width: 480px) {
  .modal-overlay {
    padding: 12px;
    align-items: flex-end;
  }

  .modal-panel {
    padding: 24px 20px;
    border-radius: 22px 22px 0 0;
    max-height: 85vh;
  }
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(45, 36, 32, 0.06);
  color: #6b5a50;
  font-size: 0.85rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, transform 0.15s ease;
}

.modal-close:hover {
  background: rgba(45, 36, 32, 0.12);
  transform: scale(1.08);
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-active .modal-panel,
.modal-fade-leave-active .modal-panel {
  transition: transform 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .modal-panel,
.modal-fade-leave-to .modal-panel {
  transform: scale(0.96) translateY(8px);
}
</style>
