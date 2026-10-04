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
        class="text-secondary-500 dark:text-primary-500 mb-6 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light uppercase"
      >
        _Test {{ props.id }} <FlaskConical class="size-[1em]" stroke-width="1" />
      </h1>

      <!-- Gotch: Previosuly, I was interpolating this: JSON.stringify($route, null, 2)
      It worked fine in development, but when I deployed to GitHub Pages and pressed the
      monitor button, this happened - TypeError: Converting circular structure to JSON. -->

      <Monitor class="mx-auto mt-24 max-w-150">
        Requested route information...<br /><br />

        {{ JSON.stringify(routeInfo, null, 2) }}
      </Monitor>
    </PageContainer>
  </Page>
</template>

<!-- <style scoped></style> -->
