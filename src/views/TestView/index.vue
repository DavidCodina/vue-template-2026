<!--
To do:
1. Render some kind of CRUD
2. Create Page and PageContainer components
-->

<script setup lang="ts">
/* ======================
        Imports
====================== */

// https://lucide.dev/guide/vue/getting-started
import { FlaskConical } from '@lucide/vue'
// import PropsDemo from './PropsDemo.vue'
// import DirectivesDemo from './DirectivesDemo.vue'
// import LifecycleHooksDemo from './LifecycleHooksDemo/index.vue'
// import ClickCounter from '../components/ClickCounter.vue'
// import AppStoreDemo from './AppStoreDemo.vue'

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

// ...

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
Event Handlers / Functions
====================== */

// ...

/* ======================
     Lifecycle Hooks
====================== */

// ...

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

    <!-- <PropsDemo class="mx-auto" name="David" :age="48" is-online /> -->
    <!-- <DirectivesDemo /> -->
    <!-- <LifecycleHooksDemo /> -->
    <!-- <AppStoreDemo /> -->
  </main>
</template>

<!-- <style scoped></style> -->
