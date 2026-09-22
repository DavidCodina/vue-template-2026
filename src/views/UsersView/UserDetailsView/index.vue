<script setup lang="ts">
/* ======================
        Imports
====================== */

import { User } from '@lucide/vue'
import UserDetails from './components/UserDetails/index.vue'

/* ======================
      Props / Emits
====================== */

const props = defineProps<{
  id: string
}>()
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <main class="flex-1 p-6">
    <h1
      class="text-secondary dark:text-primary mb-6 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light uppercase"
    >
      _User {{ props.id }} <User class="size-[1em]" stroke-width="1" />
    </h1>

    <UserDetails :id="props.id" />
  </main>
</template>
