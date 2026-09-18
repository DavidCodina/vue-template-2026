<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref, computed, onMounted, nextTick } from 'vue'
import { Trash } from '@lucide/vue'

/* ======================
        Types
====================== */

interface TodoItem {
  id: number
  text: string
  done: boolean
}

type FilterType = 'all' | 'active' | 'done'

/* ======================
      Variables
====================== */

const STORAGE_KEY = 'todays-tasks'

const today = new Date().toLocaleDateString(undefined, {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
})

/* ======================
    Refs (i.e., State)
====================== */

const todos = ref<TodoItem[]>([])
const draft = ref<string>('')
const filter = ref<FilterType>('all')
const editingId = ref<number | null>(null)
const editDraft = ref<string>('')

/* ======================
        Computed
====================== */

const filtered = computed(() => {
  if (filter.value === 'active') return todos.value.filter((t) => !t.done)
  if (filter.value === 'done') return todos.value.filter((t) => t.done)
  return todos.value
})

const remaining = computed(() => todos.value.filter((t) => !t.done).length)
const doneCount = computed(() => todos.value.filter((t) => t.done).length)

/* ======================
Event Handlers / Functions
====================== */

function loadFromStorage(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) todos.value = JSON.parse(raw) as TodoItem[]
  } catch (_e) {
    todos.value = []
  }
}

function saveToStorage(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value))
  } catch (_e) {
    /* storage unavailable; app still works in-memory */
  }
}

function addTodo(): void {
  const text = draft.value.trim()
  if (!text) return
  todos.value.push({
    id: Date.now() + Math.random(),
    text,
    done: false
  })
  draft.value = ''
  saveToStorage()
}

function toggleDone(item: TodoItem): void {
  item.done = !item.done
  saveToStorage()
}

// Here we could probably just use .splice() instead.
// But that would really only be needed if we had index but not id.
function remove(id: number): void {
  todos.value = todos.value.filter((t) => t.id !== id)
  saveToStorage()
}

function startEdit(item: TodoItem): void {
  editingId.value = item.id
  editDraft.value = item.text
  nextTick(() => {
    const el = document.querySelector<HTMLInputElement>('.edit-input')
    if (el) el.focus()
  })
}

function commitEdit(item: TodoItem): void {
  const text = editDraft.value.trim()
  if (text) {
    item.text = text
  } else {
    remove(item.id)
  }
  editingId.value = null
  saveToStorage()
}

function cancelEdit(): void {
  editingId.value = null
}

function clearDone(): void {
  todos.value = todos.value.filter((t) => !t.done)
  saveToStorage()
}

/* ======================
    Lifecycle Hooks
====================== */

