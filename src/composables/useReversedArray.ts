import { computed, toValue, type MaybeRefOrGetter } from 'vue'

// toValue() (Vue 3.3+) unwraps a ref, calls a getter, or passes a plain value through.
// It lets callers pass users, () => users.value,
// or a static array, and the composable doesn't care which.

// This is implemented in src/views/users/UsersView/components/UserList
// It's not really needed. It's primarily for demonstration purposes.
export function useReversedArray<T>(arr: MaybeRefOrGetter<T[] | null | undefined>) {
  return computed(() => {
    const value = toValue(arr)
    if (!Array.isArray(value)) return value
    return [...value].reverse()
  })
}
