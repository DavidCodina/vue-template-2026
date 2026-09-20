<script setup lang="ts">
/* ======================
        Imports
====================== */

import { computed } from 'vue'
import { Scale } from '@lucide/vue'
import { formatter } from '../utils/formatter'

/* ======================
      Props / Emits
====================== */

const props = defineProps<{
  total: number
}>()

/* ======================
      Computed
====================== */

const formattedTotal = computed(() => formatter.format(props.total))
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section>
    <h3 class="text-secondary text-lg font-bold uppercase">
      <Scale class="mr-0.5 inline size-[1em] align-middle" />
      <span class="align-middle">Balance</span>
    </h3>
    <p
      class="text-lg font-semibold"
      :class="{ 'text-green-500': total >= 0, 'text-rose-500': total < 0 }"
    >
      {{ formattedTotal }}
    </p>
  </section>
</template>
