<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { Menu, X } from '@lucide/vue'
import { cn } from '@/utils/cn'

/* ======================
    Refs (i.e., State)
====================== */

const isOpen = ref(false)

/* ======================
        Variables
====================== */

const linkClassName = `
font-[Chakra_Petch] font-medium
mb-2 flex items-center gap-3 rounded-lg p-3 hover:bg-accent
-outline-offset-[1.5px]
hover:text-[#42B883]
hover:outline-[1.5px]
hover:outline-[#42B883]
[&.router-link-active]:bg-[#35495E]/80
[&.router-link-active]:outline-[1.5px]
[&.router-link-active]:outline-[#333]
[&.router-link-active]:text-white
[&.router-link-active]:hover:bg-[#35495E]/80
[&.router-link-active]:hover:outline-[#333]
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
    class="group absolute top-3 left-3 z-49 w-fit rounded-lg p-1 hover:cursor-pointer hover:bg-[#42B883]"
    aria-label="Open Menu"
    type="button"
  >
    <Menu class="text-[#35495E] group-hover:text-white" :size="24" />
  </button>

  <!-- ======================
        renderSideMenu()
  ====================== -->

  <aside
    :class="
      cn(
        'fixed top-0 left-0 z-50 flex h-full w-80 transform flex-col border-r border-[#35495E] bg-white transition-transform duration-300 ease-in-out',
        isOpen &&
          'shadow-[inset_2px_0px_8px_rgba(0,0,0,0.15)] dark:shadow-[inset_2px_0px_8px_rgba(0,0,0,0.85)]',

        isOpen ? 'translate-x-0' : '-translate-x-full'
      )
    "
  >
    <!-- ===== Header ===== -->

    <div class="flex items-center justify-between border-b border-b-[#35495E] px-4 py-2">
      <RouterLink to="/" @click="closeMenu">
        <h2 class="font-[Chakra_Petch] text-2xl leading-none text-[#35495E] hover:text-[#42B883]">
          _DEMO
        </h2>
      </RouterLink>

      <div class="flex gap-0">
        <button
          aria-label="Close Menu"
          @click="isOpen = false"
          class="group rounded-lg p-1 hover:cursor-pointer hover:bg-[#42B883]"
          type="button"
        >
          <X :size="24" class="text-[#35495E] group-hover:text-white" />
        </button>
      </div>
    </div>

    <!-- ===== nav ====== -->

    <nav class="flex-1 overflow-y-auto p-4">
      <RouterLink :class="linkClassName" to="/" @click="closeMenu">_HOME</RouterLink>
      <RouterLink :class="linkClassName" to="/about" @click="closeMenu">_ABOUT</RouterLink>
      <RouterLink :class="linkClassName" to="/test" @click="closeMenu">_TEST</RouterLink>
    </nav>
  </aside>
</template>
