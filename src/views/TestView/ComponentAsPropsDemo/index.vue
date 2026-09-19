<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref, computed } from 'vue'
import { LayoutDashboard, Users, Settings } from '@lucide/vue'

import NavMenu from './NavMenu.vue'
import type { NavItem } from './types'

/* ======================
    Refs (i.e., State)
====================== */

// A plain const on purpose: component objects should not be made reactive.
// (If you ever need reactive state that holds components, use markRaw() or shallowRef().)

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'settings', label: 'Settings', icon: Settings }
]

const activeId = ref<string>('dashboard')

/* ======================
       Computed
====================== */

const activeLabel = computed<string>(
  () => navItems.find((item) => item.id === activeId.value)?.label ?? ''
)
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="mx-auto flex max-w-2xl gap-4">
    <NavMenu v-model="activeId" :items="navItems" />

    <main class="bg-card flex-1 rounded-lg border p-4">
      <h1 class="text-primary text-lg font-bold">{{ activeLabel }}</h1>
    </main>
  </div>
</template>
