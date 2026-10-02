import type { Component } from 'vue'

export type ButtonColor =
  'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

export type ButtonVariant = 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonUI {
  base?: string
  label?: string
  leadingIcon?: string
  trailingIcon?: string
}

export interface ButtonProps {
  to?: string

  /** Render the button full width. */
  block?: boolean

  ///////////////////////////////////////////////////////////////////////////
  //
  // Explicit prop (rather than a fallthrough attribute) so it can be merged through
  // tailwind-variants / tailwind-merge instead of being naively concatenated by Vue.
  //
  // Why use type any? Nuxt UI does this too, and it's mostly pragmatic. Vue's <script setup>
  // compiler has to resolve prop types at build time to generate runtime props, and any
  // sidesteps resolution problems and runtime type warnings, since class can legitimately
  // be a string, array, or object. If you'd like something more descriptive,
  // HTMLAttributes['class'] (from vue) or tailwind-variants' ClassValue works in most setups,
  // but any is the safe choice if the compiler complains.
  //
  ///////////////////////////////////////////////////////////////////////////
  class?: any
  color?: ButtonColor
  /** @default 'solid' */
  disabled?: boolean
  label?: string

  leadingIcon?: Component

  // Unlike in Nuxt UI's UButton, leading is omitted here. Instead,
  // it's conceptually the default and inferred from !trailing.

  /** Show a spinner and disable the button. */
  loading?: boolean
  /** @default 'md' */
  size?: ButtonSize

  ///////////////////////////////////////////////////////////////////////////
  //
  // Equal padding on all sides. Automatically enabled when there is no label and no default slot.
  // This is controlled by the value of the square property in the invocation of buttonVariants().
  //
  //   square: square || (!slots.default && !label)
  //
  // At first glance, it one might wonder when a consumer would have a Button instance with
  // no default slot and no label prop, but if one uses the leadingIcon slot for icon-only
  // buttons, then it makes sense:
  //
  // ❌ This works, but it's not leveraging the power of the slot.
  //
  //   <Button color="primary" square size="xl">
  //     <CircleCheck class="size-6" data-slot="leadingIcon" aria-hidden="true" />
  //   </Button>
  //
  // ✅ This is better because it automatically infers that square inside buttonVariants should be true.
  // Beyond that the correct icon sizing is applied internally, rather than having to set it explicitly.
  //
  //   <Button color="secondary" size="xl">
  //     <template #leadingIcon="{ ui }">
  //       <CircleCheck data-slot="leadingIcon" aria-hidden="true" :class="ui.leadingIcon()" />
  //     </template>
  //   </Button>
  //
  // ✅ However, the slot feature is really more of an escape hatch, and the easiest way to do this is:
  //
  //    <Button color="success" size="xl" :leadingIcon="FlaskConical" />
  //
  ///////////////////////////////////////////////////////////////////////////
  square?: boolean

  trailing?: boolean
  trailingIcon?: Component

  // button is explicitly set as a prop, rather than an attribute fallthrough, so the component can
  // explicitly set a default of type="button". This is a best practice, and also something Nuxt UI does.
  // The general idea is to prevent accidental form submissions, by requiring user to explicitly set type="submit".
  /** @default 'button' */
  type?: 'button' | 'submit' | 'reset'
  /** Per-slot class overrides. */
  ui?: ButtonUI
  /** @default 'primary' */
  variant?: ButtonVariant
}
