<!-- https://vuejs.org/api/composition-api-lifecycle.html#onmounted -->

<script setup lang="ts">
/* ======================
        Imports
====================== */

import { onMounted, ref } from 'vue'
// import { } from '@lucide/vue'
// import { cn } from '@/utils/cn'
// import Button from '@/components/Button.vue'

/* ======================
        Types
====================== */

type User = {
  id: number
  name: string
  email: string
}

/* ======================
    Refs (i.e., State)
====================== */

const users = ref<User[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

/* ======================
Event Handlers / Functions
====================== */

const fetchUsers = async () => {
  isLoading.value = true
  error.value = null
  try {
    const res = await fetch('https://jsonplaceholder.typicode.com/users')
    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    users.value = await res.json()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Something went wrong'
  } finally {
    isLoading.value = false
  }
}

/* ======================
    Lifecycle Hooks
====================== */
///////////////////////////////////////////////////////////////////////////
//
// onMounted runs once, after the component has been mounted to the DOM
// (i.e., the initial render is done and refs to DOM elements are populated).
// It's the standard place to kick off one-time side effects like fetching
// initial data, setting up subscriptions, or reading DOM measurements.
//
// Unlike useEffect, onMounted has no cleanup return function, because it's not
// paired with a corresponding "unmount and re-run" cycle — that's what makes it
// simpler than useEffect for this specific "run once" case.
//
// Cleanup on unmount is a separate hook (onUnmounted), which you'll probably want
// to demo pairing with things like setInterval or event listeners later.
//
///////////////////////////////////////////////////////////////////////////

onMounted(() => {
  fetchUsers()
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div>
    <p v-if="isLoading">Loading...</p>
    <p v-else-if="error">{{ error }}</p>
    <ul v-else>
      <li v-for="user in users" :key="user.id">{{ user.name }} — {{ user.email }}</li>
    </ul>
  </div>
</template>
