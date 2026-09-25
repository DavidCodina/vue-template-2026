<script setup lang="ts">
/* ======================
        Imports
====================== */

// import { RouterLink } from 'vue-router'

/* ======================
      Variables
====================== */

const principles = [
  {
    n: '01',
    title: 'Ship the smallest correct thing',
    desc: 'Feature-flag and iterate in production rather than polishing in isolation.'
  },
  {
    n: '02',
    title: 'Accessibility is a default',
    desc: 'Keyboard navigation and screen-reader labeling land in the first PR, not a follow-up.'
  },
  {
    n: '03',
    title: 'Componentize around behavior',
    desc: 'APIs that stay stable even as the visual design changes underneath them.'
  },
  {
    n: '04',
    title: 'Measure before optimizing',
    desc: 'Real user metrics — Core Web Vitals, not intuition — decide what gets fixed first.'
  }
]
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section class="mx-auto max-w-300" :style="{}">
    <p class="text-muted font-monom b-1">~/principles</p>
    <h2 class="text-3xl font-semibold uppercase md:text-4xl">What I Practice</h2>

    <div class="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
      <div v-for="pr in principles" :key="pr.n" class="flex gap-4">
        <span class="text-primary-500 font-mono">{{ pr.n }}</span>
        <div>
          <h3 class="font-medium">{{ pr.title }}</h3>
          <p class="text-muted mt-1 text-sm leading-relaxed">
            {{ pr.desc }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
