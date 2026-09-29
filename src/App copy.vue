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

provide(appStateKey, appState)
</script>

<template>
  <UApp :toaster="toaster">
    <BasicSidebar />

    <RouterView v-slot="{ Component }">
      <component :is="Component" :key="`${appState.routerKey}`" />
    </RouterView>
  </UApp>
</template>
