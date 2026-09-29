import { ref, type Ref, type VNodeRef } from 'vue'

/* ========================================================================
                              useCreateRef
======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Similar to this:
//
//   const selectElementRef = ref<HTMLSelectElement | null>(null)
//
//   const setSelectElement: VNodeRef = (el) => {
//     selectElementRef.value = el instanceof HTMLSelectElement ? el : null
//   }
//
// Usage:
//
//   const [selectElementRef, setSelectElement] = useCreateRef<HTMLSelectElement>()
//
///////////////////////////////////////////////////////////////////////////

export function useCreateRef<T extends Element>() {
  const elementRef = ref(null) as Ref<T | null>

  const setElement: VNodeRef = (el) => {
    elementRef.value = (el as T | null) ?? null
  }

  return [elementRef, setElement] as const
}

///////////////////////////////////////////////////////////////////////////
//
// Option 2:
//
// Usage:
//
//   const [selectElementRef, setSelectElement] = useCreateRef(HTMLSelectElement)
//
// In this case if you assign the ref to something that isn't actually a
// <select>, then it simply returns a null value for the ref.value.
// Essentially, it silently fails.
//
//   export function useCreateRef<T extends Element>(
//     ctor: new (...args: any[]) => T
//   ): readonly [Ref<T | null>, VNodeRef] {
//     const elementRef = ref(null) as Ref<T | null>
//
//     const setElement: VNodeRef = (el) => {
//       elementRef.value = el instanceof ctor ? el : null
//     }
//
//     return [elementRef, setElement] as const
//   }
//
///////////////////////////////////////////////////////////////////////////
