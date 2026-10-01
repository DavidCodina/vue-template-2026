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
import { FlaskConical, CircleCheck } from '@lucide/vue'
import { onMounted } from 'vue'
import { sleep } from '@/utils/sleep'

import Button2 from '@/components/Button2/index.vue'

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

///////////////////////////////////////////////////////////////////////////
//
// Similar to this:
//
//   export const selectElementRef = ref<HTMLSelectElement | null>(null)
//
//   const setSelectElement: VNodeRef = (el) => {
//     selectElementRef.value = el instanceof HTMLSelectElement ? el : null
//   }
//
///////////////////////////////////////////////////////////////////////////

// const [selectElementRef, setSelectElement] = useCreateRef<HTMLSelectElement>()

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
    await sleep(1500)

    // console.log('TestView.vue mounted!')
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
      class="text-secondary-500 dark:text-primary-500 mb-6 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light uppercase"
    >
      _Test <FlaskConical class="size-[1em]" stroke-width="1" />
    </h1>

    <div class="mb-4 flex justify-center gap-2">
      <Button2 color="primary">Click Me</Button2>

      <Button2 color="secondary" label="Click Here" />
      <Button2 color="success">Click Me</Button2>
      <Button2 color="info">Click Me</Button2>
      <Button2 color="warning">Click Me</Button2>
      <Button2 color="error">Click Me</Button2>
      <Button2 color="neutral">Click Me</Button2>
    </div>

    <div class="mb-4 flex justify-center gap-2">
      <Button2 color="primary" variant="outline">Click Me</Button2>
      <Button2 color="secondary" variant="outline">Click Me</Button2>
      <Button2 color="success" variant="outline">Click Me</Button2>
      <Button2 color="info" variant="outline">Click Me</Button2>
      <Button2 color="warning" variant="outline">Click Me</Button2>
      <Button2 color="error" variant="outline">Click Me</Button2>
      <Button2 color="neutral" variant="outline">Click Me</Button2>
    </div>

    <div class="mb-4 flex justify-center gap-2">
      <Button2 color="primary" variant="soft">Click Me</Button2>
      <Button2 color="secondary" variant="soft">Click Me</Button2>
      <Button2 color="success" variant="soft">Click Me</Button2>
      <Button2 color="info" variant="soft">Click Me</Button2>
      <Button2 color="warning" variant="soft">Click Me</Button2>
      <Button2 color="error" variant="soft">Click Me</Button2>
      <Button2 color="neutral" variant="soft">Click Me</Button2>
    </div>

    <div class="mb-4 flex justify-center gap-2">
      <Button2 color="primary" variant="subtle">Click Me</Button2>
      <Button2 color="secondary" variant="subtle">Click Me</Button2>
      <Button2 color="success" variant="subtle">Click Me</Button2>
      <Button2 color="info" variant="subtle">Click Me</Button2>
      <Button2 color="warning" variant="subtle">Click Me</Button2>
      <Button2 color="error" variant="subtle">Click Me</Button2>
      <Button2 color="neutral" variant="subtle">Click Me</Button2>
    </div>

    <div class="mb-4 flex justify-center gap-2">
      <Button2 color="primary" variant="ghost">Click Me</Button2>
      <Button2 color="secondary" variant="ghost">Click Me</Button2>
      <Button2 color="success" variant="ghost">Click Me</Button2>
      <Button2 color="info" variant="ghost">Click Me</Button2>
      <Button2 color="warning" variant="ghost">Click Me</Button2>
      <Button2 color="error" variant="ghost">Click Me</Button2>
      <Button2 color="neutral" variant="ghost">Click Me</Button2>
    </div>

    <div class="mb-4 flex justify-center gap-2">
      <Button2 color="primary" variant="link">Click Me</Button2>
      <Button2 color="secondary" variant="link">Click Me</Button2>
      <Button2 color="success" variant="link">Click Me</Button2>
      <Button2 color="info" variant="link">Click Me</Button2>
      <Button2 color="warning" variant="link">Click Me</Button2>
      <Button2 color="error" variant="link">Click Me</Button2>
      <Button2 color="neutral" variant="link">Click Me</Button2>
    </div>

    <div class="mb-4 flex items-center justify-center gap-2">
      <Button2 color="primary" size="xs">Click Me</Button2>
      <Button2 color="secondary" size="sm">Click Me</Button2>
      <Button2 color="success" size="md">Click Me</Button2>
      <Button2 color="info" size="lg">Click Me</Button2>
      <Button2 color="warning" size="xl">Click Me</Button2>
      <Button2
        color="error"
        size="xl"
        loading
        :ui="{
          leadingIcon: ''
        }"
        >Click Me</Button2
      >

      <Button2
        color="neutral"
        size="xl"
        :ui="{
          leadingIcon: 'border-2 border-blue-500'
        }"
      >
        <template #leading="{ ui }">
          <CircleCheck
            data-slot="leadingIcon"
            loading
            aria-hidden="true"
            :class="ui.leadingIcon()"
          />
        </template>

        Click Me
      </Button2>
    </div>

    <!-- <UButton icon="i-lucide-rocket" size="md" color="primary" variant="solid"> Button </UButton> -->
  </main>
</template>

<!-- <style scoped></style> -->
