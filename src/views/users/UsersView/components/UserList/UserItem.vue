<script setup lang="ts">
/* ======================
        Imports
====================== */

import { RouterLink } from 'vue-router'
import { ArrowUpRight } from '@lucide/vue'
import type { User } from '../../../types'

/* ======================
      Variables
====================== */

const backgroundImage =
  'bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px]'

/* ======================
      Props / Emits
====================== */

const { user } = defineProps<{
  user: User
}>()

/* ======================
  Methods / Functions
====================== */

const initials = (name: string) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}
</script>

<!-- ======================================================================

======================================================================= -->
<!-- Other Inspiration: https://codepen.io/badger3000/pen/emNvoxz -->

<template>
  <RouterLink
    :to="`/users/${user.id}`"
    class="group bg-card border-secondary-500/55 relative isolate rounded-2xl border-[1.5px] p-5 transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_18px_50px_rgba(0,0,0,0.28)]"
  >
    <!-- ====================
          Background Grid
    ===================== -->

    <div
      aria-hidden="true"
      class="text-secondary/10 dark:text-secondary/15 pointer-events-none absolute inset-0 z-[-1] -mx-px -mt-px rounded-[calc(var(--radius-2xl)+1px)] group-hover:text-transparent"
      :class="backgroundImage"
      :style="{
        WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent)',
        maskImage: 'linear-gradient(to bottom, #000, transparent)'
      }"
    />

    <!-- ====================
          Card Header
    ===================== -->

    <div class="flex items-start justify-between gap-4">
      <div class="flex min-w-0 items-center gap-4">
        <div
          class="border-primary-500 bg-primary-100 dark:bg-primary-900/50 text-primary flex size-12 items-center justify-center rounded-2xl border font-mono text-sm font-bold"
        >
          {{ initials(user.name) }}
        </div>

        <div class="min-w-0">
          <!--^ truncate -->
          <h2 class="text-primary font-[Chakra_Petch] text-lg tracking-tight uppercase">
            {{ user.name }}
          </h2>

          <!--^ truncate ? -->
          <p class="text-muted truncate font-mono text-xs">@{{ user.username.toLowerCase() }}</p>
        </div>
      </div>

      <ArrowUpRight
        class="group-hover:text-primary text-secondary size-6 transition group-hover:translate-x-1 group-hover:-translate-y-1"
      />
    </div>

    <div class="mt-3 mb-4 h-px bg-(--ui-text)/30" />

    <!-- ====================
    Card Body: Company, bs, address, email
    ===================== -->

    <div class="flex items-end justify-between gap-3">
      <div>
        <p class="font-[Chakra_Petch] text-sm tracking-tight uppercase">
          {{ user.company.name }}
        </p>
        <p class="text-xs italic">{{ user.company.bs }}</p>
        <p class="text-secondary mt-1 font-mono text-xs">
          {{ user.address.city }} · {{ user.email }}
        </p>
      </div>
      <span
        class="text-secondary bg-secondary-100 dark:bg-secondary-700 rounded-full px-2.5 py-1 font-mono text-xs"
      >
        {{ String(user.id).padStart(2, '0') }}
      </span>
    </div>

    <!-- ====================
        Marching Ants Border
    ===================== -->

    <svg
      aria-hidden="true"
      class="pointer-events-none absolute inset-[-1.5px] h-[calc(100%+3px)] w-[calc(100%+3px)] overflow-visible opacity-0 transition-opacity duration-300 group-hover:opacity-100"
    >
      <rect
        class="marching-ants-rect stroke-primary-500"
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx="16"
        ry="16"
        fill="none"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-dasharray="8 6"
      />
    </svg>
  </RouterLink>
</template>

<!-- ======================================================================

======================================================================= -->

<style scoped>
/* An SVG rect's path starts top-left and runs clockwise, so a
decreasing dashoffset pushes the dashes clockwise.
-14 = dash (8) + gap (6), which makes the loop seamless. */
@keyframes march-clockwise {
  from {
    stroke-dashoffset: 0;
  }

  /* Note: -14 isn't arbitrary. It's the length of one full dash pattern: 
  the stroke-dasharray="8 6" is an 8px dash plus a 6px gap, and 8 + 6 = 14. 
  Animating stroke-dashoffset from 0 to -14 slides the pattern by exactly one 
  period, so the last frame looks identical to the first and the loop is seamless. */
  to {
    stroke-dashoffset: -14;
  }
}

.marching-ants-rect {
  animation: march-clockwise 0.5s linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .marching-ants-rect {
    animation: none;
  }
}
</style>
