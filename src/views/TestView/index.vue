<!-- To do:
  - Create Page and PageContainer components
  - Do a Tailwind pro tips in Notion: tabular-nums, etc.
  - Have v0 create a pretty users list page.
-->

<script setup lang="ts">
/* ======================
        Imports
====================== */

// import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { useTitle } from '@vueuse/core'
// https://lucide.dev/guide/vue/getting-started
import { FlaskConical } from '@lucide/vue'
import { onMounted } from 'vue'
import { sleep } from '@/utils/sleep'

import ComponentWithTwoChildren from './components/ComponentWithTwoChildren.vue'

/* ======================
    Component Options
====================== */
// defineOptions({...}) — compiler macro for component-level config
// (e.g., inheritAttrs, name for devtools/recursive components, etc.).
// Not reactive/runtime logic — this configures the component itself,
// so it's placed near the top, before any state or logic.

// ...

/* ======================
      Composables
====================== */

// calls like useRouter(), useMyCustomComposable(); these typically go very early,
// often right after imports, since they often produce refs/computed you'll reference
// later in the Refs section.

///////////////////////////////////////////////////////////////////////////
//
// useTitle also returns a reactive ref, so you can update
// the title  later by assigning to title.value
//
// If you want a consistent suffix across all your pages, use the titleTemplate option:
// useTitle('Test Page', { titleTemplate: '%s | My App' })
//
///////////////////////////////////////////////////////////////////////////
const _title = useTitle('Test Page')

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

// ...

/* ======================
     Template Refs
====================== */
///////////////////////////////////////////////////////////////////////////
//
// refs bound to DOM elements or child components via the template's ref="..."
// attribute (e.g., const inputEl = ref<HTMLInputElement | null>(null)).
// Populated after mount, so they're often read/used inside onMounted.
//
// Template Refs before Handlers: Handlers sometimes use template refs (e.g., a handler that
// calls .focus() on an input), so the ref should exist above it, textually — though in practice,
// since it's all just closures like we discussed, this is once again a readability choice,
// not a hard requirement.
//
///////////////////////////////////////////////////////////////////////////

// ...

/* ======================
       Computed
====================== */
// computed creates a derived, cached, reactive value based on other reactive state
// — it recalculates only when its dependencies change, and it recalculates automatically
// (no manual re-invocation needed).

// ...

/* ======================
      Variables
====================== */

// ...

/* ======================
  Methods / Functions
====================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Explore this in more datial. It's giving console warings and errors.
// https://router.vuejs.org/api/functions/onBeforeRouteLeave.html
// This can be useful if you have a form and the user is about to
// leave a page where they might lose valuable form input data.
//
///////////////////////////////////////////////////////////////////////////

// onBeforeRouteLeave((_to, _from, _next) => {
//   const answer = window.confirm('Discard unsaved changes?')
//   // return false to cancel the navigation
//   if (!answer) return false
// })

// ⚠️ When would this be practical to use?
// https://router.vuejs.org/api/functions/onBeforeRouteUpdate.html
// onBeforeRouteUpdate((to, from) => {
//   // called when the route changes but this component is reused,
//   // e.g. /users/1 -> /users/2
// })

/* ======================
     Lifecycle Hooks
====================== */

onMounted(async () => {
  try {
    await sleep(3000)
    console.log('TestView.vue mounted!')
  } catch (_err) {
    // ...
  }
})

/* ======================
       Watchers
====================== */
// watch / watchEffect calls; usually grouped near Lifecycle Hooks since
// both are about reacting to changes over time rather than one-time setup.

// ...

/* ======================
    Provide / Inject
====================== */
///////////////////////////////////////////////////////////////////////////
//
// provide(...) to share reactive state/functions down to descendant
// components without prop-drilling; inject(...) to consume state provided
// by an ancestor. Usually placed near the end since it often depends on
// state/computed/handlers defined above.
//
// Provide/Inject near the end: provide calls often reference values/functions defined earlier
// (state, computed, handlers), so it naturally reads better after those are established. inject,
// by contrast, could arguably go near the top (closer to Composables) since it's consuming
// something from outside — if you end up using both often, you might eventually want to split
// them into two sections.
//
///////////////////////////////////////////////////////////////////////////

