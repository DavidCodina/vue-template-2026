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

// Todo: Review these resources on navigation guards.
// Navigation Guards: https://router.vuejs.org/guide/advanced/navigation-guards.html
// Academind:         https://www.udemy.com/course/vuejs-2-the-complete-guide/learn/lecture/21879388#overview
//                    https://www.udemy.com/course/vuejs-2-the-complete-guide/learn/lecture/21879396#overview

// ⚠️ Don't declare or call `next`: it's deprecated. If you pass it as a parameter, you'll get warned that it was never called.
// If you call it, you'll get warned that: "The `next()` callback in navigation guards is deprecated."
// So just don't use it.
router.beforeEach(async (to, from /*, next */) => {
  // console.log({ to, from })
  // ❌ next()
  // To reinstate normal behavior, either return nothing or return true.
  return true
})

// Academind: https://www.udemy.com/course/vuejs-2-the-complete-guide/learn/lecture/21879402#overview
// https://router.vuejs.org/guide/advanced/navigation-guards.html#Global-After-Hooks
router.afterEach(async (to, from) => {
  // console.log({ to, from })
})
