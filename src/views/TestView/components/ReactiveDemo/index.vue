<script setup lang="ts">
/* ======================
        Imports
====================== */

import { computed, reactive } from 'vue'

/* ======================
        Types
====================== */

type CounterState = {
  count: number
  step: number
}

/* ======================
     Reactive State
====================== */
///////////////////////////////////////////////////////////////////////////
//
// One object, two related values. No `.value` needed.
// Both values live in counter, and you read and write them directly (counter.count += counter.step), with no .value.
// The template binds to them the same way, including v-model.number="counter.step" on the input.
// A computed works with it too, and here it turns the number red when it goes negative.
//
// reactive ONlY takes objects. It doesn't take primitives like strings, booleans, numbers.
// I think that ref() is an abstraction on top of reactive:
//
//   AI: "When you pass an object to ref(), Vue runs it through reactive() internally,
//   and .value is just the box around the resulting proxy. So ref({ a: 1 }) and
//   reactive({ a: 1 }) have the same deep reactivity. The only difference is the box.""
//
// ⚠️ But why does reactive exist in the first place? Why is it an alternative to ref()?
// ref() can also take objects. You can reassign properties, but not the top-level variable.
// That limit is where both the benefit and the annoyance come from.
//
// Many devs just stick with ref(), but one potential use case is for handling all form data in
// a single object. Personally, I don't like that, but presumably the idea is that reactive gives
// you some assurance that your top-level object won't be accidentally wiped.
//
// Maybe it's also useful for conceptual grouping. For example, let's say we
// want error, loading and data state for a particular API call. We could then place all
// that inside of a single reactive object.
//
/////////////////////////
//
// Actual Benefits:
//
//   1. Less .value noise. In script, form.name beats form.value.name, and it adds up when there
//   are many fields. In the template, both look identical, since refs unwrap there.
//
//   2. It guards against wiping the top-level object. This is the point you already made.
//   With ref, this compiles and works:
//
//     const form = ref({ name: '', email: '' })
//     form.value = { name: 'x' } // Oops, email is gone, and TypeScript may not catch it
//
//   With reactive that line can't be written, so you're pushed toward Object.assign(form, ...)
//   or changing individual properties. It's a small guardrail, and only useful if that mistake tempts you.
//
//   3. Stable identity. The object you created is the object that always exists. If you hand form to a
//   helper function or composable, it never ends up holding a stale copy, because you never swap the
//   object out. With ref, replacing .value swaps in a new object underneath.
//
//   4. Namespacing. status.isLoading, status.error, and status.data read better than three loose refs,
//   and they signal that the values belong together. This is your API-state idea, and it's a legitimate use.
//   It's mostly about readability, though. A ref holding an object does the same job.
//
/////////////////////////
//
// The Costs:
//
//   - Destructuring breaks reactivity. const { count } = counter gives you a plain number that never updates.
//     You need toRefs(counter) to get refs back.
//
//   - watch gets awkward. watch(counter.count, ...) doesn't work. You have to write watch(() => counter.count, ...).
//
//   - You can't replace the whole thing. For something like a fetched result (data.value = await fetchUser()),
//     ref is the natural fit.
//
//   - Primitives are out. You need ref anyway for a lone isOpen or count, so you'd be mixing two styles in one component.
//
//   - Passing a property around is fiddly. A composable that expects a Ref<number> can't take counter.count.
//     You'd need toRef(counter, 'count').

//
/////////////////////////
//
// How To Decide:
//
// Honestly: default to ref for everything. The Vue docs recommend this too.
// It's one consistent rule with no gotchas.
//
// Reach for reactive only when all of these are true:
//
//   1. It's a bag of related fields, like a form or a settings object.
//   2. You'll only ever mutate its fields, never replace the whole thing.
//   3. You like the cleaner dot access.
//
// If you never use reactive, you're not missing anything important. The main reason to
// know it is that you'll see it in tutorials and other people's code, and inside Vue's own APIs.
//
///////////////////////////////////////////////////////////////////////////

// ⚠️ Gotcha: dont's destrtucture off of this.
// const { count } = reactive<CounterState>({ count: 0, step: 1 })
// This will be a dead, disconnected number. Why?
// The reactivity is gone the instant it's destructured.
// See here at 22:30: https://www.youtube.com/watch?v=abGI-ZzBdag
const counter = reactive<CounterState>({
  count: 0,
  step: 1
})

/* ======================
       Computed
====================== */

const isNegative = computed(() => counter.count < 0)

/* ======================
Event Handlers / Functions
====================== */

function increment() {
  counter.count += counter.step
}

function decrement() {
  counter.count -= counter.step
}

function reset() {
  counter.count = 0
  counter.step = 1
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="bg-card mx-auto w-fit min-w-70 space-y-2 rounded-xl border p-4 shadow">
    <!-- ====================
         Controls + Count
    ===================== -->

    <div class="flex items-center justify-center gap-2">
      <button
        class="bg-secondary hover:bg-primary flex-1 rounded-md px-2 py-1 text-sm font-semibold text-white"
        @click="decrement"
        type="button"
      >
        − {{ counter.step }}
      </button>

      <div
        class="text-center text-4xl font-bold tabular-nums"
        :class="isNegative ? 'text-rose-500' : 'text-primary'"
      >
        {{ counter.count }}
      </div>
      <button
        class="bg-secondary hover:bg-primary flex-1 rounded-md px-2 py-1 text-sm font-semibold text-white"
        @click="increment"
        type="button"
      >
        + {{ counter.step }}
      </button>
    </div>

    <!-- ====================
            Step Input
    ===================== -->

    <div class="flex items-center gap-2">
      <label for="step" class="text-primary text block flex-1 font-semibold text-nowrap"
        >Step Size</label
      >

      <div class="flex-1">
        <input
          id="step"
          class="bg-card block w-full min-w-0 rounded-md border px-2 py-1 text-sm"
          min="1"
          type="number"
          v-model.number="counter.step"
        />
      </div>
    </div>

    <!-- ====================
              Reset
    ===================== -->

    <button
      class="bg-secondary hover:bg-primary w-full rounded-md px-2 py-1 text-sm font-semibold text-white uppercase"
      @click="reset"
      type="button"
    >
      Reset
    </button>
  </div>
  <div class="text-muted-foreground mt-1 text-center font-mono text-xs">(ReactiveDemo.vue)</div>
</template>
