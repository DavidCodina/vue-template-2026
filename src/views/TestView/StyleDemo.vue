<script setup lang="ts">
/* ======================
        Imports
====================== */

import { computed, ref } from 'vue'
import { cn } from '@/utils/cn'

/* ======================
      Props / Emits
====================== */

const props = defineProps<{
  // class as an explicit prop, not a fallthrough attribute. By declaring class?: string in defineProps,
  // you're pulling it out of $attrs and into props, which is what lets you actually read and process
  // it in your cn() call. Any incoming attribute whose name matches a declared prop gets pulled into
  // props and removed from $attrs entirely.
  class?: string
}>()

/* ======================
    Refs (i.e., State)
====================== */

const isHovered = ref(false)
const isDashed = ref(false)

const myStyles = {
  // ⚠️ Vue (unlike React) does not automatically append
  // px to unitless numeric values in style bindings.
  height: '150px', // 150 ❌
  width: '150px' // 150 ❌
}

/* ======================
       Computed
====================== */
///////////////////////////////////////////////////////////////////////////
//
// Note: computed() is necessary in this case. Merely doing this won't work.
//
//   ❌ const uncomputedClass = isDashed.value && 'border-dashed'
//
// The uncomputedClass version breaks because it's just a plain JavaScript
// expression evaluated once, at the moment that line of code runs (during setup()).
// It has no ongoing connection to isDashed.
//
// computed() doesn't just calculate a value — it returns a special reactive object
// that tracks isDashed as a dependency. Whenever isDashed.value changes, Vue knows
// to re-run this function and update anything using computedClass, including your template.
//
///////////////////////////////////////////////////////////////////////////

const _computedClass = computed(() => {
  return isDashed.value && 'border-dashed' // => 'border-dashed' || undefined
})

/* ======================
Event Handlers / Functions
====================== */

const toggleDashed = () => {
  isDashed.value = !isDashed.value
}
</script>

<!-- ======================================================================

======================================================================= -->
<!-- 
Obviously, there's many different styling solutions in this demo, and 
you would not do all this in production. 

Below, we're using cn() to read isDashed conditional logic.
However, one could also do this for simple cases:

  ✅ :class="{'border-dashed': isDashed}"


Or if you want to abstract it into a computed value do this:

  ✅ const toggleDashed = () => isDashed.value = !isDashed.value
    :class="computedClass"


Note that :class takes a SINGLE JS expression, so the following variations won't work:

  ❌ :class="cn('', isDashed && 'border-dashed', props.class) some-other-class"
  ❌ :class="{ 'border-dashed': isDashed } some-other-class"


However, using an array WILL work:
  
  ✅ :class="[isDashed && 'border-dashed', 'some-other-class']"
  ✅ :class="[{ 'border-dashed': isDashed }, 'some-other-class']"
  ✅ :class="[cn('', isDashed && 'border-dashed', props.class), 'some-other-class']"


Also, one can use both class (static) and :class (dynamic) within the same component.

  ✅ :class="cn('', isDashed && 'border-dashed', props.class)"


The breadth of styling options available in Vue is pretty impressive!
-->

<template>
  <section class="mx-auto my-12 max-w-sm space-y-2">
    <div
      id="test-div"
      class="flex cursor-pointer items-center justify-center text-sm text-white select-none"
      :class="cn('', isDashed && 'border-dashed', props.class)"
      style="box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3)"
      :style="{
        backgroundColor: isHovered ? 'var(--color-primary)' : 'var(--color-secondary)',
        borderColor: isHovered ? 'var(--color-secondary)' : 'var(--color-primary)',
        ...myStyles
      }"
      @click="toggleDashed"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      StyleDemo.vue
    </div>
  </section>
</template>

<style scoped>
/* styles defined here will have precedence over Tailwind classes. However,
inline styles with style / :style will have precedence over styles here. */

#test-div {
  border-width: 4px;
  border-radius: 12px;
  margin: 0 auto;
}
</style>
