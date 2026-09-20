<!-- https://vuejs.org/api/composition-api-lifecycle.html#onunmounted -->

<script setup lang="ts">
/* ======================
        Imports
====================== */

import { onMounted, onUnmounted, ref } from 'vue'

/* ======================
    Refs (i.e., State)
====================== */

const seconds = ref(0)

/* ======================
      Variables
====================== */

// Holds the interval ID so onUnmounted can clear the specific timer this
// component started. Not reactive — it's plumbing, not state to render.
let intervalId: ReturnType<typeof setInterval> | null = null

/* ======================
    Lifecycle Hooks
====================== */

// Start the timer once mounted.
onMounted(() => {
  intervalId = setInterval(() => {
    seconds.value++
  }, 1000)
})

///////////////////////////////////////////////////////////////////////////
//
// onUnmounted runs once, right after the component has been removed from
// the DOM. It's the mirror image of onMounted — the standard place to tear
// down anything that would otherwise keep running or holding a reference
// after this component is gone: intervals/timeouts, event listeners,
// subscriptions, WebSocket connections, observers (ResizeObserver, etc.).
//
// If we didn't clear this interval, it would keep firing forever, updating
// a ref that belongs to a component instance no longer on screen — a
// classic memory leak. The parent removing this component via v-if does
// NOT automatically stop things you started manually like setInterval;
// Vue only cleans up things it created itself (its own reactivity/DOM).
//
///////////////////////////////////////////////////////////////////////////

onUnmounted(() => {
  console.log('onUnmounted() fired! Clearing interval:', intervalId)
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="mx-auto w-fit rounded-lg border border-[#42B883] bg-white p-2 text-center shadow">
    <p class="text-sm">
      Page has been<br />
      active for:
    </p>
    <div class="font-mono text-xl text-[#42B883]">{{ seconds }}s</div>
  </div>
</template>
