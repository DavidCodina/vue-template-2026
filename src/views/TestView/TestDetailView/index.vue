<script setup lang="ts">
/* ======================
        Imports
====================== */

import {
  computed,
  // onMounted,
  watch
} from 'vue'
import { useRoute } from 'vue-router'

import Page from '@/components/Page.vue'
import PageContainer from '@/components/PageContainer.vue'
import Monitor from '@/components/Monitor/index.vue'

import RetroBG from './retro.png'
import RetroText from './text.png'

import Button from '@/components/Button/index.vue'

/* ======================
     Composables 
====================== */

const route = useRoute()

/* ======================
      Props / Emits
====================== */

const _props = defineProps<{
  id: string
}>()

/* ======================
      Computed
====================== */

const routeInfo = computed(() => ({
  fullPath: route.fullPath,
  hash: route.hash,
  matched: route.matched.map(({ path, name, meta, props }) => ({ path, name, meta, props })),
  meta: route.meta,
  name: route.name,
  path: route.path,
  params: route.params,
  query: route.query
}))

/* ======================
        Lifecycle
====================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Gotcha: If you're on /test/:id (e.g., /test/123) and you navigate to the same route
// using a different :id (e.g., /test/456), the route will be updated, but the component
// will not rerun the onMounted() lifecycle hook.
//
//   onMounted(async () => {
//     console.log(`The route is: ${route.path}`)
//   })
//
// To be clear, certain things will change like this <h1>: <h1>_Test {{ props.id }}</h1>,
// but crucially the component is not being re-mounted. In such cases, what we actually need is a watcher.
//
///////////////////////////////////////////////////////////////////////////

/* ======================
        Watchers
====================== */

watch(
  ///////////////////////////////////////////////////////////////////////////
  //
  // Here we can't pass route.params.id. We need to add a getter function.
  // Reactivity in Vue works by tracking property access that happens inside an effect.
  // watch needs to run your source expression itself, inside its own tracking effect,
  // so it can record which reactive properties were read and re-run the callback when they change.
  //
  // If you write just route.params.id, JavaScript evaluates route.params.id before watch is even called.
  // By the time watch receives it, it's just a plain string like "42". The reactive read happened outside
  // any effect, nothing was tracked, and watch has no way to know where the value came from. Vue will
  // warn about an invalid watch source. With a getter:
  //
  //   () => route.params.id
  //
  // You pass a function that hasn't run yet. watch calls it inside its tracking effect, so the read of
  // route.params.id is recorded as a dependency. When that property changes, Vue re-runs the getter,
  // compares the result to the previous value, and calls your callback if it differs.
  //
  ///////////////////////////////////////////////////////////////////////////
  () => route.params.id,
  (newValue, oldValue) => {
    if (typeof oldValue === 'undefined') {
      console.log(`Watcher called for the first time for ${oldValue}`)
    } else {
      console.log(`Watcher called again. The route changed from ${oldValue} to ${newValue}`)
    }
  },
  { immediate: true }
)
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <Page>
    <PageContainer>
      <!-- 
      <h1 class="mb-6 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light text-red-700 uppercase">
        Test {{ props.id }} <FlaskConical class="size-[1em]" stroke-width="1" />
      </h1>
      -->

      <Button class="mx-auto flex w-fit" to="/test/xyz">Go To /test/xyz</Button>

      <div
        class="relative mt-10 flex aspect-8/5 items-center justify-center rounded-2xl border-2 border-red-700 bg-[floralWhite]/95 bg-contain bg-position-[50%_0px] bg-no-repeat"
        :style="{ backgroundImage: `url(${RetroBG})` }"
      >
        <img class="absolute -top-2 left-[7dvw] w-[10dvw]" :src="RetroText" alt="text" />
        <!-- Gotcha: Previosuly, I was interpolating this: JSON.stringify($route, null, 2)
        It worked fine in development, but when I deployed to GitHub Pages and pressed the
        monitor button, this happened - TypeError: Converting circular structure to JSON. -->

        <Monitor
          class="relative -bottom-40 w-[50vw] max-w-150 min-w-100 sm:-bottom-20 md:-mb-6 lg:bottom-auto lg:-mb-10 xl:-mb-40"
        >
          Requested route information...<br /><br />

          {{ JSON.stringify(routeInfo, null, 2) }}
        </Monitor>
      </div>
    </PageContainer>
  </Page>
</template>

<!-- <style scoped></style> -->
