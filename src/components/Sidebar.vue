<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref } from 'vue'

import { RouterLink } from 'vue-router'
import { useDark, useToggle } from '@vueuse/core'
import {
  CircleDollarSign,
  // Dices,
  FlaskConical,
  House,
  Info,
  Menu,
  // TestTube,
  // TestTubes,
  Users,
  X,
  Sun,
  Moon
} from '@lucide/vue'
import { cn } from '@/utils/cn'

/* ======================
      Composables
====================== */

const isDark = useDark()

const toggleDark = useToggle(isDark)

/* ======================
    Refs (i.e., State)
====================== */

const isOpen = ref(false)

/* ======================
        Variables
====================== */

const linkClassName = `
flex items-center gap-3 
mb-2 p-3 
font-[Chakra_Petch] font-medium text-secondary-500 dark:text-primary-500
rounded-lg -outline-offset-[1.5px]

hover:outline-[1.5px]
hover:text-primary-500 dark:hover:text-white/75
hover:outline-primary-500 dark:hover:outline-white/75

[&.router-link-active]:bg-secondary-500/80
[&.router-link-active]:outline-[1.5px]
[&.router-link-active]:outline-[#333]
[&.router-link-active]:dark:outline-secondary-500

[&.router-link-active]:text-white
[&.router-link-active]:hover:bg-secondary-500/80
[&.router-link-active]:hover:outline-[#333]
[&.router-link-active]:hover:dark:outline-secondary-500

[&.router-link-active]:hover:text-white
[&.router-link-active]:shadow-[inset_0_0_6px_rgba(0,0,0,0.75)]
`

/* ======================
Event Handlers / Functions
====================== */

function closeMenu() {
  isOpen.value = false
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <button
    @click="isOpen = true"
    class="group hover:bg-primary-500 dark:hover:bg-secondary-500 absolute top-3 left-3 z-49 w-fit rounded-lg p-1 hover:cursor-pointer"
    aria-label="Open Menu"
    type="button"
  >
    <Menu class="text-secondary-500 dark:text-primary-500 group-hover:text-white/75" :size="24" />
  </button>

  <!-- ======================
        renderSideMenu()
  ====================== -->

  <aside
    :class="
      cn(
        'border-secondary-500 dark:border-primary-500 bg-card fixed top-0 left-0 z-50 flex h-full w-80 transform flex-col border-r transition-transform duration-300 ease-in-out',
        isOpen &&
          'shadow-[inset_2px_0px_8px_rgba(0,0,0,0.15)] dark:shadow-[inset_2px_0px_8px_rgba(0,0,0,0.85)]',

        isOpen ? 'translate-x-0' : '-translate-x-full'
      )
    "
  >
    <!-- ===== Header ===== -->

    <div
      class="border-b-secondary-500 dark:border-b-primary-500 flex items-center justify-between border-b px-4 py-2"
    >
      <RouterLink to="/" @click="closeMenu">
        <h2
          class="text-secondary-500 dark:text-primary-500 hover:text-primary-500 font-[Chakra_Petch] text-2xl leading-none dark:hover:text-white/75"
        >
          _DEMO
        </h2>
      </RouterLink>

      <div class="flex gap-1">
        <button
          @click="toggleDark()"
          type="button"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          :aria-pressed="isDark"
          class="group hover:bg-primary-500 dark:hover:bg-secondary-500 focus-visible:ring-primary-500 rounded-lg p-1 hover:cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
        >
          <Sun
            v-if="isDark"
            :size="24"
            aria-hidden="true"
            class="text-secondary-500 dark:text-primary-500 group-hover:text-white/75"
          />
          <Moon
            v-else
            :size="24"
            aria-hidden="true"
            class="text-secondary-500 dark:text-primary-500 group-hover:text-white/75"
          />
        </button>

        <button
          type="button"
          aria-label="Close Menu"
          @click="isOpen = false"
          class="group hover:bg-primary-500 dark:hover:bg-secondary-500 focus-visible:ring-primary-500 rounded-lg p-1 hover:cursor-pointer focus-visible:ring-2 focus-visible:outline-none"
        >
          <X
            :size="24"
            aria-hidden="true"
            class="text-secondary-500 dark:text-primary-500 group-hover:text-white/75"
          />
        </button>
      </div>
    </div>

    <!-- ===== nav ====== -->

    <nav class="flex-1 overflow-y-auto p-4">
      <RouterLink :class="linkClassName" to="/" @click="closeMenu">
        <House :stroke-width="1.5" class="inline-block size-[1.25em]" /> _HOME
      </RouterLink>
      <RouterLink :class="linkClassName" to="/users" @click="closeMenu">
        <Users :stroke-width="1.5" class="inline-block size-[1.25em]" /> _USERS
      </RouterLink>

      <RouterLink :class="linkClassName" to="/expense-tracker" @click="closeMenu">
        <CircleDollarSign :stroke-width="1.5" class="inline-block size-[1.25em]" />_EXPENSE TRACKER
      </RouterLink>

      <!-- Here are a few examples using the to prop with object form. -->
      <RouterLink
        :class="linkClassName"
        :to="{ path: '/test', query: { testing: 'abc123' }, hash: '#test' }"
        @click="closeMenu"
      >
        <FlaskConical :stroke-width="1.5" class="inline-block size-[1.25em]" /> _TEST
      </RouterLink>

      <RouterLink :class="linkClassName" to="/about" @click="closeMenu">
        <Info :stroke-width="1.5" class="inline-block size-[1.25em]" />_ABOUT
      </RouterLink>
    </nav>
  </aside>
</template>
