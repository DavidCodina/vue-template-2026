<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref } from 'vue'

// https://router.vuejs.org/api/variables/RouterLink.html
// https://router.vuejs.org/guide/
// https://router.vuejs.org/guide/essentials/navigation.html
// https://router.vuejs.org/guide/essentials/active-links.html
// https://router.vuejs.org/guide/advanced/extending-router-link.html
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
// ⚠️ There might be an easier way to do active styles.
// It looks like there's an activeClass and exactActiveClass prop.
// Possibly, also an inactiveClass prop.
// https://router.vuejs.org/guide/essentials/active-links.html#Configuring-the-classes

const linkClassName = `
flex items-center gap-3 
mb-2 p-3 
font-[Chakra_Petch] font-medium text-secondary dark:text-primary
rounded-lg -outline-offset-[1.5px]

hover:outline-[1.5px]
hover:text-primary dark:hover:text-white/75
hover:outline-primary dark:hover:outline-white/75

[&.router-link-active]:bg-secondary/80
[&.router-link-active]:outline-[1.5px]
[&.router-link-active]:outline-[#333]
[&.router-link-active]:dark:outline-secondary

[&.router-link-active]:text-white
[&.router-link-active]:hover:bg-secondary/80
[&.router-link-active]:hover:outline-[#333]
[&.router-link-active]:hover:dark:outline-secondary

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
    class="group hover:bg-primary dark:hover:bg-secondary absolute top-3 left-3 z-49 w-fit rounded-lg p-1 hover:cursor-pointer"
    aria-label="Open Menu"
    type="button"
  >
    <Menu class="text-secondary dark:text-primary group-hover:text-white/75" :size="24" />
  </button>

  <!-- ======================
        renderSideMenu()
  ====================== -->

  <aside
    :class="
      cn(
        'border-secondary dark:border-primary bg-card fixed top-0 left-0 z-50 flex h-full w-80 transform flex-col border-r transition-transform duration-300 ease-in-out',
        isOpen &&
          'shadow-[inset_2px_0px_8px_rgba(0,0,0,0.15)] dark:shadow-[inset_2px_0px_8px_rgba(0,0,0,0.85)]',

        isOpen ? 'translate-x-0' : '-translate-x-full'
      )
    "
  >
    <!-- ===== Header ===== -->

    <div
      class="border-b-secondary dark:border-b-primary flex items-center justify-between border-b px-4 py-2"
    >
      <RouterLink to="/" @click="closeMenu">
        <h2
          class="text-secondary dark:text-primary hover:text-primary font-[Chakra_Petch] text-2xl leading-none dark:hover:text-white/75"
        >
          _DEMO
        </h2>
      </RouterLink>

      <div class="flex gap-0">
        <button
          aria-label="Close Menu"
          @click="isOpen = false"
          class="group hover:bg-primary dark:hover:bg-secondary rounded-lg p-1 hover:cursor-pointer"
          type="button"
        >
          <X :size="24" class="text-secondary dark:text-primary group-hover:text-white/75" />
        </button>
      </div>
    </div>

    <!-- ===== nav ====== -->

    <nav class="flex-1 overflow-y-auto p-4">
      <RouterLink :class="linkClassName" to="/" @click="closeMenu">_HOME</RouterLink>
      <RouterLink :class="linkClassName" to="/about" @click="closeMenu">_ABOUT</RouterLink>

      <!-- Here are a few examples using the to prop with object form. -->
      <RouterLink
        :class="linkClassName"
        :to="{ path: '/test', query: { testing: 'abc123' }, hash: '#test' }"
        @click="closeMenu"
        >_TEST</RouterLink
      >

      <!-- This is a named route (name + params). It looks the route 
      up by  name and fills in the params. -->
      <RouterLink
        :class="linkClassName"
        :to="{ name: 'test-detail', params: { id: 1 } }"
        @click="closeMenu"
        >_Test (id: 1)</RouterLink
      >

      <!-- This is the path based approach. -->
      <RouterLink :class="linkClassName" :to="{ path: '/test/2' }" @click="closeMenu"
        >_Test (id: 2)</RouterLink
      >

      <RouterLink :class="linkClassName" to="/test/random" @click="closeMenu">_Random</RouterLink>
    </nav>
  </aside>
</template>
