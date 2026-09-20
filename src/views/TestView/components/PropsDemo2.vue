<script setup lang="ts">
// Usage: <PropsDemo2 class="mx-auto border-emerald-700 bg-emerald-500 shadow" shape="circle" size="lg" />

/* ======================
        Imports
====================== */

// PropType is just a TS cast, not a runtime validator. Vue still only checks
// typeof value === 'string' at runtime — it has no idea about your union at runtime,
// same as before. The union constraint is purely a compile-time TS thing either
//  way (type-based or runtime declaration), so you're not losing or gaining runtime
// safety by switching styles.
import { type PropType } from 'vue'
import { cn } from '@/utils/cn'

/* ======================
      Props / Emits
====================== */
///////////////////////////////////////////////////////////////////////////
//
// The defineProps() macro is configured here using the runtime declaration syntax.
// ⚠️ The type-based defineProps<T>() is a Vue 3-only feature, so it's also good to know
// this older syntax.
//
// The only real reason to prefer this style over type-based declaration is if you want runtime
// prop validation logic (e.g. custom validator functions) alongside the types — otherwise
// the type-based version (see comment at bottom of file) is generally considered the more
// idiomatic/concise choice in a TS-first Vue project.
//
// withDefaults isn't used here — with the object syntax, defaults go directly in the
// default: field instead, as you already had.
//
// See here for more info: https://vuejs.org/guide/components/props.html
//
///////////////////////////////////////////////////////////////////////////

const props = defineProps({
  class: {
    type: String as PropType<string>,
    required: false
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    required: false,
    default: 'md'
  },
  shape: {
    type: String as PropType<'circle' | 'square'>,
    required: true
  }
})
</script>

<!-- ======================================================================

======================================================================= -->
<!-- 
Note: shape and size work bare (no props. prefix)

  In <script setup>, the compiler has full visibility into every top-level binding
  in your script block — imports, consts, and the return value of defineProps(). 
  It uses that information to compile the <template> directly against those bindings, 
  rather than going through a this context (Options API) or an opaque setup() return object 
  (non-<script setup> Composition API).

  So when the compiler sees shape in your template expression, it recognizes "that identifier
  matches a prop declared via defineProps" and rewrites it under the hood to point at the 
  underlying props object — you never have to write props.shape yourself, though props.shape 
  also still works since it resolves to the same thing. This is often described as the template 
  being compiled "as if inlined" into your script setup scope.

Why class is the exception

class is a reserved word in JavaScript — you can't use it as a bare identifier in an expression 
(class on its own tries to start a class declaration/expression, not reference a variable). 
It's only legal as:

  - an object/member key (props.class, { class: 'foo' }), or
  - a quoted string.
Since template expressions ultimately get compiled into real JavaScript, the compiler's identifier-rewriting 
trick — swapping the bare word shape for the correct underlying reference — can't be applied to class, 
because class was never a legal bare identifier to begin with. It can only be resolved via property access 
on the props object, i.e. props.class.

Note some teams prefer explicitly writing props.xxx for readability, so it's obvious at a glance which 
identifiers are props versus local template variables.
-->
<template>
  <div
    :class="
      cn(
        'border bg-stone-200',
        shape === 'circle' && 'rounded-full',
        shape === 'square' && 'rounded-lg',
        size === 'sm' && 'size-20',
        size === 'md' && 'size-40',
        size === 'lg' && 'size-60',
        props.class
      )
    "
  ></div>
</template>

<!-- This is the type-based declaration style:

<script setup lang="ts">
import { cn } from '@/utils/cn'

type Props = {
  class?: string
  size?: 'sm' | 'md' | 'lg'
  shape: 'circle' | 'square'
}

const props = withDefaults(defineProps<Props>(), { size: 'md' })
</script>


<template>
  <div
    :class="
      cn(
        'border bg-stone-200',
        shape === 'circle' && 'rounded-full',
        shape === 'square' && 'rounded-lg',
        props.size === 'sm' && 'size-20',
        props.size === 'md' && 'size-40',
        props.size === 'lg' && 'size-60',
        props.class
      )
    "
  ></div>
</template> 
-->
