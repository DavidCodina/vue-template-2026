<script setup lang="ts">
/* ======================
      Props / Emits
====================== */

defineProps<{
  label: string
}>()
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="flex flex-col items-center gap-1">
    <div
      class="h-6 w-6 rounded-full"
      style="
        background: conic-gradient(from 20deg, #cfc6ad, #8f866c, #e9e1cc, #8f866c, #cfc6ad);
        box-shadow:
          0 2px 3px rgba(0, 0, 0, 0.5),
          inset 0 0 0 2px #a69d83;
      "
    />
    <span
      class="text-[9px] font-semibold"
      style="color: #6f6753; font-family: ui-sans-serif, system-ui"
    >
      {{ label }}
    </span>
  </div>
</template>
