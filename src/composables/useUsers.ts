import { ref } from 'vue'
import { createGlobalState } from '@vueuse/core'
import { getUsers } from '@/views/users/api/getUsers'
import type { User } from '@/views/users/types'

/* ========================================================================
                              useUsersState
======================================================================== */
// This is the "real" composable. On its own, calling this from multiple
// components would give each one its own independent copy of state (its
// own `users`, its own `isLoading`, etc.) — that's normal Vue composable
// behavior. `createGlobalState` (below) is what turns it into a single,
// shared instance for the whole app.

const useUsersState = () => {
  /* ======================
          Refs
  ====================== */

  const users = ref<User[] | null>(null)
  const error = ref('')

  // isLoading  -> true only while there's no cached data to show yet
  //               (the very first fetch, or a retry after an error that
  //               left `users` empty).
  // isRefetching -> true whenever a fetch is in flight *while* we already
  //               have cached data on screen. Not currently wired into
  //               the template, but it's there if you ever want a subtle
  //               "syncing" indicator instead of nothing at all.
  const isLoading = ref(false)
  const isRefetching = ref(false)

  /* ======================
        Functions
  ====================== */

  const fetchUsers = async () => {
    const hasCachedData = Array.isArray(users.value)

    if (hasCachedData) {
      isRefetching.value = true
    } else {
      isLoading.value = true
    }

    error.value = ''

    try {
      // Technically, getUsers() always handles errors internally, but having
      // a try/catch on the consuming side is still good practice.
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
      isRefetching.value = false
    }
  }

  return {
    users,
    error,
    isLoading,
    isRefetching,
    fetchUsers
  }
}

/* ========================================================================
                                useUsers
======================================================================== */
// createGlobalState runs useUsersState() exactly once — the first time
// useUsers() is called anywhere in the app — and keeps that single
// instance alive for the lifetime of the page (there's no teardown when
// components unmount, unlike createSharedComposable).
//
// Every subsequent call to useUsers(), from any component on any route, returns
// the exact same refs. That's what gives you "cached list + silent background
// refetch" across navigation, with no risk of the cache getting wiped out
// just because UserList.vue happens to unmount.

export const useUsers = createGlobalState(useUsersState)
