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
import {
  RouterLink
  // useRouter
} from 'vue-router'
import {
  LoaderCircle,
  ArrowUpRight
  // Search,
  // Users
  // RotateCw,
} from '@lucide/vue'

import { useUsers } from '@/composables/useUsers'

/* ======================
      Variables
====================== */

const backgroundImage =
  'bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px]'

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

const initials = (name: string) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
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

    <!--# Add Search Filter here. With refresh button back.
    Other Inspiration:
    https://codepen.io/badger3000/pen/emNvoxz
    -->

    <!-- Original proof of concept:
    
    <div class="relative overflow-hidden rounded-lg border shadow" v-else-if="Array.isArray(users)">
      <ul class="bg-card divide-y">
        <li
          v-for="user in users"
          :key="user.id"
          class="hover:bg-primary/10 flex cursor-pointer flex-col gap-1 p-4"
          @click="router.push(`/users/${user.id}`)"
        >
          <div>
            <p class="text-primary font-semibold">{{ user.name }}</p>
            <p class="text-sm">@{{ user.username }}</p>
          </div>
          <div class="text-sm">
            <p>{{ user.email }}</p>
            <p>{{ user.phone }}</p>
          </div>
        </li>
      </ul>

      <button
        class="hover:bg-primary text-primary absolute top-0 right-0 z-1 rounded-bl-lg border-b border-l border-transparent p-2 hover:border-[rgba(0,0,0,0.25)] hover:text-white"
        @click="handleGetUsers"
      >
        <RotateCw class="size-5" />
      </button>
    </div> -->

    <!-- Note: auto-fit (i.e., not auto-fill) works much better when
    using justify-center. Why? Because we don't want ghost columns. -->

    <!--# Pass username as meta -->
    <div class="grid grid-cols-[repeat(auto-fit,minmax(400px,auto))] gap-4">
      <RouterLink
        v-for="user in reversedUsers"
        :key="user.id"
        :to="`/users/${user.id}`"
        class="group bg-card dark:bg-card hover:bg-card border-secondary-500/55 hover:border-primary-500/70 relative isolate overflow-hidden rounded-2xl border p-5 transition duration-300 hover:-translate-y-1 hover:border-[1.5px] hover:border-dashed hover:shadow-[0_18px_50px_rgba(0,0,0,0.28)]"
      >
        <!-- ====================
            Background Grid
        ===================== -->

        <div
          aria-hidden="true"
          class="text-secondary/10 dark:text-secondary/15 pointer-events-none absolute inset-0 z-[-1] -mx-px -mt-px group-hover:text-transparent"
          :class="backgroundImage"
          :style="{
            WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent)',
            maskImage: 'linear-gradient(to bottom, #000, transparent)'
          }"
        />

        <!-- ====================
              Card Header
        ===================== -->

        <div class="flex items-start justify-between gap-4">
          <div class="flex min-w-0 items-center gap-4">
            <div
              class="border-primary-500 bg-primary-100 dark:bg-primary-900/50 text-primary flex size-12 items-center justify-center rounded-2xl border font-mono text-sm font-bold"
            >
              {{ initials(user.name) }}
            </div>

            <div class="min-w-0">
              <!--^ truncate -->
              <h2 class="text-primary font-[Chakra_Petch] text-lg tracking-tight uppercase">
                {{ user.name }}
              </h2>

              <!--^ truncate ? -->
              <p class="text-muted truncate font-mono text-xs">
                @{{ user.username.toLowerCase() }}
              </p>
            </div>
          </div>

          <ArrowUpRight
            class="group-hover:text-primary text-secondary size-6 transition group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </div>

        <!-- Divider  bg-(--ui-text)/20 -->
        <div class="mt-3 mb-4 h-px bg-(--ui-text)/30" />

        <!-- ====================
        Card Body: Company, bs, address, email
        ===================== -->

        <div class="flex items-end justify-between gap-3">
          <div>
            <p class="font-[Chakra_Petch] text-sm tracking-tight uppercase">
              {{ user.company.name }}
            </p>
            <p class="text-xs italic">{{ user.company.bs }}</p>
            <p class="text-secondary mt-1 font-mono text-xs">
              {{ user.address.city }} · {{ user.email }}
            </p>
          </div>
          <span
            class="text-secondary bg-secondary-100 dark:bg-secondary-700 rounded-full px-2.5 py-1 font-mono text-xs"
          >
            {{ String(user.id).padStart(2, '0') }}
          </span>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
