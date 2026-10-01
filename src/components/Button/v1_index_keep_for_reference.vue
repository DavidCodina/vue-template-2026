<!-- This Button is meant to emulate many of the features from Nuxt UI's button 
That said, the icon feature currently behave differently. I'm using slots rather than
props. -->

<!--# Test and review props: block, label, square, disabled, class, etc. -->

<script setup lang="ts">
/* ======================
       Imports
====================== */

import { computed, useSlots } from 'vue'
import { LoaderCircle } from '@lucide/vue'
import { buttonVariants } from './buttonVariants'
import type { ButtonProps } from './types'
import type { ClassValue } from 'tailwind-variants'

/* ======================
        Types
====================== */

// Everything buttonVariants() returns: an object of slot functions
type ButtonVariantsReturn = ReturnType<typeof buttonVariants>

// The slot names: 'base' | 'label' | 'leadingIcon' | 'trailingIcon' | ...
type SlotName = keyof ButtonVariantsReturn

// The type of any one original slot function from tailwind-variants
type SlotFn = ButtonVariantsReturn[SlotName]

// What our wrapped slot functions accept. This is deliberately narrower than
// the original slot function, which also accepts variant props and `className`.
// We only support `class`, so we never end up passing both `class` and `className`.
type WrappedOptions = { class?: ClassValue }

// The shape of the finished `ui` object. Use this in defineSlots too.
type WrappedSlotFn = (options?: WrappedOptions) => string
type WrappedUi = Record<SlotName, WrappedSlotFn>

/* ======================
      Composables
====================== */
// ⚠️⚠️⚠️ What is this used for?

const slots = useSlots()

/* ======================
      Props / Emits
====================== */

const {
  color = 'primary',
  variant = 'solid',
  size = 'md',
  type = 'button',
  loading,
  block,
  square,
  label,
  disabled,
  ui: uiProp,
  class: classProp
} = defineProps<ButtonProps>()

/* ======================
      Other Macros
====================== */

defineSlots<{
  leading?(props: { ui: WrappedUi }): any
  default?(props: { ui: WrappedUi }): any
  trailing?(props: { ui: WrappedUi }): any
}>()

/* ======================
        Computed
====================== */
// Wrapping *Variants in computed is standard a standard Vue practice.
// The thing about this Button that makes it a bit more complex is that
// styles itself is the wrapped in another computed (ui).

// const styles = computed(() => {
//   ///////////////////////////////////////////////////////////////////////////
//   //
//   // buttonVariants({...}) returns an object of functions, one per slot.
//   //
//   //   {
//   //     base: (slotProps) => { ... },
//   //     label: (slotProps) => { ... },
//   //     leadingIcon: (slotProps) => { ... },
//   //     trailingIcon: (slotProps) => { ... },
//   //   }
//   //
//   // Each function returns the classes for that slot.
//   // These functions know nothing about props.ui.
//   // Nothing in buttonVariants can see it. That's the whole problem.
//   //
//   // Unfortunately, the inferred type (i.e., ButtonVariantsReturn) gets lost inside computed.
//   // Or it gets wrapped in  ComputedRef<{ ... }>
//   // Presumably, it's computed so it changes dynamically when the props change.
//   //
//   ///////////////////////////////////////////////////////////////////////////

//   const result = buttonVariants({
//     color,
//     variant,
//     size,
//     loading,
//     block,
//     square: square || (!slots.default && !label),
//     leading: !!loading,

//     trailing: false
//   })

//   return result
// })

