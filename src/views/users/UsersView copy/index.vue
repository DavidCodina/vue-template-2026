<script setup lang="ts">
/* ======================
        Imports
====================== */

// import { inject } from 'vue'
import { useRouter } from 'vue-router'
import { useTitle } from '@vueuse/core'
import { Users, UserRoundPlus } from '@lucide/vue'
import UserList from './components/UserList/index.vue'
// import { appStateKey } from '@/keys'

/* ======================
      Composables
====================== */

const _title = useTitle('Users Page')

const router = useRouter()

/* ======================
        Inject
====================== */

///////////////////////////////////////////////////////////////////////////
//
//   const appState = inject(appStateKey)
//
//   // Alternatively, do: const appState = inject(appStateKey)!
//   if (!appState) throw new Error('appState was not provided')
//
// appState will be inferred as AppState | undefined
// That | undefined is expected and correct — it's TypeScript accurately
// telling you that inject can fail at runtime (if the component isn't
// a descendant of wherever provide was called), and it's making you handle
// that case rather than silently crashing later with a much more confusing error.
//
// Usage:
//
//   <button @click="appState.routerKey++">Reboot Page</button>
//
///////////////////////////////////////////////////////////////////////////
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

    <button
      class="text-primary hover:border-primary mx-auto mb-6 flex w-fit cursor-pointer items-center border-b border-transparent px-1 text-sm font-medium"
      @click="router.push('/users/create')"
    >
      <UserRoundPlus :stroke-width="2.5" class="inline-block size-[1.25em]" />&nbsp;
      <span>Create User</span>
    </button>

    <div class="mx-auto mb-6 max-w-150 text-sm">
      <span class="text-primary-500 font-bold"> Note:</span> This
      <code class="text-pink-500">UsersView.vue</code> and other associated CRUD components are
      intended to be used in conjunction with <code class="text-pink-500">json-server</code> running
      locally. However, for the live demo, it's connecting to
      <a
        href="https://jsonplaceholder.typicode.com"
        class="text-primary-500 font-medium underline"
        rel="noreferrer noopener"
        target="_blank"
        >jsonplaceholder.typicode.com</a
      >.
    </div>

    <UserList />
  </main>
</template>
