// Ben Hong discusses MaybeRef, MaybeRefOrGetter (and toValue) in his FEM talk: Flexible Arguments
// The alternative to toValue is to actually take the value and wrap in in a ref.
// Note: If it was a ref, then wrapping a ref in a ref doesn't actually do anything
// weird. It just flattens to a normal ref.
import { computed, toValue, type MaybeRefOrGetter } from 'vue'

///////////////////////////////////////////////////////////////////////////
//
// toValue() (Vue 3.3+) unwraps a ref, calls a getter, or passes a plain value through.
// It lets callers pass users, () => users.value,
// or a static array, and the composable doesn't care which.
//
// In practice, the consumer could actually pass a straight up array:
//
//   const reversedNumbers = useReversedArray([1, 2, 3])
//
// The beauty of toValue is that it checks for a .value property, but also
// just falls back to the actual value itself. Essentially toValue() is doing
// something like this internally:
//
//   function toValue(source) {
//     return typeof source === 'function' ? source() : unref(source)
//   }
//
// And unref() is:
//
//   function unref(r) {
//     return isRef(r) ? r.value : r
//   }
//
// So it checks, in order:
//
//   1. Is it a function? Call it and return the result (this is how getters work).
//   2. Is it a ref? Return .value.
//   3. Otherwise? Return it as-is.
//
// Note that it uses isRef() rather than checking for a .value property, so a plain object
// that happens to have a value key won't be mistaken for a ref.
//
// toValue([1, 2, 3]) just returns [1, 2, 3], and the composable works fine. You get a
// computed that returns [3, 2, 1]. That is the value proposition. It lets one composable
// accept all three input styles with a single line of code:
//
//   useReversedArray([1, 2, 3])               // plain value
//   useReversedArray(users)                   // ref
//   useReversedArray(() => props.items)       // getter (great for props)
//
// Without toValue(), you'd either force every caller to wrap things in a ref, or
// write the isRef / typeof === 'function' checks yourself. This pattern is so common
// that VueUse calls the argument type MaybeRefOrGetter, which you're already using.
//
// A couple of things to be aware of:
//
//   - A plain array is static. Since there's no reactive source, the computed has nothing to track,
//     so it computes once and never changes. That's usually what you want when passing a literal.
//     Mutating the original array later won't trigger an update.
//
//   - A reactive() array does work. reactive([1, 2, 3]) isn't a ref, so toValue passes the proxy
//     through untouched, and the spread [...value] inside the computed reads from it, which tracks
//     the dependencies.
//
//   - Don't use it with function-typed data. If T were itself a function (say, an array element type
//     you want to pass directly as the source), toValue would call it. That doesn't matter for arrays
//     of users or numbers, but it's the one edge case where the getter behavior can surprise you.
//
///////////////////////////////////////////////////////////////////////////

// This is implemented in src/views/users/UsersView/components/UserList
// It's not really needed. It's primarily for demonstration purposes.
// In practice, a function that reverses an array is a better candidate
// for a simple utility function rather than a composable. The benefit
// here is that we've made it reactive with computed, but arguably this
// does not justify creating a composable.
export function useReversedArray<T>(arr: MaybeRefOrGetter<T[] | null | undefined>) {
  return computed(() => {
    const value = toValue(arr)
    if (!Array.isArray(value)) return value
    return [...value].reverse()
  })
}
