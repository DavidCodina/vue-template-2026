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
