<script setup lang="ts">
/* ======================
        Imports
====================== */

import { computed } from 'vue'
import { cn } from '@/utils/cn'

///////////////////////////////////////////////////////////////////////////
//
// Props
//
// In React, props are just a plain object passed as the function's
// first argument:
//
//   function UserCard({ name, age, isOnline = false }: Props) { ... }
//
// In Vue's <script setup>, there's no function signature to attach
// props to. Instead, you declare them with the `defineProps` macro.
// It's a "compiler macro" — it looks like a function call, but Vue's
// compiler intercepts it at build time. You never import it, and you
// can't reassign it or call it conditionally.
//
/////////////////////////
//
// Just like in React, changes to received props will cause a re-render.
// However, nothing in the <script> will rerun. In React, the function
// component would rerun top to bottom with the new value — you don't
// "watch" it, you just read it fresh every render.
//
// In Vue, `props` is a reactive object that persists across updates
// (the component doesn't re-run from scratch). If you want to respond
// to a prop changing — run a side effect — use `watch`:
//
//   import { watch } from 'vue'
//   watch(() => props.age, (newAge, oldAge) => {
//      console.log(`age changed from ${oldAge} to ${newAge}`)
//    })
//
// You'll use this far less often than useEffect, because Vue's
// template and computed() properties already auto-update when props
// change — no dependency arrays needed, ever.
//
///////////////////////////////////////////////////////////////////////////

/* ======================
        Types
====================== */

type Props = {
  ///////////////////////////////////////////////////////////////////////////
  //
  // class as an explicit prop, not a fallthrough attribute.
  //
  // By declaring class?: string in defineProps, you're pulling it out of $attrs and into props, which is what lets you actually read and process
  // it in your cn() call. Any incoming attribute whose name matches a declared prop gets pulled into props and removed from $attrs entirely.
  // If you don't do this then you get Vue's class merging behavior, rather than cn's class filtering behavior.
  //
  // At first, this seems magical. All we did is change the type definition and now Vue is behaving differently.
  // The mechanism here is actually two separate things stacking on top of each other, which is what makes it feel like magic.
  //
  // 1. The compiler reads your TypeScript source as text, not as types
  //    defineProps<Props>() isn't calling a generic function that TypeScript resolves normally.
  //    When Vue's compiler (@vue/compiler-sfc) processes your .vue file, it statically parses the
  //    AST of that type literal — walking the actual syntax of type Props = { class?: string, ... }
  //    — and generates an equivalent runtime props object from it, roughly:
  //
  //      props: {
  //        class: { type: String, required: false },
  //        name: { type: String, required: true },
  //        age: { type: Number, required: true },
  //        // ...
  //      }
  //
  //    This is why it works even though Vue components run in plain JavaScript at runtime, with no TypeScript types
  //    left after compilation — the compiler baked the shape of your type into real runtime prop declarations before
  //    stripping the types away. It's static analysis of your source text, not reflection over "real" TS types.
  //    (This is also why exotic generic types, imported types from other files in some cases, or computed types
  //    can trip up the macro — the compiler's parser has to be able to statically resolve the literal shape.)
  //
  //    So adding class?: string to Props genuinely changed what defineProps compiles to, which is why it changed
  //    runtime behavior — you weren't just annotating, you were declaring a new formal prop.
  //
  // 2. Declared props are removed from $attrs — and that's what fixed the double class. This is the actual cause of your bug.
  //    Any attribute a parent passes that isn't a declared prop falls through automatically and lands in $attrs. Vue then
  //    auto-applies $attrs to the component's single root element for you — and for class/style specifically, it merges
  //    them with whatever's already on that root element rather than overwriting.
  //
  // Before explicitly declaring class as a prop, doing class="border-red-500" from the parent wasn't
  // a prop → it fell into $attrs. Vue auto-merged it onto your root <div>'s existing class="...border-gray-200..."
  // Result: both classes on the element, entirely outside your control, cn() never saw it.
  //
  // Once you declared class?: string in Props, Vue's rule is: any incoming attribute whose name matches a declared prop is
  // extracted into props and removed from $attrs. So class stops being a fallthrough attribute — automatic merging no longer
  // applies to it — and it becomes just a normal value you read as props.class, which is the only reason your cn(...) call
  // started having any effect at all. Before, cn() was running on a class string that then got automatic extra stuff
  // appended after the fact, invisibly.
  //
  // But what if this project wasn't even using TypeScript? How wouuld we get that same behavior?
  // Without TypeScript, you don't have type literals for the compiler to parse in the first place,
  // so you fall back to Vue's original runtime declaration syntax — plain JavaScript objects,
  // no macro magic needed:
  //
  //   const props = defineProps({
  //   class: {
  //     type: String,
  //     required: false,
  //     default: ''
  //   },
  //   name: {
  //     type: String,
  //     required: true
  //   },
  //   age: {
  //     type: Number,
  //     required: true
  //   },
  //   isOnline: {
  //     type: Boolean,
  //     default: false
  //   },
  //   role: {
  //     type: String,
  //     default: 'member',
  //     validator: (v) => ['admin', 'member', 'guest'].includes(v)
  //   }
  // })
  //
  //
  ///////////////////////////////////////////////////////////////////////////
  class?: string
  name: string
  age: number
  // The `?` makes this optional — same meaning as in a React props type.
  isOnline?: boolean
  // Union types work exactly like TypeScript anywhere else.
  role?: 'admin' | 'member' | 'guest'
}

