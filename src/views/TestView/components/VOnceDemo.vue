<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref } from 'vue'
import { RefreshCwOff } from '@lucide/vue'

/* ======================
    Refs (i.e., State)
====================== */

const count = ref(0)
const timestamp = ref(new Date().toLocaleTimeString())

/* ======================
Event Handlers / Functions
====================== */

function increment() {
  count.value++
  timestamp.value = new Date().toLocaleTimeString()
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="bg-card mx-auto mt-10 max-w-md space-y-6 rounded-xl border p-6 shadow">
    <h1 class="text-primary text-xl font-bold">v-once Demo</h1>

    <button
      @click="increment"
      class="bg-secondary hover:bg-primary w-full cursor-pointer rounded-lg px-3 py-1.5 text-sm text-white transition"
    >
      Increment ({{ count }})
    </button>

    <div class="grid grid-cols-1 gap-4">
      <!-- Normal binding: updates every time -->
      <div class="bg-card dark:bg-primary/15 border-primary rounded-lg border p-4">
        <p class="text-primary text-sm font-medium">
          Reactive (normal) <span class="text-3xl">☀️</span>
        </p>
        <p class="text-primary font-mono text-lg">{{ count }} <span class="text-3xl">🏝️</span></p>
        <p class="text-primary text-xs">{{ timestamp }} <span class="text-3xl">🏝️</span></p>
      </div>

      <!-- 
      When v-once is used, the HTML is rendered once, then frozen forever! 

      What's happening?
      
        - v-once tells Vue to render that element (and its children) exactly once, 
          then skip it on all future re-renders — even though count and timestamp are reactive refs.

        - The top box re-renders every time count changes, because it's a normal binding.

        - The bottom box captures whatever count and timestamp were at first render and never updates again, 
          no matter how many times you click.
      
      Why use it?
      
        v-once is a performance optimization for content that's expensive to render but truly static after the initial paint 
        — e.g., a rendered Markdown blob, a large static list, or content based on props that never change after mount. 
        Vue skips the diffing/patching work for that subtree entirely on subsequent updates.

      A couple of things worth knowing:

        - It only affects the initial mount's output — if you need something to update once and then stop, v-once is right; 
        if you need it to react to a specific condition, look at v-memo instead (lets you specify dependencies to control 
        re-renders more precisely).

        - It applies to the whole subtree under the element it's placed on, so nested reactive bindings inside a v-once 
        block are all frozen too.


      -->
      <div
        class="group relative rounded-lg border border-sky-500 bg-sky-100 p-4 dark:bg-sky-100/15"
        v-once
      >
        <p class="text-sm font-medium text-sky-500">
          Frozen (v-once) <span class="text-3xl">🥶 ❄️❄️❄️</span>
        </p>
        <p class="font-mono text-lg text-sky-500">{{ count }} <span class="text-3xl">🧊</span></p>
        <p class="text-xs text-sky-500">{{ timestamp }} <span class="text-3xl">🧊</span></p>

        <RefreshCwOff
          class="absolute top-[calc(50%+10px)] left-1/2 hidden size-10 -translate-x-1/2 -translate-y-1/2 text-rose-500 group-hover:block"
          :strokeWidth="2.5"
        />
      </div>
    </div>

    <p class="text-sm text-gray-500">
      <span class="text-3xl">🧐</span> When the button is clicked, the top box updates, the bottom
      box never changes again after its first render.
    </p>
  </div>
</template>
