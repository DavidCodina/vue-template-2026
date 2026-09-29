// https://storybook.js.org/docs/get-started/frameworks/vue3-vite
// Storybook creates its own Vue 3 app for the preview. Any global components,
// directives, or plugins (app.use) have to be configured in .storybook/preview.ts
// using the exported setup function. In other words, the app's main.ts never runs
// in Storybook, so you need to recreate the important parts here.

import { reactive } from 'vue'
import { setup } from '@storybook/vue3-vite'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'
import ui from '@nuxt/ui/vue-plugin'
import { appStateKey } from '@/keys'
import '@/assets/main.css'

import type { AppState } from '@/types'
import type { Preview } from '@storybook/vue3-vite'

//^ https://storybook.js.org/recipes/pinia
const pinia = createPinia()

const appState = reactive<AppState>({
  routerKey: 1
})

///////////////////////////////////////////////////////////////////////////
//
// Note: App.vue also provides appState: provide(appStateKey, appState)
//
// App.vue also does this, which is needed for useToast, tooltips, and overlays work.
//
//    <UApp :toaster="toaster">
//     </UApp>
//
// For certain components, we may need to create a .storybook/StoryWrapper.vue:
//
// Todo:
//# UApp is still the missing piece. Until you create StoryWrapper.vue and enable the decorator,
//# stories that call useToast, use tooltips, or open overlays won't work.
//
//   <script setup lang="ts">
//     const toaster = { position: 'top-right' as const }
//   </script>
//   <template>
//     <UApp :toaster="toaster">
//       <slot />
//     </UApp>
//   </template>
//
// Since this is an SFC, the Vite plugin auto-resolves UApp. Then in preview.ts
// add it as a global decorator (see below).
//
///////////////////////////////////////////////////////////////////////////

setup((app) => {
  ///////////////////////////////////////////////////////////////////////////
  //
  // ⚠️ Note: With routes: [], anything that navigates or reads the route can produce "No match found
  // for location" warnings. That includes <RouterLink to="/settings">, router.push(...),
  // and Nuxt UI components that take a to prop. A simple fix is a catch-all route so every
  // path resolves quietly.
  //
  // Limitation: with only a catch-all, route.name is always 'not-found'. If a component under test
  // branches on route.name or route.params (e.g. highlighting an active nav item), you'll want to pass
  // in real route records instead, or push a specific route in a decorator or beforeEach. For a component
  // like your Pinia demo, you don't need that.
  //
  ///////////////////////////////////////////////////////////////////////////
  const router = createRouter({
    routes: [
      {
        path: '/:notFound(.*)*',
        name: 'not-found',
        component: { render: () => null }
      }
    ],
    history: createMemoryHistory()
  })

  app.use(pinia)
  // Note that there's also an associated addon, but we may not need it.
  //https://storybook.js.org/addons/storybook-vue3-router
  app.use(router)
  app.provide(appStateKey, appState)
  app.use(ui)
})

const preview: Preview = {
  // decorators: [
  //   (story) => ({
  //     components: { story, StoryWrapper },
  //     template: '<StoryWrapper><story /></StoryWrapper>'
  //   })
  // ],
  tags: ['autodocs'],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  }
}

export default preview
