<script lang="ts">
///////////////////////////////////////////////////////////////////////////
//
// About This Demo:
//
// Another basic Options API demo using a Counter.
//
///////////////////////////////////////////////////////////////////////////

/* ======================
        Imports
====================== */

import { defineComponent, type PropType } from 'vue'
import { RotateCw } from '@lucide/vue'

/* ======================
      defineComponent
====================== */

export default defineComponent({
  name: 'Counter',

  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Gotcha: RotateCw Not Rendering!
  //
  // Options API components need explicit registration.
  // In <script setup>, anything you import is automatically available in the template
  // — that's one of the conveniences <script setup> gives you. <script setup> is a compiler-level
  // shorthand that exists only for the Composition API — there's no Options API equivalent of it.
  //
  // In the plain Options API, importing RotateCw only puts it in your JS scope; the template compiler
  // doesn't know it's a component unless you list it under a components key.
  //
  //   ⚠️ [Vue warn]: Failed to resolve component: RotateCw
  //
  // Without registering it in components: {}, Vue can't resolve <RotateCw> to anything.
  //
  ///////////////////////////////////////////////////////////////////////////
  components: {
    RotateCw
  },

  // props: external input, set once by whoever uses <Counter>.
  // Distinct from `data`, which is internal state the component owns.
  props: {
    step: {
      type: Number as PropType<number>, // e.g., :step="2"
      default: 1
    }
  },

  data() {
    return {
      // Used behow with v-html <header v-html="title" /> to explicitly render as HTML.
      title: `<h2 class="text-sm text-center text-primary font-bold">
        Counter Demo
        <br/>
        <span class="font-normal text-xs">(Options API)
      </h2>
      `,
      count: 0
    }
  },

  // computed: derived, read-only views of `count`. Cached; only
  // recompute when `count` actually changes.
  computed: {
    doubled(): number {
      return this.count * 2
    },
    parity(): string {
      return this.count % 2 === 0 ? 'even' : 'odd'
    }
  },

  // watch: run a side effect when a specific piece of state changes,
  // as opposed to computed, which produces a new *value*.
  watch: {
    count(newValue: number, oldValue: number): void {
      console.log(`count changed: ${oldValue} -> ${newValue}`)
    }
  },

  // methods: the only things allowed to mutate `data`.
  methods: {
    increment(): void {
      this.count += this.step
    },
    decrement(): void {
      this.count -= this.step
    },
    reset(): void {
      this.count = 0
    }
  },

  // lifecycle hooks: run at fixed points in the component's life,
  // rather than in response to user interaction like methods do.
  created(): void {
    // Runs once, right after `data`/`computed`/etc. are wired up,
    // before the component has rendered any DOM.
    console.log('Counter created, starting count:', this.count)
  },
  mounted(): void {
    // Runs once, after the component's DOM actually exists.
    console.log('Counter mounted')
  }
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section class="bg-card mx-auto w-fit space-y-2 rounded-xl border p-4 text-center shadow">
    <header v-html="title" />

    <div>
      <p class="text-primary text-3xl font-bold">{{ count }}</p>
      <p class="primary text-sm">doubled: {{ doubled }} · {{ parity }}</p>
    </div>

    <div class="flex justify-center gap-1">
      <button
        class="bg-secondary hover:bg-primary size-10 cursor-pointer rounded-md text-sm text-white"
        v-on:click="decrement"
      >
        −{{ step }}
      </button>

      <button
        class="bg-secondary hover:bg-primary cursor-pointer rounded-md p-2 text-sm text-white"
        @click="reset"
      >
        <RotateCw class="size-6" />
      </button>

      <button
        class="bg-secondary hover:bg-primary size-10 cursor-pointer rounded-md text-sm text-white"
        @click="increment"
      >
        +{{ step }}
      </button>
    </div>
  </section>
</template>
