<!-- This version improves on the original by implementing the useUsers() composable.
 Internally, useUsers() leverages createGlobalState() from VueUse to create a cached
 version of users that always renders first instead of the loader. Meanwhile, it also
 always refetches in the background. This is a nice pattern for when you want caching,
 but don't want a full-on TanStack Query solution.
-->

<script setup lang="ts">
/* ======================
        Imports
====================== */

import { computed, onMounted } from 'vue'
import { LoaderCircle } from '@lucide/vue'
import { useUsers } from '@/composables/useUsers'
import UserItem from './UserItem.vue'

/* ======================
      Composables
====================== */

const { users, isLoading, error, fetchUsers } = useUsers()

/* ======================
      Computed
====================== */

const reversedUsers = computed(() => {
  if (!Array.isArray(users.value)) return users.value
  return [...users.value].reverse()
})

/* ======================
  Methods / Functions
====================== */

const errorAlertClick = () => {
  fetchUsers()
}

/* ======================
    Lifecycle Hooks
====================== */

onMounted(() => {
  // Runs every time UserList mounts, i.e. every time you land on /users.
  // If `users` is already populated from an earlier visit, fetchUsers()
  // quietly refetches in the background (flips isRefreshing, not
  // isLoading) instead of blocking the UI with the loading state again.
  fetchUsers()
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <!--# Fix Create User Form so it adds all relevant details. Add back actual User Type. -->
  <!--^ Use max-w-250 -->
  <div class="mx-auto max-w-350">
    <!-- ====================
            Error
    ===================== -->

    <UAlert
      v-if="error"
      class="ring-error mx-auto max-w-125 shadow-lg"
      color="error"
      title="Error!"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      :ui="{
        icon: 'size-11',
        title: 'text-lg font-semibold',
        description: 'italic',
        // Wraps around the title and description.
        wrapper: '',
        // This gets applied to the top-level div, the same as class.
        root: '',
        actions:
          // No need for this, do it in the actions objects.
          //❌ [&_button]:font-semibold [&_button]:border [&_button]:border-[rgba(0,0,0,0.25)]
          'self-start'
      }"
      orientation="horizontal"
      :actions="[
        {
          label: 'Retry',
          color: 'error',
          class:
            'font-semibold border border-[rgba(0,0,0,0.25)] uppercase shadow hover:shadow-none',
          icon: 'i-lucide-rotate-cw',
          // size: 'lg'
          // square: true
          // ui: ...
          // variant: 'subtle',
          onClick: errorAlertClick
        }
      ]"
    >
      <!-- Is there some way to replace the slot's div, rather that the content going in the slot?-->
      <template #description>
        {{ error }}
      </template>
    </UAlert>

    <!-- ====================
            Loading
    ===================== -->

    <div
      v-else-if="isLoading"
      class="text-primary text-center text-2xl font-semibold"
      aria-live="polite"
      role="status"
    >
      <LoaderCircle aria-hidden="true" class="inline-block size-12 animate-spin" />
      <span class="sr-only">Loading content…</span>
    </div>

    <!-- ====================
            Empty
    ===================== -->

    <UAlert
      v-else-if="Array.isArray(users) && users.length === 0"
      class="ring-info mx-auto max-w-125 shadow-lg"
      color="info"
      title="Whoops!"
      variant="subtle"
      icon="i-lucide-triangle-alert"
      :ui="{
        icon: 'size-11',
        title: 'text-lg font-semibold',
        description: 'italic',
        wrapper: '',
        root: '',
        actions: 'self-start'
      }"
      orientation="horizontal"
    >
      <template #description>No users found!</template>
    </UAlert>

    <!-- ====================
          Data: User List
    ===================== -->

    <!--# Add Search Filter here. With refresh button back. -->

    <!-- Note: auto-fit (i.e., not auto-fill) works much better when
    using justify-center. Why? Because we don't want ghost columns. -->
    <!--# Pass username as meta -->
    <div class="grid grid-cols-[repeat(auto-fit,minmax(400px,auto))] gap-4">
      <UserItem v-for="user in reversedUsers" :key="user.id" :user="user" />
    </div>
  </div>
</template>
