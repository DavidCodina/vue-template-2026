<script setup lang="ts">
/* ======================
        Imports
====================== */

import { Users } from '@lucide/vue'
import UserList from './components/UserList/index.vue'
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <main class="flex-1 p-6">
    <h1
      class="text-secondary dark:text-primary mb-6 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light uppercase"
    >
      _Users <Users class="size-[1em]" stroke-width="1" />
    </h1>

    <div class="mx-auto mb-6 max-w-150 text-sm">
      <span class="text-primary font-bold"> Note:</span> This the
      <code class="text-pink-500">UsersView.vue</code> and other other associated CRUD components
      are intended to be used in conjunction with
      <code class="text-pink-500">json-server</code> running locally.
    </div>

    <UserList />
  </main>
</template>
