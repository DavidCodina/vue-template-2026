<script setup lang="ts">
/* ======================
        Imports
====================== */

// https://vueuse.org/core/useDark/
import { useDark, useTitle, useToggle } from '@vueuse/core'
import { House } from '@lucide/vue'
import logo from '@/assets/3d-logo.png'

/* ======================
      Composables
====================== */

const _title = useTitle('Home Page')

///////////////////////////////////////////////////////////////////////////
//
// TypeScript and ESLint verifcation:
// 'unused' is declared but its value is never read.ts-plugin
// 'unused' is assigned a value but never used. eslint(@typescript-eslint/no-unused-vars)
// const unused = 'test'
//
// Unexpected var, use let or const instead. eslint(no-var)
// var badVar = 123
// console.log(badVar)
//
///////////////////////////////////////////////////////////////////////////

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
</script>

<!-- ======================================================================

======================================================================= -->
<!-- Make sure to add the official Vue extension for VS Code for proper syntax highlighting. -->

<template>
  <main class="flex-1 p-6">
    <h1
      class="text-secondary dark:text-primary mb-6 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light uppercase"
    >
      _Home <House class="size-[1em]" stroke-width="1" />
    </h1>

    <!-- Can also just do this:
    <img alt="Vue logo" class="mx-auto mt-6 block w-100" src="@/assets/3d-logo.png" /> 
    -->

    <img alt="Vue logo" class="mx-auto block w-100" :src="logo" />

    <button
      @click="toggleDark()"
      class="bg-primary mx-auto mb-6 flex cursor-pointer rounded-md px-2 py-1 font-bold text-white"
    >
      Switch To {{ isDark ? 'Light' : 'Dark' }}
    </button>
  </main>
</template>

<!-- <style scoped></style> -->
