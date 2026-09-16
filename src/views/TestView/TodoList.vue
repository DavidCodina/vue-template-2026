<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref, computed, nextTick } from 'vue'
import { Trash } from '@lucide/vue'
import { cn } from '@/utils/cn'

/* ======================
        Types
====================== */

interface Task {
  id: number
  text: string
  done: boolean
}

/* ======================
    Refs (i.e., State)
====================== */

const tasks = ref<Task[]>([
  { id: 1, text: 'Work on Python', done: true },
  { id: 2, text: 'Learn Vue', done: false },
  { id: 3, text: 'Feed the cats', done: false }
])

// The input state.
const newTodo = ref('')

/* ======================
     Template Refs
====================== */

// Attached to the <input>, then used with addTask() function.
const inputRef = ref<HTMLInputElement | null>(null)

/* ======================
      Variables
====================== */

let nextId = 4

// Get the date - used by the header
const dateLabel = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
})

/* ======================
       Computed
====================== */

// Get the number of tasks where done is true.
// ⚠️ Why does this need to be wrapped in computed?
const doneCount = computed(() => tasks.value.filter((t) => t.done).length)

/* ======================
Event Handlers / Functions
====================== */

function handleAddTodo() {
  const text = newTodo.value.trim()
  if (!text) {
    return
  }

  // nextId++ simultaneously applies the id and updates the actual
  // variable. This is a simple uid approach for a simple demo.
  tasks.value.push({ id: nextId++, text, done: false })

  // Clear the input.
  newTodo.value = ''

  // Use the inputRef to focus back on the input.
  // ⚠️ What is nextTick() and why do we need it here?
  nextTick(() => inputRef.value?.focus())
}

