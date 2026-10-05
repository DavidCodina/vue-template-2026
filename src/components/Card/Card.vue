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

// https://ui.aceternity.com/tools/box-shadows
const aestheicShadow = `shadow-[0_3px_10px_rgb(0,0,0,0.2)]`

const baseClasses = `
[--card-spacing:calc(var(--spacing)*6)]
flex flex-col bg-card rounded-xl border overflow-hidden
${aestheicShadow}
`
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div data-slot="card" :class="cn(baseClasses, props.class)">
    <slot />
  </div>
</template>
