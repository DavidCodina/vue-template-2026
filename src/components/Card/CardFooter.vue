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

const baseClasses = `flex items-center justify-center px-(--card-spacing) mb-(--card-spacing) gap-2`
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div data-slot="card-footer" :class="cn(baseClasses, props.class)">
    <slot />
  </div>
</template>
