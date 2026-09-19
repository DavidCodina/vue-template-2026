<script setup lang="ts">
/* ======================
        Imports
====================== */

import { inject } from 'vue'
import { injectionKey } from './keys'

/* ======================
    Provide / Inject
====================== */

const value = inject(injectionKey)

if (!value) {
  throw new Error('The list must be rendered inside a component that provides the value.')
}
</script>

<template>
  <ul class="text-secondary list-disc text-sm">
    <li v-for="item in value" :key="item">{{ item }}</li>
  </ul>
</template>
