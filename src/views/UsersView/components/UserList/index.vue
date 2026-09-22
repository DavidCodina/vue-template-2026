<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref, onMounted } from 'vue'
import {
  useRouter
  // useRoute
} from 'vue-router'
import { getUsers } from '../../api/getUsers'
import type { User } from '../../types'

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
    <!-- 
    Error UI: 
    ❎ Create an alert here and have a Try Again button.
    -->
    <div
      v-if="error"
      class="rounded-lg border border-red-700 bg-red-50 p-4 text-sm text-red-700 shadow"
    >
      <p class="font-semibold">Error!</p>
      <p>{{ error }}</p>
    </div>

    <!-- 
    Loading 
    ❎ Swap to a Spinner.
     -->
    <div v-else-if="isLoading" class="text-primary text-center text-2xl font-semibold">
      Loading...
    </div>

    <!-- Empty State 
      ❎ Create an alert here. 
    -->

    <div
      v-else-if="Array.isArray(users) && users.length === 0"
      class="rounded-lg border border-blue-700 bg-blue-50 p-4 text-sm text-blue-700 shadow"
    >
      <p class="font-semibold">Whoops!</p>
      <p>No users found.</p>
    </div>

    <!-- User List -->
    <ul v-else-if="Array.isArray(users)" class="bg-card divide-y rounded-lg border shadow">
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
  </div>
</template>
