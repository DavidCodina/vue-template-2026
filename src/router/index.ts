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

    ///////////////////////////////////////////////////////////////////////////
    //
    // Vue Router 3: Routes were matched in the order you defined them, first match wins.
    // If /test/:id came first, /test/random would match it, and cause random to be treated
    // as an :id param. However, in Vue Router 4+ (we're using 5), routes are ranked by specificity,
    // not by definition order. The router scores each route's path segments, and static segments
    // score higher than dynamic ones. So /test/random always beats /test/:id for the URL
    // /test/random, regardless of where you put it in the array.
    //
    // When order still matters in v4+:
    // Only when two routes have the same score. In that case, the one defined first wins.
    // This is rare, but it can happen with things like two routes that both use the same kind
    // of dynamic segment or overlapping custom regexes. For example, /:foo and /:bar are
    // equivalent in specificity, so whichever comes first wins.
    //
    ///////////////////////////////////////////////////////////////////////////
    {
      path: '/test/random',
      name: 'random',
      component: () => import('../views/TestView/RandomView/index.vue')
    },

    // Todo: For a slightly more legitimate example, we can create a users route that
    //# fetches from https://jsonplaceholder.typicode.com/users, then create a corresponding
    //# users/:id page.
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
