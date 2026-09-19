<script setup lang="ts">
import { computed } from 'vue'

///////////////////////////////////////////////////////////////////////////
//
// Reactive prop destructuring became fully stable and officially recommended in Vue 3.5
// (released in September 2024).Previously, destructuring defineProps was a non-starter
// because JS destructuring breaks reactivity (stripping away the underlying Proxy).
// To get around that, Vue introduced withDefaults to safely handle fallback values
// alongside TypeScript types.
//
//   const props = withDefaults(
//     defineProps<{ date?: string;title: string}>(),
//     { date: defaultDate }
//   )
//
///////////////////////////////////////////////////////////////////////////

const {
  date = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  }),
  title
} = defineProps<{
  date?: string
  title: string
}>()

if (title !== "Today's Tasks") {
  ///////////////////////////////////////////////////////////////////////////
  //
  // If I try to change title (i.e., mutate props), I get both a ESLint error and a TS error:
  //
  //   ⚠️ Unexpected mutation of "title" prop. eslint(vue/no-mutating-props)
  //   ❌ Cannot assign to 'title' because it is a read-only property. ts-plugin(2540)
  //
  // On top of that, it just doesn't work. The UI will not output the new title.
  // Why? In Vue 3, props are wrapped in a readonly reactive proxy. When you attempt to
  // assign a new value to props.title, Vue intercepts the write operation and rejects it,
  //  meaning the state never actually updates and your template will never re-render.
  //
  // Here are the primary reasons why mutating props is strictly forbidden and why the
  // framework is designed to actively block it:
  //
  //   1. One-Way Data Flow (Single Source of Truth)
  //      Vue relies on a strict one-way down binding model. When a parent re-renders, it
  //      pushes updated prop values down to the child. If a child were allowed to mutate
  //      its own props locally:
  //
  //        - Overwritten Changes: The moment the parent component re-renders for any reason,
  //          it will re-pass its original state as props, silently overwriting your child
  //          component's local mutations.
  //
  //        - State Drift: The parent and child would end up with different, conflicting ideas
  //          of what title is, creating subtle UI bugs that are notoriously difficult to track down.
  //
  //   2. Unpredictable Side Effects Across the App
  //
  //        - All other sibling components reading that prop will unexpectedly change.
  //
  //        - The parent component's state changes without the parent ever explicitly triggering a state update.
  //
  //        - Data becomes unpredictable because any component in the tree could mutate shared state at any time.
  //
  // Note how this works in JS/TS: In practice, changing a string from
  // within logValue() has no effect on the original value in the outer scope.
  //
  //   const testValue = "abc123"
  //
  //   const logValue = (value: string) => {
  //     value = `${value} mUtAtEd!!!`
  //     console.log(value);
  //   }
  //
  //   console.log(testValue); // abc123
  //   logValue(testValue); // abc123 mUtAtEd!!!
  //   console.log(testValue); // abc123
  //
  // The real problem is when the value is a reference object like {} or [].
  // In that case, mutating the object WILL affect the version in the outer scope
  // because they share the same reference in memory.
  //
  //   const testObj = { value: "abc123"}
  //
  //   const logValue = (obj: any) => {
  //     obj.value = `${obj.value} mUtAtEd!!!`
  //     console.log(obj.value);
  //   }
  //
  //   console.log(testObj.value); // abc123
  //   logValue(testObj); // abc123 mUtAtEd!!!
  //   console.log(testObj.value); // abc123 mUtAtEd!!!
  //
  //
  // React let's you change props from within a child. That can be nice for changing
  // primitives, but can be VERY BAD if you decide to mutate an object reference.
  // Vue, on the other hand, takes a strict stance on primitive prop assignment for two primary reasons:
  // framework consistency and predictability during parent updates.
  //
  //   1. The Parent Update Overwrite (State Drift)
  //      Even with primitives, reassigning a prop in a child component creates a hidden bug.
  //      Because primitive values flow strictly top-down, any local changes you make to a prop
  //      inside the child only exist until the parent component re-renders.
  //
  //        1. Parent passes:        props.title = "Today's Tasks"
  //        2. Child reassigns:      props.title = "Stuff To Do..."
  //        3. Parent state updates: Parent re-renders and passes "Today's Tasks" again
  //        4. Result:               Child's local title is silently overwritten back to "Today's Tasks"
  //
  //      If Vue allowed you to reassign primitive props, your local change would act like a temporary patch
  //      that gets randomly wiped out whenever the parent updates for an unrelated reason (e.g., a timer ticking,
  //      a fetch completing, or another state variable changing).
  //
  //   2. Conceptual Uniformity (No Special Rules)
  //      Vue avoids having different runtime rules based on JavaScript data types:
  //
  //        - Without strict guards: Developers would have to remember: "I can reassign title because
  //          it's a string, but I can't touch user.name because it's an object."
  //
  //        - With Vue's strict readonly guard: The rule is absolute: Props are read-only input data, period.
  //
  // By using a readonly Proxy across the entire props object, Vue eliminates edge cases, enforces one-way data
  // flow uniformly, and prevents subtle bugs before they make it to production.
  //
  // Note: all of this was written prior to using the destructured props syntax.
  // If you try to do the same thing against destructuring with let:
  //
  //   let { date, title } = defineProps()
  //   title = 'Stuff To Do...'
  //
  // Neither ESLint nor TypeScript will complain, but you'll still get a compiler error:
  //
  //   [@vue/compiler-sfc] Cannot assign to destructured props as they are readonly.
  //
  // So... Nice try, but that won't work either.
  //
  ///////////////////////////////////////////////////////////////////////////
  // ❌ props.title = 'Stuff To Do...'
  // ❌ title = 'Stuff To Do...'
}

///////////////////////////////////////////////////////////////////////////
//
// This is fine:
//
// If you want to transform a prop without altering the parent's data, your
// computed property is the correct, idiomatic solution:
//
///////////////////////////////////////////////////////////////////////////

const computedTitle = computed(() => {
  if (title === "Today's Tasks") {
    return title
  }
  return 'Stuff To Do...'
})
///////////////////////////////////////////////////////////////////////////
//
// Alternatively, if the child component needs to genuinely update the parent's state,
// it should emit an event asking the parent to make the change.
//
///////////////////////////////////////////////////////////////////////////
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <header class="mb-2">
    <div class="text-secondary mb-1 text-right text-sm">
      {{ date }}
    </div>
    <h1 class="text-primary text-4xl font-black">{{ computedTitle }}</h1>
  </header>
</template>
