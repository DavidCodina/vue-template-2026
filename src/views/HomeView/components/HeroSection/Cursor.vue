<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const visible = ref(true)
let timer: NodeJS.Timeout | undefined = undefined

onMounted(() => {
  timer = setInterval(() => {
    visible.value = !visible.value
  }, 450)
})

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<!-- ======================================================================

======================================================================= -->
s
<template>
  <div
    aria-hidden="true"
    class="bg-primary inline-block h-4.5 w-2.5 align-middle transition-opacity duration-450 ease-in-out"
    :class="visible ? 'opacity-100' : 'opacity-0'"
  />
</template>
