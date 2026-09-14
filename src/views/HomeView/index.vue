<script setup lang="ts">
import { House } from '@lucide/vue'
import logo from '@/assets/3d-logo.png'

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
  <main class="flex-1 p-6">
    <h1
      class="mb-20 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light text-[#35495E] uppercase"
    >
      _Home <House class="size-[1em]" stroke-width="1" />
    </h1>

    <!-- Can also just do this:
    <img alt="Vue logo" class="mx-auto mt-6 block w-100" src="@/assets/3d-logo.png" /> 
    -->

    <img alt="Vue logo" class="mx-auto mt-6 block w-100" :src="logo" />
  </main>
</template>

<!-- <style scoped></style> -->
