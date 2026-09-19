import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// Use the Nuxt UI Vue plugin
import ui from '@nuxt/ui/vue-plugin'

import App from './App.vue'
import router from './router'

import { RotateCw } from '@lucide/vue'

/* ========================================================================

======================================================================== */

const app = createApp(App)

app.use(createPinia())

// The router instance gets registered globally in main.ts via app.use(router),
// and then <RouterView /> in App.vue is what actually renders the matched component
// — roughly Vue Router's equivalent of React Router's <Outlet />/<Routes> rendering area.
app.use(router)

app.use(ui)

///////////////////////////////////////////////////////////////////////////
//
// This is used in src/views/TestView/OptionsAPIDemo2.vue
// It's merely added here to demonstrate the concept of a global compnents.
// But more generally, don't do this kind of thing in production.
//
// This is likely how Nuxt UI components work internally such that we never
// actually have to import them, and instead just do: <UButton label="Click me" />
//
///////////////////////////////////////////////////////////////////////////
app.component('RotateCw', RotateCw)

app.mount('#app')
