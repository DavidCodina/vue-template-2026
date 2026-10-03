<script setup lang="ts">
/* ======================
        Imports
====================== */

import { cn } from '@/utils/cn'
import type { HTMLAttributes } from 'vue'

/* ======================
      Props / Emits
====================== */

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div
    data-slot="page-container"
    :class="cn(`relative mx-auto w-full flex-1 overflow-x-auto p-6 2xl:container`, props.class)"
  >
    <slot />
  </div>
</template>
