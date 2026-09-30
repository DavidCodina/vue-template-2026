<script setup lang="ts">
/* ======================
       Imports
====================== */

import { computed, useSlots } from 'vue'
import { LoaderCircle } from '@lucide/vue'
import { buttonVariants } from './buttonVariants'
import type { ButtonProps } from './types'

/* ======================

====================== */
//# Change to TypeScript - no withDefaults

const props = withDefaults(defineProps<ButtonProps>(), {
  color: 'primary',
  variant: 'solid',
  size: 'md',
  type: 'button'
})

/* ======================
      Composables
====================== */

const slots = useSlots()

/* ======================
      Other Macros
====================== */
// Perhaps be more explicit about the slot names?
// As Claude more about how this works:
// https://claude.ai/chat/438ca123-408d-43a2-aa0b-dfda9345f0a5

defineSlots<{
  leading?(props: { ui: ReturnType<typeof buttonVariants> }): any
  default?(props: { ui: ReturnType<typeof buttonVariants> }): any
  trailing?(props: { ui: ReturnType<typeof buttonVariants> }): any
}>()

/* ======================
        Computed
====================== */

const styles = computed(() =>
  buttonVariants({
    color: props.color,
    variant: props.variant,
    size: props.size,
    loading: props.loading,
    block: props.block,
    square: props.square || (!slots.default && !props.label)
  })
)
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <button
    data-slot="base"
    :type="props.type"
    :disabled="props.disabled || props.loading"
    :aria-busy="props.loading || undefined"
    :class="styles.base({ class: [props.ui?.base, props.class] })"
  >
    <slot name="leading" :ui="styles">
      <LoaderCircle
        v-if="props.loading"
        data-slot="leadingIcon"
        aria-hidden="true"
        :class="styles.leadingIcon({ class: props.ui?.leadingIcon })"
      />
    </slot>

    <slot :ui="styles">
      <span
        v-if="props.label !== undefined && props.label !== null"
        data-slot="label"
        :class="styles.label({ class: props.ui?.label })"
      >
        {{ props.label }}
      </span>
    </slot>

    <slot name="trailing" :ui="styles" />
  </button>
</template>
