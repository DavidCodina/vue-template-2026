<script setup lang="ts">
/* ======================
        Imports
====================== */

import { useTitle } from '@vueuse/core'
// import { House } from '@lucide/vue'
import logo from '@/assets/3d-logo.png'

import HeroSection from './components/HeroSection/index.vue'
import WorkSection from './components/WorkSection/index.vue'
import StackSection from './components/StackSection/index.vue'
import PrinciplesSection from './components/PrinciplesSection/index.vue'
import ContactSection from './components/ContactSection/index.vue'

import FooterSection from './components/FooterSection/index.vue'

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
</script>

<!-- ======================================================================

======================================================================= -->
<!-- Make sure to add the official Vue extension for VS Code for proper syntax highlighting. -->

<template>
  <!-- not-dark:bg-[#f3f4f1] -->
  <main class="min-h-dvh flex-1 p-6">
    <!-- <h1
      class="text-secondary-500 dark:text-primary-500 mb-6 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light uppercase"
    >
      _Home <House class="size-[1em]" stroke-width="1" />
    </h1> -->

    <!-- Can also just do this: <img alt="Vue logo" class="mx-auto mt-6 block w-100" src="@/assets/3d-logo.png" /> -->

    <img alt="Vue logo" class="mx-auto block w-30" :src="logo" />

    <HeroSection />

    <div class="mx-auto my-12 w-full max-w-300 border-b" />

    <WorkSection />

    <div class="mx-auto my-12 w-full max-w-300 border-b" />

    <StackSection />

    <div class="mx-auto my-12 w-full max-w-300 border-b" />

    <PrinciplesSection />

    <div class="mx-auto my-12 w-full max-w-300 border-b" />

    <ContactSection />

    <div class="mx-auto my-12 w-full max-w-300 border-b" />

    <FooterSection />
  </main>
</template>

<!-- <style scoped></style> -->
