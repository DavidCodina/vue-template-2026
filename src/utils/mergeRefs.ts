import { isRef } from 'vue'
import type { VNodeRef } from 'vue'

type RefFunction = Extract<VNodeRef, (...args: any[]) => any>

/* ======================

====================== */
///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//   const internalSelectRef = ref<HTMLSelectElement | null>(null)
//
//   const mergedSelectRef: VNodeRef = (el, refKeys) => {
//     return mergeRefs(internalSelectRef, selectProps.ref)(el, refKeys)
//   }
//
// Why the wrapper function? selectProps is a reactive prop, so reading selectProps.ref
// inside the callback means you always forward to the current value. It also keeps mergedSelectRef
// a stable function. If you instead did computed(() => mergeRefs(...)), you'd get a new function
// whenever the parent re-renders with a fresh selectProps object literal, and Vue would call the
// old ref with null and the new one with the element on each change.
//
// Note: Refs passed to mergeRefs() must be actual refs and not from useTemplateRef().
//
// ⚠️ While this works, 99% of the time you're not going to need to do this. Why? Because
// in Vue it's less common to pass refs as props. The more idiomatic approach is to define
// a ref internally and then pass it out
//
//   defineExpose({
//     selectRef: internalSelectRef
//   })
//
///////////////////////////////////////////////////////////////////////////

export function mergeRefs(...refs: Array<VNodeRef | null | undefined>): RefFunction {
  return (el, refKeys) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(el, refKeys)
      } else if (isRef(ref)) {
        ref.value = el
      }
    }
  }
}
