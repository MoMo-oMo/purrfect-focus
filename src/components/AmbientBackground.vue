<template>
  <div class="ambient-bg" aria-hidden="true">
    <img :src="bgImage" alt="" class="cafe-wall" />
    <span class="blob blob-1" />
    <span class="blob blob-2" />
    <span class="blob blob-3" />
    <span v-for="n in 5" :key="n" class="steam" :class="`steam-${n}`" />
  </div>
</template>

<script setup>
import bgImage from "../assets/pf bg.png";
</script>

<style scoped>
.ambient-bg {
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.cafe-wall {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 46vh;
  min-height: 260px;
  object-fit: cover;
  object-position: top;
  opacity: 0.9;
  mask-image: linear-gradient(to bottom, black 55%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, black 55%, transparent 100%);
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.45;
}

.blob-1 {
  width: 42vw;
  height: 42vw;
  top: -12vw;
  left: -10vw;
  background: radial-gradient(circle, #f0c48a, transparent 70%);
  animation: drift-1 22s ease-in-out infinite;
}

.blob-2 {
  width: 36vw;
  height: 36vw;
  bottom: -14vw;
  right: -8vw;
  background: radial-gradient(circle, #d9b48f, transparent 70%);
  animation: drift-2 26s ease-in-out infinite;
}

.blob-3 {
  width: 26vw;
  height: 26vw;
  top: 30vh;
  right: 18vw;
  background: radial-gradient(circle, #c98f5e, transparent 70%);
  opacity: 0.3;
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

/* Soft steam wisps drifting up from the counter area, for ambient life */
.steam {
  position: absolute;
  bottom: 8vh;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 250, 240, 0.55), transparent 70%);
  filter: blur(3px);
  animation: rise 7s ease-in infinite;
}

.steam-1 { left: 12%; animation-delay: 0s; }
.steam-2 { left: 30%; animation-delay: 1.6s; }
.steam-3 { left: 55%; animation-delay: 3.1s; }
.steam-4 { left: 74%; animation-delay: 4.4s; }
.steam-5 { left: 88%; animation-delay: 2.2s; }

@keyframes rise {
  0% { transform: translateY(0) scale(0.6); opacity: 0; }
  15% { opacity: 0.7; }
  80% { opacity: 0.2; }
  100% { transform: translateY(-22vh) scale(1.6); opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .blob,
  .steam {
    animation: none;
  }
}
</style>
