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
// https://vueuse.org/core/useDark/
import { useDark, useToggle } from '@vueuse/core'
import {
  Dices,
  FlaskConical,
  House,
  Info,
  Menu,
  TestTube,
  TestTubes,
  Users,
  X,
  Sun,
  Moon
} from '@lucide/vue'
import { cn } from '@/utils/cn'

/* ======================
      Composables
====================== */

// Checks localStorage for user preference.
// Otherwise, it defaults to the OS preference.
const isDark = useDark()

///////////////////////////////////////////////////////////////////////////
//
// A simple Boolean switcher that will handle alternating the user preference.
// Internally, when useDark() adds/removes <html class="dark"> to the <html> tag.
//
// Step by step sequence when you click the button
//
//   1. User clicks → toggleDark() is invoked.
//
//   2. useToggle(isDark) flips the ref: it sets isDark.value = !isDark.value.
//
//   3. Vue reactivity detects the write to the computed ref and runs the computed
//      ref’s setter and/or any watchers/effects that depend on it.
//
//   4. useDark()’s internal effect runs. That effect contains the imperative code that:
//
//      - adds or removes the dark class on <html> (e.g., document.documentElement.classList.toggle('dark', value)), and
//
//      - persists the preference to localStorage (or clears it to follow OS preference),
//
//      - and keeps in sync with matchMedia('prefers-color-scheme: dark') if the OS changes.
//
//   5. DOM updates happen immediately and your CSS rules under .dark take effect.
//      const toggleDark = useToggle(isDark)
//
// Note: useDark() uses useStorage to persist a value ('dark', 'light', or 'auto') to localStorage.
// As long as that stored value is 'auto' (its default), isDark reactively tracks the OS preference
// via matchMedia('(prefers-color-scheme: dark)') — live changes to your OS setting will propagate immediately.
// The moment you call toggleDark(), VueUse writes an explicit 'dark' or 'light' value to storage.
// From that point on, isDark is pinned to your manual choice and stops listening to the OS!
// In other words, once you've clicked the toggle even once, further OS changes won't do anything
// until you reset the stored preference. Its whole design is "manual choice permanently overrides system."
// This works for now, but in the future, we may want to update the theme implementation so that dynamic
// OS changes also trigger a theme change. Here, I'm not saying we ever want to cycle through light/dark/system.
// Rather, there's still just light/dark themes, but also a concept of light/dark/system modes such that
// a change to dark on the OS when the app is light will cause the app to switch to dark, while a change to
// light while the app is light will do nothing.
//
///////////////////////////////////////////////////////////////////////////
const toggleDark = useToggle(isDark)

// Returns type UseDarkReturn (i.e., type UseDarkReturn = WritableComputedRef<boolean>;)
// { dep, deps, depsTail, effect, flags, fn, globalVersion, isSSR, next, setter, value, ... }
// 99% of the time, what you want is the isDark.value.
// console.log('isDark:', isDark.value)

/* ======================
    Refs (i.e., State)
====================== */

const isOpen = ref(false)

/* ======================
        Variables
====================== */
// ⚠️ There might be an easier way to do active styles.
// It looks like there's an activeClass and exactActiveClass prop.
// Unfortunately, class is still active when active-class is active.
// This means one can still potentially run into Tailwind conflicts.
// https://router.vuejs.org/guide/essentials/active-links.html#Configuring-the-classes

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
      <RouterLink :class="linkClassName" to="/about" @click="closeMenu">
        <Info :stroke-width="1.5" class="inline-block size-[1.25em]" />_ABOUT
      </RouterLink>

      <!-- Here are a few examples using the to prop with object form. -->
      <RouterLink
        :class="linkClassName"
        :to="{ path: '/test', query: { testing: 'abc123' }, hash: '#test' }"
        @click="closeMenu"
      >
        <FlaskConical :stroke-width="1.5" class="inline-block size-[1.25em]" /> _TEST
      </RouterLink>

      <!-- This is a named route (name + params). It looks the route 
      up by  name and fills in the params. -->
      <RouterLink
        :class="linkClassName"
        :to="{ name: 'test-detail', params: { id: 1 } }"
        @click="closeMenu"
      >
        <TestTube :stroke-width="1.5" class="inline-block size-[1.25em]" /> _Test (id: 1)
      </RouterLink>

      <!-- This is the path based approach. -->
      <RouterLink :class="linkClassName" :to="{ path: '/test/2' }" @click="closeMenu">
        <TestTubes :stroke-width="1.5" class="inline-block size-[1.25em]" /> _Test (id: 2)
      </RouterLink>

      <RouterLink :class="linkClassName" to="/test/random" @click="closeMenu">
        <Dices :stroke-width="1.5" class="inline-block size-[1.25em]" /> _Random
      </RouterLink>
    </nav>
  </aside>
</template>
