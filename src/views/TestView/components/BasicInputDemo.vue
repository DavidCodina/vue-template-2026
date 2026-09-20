<script setup lang="ts">
import { ref } from 'vue'

const inputValue = ref('')

// const setValue = (event: Event) => {
//   // Or do: (event: Event & { target: HTMLInputElement })
//   const value = (event.target as HTMLInputElement).value
//   inputValue.value = value
// }
</script>

<!-- ======================================================================

======================================================================= -->
<!-- Why not use v-on:input? 

Maximilian uses v-on:input in his Udemy course in section 2.26.

  <input
    class="bg-card w-full rounded-lg border px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
    placeholder="Type something..."
    type="text"
    :value="inputValue"
    v-on:input="inputValue = ($event.target as HTMLInputElement).value"
  />

v-on:input (or @input) is the lower-level event binding — it just listens for the native 
input event and lets you write the handler yourself.

  :value="inputValue" :binds the input's displayed value to state (the "state → input" direction).

  v-on:input="inputValue = ($event.target as HTMLInputElement).value" / v-on:input="setValue" :
  listens for the native input event and writes the new value back into state (the "input → state" direction).
  One TypeScript wrinkle: $event.target is typed as EventTarget by default, which doesn't have a .value property, 
  so cast it to HTMLInputElement. If you were in plain .vue without lang="ts", you could just write 
  $event.target.value with no cast needed.

v-model is syntactic sugar that combines that event listener and the value binding into one directive. 
When you write v-model="inputValue", Vue compiles it down to essentially that same :value + @input pair automatically. 
So functionally they end up doing the same thing — v-model just saves you the boilerplate.

Tutorials often teach v-on:input first specifically to show you how two-way binding works under the hood before introducing 
v-model as the shortcut.
-->

<template>
  <div class="mx-auto my-12 max-w-sm space-y-2">
    <input
      class="bg-card w-full rounded-lg border px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      placeholder="Type something..."
      type="text"
      v-model="inputValue"
    />
    <div class="text-muted-foreground text-sm">
      You typed: <span class="font-medium">{{ inputValue }}</span>
    </div>
  </div>
</template>
