<script setup lang="ts">
/* ======================
        Imports
====================== */

// https://router.vuejs.org/guide/advanced/composition-api.html

import { useRouter, useRoute } from 'vue-router'

// https://lucide.dev/guide/vue/getting-started
// import { } from '@lucide/vue'

const router = useRouter()

// In Vue 2, you could use this.$route.???
const _route = useRoute()

// console.log({
//   fullPath: route.fullPath,
//   hash: route.hash,
//   matched: route.matched,
//   meta: route.meta,
//   name: route.name,
//   params: route.params,
//   path: route.path,
//   query: route.query,
//   redirectedFrom: route.redirectedFrom
// })

/* ======================
      Props / Emits
====================== */

// ...

/* ======================
        Types
====================== */

// ...

/* ======================
    Refs (i.e., State)
====================== */

// ...

/* ======================
     Template Refs
====================== */

// ...

/* ======================
       Computed
====================== */

// ...

/* ======================
      Variables
====================== */

// ...

/* ======================
Event Handlers / Functions
====================== */

// ...
</script>

<!-- ======================================================================

======================================================================= -->
<!-- 

Simple name string:

  @click="router.push('/about')"

You can also navigate using a name:

   @click="router.push({ name: 'about' })"
-->
<template>
  <div>
    <button
      class="bg-secondary hover:bg-primary mx-auto block rounded px-2 py-1 text-sm font-semibold text-white"
      @click="router.push({ path: '/about', hash: '#abc123', query: { name: 'David Codina' } })"
    >
      Go To About Page
    </button>
  </div>
</template>
