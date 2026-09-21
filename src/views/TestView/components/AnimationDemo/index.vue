<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref, watch } from 'vue'

/* ======================
        Refs
====================== */

const animation = ref<string>('')

/* ======================
Event Handlers / Functions
====================== */

const handleAnimate = () => {
  if (animation.value === '') {
    animation.value = 'animate-spin [animation-duration:1.5s] [animation-iteration-count:1]'
    setTimeout(() => (animation.value = ''), 1500)
    return
  }
}

/* ======================
       Computed
====================== */

watch(
  animation,
  (newValue, _prevValue) => {
    console.log('animation changed:', newValue)
  },
  {}
)
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div>
    <h2 class="text-primary mb-6 text-center text-3xl font-black">Animation Demo</h2>

    <button
      class="bg-secondary hover:bg-primary mx-auto mb-10 block rounded px-2 py-1 text-xs font-semibold text-white shadow"
      @click="handleAnimate"
    >
      Animate
    </button>

    <div
      class="bg-primary mx-auto size-30 rounded-xl border-2 border-[rgba(0,0,0,0.3)] shadow-lg"
      :class="animation"
    />
  </div>
</template>

<style scoped>
/* Here is actually a good place to create @keyframes. */
</style>
-