///////////////////////////////////////////////////////////////////////////
//
// ui is a new object with the same keys as styles, where each function is replaced
// by a thin wrapper that adds props.ui[slot] before calling the original. Here it is unrolled:
// This function makes it so some-class-name is inherited by props.ui.leadingIcon()
//
//   <Button2 :ui="{ leadingIcon: 'some-class-name' }" color="neutral" size="xl">
//     <template #leading="props">
//       <CircleCheck data-slot="leadingIcon" aria-hidden="true" :class="props.ui.leadingIcon()" />
//     </template>
//     Click Me
//   </Button2>
//
// Here's the concise version:
//
//   const ui = computed(() => {
//     const originalSlotFns = styles.value
//     const wrappedSlotFns = {} as WrappedUi
//
//     for (const slotName of Object.keys(originalSlotFns) as SlotName[]) {
//       const originalSlotFn: SlotFn = originalSlotFns[slotName]
//
//       wrappedSlotFns[slotName] = (options?: WrappedOptions) => {
//         const classFromUiProp = uiProp?.[slotName]
//         const classFromCallSite = options?.class
//
//         return originalSlotFn({ class: [classFromUiProp, classFromCallSite] })
//       }
//     }
//
//     return wrappedSlotFns
//   })
//
// Here's the same behavior with a plain loop and named steps instead of Object.fromEntries and .map():
// FYI: a computed that depends on another computed is a normal, idiomatic Vue pattern.
//
//
// const ui = computed(() => {
//   ///////////////////////////////////////////////////////////////////////////
//   //
//   // The original slot functions from tailwind-variants.
//   // Calling one returns that slot's classes, but it knows nothing about props.ui.
//   //
//   //   {
//   //     base: (slotProps) => { ... },
//   //     label: (slotProps) => { ... },
//   //     leadingIcon: (slotProps) => { ... },
//   //     trailingIcon: (slotProps) => { ... },
//   //   }
//   //
//   ///////////////////////////////////////////////////////////////////////////
//   const originalSlotFns = styles.value
//
//   // The new object we'll fill with wrapped versions of those functions.
//   // It starts empty, so we assert its type up front.
//   const wrappedSlotFns = {} as WrappedUi
//
//   // Every slot name defined in buttonVariants: 'base', 'label', 'leadingIcon', ...
//   const slotNames = Object.keys(originalSlotFns) as SlotName[]
//
//   for (const slotName of slotNames) {
//     // The original function for this slot.
//     // Each loop iteration has its own `slotName` and `originalSlotFn`,
//     // so every wrapper below remembers which slot it belongs to.
//     const originalSlotFn: SlotFn = originalSlotFns[slotName]
//
//     // Replace the original function with one that also includes props.ui[slotName]
//     wrappedSlotFns[slotName] = (options?: WrappedOptions) => {
//       // The consumer's override for this slot, e.g. props.ui.leadingIcon
//       const classFromUiProp = uiProp?.[slotName]
//
//       // A class passed where the function is called,
//       // e.g. ui.leadingIcon({ class: '...' })
//       const classFromCallSite = options?.class
//
//       // Order matters: later classes win Tailwind conflicts,
//       // so the call site beats the ui prop, and the ui prop beats the variants.
//       // (tv runs tailwind-merge on the result, which resolves the conflicts.)
//       return originalSlotFn({
//         class: [classFromUiProp, classFromCallSite]
//       })
//     }
//   }
//
//   // Same keys as styles, each one wrapped
//   return wrappedSlotFns
// })
//
// Here's the whole thing simplified down to a single computed.
// It's much  more cryptic when condensed like this:
//
///////////////////////////////////////////////////////////////////////////

const ui = computed(() => {
  const variantFunctionsObject = buttonVariants({
    color,
    variant,
    size,
    loading,
    block,
    square: square || (!slots.default && !label),
    leading: !!loading,
    // ❌❌❌ . Dead compound variant: with trailing: false hardcoded, your second loading compound variant
    // (loading: true, leading: false, trailing: true) can never match. It's harmless, but it's worth a
    // comment or deleting until you add a trailing spinner.
    trailing: false
  })

  const wrappedSlotFns = {} as WrappedUi

  for (const slotName of Object.keys(variantFunctionsObject) as SlotName[]) {
    const originalSlotFn: SlotFn = variantFunctionsObject[slotName]
    wrappedSlotFns[slotName] = (options?: WrappedOptions) => {
      const classFromUiProp = uiProp?.[slotName]
      const classFromCallSite = options?.class
      return originalSlotFn({ class: [classFromUiProp, classFromCallSite] })
    }
  }
  return wrappedSlotFns
})
</script>

<!-- ======================================================================

======================================================================= -->
<!-- Comments showing the original :class syntax before we created the 
computed ui. Also we used to expose :ui="styles" to the slots, but now 
we provide the computed ui. -->

<template>
  <!-- :class="styles.base({ class: [props.ui?.base, props.class] })" -->
  <button
    data-slot="base"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    :class="ui.base({ class: classProp })"
  >
    <!-- :class="styles.leadingIcon({ class: props.ui?.leadingIcon })"-->
    <LoaderCircle
      v-if="loading"
      data-slot="leadingIcon"
      aria-hidden="true"
      :class="ui.leadingIcon()"
    />

    <!-- :ui="styles" -->
    <slot v-else name="leading" :ui="ui" />

    <!-- :ui="styles" -->
    <slot :ui="ui">
      <!-- :class="styles.label({ class: props.ui?.label })" -->
      <span v-if="label !== undefined && label !== null" data-slot="label" :class="ui.label()">
        {{ label }}
      </span>
    </slot>

    <!-- :ui="styles" -->
    <slot name="trailing" :ui="ui" />
  </button>
</template>

<!-- Usage: 
<Button2
  color="neutral"
  size="xl"
  :ui="{
    leadingIcon: 'border-2 border-blue-500'
  }"
>
  <template #leading="{ ui }">
    <CircleCheck
      data-slot="leadingIcon"
      loading
      aria-hidden="true"
      :class="ui.leadingIcon()"
    />
  </template>

  Click Me
</Button2>

-->
