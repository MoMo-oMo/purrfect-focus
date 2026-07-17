<template>
  <div class="cat-mascot-outer">
    <div class="cat-mascot" :class="{ petting: isWiggling, blink: isBlinking }" @click="pet">
      <img :src="catImage" alt="Cat mascot" />
    </div>

    <div class="purr-text" :class="{ visible: isPetting }">Purr...</div>

    <div class="hearts-layer" aria-hidden="true">
      <span
        v-for="(h, i) in hearts"
        :key="i"
        class="heart"
        :class="[h.cls, { burst: isPetting }]"
      >♥</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import catImage from "../assets/pf cat.png";

const isPetting = ref(false);
const isWiggling = ref(false);
const isBlinking = ref(false);
let petTimeout = null;
let wiggleTimeout = null;
let idleInterval = null;
let blinkTimeout = null;

const hearts = [
  { cls: "h1" },
  { cls: "h2" },
  { cls: "h3" },
  { cls: "h4" },
  { cls: "h5" },
];

function pet() {
  if (isWiggling.value) return;

  clearTimeout(petTimeout);
  clearTimeout(wiggleTimeout);

  isPetting.value = false;
  requestAnimationFrame(() => {
    isPetting.value = true;
    isWiggling.value = true;

    wiggleTimeout = setTimeout(() => {
      isWiggling.value = false;
    }, 600);

    petTimeout = setTimeout(() => {
      isPetting.value = false;
    }, 1500);
  });
}

onMounted(() => {
  // Occasional little blink so the cat feels alive when idle, not just
  // when petted.
  idleInterval = setInterval(() => {
    if (isWiggling.value) return;
    isBlinking.value = true;
    blinkTimeout = setTimeout(() => {
      isBlinking.value = false;
    }, 220);
  }, 3200 + Math.random() * 2000);
});

onBeforeUnmount(() => {
  clearTimeout(petTimeout);
  clearTimeout(wiggleTimeout);
  clearTimeout(blinkTimeout);
  clearInterval(idleInterval);
});

defineExpose({ pet });
</script>

<style scoped>
.cat-mascot-outer {
  position: relative;
  display: inline-block;
  width: clamp(96px, 14vw, 140px);
}

.cat-mascot {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  cursor: pointer;
  animation: gentle-float 2.8s ease-in-out infinite;
}

.cat-mascot.petting {
  animation: cat-wiggle 0.55s ease-in-out;
}

.cat-mascot.blink img {
  animation: cat-blink 0.22s ease-in-out;
}

@keyframes cat-blink {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.85); }
}

.cat-mascot img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* The cat is white — without a contrast halo it disappears against the
     cream background, so trace its silhouette with a soft warm glow plus
     a grounding shadow. */
  filter:
    drop-shadow(0 0 10px rgba(193, 127, 78, 0.45))
    drop-shadow(0 0 3px rgba(90, 58, 39, 0.35))
    drop-shadow(0 8px 14px rgba(40, 28, 20, 0.2));
}

.purr-text {
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.85rem;
  font-weight: 700;
  color: #e0708a;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
  white-space: nowrap;
}

.purr-text.visible {
  opacity: 1;
}

.hearts-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.heart {
  position: absolute;
  bottom: 55%;
  font-size: 1rem;
  color: #ea7089;
  opacity: 0;
}

.heart.h1 { left: 14%; font-size: 1.15rem; }
.heart.h2 { left: 40%; font-size: 0.9rem; }
.heart.h3 { left: 66%; font-size: 1.05rem; }
.heart.h4 { left: 28%; font-size: 0.75rem; }
.heart.h5 { left: 56%; font-size: 0.8rem; }

.heart.burst { animation: float-up 1.4s ease-out forwards; }
.heart.h2.burst { animation-delay: 0.12s; }
.heart.h3.burst { animation-delay: 0.06s; }
.heart.h4.burst { animation-delay: 0.22s; }
.heart.h5.burst { animation-delay: 0.09s; }

@keyframes float-up {
  0%   { opacity: 0; transform: translateY(0) scale(0.4); }
  18%  { opacity: 1; transform: translateY(-18px) scale(1); }
  100% { opacity: 0; transform: translateY(-65px) scale(0.7); }
}

@keyframes gentle-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes cat-wiggle {
  0%   { transform: translateY(0) rotate(0deg); }
  18%  { transform: translateY(-5px) rotate(-4deg); }
  36%  { transform: translateY(-2px) rotate(4deg); }
  54%  { transform: translateY(-4px) rotate(-2deg); }
  72%  { transform: translateY(-1px) rotate(1deg); }
  100% { transform: translateY(0) rotate(0deg); }
}
</style>
