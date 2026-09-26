<script setup lang="ts">
/* ======================
        Imports
====================== */

import { useTitle } from '@vueuse/core'
import { CircleDollarSign } from '@lucide/vue'

import ExpenseTracker from './ExpenseTracker/index.vue'
/* ======================
      Composables
====================== */

const _title = useTitle('Expense Tracker')
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <main class="flex-1 p-6">
    <h1
      class="text-secondary-500 dark:text-primary-500 mb-6 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light uppercase"
    >
      _Expense Tracker <CircleDollarSign class="size-[1em]" stroke-width="1" />
    </h1>

    <ExpenseTracker />
  </main>
</template>

<!-- <style scoped></style> -->
