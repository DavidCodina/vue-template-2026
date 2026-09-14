<!-- https://vuejs.org/api/composition-api-lifecycle.html#onupdated -->

<script setup lang="ts">
/* ======================
        Imports
====================== */

import { onUpdated, ref } from 'vue'
// import { } from '@lucide/vue'
// import { cn } from '@/utils/cn'
// import Button from '@/components/Button.vue'

/* ======================
    Refs (i.e., State)
====================== */

const messages = ref<string[]>(['Welcome to the chat! (Message #1)'])

/* ======================
     Template Refs
====================== */

// Bound to the scrollable message container below (ref="containerRef" in
// the template). We need a real DOM handle here, since onUpdated needs to set
// .scrollTop directly — that's not something a computed/reactive value can do.
const containerRef = ref<HTMLDivElement | null>(null)

/* ======================
Event Handlers / Functions
====================== */

const addMessage = () => {
  messages.value.push(`Message #${messages.value.length + 1}`)
}

/* ======================
    Lifecycle Hooks
====================== */
///////////////////////////////////////////////////////////////////////////
//
// onUpdated runs after a reactive state change triggers a re-render AND the
// DOM has finished being patched to reflect it.
//
//   messages.value.push(`Message #${messageCount}`)
//
// As a conceptual paraphrase for understanding what it does, onAfterRerender
// (or even more precisely, onAfterDOMPatch) captures it pretty well.
//
// Unlike onMounted (fires once), this can fire many times over the component's life
// — once per update cycle.
//
// Common use case: reading/reacting to the freshly-rendered DOM right after
// a change — e.g., scrolling a chat log to the bottom after a new message
// renders, since you need the container's *new* scrollHeight, not the old one.
//
// Caution: mutating reactive state inside onUpdated can trigger infinite
// update loops (change -> re-render -> onUpdated -> change -> ...). Only
// read/measure the DOM here, or mutate non-reactive things (like scrollTop).
//
/////////////////////////
//
// Sequence:
//
// 1. messages.value.push(...) mutates the array that messages (a ref) wraps. Vue's reactivity
//    system detects this mutation (array mutating methods like push are specifically instrumented
//    by Vue to trigger reactivity, unlike a plain non-reactive array).
//
// 2. Vue marks the component as "dirty" and schedules a re-render.
//
// 3. On the next tick, Vue re-runs the render function, producing a new virtual DOM tree that includes the new message.
//
// 4. Vue diffs the new tree against the old one and patches the real DOM — in this case,
//    appending a new <p> element inside the containerRef div.
//
// 5. Only after that DOM patch is complete does Vue call your onUpdated callback.
//
///////////////////////////////////////////////////////////////////////////

// The actual logic in onUpdated reaches out to <div ref="containerRef">
// And scrolls it to the bottom where the newest message was added.
// Additionally, a green outline is added just for fun.

onUpdated(() => {
  console.log('onUpdated() fired!')
  if (containerRef.value) {
    containerRef.value.scrollTop = containerRef.value.scrollHeight
    containerRef.value.style.outline = '2px dashed #42B883'
    setTimeout(() => {
      if (containerRef.value) {
        containerRef.value.style.outline = ''
      }
    }, 500)
  }
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="mx-auto max-w-150 space-y-3">
    <div
      ref="containerRef"
      class="h-40 space-y-1 overflow-y-auto rounded-lg border border-stone-300 bg-white p-2 shadow"
    >
      <p v-for="(msg, i) in messages" :key="i" class="text-sm">
        {{ msg }}
      </p>
    </div>

    <button
      @click="addMessage"
      class="ml-auto block cursor-pointer rounded-lg bg-[#42B883] px-2 py-1 text-sm font-semibold text-white shadow"
      title="Add Message"
    >
      Add Message
    </button>
  </div>
</template>
