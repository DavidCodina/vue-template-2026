<script setup lang="ts">
/* ======================
      Props / Emits
====================== */

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

/* ======================
    Refs (i.e., State)
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Newer Approach:
//
//   // Note: { default: '' } is the fallback if the parent doesn't use v-model.
//   // Without it, model.value would be undefined in that case, and an input
//   // bound to undefined can behave oddly.
//   const model = defineModel<string>({ default: '' })
//   ...
//   <input v-model="model" />
//
// The component uses defineModel<string>() (stable since Vue 3.4),
// so v-model="name" in the parent works the same as before.
// defineModel is what lets the parent's v-model reach the <input> inside your component.
// For a component, v-model is just shorthand for two things:
//
//   <BaseInput :modelValue="name" @update:modelValue="name = $event" />
//
// So this Input component has to do two jobs:
//
//   1. Receive the current value from the parent, as a prop called modelValue.
//   2. Tell the parent when the user types, by emitting an update:modelValue event.
//
// What IT Replaces:
//
// Before defineModel (Vue 3.4), you wrote all of that by hand.
//
//   const props = defineProps<{ modelValue: string }>()
//   const emit = defineEmits<{ 'update:modelValue': [value: string] }>()
//   ...
//   <input
//     :value="props.modelValue"
//     @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
//   />
//
// defineModel does all of it in one line:
//
//   const model = defineModel<string>({ default: '' })
//
// What model is
//
// model is a ref that acts as a two-way pipe to the parent:
//
//   - Reading model.value gives you the parent's current value (name).
//   - Writing model.value = 'x' automatically emits update:modelValue, which updates the parent's name.
//
// That's why <input v-model="model" /> works inside the component. When the user types, the input writes
// to model, and model passes the change up to the parent.
//
///////////////////////////////////////////////////////////////////////////
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <!-- <input v-model="model" /> -->
  <input
    :value="props.modelValue"
    @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
