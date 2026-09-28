<!-- Todo: Add back v-model logic -->
<script setup lang="ts">
/* ======================
        Imports
====================== */

import type { HTMLAttributes } from 'vue'
import { cn } from '@/utils/cn'

/* ======================
      Variables
====================== */

const FIELD_FOCUS_MIXIN = `
focus-visible:shadow-none
focus-visible:ring-[3px]
focus-visible:ring-secondary/40
focus-visible:border-secondary
`

// In production, we could also color the label text base on validity state,
// and remove error messaging when the field is disabled. However, that's
// really only practical when you have componentized field controls.
// For this demo, it's just too much extra code.
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

///////////////////////////////////////////////////////////////////////////
//
// ⚠️ outline-hidden vs outline-none:
//
// This one is in inputClasses, so it affects every field. Your focus style is a ring,
// which is a box-shadow. In Windows High Contrast / forced-colors mode, browsers strip box-shadows,
// and in Tailwind v4 outline-none sets outline-style: none, so the field can end up with no visible
// focus at all. Tailwind v4 has outline-hidden for this case. It's invisible normally but falls back
// to a real outline in forced-colors mode
//
///////////////////////////////////////////////////////////////////////////

const inputClasses = `
text-sm
flex bg-card-accented
w-full min-w-0
[&:not([type='file'])]:px-[0.5em]
[&:not([type='file'])]:py-[0.25em]
rounded-[0.375em]
border outline-hidden
placeholder:text-muted-foreground
placeholder:italic
shadow-xs 
${FIELD_FOCUS_MIXIN}
${FIELD_DISABLED_MIXIN}
${FIELD_INVALID_MIXIN}
${FIELD_VALID_MIXIN}
`

/* ======================
      Props / Emits
====================== */

const props = defineProps<{
  // ❌ class?: string -  this will prohibit :class.
  class?: HTMLAttributes['class']
  ///////////////////////////////////////////////////////////////////////////
  //
  // The invalid prop is a naming convention takend from Base UI.
  // It's used below to conditionally output data-valid and data-invalid attributes.
  // However, unlike in Base UI, if undefined NO data attributes are output.
  // In other words, invalid is 100% controllable (no constraint API validation interference),
  // and undefined means "neither valid nor invalid". The data attributes, in turn,
  //are used to render Tailwind classes using data-valid and data-invalid modidifiers.
  //
  ///////////////////////////////////////////////////////////////////////////
  invalid?: true | false
}>()
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <input
    :data-valid="invalid === false ? '' : undefined"
    :data-invalid="invalid === true ? '' : undefined"
    :class="cn(inputClasses, props.class)"
  />
</template>
