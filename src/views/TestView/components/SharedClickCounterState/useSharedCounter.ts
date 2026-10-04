import { ref, readonly } from 'vue'
///////////////////////////////////////////////////////////////////////////
//
// By defining the ref OUTSIDE of the function, it creates global state.
// This state is the exact same reference EVERYWHERE! This is actually a
// valid pattern. The Vue docs describe it under "Simple State Management"
// with the reactivity API: a module-level ref or reactive is a singleton
// shared by every importer. For small client-side apps it's a legitimate,
// lightweight alternative to a store. See here:
//
//   https://vuejs.org/guide/scaling-up/state-management#simple-state-management-with-reactivity-api
//
// It does have some caveats.
//
//   1. SSR is the big one. Your file is index.vue, so you may be in Nuxt. On the server,
//   module-level state is created once per server process, not once per request.
//   That means all users share the same count, which causes cross-request state
//   pollution and can leak one user's data to another. If you use SSR, use
//   Nuxt's useState('counter', () => 0) or Pinia, which handle per-request isolation
//   and hydration. In a purely client-side SPA this isn't an issue.
//
//   2. Anyone can mutate the state. Any component can write to count.value directly and
//   bypass increment/decrement. You can guard against that by exposing a read-only view.
//
//   3. Testing. The state lives for the lifetime of the module, so it persists between
//   tests in the same file. You have to reset it manually or re-import the module with
//   vi.resetModules().
//
//   4. Tooling and scale. There's no devtools integration (time travel, inspecting state),
//   no plugins, and no built-in persistence or HMR state preservation. HMR can also reset
//   module state when you edit that file.
//
//   5. Cleanup. The state never goes away. If you put large data in it, it stays in memory for the
//   whole session. Note that a watch or computed created inside the composable function gets tied
//   to whichever component first calls it, which can cause surprising behavior. Create those at
//   module level or use effectScope if you need them.
//
// A rough rule of thumb:
//
//   - Small SPA, a few pieces of shared state: a module-level ref is fine.
//
//   - SSR/Nuxt: use useState or Pinia.
//
//   - Growing app, multiple stores, debugging needs: use Pinia, which is the
//     officially recommended solution. Under the hood it's essentially this
//     same pattern plus SSR safety, devtools, and structure.
//
// This implementation will give you shared state across Button1 and Button2,
// but if you were also to duplicated the demo itself:
//
//   <SharedClickCounterState />
//   <SharedClickCounterState />
//
// Both demos would also be sharing the same exact state. Conversely, you could create
// a localized CounterContext with provide/inject that was scoped to each demo's instance.
// Moreover, this CounterContext could be abstracted into a composable. See useCounterContext.ts.
//
///////////////////////////////////////////////////////////////////////////

const count = ref(0)

/* ========================================================================

======================================================================== */

export const useSharedCounter = () => {
  const increment = () => {
    count.value++
  }

  const decrement = () => {
    count.value--
  }

  const reset = () => {
    count.value = 0
  }

  return {
    count: readonly(count),
    increment,
    decrement,
    reset
  }
}
