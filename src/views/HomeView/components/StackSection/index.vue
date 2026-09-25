<script setup lang="ts">
/* ======================
        Imports
====================== */

// ...

/* ======================
       Variables
====================== */

const stack = [
  {
    title: 'core',
    items: ['Vue 3 · Composition API', 'TypeScript', 'Vite', 'Nuxt 4']
  },
  {
    title: 'state & data',
    items: ['Pinia', 'TanStack Query', 'GraphQL', 'REST']
  },
  {
    title: 'styling & ui',
    items: ['Tailwind CSS', 'Nuxt UI', 'Design systems', 'Motion & transitions']
  },
  {
    title: 'testing & tooling',
    items: ['Vitest', 'Cypress', 'Playwright', 'GitHub Actions']
  },
  {
    title: 'adjacent',
    items: ['Node.js / Express', 'PostgreSQL', 'Figma handoff', 'WCAG AA accessibility']
  }
]
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section class="mx-auto max-w-300" :style="{}">
    <p class="text-muted mb-1 font-mono">~/stack</p>
    <h2 class="mb-10 text-3xl font-semibold uppercase md:text-4xl">Things I Use</h2>

    <div class="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      <div v-for="group in stack" :key="group.title" class="border-t pt-4">
        <h3 class="text-primary-500 font-mono text-sm">{{ group.title }}</h3>
        <ul class="text-muted mt-3 space-y-1.5 text-sm">
          <li v-for="item in group.items" :key="item">{{ item }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>