/* ======================
      Props / Emits
====================== */
///////////////////////////////////////////////////////////////////////////
//
// defineProps + withDefaults
// React equivalent: `function UserCard({ isOnline = false, role = 'member' }: Props)`
// Vue splits this into two steps because `defineProps<Props>()` alone
// (using the generic syntax) can't carry runtime default values —
// withDefaults() bolts them on.
//
/////////////////////////
//
// Note: Compiler macros are globally available in <script setup>:
//
//  - defineProps	Declare component props
//  - defineEmits	Declare emitted events
//  - defineExpose	Expose properties/methods to parent via template refs
//  - withDefaults	Add default values to typed defineProps
//  - defineOptions	Declare options like name, inheritAttrs directly in <script setup>
//  - defineModel	Declare a v-model-bindable prop, returns a mutable ref (stable since Vue 3.4; experimental/opt-in in 3.3)
//  - defineSlots	Type-check expected slots and their props (TS-only, type-level)
//
// Also globally usable without import, though not "macros" in the same sense:
//
//   - $props, $emit, $slots, $attrs — special compiler-reserved identifiers usable directly
//     in <template> (rarely needed in <script setup> since you already have props/emit locally).
//
// Still need to explicitly import { ... } from 'vue' everything else — actual runtime APIs:
//
//   - Reactivity: ref, reactive, computed, readonly, shallowRef, shallowReactive, toRef, toRefs, toValue, isRef, unref, triggerRef
//   - Watchers: watch, watchEffect, watchPostEffect, watchSyncEffect
//   - Lifecycle hooks: onMounted, onUpdated, onUnmounted, onBeforeMount, onBeforeUpdate, onBeforeUnmount, onErrorCaptured, onActivated, onDeactivated, onServerPrefetch
//   - Dependency injection: provide, inject
//   - Context accessors: useSlots, useAttrs, useModel
//   - Component-related: defineComponent, defineAsyncComponent, h, nextTick, getCurrentInstance
//
//
///////////////////////////////////////////////////////////////////////////

const props = withDefaults(defineProps<Props>(), {
  isOnline: false,
  role: 'member'
})

/* ======================
       Computed
====================== */
// React equivalent: `const badge = useMemo(() => ..., [props.isOnline])`
// No dependency array — Vue tracks `props.isOnline` automatically
// because it's a reactive property accessed inside the computed getter.

const statusBadge = computed(() => (props.isOnline ? 'bg-green-500' : 'bg-stone-400'))

const roleLabel = computed(() => props.role.toUpperCase())
</script>

<!-- ======================================================================

======================================================================= -->
<!--
  Usage: This is actually a user card showing user status.

  <PropsDemo class="mx-auto" name="David" :age="48" is-online />

  
Note: Vue prop names are commonly kebab-case in templates (is-online)
even though they're camelCase (isOnline) in the script — Vue
converts automatically. React always stays camelCase.

Kebab-case is the canonical HTML‑attribute style, but camelCase works because Vue normalizes both.
That said, you can still use camelCase when consuming the component. Coming from React, this feels
more natural.

 <PropsDemo class="mx-auto" name="David" :age="48" isOnline />
 
-->

<template>
  <div
    :class="cn('max-w-sm rounded-lg border border-stone-300 bg-white p-4 shadow-sm', props.class)"
  >
    <div class="flex items-center gap-3">
      <span :class="['h-3 w-3 rounded-full', statusBadge]" />
      <h2 class="text-lg font-semibold">{{ name }}</h2>
    </div>

    <p class="mt-1 text-sm text-gray-500">Age: {{ age }}</p>

    <span
      class="mt-2 inline-block rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700"
    >
      {{ roleLabel }}
    </span>
  </div>
</template>
