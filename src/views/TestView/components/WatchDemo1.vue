<!--
https://vuejs.org/guide/essentials/watchers.html

This version uses the Composition API, but another example could refactor
to use the Options API.
-->

<script setup lang="ts">
/* ======================
        Imports
====================== */

import Button from '@/components/Button.vue'
import { ref, watch } from 'vue'

/* ======================
    Refs (i.e., State)
====================== */

const count = ref(0)
const bool = ref(false)
const lastChange = ref('No changes yet...')

/* ======================
Event Handlers / Functions
====================== */

function increment() {
  count.value++
}
function decrement() {
  count.value--
}
function reset() {
  count.value = 0
}

function toggleBool() {
  bool.value = !bool.value
}

/* ======================
       Watchers
====================== */
///////////////////////////////////////////////////////////////////////////
//
// watch(source, callback) — runs whenever `count` changes.
// The callback receives the new value and the old value.
//
// The core idea: watch() lets you run a function whenever a specific piece of reactive state changes
// — separately from whatever triggered the change in the first place.
//
// Breaking that down:
//
//   - First argument (count): the "source" being watched. This has to be something reactive:
//     a ref, a reactive object, or a getter function. Here it's the count ref itself (not count.value
//     — you pass the ref, Vue unwraps it for you).
//
//   - Second argument: the callback that runs after count changes. It receives two arguments: the new value
//     and the old value, in that order.
//
//   - When it runs: not on the initial render, only on subsequent changes. So when the component first mounts,
//     this callback does not fire. It only fires the first time you click +, −, or Reset.
//
// One subtlety worth flagging: watch() is lazy by default (only fires on change, not on setup).
// If you ever wanted it to also run immediately when the component loads — say, to initialize
// lastChange based on the starting value — that's the { immediate: true } option, which we intentionally
// left out of this basic version.
//
///////////////////////////////////////////////////////////////////////////

// watch(
//   count,
//   (newValue, prevValue) => {
//     // If you set immediate: true, then their will be no prevValue (i.e., undefined)
//     if (prevValue === undefined) {
//       lastChange.value = 'watch() fired on initial load, but no changes to count yet...'
//       return
//     }
//     lastChange.value = `count changed from ${prevValue} to ${newValue}`
//   },
//   {
//     // immediate: true,
//     // Does what you'd expect: It triggers once, then stops.
//     // If immediate: true, then that's it. It won't fire a second time.
//     // once: true

//     // Since count is just a number, deep isn't demonstrable without introducing an object
//     // deep: true
//   }
// )

///////////////////////////////////////////////////////////////////////////
//
// A single watch() can take an array of sources instead of one. The callback then receives arrays of
// new values and old values, in the same order as the sources array:
//
//   watch([source1, source2], ([newVal1, newVal2], [oldVal1, oldVal2]) => { ... })
//
// It fires whenever either source changes — not just when both change together.
//
// Agruably, a better demo would be firstName and lastName inputs, then a fullName ref,
// that then watched firstName and lastName, and updated whenever either changed.
// That said, that kind of derived value is actually a perfect job for computed().
// So... Picking the right tool for the job is important.
//
///////////////////////////////////////////////////////////////////////////

watch(
  [count, bool],
  ([newCount, newBool], [prevCount, prevBool]) => {
    // console.log({ countData: { newCount, prevCount }, boolData: { newBool, prevBool } })

    if (newCount !== prevCount) {
      lastChange.value = `count changed from ${prevCount} to ${newCount}`
      return
    }

    // If newCount === prevCount, then that implies that bool has changed.
    // And in that case, we will output bool info instead.
    lastChange.value = `bool changed from ${prevBool} to ${newBool}`
  },
  {
    // Options...
  }
)

// A good use case for a watcher is doing something like this.
// Another example, might be sending an http request when a piece of
// data/state changes.
watch(
  count,
  (newValue, _prevValue) => {
    if (typeof newValue === 'number' && newValue > 10) {
      count.value = 0
    }
  },
  {}
)
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section class="bg-card mx-auto w-80 space-y-2 rounded-xl border p-4 shadow">
    <!-- ====================
        count / bool
    ===================== -->

    <div class="text-primary text-center text-3xl font-bold tabular-nums">{{ count }}</div>
    <div class="text-primary text-center text-3xl font-bold tabular-nums">{{ bool }}</div>

    <!-- ====================
          Count Controls
    ===================== -->

    <div class="flex justify-center gap-1">
      <Button
        @click="decrement"
        class="bg-secondary hover:bg-primary block flex-1 cursor-pointer rounded px-2 py-1 text-white"
      >
        −
      </Button>
      <button
        @click="reset"
        class="bg-secondary hover:bg-primary block flex-1 cursor-pointer rounded px-2 py-1 text-white"
      >
        Reset
      </button>
      <button
        @click="increment"
        class="bg-secondary hover:bg-primary block flex-1 cursor-pointer rounded px-2 py-1 text-white"
      >
        +
      </button>
    </div>

    <!-- ====================
            Bool
    ===================== -->

    <div class="flex items-center justify-center gap-2">
      <button
        @click="toggleBool"
        class="bg-secondary hover:bg-primary block w-full cursor-pointer rounded px-2 py-1 text-white"
      >
        Toggle Boolean
      </button>
    </div>

    <!-- ====================
          Last Change
    ===================== -->

    <p class="border-t pt-3 text-center text-sm">
      {{ lastChange }}
    </p>
  </section>
</template>
