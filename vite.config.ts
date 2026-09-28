import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
// https://ui.nuxt.com/docs/getting-started/installation/vue
import ui from '@nuxt/ui/vite'
// ❌ import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/vue-template-2026/', // https://github.com/DavidCodina/vue-template-2026

  plugins: [
    vue(),
    vueDevTools(),
    // @nuxt/ui lists @tailwindcss/vite as one of its own dependencies.
    // Nuxt UI's ui() Vite plugin internally wraps and registers @tailwindcss/vite for you.
    // When you call ui() in your plugins array, it's already running Tailwind's Vite integration behind the scenes.
    // Drop the explicit plugin, since ui() already includes it. Additionally, you can also remove @tailwindcss/vite
    // from your package.json dependencies entirely, since @nuxt/ui pulls it in transitively
    // ❌ tailwindcss(),

    ui({
      // theme: { colors: [] },
      ui: {
        // You can only use colors that exist in your theme. Either:
        //  - Use Tailwind's default colors (like blue, green, zinc)
        //  - Define custom colors first using the @theme directive (like brand in our example above)
        colors: {
          // This may seem redundant, but it's actually what gets the theme colors
          // in main.css to update the Nuxt UI --ui-*-* CSS color variables
          primary: 'primary',
          secondary: 'secondary',
          error: 'rose'
        },
        // https://ui.nuxt.com/docs/components/toast#theme
        toast: {
          slots: {
            root: 'bg-card [&_[data-slot=base]]:bg-card-accented ring-0 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.15)]',
            // Wraps title and description
            wrapper: ''
          },

          variants: {
            color: {
              error: {
                root: 'border border-error-500',
                base: '',
                title: 'text-error-500 text-lg',
                description: 'text-error-500 ',
                // Unfortunately Nuxt UI treats setting the actual
                // icon as a prop only on the toast instance.
                close: 'text-error-500/80 hover:text-error-500 [&_svg]:size-6',
                wrapper: '',
                icon: 'size-8 text-error-500',
                progress: '[&_[data-slot=indicator]]:bg-error-500'
              },
              success: {
                root: 'border border-success-500',
                base: '',
                title: 'text-success-500 text-lg',
                description: 'text-success-500',

                close: 'text-success-500/80 hover:text-success-500 [&_svg]:size-6',
                wrapper: '',
                icon: 'size-8 text-success-500',
                progress: '[&_[data-slot=indicator]]:bg-success-500'
              }
            }
          }
        }
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
  // server: {
  //   port: 3000
  // }
})
