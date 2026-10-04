<script setup lang="ts">
/* ======================
        Imports
====================== */

import Button from '@/components/Button/index.vue'
import { useSharedCounter } from './useSharedCounter'
// import { useCounter } from './useCounterContext'

/* ======================
       Composables
====================== */

const { count, increment } = useSharedCounter()
// const { count, increment } = useCounter()
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <Button @click="increment" color="primary">Clicks: {{ count }}</Button>
</template>
