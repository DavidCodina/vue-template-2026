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

const baseClasses = `flex flex-col gap-1.5 px-(--card-spacing) mt-(--card-spacing)`
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div data-slot="card-header" :class="cn(baseClasses, props.class)">
    <slot />
  </div>
</template>
