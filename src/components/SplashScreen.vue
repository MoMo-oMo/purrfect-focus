<template>
  <Transition name="splash-fade" @after-leave="$emit('done')">
    <div v-if="visible" class="splash">
      <div class="splash-content">
        <img :src="catImage" alt="" class="splash-logo" />
        <h1 class="splash-title">Purrfect Focus</h1>
        <p class="splash-tagline">Brew a session. Stay a while.</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from "vue";
import catImage from "../assets/pf cat.png";

const visible = ref(true);

onMounted(() => {
  setTimeout(() => {
    visible.value = false;
  }, 1600);
});
</script>

<style scoped>
.splash {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #fdf3e8 0%, #f2dcc0 100%);
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.splash-logo {
  width: clamp(90px, 14vw, 160px);
  height: clamp(90px, 14vw, 160px);
  object-fit: contain;
  filter:
    drop-shadow(0 0 14px rgba(193, 127, 78, 0.5))
    drop-shadow(0 0 4px rgba(90, 58, 39, 0.35))
    drop-shadow(0 10px 22px rgba(59, 36, 24, 0.18));
  animation: splash-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.splash-title {
  margin: 14px 0 6px;
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 800;
  color: #3b2418;
  letter-spacing: -0.01em;
  opacity: 0;
  animation: splash-rise 0.5s ease 0.25s both;
}

.splash-tagline {
  margin: 0;
  font-size: clamp(0.85rem, 1.4vw, 1.05rem);
  color: #8a6a4f;
  font-weight: 600;
  opacity: 0;
  animation: splash-rise 0.5s ease 0.4s both;
}

@keyframes splash-pop {
  0% { opacity: 0; transform: scale(0.4) translateY(20px); }
  100% { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes splash-rise {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.splash-fade-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.splash-fade-leave-to {
  opacity: 0;
  transform: scale(1.04);
}
</style>
