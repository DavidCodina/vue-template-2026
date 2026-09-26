<script setup lang="ts">
import { computed } from 'vue'
import { ThumbsDown, ThumbsUp } from '@lucide/vue'
import { formatter } from '../utils/formatter'

const props = defineProps<{
  income: number
  expenses: number
}>()

/* ======================
      Computed
====================== */

const formattedIncome = computed(() => formatter.format(props.income))
const formattedExpenses = computed(() => formatter.format(props.expenses))
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section class="flex justify-between">
    <div class="">
      <h3 class="text-secondary text-lg font-bold uppercase">
        <ThumbsUp class="mr-0.5 inline size-[1em] align-middle" />

        <span class="align-middle">Income</span>
      </h3>
      <p class="text-left text-lg font-semibold text-green-500">{{ formattedIncome }}</p>
    </div>

    <div>
      <h3 class="text-secondary text-lg font-bold uppercase">
        <ThumbsDown class="mr-0.5 inline size-[1em] align-middle" />
        <span class="align-middle">Expense</span>
      </h3>
      <p class="text-right text-lg font-semibold text-rose-500">{{ formattedExpenses }}</p>
    </div>
  </section>
</template>