onMounted(loadFromStorage)
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="bg-card relative mx-auto max-w-150 rounded-xl border p-6 shadow">
    <!-- ====================
        Header + Status
    ===================== -->

    <header class="mb-2">
      <div class="text-secondary mb-1 text-right text-sm">
        {{ today }}
      </div>
      <h1 class="text-primary text-4xl font-black">Today's Tasks</h1>
    </header>

    <div class="text-secondary mb-8 text-sm">
      <strong class="text-primary font-semibold">{{ remaining }}</strong>
      Open &middot; <strong class="text-primary font-semibold">{{ doneCount }}</strong> Done
    </div>

    <!-- ====================
            Input
    ===================== -->

    <div class="relative mb-2 pl-12">
      <!-- Outline Checkbox -->
      <span
        aria-hidden="true"
        class="absolute top-1/2 left-0 size-6 -translate-y-1/2 rounded border border-dashed border-stone-400"
      ></span>

      <input
        aria-label="Add a new item"
        class="placeholder:text-primary focus:border-b-primary w-full cursor-pointer border-b border-transparent px-0 py-1 outline-none placeholder:italic"
        v-model="draft"
        @keyup.enter="addTodo"
        type="text"
        placeholder="Write a todo item, then press enter&hellip;"
      />
    </div>

    <!-- ====================
            List
    ===================== -->

    <!-- Alternate v-for:  v-for="(item, index) in filtered" 
    
    v-for also supports iterating over objects:

      <li
        v-for="(value, key, index) in { fullName: 'David Codina', age: 48 }"
        :key="(value as any).fullName"
      >
        <span class="text-primary font-semibold">{{ key }}</span>: <span class="text-secondary font-semibold">{{ value }}</span>
      </li>

    And numbers:

    <li v-for="value in 10" :key="value">{{ value }}</li>

    -->

    <ul class="mb-4" v-if="filtered.length">
      <li
        v-for="item in filtered"
        :key="item.id"
        class="border-secondary/50 relative border-b pr-2 pl-12"
        :class="{ done: item.done }"
      >
        <div class="group flex gap-2 py-3">
          <!-- ====================
              Quasi Checkbox
          ===================== -->

          <button
            class="[.done_&]:bg-primary [.done_&]:border-primary absolute top-3.5 left-0 grid size-6 flex-none cursor-pointer place-items-center rounded border border-stone-300 bg-transparent p-0"
            type="button"
            :aria-pressed="item.done"
            :aria-label="item.done ? 'Mark as not done' : 'Mark as done'"
            @click="toggleDone(item)"
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
            v-if="editingId === item.id"
            class="focus:border-primary flex-1 px-2 py-1 outline-none focus:border-b"
            v-model="editDraft"
            @keyup.enter="commitEdit(item)"
            @keyup.esc="cancelEdit"
            @blur="commitEdit(item)"
          />

          <!-- The <li> adds done above by doing this :class="{ done: item.done }" -->
          <span
            v-else
            class="[.done_&]:text-muted-foreground text-secondary flex-1 cursor-pointer wrap-break-word [.done_&]:line-through [.done_&]:decoration-red-500 [.done_&]:decoration-2"
            @dblclick="startEdit(item)"
            :title="'Double-click to edit'"
            >{{ item.text }}</span
          >

          <!-- ====================
                Remove Button
          ===================== -->

          <button
            class="text-secondary dark:text-muted-foreground opacity-0 transition-all duration-[0.12s] ease-linear group-hover:opacity-100 hover:text-rose-500 focus-visible:opacity-100"
            type="button"
            @click="remove(item.id)"
            aria-label="Delete item"
          >
            <Trash class="size-6" />
          </button>
        </div>
      </li>
    </ul>

    <!-- ====================
         No Items 
    ===================== -->
    <!-- If filtered.length is falsy, then show this.
    If there's no todos at all then show the first message.
    Otherwise, it means that filtered todos is empty, but there are todos.
    Initially, I did this:

      <div class="text-muted-foreground mb-4 p-4 pl-14 italic" v-else>
        {{ todos.length === 0 ? "You have no todos. Let's create one!" : 'Nothing here for this view.' }}
      </div> 

    But if you want to use <span> tags, then you need to write it a litte differently:
    -->

    <div class="mb-4 p-4 pl-14 italic" v-else>
      <span class="text-primary font-medium" v-if="todos.length === 0"
        >✏️ You have no todos. Let's create one! ✏️</span
      >

      <!-- Here we could have anexted template that simply output text:
      <template v-else>Nothing here for this view.</template> -->
      <span class="text-info font-medium" v-else>Nothing here for this view...</span>
    </div>

    <!-- ====================
            Filters
    ===================== -->

    <div class="flex items-center justify-between">
      <div class="flex gap-1" role="group" aria-label="Filter items">
        <button
          class="min-w-15 rounded-lg border-none bg-none px-[10px] py-[6px] text-[13px] font-semibold text-[#8a8578] transition-all duration-[0.12s] ease-linear focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[1px] focus-visible:outline-[#2e6e5e]"
          :class="filter === 'all' ? 'bg-primary text-white' : 'hover:text-primary'"
          @click="filter = 'all'"
        >
          All
        </button>
        <button
          class="min-w-15 rounded-lg border-none bg-none px-[10px] py-[6px] text-[13px] font-semibold text-[#8a8578] transition-all duration-[0.12s] ease-linear focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[1px] focus-visible:outline-[#2e6e5e]"
          :class="filter === 'active' ? 'bg-primary text-white' : 'hover:text-primary'"
          @click="filter = 'active'"
        >
          Open
        </button>
        <button
          class="min-w-15 rounded-lg border-none bg-none px-[10px] py-[6px] text-[13px] font-semibold text-[#8a8578] transition-all duration-[0.12s] ease-linear focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[1px] focus-visible:outline-[#2e6e5e]"
          :class="filter === 'done' ? 'bg-primary text-white' : 'hover:text-primary'"
          @click="filter = 'done'"
        >
          Done
        </button>
      </div>
      <button
        class="border-none bg-none text-[13px] font-semibold text-[#8a8578] underline decoration-[#dcd4be] underline-offset-[3px] hover:text-rose-500 hover:decoration-rose-500 disabled:cursor-default disabled:no-underline disabled:opacity-30"
        :disabled="doneCount === 0"
        @click="clearDone"
      >
        Clear Done
      </button>
    </div>
  </div>
</template>
