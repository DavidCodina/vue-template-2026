<script setup lang="ts">
/* ======================
        Imports
====================== */

// https://lucide.dev/guide/vue/getting-started
import { FlaskConical } from '@lucide/vue'

import Page from '@/components/Page.vue'
import PageContainer from '@/components/PageContainer.vue'

/* ======================
      Props / Emits
====================== */

const props = defineProps<{
  id: string
}>()
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
    </PageContainer>
  </Page>
</template>

<!-- <style scoped></style> -->
