import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// Use the Nuxt UI Vue plugin
import ui from '@nuxt/ui/vue-plugin'

import App from './App.vue'
import router from './router'

/* ========================================================================

======================================================================== */

const app = createApp(App)

app.use(createPinia())

// The router instance gets registered globally in main.ts via app.use(router),
// and then <RouterView /> in App.vue is what actually renders the matched component
// — roughly Vue Router's equivalent of React Router's <Outlet />/<Routes> rendering area.
app.use(router)

app.use(ui)

app.mount('#app')
