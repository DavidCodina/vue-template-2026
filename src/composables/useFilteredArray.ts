import { computed, toValue, type MaybeRefOrGetter } from 'vue'

// Union of keys in T whose values are strings
type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never
}[keyof T]

// This is implemented in src/views/users/UsersView/components/UserList
// It's not really needed. It's primarily for demonstration purposes.
export function useFilteredArray<T, K extends StringKeys<T>>(
  arr: MaybeRefOrGetter<T[] | null | undefined>,
  searchTerm: MaybeRefOrGetter<string>,
  key: K
) {
  return computed(() => {
    const value = toValue(arr)
    if (!Array.isArray(value)) return value

    const term = toValue(searchTerm).trim().toLowerCase()
    if (!term) return value

    return value.filter((item) => (item[key] as string).toLowerCase().includes(term))
  })
}
