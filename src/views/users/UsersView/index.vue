<script setup lang="ts">
/* ======================
        Imports
====================== */

import { useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { Users, UserRoundPlus } from '@lucide/vue'
import UserList from './components/UserList/index.vue'

/* ======================
      Composables
====================== */

const _title = useTitle('Users Page')

const router = useRouter()
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <main class="flex-1 p-6">
    <h1
      class="text-secondary-500 dark:text-primary-500 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light uppercase"
    >
      _Users <Users class="size-[1em]" stroke-width="1" />
    </h1>

    <buttons
      class="text-primary hover:border-primary mx-auto mb-6 flex w-fit cursor-pointer items-center border-b border-transparent px-1 text-sm font-medium"
      @click="router.push('/users/create')"
    >
      <UserRoundPlus :stroke-width="2.5" class="inline-block size-[1.25em]" />&nbsp;
      <span>Create User</span>
    </buttons>

    <div class="mx-auto mb-6 max-w-150 text-sm">
      git subtree push --prefix dist origin gh-pages
      <span class="text-primary font-bold"> Note:</span> This the
      <code class="text-pink-500">UsersView.vue</code> and other other associated CRUD components
      are intended to be used in conjunction with
      <code class="text-pink-500">json-server</code> running locally. However, for the live demo,
      it's connecting to jsonplaceholder.typicode.com.
    </div>

    <UserList />
  </main>
</template>
