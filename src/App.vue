<script setup lang="ts">
import { RouterView } from 'vue-router'
import BasicSidebar from '@/components/BasicSidebar.vue'

const toaster = { position: 'top-right' as const }
</script>

<!-- 
This template acts as the top-level layout for the entire app.
It gets wrapped in <div id="app">, which is part of the index.html.
That element's default styling was originally found in src/assets/main.css, 
which is imported into main.ts. The #app CSS has since been removed in favor
of local Tailwind styles in index.html.
-->
<template>
  <!-- 
  https://ui.nuxt.com/docs/getting-started/installation/vue#wrap-your-app-with-app-component
  The App component sets up global config and is required for Toast, Tooltip and programmatic overlays.
  See here for more info: https://ui.nuxt.com/docs/components/app

  No import needed — Nuxt UI auto-imports all its components, including UApp, via unplugin-vue-components. 
  That's the same mechanism mentioned in the install docs when they talked about the generated components.d.ts type declaration file.
  -->
  <UApp :toaster="toaster">
    <BasicSidebar />

    <RouterView />
  </UApp>
</template>

<!-- <style scoped></style> -->
