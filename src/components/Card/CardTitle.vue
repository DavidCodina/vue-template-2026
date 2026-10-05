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

/* ======================
      Variables
====================== */

const baseClasses = `font-semibold`
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div data-slot="card-title" :class="cn(baseClasses, props.class)">
    <slot />
  </div>
</template>
