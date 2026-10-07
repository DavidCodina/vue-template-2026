<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref } from 'vue'
import AsyncSquare from './AsyncSquare.vue'

/* ======================
         State
====================== */

const square = ref<'Red' | 'Green' | 'Blue'>('Red')
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="mb-4 flex justify-center gap-2">
    <button class="w-20 rounded bg-red-500 px-2 py-1 text-sm text-white" @click="square = 'Red'">
      Red
    </button>
    <button
      class="w-20 rounded bg-green-500 px-2 py-1 text-sm text-white"
      @click="square = 'Green'"
    >
      Green
    </button>
    <button class="w-20 rounded bg-blue-500 px-2 py-1 text-sm text-white" @click="square = 'Blue'">
      Blue
    </button>
  </div>

  <AsyncSquare class="mx-auto rounded-xl" :square="square" />
</template>
