<script setup lang="ts">
///////////////////////////////////////////////////////////////////////////
//
// Composables are sometimes described as Vue's response to React hooks.
// However, another way to conceptualize them is as the Composition API's
// equivalent of mixins from the Options API, but with added benefits.
// They allow us to abstract out reactive data and methods, independent from
// a particular component.
//
///////////////////////////////////////////////////////////////////////////

/* ======================
        Imports
====================== */

import { useCounter } from './useCounter'

/* ======================
      Props / Emits
====================== */

// ...

/* ======================
        Types
====================== */

// ...

/* ======================
    Refs (i.e., State)
====================== */

// Each call to useCounter() creates its own INDEPENDENT count ref.
// Nothing is shared between these two unless you deliberately share it
// (e.g. by calling useCounter() once in a parent and passing the result
// down as props — same idea as lifting state up in React).
const counter1 = useCounter(0)
const counter2 = useCounter(0, 5)

/* ======================
     Template Refs
====================== */

// ...

/* ======================
  Methods / Functions
====================== */

// ...

/* ======================
     Lifecycle Hooks
====================== */

// ...

/* ======================
       Watchers
====================== */

// ...
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section>
    <h2 class="text-primary mb-1 text-center font-mono text-2xl">ComposablesDemo1.vue</h2>

    <div class="flex flex-wrap justify-center gap-4">
      <!-- ====================

      ===================== -->

      <div class="bg-card space-y-2 rounded-lg border p-2 shadow">
        <div class="text-primary text-center text-4xl font-semibold tabular-nums">
          {{ counter1.count.value }}
        </div>

        <div class="flex gap-2">
          <button
            class="bg-secondary hover:bg-primary min-w-15 flex-1 rounded px-2 py-1 text-sm font-semibold text-white"
            @click="counter1.decrement"
          >
            -{{ counter1.step }}
          </button>

          <button
            class="bg-secondary hover:bg-primary min-w-15 flex-1 rounded px-2 py-1 text-sm font-semibold text-white"
            @click="counter1.reset"
          >
            Reset
          </button>

          <button
            class="bg-secondary hover:bg-primary min-w-15 flex-1 rounded px-2 py-1 text-sm font-semibold text-white"
            @click="counter1.increment"
          >
            +{{ counter1.step }}
          </button>
        </div>
      </div>

      <!-- ====================

   ===================== -->

      <div class="bg-card space-y-2 rounded-lg border p-2 shadow">
        <div class="text-primary text-center text-4xl font-semibold tabular-nums">
          {{ counter2.count.value }}
        </div>
        <div class="flex gap-2">
          <button
            class="bg-secondary hover:bg-primary min-w-15 flex-1 rounded px-2 py-1 text-sm font-semibold text-white"
            @click="counter2.decrement"
          >
            -{{ counter2.step }}
          </button>

          <button
            class="bg-secondary hover:bg-primary min-w-15 flex-1 rounded px-2 py-1 text-sm font-semibold text-white"
            @click="counter2.reset"
          >
            Reset
          </button>

          <button
            class="bg-secondary hover:bg-primary min-w-15 flex-1 rounded px-2 py-1 text-sm font-semibold text-white"
            @click="counter2.increment"
          >
            +{{ counter2.step }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
