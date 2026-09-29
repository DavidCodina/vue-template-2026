<script setup lang="ts">
///////////////////////////////////////////////////////////////////////////
//
// Regarding Bindings:
//
// This component implements defineEmits + modelValue (on the root element)
// in order to support v-model when being consumed.
//
//   v-model="selectValue"
///
// v-model on a component is shorthand for doing this (which will also work):
//
//   :modelValue="selectValue"
//   @update:modelValue="v => selectValue = v"
//
// However, for implementations that need custom logic directly within the @change handler
// we can instead do this within :selectProps:
//
//   :selectProps="{
//     onChange: (e: Event) => {
//       const target = e.target as HTMLSelectElement
//       selectValue = target.value
//     },
//     value: selectValue
//   }"
//
/////////////////////////
//
// Disabling Fallthrough Attributes In Favor of Explicit "Props Bag":
//
// Because this component has a <div> wrapper and is not just a pure <select>,
// I've disabled attribute fallthrough to prevent things like value landing on
// the container <div>.
//
//   defineOptions({ inheritAttrs: false })
//
// Instead, I've opted for the so-called "props bag" pattern for explicit control
// with no whoopsies!
//
///////////////////////////////////////////////////////////////////////////

/* ======================
        Imports
====================== */

import { computed, useTemplateRef } from 'vue'
import type { HTMLAttributes, SelectHTMLAttributes } from 'vue'
import { cn } from '@/utils/cn'

/* ======================
        Types
====================== */

type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

/* ======================
      Variables
====================== */

const FIELD_FOCUS_MIXIN = `
focus-visible:shadow-none
focus-visible:ring-[3px]
focus-visible:ring-secondary/40
focus-visible:border-secondary
`

const FIELD_INVALID_MIXIN = `
not-disabled:data-invalid:border-error
data-invalid:focus-visible:border-error
data-invalid:focus-visible:ring-error/40
`

const FIELD_VALID_MIXIN = `
not-disabled:data-valid:border-success
focus-visible:data-valid:border-success
focus-visible:data-valid:ring-success/40
`

const FIELD_DISABLED_MIXIN = `
disabled:cursor-not-allowed
disabled:border-neutral-400
`

const selectClasses = `
text-sm
flex bg-card-accented
w-full min-w-0
px-[0.5em] py-[0.25em]
rounded-[0.375em]
border outline-hidden
shadow-xs
${FIELD_FOCUS_MIXIN}
${FIELD_DISABLED_MIXIN}
${FIELD_INVALID_MIXIN}
${FIELD_VALID_MIXIN}
`

/* ======================
      Props / Emits
====================== */

const {
  // ⚠️ If undefined not explicitly set as the default,
  // then Vue casts an absent Boolean prop to false.
  invalid = undefined,
  groupProps = {},
  selectProps = {},
  modelValue,
  options,
  placeholder
} = defineProps<{
  invalid?: true | false
  // This is the "props bag" pattern, which some component libraries use.
  groupProps?: HTMLAttributes

  ///////////////////////////////////////////////////////////////////////////
  //
  // We could append `& ReservedProps` to be able to also pass a ref as prop.
  //
  //   :selectProps="{
  //     ref: setSelectElement
  //   }"
  //
  // However, that gets tedious. First, we'd have to create a ref
  // and pass it as a prop:
  //
  //   // Or use: const [selectElementRef, setSelectElement] = useCreateRef<HTMLSelectElement>()
  //   const selectElementRef = ref<HTMLSelectElement | null>(null)
  //
  //   const setSelectElement: VNodeRef = (el) => {
  //     selectElementRef.value = el instanceof HTMLSelectElement ? el : null
  //   }
  //
  //   ...
  //
  //   :selectProps="{
  //     ref: setSelectElement
  //   }"
  //
  // Then internally, we'd may also need to merge that ref with any
  // internal ref we have here:
  //
  //   const internalSelectRef = ref<HTMLSelectElement | null>(null)
  //
  //   const mergedSelectRef: VNodeRef = (el, refKeys) => {
  //     return mergeRefs(internalSelectRef, selectProps.ref)(el, refKeys)
  //   }
  //
  // This gets ugly quickly. A more idiomatic approach is to create refs
  // internally here, then expose them as follows:
  //
  //   defineExpose({ selectRef: internalSelectRef })
  //
  // This is much cleaner, and you're not fighting the framework!
  //
  ///////////////////////////////////////////////////////////////////////////
  selectProps?: SelectHTMLAttributes // ❌ & ReservedProps
  options: SelectOption[]
  ///////////////////////////////////////////////////////////////////////////
  //
  // modelValue is used implicitly by v-model="selectValue" when consuming.
  // Alternatively, it could be used explicitly if one did this:
  //
  //   :modelValue="selectValue"
  //   @update:modelValue="newValue => selectValue = newValue"
  //
  ///////////////////////////////////////////////////////////////////////////
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

/* ======================
      Template Refs
====================== */

const internalSelectRef = useTemplateRef<HTMLSelectElement>('internalSelectRef')

/* ======================
      Other Macros
====================== */

// Note: ReservedProps like ref and :key still fall through which is good.
defineOptions({ inheritAttrs: false })

defineExpose({
  selectRef: internalSelectRef
})

/* ======================
        Computed
====================== */

const selectValue = computed(() => modelValue ?? selectProps.value)

const groupedAttrs = computed(() => {
  const { class: _class, ...rest } = groupProps
  return rest
})

///////////////////////////////////////////////////////////////////////////
//
// Destructuring selectProps.class is necessary to prevent external classes
// from being applied twice to the <select> element when we later use v-bind
// and also :class.
//
//   const { class: externalSelectClasses, ...otherSelectProps } = selectProps
//
// However, that doesn't quite work with reactive props destructure, since
// the rest object isn't reactive. Use a computed instead.
//
///////////////////////////////////////////////////////////////////////////

const selectAttrs = computed(() => {
  const { class: _class, value: _value, ...rest } = selectProps
  return rest
})
</script>

<!-- ======================================================================

======================================================================= -->
<!-- Vue merges the onChange from selectProps with your @change into an array of listeners, so both fire.
This is the desired behavior. onChange is a notification, and the two listeners can't conflict. 
Both can run, so no precedence is needed. This is also how Vue treats listeners everywhere: 
a parent's @click and a component's own onClick on the same root element are merged into an 
array by attribute fallthrough. Your template gets the same behavior from the compiler's mergeProps. -->

<template>
  <div v-bind="groupedAttrs" :class="cn('', groupProps.class)">
    <select
      v-bind="selectAttrs"
      ref="internalSelectRef"
      :class="cn(selectClasses, selectProps.class, !selectValue && 'text-muted italic')"
      :data-valid="invalid === false ? '' : undefined"
      :data-invalid="invalid === true ? '' : undefined"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
      :value="selectValue"
    >
      <option v-if="placeholder && typeof placeholder === 'string'" value="" disabled hidden>
        {{ placeholder }}
      </option>

      <!-- :key="option.value" assumes all values will be unique -->
      <option
        class="tex-default not-italic"
        v-for="option in options"
        :key="option.value"
        :disabled="option.disabled"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
