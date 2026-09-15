<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref } from 'vue'

/* ======================
    Refs (i.e., State)
====================== */

// Just an array of ids. Each id maps to one square in the template.
const squares = ref<number[]>([1, 2, 3])
let nextId = 4

/* ======================
Event Handlers / Functions
====================== */

function handleAddSquare() {
  squares.value.push(nextId++)
}

function handleDeleteSquare(id: number) {
  squares.value = squares.value.filter((s) => s !== id)
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div>
    <!-- ====================
    Button For Adding A Square
    ===================== -->

    <button
      @click="handleAddSquare"
      class="bg-secondary mx-auto mb-1 block cursor-pointer rounded-lg border border-[rgba(0,0,0,0.2)] px-2 py-1 text-sm font-bold text-white shadow"
    >
      Add Square
    </button>
    <div class="mb-6 text-center text-xs">
      (A <code class="text-pink-500">TransitionGroup</code> Demo)
    </div>

    <!-- ====================
 
    ===================== -->
    <!-- Here we set TransitionGroup to a <div> flex container.

      - enter-from-class (opacity-0 scale-50) is the starting state for a newly added square.
        Vue applies it for one frame, then removes it so the square transitions from that state to its normal state.

      - leave-to-class is the mirror image: the ending state for a square that's being removed. Vue keeps the element
        in the DOM just long enough to animate to that state before actually deleting it.

      - enter-active-class: How to animate from enter-from-class.

      - leave-active-class: How to animate to leave-to-class.
      
      
      - leave-active-class: These specify how to animate to/from those values 
        (transition-all duration-500 ease-in-out — the property, duration, and easing curve)

      - move-class: This seems to be applied to the container itself, so that when a square is added/removed,
        the other squares adjust themselves in a smooth/transitioned manner.
    -->

    <TransitionGroup
      class="flex flex-wrap justify-center gap-4"
      enter-from-class="opacity-0 scale-50"
      enter-active-class="transition-all duration-500 ease-in-out"
      leave-active-class="transition-all duration-500 ease-in-out absolute"
      leave-to-class="opacity-0 scale-50"
      move-class="transition-transform duration-500 ease-in-out"
      tag="div"
    >
      <!-- For each id in squares array, map out a square <div> with its own handleDeleteSquare() function. 

      - :key="id" is doing the real work. TransitionGroup uses the key to know "this DOM node is square #3" across 
        re-renders — without a stable key, it can't tell an insert/remove apart from just re-rendering content, 
        so nothing would animate.
        
      -->
      <div
        v-for="id in squares"
        :key="id"
        @click="handleDeleteSquare(id)"
        class="bg-primary size-20 cursor-pointer rounded-xl border-2 border-[rgba(0,0,0,0.2)] shadow"
      />
    </TransitionGroup>
  </div>
</template>
