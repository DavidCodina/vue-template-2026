// Yes — Vue Router is the official, first-party routing library for Vue, maintained
// by the Vue core team (same org as Vue itself). It's the overwhelming default
// for production Vue SPAs, to the point where using something else would be unusual.
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView/index.vue'

/* ========================================================================

======================================================================== */
///////////////////////////////////////////////////////////////////////////
//
// Eager vs. lazy import:
//
// HomeView (eager, top-of-file import) → bundled into your main JS chunk, loads immediately.
// () => import('../views/AboutView.vue') (dynamic import, a function returning a promise)
// → Vite code-splits this into its own chunk, only fetched when the user navigates to /about.
//
// This is conceptually identical to React.lazy(() => import('./About')) + Suspense in React Router
// — same code-splitting idea, but Vue Router has it built in natively; you don't need a separate
// lazy/Suspense wrapper, just return a dynamic import from component.
//
///////////////////////////////////////////////////////////////////////////

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView/index.vue')
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestView/index.vue')
    },
    {
      path: '/test/:id',
      name: 'test-detail',
      component: () => import('../views/TestView/TestDetailView/index.vue'),
      ///////////////////////////////////////////////////////////////////////////
      //
      // props: true passes the route param to the component as a prop, so
      // the component doesn't need to depend on useRoute().
      //
      // Or, without props: true, using the composable:
      //
      //   import { useRoute } from 'vue-router'
      //   const route = useRoute()
      //   <h1>Test #{{ route.params.id }}</h1>
      //
      ///////////////////////////////////////////////////////////////////////////
      props: true
    }
  ]
})

export default router
