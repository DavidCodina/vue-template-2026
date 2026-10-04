<script setup lang="ts">
/* ======================
        Imports
====================== */

import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { FlaskConical } from '@lucide/vue'
import Page from '@/components/Page.vue'
import PageContainer from '@/components/PageContainer.vue'
import Monitor from '@/components/Monitor/index.vue'

import RetroBG from './retro.png'
import RetroText from './text.png'

/* ======================
     Composables 
====================== */

const route = useRoute()

/* ======================
      Props / Emits
====================== */

const props = defineProps<{
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
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <Page>
    <PageContainer>
      <h1
        class="mb-6 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light text-red-700 uppercase"
      >
        _Test {{ props.id }} <FlaskConical class="size-[1em]" stroke-width="1" />
      </h1>

      <div
        class="relative flex aspect-8/5 items-center justify-center rounded-2xl border-2 border-red-700 bg-[floralWhite]/95 bg-contain bg-position-[50%_0px] bg-no-repeat"
        :style="{ backgroundImage: `url(${RetroBG})` }"
      >
        <img class="absolute -top-2 left-[7dvw] w-[10dvw]" :src="RetroText" alt="text" />"
        <!-- Gotcha: Previosuly, I was interpolating this: JSON.stringify($route, null, 2)
        It worked fine in development, but when I deployed to GitHub Pages and pressed the
        monitor button, this happened - TypeError: Converting circular structure to JSON. -->

        <Monitor
          class="relative -bottom-40 w-[50vw] max-w-150 min-w-100 sm:-bottom-20 md:bottom-auto md:-mb-6 lg:-mb-10 xl:-mb-40"
        >
          Requested route information...<br /><br />

          {{ JSON.stringify(routeInfo, null, 2) }}
        </Monitor>
      </div>
    </PageContainer>
  </Page>
</template>

<!-- <style scoped></style> -->
