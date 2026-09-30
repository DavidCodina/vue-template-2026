export type ButtonColor =
  'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral'

export type ButtonVariant = 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface ButtonUi {
  base?: string
  label?: string
  leadingIcon?: string
  trailingIcon?: string
}

export interface ButtonProps {
  label?: string
  /** @default 'primary' */
  color?: ButtonColor
  /** @default 'solid' */
  variant?: ButtonVariant
  /** @default 'md' */
  size?: ButtonSize
  /** Equal padding on all sides. Automatically enabled when there is no label and no default slot. */
  square?: boolean
  /** Render the button full width. */
  block?: boolean
  /** Show a spinner and disable the button. */
  loading?: boolean
  disabled?: boolean
  /** @default 'button' */
  type?: 'button' | 'submit' | 'reset'
  /**
   * Explicit prop (rather than a fallthrough attribute) so it can be merged through
   * tailwind-variants / tailwind-merge instead of being naively concatenated by Vue.
   */
  class?: any
  /** Per-slot class overrides. */
  ui?: ButtonUi
}
