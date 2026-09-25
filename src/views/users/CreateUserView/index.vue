<script setup lang="ts">
/* ======================
        Imports
====================== */

import { useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { UserRoundPlus, ArrowLeft, Users } from '@lucide/vue'
import CreateUserForm from './components/CreateUserForm/index.vue'

/* ======================
      Composables
====================== */

const _title = useTitle('Create User')
const router = useRouter()
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <main class="flex-1 p-6">
    <h1
      class="text-secondary dark:text-primary flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light uppercase"
    >
      _Create User <UserRoundPlus class="size-[1em]" stroke-width="1" />
    </h1>

    <buttons
      class="text-primary hover:border-primary mx-auto mb-6 flex w-fit cursor-pointer items-center border-b border-transparent px-1 text-sm font-medium"
      @click="router.push('/users')"
    >
      <ArrowLeft :stroke-width="2.5" class="inline-block size-[1em]" />
      <Users :stroke-width="2.5" class="inline-block size-[1em]" />&nbsp;
      <span>Back to Users</span>
    </buttons>

    <CreateUserForm />
  </main>
</template>
