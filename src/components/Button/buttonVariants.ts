import { tv } from 'tailwind-variants'

// Note: any Tailwind conflict will be resolved implicitly by tv() from tailwind-variants.
// It runs tailwind-merge on its output by default, so you get cn()-style conflict resolution
// without calling cn() yourself.

//! I don't love buttons that get lighter on hover in light and darker on hover in dark.
//! This is being done with a /75 opacity which is very ugly!!!

// aria-diabled is especially useful on <a> and <RouterLink> because, which don't have a disabled attribute.
export const buttonVariants = tv({
  slots: {
    base: `
    rounded-md font-semibold inline-flex items-center 
    disabled:cursor-not-allowed disabled:opacity-75
    aria-disabled:cursor-not-allowed aria-disabled:opacity-75 
    transition-colors select-none
    `,
    // truncate would NOT have the same effect if you merely put it directly on the <button>.
    label: 'truncate',
    leadingIcon: 'shrink-0',
    // leadingAvatar: 'shrink-0',
    // leadingAvatarSize: '',
    trailingIcon: 'shrink-0 '
  },
  variants: {
    fieldGroup: {
      horizontal:
        'not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]',
      vertical:
        'not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]'
    },

    color: {
      primary: '',
      secondary: '',
      success: '',
      info: '',
      warning: '',
      error: '',
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
      xs: {
        base: 'px-2 py-1 text-xs gap-1',
        leadingIcon: 'size-4',
        // leadingAvatarSize: '3xs',
        trailingIcon: 'size-4'
      },
      sm: {
        base: 'px-2.5 py-1.5 text-xs gap-1.5',
        leadingIcon: 'size-4',
        // leadingAvatarSize: '3xs',
        trailingIcon: 'size-4'
      },
      md: {
        base: 'px-2.5 py-1.5 text-sm gap-1.5',
        leadingIcon: 'size-5',
        // leadingAvatarSize: '2xs',
        trailingIcon: 'size-5'
      },
      lg: {
        base: 'px-3 py-2 text-sm gap-2',
        leadingIcon: 'size-5',
        leadingAvatarSize: '2xs',
        trailingIcon: 'size-5'
      },
      xl: {
        base: 'px-3 py-2 text-base gap-2',
        leadingIcon: 'size-6',
        // leadingAvatarSize: 'xs',
        trailingIcon: 'size-6'
      }
    },

    block: {
      true: {
        // Note that block does NOT actually set the button to display:flex or display:block.
        base: 'w-full justify-center',
        // Very similar to ml-auto but respects ltr/rtl.
        // ms-auto (or ml-auto) is arguably an opinionated default.
        // Also this is ONLY applied to the trailingIcon. In practice,
        // it kind of makes sense, but it's not going to be what you
        // want 100% of the time.
        trailingIcon: 'ms-auto'
      }
    },

    square: {
      true: ''
    },
    leading: {
      true: ''
    },
    trailing: {
      true: ''
    },
    loading: {
      true: ''
    },
    active: {
      true: {
        base: ''
      },
      false: {
        base: ''
      }
    }
  },

  compoundVariants: [
    /* ========================================================================
                                    Primary
    ======================================================================== */

    {
      color: 'primary',
      variant: 'solid',
      class: `
      text-white
      bg-primary
      outline -outline-offset-1
      outline-[oklch(from_var(--ui-primary)_calc(l_-_0.1)_c_h)]
      dark:outline-[oklch(from_var(--ui-primary)_calc(l_+_0.1)_c_h)] 
      hover:bg-primary/85
      focus-visible:ring-[3px]
      focus-visible:ring-primary/50
      active:bg-primary/85
      disabled:bg-primary
      aria-disabled:bg-primary `
    },

    {
      color: 'primary',
      variant: 'outline',
      // Below we are using oklch() relative color syntax for hover:outline color.
      // This is especially important for primary and secondary. Had we hardcoded
      // the hover:outline color, then any change to --ui-primary or --ui-secondary,
      // whether it be the overall color or the shade would disrupt the relative
      // hover:outline color. In other words, the precise relationship would otherwise
      // be very brittle. By leveraging relative color syntax here it remains consistent.
      class: `
      text-primary 
      outline -outline-offset-1 outline-primary   
      hover:bg-primary 
      hover:outline-[oklch(from_var(--ui-primary)_calc(l_-_0.1)_c_h)] 
      dark:hover:outline-[oklch(from_var(--ui-primary)_calc(l_+_0.1)_c_h)] 
      hover:text-white
      focus-visible:ring-[3px]
      focus-visible:ring-primary/50
      active:bg-primary
      disabled:bg-transparent dark:disabled:bg-transparent
      aria-disabled:bg-transparent dark:aria-disabled:bg-transparent
      `
    },
    {
      color: 'primary',
      variant: 'soft',
      class: `
      text-primary bg-primary/10 hover:bg-primary/15
      active:bg-primary/15 outline-primary/25 
      focus-visible:outline-3 disabled:bg-primary/10
      aria-disabled:bg-primary/10
      `
    },
    {
      color: 'primary',
      variant: 'subtle',
      class:
        'text-primary ring ring-inset ring-primary/25 bg-primary/10 hover:bg-primary/15 active:bg-primary/15 disabled:bg-primary/10 aria-disabled:bg-primary/10 outline-primary/25 focus-visible:outline-3 focus-visible:ring-primary'
    },
    {
      color: 'primary',
      variant: 'ghost',
      class:
        'text-primary hover:bg-primary/10 active:bg-primary/10 outline-primary/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent'
    },
    {
      color: 'primary',
      variant: 'link',
      class:
        'text-primary hover:text-primary/75 active:text-primary/75 disabled:text-primary aria-disabled:text-primary outline-primary/25 focus-visible:outline-3'
    },

    /* ========================================================================
                                    Secondary
    ======================================================================== */

    {
      color: 'secondary',
      variant: 'solid',
      class: `
      text-white
      bg-secondary
      outline -outline-offset-1
      outline-[oklch(from_var(--ui-secondary)_calc(l_-_0.1)_c_h)]
      dark:outline-[oklch(from_var(--ui-secondary)_calc(l_+_0.1)_c_h)] 
      hover:bg-secondary/85
      focus-visible:ring-[3px]
      focus-visible:ring-secondary/50
      active:bg-secondary/85
      disabled:bg-secondary
      aria-disabled:bg-secondary `
    },
    {
      color: 'secondary',
      variant: 'outline',
      class: `
      text-secondary 
      outline -outline-offset-1 outline-secondary   
      hover:bg-secondary 
      hover:outline-[oklch(from_var(--ui-secondary)_calc(l_-_0.1)_c_h)] 
      dark:hover:outline-[oklch(from_var(--ui-secondary)_calc(l_+_0.1)_c_h)] 
      hover:text-white
      focus-visible:ring-[3px]
      focus-visible:ring-secondary/50
      active:bg-secondary
      disabled:bg-transparent dark:disabled:bg-transparent
      aria-disabled:bg-transparent dark:aria-disabled:bg-transparent
      `
    },
    {
      color: 'secondary',
      variant: 'soft',
      class:
        'text-secondary bg-secondary/10 hover:bg-secondary/15 active:bg-secondary/15 outline-secondary/25 focus-visible:outline-3 disabled:bg-secondary/10 aria-disabled:bg-secondary/10'
    },
    {
      color: 'secondary',
      variant: 'subtle',
      class:
        'text-secondary ring ring-inset ring-secondary/25 bg-secondary/10 hover:bg-secondary/15 active:bg-secondary/15 disabled:bg-secondary/10 aria-disabled:bg-secondary/10 outline-secondary/25 focus-visible:outline-3 focus-visible:ring-secondary'
    },
    {
      color: 'secondary',
      variant: 'ghost',
      class:
        'text-secondary hover:bg-secondary/10 active:bg-secondary/10 outline-secondary/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent'
    },
    {
      color: 'secondary',
      variant: 'link',
      class:
        'text-secondary hover:text-secondary/75 active:text-secondary/75 disabled:text-secondary aria-disabled:text-secondary outline-secondary/25 focus-visible:outline-3'
    },

    /* ========================================================================
                                  _Success
    ======================================================================== */

    {
      color: 'success',
      variant: 'solid',
      class: `
      text-white
      bg-success
      outline -outline-offset-1
      outline-[oklch(from_var(--ui-success)_calc(l_-_0.1)_c_h)]
      dark:outline-[oklch(from_var(--ui-success)_calc(l_+_0.1)_c_h)] 
      hover:bg-success/85
      focus-visible:ring-[3px]
      focus-visible:ring-success/50
      active:bg-success/85
      disabled:bg-success
      aria-disabled:bg-success `
    },
    {
      color: 'success',
      variant: 'outline',
      class: `
      text-success 
      outline -outline-offset-1 outline-success   
      hover:bg-success 
      hover:outline-[oklch(from_var(--ui-success)_calc(l_-_0.1)_c_h)] 
      dark:hover:outline-[oklch(from_var(--ui-success)_calc(l_+_0.1)_c_h)] 
      hover:text-white
      focus-visible:ring-[3px]
      focus-visible:ring-success/50
      active:bg-success
      disabled:bg-transparent dark:disabled:bg-transparent
      aria-disabled:bg-transparent dark:aria-disabled:bg-transparent
      `
    },
    {
      color: 'success',
      variant: 'soft',
      class:
        'text-success bg-success/10 hover:bg-success/15 active:bg-success/15 outline-success/25 focus-visible:outline-3 disabled:bg-success/10 aria-disabled:bg-success/10'
    },
    {
      color: 'success',
      variant: 'subtle',
      class:
        'text-success ring ring-inset ring-success/25 bg-success/10 hover:bg-success/15 active:bg-success/15 disabled:bg-success/10 aria-disabled:bg-success/10 outline-success/25 focus-visible:outline-3 focus-visible:ring-success'
    },
    {
      color: 'success',
      variant: 'ghost',
      class:
        'text-success hover:bg-success/10 active:bg-success/10 outline-success/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent'
    },
    {
      color: 'success',
      variant: 'link',
      class:
        'text-success hover:text-success/75 active:text-success/75 disabled:text-success aria-disabled:text-success outline-success/25 focus-visible:outline-3'
    },

    /* ========================================================================
                                  _Info
    ======================================================================== */

    {
      color: 'info',
      variant: 'solid',
      class: `
      text-white
      bg-info
      outline -outline-offset-1
      outline-[oklch(from_var(--ui-info)_calc(l_-_0.1)_c_h)]
      dark:outline-[oklch(from_var(--ui-info)_calc(l_+_0.1)_c_h)] 
      hover:bg-info/85
      focus-visible:ring-[3px]
      focus-visible:ring-info/50
      active:bg-info/85
      disabled:bg-info
      aria-disabled:bg-info `
    },
    {
      color: 'info',
      variant: 'outline',
      class: `
      text-info 
      outline -outline-offset-1 outline-info   
      hover:bg-info 
      hover:outline-[oklch(from_var(--ui-info)_calc(l_-_0.1)_c_h)] 
      dark:hover:outline-[oklch(from_var(--ui-info)_calc(l_+_0.1)_c_h)] 
      hover:text-white
      focus-visible:ring-[3px]
      focus-visible:ring-info/50
      active:bg-info
      disabled:bg-transparent dark:disabled:bg-transparent
      aria-disabled:bg-transparent dark:aria-disabled:bg-transparent
      `
    },
    {
      color: 'info',
      variant: 'soft',
      class:
        'text-info bg-info/10 hover:bg-info/15 active:bg-info/15 outline-info/25 focus-visible:outline-3 disabled:bg-info/10 aria-disabled:bg-info/10'
    },
    {
      color: 'info',
      variant: 'subtle',
      class:
        'text-info ring ring-inset ring-info/25 bg-info/10 hover:bg-info/15 active:bg-info/15 disabled:bg-info/10 aria-disabled:bg-info/10 outline-info/25 focus-visible:outline-3 focus-visible:ring-info'
    },
    {
      color: 'info',
      variant: 'ghost',
      class:
        'text-info hover:bg-info/10 active:bg-info/10 outline-info/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent'
    },
    {
      color: 'info',
      variant: 'link',
      class:
        'text-info hover:text-info/75 active:text-info/75 disabled:text-info aria-disabled:text-info outline-info/25 focus-visible:outline-3'
    },
    /* ========================================================================
                                  _Warning
    ======================================================================== */

    {
      color: 'warning',
      variant: 'solid',
      class: `
      text-white
      bg-warning
      outline -outline-offset-1
      outline-[oklch(from_var(--ui-warning)_calc(l_-_0.1)_c_h)]
      dark:outline-[oklch(from_var(--ui-warning)_calc(l_+_0.1)_c_h)] 
      hover:bg-warning/85
      focus-visible:ring-[3px]
      focus-visible:ring-warning/50
      active:bg-warning/85
      disabled:bg-warning
      aria-disabled:bg-warning `
    },
    {
      color: 'warning',
      variant: 'outline',
      class: `
      text-warning 
      outline -outline-offset-1 outline-warning   
      hover:bg-warning 
      hover:outline-[oklch(from_var(--ui-warning)_calc(l_-_0.1)_c_h)] 
      dark:hover:outline-[oklch(from_var(--ui-warning)_calc(l_+_0.1)_c_h)] 
      hover:text-white
      focus-visible:ring-[3px]
      focus-visible:ring-warning/50
      active:bg-warning
      disabled:bg-transparent dark:disabled:bg-transparent
      aria-disabled:bg-transparent dark:aria-disabled:bg-transparent
      `
    },
    {
      color: 'warning',
      variant: 'soft',
      class:
        'text-warning bg-warning/10 hover:bg-warning/15 active:bg-warning/15 outline-warning/25 focus-visible:outline-3 disabled:bg-warning/10 aria-disabled:bg-warning/10'
    },
    {
      color: 'warning',
      variant: 'subtle',
      class:
        'text-warning ring ring-inset ring-warning/25 bg-warning/10 hover:bg-warning/15 active:bg-warning/15 disabled:bg-warning/10 aria-disabled:bg-warning/10 outline-warning/25 focus-visible:outline-3 focus-visible:ring-warning'
    },
    {
      color: 'warning',
      variant: 'ghost',
      class:
        'text-warning hover:bg-warning/10 active:bg-warning/10 outline-warning/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent'
    },
    {
      color: 'warning',
      variant: 'link',
      class:
        'text-warning hover:text-warning/75 active:text-warning/75 disabled:text-warning aria-disabled:text-warning outline-warning/25 focus-visible:outline-3'
    },

    /* ========================================================================
                                     Error
    ======================================================================== */

    {
      color: 'error',
      variant: 'solid',
      class: `
      text-white
      bg-error
      outline -outline-offset-1
      outline-[oklch(from_var(--ui-error)_calc(l_-_0.1)_c_h)]
      dark:outline-[oklch(from_var(--ui-error)_calc(l_+_0.1)_c_h)] 
      hover:bg-error/85
      focus-visible:ring-[3px]
      focus-visible:ring-error/50
      active:bg-error/85
      disabled:bg-error
      aria-disabled:bg-error `
    },
    {
      color: 'error',
      variant: 'outline',
      class: `
      text-error 
      outline -outline-offset-1 outline-error   
      hover:bg-error 
      hover:outline-[oklch(from_var(--ui-error)_calc(l_-_0.1)_c_h)] 
      dark:hover:outline-[oklch(from_var(--ui-error)_calc(l_+_0.1)_c_h)] 
      hover:text-white
      focus-visible:ring-[3px]
      focus-visible:ring-error/50
      active:bg-error
      disabled:bg-transparent dark:disabled:bg-transparent
      aria-disabled:bg-transparent dark:aria-disabled:bg-transparent
      `
    },
    {
      color: 'error',
      variant: 'soft',
      class:
        'text-error bg-error/10 hover:bg-error/15 active:bg-error/15 outline-error/25 focus-visible:outline-3 disabled:bg-error/10 aria-disabled:bg-error/10'
    },
    {
      color: 'error',
      variant: 'subtle',
      class:
        'text-error ring ring-inset ring-error/25 bg-error/10 hover:bg-error/15 active:bg-error/15 disabled:bg-error/10 aria-disabled:bg-error/10 outline-error/25 focus-visible:outline-3 focus-visible:ring-error'
    },
    {
      color: 'error',
      variant: 'ghost',
      class:
        'text-error hover:bg-error/10 active:bg-error/10 outline-error/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent'
    },
    {
      color: 'error',
      variant: 'link',
      class:
        'text-error hover:text-error/75 active:text-error/75 disabled:text-error aria-disabled:text-error outline-error/25 focus-visible:outline-3'
    },

    /* ========================================================================
                                      Neutral
    ======================================================================== */

    {
      color: 'neutral',
      variant: 'solid',
      class: `
      text-inverted
      bg-[oklch(from_var(--ui-bg-inverted)_calc(l_+_0.15)_c_h)] dark:bg-[oklch(from_var(--ui-bg-inverted)_calc(l_-_0.025)_c_h)]
      outline -outline-offset-1
      outline-[oklch(from_var(--ui-bg-inverted)_calc(l_-_0.1)_c_h)]
      dark:outline-white
      hover:bg-inverted/75
      focus-visible:ring-[3px]
      focus-visible:ring-inverted/50
      active:bg-inverted/75
      disabled:bg-inverted
      aria-disabled:bg-inverted
      `
    },
    {
      color: 'neutral',
      variant: 'outline',
      class: `
      text-highlighted
      outline -outline-offset-1 outline-inverted  
      hover:bg-[oklch(from_var(--ui-bg-inverted)_calc(l_+_0.15)_c_h)]
      dark:hover:bg-[oklch(from_var(--ui-bg-inverted)_calc(l_-_0.025)_c_h)]
      hover:outline-[oklch(from_var(--ui-bg-inverted)_calc(l_-_0.1)_c_h)] 
      dark:hover:outline-white
      hover:text-inverted
      focus-visible:ring-[3px]
      focus-visible:ring-inverted/50
      active:bg-inverted
      disabled:bg-transparent dark:disabled:bg-transparent
      aria-disabled:bg-transparent dark:aria-disabled:bg-transparent
      `
    },
    {
      color: 'neutral',
      variant: 'soft',
      class:
        'text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 outline-inverted/25 focus-visible:outline-3 disabled:bg-elevated aria-disabled:bg-elevated'
    },
    {
      color: 'neutral',
      variant: 'subtle',
      class:
        'ring ring-inset ring-accented text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 disabled:bg-elevated aria-disabled:bg-elevated outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted'
    },
    {
      color: 'neutral',
      variant: 'ghost',
      class:
        'text-default hover:bg-elevated active:bg-elevated outline-inverted/25 focus-visible:outline-3 hover:disabled:bg-transparent dark:hover:disabled:bg-transparent hover:aria-disabled:bg-transparent dark:hover:aria-disabled:bg-transparent'
    },
    {
      color: 'neutral',
      variant: 'link',
      class:
        'text-muted hover:text-default active:text-default disabled:text-muted aria-disabled:text-muted outline-inverted/25 focus-visible:outline-3'
    },

    /* ========================================================================
                                          Square Sizes
    ======================================================================== */

    {
      size: 'xs',
      square: true,
      class: 'p-1'
    },
    {
      size: 'sm',
      square: true,
      class: 'p-1.5'
    },
    {
      size: 'md',
      square: true,
      class: 'p-1.5'
    },
    {
      size: 'lg',
      square: true,
      class: 'p-2'
    },
    {
      size: 'xl',
      square: true,
      class: 'p-2'
    },

    /* ========================================================================
                                  Loading Icon Styles
    ======================================================================== */

    {
      loading: true,
      leading: true,
      class: {
        leadingIcon: 'animate-spin'
      }
    },
    {
      loading: true,
      leading: false,
      trailing: true,
      class: {
        trailingIcon: 'animate-spin'
      }
    }
  ],

  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md'
  }
})
