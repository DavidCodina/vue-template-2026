<script setup lang="ts">
import type { Component } from 'vue'

type AsProp = string | Component

withDefaults(
  defineProps<{
    as?: AsProp
  }>(),
  {
    as: 'div'
  }
)
</script>
<!-- ======================================================================

======================================================================= -->
<!-- 
This is the basic idea for a polymorphic component in Vue, but can we make 
it better? How can we get improved tyep safety?

<div class="flex justify-center gap-4">
  <AsPropDemo as="section" />
  <AsPropDemo as="article" />
  <AsPropDemo as="span" />
   <AsPropDemo :as="RouterLink" to="/about" />
</div>
-->

<template>
  <component
    :is="as"
    class="bg-primary flex size-40 items-center justify-center rounded-xl text-sm font-medium text-white shadow"
  >
    AsPropDemo
  </component>
</template>
