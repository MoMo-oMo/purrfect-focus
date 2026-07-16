<template>
  <div class="ambient-bg" aria-hidden="true">
    <span class="blob blob-1" />
    <span class="blob blob-2" />
    <span class="blob blob-3" />
  </div>
</template>

<script setup>
</script>

<style scoped>
.ambient-bg {
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
}

.blob-1 {
  width: 42vw;
  height: 42vw;
  top: -12vw;
  left: -10vw;
  background: radial-gradient(circle, #ffcf9b, transparent 70%);
  animation: drift-1 22s ease-in-out infinite;
}

.blob-2 {
  width: 36vw;
  height: 36vw;
  bottom: -14vw;
  right: -8vw;
  background: radial-gradient(circle, #bfe3d8, transparent 70%);
  animation: drift-2 26s ease-in-out infinite;
}

.blob-3 {
  width: 26vw;
  height: 26vw;
  top: 32vh;
  right: 18vw;
  background: radial-gradient(circle, #ffb9c6, transparent 70%);
  opacity: 0.35;
  animation: drift-3 19s ease-in-out infinite;
}

@keyframes drift-1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(4vw, 3vh) scale(1.08); }
}

@keyframes drift-2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-3vw, -4vh) scale(1.1); }
}

@keyframes drift-3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-2vw, 3vh) scale(0.94); }
}

@media (prefers-reduced-motion: reduce) {
  .blob {
    animation: none;
  }
}
</style>
