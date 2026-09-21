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
      alias: '/home',
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
      meta: { test: 'Testing 123...' },
      component: () => import('../views/TestView/index.vue')
    },

    ///////////////////////////////////////////////////////////////////////////
    //
    // Old Vue Router 3 Behavior: Routes were matched in the order you defined them, first match wins.
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
      component: () => import('../views/TestView/RandomView/index.vue'),

      redirect: { name: 'random-1' }, // ✅
      // Nested Routes: See Udemy/Academind, section 13.180
      children: [
        ///////////////////////////////////////////////////////////////////////////
        //
        // ⚠️ Gotcha: Browser Console Error
        //
        //   The route named "random" has a child without a name, an empty path, and no children.
        //   Using that name won't render the empty path child, so this is probably a mistake.
        //
        ///////////////////////////////////////////////////////////////////////////
        // ❌ { path: '', redirect: { name: 'random-1' } },
        {
          // If you want this content to show up by default, you can set path: '' here.
          // However, the cleaner option is to use a redirect. Iniitially, I used the
          // commented out redirect above. While it works, it causes a browser warning.
          // Solution: move the redirect to the parent instead.
          path: '1',
          name: 'random-1',
          component: () => import('../views/TestView/RandomView/NestedView1.vue')
        },
        {
          path: '2',
          name: 'random-2',
          component: () => import('../views/TestView/RandomView/NestedView2.vue')
        }
      ]
    },

    // Todo: For a slightly more legitimate example, we can create a users route that
    //# fetches from https://jsonplaceholder.typicode.com/users, then create a corresponding
    //# users/:id page.

    {
      // ⚠️ Gotcha: If you're at '/test/1' and you have a link to go to '/test/2', it won't work.
      // More specifically, the associated data that was loaded may not change. The solution
      // was is tou se a watcher. I haven't run into this issue yet, but it's  discussed here:
      // https://www.udemy.com/course/vuejs-2-the-complete-guide/learn/lecture/21879350#overview
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
    },

    ///////////////////////////////////////////////////////////////////////////
    //
    // This route should be last.
    // Initially, I had '/:pathMatch(.*)*', but changed it to '/:notFound(.*)*'.
    // I've also seen people use '/:catchAll(.*)*'. In any case, the part
    // immediately after the colon seems arbitrary when defining a catch-all route.
    // See Udemy/Academind, section 13.179 @4:30.
    //
    ///////////////////////////////////////////////////////////////////////////
    {
      path: '/:notFound(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView/index.vue')
    }
  ],
  // Todo: Test this.
  // Academind: https://www.udemy.com/course/vuejs-2-the-complete-guide/learn/lecture/21879382#overview
  scrollBehavior(to, from, savedPosition) {
    // console.log({
    //   to,
    //   from,
    //   savedPosition
    // })

    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, left: 0 }
  }
})

export default router
