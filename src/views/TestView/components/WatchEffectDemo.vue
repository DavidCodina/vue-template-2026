<!--
https://vuejs.org/guide/essentials/watchers.html
-->

<script setup lang="ts">
///////////////////////////////////////////////////////////////////////////
//
// The closest analog to useEffect in Vue 3 is watchEffect — but depending
// on what kind of effect you want, Vue splits the responsibilities across
// onMounted, watch, and onUnmounted.
//
// Vue does not have a single “do everything” hook like React’s useEffect.
// Instead, it gives you more precise tools. The three Vue equivalents of useEffect
//
//   1. onMounted → useEffect(() => {}, [])
//   Runs once after the component mounts.
//
//   2. watchEffect → useEffect without dependency array
//   Automatically tracks reactive dependencies and re-runs when they change.
//   This is the closest conceptual match to useEffect.
//   No dependency array needed — Vue tracks dependencies automatically.
//
//   3. watch → useEffect with a dependency array
//   If you want explicit dependency control, watch is the Vue equivalent.
//
// Which one should you use coming from React?
// If you're used to useEffect:
//
//   - For “run once on mount”: use onMounted
//   - For “run when X changes”: use watch(X, …)
//   - For “run whenever anything reactive used inside changes”: use watchEffect
//   - For “cleanup”: use the cleanup callback inside watch/watchEffect
//
///////////////////////////////////////////////////////////////////////////

/* ======================
        Imports
====================== */

import Button from '@/components/Button.vue'
import { ref, watch, watchEffect } from 'vue'

/* ======================
    Refs (i.e., State)
====================== */

const count = ref(0)
const lastChange = ref('No changes yet...')

const effectRuns = ref(0)
const effectMessage = ref('')

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

watch(
  count,
  (newValue, prevValue) => {
    // If you set immediate: true, then their will be no prevValue (i.e., undefined)

    if (prevValue === undefined) {
      lastChange.value = 'watch() fired on initial load, but no changes to count yet...'
      return
    }

    lastChange.value = `count changed from ${prevValue} to ${newValue}`
  },
  {
    // immediate: true,

    // Does what you'd expect: It triggers once, then stops.
    // If immediate: true, then that's it. It won't fire a second time.
    once: true

    // Since count is just a number, deep isn't demonstrable without introducing an object
    // deep: true
  }
)

///////////////////////////////////////////////////////////////////////////
//
// watchEffect(fn) — no source argument.
//
// While watch() makes you explicitly name the source (count) up front, watchEffect()
// doesn't take a source at all. Instead, it runs a function immediately, and Vue
// automatically tracks whatever reactive values that function reads while running.
// Any of those become its dependencies. Change any of them, and it reruns.
//
//
//
// Runs fn immediately, and
// automatically tracks whatever reactive values fn reads while running
// (here, that's count.value). Any of those becomes a dependency — change
// it, and this reruns.
//
// Differences from watch():
//   - Always runs once immediately on creation (no `immediate` option
//     needed — that's just how watchEffect works).
//   - No old/new values passed in, since dependencies are discovered
//     automatically rather than declared up front — there's no single
//     "the source" to diff against.
//
// Reach for watch() when:
//
//   - You need the old value, not just the new one (like your lastChange display — "changed from X to Y" is
//     impossible with watchEffect, since it never hands you a previous value).
//
//   - You want to react to one specific thing changing, even if your callback also happens to read other reactive values.
//     watch() only reruns when the named source changes — reading other refs inside the callback doesn't make it track them.
//
//   - The side effect should be lazy — skipped entirely until something actually changes (e.g., "don't validate this field
//     until the user touches it").
//
//   - You're watching multiple specific sources together (watch([a, b], ...)), or need deep/once/flush fine-tuned per-watcher.
//
// Reach for watchEffect() when:
//
//   - The logic and its dependencies are tightly coupled — you're just running a block of code that naturally reads a few
//     reactive values, and you want "rerun this whenever any of the values it touches change" without maintaining a separate
//     source list. Less bookkeeping, since you don't have to keep the source array in sync with what the function actually uses.
//
//   - You want it to run immediately on setup as well as on every change (that's watchEffect's default behavior, vs. watch's
//     default of skipping the initial run).
//
//   - The set of dependencies might shift based on branching logic — e.g. an if that sometimes reads a and sometimes reads b.
//     watchEffect re-tracks dependencies on every run, so it adapts; watch()'s source list is fixed at setup.
//
//   - Classic use case: syncing to an external system — logging, updating document.title, calling a DOM API, kicking off
//     a fetch — where you just want "keep this thing in sync with whatever reactive state it depends on."
//
// The rule of thumb Vue's own docs give: if you find yourself repeatedly listing out the same values as both a watch() source
// and reading them again inside the callback, that's often a sign watchEffect would be less code for the same effect.
// But the moment you need the previous value for comparison — like your lastChange watcher — you're locked into watch(),
// since that's structurally the one thing watchEffect can't give you.
//
// In this demo, that's exactly why the two coexist naturally: watch() owns "show me the diff," watchEffect owns
// "just keep this message in sync with count."
//
///////////////////////////////////////////////////////////////////////////

watchEffect(() => {
  effectRuns.value++
  effectMessage.value = `watchEffect ran (#${effectRuns.value}) — count is currently ${count.value}`

  // ⚠️ Is there a cleanup function:
  // onCleanup(() => {})
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section class="bg-card mx-auto w-fit max-w-75 space-y-2 rounded-xl border p-4 shadow">
    <!-- ====================
            Count
    ===================== -->

    <div class="text-primary text-center text-3xl font-bold tabular-nums">{{ count }}</div>

    <!-- ====================
          Count Controls
    ===================== -->

    <div class="mb-4 flex justify-center gap-1">
      <Button
        @click="decrement"
        class="bg-secondary hover:bg-primary block min-w-15 cursor-pointer rounded px-2 py-1 text-white"
      >
        −
      </Button>
      <button
        @click="reset"
        class="bg-secondary hover:bg-primary block min-w-15 cursor-pointer rounded px-2 py-1 text-white"
      >
        Reset
      </button>
      <button
        @click="increment"
        class="bg-secondary hover:bg-primary block min-w-15 cursor-pointer rounded px-2 py-1 text-white"
      >
        +
      </button>
    </div>

    <!-- ====================
          Last Change
    ===================== -->

    <p class="border-t pt-4 text-sm">
      <code class="text-pink-500">lastChange</code>: {{ lastChange }}
    </p>

    <!-- ====================
          watchEffect
    ===================== -->

    <p class="pt-1 text-sm">
      <code class="text-pink-500">effectMessage</code>:
      {{ effectMessage }}
    </p>
  </section>
</template>
