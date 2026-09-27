<script setup lang="ts">
/* ======================
        Imports
====================== */

import type { HTMLAttributes } from 'vue'
import { cn } from '@/utils/cn'

/* ======================
      Props / Emits
====================== */

const props = defineProps<{
  // class as an explicit prop, not a fallthrough attribute. By declaring class?: string in defineProps,
  // you're pulling it out of $attrs and into props, which is what lets you actually read and process
  // it in your cn() call. Any incoming attribute whose name matches a declared prop gets pulled into
  // props and removed from $attrs entirely.

  // ❌ class?: string - This will prohibit :class.
  class?: HTMLAttributes['class']
}>()

// Note: On the consuming side if one passes class + :class,
// Vue will merge them into props.class before it's read here.
// console.log('class:', props.class)
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div :class="cn('size-50 rounded-xl bg-pink-500', props.class)" />
</template>
