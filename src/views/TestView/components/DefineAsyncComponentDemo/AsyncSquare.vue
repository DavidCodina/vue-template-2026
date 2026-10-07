<script setup lang="ts">
///////////////////////////////////////////////////////////////////////////
//
// With this implementation, the associated component will only be loaded when the
// props.square matches the key. This can be proven by going to the Network tab --> JS.
// Admittedly, this is a contrived demo, but this pattern may be useful for an icon loader
// or other implementation that may render one of many possible components. Obviously, if you
// only have three possible components, it's not a big deal, but if you had dozens then this
// approach would be more efficient.
//
///////////////////////////////////////////////////////////////////////////

/* ======================
        Imports
====================== */

import { computed, defineAsyncComponent } from 'vue'

/* ======================
      Props / Emits
====================== */

const props = defineProps<{
  square: 'Red' | 'Green' | 'Blue'
}>()

/* ======================
        Computed
====================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha: These wont' work in dev or prod:
//
//   const Square = computed(() => {
//     return defineAsyncComponent(() => import(`./${props.square}.vue`))
//   })
//
//   const Square = computed(() => {
//     return defineAsyncComponent(() => import(`./squares/${props.square}.vue`))
//   })
//
// However, extracting the path into its own variable seems to make them work in dev:
//
//   const Square = computed(() => {
//     const path = `./${props.square}.vue`
//     return defineAsyncComponent(() => import(path))
//   })
//
//   const Square = computed(() => {
//     const path = `./squares/${props.square}.vue`
//     return defineAsyncComponent(() => import(path))
//   })
//
// However, they will still fail in production. The general problem is alluded to in this
// warning from Vite, which happens in at least some of the above cases.
//
//   The above dynamic import cannot be analyzed by Vite.
//   See https://vite.dev/guide/features#dynamic-import for supported dynamic import formats.
//   If this is intended to be left as-is, you can use the /* @vite-ignore */ comment inside
//   the import() call to suppress this warning.
//
// Essentially, Vite can't tell which files import(path) might load, so it never includes them in the bundle.
// At runtime in a deployed app, the browser would request something like ./squares/Green.vue from your server.
// That file doesn't exist there (production has compiled JS chunks, not .vue source
// files), so the request would fail and the square wouldn't render.
//
// One approach to fix this is to be explict about it. This works, but it has the
// downside of being verbose:
//
//   const squares = {
//     Red: defineAsyncComponent(() => import('./Red.vue')),
//     Green: defineAsyncComponent(() => import('./Green.vue')),
//     Blue: defineAsyncComponent(() => import('./Blue.vue'))
//   }
//
//   const Square = computed(() => squares[props.square])
//
// Alternatively, this seem to work in dev and prod but we get the same warning as before.
//
//   const Square = computed(() => {
//     const name = props.square
//     return defineAsyncComponent(() => import(`./${name}.vue`))
//   })
//
// Why does assigning props.square to a plain local variable first, make a difference?
// I'm not sure. It could be that Vite handles simple identifiers better than member expressions.
// However, it ALSO results in the same Vite warning.
//
//   The above dynamic import cannot be analyzed by Vite...
//
// So... If you want no warnings, you want it to work in production, and you want
// it to be dynamic (i.e., no explicit mapping), then do this.
//
// The thing that still doesn't make any sense to me is why we can't just inline it:
//
//   const Square = computed(() => {
//     return defineAsyncComponent(() => import(`./squares/${props.square}.vue`))
//   })
//
// AI Response:
//
//   The inline version breaks because of when props.square gets read, which determines whether
//   the computed tracks it as a dependency. Given this:
//
//     const Square = computed(() => {
//       return defineAsyncComponent(() => import(`./squares/${props.square}.vue`))
//     })
//
//   When the computed runs, all it does is call defineAsyncComponent(...) and hand it a loader function.
//   The loader function is not called yet. Vue calls it later, when the async component is first rendered.
//   So props.square is never read during the computed's execution, which means the computed has zero
//   reactive dependencies.
//
//   The result:
//
//     1. First render: the computed runs, the loader runs later and reads props.square ('Red'), and you see red.
//     2. You click Green, props.square changes, but nothing is subscribed to it.
//     3. The computed never invalidates, so it keeps returning the same cached Red async component.
//
///////////////////////////////////////////////////////////////////////////

const Square = computed(() => {
  const name = props.square
  return defineAsyncComponent(() => import(`./squares/${name}.vue`))
})

///////////////////////////////////////////////////////////////////////////
//
// Claude Summary Of Findings:
//
//   1. Vite only bundles what it can analyze. A dynamic import() in a production build
//   works only if Vite can work out which files it might load. When it can, it makes
//   a separate chunk for each file and loads it on demand. When it can't, it leaves
//   the import alone, which causes the "cannot be analyzed" warning and the breakage below.
//
//   2. A variable-path import is the dangerous one. import(path) makes the code work in dev,
//   because the browser requests your source file straight from the dev server. A production
//   build, though, contained no Red, Green or Blue chunks, so the deployed app would fail to load them.
//
//   3. The template literal needs a folder to expand into. When the import is ./squares/${name}.vue, Vite turns it into
//   a map of every file matching ./squares/*.vue and generates a chunk for each. With ./${name}.vue
//   (same folder as the importing file), Vite left the import as-is in dev, so it was never analyzed.
//
//   4. Loading is lazy. defineAsyncComponent only fetches a component the first time it renders,
//   so Green and Blue load on first click, and each loads only once.
//
// Why the final version is the right one
//
//   The import is a template literal with a fixed ./squares/ prefix and a fixed .vue extension,
//   so Vite can expand it into a glob. That gives you real chunks in the production build,
//   working lazy loading in dev, no warning, and no hand-written map. It also scales: drop in
//   Purple.vue and it works without touching the component.
//
// Why this matters: const name = props.square
//
//   Now props.square is read inside the computed's synchronous execution, so Vue records it as a dependency.
//   When it changes, the computed re-runs and creates a new async component. The loader also closes over
//   name, a plain string captured at that moment, rather than reading from props later.
//
// Rule of thumb
//
//   Anything reactive that you want a computed (or watchEffect) to track must be read
//   synchronously in its body, not inside a callback that runs later.
//
///////////////////////////////////////////////////////////////////////////
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <component :is="Square" />
</template>
