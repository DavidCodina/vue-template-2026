<script setup lang="ts">
/* ======================
        Imports
====================== */

// import {  } from 'vue-router'
import { FlaskConical } from '@lucide/vue'
import { onMounted } from 'vue'
import { sleep } from '@/utils/sleep'

/* ======================
    Component Options
====================== */

// ...

/* ======================
      Composables
====================== */

// ...

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
  Methods / Functions
====================== */

// ...

/* ======================
     Lifecycle Hooks
====================== */

onMounted(async () => {
  try {
    await sleep(3000)
    console.log('TestView.vue mounted!')
  } catch (_err) {
    // ...
  }
})

/* ======================
       Watchers
====================== */

// ...

/* ======================
    Provide / Inject
====================== */

// ...

/* ======================
        Expose
====================== */
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <main class="flex-1 p-6">
    <h1
      class="text-secondary dark:text-primary mb-6 flex justify-center gap-2 font-[Chakra_Petch] text-5xl font-light uppercase"
    >
      _Test <FlaskConical class="size-[1em]" stroke-width="1" />
    </h1>
  </main>
</template>
