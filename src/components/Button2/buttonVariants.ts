import { tv } from 'tailwind-variants'

import type { ButtonColor } from './types'

const chromatic: ButtonColor[] = ['primary', 'secondary', 'success', 'info', 'warning', 'error']

export const buttonVariants = tv({
  slots: {
    base: 'inline-flex cursor-pointer items-center rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-75',
    label: 'truncate',
    leadingIcon: 'shrink-0',
    trailingIcon: 'shrink-0'
  },
  variants: {
    color: {
      //# I get what they're doing, but I don't live the --btn as a naming convention.
      // Light shade / dark shade, mirroring Nuxt UI's `--ui-<color>` tokens (500 / 400).
      primary: '[--btn:var(--ui-color-primary-500)] dark:[--btn:var(--ui-color-primary-400)]',
      secondary: '[--btn:var(--ui-color-secondary-500)] dark:[--btn:var(--ui-color-secondary-400)]',
      success: '[--btn:var(--ui-color-success-500)] dark:[--btn:var(--ui-color-success-400)]',
      info: '[--btn:var(--ui-color-info-500)] dark:[--btn:var(--ui-color-info-400)]',
      warning: '[--btn:var(--ui-color-warning-500)] dark:[--btn:var(--ui-color-warning-400)]',
      error: '[--btn:var(--ui-color-error-500)] dark:[--btn:var(--ui-color-error-400)]',
      neutral: ''
    },
    variant: {
      solid: '',
      outline: '',
      soft: '',
      subtle: '',
      ghost: '',
      link: ''
    },
    size: {
      xs: { base: 'gap-1 px-2 py-1 text-xs', leadingIcon: 'size-4', trailingIcon: 'size-4' },
      sm: { base: 'gap-1.5 px-2.5 py-1.5 text-xs', leadingIcon: 'size-4', trailingIcon: 'size-4' },
      md: { base: 'gap-1.5 px-2.5 py-1.5 text-sm', leadingIcon: 'size-5', trailingIcon: 'size-5' },
      lg: { base: 'gap-2 px-3 py-2 text-sm', leadingIcon: 'size-5', trailingIcon: 'size-5' },
      xl: { base: 'gap-2 px-3 py-2 text-base', leadingIcon: 'size-6', trailingIcon: 'size-6' }
    },
    block: {
      true: { base: 'w-full justify-center', trailingIcon: 'ms-auto' }
    },
    square: {
      true: ''
    },
    loading: {
      true: { leadingIcon: 'animate-spin' }
    }
  },
  compoundVariants: [
    // ---- Chromatic colors (all read from --btn) ----
    {
      color: chromatic,
      variant: 'solid',
      class:
        'bg-(--btn) text-white outline-(--btn)/25 hover:bg-(--btn)/75 focus-visible:outline-3 active:bg-(--btn)/75 disabled:bg-(--btn) dark:text-neutral-900'
    },
    {
      color: chromatic,
      variant: 'outline',
      class:
        'text-(--btn) ring ring-(--btn)/50 outline-(--btn)/25 ring-inset hover:bg-(--btn)/10 focus-visible:outline-3 focus-visible:ring-(--btn) active:bg-(--btn)/10 disabled:bg-transparent'
    },
    {
      color: chromatic,
      variant: 'soft',
      class:
        'bg-(--btn)/10 text-(--btn) outline-(--btn)/25 hover:bg-(--btn)/15 focus-visible:outline-3 active:bg-(--btn)/15 disabled:bg-(--btn)/10'
    },
    {
      color: chromatic,
      variant: 'subtle',
      class:
        'bg-(--btn)/10 text-(--btn) ring ring-(--btn)/25 outline-(--btn)/25 ring-inset hover:bg-(--btn)/15 focus-visible:outline-3 focus-visible:ring-(--btn) active:bg-(--btn)/15 disabled:bg-(--btn)/10'
    },
    {
      color: chromatic,
      variant: 'ghost',
      class:
        'text-(--btn) outline-(--btn)/25 hover:bg-(--btn)/10 focus-visible:outline-3 active:bg-(--btn)/10 disabled:bg-transparent'
    },
    {
      color: chromatic,
      variant: 'link',
      class:
        'text-(--btn) outline-(--btn)/25 hover:text-(--btn)/75 focus-visible:outline-3 active:text-(--btn)/75 disabled:text-(--btn)'
    },

    // ---- Neutral (Nuxt's semantic tokens mapped to Tailwind neutrals) ----
    {
      color: 'neutral',
      variant: 'solid',
      class:
        'bg-neutral-900 text-white outline-neutral-900/25 hover:bg-neutral-900/90 focus-visible:outline-3 active:bg-neutral-900/90 disabled:bg-neutral-900 dark:bg-white dark:text-neutral-900 dark:outline-white/25 dark:hover:bg-white/90 dark:active:bg-white/90 dark:disabled:bg-white'
    },
    {
      color: 'neutral',
      variant: 'outline',
      class:
        'bg-white text-neutral-700 ring ring-neutral-300 outline-neutral-900/25 ring-inset hover:bg-neutral-50 focus-visible:outline-3 focus-visible:ring-neutral-900 active:bg-neutral-50 disabled:bg-white dark:bg-neutral-900 dark:text-neutral-200 dark:ring-neutral-700 dark:outline-white/25 dark:hover:bg-neutral-800 dark:focus-visible:ring-white dark:active:bg-neutral-800 dark:disabled:bg-neutral-900'
    },
    {
      color: 'neutral',
      variant: 'soft',
      class:
        'bg-neutral-100 text-neutral-700 outline-neutral-900/25 hover:bg-neutral-200/75 focus-visible:outline-3 active:bg-neutral-200/75 disabled:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200 dark:outline-white/25 dark:hover:bg-neutral-700/75 dark:active:bg-neutral-700/75 dark:disabled:bg-neutral-800'
    },
    {
      color: 'neutral',
      variant: 'subtle',
      class:
        'bg-neutral-100 text-neutral-700 ring ring-neutral-300 outline-neutral-900/25 ring-inset hover:bg-neutral-200/75 focus-visible:outline-3 focus-visible:ring-neutral-900 active:bg-neutral-200/75 disabled:bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-200 dark:ring-neutral-700 dark:outline-white/25 dark:hover:bg-neutral-700/75 dark:focus-visible:ring-white dark:active:bg-neutral-700/75 dark:disabled:bg-neutral-800'
    },
    {
      color: 'neutral',
      variant: 'ghost',
      class:
        'text-neutral-700 outline-neutral-900/25 hover:bg-neutral-100 focus-visible:outline-3 active:bg-neutral-100 hover:disabled:bg-transparent dark:text-neutral-200 dark:outline-white/25 dark:hover:bg-neutral-800 dark:active:bg-neutral-800 dark:hover:disabled:bg-transparent'
    },
    {
      color: 'neutral',
      variant: 'link',
      class:
        'text-neutral-500 outline-neutral-900/25 hover:text-neutral-700 focus-visible:outline-3 active:text-neutral-700 disabled:text-neutral-500 dark:text-neutral-400 dark:outline-white/25 dark:hover:text-neutral-200 dark:active:text-neutral-200 dark:disabled:text-neutral-400'
    },

    // ---- Square padding ----
    { size: 'xs', square: true, class: 'p-1' },
    { size: 'sm', square: true, class: 'p-1.5' },
    { size: 'md', square: true, class: 'p-1.5' },
    { size: 'lg', square: true, class: 'p-2' },
    { size: 'xl', square: true, class: 'p-2' }
  ],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md'
  }
})
