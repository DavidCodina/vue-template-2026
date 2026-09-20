<script setup lang="ts">
/* ======================
        Macros
====================== */

defineSlots<{
  default(): any
}>()
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <button
    type="button"
    class="hover:bg-primary bg-secondary rounded-md border px-2 py-1 text-sm font-medium text-white"
  >
    <slot />
  </button>
</template>
