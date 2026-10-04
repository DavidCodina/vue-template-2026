// useCounterContext.ts
import { ref, provide, inject, readonly, type InjectionKey, type Ref } from 'vue'

interface CounterContext {
  count: Readonly<Ref<number>>
  increment: () => void
  decrement: () => void
  reset: () => void
}

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// If you render <Parent /> twice, each copy gets its own independent counter.
// Why this is better than module-level state in several ways:
//
//   - Instance-scoped. Multiple instances don't interfere with each other.
//
//   - SSR-safe. The state is created per component instance, so there's no cross-request pollution.
//
//   - Easy to test. Each test mounts a fresh provider, so nothing leaks between tests.
//
//   - Automatic cleanup. The state is garbage collected when the provider unmounts,
//     and any watch/computed created inside provideCounter is tied to the provider's lifecycle,
//     which is the correct owner.
//
// Things to be aware of:
//
//   - Only descendants can inject. Siblings or unrelated parts of the tree can't reach it, so the
//     provider has to sit above every consumer.
//
//   - Implicit dependency. Nothing in a consumer's props signals that it needs a provider. The throw
//     in useCounter makes the failure obvious instead of a silent undefined, and I'd keep it.
//
//   - Must be called during setup. Both provide and inject only work synchronously inside setup()
//     (or <script setup>), not in callbacks or after an await.
//
//   - No devtools state view. Vue devtools shows provided values on the component, but it's not as nice
//     as Pinia's store inspector.
//
///////////////////////////////////////////////////////////////////////////
const CounterKey: InjectionKey<CounterContext> = Symbol('counter')

// Call this in the "owner" component
export const provideCounter = (initial = 0) => {
  const count = ref(initial)

  const context: CounterContext = {
    count: readonly(count),
    increment: () => count.value++,
    decrement: () => count.value--,
    reset: () => (count.value = initial)
  }

  provide(CounterKey, context)
  return context
}

// Call this in any descendant
export const useCounter = () => {
  const context = inject(CounterKey)
  if (!context) {
    throw new Error('useCounter() must be used inside a component that called provideCounter()')
  }
  return context
}
