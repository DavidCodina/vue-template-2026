<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref } from 'vue'
import { CirclePlus } from '@lucide/vue'

const toast = useToast()

/* ======================
    Refs (i.e., State)
====================== */

const text = ref<string>('')
const amount = ref<string>('')

/* ======================
      Props / Emits
====================== */

const emit = defineEmits(['transactionSubmitted'])

/* ======================
Event Handlers / Functions
====================== */

const onSubmit = () => {
  if (!text.value || !amount.value) {
    // Display a toast error message if either field is empty

    toast.add({
      title: 'Error!',
      description: 'Both fields must be filled.',
      color: 'error',
      icon: 'i-lucide-triangle-alert',
      duration: 3000,
      class: '[&_[data-slot=title]]:text-red-500'
    })
    return
  }

  // ⚠️ Ttake parseFloat(amount.value), and round it to 2 decimal places.
  const transactionData = {
    text: text.value,
    amount: parseFloat(amount.value)
  }

  emit('transactionSubmitted', transactionData)

  text.value = ''
  amount.value = ''
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section>
    <h3 class="text-secondary text-lg font-bold uppercase">
      <CirclePlus class="mr-0.5 inline size-[1em] align-middle" />
      <span class="align-middle">Transaction</span>
    </h3>

    <form id="form" @submit.prevent="onSubmit" novalidate>
      <div class="mb-4">
        <label class="text-secondary text-sm font-semibold" for="text"
          >Text <sup class="text-rose-500">*</sup></label
        >
        <input
          id="text"
          class="block w-full rounded border px-2 py-1 text-sm placeholder:italic"
          type="text"
          placeholder="Enter text..."
          v-model="text"
        />
      </div>

      <div class="mb-4">
        <label class="text-secondary text-sm font-semibold" for="amount"
          >Amount <sup class="text-rose-500">*</sup></label
        >
        <input
          id="amount"
          class="block w-full rounded border px-2 py-1 text-sm placeholder:italic"
          type="number"
          placeholder="Enter amount..."
          v-model="amount"
        />
        <div class="text-muted-foreground text-xs leading-none">
          <span class="align-middle text-lg font-medium">⚠️</span>&nbsp;

          <span class="align-middle text-xl leading-none font-medium text-green-500">+</span> values
          indicate income,
          <span class="align-middle text-xl leading-none font-medium text-rose-500">-</span> valued
          indicate expenses.
        </div>
      </div>
      <button
        class="bg-secondary hover:bg-primary block w-full rounded px-2 py-1 text-sm font-semibold text-white uppercase"
      >
        <CirclePlus class="inline size-[1em]" /> Transaction
      </button>
    </form>
  </section>
</template>
