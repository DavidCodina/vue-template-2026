<script setup lang="ts">
/* ======================
        Imports
====================== */

import { onMounted, ref, useTemplateRef } from 'vue'
import { sleep } from '@/utils/sleep'
import Select from './index.vue'

/* ======================
    Refs (i.e., State)
====================== */

const selectValue = ref('')
const selectOptions = ref<{ value: string; label: string }[]>([
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' }
])

/* ======================
     Template Refs
====================== */

const SelectComponentRef = useTemplateRef<InstanceType<typeof Select>>('SelectComponentRef')

/* ======================
     Lifecycle Hooks
====================== */

onMounted(async () => {
  try {
    await sleep(1500)
    console.log(SelectComponentRef.value?.$el) // => <div ... />
    console.log(SelectComponentRef.value?.selectRef) // => <select ... />
  } catch (_err) {
    // ...
  }
})
</script>

<!-- ======================================================================

======================================================================= -->
<!-- v-model="selectValue" is shorthand for:

  :modelValue="selectValue"
  @update:modelValue="(v) => (selectValue = v)"
-->

<template>
  <div>
    <Select
      ref="SelectComponentRef"
      :groupProps="{
        class: 'mx-auto mb-4 max-w-150'
      }"
      :selectProps="{
        // Alternative when you need to pass custom logic within onChange (i.e., @change).
        // onChange: (e: Event) => {
        //   const target = e.target as HTMLSelectElement
        //   selectValue = target.value
        // },
        //
        // value: selectValue
      }"
      placeholder="Choose A Fruit..."
      :options="selectOptions"
      v-model="selectValue"
    />
    <div class="text-primary text-center text-lg font-semibold">
      Select Value: <span class="font-mono text-pink-500">{{ selectValue }}</span>
    </div>
  </div>
</template>
