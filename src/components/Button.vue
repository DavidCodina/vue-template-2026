<script setup lang="ts">
import { cn } from '@/utils/cn'

///////////////////////////////////////////////////////////////////////////
//
// Initially I had this as prop:
//
// handleClick: (event: MouseEvent) => void
//
// Then did @click="handleClick" in the button attributes.
// However, all of that is entirely redundant with the @click directive.
//
///////////////////////////////////////////////////////////////////////////

const props = defineProps<{
  // class as an explicit prop, not a fallthrough attribute. By declaring class?: string in defineProps,
  // you're pulling it out of $attrs and into props, which is what lets you actually read and process
  // it in your cn() call. Any incoming attribute whose name matches a declared prop gets pulled into
  // props and removed from $attrs entirely.
  class?: string
}>()

defineOptions({
  ///////////////////////////////////////////////////////////////////////////
  //
  // $attrs contains every attribute the parent passed that isn't a declared prop
  // By default (inheritAttrs: true), Vue automatically slaps all of $attrs onto your root element for you.
  // If you set this to false, you can manually bind it back with v-bind="$attrs".
  //
  // Note: automatic fallthrough only works when a component has exactly one root element in its template.
  //
  ///////////////////////////////////////////////////////////////////////////
  // inheritAttrs: false
})
</script>

<!-- ======================================================================

======================================================================= -->
<!--
Restore fallthrough for everything else while still handling class manually, 
by explicitly binding $attrs.
-->

<template>
  <button
    type="button"
    :class="
      cn(
        'inline-flex cursor-pointer justify-center rounded bg-stone-500 px-2 py-1 text-sm text-white',
        props.class
      )
    "
  >
    <!-- 
    <slot> is Vue's direct equivalent of React's children prop.
    You can do it with or without a fallback:  <slot>Click Me!</slot>
    -->
    <slot />
  </button>
</template>

<!-- <style scoped></style> -->
