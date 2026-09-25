<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import { ArrowLeft, Users } from '@lucide/vue'
import { getUser } from '../../../api/getUser'
import type { User } from '../../../types'

/* ======================
      Composables
====================== */

const router = useRouter()

/* ======================
      Props / Emits
====================== */

const props = defineProps<{
  id: string
}>()

/* ======================
        Refs 
====================== */

const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref('')

/* ======================
  Methods / Functions
====================== */

const handleGetUser = async () => {
  isLoading.value = true
  error.value = ''

  try {
    // Technically, getUsers() always handles errors internally, but having
    // a try/catch on the consuming side is still a good practice.
    const result = await getUser(props.id)
    const { code: _code, data, message: _message, success } = result

    if (success !== true) {
      error.value = 'Unable to get resource'
      return
    }

    if (typeof data !== 'object') {
      error.value = 'Invalid data type'
      return
    }

    user.value = data
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
  handleGetUser()
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="mx-auto max-w-180">
    <!-- Error UI 
    ❎ Create an alert here and have a Try Again button.
    -->
    <div
      v-if="error"
      class="rounded-lg border border-red-700 bg-red-50 p-4 text-sm text-red-700 shadow"
    >
      <p class="font-semibold">Error!</p>
      <p>{{ error }}</p>
    </div>

    <!-- Loading 
     ❎ Swap to a Spinner.
     -->
    <div v-else-if="isLoading" class="text-primary text-center text-2xl font-semibold">
      Loading...
    </div>

    <!-- Empty / Not Found State 
     ❎ Create an alert here. 
     -->
    <div
      v-else-if="!user"
      class="rounded-lg border border-blue-700 bg-blue-50 p-4 text-sm text-blue-700 shadow"
    >
      <p class="font-semibold">Whoops!</p>
      <p>User not found.</p>
    </div>

    <!-- User details -->
    <div v-else class="bg-card rounded-lg border p-4 shadow">
      <!-- <buttons
        class="text-primary hover:border-primary mb-1 flex cursor-pointer items-center border-b border-transparent text-sm font-medium"
        @click="router.push('/users')"
      >
        <ArrowLeft :stroke-width="2.5" class="inline-block size-[1em]" />
        <Users :stroke-width="2.5" class="inline-block size-[1em]" />&nbsp;
        <span>Back to Users</span>
      </buttons> -->

      <p class="text-primary text-xl font-semibold">{{ user.name }}</p>
      <p class="mb-2 text-sm">@{{ user.username }}</p>

      <div class="text-sm">
        <p>{{ user.email }}</p>
        <p>{{ user.phone }}</p>
      </div>
    </div>
  </div>
</template>
