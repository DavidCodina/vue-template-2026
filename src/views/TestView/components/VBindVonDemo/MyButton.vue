<script setup lang="ts">
defineProps<{
  label?: string
}>()
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <button>
    <slot>{{ label }}</slot>
  </button>
</template>
