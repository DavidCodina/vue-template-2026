<script setup lang="ts">
/* ======================
        Imports
====================== */

import Square from './Square.vue'

const isTrue = true
</script>

<!-- ======================================================================

======================================================================= -->
<!-- Fun Fact: Let's say that we render <StyleDemo2 class="mx-auto" /> in 
the TestView.vue SFC. The mx-auto will fall through to this file, then
fall through AGAIN to Square. That can be weird if you're not expecting it.
 

-->
<template>
  <Square :class="[{ 'bg-red-500': isTrue }, { 'rounded-3xl': isTrue }]" />
</template>