// Used by each respective "Remove" button.
function handleDeleteTodo(id: number) {
  tasks.value = tasks.value.filter((t) => t.id !== id)
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section class="mx-auto mb-12 w-fit min-w-150 rounded-xl border bg-[#F6F4EF] p-6 shadow">
    <!-- ====================
            Header
    ===================== -->

    <header class="mb-10">
      <p class="mb-1 text-sm font-medium text-[#3F6659]">{{ dateLabel }}</p>
      <h1 class="font-serif text-4xl text-[#1E2A28]">What's on today</h1>
    </header>

    <!-- ====================
            Form
    ===================== -->

    <form @submit.prevent="handleAddTodo" class="mb-8 flex gap-2">
      <input
        class="flex-1 border-b-2 border-[#DAD5C8] bg-transparent py-2 text-base text-[#1E2A28] transition-colors outline-none focus:border-[#3F6659]"
        placeholder="Add something to do"
        ref="inputRef"
        type="text"
        v-model="newTodo"
      />

      <!-- 
      Notice that class and :class are NOT mutually exclusive.
      Rather, they are intentionally designed to merge.

        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3F6659] text-xl leading-none text-[#F6F4EF] transition-colors"
        :class="draft.trim() ? 'cursor-pointer' : 'cursor-not-allowed opacity-30'"
      
      That said, I've updated button to use :class + cn() alone.
      -->

      <button
        aria-label="Add task"
        :class="
          cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3F6659] text-xl leading-none text-[#F6F4EF] transition-colors',
            newTodo.trim() ? 'cursor-pointer' : 'cursor-not-allowed opacity-30'
          )
        "
        :disabled="!newTodo.trim()"
        type="submit"
      >
        +
      </button>
    </form>

    <!-- ====================
          No Tasks
    ===================== -->

    <div
      v-if="tasks.length === 0"
      class="text-muted-foreground rounded-lg border border-dashed py-10 text-center text-sm"
    >
      Nothing here yet. Add your first task above.
    </div>

    <!-- ====================
          Tasks List
    ===================== -->
    <!-- https://vuejs.org/guide/built-ins/transition-group
    <TransitionGroup> is a built-in component designed for animating the insertion, removal, 
    and order change of elements or components that are rendered in a list.

    Without it, when handleAddTodo pushes a new task or handleDeleteTodo filters one out, Vue just 
    patches the DOM to match the new array — the new <li> appears, the removed one vanishes. 
    No animation, just an instant jump. That's the default behavior of v-for alone.

    <TransitionGroup> gives you two things on top of that:

      1. Per-item enter/leave transitions. A plain <Transition> only animates a single root element entering 
      or leaving. <TransitionGroup> is what lets each individual list item animate in or out independently 
      as items are added/removed from the array — which is exactly your case, since any <li> can appear 
      or disappear at any position.

      2. Reflow handling on removal, via the leave-active-class="... absolute w-full" you've got. This is the 
      subtle but important part: when a task is deleted, Vue doesn't yank it out of the DOM instantly 
      — it keeps the leaving <li> around just long enough to animate (opacity-0 translate-x-3). 
      But if that element stayed position: static, it would still take up space in the layout while fading, 
      causing the remaining items to have a weird gap or delayed jump when it finally disappears. Setting 
      it to absolute during the leave phase pulls it out of normal flow, so the items below it can immediately 
      and smoothly slide up into the gap while the leaving item does its own thing on top.

    Why tag="ul" matters: by default <TransitionGroup> renders no wrapper element at all (children render 
    directly into the parent). Passing tag="ul" tells it "render me as an actual <ul>" so you still get a 
    semantically correct list wrapping your <li>s, rather than losing the list structure.

    One thing to flag: you're only using enter-* and leave-* classes, not a v-move transition 
    (Tailwind's [&.v-move]:transition-transform or similar). That means insert/remove animate, 
    but if you ever reordered the array (e.g. sorting completed tasks to the bottom), the other 
    items would just snap to their new position instead of sliding — TransitionGroup's FLIP-based 
    move animation needs that class defined explicitly. Not needed for what you're doing now, but 
    worth knowing it's there if you add sorting later.
    -->
    <TransitionGroup
      v-else
      tag="ul"
      class="relative list-none pl-0"
      enter-active-class="transition-all duration-250 ease-in-out"
      enter-from-class="opacity-0 -translate-y-1.5"
      leave-active-class="transition-all duration-250 ease-in-out absolute w-full"
      leave-to-class="opacity-0 translate-x-3"
    >
      <li
        v-for="task in tasks"
        :key="task.id"
        class="group flex items-start gap-3 border-b border-[#DAD5C8] py-3"
      >
        <label class="relative mt-0.5 flex shrink-0 cursor-pointer items-center justify-center">
          <input type="checkbox" v-model="task.done" class="sr-only" />
          <span
            class="flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors"
            :class="task.done ? 'border-[#3F6659] bg-[#3F6659]' : 'border-[#3F6659]/60'"
          >
            <svg viewBox="0 0 20 20" class="h-3.5 w-3.5">
              <path
                d="M4 10 L8 14 L16 5"
                fill="none"
                stroke="#F6F4EF"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="transition-[stroke-dashoffset] [transition-delay:50ms] duration-200 [stroke-dasharray:20]"
                :class="task.done ? '[stroke-dashoffset:0]' : '[stroke-dashoffset:20]'"
              />
            </svg>
          </span>
        </label>

        <span
          class="flex-1 pt-0.5 text-base leading-snug transition-colors"
          :class="task.done ? 'text-[#1E2A28]/35 line-through' : 'text-[#1E2A28]'"
          >{{ task.text }}</span
        >

        <button
          aria-label="Delete Todo"
          @click="handleDeleteTodo(task.id)"
          class="shrink-0 cursor-pointer pt-1 text-sm font-semibold text-[#1E2A28]/30 opacity-0 transition-opacity group-hover:opacity-100 hover:text-[#B5563C] focus:opacity-100"
        >
          <Trash class="size-6" />
        </button>
      </li>
    </TransitionGroup>

    <!-- ====================
          Done Count
    ===================== -->

    <p v-if="tasks.length" class="mt-6 text-sm text-[#1E2A28]/40">
      {{ doneCount }} of {{ tasks.length }} done
    </p>
  </section>
</template>
