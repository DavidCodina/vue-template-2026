<script setup lang="ts">
/* ======================
        Imports
====================== */

import { useTitle } from '@vueuse/core'
import { CircleDollarSign } from '@lucide/vue'

import Page from '@/components/Page.vue'
import PageContainer from '@/components/PageContainer.vue'
import ExpenseTracker from './ExpenseTracker/index.vue'

/* ======================
      Composables
====================== */

const _title = useTitle('Expense Tracker')
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <Page>
    <PageContainer>
      <h1
        class="text-secondary-500 dark:text-primary-500 mb-6 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light uppercase"
      >
        _Expense Tracker <CircleDollarSign class="size-[1em]" stroke-width="1" />
      </h1>

      <ExpenseTracker />
    </PageContainer>
  </Page>
</template>

<!-- <style scoped></style> -->
