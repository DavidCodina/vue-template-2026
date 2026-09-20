<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref } from 'vue'

/* ======================
    Refs (i.e., State)
====================== */

const count = ref(0)

/* ======================
Event Handlers / Functions
====================== */

const increment = () => {
  count.value++
  // Simulate a bug: something in this component breaks once count hits 3.
  // Thrown directly inside an event handler — still caught by a parent's
  // onErrorCaptured, since Vue's error handling covers handlers triggered
  // from the template, not just render/setup/lifecycle code.
  if (count.value === 3) {
    throw new Error(`💥 BuggyWidget crashed at ${count.value}! 💥`)
  }
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div
    class="flex flex-col items-center gap-1 rounded-lg border border-[#42B883] bg-white p-2 shadow"
  >
    <button
      @click="increment"
      class="cursor-pointer rounded border border-[rgba(0,0,0,0.2)] bg-[#42B883] px-1 py-0.5 text-xs font-semibold text-white shadow"
    >
      Increment Count
    </button>
    <p class="text-[10px]">(⚠️ Will error at <span class="font-black text-[#42B883]">3</span>)</p>

    <p class="mt-0 text-base font-black text-[#42B883]">{{ count }}</p>
  </div>
</template>
