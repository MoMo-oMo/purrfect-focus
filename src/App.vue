<template>
  <router-view />
</template>

<script setup>
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
  background: linear-gradient(180deg, #fff8f0 0%, #fdf1e4 100%);
  color: #2d2420;
}

button,
input {
  font-family: inherit;
}
</style>
