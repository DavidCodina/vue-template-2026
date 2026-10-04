<script setup lang="ts">
// This is an old-school CRT Monitor
// CRT stands for cathode-ray tube, the display technology in old bulky monitors and TVs.

/* ======================
        Imports
====================== */

import { ref } from 'vue'
import Vents from './Vents.vue'
import Knob from './Knob.vue'

/* ======================
      Variables
====================== */

// Beige plastic, built from layered gradients + inset shadows
const plastic = {
  background: 'linear-gradient(145deg, #e4dcc8 0%, #d3cab2 45%, #bfb69c 100%)',
  boxShadow:
    'inset 0 2px 2px rgba(255,255,255,.7), inset 0 -4px 6px rgba(90,80,55,.35), 0 40px 60px -20px rgba(0,0,0,.55)'
}

const screw = {
  background: 'radial-gradient(circle at 35% 30%, #f3ecd8, #8f866c)',
  boxShadow: 'inset 0 -1px 1px rgba(0,0,0,.4), 0 1px 0 rgba(255,255,255,.6)'
}

/* ======================
        Refs 
====================== */

const on = ref(true)
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="">
    <!-- Outer plastic shell -->
    <div class="rounded-3xl p-5 pb-4" :style="plastic">
      <!-- Screws-->
      <div class="relative">
        <div class="absolute -top-3 left-1 h-2 w-2 rounded-full" :style="screw" />
        <div class="absolute -top-3 right-1 h-2 w-2 rounded-full" :style="screw" />
      </div>

      <!-- Inner bezel: sunken frame around the glass -->
      <div
        class="rounded-2xl p-4"
        :style="{
          background: 'linear-gradient(160deg, #a89f86, #cbc2a9)',
          boxShadow: 'inset 0 4px 10px rgba(0,0,0,.5), 0 1px 0 rgba(255,255,255,.7)'
        }"
      >
        <!-- Glass -->
        <div
          class="relative overflow-hidden"
          :style="{
            borderRadius: '28px / 22px',
            background: '#000',
            boxShadow: 'inset 0 0 40px 8px rgba(0,0,0,.9), 0 0 0 3px #1a1a17, 0 0 0 5px #7d745c'
          }"
        >
          <!-- Phosphor glow + content  -->
          <pre
            class="m-0 aspect-4/3 overflow-x-auto p-6 text-sm leading-relaxed text-green-500"
            :style="{
              opacity: on ? 1 : 0,
              transition: 'opacity .4s',
              textShadow: '0 0 6px rgba(74,222,128,.7)',
              background: 'radial-gradient(rgba(0,150,0,.5), black 120%)',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace'
            }"
          ><code><slot /></code></pre>

          <!-- Scanlines -->
          <div
            class="pointer-events-none absolute inset-0"
            :style="{
              background:
                'repeating-linear-gradient(0deg, rgba(0,0,0,.3), rgba(0,0,0,.3) 1px, transparent 1px, transparent 2px)'
            }"
          />

          <!-- Glass reflection + vignette  -->
          <div
            class="pointer-events-none absolute inset-0"
            :style="{
              background:
                'linear-gradient(125deg, rgba(255,255,255,.12) 0%, rgba(255,255,255,0) 35%), radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.55) 100%)'
            }"
          />
        </div>
      </div>

      <!-- Chin: brand plate, knobs, vents, power -->
      <div class="mt-4 flex items-center justify-between px-2">
        <div class="mr-4 flex items-center gap-4">
          <Vents />
          <div
            class="rounded px-3 py-1 text-xs font-bold tracking-wide italic"
            :style="{
              color: '#4a4434',
              fontFamily: 'Georgia, serif',
              background: 'linear-gradient(#d9d1ba, #b9b098)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,.7), 0 1px 2px rgba(0,0,0,.35)'
            }"
          >
            DaveTek Industries
          </div>
        </div>

        <div class="flex items-center gap-4">
          <Knob label="BRT" />
          <Knob label="CON" />
          <div class="flex items-center gap-2">
            <div
              class="h-2 w-2 rounded-full"
              :style="{
                background: on ? '#4ade80' : '#3b4a3b',
                boxShadow: on ? '0 0 8px 2px rgba(74,222,128,.8)' : 'none'
              }"
            />

            <button
              type="button"
              @click="on = !on"
              :aria-pressed="on"
              aria-label="Power"
              class="h-7 w-9 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-green-600"
              :style="{
                background: 'linear-gradient(#e0d8c2, #aaa189)',
                boxShadow: on
                  ? 'inset 0 3px 5px rgba(0,0,0,.45)'
                  : '0 3px 0 #7d745c, 0 4px 4px rgba(0,0,0,.4), inset 0 1px 1px #fff',
                transform: on ? 'translateY(2px)' : 'none'
              }"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Neck + base -->
    <div
      class="mx-auto h-3 w-40"
      :style="{ background: 'linear-gradient(90deg,#8f866c,#d3cab2,#8f866c)' }"
    />
    <div
      class="mx-auto h-4 w-64 rounded-t-md rounded-b-2xl"
      :style="{
        ...plastic,
        boxShadow: '0 18px 24px -8px rgba(0,0,0,.6), inset 0 2px 2px rgba(255,255,255,.6)'
      }"
    />
  </div>
</template>
