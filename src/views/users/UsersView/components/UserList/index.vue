<!-- This version improves on the original by implementing the useUsers() composable.
 Internally, useUsers() leverages createGlobalState() from VueUse to create a cached
 version of users that always renders first instead of the loader. Meanwhile, it also
 always refetches in the background. This is a nice pattern for when you want caching,
 but don't want a full-on TanStack Query solution. -->

<!-- Todo: Sync Search Criteria Query Param. -->

<script setup lang="ts">
/* ======================
        Imports
====================== */

import { computed, onMounted, ref } from 'vue'
import { LoaderCircle } from '@lucide/vue'
import { useUsers } from '@/composables/useUsers'
import UserItem from './UserItem.vue'
import { useReversedArray } from '@/composables/useReversedArray'
import { useFilteredArray } from '@/composables/useFilteredArray'

/* ======================
        State 
====================== */

const searchTerm = ref('')

/* ======================
      Composables
====================== */

const { users, isLoading, error, fetchUsers } = useUsers()
const reversedUsers = useReversedArray(users)
const filteredUsers = useFilteredArray(reversedUsers, searchTerm, 'name')

/* ======================
      Computed
====================== */
///////////////////////////////////////////////////////////////////////////
//
// These computed values are the equivalent of the the above composables.
// The logic was extracted into composables merely as a practice exercise.
//
//   const reversedUsers = computed(() => {
//     if (!Array.isArray(users.value)) return users.value
//     return [...users.value].reverse()
//   })
//
//   const filteredUsers = computed(() => {
//     if (!Array.isArray(reversedUsers.value)) return reversedUsers.value
//     const term = searchTerm.value.trim().toLowerCase()
//     if (!term) return reversedUsers.value
//     return reversedUsers.value.filter((user) => user.name.toLowerCase().includes(term))
//   })
//
///////////////////////////////////////////////////////////////////////////

const hasNoMatches = computed(() => {
  return (
    searchTerm.value.trim() !== '' &&
    Array.isArray(filteredUsers.value) &&
    filteredUsers.value.length === 0
  )
})

/* ======================
  Methods / Functions
====================== */

const errorAlertClick = () => {
  fetchUsers()
}

const clearSearch = () => {
  searchTerm.value = ''
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
  <div>
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
        Search + User List
    ===================== -->

    <!-- Note: auto-fit (i.e., not auto-fill) works much better when
    using justify-center. Why? Because we don't want ghost columns. -->

    <section v-else>
      <div class="mx-auto mb-6 max-w-125">
        <UInput
          autocomplete="off"
          aria-label="Search users by name"
          class="w-full"
          placeholder="Search users by name…"
          type="text"
          v-model="searchTerm"
          :ui="{
            base: 'bg-card'
          }"
        >
          <!-- Firefox has no native search clearing button when type="search" -->
          <template v-if="searchTerm" #trailing>
            <UButton
              aria-label="Clear search"
              class="hover:text-error active:text-error -mr-2.5"
              @click="clearSearch"
              color="neutral"
              icon="i-lucide-x"
              size="lg"
              variant="link"
            />
          </template>
        </UInput>
      </div>

      <!-- No matches -->
      <UAlert
        v-if="hasNoMatches"
        class="ring-info mx-auto max-w-125 shadow-lg"
        color="info"
        title="No Matches"
        variant="subtle"
        icon="i-lucide-search-x"
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
        <template #description>No users match "{{ searchTerm.trim() }}".</template>
      </UAlert>

      <!-- Suppose the goal is to have grid items that are never over 600px or under 400px. 
      You may try to do this: grid-cols-[repeat(auto-fit,minmax(400px,600px))]
      The actual solution is simple to implement, but tricky to understand.

                                                                 Min Width
                                                                    ↓    
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(400px,100%),max-content))] justify-center gap-4">
          <div v-for="n in 9" :key="n" class="bg-primary h-20 w-150 max-w-full"></div>
        </div>                                                  ↑
                                                             Max Width
     
      Note: one could just do minmax(400px,max-content), but that would cause overflow if the container ever got
      squished below 400px. If that's actually the desired behavior, then at a certain point you may want to apply
      overflow-x-auto and remove justify-center for very narrow screens.

      With min(400px,100%), the grid items will wrap to the next line when pushed below 400px, but if they have
      absolutely no room left (i.e., one item on a line) and they're being squished then they will shrink rather
      than overflow. -->

      <div
        class="grid grid-cols-[repeat(auto-fit,minmax(min(400px,100%),max-content))] justify-center gap-4"
      >
        <UserItem
          class="w-150 max-w-full"
          v-for="user in filteredUsers"
          :key="user.id"
          :user="user"
        />
      </div>
    </section>
  </div>
</template>
