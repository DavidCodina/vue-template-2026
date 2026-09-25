<script setup lang="ts">
/* ======================
        Imports
====================== */

import { useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { ArrowLeft, Users, User } from '@lucide/vue'
import UserDetails from './components/UserDetails/index.vue'

/* ======================
      Composables
====================== */

const router = useRouter()
const _title = useTitle('User Page')

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
      class="text-secondary-500 dark:text-primary-500 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light uppercase"
    >
      _User {{ props.id }} <User class="size-[1em]" stroke-width="1" />
    </h1>

    <buttons
      class="text-primary hover:border-primary mx-auto mb-6 flex w-fit cursor-pointer items-center border-b border-transparent px-1 text-sm font-medium"
      @click="router.push('/users')"
    >
      <ArrowLeft :stroke-width="2.5" class="inline-block size-[1em]" />
      <Users :stroke-width="2.5" class="inline-block size-[1em]" />&nbsp;
      <span>Back to Users</span>
    </buttons>

    <UserDetails :id="props.id" />
  </main>
</template>
