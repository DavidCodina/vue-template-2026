<!-- This Button is meant to emulate many of the features from Nuxt UI's UButton. 
That said, the icon feature currently behaves differently. This component uses a leadingIcon
and trailingIcon prop that accept a component. Nuxt UI uses a leadingIcon and trailingIcon
prop that accept a string (e.g. 'i-lucide-lightbulb') that gets converted to an <svg>
via some kind of internal Iconify integration. 

Additionally, there's also leading and trailing slots (like Nuxt UI) as an escape hatch.
The slots have precedency over the props.

If you really want strings like 'i-lucide-arrow-right', the simplest route is Tailwind's 
Iconify plugin (@iconify/tailwind4 for Tailwind v4, or @egoist/tailwindcss-icons for v3). 

Todo: Add in the link feature: https://ui.nuxt.com/docs/components/button#link
-->

<script setup lang="ts">
/* ======================
       Imports
====================== */

import { computed /*, useSlots */ } from 'vue'
import { LoaderCircle } from '@lucide/vue'
import { buttonVariants } from './buttonVariants'

import type { VNode } from 'vue'
import type { ClassValue } from 'tailwind-variants'
import type { ButtonProps } from './types'

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

///////////////////////////////////////////////////////////////////////////
//
// Nuxt UI docs show the Button slots typed as { ui: object }), but that will lead to TS
// errors on the consuming side. In fact, the real source is typed precisely, and the docs
// table is hiding that: https://github.com/nuxt/ui/blob/v4/src/runtime/components/Button.vue
//
//   export interface ButtonSlots {
//     leading?(props: { ui: Button['ui'] }): VNode[]
//     default?(props: { ui: Button['ui'] }): VNode[]
//     trailing?(props: { ui: Button['ui'] }): VNode[]
//   }
//
///////////////////////////////////////////////////////////////////////////

type ButtonSlots = {
  leading?(props: { ui: WrappedUI }): VNode[]
  default?(props: { ui: WrappedUI }): VNode[]
  trailing?(props: { ui: WrappedUI }): VNode[]
}

/* ======================
      Composables
====================== */

// No need for useSlots() here. Instead, just capture the return value of defineSlots().
// const slots = useSlots() as Readonly<ButtonSlots>

/* ======================
      Props / Emits
====================== */

const {
  leadingIcon,
  trailingIcon,
  color = 'primary',
  variant = 'solid',
  size = 'md',
  type = 'button',
  loading,
  block,
  square,
  label,
  disabled,
  trailing = false,
  ui: uiProp,
  class: classProp
} = defineProps<ButtonProps>()

/* ======================
      Other Macros
====================== */

const slots = defineSlots<ButtonSlots>()

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

    ///////////////////////////////////////////////////////////////////////////
    //
    // ⚠️ Gotcha: The slots (and attrs) object isn't reactive, so Vue doesn't track that read.
    // Vue tracks dependencies automatically, but only for reads of reactive sources
    // (refs, reactive objects, props).
    //
    // In most cases, that's fine. However, if you had a consuming instance where
    // the default slot was dynamically added/removed, then that wouldn't trigger
    // a recompute here. In 99% of cases, that's fine because the slot's presence
    // is fixed for the button's whole life.
    //
    // A rule of thumb that covers most of this: reads in the template or render path are always fresh,
    // because render re-runs whenever the component updates. Reads inside a computed or watch are only
    // as fresh as the reactive sources they touch. So slot-presence checks belong in the template or in
    // code that runs per render, not in cached computeds.
    //
    // If you want to fix it, do this:
    //
    //   import { ref, onBeforeUpdate } from 'vue'
    //
    //   const hasDefaultSlot = ref(!!slots.default)
    //   onBeforeUpdate(() => { hasDefaultSlot.value = !!slots.default })
    //
    //   // inside the computed:
    //   square: square || (!hasDefaultSlot.value && !label),
    //
    // onBeforeUpdate runs when the button is about to re-render, which includes parent
    // re-renders that change its slots. Assigning to a ref there is safe, and Vue only
    // invalidates the computed if the boolean actually changed. It's a few extra lines
    // for an edge case, which is why I'd skip it unless you actually hit the bug.
    //
    ///////////////////////////////////////////////////////////////////////////
    square: square || (!slots.default && !label),
    // In this Button implementation, the `leading` prop is omitted. Instead,
    // it's assumed to be true if trailing is undefined or false. This happens
    // here and in the leading LoaderCircle.
    leading: !trailing,
    trailing: trailing
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
      v-if="loading && !trailing"
      data-slot="leading-icon"
      aria-hidden="true"
      :class="ui.leadingIcon()"
    />

    <!-- One can pass a leadingIcon simply by doing this:

      <Button :leadingIcon="FlaskConical">
    
    However, one can alternatively pass a it into a slot as an escape hatch for full control.
    The slot implementation will always have precedence over the prop implementation:

      <template #leading="{ ui }">
        <CircleCheck data-slot="leading-icon" aria-hidden="true" :class="ui.leadingIcon()" />
      </template>

    This idea of props + associated slots as an escape hatch (.i.e, "slot fallback") is a common Vue.js convention.
    uetify (prepend-icon prop and prepend slot), Element Plus and PrimeVue (an icon prop and an icon slot on their buttons), 
    and Nuxt UI itself (an icon prop plus leading/trailing slots) work this way
    -->

    <slot v-else name="leading" :ui="ui">
      <component
        :is="leadingIcon"
        v-if="leadingIcon"
        data-slot="leading-icon"
        aria-hidden="true"
        :class="ui.leadingIcon()"
      />
    </slot>

    <!-- If you pass <Button>Click Me</Button> it replaces the default <span>. However, 
    if you pass <Button label="Click Me" /> the label gets placed inside the <span>,
    and you get the benefit of the span's truncate class. It's a win-win because you 
    can always opt-out by passinch 'children' directly. -->
    <slot :ui="ui">
      <span v-if="label !== undefined && label !== null" data-slot="label" :class="ui.label()">
        {{ label }}
      </span>
    </slot>

    <LoaderCircle
      v-if="loading && trailing"
      data-slot="trailing-icon"
      aria-hidden="true"
      :class="ui.trailingIcon()"
    />

    <slot v-else name="trailing" :ui="ui">
      <component
        :is="trailingIcon"
        v-if="trailingIcon"
        data-slot="trailing-icon"
        aria-hidden="true"
        :class="ui.trailingIcon()"
      />
    </slot>
  </button>
</template>
