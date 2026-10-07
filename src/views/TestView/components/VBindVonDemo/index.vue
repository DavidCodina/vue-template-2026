<script setup lang="ts">
// Witht the v-bind object syntax, each key in the object becomes an
// attribute (or prop) on the component.

/* ======================
        Imports
====================== */

import MyButton from './MyButton.vue'
import type { ButtonHTMLAttributes } from 'vue'

/* ======================
         State
====================== */

const buttonEvents = {
  click: () => alert('Click Event!'),
  mouseenter: () => console.log('Mouse entered'),
  mouseleave: () => console.log('Mouse left')
}

///////////////////////////////////////////////////////////////////////////
//
// Regarding onClick: () => alert('onClick')
//
// In Vue, it's perfectly fine to pass event handlers as props.
// In Vue, event listeners are props under the hood.
//  @click="fn" compiles to an onClick prop, and v-on="{ click: fn }"
// is converted to onClick as well. So putting onClick in a v-bind
// object is not a hack; it's the same mechanism. In this case, if
// you used both, then both handlers would be called.
//
// With that in mind, this actually will also work for the same reason
// as before:
//
//   :onClick="handleClick"
//
// @click="handleClick" is just sugar for passing an onClick prop. :onClick="fn"
// is the long way of writing the same thing, so it's valid, not a trick.
//
// Why you rarely see :onClick in practice. The @click is the idiomatic form
// and has a few advantages.
//
//   - Inline statements: @click="count++" works because Vue wraps it in a function for you.
//     With :onClick="count++", the expression runs immediately during render, and its result
//     (a number) is passed as the "handler". You must always pass an actual function:
//
//       <MyButton @click="count++" />           <!-- works -->
//       <MyButton :onClick="() => count++" />   <!-- works -->
//       <MyButton :onClick="count++" />         <!-- bug: runs at render time -->
//
//   - Modifiers: @click.once, @click.prevent, @keyup.enter, and so on only exist on the @ syntax.
//
//   - Readability: @ instantly signals "this is an event listener" to anyone reading
//     the template. :onClick looks like data.
//
// When it's reasonable:
//
//   - Dynamic event names: :[eventName] works with @ too (@[eventName]="fn"), but when the key is computed in an object,
//     onClick-style keys are natural.
//
//   - Passing a handler as a prop to a component that declares it: If MyButton uses defineProps<{ onClick?: () => void }>(),
//     then :onClick is a genuine prop, and the component calls it itself. This is a React-style pattern and is legal in Vue,
//     but the Vue convention is defineEmits plus @click.
//
//   - Programmatically built bindings, like the object you're already using.
//
// So for ordinary templates, stick with @click. Use the onClick key inside an object
// when you're spreading a config, and treat :onClick as a curiosity that happens to work.
//
///////////////////////////////////////////////////////////////////////////

const buttonProps: ButtonHTMLAttributes & { label?: string } = {
  type: 'button',
  title: 'v-bind demo',
  class: 'flex mx-auto bg-primary px-2 py-1 rounded-lg text-white font-semibold',
  disabled: false,
  label: 'Click Me' // <-- Actual prop.
  // onClick: () => alert('onClick')
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <MyButton v-bind="buttonProps" v-on="buttonEvents" />
</template>
