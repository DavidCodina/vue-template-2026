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
  <main
    data-slot="page"
    :class="
      cn(`relative mx-auto flex min-h-dvh w-full flex-1 flex-col overflow-hidden`, props.class)
    "
  >
    <slot />
  </main>
</template>
