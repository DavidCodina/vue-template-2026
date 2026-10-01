<!-- This Button is meant to emulate many of the features from Nuxt UI's button 
That said, the icon feature currently behave differently. I'm using slots rather than
props. -->

<!--# Test and review props: block, square, disabled, class, etc. -->

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

// buttonVariants() returns an object of slot functions, each of which returns their respective classes.
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
type WrappedUI = Record<SlotName, WrappedSlotFn>

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
// Possibly rename to leading and trailing
defineSlots<{
  leading?(props: { ui: WrappedUI }): any
  default?(props: { ui: WrappedUI }): any
  trailing?(props: { ui: WrappedUI }): any
}>()

/* ======================
        Computed
====================== */

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

  const wrappedSlotFunctions = {} as WrappedUI

  for (const slotName of Object.keys(variantFunctionsObject) as SlotName[]) {
    const originalSlotFn: SlotFn = variantFunctionsObject[slotName]
    wrappedSlotFunctions[slotName] = (options?: WrappedOptions) => {
      const classFromUiProp = uiProp?.[slotName]
      const classFromCallSite = options?.class
      return originalSlotFn({ class: [classFromUiProp, classFromCallSite] })
    }
  }
  return wrappedSlotFunctions
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <button
    data-slot="button"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    :class="ui.base({ class: classProp })"
  >
    <LoaderCircle
      v-if="loading"
      data-slot="leading-icon"
      aria-hidden="true"
      :class="ui.leadingIcon()"
    />

    <slot v-else name="leading" :ui="ui" />

    <!-- Here if you pass <Button>Click Me</Button> it replaces the default <span>.
    However, if you pass <Button label="Click Me" /> the label gets placed inside the <span>,
    and you get the benefit of the span's truncate class. It's a win-win because you can always
    opt-out by passinch 'children' directly. -->
    <slot :ui="ui">
      <span v-if="label !== undefined && label !== null" data-slot="label" :class="ui.label()">
        {{ label }}
      </span>
    </slot>

    <slot name="trailing" :ui="ui" />
  </button>
</template>
