<script setup lang="ts">
///////////////////////////////////////////////////////////////////////////
//
// The setup keyword implies the use of the composition API.
// It's a shorthand for explicitly calling setup() in the script.
//
//   export default {
//     setup() {
//       // ...
//       return { ... }
//     }
//  }
//
///////////////////////////////////////////////////////////////////////////

import {
  computed,
  ref
  // reactive  // Can be used for objects.
} from 'vue'
import { CircleX } from '@lucide/vue'
import { cn } from '@/utils/cn'
import Button from '@/components/Button.vue'

///////////////////////////////////////////////////////////////////////////
//
// Assuming there was no top-level <div> here, there's still no need to do this:
//
//   defineOptions({ inheritAttrs: false })
//
// Vue does not automatically apply fallthrough attributes when there are multiple root nodes.
// when a component has multiple root nodes like yours (two <Button>s and four <p>s all as siblings),
// Vue has no way to guess which one should receive them, so it doesn't apply fallthrough attrs to anything.
// So defineOptions({ inheritAttrs: false }) doesn't change the fallthrough behavior here (there was nothing
// being auto-applied to suppress)
//
// That said, a top-level <div> might be nice if you ever want to style the demo. Othewise,
// Vue's compiler treats a multi-root template as an implicit fragment (i.e., React-like Fragment).
//
///////////////////////////////////////////////////////////////////////////

/* ======================
        Types
====================== */

type Status = 'idle' | 'loading' | 'success' | 'error'
type Task = string

/* ======================
    Refs (i.e., State)
====================== */

const show = ref(false)
const status = ref<Status>('idle')

const tasks = ref<Task[]>(['Hike', 'Lift', 'Feed Cats', 'Wash Dishes', 'Write Python'])
const newTask = ref<Task>('')

/* ======================
      Variables
====================== */

const button1Label = computed(() => (show.value ? 'Hide Text' : 'Show Text'))

const link = 'https://www.google.com'

/* ======================
      Handlers
====================== */

const handleClick1 = () => (show.value = !show.value)

const handleClick2 = () => {
  if (status.value === 'idle') {
    status.value = 'loading'
  } else if (status.value === 'loading') {
    status.value = 'success'
  } else if (status.value === 'success') {
    status.value = 'error'
  } else if (status.value === 'error') {
    status.value = 'idle'
  }
}

const handleClick3 = (message: string) => alert(message)

const handleSubmit = (_e: Event) => {
  // e.preventDefault()
  if (newTask.value.trim() === '') {
    return
  }

  tasks.value.push(newTask.value)
  newTask.value = ''
}

