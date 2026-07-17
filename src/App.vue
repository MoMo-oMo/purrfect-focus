<template>
  <AmbientBackground />
  <router-view />
</template>

<script setup>
import AmbientBackground from "./components/AmbientBackground.vue";
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700;800&display=swap");

* {
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  min-height: 100%;
  margin: 0;
}

body {
  font-family: "Quicksand", "Trebuchet MS", sans-serif;
  background: linear-gradient(180deg, #fdf3e8 0%, #f7e6d1 100%);
  color: #2d2420;
}

button,
input {
  font-family: inherit;
}
</style>
