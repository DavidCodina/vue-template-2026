<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref } from 'vue'

// https://lucide.dev/guide/vue/getting-started
import {} from '@lucide/vue'
import Input from './Input.vue'

/* ======================
    Refs (i.e., State)
====================== */

const name = ref<string>('')

/* ======================
Event Handlers / Functions
====================== */

const onSubmit = () => {
  const nameValue = name.value

  console.log(nameValue)
  alert(`Hello ${nameValue}!`)

  // Clear All Fields
  name.value = ''
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div>
    <form
      class="bg-card mx-auto max-w-150 rounded-lg border p-4 shadow"
      @submit.prevent="onSubmit"
      novalidate
    >
      <div class="mb-4">
        <label class="text-secondary cursor-pointer text-sm font-semibold select-none" for="name"
          >Name</label
        >
        <!-- 
        Note: for a component, v-model is just shorthand for two things:

          :modelValue="name" 
          @update:modelValue="name = $event" 
        -->

        <Input
          id="name"
          class="block w-full rounded border px-2 py-1 text-sm placeholder:italic"
          placeholder="Full Name..."
          type="text"
          v-model="name"
        />
      </div>

      <button
        class="bg-secondary hover:bg-primary flex w-full items-center justify-center gap-1 rounded px-2 py-1 text-sm font-semibold text-white uppercase"
      >
        Submit
      </button>
    </form>
  </div>
</template>
