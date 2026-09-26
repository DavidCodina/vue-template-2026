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
    // Render toast if either field is empty.
    toast.add({
      title: 'Error!',
      description: 'Both fields must be filled.',
      color: 'error',
      ///////////////////////////////////////////////////////////////////////////
      //
      // Nuxt UI uses Iconify, which serves individual SVG icons, and it bundles the
      // Lucide collection by default: https://ui.nuxt.com/docs/getting-started/integrations/icons/nuxt
      //
      // The naming format is i-{collection}-{icon-name}:
      //
      //   - i-lucide-triangle-alert is the triangle-alert icon from the Lucide set
      //   - i-heroicons-bell would be the bell icon from Heroicons
      //   - i-simple-icons-github would be a brand icon from Simple Icons
      //
      // Nuxt UI ships with @iconify-json/lucide (and simple-icons) as dependencies, so Lucide
      // icons work out of the box and are resolved locally with no network request. You can use
      // them anywhere a component takes an icon prop (UButton, UAlert, toasts, etc.) or with the UIcon component directly:
      //
      //   <p>
      //     <UIcon name="i-lucide-triangle-alert" class="inline size-[1em]" /> Warning. Danger zone!
      //   </p>
      //
      // UIcon compiles to an <svg>, so it's not a pure CSS solution like Font Awesome where
      // you can do <i class="my-icon" />.
      //
      ///////////////////////////////////////////////////////////////////////////
      icon: 'i-lucide-triangle-alert',
      duration: 3000,
      class: '[&_[data-slot=title]]:text-red-500'
    })
    return
  }

  // ⚠️ Take parseFloat(amount.value), and round it to 2 decimal places.
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

    <form class="mt-2 space-y-4" @submit.prevent="onSubmit" novalidate>
      <div>
        <label class="text-secondary text-sm font-semibold" for="text"
          >Text<sup class="text-rose-500">*</sup></label
        >
        <input
          id="text"
          class="block w-full rounded border px-2 py-1 text-sm placeholder:italic"
          placeholder="Enter text... (e.g., Got Payed)"
          type="text"
          v-model="text"
        />
      </div>

      <div>
        <label class="text-secondary text-sm font-semibold" for="amount"
          >Amount<sup class="text-rose-500">*</sup></label
        >
        <input
          id="amount"
          class="block w-full rounded border px-2 py-1 text-sm placeholder:italic"
          placeholder="Enter amount... (e.g., 123.45)"
          type="number"
          v-model="amount"
        />
        <div class="text-muted-foreground text-xs leading-none">
          <span class="align-middle text-lg font-medium">⚠️</span>&nbsp;

          <span class="align-middle text-xl leading-none font-medium text-green-500">+</span> values
          are income,
          <span class="align-middle text-xl leading-none font-medium text-rose-500">-</span> valued
          are expenses
        </div>
      </div>

      <button
        class="bg-secondary hover:bg-primary flex w-full items-center justify-center gap-1 rounded px-2 py-1 text-sm font-semibold text-white uppercase"
      >
        <CirclePlus class="size-[1em]" /> Transaction
      </button>
    </form>
  </section>
</template>
