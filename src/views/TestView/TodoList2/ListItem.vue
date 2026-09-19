<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref, nextTick } from 'vue'
import { Trash } from '@lucide/vue'

/* ======================
        Types
====================== */

/** Persisted todo shape used by the list and parent state. */
export type TodoItem = {
  id: number
  text: string
  done: boolean
}

export type Props = {
  item: TodoItem
}

// ⚠️ Vue conventions favor kebab-case and action verbs.
// for custom events: toggle-done, update-todo, etc.
export type Emits = {
  // The consumer does @toggleDone="toggleDone"
  (e: 'toggleDone', item: TodoItem): void
  // The consumer does @remove="remove"
  (e: 'remove', id: number): void
  // The consumer does @update="updateTodo"
  (e: 'updateTodo', item: TodoItem, newText: string): void
}

/* ======================
      Props / Emits
====================== */
///////////////////////////////////////////////////////////////////////////
//
// How to Block Fallthrough Attributes:
//
// If you want to strictly prevent extra attributes from bleeding onto your root element,
// you can disable them using the inheritAttrs:
//
//   defineOptions({
//     inheritAttrs: false
//   })
//
// Note: If you want to block fallthrough attributes AND get TypeScript compiler warnings
// in your parent template when an undeclared attribute is used, ensure you are using Vue's
// strict template type checking (via Volar / Vue Language Features extension in VS Code).
//
///////////////////////////////////////////////////////////////////////////

// defineProps and defineEmits are macros, so no need to explicitly import them.

const props = defineProps<Props>()

///////////////////////////////////////////////////////////////////////////
//
// In React, everything is a prop, including callback functions like onToggle or onDelete.
// In Vue, you can pass functions down as props, but emits are the idiomatic, built-in standard.
// Think of props as downward communication (Parent to Child) and emits as upward events
// (Child to Parent).
//
//   - Props (Data Down): The parent gives data to the child.
//
//   - Emits (Events Up): The child fires custom events (like click or submit,
//     but custom-named like update or toggle), and the parent listens for them.
//
// When a child component emits an event, it's essentially shouting:
// "Hey, something happened to me! Parent, do what you want with this info."
//
// Why Use Emits Instead of Callback Props?
//
//   ???
//
///////////////////////////////////////////////////////////////////////////

const emit = defineEmits<Emits>()

/* ======================
    Refs (i.e., State)
====================== */

const isEditing = ref(false)
const editDraft = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

/* ======================
Event Handlers / Functions
====================== */

function startEdit(): void {
  isEditing.value = true
  editDraft.value = props.item.text
  nextTick(() => {
    inputRef.value?.focus()
  })
}

function commitEdit(): void {
  if (!isEditing.value) {
    return
  }

  const text = editDraft.value.trim()
  if (text) {
    emit('updateTodo', props.item, text)
  } else {
    emit('remove', props.item.id)
  }
  isEditing.value = false
}

function cancelEdit(): void {
  isEditing.value = false
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <li class="border-secondary/50 relative border-b pr-2 pl-12" :class="{ done: item.done }">
    <div class="group flex gap-2 py-3">
      <!-- ====================
            Quasi Checkbox
      ===================== -->

      <button
        class="[.done_&]:bg-primary [.done_&]:border-primary absolute top-3.5 left-0 grid size-6 flex-none cursor-pointer place-items-center rounded border border-stone-300 bg-transparent p-0"
        type="button"
        :aria-pressed="item.done"
        :aria-label="item.done ? 'Mark as not done' : 'Mark as done'"
        @click="emit('toggleDone', item)"
      >
        <svg v-if="item.done" viewBox="0 0 10 10" fill="none" class="size-4">
          <path
            d="M1 5L4 8L9 1.5"
            stroke-width="1.6"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="stroke-white"
          />
        </svg>
      </button>

      <!-- ====================
            input or span
       ===================== -->

      <input
        v-if="isEditing"
        ref="inputRef"
        class="focus:border-primary flex-1 px-2 py-1 outline-none focus:border-b"
        v-model="editDraft"
        @keyup.enter="commitEdit"
        @keyup.esc="cancelEdit"
        @blur="commitEdit"
      />

      <!-- The <li> adds done above by doing this :class="{ done: item.done }" -->

      <span
        v-else
        class="[.done_&]:text-muted-foreground text-secondary flex-1 cursor-pointer wrap-break-word [.done_&]:line-through [.done_&]:decoration-red-500 [.done_&]:decoration-2"
        @dblclick="startEdit"
        :title="'Double-click to edit'"
        >{{ item.text }}</span
      >

      <!-- ====================
            Remove Button
      ===================== -->

      <button
        aria-label="Delete item"
        @click="emit('remove', item.id)"
        class="text-secondary dark:text-muted-foreground opacity-0 transition-all duration-[0.12s] ease-linear group-hover:opacity-100 hover:text-rose-500 focus-visible:opacity-100"
        type="button"
      >
        <Trash class="size-6" />
      </button>
    </div>
  </li>
</template>
