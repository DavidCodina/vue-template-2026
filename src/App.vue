<script setup lang="ts">
/* ======================
        Imports
====================== */

import { reactive, provide } from 'vue'
import { RouterView } from 'vue-router'
import BasicSidebar from '@/components/BasicSidebar.vue'
import { appStateKey } from '@/keys'
import type { AppState } from '@/types'

/* ======================
      Variables
====================== */

const toaster = { position: 'top-right' as const }

/* ======================
      Refs/State
====================== */

const appState = reactive<AppState>({
  routerKey: 1
})

/* ======================
        Provide
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Why not just use 'appState' as the key? Because then TypeScript doesn't
// know what appState is on the consuming side. By using a shared key of:
//
//   export const appStateKey: InjectionKey<AppState> = Symbol('appState')
//

// This allows TypeScript to infer the type of appState based on the shared Symbol's type.
//
// Usage:
//
//   // appState will be inferred as AppState | undefined
//   // That | undefined is expected and correct — it's TypeScript accurately
//   // telling you that inject can fail at runtime (if the component isn't
//   // a descendant of wherever provide was called), and it's making you handle
//   // that case rather than silently crashing later with a much more confusing error.
//
//   const appState = inject(appStateKey)
//
//   // Alternatively, do: const appState = inject(appStateKey)!
//   if (!appState) throw new Error('appState was not provided')
//
//   ...
//
//   <buttn @click="appState.routerKey++">Reboot Page</buttn>
//
// Note: there's already a Pinia appStore, so to differentiate here, the global state is
// simply named appState.
//
///////////////////////////////////////////////////////////////////////////
provide(appStateKey, appState)
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

    <RouterView v-slot="{ Component }">
      <component :is="Component" :key="`${appState.routerKey}`" />
    </RouterView>
  </UApp>
</template>

<!-- <style scoped></style> -->
