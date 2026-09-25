<script setup lang="ts">
/* ======================
        Imports
====================== */

import { RouterLink, RouterView } from 'vue-router'
// https://lucide.dev/guide/vue/getting-started
import { Cat } from '@lucide/vue'
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <main class="flex-1 p-6">
    <h1
      class="text-secondary-500 dark:text-primary-500 mb-6 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light uppercase"
    >
      _Random <Cat class="size-[1em]" stroke-width="1" />
    </h1>

    <div class="mb-6 flex justify-center gap-2">
      <RouterLink
        class="[&.router-link-active]:text-primary text-secondary font-semibold [&.router-link-active]:underline"
        to="/test/random/1"
        >Nested 1</RouterLink
      >
      <RouterLink
        class="[&.router-link-active]:text-primary text-secondary font-semibold [&.router-link-active]:underline"
        to="/test/random/2"
        >Nested 2</RouterLink
      >
    </div>

    <p>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Expedita laboriosam recusandae,
      neque vitae assumenda dolor labore esse saepe commodi reprehenderit quidem. Dolores eaque
      porro, architecto dolorum earum quo eos, ipsam dolorem exercitationem harum officia, pariatur
      ullam nihil nisi veritatis odit voluptate unde. Reiciendis assumenda, blanditiis illo
      voluptatibus nisi nesciunt, nam doloribus veritatis molestiae rerum aperiam aliquam harum
      maiores. Distinctio consectetur delectus quod! Voluptatibus perspiciatis ipsa repudiandae non
      aliquam. Totam, dignissimos, eius explicabo vitae a enim quidem accusamus accusantium illo
      alias corporis architecto fugiat expedita, fuga praesentium cumque pariatur mollitia ut
      debitis veniam nisi error odio? Porro maiores voluptas a laudantium!
    </p>

    <!-- 
    Just as in App.vue, we bring in the RouterView component from Vue Router.
    Note: It's also possible to render multiple routes with named RouterViews.
    See Udemy/Academind, section 13.183:

      https://www.udemy.com/course/vuejs-2-the-complete-guide/learn/lecture/21879376#overview
    -->
    <RouterView />
  </main>
</template>

<!-- <style scoped></style> -->
