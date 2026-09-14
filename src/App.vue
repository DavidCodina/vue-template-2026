<script setup lang="ts">
import { RouterView } from 'vue-router'
import BasicSidebar from '@/components/BasicSidebar.vue'
</script>

<!-- 
This template acts as the top-level layout for the entire app.
It gets wrapped in <div id="app">, which is part of the index.html.
That element's default styling was originally found in src/assets/main.css, 
which is imported into main.ts. The #app CSS has since been removed in favor
of local Tailwind styles in index.html.
-->
<template>
  <BasicSidebar />

  <RouterView />
</template>

<!-- <style scoped></style> -->
