<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { LoaderCircle, RotateCw } from '@lucide/vue'

import { getUsers } from '../../../api/getUsers'
import type { User } from '../../../types'

/* ======================
      Composables
====================== */

const router = useRouter()

/* ======================
          Refs 
====================== */

const users = ref<User[] | null>(null)
const isLoading = ref(false)
const error = ref('')

/* ======================
  Methods / Functions
====================== */
// ❎ Obviously, it's super annoying to keep recalling the API.
// What we can do is create a local context and store the data there.
// Then only call handleGetUsers() if there is no data in the context.
// In production, prefer something like TanStack Query.

const handleGetUsers = async () => {
  isLoading.value = true
  error.value = ''

  try {
    // Technically, getUsers() always handles errors internally, but having
    // a try/catch on the consuming side is still a good practice.
    const result = await getUsers()
    const { code: _code, data, message: _message, success } = result

    if (success !== true) {
      error.value = 'Unable to get resource'
      return
    }

    if (!Array.isArray(data)) {
      error.value = 'Invalid data type'
      return
    }

    users.value = data
  } catch (_err) {
    error.value = 'Unable to get resource'
  } finally {
    isLoading.value = false
  }
}

const errorAlertClick = () => {
  handleGetUsers()
}

/* ======================
    Lifecycle Hooks
====================== */

onMounted(() => {
  handleGetUsers()
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="mx-auto max-w-180">
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
    </div>
  </div>
</template>
