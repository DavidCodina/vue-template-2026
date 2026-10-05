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

const baseClasses = `px-(--card-spacing) my-(--card-spacing)`
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div data-slot="card-content" :class="cn(baseClasses, props.class)">
    <slot />
  </div>
</template>
