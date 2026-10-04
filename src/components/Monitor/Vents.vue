<script setup lang="ts"></script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="flex flex-col gap-1">
    <div
      v-for="i in 4"
      :key="i"
      class="h-1 w-14 rounded-full"
      style="
        background: #6f6753;
        box-shadow:
          0 1px 0 rgba(255, 255, 255, 0.6),
          inset 0 1px 2px #000;
      "
    />
  </div>
</template>
