<!-- https://vuejs.org/api/composition-api-lifecycle.html#onerrorcaptured  -->

<script setup lang="ts">
///////////////////////////////////////////////////////////////////////////
//
// onErrorCaptured is different from every hook we've covered so far
// — it's not about a point in this component's own lifecycle, but about catching
// errors thrown by descendant components (children, grandchildren, etc.). It's
// Vue's closest equivalent to a React error boundary: a parent can wrap its children
// in a safety net so one broken child doesn't crash the whole app.
//
// It fires when an error is thrown inside a descendant's setup(), render function,
// watcher, or lifecycle hook. Your callback receives (error, instance, info)
// — the error itself, the component instance it came from, and a string describing
// where it happened (e.g., "render function", "mounted hook"). Returning false from
// the callback tells Vue to stop the error from propagating further up the component
// tree (and suppresses the default console error) — returning nothing (or true) lets
// it continue bubbling up.
//
// Common real-world use cases:
//
//   - Isolating a risky widget so it fails gracefully instead of taking down the whole page,
//     e.g., a third-party embed, a chart that might get malformed data, a user-generated content renderer.
//
//   - Centralized error logging/reporting — send caught errors to a service like Sentry, with context
//     about which component failed, without needing try/catch scattered through every child.
//
//   - Showing a friendly fallback UI ("Something went wrong loading this section") instead of a blank
//     white screen or a console-only crash.
//
//
///////////////////////////////////////////////////////////////////////////

/* ======================
        Imports
====================== */

import { onErrorCaptured, ref } from 'vue'
import BuggyWidget from './BuggyWidget.vue'

/* ======================
    Refs (i.e., State)
====================== */

// Tracks whether the child has crashed, so we can swap it out for a
// fallback UI instead of leaving a broken/half-rendered component visible.
const hasError = ref(false)
const errorMessage = ref('')

/* ======================
Event Handlers / Functions
====================== */

const resetWidget = () => {
  hasError.value = false
  errorMessage.value = ''
}

/* ======================
    Lifecycle Hooks
====================== */
///////////////////////////////////////////////////////////////////////////
//
// onErrorCaptured is unlike every other hook covered so far: it doesn't
// mark a point in THIS component's own lifecycle — it catches errors
// thrown by DESCENDANT components (children, grandchildren, etc.). This is
// Vue's version of a React error boundary.
//
// It fires for errors thrown inside a descendant's setup(), render
// function, watchers, or lifecycle hooks — and also template event
// handlers, as demonstrated here.
//
// The callback receives (error, instance, info):
//   - error: the thrown Error object
//   - instance: the component instance where it originated
//   - info: a string describing where it happened (e.g. "render function")
//
// Returning `false` stops the error from propagating further up the
// component tree and suppresses Vue's default console error. Returning
// nothing (or true) lets it continue bubbling up to any ancestor further
// above this one.
//
// This only catches errors from descendants, not the component's own code.
// If OnErrorCapturedDemo itself threw an error directly in its own <script setup>,
// onErrorCaptured here would not catch it — you'd need an ancestor above this
// component for that. It only guards against children below it in the tree.
//
// Async errors need a caveat. If BuggyWidget threw inside something like a .then()
// callback or a raw setTimeout (not awaited inside a lifecycle hook Vue is tracking),
// onErrorCaptured may not catch it — Vue's error handling generally covers errors
// within its own synchronous call stack (setup, render, watchers, lifecycle hooks,
// and template-bound handlers), not detached async callbacks. Worth a quick mention
// if you want to preface expectations, though probably a "future gotcha to know about"
// rather than something to build out right now.
//
///////////////////////////////////////////////////////////////////////////

onErrorCaptured((error, _instance, info) => {
  console.log('onErrorCaptured() fired!')
  console.log('  → error:', error.message)
  console.log('  → info:', info)

  hasError.value = true
  errorMessage.value = error.message

  // Returning false matters here. If you removed that return false, the error would still
  // get handled locally (your hasError logic still runs), but it would also continue propagating upward
  // — meaning if this ErrorBoundaryDemo were itself nested inside some other ancestor with its own
  // onErrorCaptured, that ancestor would get the error too. return false says "this is fully handled, stop here."
  return false // Stop propagation — we've handled it here.
})
</script>

<!-- ======================================================================

======================================================================= -->
<!-- <button
@click="increment"
class="cursor-pointer rounded border border-[rgba(0,0,0,0.2)] bg-[#42B883] px-1 py-0.5 text-xs font-semibold text-white shadow"
>
Increment Count
</button> -->
<template>
  <div class="mx-auto max-w-75 space-y-3">
    <div v-if="hasError" class="rounded-lg border border-red-300 bg-red-50 p-2 shadow">
      <h3 class="text-sm font-black text-red-700">Error!</h3>
      <p class="mt-1 text-xs font-medium text-red-700 italic">{{ errorMessage }}</p>
      <button
        @click="resetWidget"
        class="mt-2 w-full min-w-37.5 cursor-pointer rounded border border-[rgba(0,0,0,0.2)] bg-red-600 px-1 py-0.5 text-xs font-semibold text-white shadow"
      >
        RETRY
      </button>
    </div>

    <BuggyWidget v-else />
  </div>
</template>
