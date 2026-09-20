<script setup lang="ts">
/* ======================
        Imports
====================== */

import { CircleDollarSign, Trash } from '@lucide/vue'
import { formatter } from '../utils/formatter'

/* ======================
      Props / Emits
====================== */

defineProps<{
  transactions: Array<{
    id: number
    text: string
    amount: number
  }>
}>()

const emit = defineEmits(['transactionDeleted'])

/* ======================
Event Handlers / Functions
====================== */

const deleteTransaction = (id: number) => {
  emit('transactionDeleted', id)
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section>
    <h3 class="text-secondary text-lg font-bold uppercase">
      <CircleDollarSign class="mr-0.5 inline size-[1em] align-middle" />

      <span class="align-middle">History</span>
    </h3>
    <ul v-if="transactions.length">
      <li v-for="transaction in transactions" :key="transaction.id">
        <div
          class="mb-2 grid grid-cols-[3fr_1fr_auto] gap-2 p-0 text-sm"
          :class="transaction.amount < 0 ? 'text-red-500' : 'text-green-500'"
        >
          <span class="flex items-center">{{ transaction.text }}</span>
          <span class="flex items-center">{{ formatter.format(transaction.amount) }}</span>

          <button
            aria-label="Delete Transaction"
            class="text-muted-foreground/50 flex items-center rounded text-sm hover:text-rose-500"
            @click="deleteTransaction(transaction.id)"
          >
            <Trash class="size-6" />
          </button>
        </div>
      </li>
    </ul>

    <p v-else class="text-muted-foreground text-sm italic">No transactions yet. Add one below.</p>
  </section>
</template>
