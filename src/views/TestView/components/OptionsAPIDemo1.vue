<script lang="ts">
///////////////////////////////////////////////////////////////////////////
//
// About This Demo:
//
// While it's called OptionsAPIDemo1, it's actually a SeedTray component.
// It's essentially a variant on a TodoList component.
//
// SeedTray is a small planting tracker — think of it as the simplest possible to-do list,
// themed around a seed tray you're sowing for the season.
//
// What it models: a tray has a name ("Spring tray") and a list of seed varieties, each with a
// name and a sown flag (have you actually planted it yet or not). That's the entire domain: one
// tray, many seeds, each either done or not-done.
//
// What you can do with it:
//
//   - See every variety in the tray as a list, with sown ones shown struck-through and greyed out.
//   - Click "Sow"/"Undo" on any row to flip its status.
//   - Type a new variety name and hit Add (or Enter) to add it to the list.
//   - Read a one-line summary at the top telling you how many are left.
//   - See a small status line ("Added Basil", "Sowed Rocket") reflecting the last thing you did.
//
///////////////////////////////////////////////////////////////////////////
/* ======================
        Imports
====================== */

import { defineComponent } from 'vue'

/* ======================
        Types
====================== */
// A plain TS interface describing one row of our data.

type Seed = {
  id: number
  name: string
  sown: boolean
}

/* ======================
      defineComponent
====================== */
///////////////////////////////////////////////////////////////////////////
//
// defineComponent is the whole trick for TypeScript + Options API.
// It's what gives `this` its type inside data(), methods, computed, etc.
//
// defineComponent is what makes TypeScript work here. Without it, this inside methods is untyped
// and this.seeds gives you nothing. Wrapping the options object in defineComponent lets Vue infer
// the this type from data(), props, and sibling methods. That's the bulk of what the Options API supports
// — there's no equivalent to ref<Foo>() for annotating individual pieces.
//
// Annotating data(). Vue infers types from the returned object, so trayName is string automatically.
// Two cases need help: an empty array infers as never[], and a field starting as null infers as null,
// so as Seed[] and as string | null tell it the intended shape.
//
///////////////////////////////////////////////////////////////////////////

export default defineComponent({
  name: 'SeedTray',

  // data() holds the actual state — the tray name, the seed list, the text currently typed in the input,
  // and a record of the last action. This is the source of truth; everything else is derived from or acts on it.
  data() {
    return {
      trayName: 'Spring tray',

      // Is ref('') strictly a Composition API thing?
      // const draft = ref('')
      draft: '',
      nextId: 4,
      // Annotate arrays/nullable fields, otherwise TS infers never[] or null.
      seeds: [
        { id: 1, name: 'Basil', sown: true },
        { id: 2, name: 'Rocket', sown: false },
        { id: 3, name: 'Coriander', sown: false }
      ] as Seed[],
      lastAction: null as string | null
    }
  },

  ///////////////////////////////////////////////////////////////////////////
  //
  // computed reads that state to produce display values, without changing anything.
  // They recalculate only when the seeds or tray name actually change, and get cached
  // in between — covered in the last few messages.
  //
  // Derived values live here, not in methods: they cache, and only
  // recompute when the data they read actually changes.
  // In other words, a computed property caches. It only recalculates when something
  // it depends on changes, whereas a method reruns on every render.
  //
  //
  // Originally, remaining and summary() were methods. Methods run on every render,
  // which would cause unnecessary recalculation.
  //
  ///////////////////////////////////////////////////////////////////////////
  computed: {
    // remaining is used by summary(). If we omit this.remaining from summary(), then
    // this computed function NEVER runs. Similarly, if we hardcode a return value, rather
    // than using this.seeds, then this computed function will not subsequently rerunt when seeds changes.
    remaining(): number {
      // this.seeds` is typed Seed[] here, inferred from data() above.
      const value = this.seeds.filter((seed) => !seed.sown).length
      console.log('remaining', value)
      return value
    },

    summary(): string {
      // One computed can read another through `this`, same as in methods.
      // However, we do this.remaining rather than this.remaining(), since
      // computed values are accessed as properties, even from inside the component.

      const left = this.remaining
      if (left === 0) {
        return `${this.trayName} is fully sown.`
      }
      return `${left} of ${this.seeds.length} still to sow in ${this.trayName.toLowerCase()}.`
    }
  },

  ///////////////////////////////////////////////////////////////////////////
  //
  // methods (toggle, addSeed) are the actions — the only places that actually mutate data. toggle
  // flips a seed's sown bit; addSeed pushes a new seed and clears the input.
  //
  // methods are for things you *do* — event handlers, mutations.
  // Methods reach each other the same way data is reached. The one thing to watch:
  // never use an arrow function for a method, since arrows don't get Vue's bound this.
  //
  ///////////////////////////////////////////////////////////////////////////
  methods: {
    toggle(seed: Seed): void {
      seed.sown = !seed.sown
      this.lastAction = `${seed.sown ? 'Sowed' : 'Un-sowed'} ${seed.name}`
    },

    addSeed(): void {
      const name = this.draft.trim()
      if (!name) return
      this.seeds.push({ id: this.nextId++, name, sown: false })
      this.lastAction = `Added ${name}`
      this.draft = ''
    }
  }
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="bg-card mx-auto max-w-md rounded-xl border border-stone-300 p-6">
    <!-- ====================
            Header
    ===================== -->
    <!-- Interpolation: Inside <template> you drop the this.; Vue proxies it for you. -->
    <h1 class="text-xl font-semibold text-stone-800">{{ trayName }}</h1>

    <p class="mt-1 text-sm text-stone-500">{{ summary }}</p>

    <!-- ====================
            List
    ===================== -->

    <ul class="mt-5 space-y-2">
      <li
        v-for="seed in seeds"
        :key="seed.id"
        class="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm"
      >
        <span :class="seed.sown ? 'text-stone-400 line-through' : 'text-stone-800'">
          {{ seed.name }}
        </span>
        <button
          class="rounded-md border border-stone-300 px-2 py-1 text-xs text-stone-600 hover:bg-stone-100"
          @click="toggle(seed)"
        >
          {{ seed.sown ? 'Undo' : 'Sow' }}
        </button>
      </li>
    </ul>

    <!-- ====================
          Input "Form"
    ===================== -->

    <div class="mt-5 flex gap-2">
      <input
        v-model="draft"
        placeholder="Add a variety"
        class="flex-1 rounded-md border border-stone-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none"
        @keyup.enter="addSeed()"
      />
      <button
        class="rounded-md bg-emerald-700 px-3 py-2 text-sm text-white hover:bg-emerald-800"
        @click="addSeed()"
      >
        Add
      </button>
    </div>

    <!-- ====================
          Last Action
    ===================== -->

    <p v-if="lastAction" class="mt-4 text-xs text-stone-500">{{ lastAction }}</p>
  </div>
</template>