// ...

/* ======================
        Expose
====================== */
// defineExpose({...}) — opts specific bindings into the component's public
// API, accessible via template refs from a parent (e.g., <MyComp ref="x" />
// then x.value.someMethod()). By default, <script setup> components are
// closed/private, so this is only needed if a parent must reach in directly.

// ...
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <!-- 
  <main> should be a direct child of <div id="app">, which has Tailwind "flex flex-col h-full".
  This allows <main>'s flex-1 to strech vertically in the absence of content.
  -->
  <main class="flex-1 p-6">
    <h1
      class="text-secondary dark:text-primary mb-6 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light uppercase"
    >
      _Test <FlaskConical class="size-[1em]" stroke-width="1" />
    </h1>

    <ComponentWithTwoChildren
      class="flex flex-col justify-center gap-4 p-4 outline-2 outline-dashed"
      :inputProps="{
        value: 'abc123',
        type: 'text',
        class: 'block border rounded bg-card px-2 py-1 outline-none text-sm max-w-50'
      }"
      :divProps="{ class: 'bg-lime-500 size-50 rounded-xl' }"
    />

    <!-- The shading gradients are not quite right when compared against similar Tailwind swatches. -->
    <!-- <section class="flex justify-center">
      <div class="bg-primary-50 size-20"></div>
      <div class="bg-primary-100 size-20"></div>
      <div class="bg-primary-200 size-20"></div>
      <div class="bg-primary-300 size-20"></div>
      <div class="bg-primary-400 size-20"></div>
      <div class="bg-primary-500 size-20"></div>
      <div class="bg-primary-600 size-20"></div>
      <div class="bg-primary-700 size-20"></div>
      <div class="bg-primary-800 size-20"></div>
      <div class="bg-primary-900 size-20"></div>
      <div class="bg-primary-950 size-20"></div>
    </section>
    <section class="mb-12 flex justify-center">
      <div class="size-20 bg-emerald-50"></div>
      <div class="size-20 bg-emerald-100"></div>
      <div class="size-20 bg-emerald-200"></div>
      <div class="size-20 bg-emerald-300"></div>
      <div class="size-20 bg-emerald-400"></div>
      <div class="size-20 bg-emerald-500"></div>
      <div class="size-20 bg-emerald-600"></div>
      <div class="size-20 bg-emerald-700"></div>
      <div class="size-20 bg-emerald-800"></div>
      <div class="size-20 bg-emerald-900"></div>
      <div class="size-20 bg-emerald-950"></div>
    </section>

    <section class="flex justify-center">
      <div class="bg-secondary-50 size-20"></div>
      <div class="bg-secondary-100 size-20"></div>
      <div class="bg-secondary-200 size-20"></div>
      <div class="bg-secondary-300 size-20"></div>
      <div class="bg-secondary-400 size-20"></div>
      <div class="bg-secondary-500 size-20"></div>
      <div class="bg-secondary-600 size-20"></div>
      <div class="bg-secondary-700 size-20"></div>
      <div class="bg-secondary-800 size-20"></div>
      <div class="bg-secondary-900 size-20"></div>
      <div class="bg-secondary-950 size-20"></div>
    </section>

    <section class="mb-12 flex justify-center">
      <div class="size-20 bg-slate-50"></div>
      <div class="size-20 bg-slate-100"></div>
      <div class="size-20 bg-slate-200"></div>
      <div class="size-20 bg-slate-300"></div>
      <div class="size-20 bg-slate-400"></div>
      <div class="size-20 bg-slate-500"></div>
      <div class="size-20 bg-slate-600"></div>
      <div class="size-20 bg-slate-700"></div>
      <div class="size-20 bg-slate-800"></div>
      <div class="size-20 bg-slate-900"></div>
      <div class="size-20 bg-slate-950"></div>
    </section> -->
  </main>
</template>

<!-- <style scoped></style> -->
