<script setup lang="ts">
///////////////////////////////////////////////////////////////////////////
//
// Usage:
//
//   <ComponentWithTwoChildren
//     class="flex flex-col justify-center gap-4 p-4 outline-2 outline-dashed"
//     :inputProps="{
//       value: 'abc123',
//       type: 'text',
//       class: 'block border rounded bg-card px-2 py-1 outline-none text-sm max-w-50'
//     }"
//     :divProps="{ class: 'bg-lime-500 size-50 rounded-xl', onClick: handleDivClick }"
//   />
//
// HTMLAttributes is Vue's generic "any element" type, roughly
// equivalent to React's React.HTMLAttributes<HTMLElement>
// HTMLAttributes is the general set of global HTML attributes and event handlers suitable
// for a normal element such as a  <div>, <section>, <main>, <p>, <article>, <nav>, and <span>.
// ⚠️ It has no idea about tag-specific attributes like type or value on <input>.
//
// InputHTMLAttributes extends HTMLAttributes and adds the input-specific stuff
// (value, type, checked, accept, maxlength, etc.), so
//
//   value: 'abc123'
//   type: 'text'
//
// Will now type-check correctly, same as class.
//
// Where these types come from: Vue's @vue/runtime-dom package (re-exported through vue)
// defines a full set of tag-specific attribute interfaces.  See here for a full list:
//
//   https://github.com/vuejs/core/blob/main/packages/runtime-dom/src/jsx.ts
//
// If you're not sure which type to use, then just hover over an element in
// VS Code to see tag type information. For example:
//
//   (property) input: InputHTMLAttributes & ReservedProps
//
// Bonus: See also TypeScript Utility Types:
//
//   https://vuejs.org/api/utility-types.html
//
///////////////////////////////////////////////////////////////////////////

/* ======================
        Imports
====================== */

import type { HTMLAttributes, InputHTMLAttributes, IntrinsicElementAttributes } from 'vue'
import type { JSX } from 'vue/jsx-runtime'

/* ======================
        Types
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Vue's closest equivalent to React.ComponentProps<'div'> is the HTMLAttributes type '
// that Vue itself uses internally for its TSX support. It's exported straight from the
// vue package, and the way you "spread" props onto an element is v-bind="someObject"
// instead of {...someObject}.
//
//   - HTMLAttributes is the type Vue's own TSX definitions use for a generic HTML element's
//     props — class, style, id, ARIA attributes, and native event handlers in onClick/onInput
//     camelCase form. It's not scoped per-tag like React.ComponentProps<'div'> is (Vue doesn't
//     have a tag-keyed version), but it's the standard "any HTML element's props" type and is
//     what you want here.
//
// If you're not going to use the precise type, then you also have options in deriving it from
// other types as follows:
//
///////////////////////////////////////////////////////////////////////////

// Outside of using the exact InputHTMLAttributes type,
// this is the best way because you're not going through JSX.
export type InputAttributes = IntrinsicElementAttributes['input']

// This is less favorable because you're going through JSX.
export type InputAttributes2 = JSX.IntrinsicElements['input']

// This is overly verbose..
export type ElementAttributes<Tag extends keyof JSX.IntrinsicElements> = JSX.IntrinsicElements[Tag]
export type InputAttributes3 = ElementAttributes<'input'>

type Props = {
  inputProps?: InputHTMLAttributes
  divProps?: HTMLAttributes
}

/* ======================
      Props / Emits
====================== */

defineProps<Props>()
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section>
    <input v-bind="inputProps" />
    <div v-bind="divProps"></div>
  </section>
</template>
