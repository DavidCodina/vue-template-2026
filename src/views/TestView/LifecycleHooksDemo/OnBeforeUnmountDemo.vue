<!-- https://vuejs.org/api/composition-api-lifecycle.html#onbeforeunmount -->

<script setup lang="ts">
///////////////////////////////////////////////////////////////////////////
//
// onBeforeUnmount fires right before Vue starts tearing the component down
// — at that moment, the component instance, its reactive state, its DOM elements,
// and any child components are all still fully intact and functional.
//
// By the time onUnmounted fires, that teardown has already happened — child components are gone,
// Vue's own directive bindings are unbound, and critically, the DOM element itself is typically
// already detached from the document.
//
// That last point is the cleanest, most concrete way to demonstrate the actual difference
// between these two hooks — rather than just describing it, we can literally prove it by
// checking whether the DOM node is still attached to the page at each point.
//
// Common real-world use cases for onBeforeUnmount:
//
//   - Reading final DOM measurements before the element disappears (scroll position, size,
//     final animation frame) — this only works here, since the node may already be detached
//     by onUnmounted.
//
//   - Sending a final analytics "time spent" event — logging duration while the component/DOM
//     context is still valid, rather than after it's already gone.
//
//   - Saving a draft/unsaved-state snapshot right before the component (and its data) vanish,
//     e.g., auto-saving form input to localStorage as a safety net.
//
//   - Cancelling in-flight requests or animations tied to this specific instance, before teardown
//     starts touching things.
//
// Below, we extend the OnUnmountedDemo (i.e.,ticker demo) — adding a template ref so we can
// literally check document.contains(...) in both hooks, proving the DOM is present in one
// and gone in the other.
//
// An example log statment from switching pages (i.e., triggering both hooks) will look something like this:
//
//   onBeforeUnmount() fired! Final seconds: 6
//     → tickerRef still in document? true
//
//   onUnmounted() fired! Clearing interval: 16
//     → tickerRef still in document? false
//
///////////////////////////////////////////////////////////////////////////

/* ======================
        Imports
====================== */

import { onBeforeUnmount, onMounted, onUnmounted, ref } from 'vue'

/* ======================
    Refs (i.e., State)
====================== */

const seconds = ref(0)

/* ======================
     Template Refs
====================== */

// Bound to the ticker card below. Used to prove — not just describe — that
// the DOM node is still attached in onBeforeUnmount, but already detached
// by the time onUnmounted fires.
const tickerRef = ref<HTMLDivElement | null>(null)

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
// onBeforeUnmount runs right before teardown starts. At this exact moment,
// the component instance, its reactive state, and its DOM elements are all
// STILL fully intact — nothing has been torn down yet. This is your last
// guaranteed chance to read the live DOM, save final values, or send a
// "goodbye" signal while everything this component touches is still valid.
//
// Below, we log the final elapsed seconds AND confirm the ticker element is
// still attached to the document at this point — compare this against the
// same check in onUnmounted below, where it will no longer be attached.
//
///////////////////////////////////////////////////////////////////////////

onBeforeUnmount(() => {
  console.log('onBeforeUnmount() fired! Final seconds:', seconds.value)
  console.log('  → tickerRef still in document?', document.contains(tickerRef.value))
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
// Note the log below: by this point, tickerRef is already detached from
// the document — proving why DOM reads/measurements belong in
// onBeforeUnmount, not here. onUnmounted is for cleanup, not final reads.
//
///////////////////////////////////////////////////////////////////////////

onUnmounted(() => {
  console.log('onUnmounted() fired! Clearing interval:', intervalId)
  console.log('  → tickerRef still in document?', document.contains(tickerRef.value))
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div
    ref="tickerRef"
    class="mx-auto w-fit rounded-lg border border-[#42B883] bg-white p-2 text-center shadow"
  >
    <p class="text-sm">
      Page has been<br />
      active for:
    </p>
    <div class="font-mono text-xl text-[#42B883]">{{ seconds }}s</div>
  </div>
</template>
