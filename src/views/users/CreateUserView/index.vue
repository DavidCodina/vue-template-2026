<script setup lang="ts">
/* ======================
        Imports
====================== */

import { UserRoundPlus } from '@lucide/vue'
import CreateUserForm from './components/CreateUserForm/index.vue'
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <main class="flex-1 p-6">
    <h1
      class="text-secondary dark:text-primary mb-6 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light uppercase"
    >
      _Create User <UserRoundPlus class="size-[1em]" stroke-width="1" />
    </h1>

    <CreateUserForm />
  </main>
</template>
