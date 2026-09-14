<!-- https://vuejs.org/api/composition-api-lifecycle.html#onbeforemount -->

<script setup lang="ts">
///////////////////////////////////////////////////////////////////////////
//
// onBeforeMount is genuinely one of the least-used lifecycle hooks in practice
// — you're not wrong to struggle with a use case. Here's why: it runs after
// setup() / <script setup> has already executed, but before the first
// render / DOM-patch happens. Since your reactive state is already fully set
// up by that point, almost anything you'd want to do here, you could just...
// do directly in the top-level <script setup> body instead. There's rarely
// a reason to wrap it in a hook.
//
// The one legitimate distinction that matters: onBeforeMount does not run during
// server-side rendering (SSR), while top-level <script setup> code does run on the server.
// So onBeforeMount is effectively "the earliest hook guaranteed to be client-only"
// — useful if you need a browser API (window, localStorage, matchMedia) that doesn't
// exist on the server, and you need its result to affect the very first render
// (NOT one frame after it).
//
// That last part — "affect the first render, not one frame after" — is the actual
// practical payoff, and it's demonstrable: reading a theme preference from localStorage
// in onBeforeMount means the correct theme is already set before anything paints.
// Doing the same read in onMounted would show the wrong theme for one frame first,
// then flip — a classic "flash of incorrect content" bug.
//
///////////////////////////////////////////////////////////////////////////

/* ======================
        Imports
====================== */

import {
  onBeforeMount,
  ref
  // onMounted,
} from 'vue'

/* ======================
    Refs (i.e., State)
====================== */

const isDarkMode = ref(false)

/* ======================
    Lifecycle Hooks
====================== */
///////////////////////////////////////////////////////////////////////////
//
// onBeforeMount runs after setup()/<script setup> has executed, but before
// the component's first render/DOM-patch happens. Reactive state already
// exists by this point — this hook just fires right before it's first
// painted to the screen.
//
// It's rarely needed: since setup-level code already runs before this hook,
// most "do something before mount" logic can just live at the top level of
// <script setup> instead — there's no benefit to wrapping it here.
//
// The one real distinction: onBeforeMount does NOT run during server-side
// rendering (SSR), while top-level <script setup> code DOES run on the
// server. So this is the earliest hook guaranteed to be client-only —
// useful when you need a browser-only API (localStorage, window,
// matchMedia) whose result must affect the FIRST render, not one frame
// after it.
//
// Demo below: reading a "theme" preference from localStorage here means
// the correct theme is already applied before anything paints. Doing this
// same read in onMounted instead would show the WRONG theme for one frame
// first, then flip — a classic flash-of-incorrect-content bug.
//
///////////////////////////////////////////////////////////////////////////

onBeforeMount(() => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // To actually see the difference this hook makes, try this in the console before reloading:
  //
  //   localStorage.setItem('demoTheme', 'dark')
  //
  // Then refresh. The dark theme appears immediately with zero flash — because by the time Vue
  // paints anything, isDarkMode is already correct.
  //
  ///////////////////////////////////////////////////////////////////////////

  console.log('onBeforeMount() fired! Reading theme preference before first paint.')
  isDarkMode.value = localStorage.getItem('demoTheme') === 'dark' // true | false
})

///////////////////////////////////////////////////////////////////////////
//
// In theory, this is what you're not supposed to do. That said, I couldn't see the flash at all.
// AI's response:
//
// That tracks, and it's actually the expected outcome — worth explaining why, since it demystifies
// rather than undermines the lesson.
//
// The core reason: onMounted fires synchronously, right after the DOM has been patched, but before
// the browser has painted anything to the screen. Browsers batch DOM mutations within a single frame
// and only paint once, after all synchronous JavaScript in that tick has finished running.
// So the sequence is actually:
//
//   render (light) → patch DOM → onMounted fires → isDarkMode flips → DOM re-patched (dark) → browser paints ONCE
//
// Both the "wrong" light state and the corrected dark state happen before the first paint, because there's no await,
// no setTimeout, nothing yielding control back to the browser in between. The browser never gets a chance to paint
// the intermediate (wrong) state — so visually, it looks identical to onBeforeMount, even though the code took
// an extra round-trip to get there.
//
// This is genuinely an important nuance to flag, because it means the earlier framing ("onMounted causes a flash")
// was slightly too strong as stated — a synchronous onMounted read of localStorage won't actually flash in practice,
// for exactly the reason above. Real flashes from a "wrong hook" choice typically only show up when the correction
// happens asynchronously — after an await fetch(...), a Promise, or anything that yields to the event loop and lets
// the browser paint the "wrong" state first. That's precisely why the demo needed setTimeout to become visible:
// it was manufacturing the async gap that causes a real flash, not just simulating one.
//
// So the more accurate lesson is:
//
//   - onBeforeMount guarantees "before first paint," full stop — including across SSR,
//     and regardless of whether your logic is sync or async.
//
//   - onMounted is only effectively flash-free if your logic is synchronous. The instant
//     it becomes async (even a microtask like a resolved Promise.then, not just a setTimeout),
//     a real flash becomes possible, because the browser can paint in the gap.
//
///////////////////////////////////////////////////////////////////////////

// onMounted(() => {
//   isDarkMode.value = localStorage.getItem('demoTheme') === 'dark'
// })
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div
    class="mx-auto w-fit max-w-150 space-y-3 rounded-lg border p-4 shadow transition-colors"
    :class="
      isDarkMode
        ? 'border-stone-700 bg-stone-900 text-stone-100'
        : 'border-stone-300 bg-white text-stone-900'
    "
  >
    <p class="text-center text-sm">
      Theme loaded from <code class="text-pink-500">localStorage</code> before first paint:
    </p>

    <div class="text-center text-3xl font-semibold">{{ isDarkMode ? 'Dark' : 'Light' }}</div>
  </div>
</template>
