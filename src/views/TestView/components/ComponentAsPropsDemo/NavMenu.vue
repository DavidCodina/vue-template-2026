<script setup lang="ts">
/* ======================
        Imports
====================== */

import type { NavItem } from './types'

/* ======================
      Props / Emits
====================== */

defineProps<{
  items: NavItem[]
}>()

// Vue 3.5 defineModel: two-way binding for the active item's id (v-model)
const active = defineModel<string>({ required: true })
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <nav class="bg-card w-50 space-y-1 rounded-lg border p-2">
    <button
      v-for="item in items"
      :key="item.id"
      class="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium"
      :class="active === item.id ? 'bg-primary text-white' : 'hover:bg-neutral-100'"
      @click="active = item.id"
      type="button"
    >
      <!--
        <component :is="..."> renders whatever component it is given.
        The class falls through to the icon's root <svg>.
        NavMenu controls the size and placement, the caller only picks the icon.
      -->
      <component :is="item.icon" class="h-5 w-5 shrink-0" />
      {{ item.label }}
    </button>
  </nav>
</template>
