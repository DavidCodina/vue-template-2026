<script setup lang="ts">
/* ======================
        Imports
====================== */

import { computed, ref } from 'vue'

/* ======================
        Variables
====================== */

const categories = ['All', 'Product', 'Freelance', 'Open Source']

const projects = [
  {
    name: 'Cartographer',
    category: 'Product',
    desc: 'Real-time logistics dashboard — route maps, live status boards, and alerting for dispatch teams.',
    tags: ['Vue 3', 'Pinia', 'D3', 'WebSockets'],
    mockup: `<rect x="10" y="34" width="70" height="126" fill="none" stroke="var(--ui-border)"/>
                <rect x="20" y="48" width="50" height="6" fill="var(--ui-border)"/>
                <rect x="20" y="62" width="50" height="6" fill="var(--ui-border)"/>
                <rect x="20" y="76" width="35" height="6" fill="var(--ui-border)"/>
                <rect x="90" y="34" width="220" height="60" fill="none" stroke="var(--ui-border)"/>
                <polyline points="98,80 130,58 155,70 180,46 205,64 230,52 255,60 302,44" fill="none" stroke="var(--ui-color-primary-500)" stroke-width="1.6"/>
                <rect x="90" y="104" width="105" height="56" fill="none" stroke="var(--ui-border)"/>
                <rect x="205" y="104" width="105" height="56" fill="none" stroke="var(--ui-border)"/>`
  },
  {
    name: 'Loom',
    category: 'Freelance',
    desc: 'Headless storefront for a small home-goods brand — product catalog, cart, and checkout on Nuxt.',
    tags: ['Nuxt 3', 'TypeScript', 'Tailwind'],
    mockup: `<rect x="10" y="34" width="300" height="30" fill="none" stroke="var(--ui-border)"/>
                <rect x="18" y="44" width="40" height="10" fill="var(--ui-border)"/>
                <rect x="270" y="44" width="18" height="10" fill="var(--ui-color-primary-500)"/>
                <g stroke="var(--ui-border)" fill="none">
                  <rect x="10" y="74" width="92" height="86"/>
                  <rect x="114" y="74" width="92" height="86"/>
                  <rect x="218" y="74" width="92" height="86"/>
                </g>
                <line x1="24" y1="150" x2="88" y2="150" stroke="var(--ui-border)"/>
                <line x1="128" y1="150" x2="192" y2="150" stroke="var(--ui-border)"/>
                <line x1="232" y1="150" x2="296" y2="150" stroke="var(--ui-border)"/>`
  },
  {
    name: 'Signal UI',
    category: 'Open Source',
    desc: 'An accessible, headless-first Vue component library — used across several of the projects above.',
    tags: ['Vue 3', 'ARIA', 'Vitest'],
    mockup: `<rect x="10" y="34" width="300" height="126" fill="none" stroke="var(--ui-border)"/>
                <rect x="26" y="50" width="90" height="26" rx="2" fill="none" stroke="var(--ui-color-primary-500)"/>
                <rect x="126" y="50" width="90" height="26" rx="2" fill="none" stroke="var(--ui-border)"/>
                <circle cx="250" cy="63" r="13" fill="none" stroke="var(--ui-border)"/>
                <rect x="26" y="94" width="264" height="10" fill="var(--ui-border)"/>
                <rect x="26" y="112" width="180" height="10" fill="var(--ui-border)"/>
                <rect x="26" y="132" width="60" height="18" fill="var(--ui-color-primary-500)" opacity="0.15" stroke="var(--ui-color-primary-500)"/>`
  },
  {
    name: 'Ledger',
    category: 'Product',
    desc: 'Multi-step onboarding rebuild for a fintech client, cutting drop-off with clearer form validation.',
    tags: ['Vue 3', 'TypeScript', 'Vitest'],
    mockup: `<circle cx="60" cy="60" r="14" fill="none" stroke="var(--ui-color-primary-500)"/>
                <line x1="74" y1="60" x2="130" y2="60" stroke="var(--ui-border)"/>
                <circle cx="145" cy="60" r="14" fill="none" stroke="var(--ui-color-primary-500)"/>
                <line x1="159" y1="60" x2="215" y2="60" stroke="var(--ui-border)"/>
                <circle cx="230" cy="60" r="14" fill="none" stroke="var(--ui-border)"/>
                <rect x="30" y="96" width="260" height="14" fill="none" stroke="var(--ui-border)"/>
                <rect x="30" y="120" width="260" height="14" fill="none" stroke="var(--ui-border)"/>
                <rect x="30" y="144" width="90" height="14" fill="var(--ui-color-primary-500)" opacity="0.85"/>`
  }
]

/* ======================
         Refs
====================== */

const activeCategory = ref('All')

/* ======================
      Computed
====================== */

const filteredProjects = computed(() =>
  activeCategory.value === 'All'
    ? projects
    : projects.filter((p) => p.category === activeCategory.value)
)
</script>

<!-- ======================================================================

======================================================================= -->

<!-- <section class="mx-auto grid items-center gap-12 lg:grid-cols-2"> -->
<template>
  <section id="work" class="mx-auto max-w-300" :style="{}">
    <div>
      <div class="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p class="text-muted mb-1 font-mono">~/work</p>
          <h2 class="text-3xl font-semibold uppercase md:text-4xl">Selected Projects</h2>
        </div>

        <div class="flex flex-wrap gap-5 font-mono text-sm">
          <button
            v-for="cat in categories"
            :key="cat"
            @click="activeCategory = cat"
            class="tab pb-1"
            :data-active="activeCategory === cat"
            :class="activeCategory === cat ? '' : 'text-muted hover:text-primary-500'"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div class="grid gap-x-8 gap-y-12 sm:grid-cols-2">
        <div v-for="p in filteredProjects" :key="p.name" class="border border-(--ui-border)">
          <!-- wireframe preview -->
          <div class="border-b border-(--ui-border) p-4" :style="{}">
            <svg viewBox="0 0 320 170" class="h-auto w-full" aria-hidden="true">
              <rect
                x="0.5"
                y="0.5"
                width="319"
                height="169"
                fill="none"
                stroke="var(--ui-border)"
              />
              <circle cx="14" cy="14" r="3" fill="var(--ui-border)" />
              <circle cx="26" cy="14" r="3" fill="var(--ui-border)" />
              <circle cx="38" cy="14" r="3" fill="var(--ui-border)" />
              <line x1="0" y1="24" x2="320" y2="24" stroke="var(--ui-border)" />
              <g v-html="p.mockup"></g>
            </svg>
          </div>

          <div class="p-5">
            <div class="flex items-baseline justify-between">
              <h3 class="text-primary-500 text-lg font-semibold">{{ p.name }}</h3>
              <span class="text-muted font-mono text-xs">{{ p.category }}</span>
            </div>
            <p class="text-muted mt-2 text-sm leading-relaxed">
              {{ p.desc }}
            </p>
            <div class="mt-4 flex flex-wrap gap-2 font-mono text-xs">
              <span v-for="t in p.tags" :key="t" class="text-muted border px-2 py-1">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.tab[data-active='true'] {
  color: var(--ui-color-primary-500);
  border-color: var(--accent);
}
.tab {
  border-bottom: 2px solid transparent;
}
</style>
