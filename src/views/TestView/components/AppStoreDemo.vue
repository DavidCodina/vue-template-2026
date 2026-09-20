<script setup lang="ts">
/* ======================
        Imports
====================== */

import { CirclePlus, RotateCw } from '@lucide/vue'

import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/appStore'
// import Button from '@/components/Button.vue'

/* ======================
       appStore
====================== */

const appStore = useAppStore()

// For state/getters you use in the template, use storeToRefs
// so reactivity is preserved when destructuring
const { count, doubleCount } = storeToRefs(appStore)

// Actions can be pulled off the store directly
const { increment, reset } = appStore
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <h2
    class="mx-auto mb-4 flex w-fit justify-center gap-2 border-b border-[#42B883] px-2 font-[Chakra_Petch] text-lg font-light text-[#42B883] uppercase"
  >
    App Store Demo
  </h2>
  <div
    class="mx-auto flex w-fit min-w-25 flex-col items-center rounded-lg border border-[#42B883] bg-white p-2 shadow"
  >
    <div class="flex justify-center">
      <button
        class="cursor-pointer rounded-full p-1 text-xs font-medium text-[#42B883] hover:bg-[#42B883] hover:text-white"
        @click="increment"
        title="Increment"
        type="button"
      >
        <CirclePlus class="size-6" />
      </button>

      <button
        class="cursor-pointer rounded-full p-1 text-xs font-medium text-[#42B883] hover:bg-[#42B883] hover:text-white"
        @click="reset"
        title="Reset"
        type="button"
      >
        <RotateCw class="size-6" />
      </button>
    </div>

    <div class="text-sm">
      Count: <span class="font-mono font-semibold text-[#42B883]">{{ count }}</span>
    </div>
    <div class="text-sm">
      Double: <span class="font-mono font-semibold text-[#42B883]">{{ doubleCount }}</span>
    </div>
  </div>
</template>