// Unlike in React, we can mutate the state directly in Vue.
const deleteTask = (index: number) => {
  tasks.value.splice(index, 1)
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div>
    <!-- ====================
          v-if + v-else
    ===================== -->
    <!-- The @ in @click is Vue template syntax, not something HTML itself has — it's shorthand for the v-on: directive.
    It exists specifically to distinguish "listen for an event" from "set an attribute". These are essentially the same:

      v-on:click="handleClick"
      @click="handleClick"
    -->

    <Button
      v-on:click="handleClick1"
      class="mx-auto mb-1 flex min-w-37.5 bg-[#35495E] font-bold shadow-[0_2px_2px_rgba(0,0,0,0.25)]"
    >
      <!-- Simple Interpolation: {{ show ? 'Hide Text' : 'Show Text' }}  works fine, but here
      we can abstract it into a computed value, which is more flexible and reusable. -->
      {{ button1Label }}
    </Button>

    <!-- Use v-show directive if you want display: none behavior, rather than unmounting. -->
    <p v-if="show" class="text-center text-sm italic">You can do it!</p>
    <p v-else class="text-center text-sm italic">...</p>

    <!-- ====================
    v-if + v-else-if + v-else
    ===================== -->
    <!-- 
    class="..." is a plain static HTML attribute — whatever string you put there is exactly what ends up in the DOM.
    :class is short for v-bind:class. It tells Vue to treat the attribute value as a JavaScript expression to evaluate, not literal text.
    :class fully replaces the static class binding (i.e., you can't have both).
    Vue's :class also accepts objects and arrays natively (e.g. :class="{ 'bg-red-500': status === 'error' }" 
    or :class="['base-class', isActive && 'active']", so technically you don't need cn() for very basic cases.
    -->

    <Button
      @click="handleClick2"
      :class="
        cn(
          'mx-auto mt-6 mb-1 flex min-w-37.5 font-bold shadow-[0_2px_2px_rgba(0,0,0,0.25)]',
          status === 'idle' && 'bg-stone-500',
          status === 'loading' && 'bg-sky-500',
          status === 'success' && 'bg-lime-500',
          status === 'error' && 'bg-rose-500'
        )
      "
      title="Cycle Status"
    >
      Status:&nbsp;<span class="font-mono font-normal">{{ status }}</span>
    </Button>

    <p v-if="status === 'loading'" class="text-center text-sm text-sky-500">Pending...</p>
    <p v-else-if="status === 'success'" class="text-center text-sm text-lime-500">Done!</p>
    <p v-else-if="status === 'error'" class="text-center text-sm text-rose-500">Error!</p>
    <p v-else class="text-center text-sm text-stone-500">Nothing To See Here...</p>

    <!-- ====================
            v-for
    ===================== -->

    <div class="mx-auto my-6 flex w-fit flex-col items-center">
      <h2 class="text-xl font-bold">Tasks</h2>
      <ul
        class="max-w-62.5 rounded-lg border border-stone-300 bg-white text-sm shadow-[0_2px_2px_rgba(0,0,0,0.25)]"
      >
        <li class="border-stone-300 not-last:border-b" v-for="(item, index) in tasks" :key="item">
          <span class="mx-2 flex gap-2">
            <span class="">{{ index + 1 }}.&nbsp;{{ item }}</span>

            <button class="0 ml-auto cursor-pointer" @click="deleteTask(index)">
              <CircleX class="size-[1em] text-red-500" />
            </button>
          </span>
        </li>
      </ul>
    </div>

    <!-- ====================
            v-bind
    ===================== -->
    <!-- 
    As always, we could just remove the v-bind, and just do :href="link" 
    Essentially, the colon is indicating that, "This is dynamic".
    -->

    <div class="mb-6 text-center">
      <a
        class="font-medium text-blue-500 hover:underline"
        v-bind:href="link"
        rel="noopener noreferrer"
        target="_blank"
        >Go To Google</a
      >
    </div>

    <!-- ====================
            v-on / @
    ===================== -->
    <!-- Here we're using click, but there are loads of events one can append. -->

    <Button
      class="mx-auto mb-6 flex min-w-37.5 bg-pink-500 font-bold shadow-[0_2px_2px_rgba(0,0,0,0.25)]"
      v-on:click="handleClick3('Button Clicked Dummy!')"
      >Click Me</Button
    >

    <!-- ====================
    v-model + v-on:submit / @submit
    ===================== -->
    <!-- v-model is what binds the newTask state to the input -->

    <form
      v-on:submit.prevent="handleSubmit"
      class="mx-auto mb-6 max-w-100 rounded-lg border border-stone-300 bg-white p-4 shadow"
    >
      <div class="mb-4">
        <label class="text-sm font-bold text-blue-500" for="addTask">Add Task:</label>
        <input
          class="block w-full rounded border border-stone-300 px-2 py-1"
          id="addTask"
          name="addTask"
          placeholder="Add a task..."
          type="text"
          v-model="newTask"
          @keydown.enter.prevent
        />
        <div class="text-xs text-stone-400">
          <span class="font-mono text-pink-500">newTask:</span> {{ newTask }}
        </div>
      </div>

      <!-- In this case, we MUST use type="submit" because the 
      Button component explicitly defaults to type="button" -->
      <Button class="flex w-full bg-blue-500 font-bold" type="submit">Submit</Button>
    </form>
  </div>
</template>

<!-- <style scoped></style> -->
