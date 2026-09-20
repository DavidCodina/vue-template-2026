<!-- https://vuejs.org/guide/components/slots.html -->
<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref, computed } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseCard from './BaseCard.vue'
import DataList from './DataList.vue'

/* ======================
        Types
====================== */

type Task = {
  id: number
  title: string
  done: boolean
}

/* ======================
    Refs (i.e., State)
====================== */

const createTasks = (): Task[] => [
  { id: 1, title: 'Read the slots docs', done: true },
  { id: 2, title: 'Build a BaseCard component', done: false },
  { id: 3, title: 'Try scoped slots', done: false }
]

// tasks are used in section 3 by DataList: <DataList :items="tasks">
const tasks = ref<Task[]>(createTasks())

/* ======================
       Computed
====================== */

const remainingCount = computed<number>(() => tasks.value.filter((t) => !t.done).length)

/* ======================
Event Handlers / Functions
====================== */
// All used in section 3.

const toggleTask = (task: Task): void => {
  task.done = !task.done
}

const clearTasks = (): void => {
  tasks.value = []
}

const resetTasks = (): void => {
  tasks.value = createTasks()
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="bg-card o mx-auto max-w-lg space-y-4 rounded-xl border p-4 shadow">
    <h2 class="text-primary text-center text-2xl font-bold">Slots Demo</h2>

    <!-- ====================
          Default Slot
    ===================== -->

    <section class="mb-10 space-y-2">
      <h3 class="font-medium">
        1. This <code class="text-pink-500">BaseCard</code> implements only the
        <code class="text-pink-500">default</code> slot.
      </h3>

      <!-- 
      BaseCard contains three slots internally:

        defineSlots<{
          header?(): any
          default?(): any
          footer?(): any
         }>()

      In this case, only the default slot is implemented, analagous to React's children prop.
      -->
      <BaseCard class="shadow">
        <p>Anything between the tags goes into the default slot.</p>
      </BaseCard>
    </section>

    <!-- ====================
          Named Slots
    ===================== -->

    <section class="mb-10 space-y-2">
      <h3 class="font-medium">
        2. This <code class="text-pink-500">BaseCard</code> uses all three slots:
        <code class="text-pink-500">header</code>, <code class="text-pink-500">default</code>,
        <code class="text-pink-500">footer</code>.
      </h3>

      <!-- Here, we're implementing all three slots: header, default, footer. -->
      <BaseCard class="shadow">
        <!--  It looks like you can also use v-slot:header="" instad of the shorthand. -->
        <template #header>Profile settings</template>

        <!-- This content goes to the default slot -->
        <p>Named slots let a component expose several "holes" for content.</p>

        <template #footer>
          <BaseButton class="min-w-22">Cancel</BaseButton>
          <BaseButton class="min-w-22">Save</BaseButton>
        </template>
      </BaseCard>
    </section>

    <!-- ====================
          Scoped Slots
    ===================== -->
    <!--
    DataList passes { item, index } up to us.
    The parent controls the markup, the child controls the data.
    -->
    <section class="space-y-2">
      <h3 class="font-medium">
        3. This <code class="text-pink-500">BaseCard</code> implements scoped slots within
        <code class="text-pink-500">DataList</code>.
      </h3>
      <BaseCard class="shadow">
        <template #header>Remaining Tasks: {{ remainingCount }}</template>

        <DataList :items="tasks">
          <!-- 
          Scoped slots are the same idea as render props in React. 
          The child does the looping and hands each item back to the parent.
          Then the parent decides what it looks like.

          The problem they solve: A normal slot is one-way: the parent gives content to the child. 
          But DataList owns the loop, so only it knows what item and index are on each pass. 
          The parent can't write {{ item.title }} in a regular slot, because item doesn't exist in the 
          parent's scope. Scoped slots let the child PASS DATA BACK UP.



          DataList itself has two slots: item and empty:

            defineSlots<{
              item(props: { item: T; index: number }): any
              empty?(): any
            }>()
           
          Internally, the item slot is used to render the content inside of each <li>.
          The li takes the items props and does a v-for:

            <li v-for="(item, index) in items" :key="index" class="py-2">

          This exposes item and index, which are then dynamically assigned to the
          slot. Additionally, {{ item }} is passed as the fallback content.

            <slot name="item" :item="item" :index="index">{{ item }}</slot>

          Now, in THIS component, we can ALSO access item and index as #item="{ item, index }"
          The #item="{ item, index }" reads: "for the slot named item, take the props object 
          it gives me and destructure it." Those names are now available inside the template block only.

          In React, this would look like this, where renderItem is the slot, its argument is the slot props, 
          and the returned JSX is the slot content. Vue just writes it as template syntax.

            <DataList 
              items={tasks} 
              renderItem={({ item, index }) => (<label>{index + 1}. {item.title}</label>)} 
            />
          -->
          <template #item="{ item, index }">
            <label
              class="flex cursor-pointer items-center gap-2"
              :class="item.done ? 'line-through' : ''"
            >
              <input type="checkbox" :checked="item.done" @change="toggleTask(item)" />
              {{ index + 1 }}. {{ item.title }}
            </label>
          </template>

          <!--
          The internal <slot v-else name="empty"> is pretty basic. 
          It merely provides a message when items.length is 0.
          -->
          <template #empty>
            <p class="">
              All cleared. Click the
              <span class="text-primary font-semibold">Reset</span> buttonto bring them back.
            </p>
          </template>
        </DataList>

        <template #footer>
          <BaseButton class="min-w-22" @click="clearTasks">Clear</BaseButton>
          <BaseButton class="min-w-22" @click="resetTasks">Reset</BaseButton>
        </template>
      </BaseCard>
    </section>
  </div>
</template>
