<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// import { } from '@lucide/vue'

import { getUser } from '../../../api/getUser'
// import { sleep } from '@/utils'
import type { User } from '../../../types'

/* ======================
       Composables
====================== */

const router = useRouter()
const toast = useToast()

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
// Set to true because handleGetUser() is called immediately in onMounted hook.
const isLoading = ref(true)
const error = ref('')

/* ======================
  Methods / Functions
====================== */

const handleGetUser = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const result = await getUser(props.id)
    const { code: _code, data, message: _message, success } = result

    if (success !== true) {
      error.value = 'Unable to get resource'
      return
    }

    if (typeof data !== 'object') {
      error.value = 'Invalid response data.'
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

onMounted(async () => {
  await handleGetUser()
  console.log('user:', user.value)
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <p class="text-primary-500 my-12 text-center">Here we'll render a UpdateUserForm</p>
</template>
