<!-- https://vuejs.org/guide/components/provide-inject.html 
✅ Create a second demo that refactors this example into the Options API syntax.
✅ Also, can we instead provide an object with several different keys on it,
  some strings, numbers, booleans, arrays, objects, functions, etc.
-->

<script setup lang="ts">
///////////////////////////////////////////////////////////////////////////
//
// Provide/inject solves a specific pain: passing data through components that
// don't need it, just so a deeply nested descendant can use it. Here's a small
// theme-toggle demo that shows the "before you'd have to drill props through
// 2 middle components" problem and the provide/inject fix.
//
// The core idea in one sentence: provide() in an ancestor + inject() in any descendant
// lets state skip the components in between, so components that don't care about a
// value never have to know it exists.
//
// Both React Context and Vue's provide/inject exist to solve the exact same problem
// (prop drilling), both work by walking up the tree to find the nearest ancestor that
// registered a value under a matching key, and both are conventionally wrapped in a
// custom function so consumers never touch the raw key/context object directly.
//
/////////////////////////
//
// Where They Diverge:
//
//   1. One object vs. two separate calls
//   createContext() creates a single object that does double duty — .Provider to supply,
//   and the context object itself passed to useContext() to consume. Vue splits this into
//   two independent functions (provide/inject) that just happen to agree on the same key.
//   There's no "Context object" — the key is a plain identifier, more like a Map key than a container.
//
//   2. Provider is JSX vs. an imperative call
//   React's <Context.Provider value={...}> is part of the render tree — you can nest it anywhere in JSX,
//   wrap only part of a subtree, or conditionally provide different values to different branches on the
//   same render. Vue's provide() is a plain function call in <script setup>, and it applies to the entire
//   subtree that component's template renders. You can't provide different values to different branches
//   of your own template the way you can nest two <Provider>s in JSX — you'd need to split into separate
//   child components to get that granularity.
//
//   3. Reactivity Granularity
//   React re-renders every consuming component whenever the context value changes (by reference), which is
//   why people memoize values and split contexts into smaller pieces to avoid over-rendering. Vue's version
//   is more fine-grained: because you're providing a ref, only the templates/computeds that actually read .
//   value react to changes — there's no "consuming component re-renders wholesale" concept to manage, so
//   the performance concerns that drive React's context-splitting pattern are less of a thing here.
//
//   4. Default Values
//   React bakes the default into createContext(defaultValue) — one default, defined once, used whenever
//   no provider exists anywhere above. Vue's default is optional and supplied per call-site: inject(key,
//   defaultValue). Different components could theoretically request different fallbacks for the same key.
//   In our demo we didn't use a default at all — we threw an error instead, which is a valid third option
//   ("this must be provided, no silent fallback").
//
//   5. TypeScript Typing
//   React infers the type from whatever you pass to createContext<T>(). Vue doesn't have an equivalent
//   "typed container," so it invented InjectionKey<T> — a Symbol cast to carry a phantom type — specifically
//   to make inject() infer correctly. It's a bit more manual, but it's the same end result.
//
//   6. Where you're allowed to call it
//   Both have the same restriction, worth knowing since it trips people up either way: useContext() only
//   works inside a function component or another hook; inject() only works synchronously during
//   setup() / top-level <script setup>. Neither works in a random .ts utility file or inside a setTimeout
//   callback — you have to capture the value at setup-time and use it later.
//
// The one-sentence summary: it's the same mental model (provide up top, subscribe down below, skip the middle),
// just with Vue trading React's "single context object + JSX-scoped provider" for "independent key + reactivity-scoped
// subscription."
//
///////////////////////////////////////////////////////////////////////////

/* ======================
        Imports
====================== */

import { ref, provide } from 'vue'
import MiddleComponent from './MiddleComponent.vue'
import { injectionKey } from './keys'

/* ======================
    Refs (i.e., State)
====================== */

const value = ref<string[]>(['Muffy', 'Marmalade', 'Punkin', 'Mousey', 'Gingerbread', 'Wally'])

/* ======================
    Provide / Inject
====================== */

provide(injectionKey, value)
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="p-6">
    <h1 class="text-secondary mb-4 text-center text-2xl font-semibold">
      <span class="text-primary font-mono font-normal">provide()</span>
      / <span class="text-primary font-mono font-normal">inject()</span>
    </h1>
    <MiddleComponent />
  </div>
</template>
