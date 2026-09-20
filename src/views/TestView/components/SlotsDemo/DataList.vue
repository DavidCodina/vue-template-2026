<script setup lang="ts" generic="T">
///////////////////////////////////////////////////////////////////////////
//
// For more on scoped slots, see Udemy/Academind, section 9.118:
// https://www.udemy.com/course/vuejs-2-the-complete-guide/learn/lecture/21526228#overview
//
// And:
//
// https://vuejs.org/guide/components/slots.html#scoped-slots
// https://www.w3schools.com/vue/vue_scoped-slots.php
// https://dev.to/scottstern06/vue-scoped-slots-wtf-are-they-and-how-do-i-use-them-59a3
// https://www.geeksforgeeks.org/javascript/what-is-the-difference-between-slots-and-scoped-slots-in-vuejs/
//
///////////////////////////////////////////////////////////////////////////

/* ======================
        Macros
====================== */

// Slot props are the data this component "hands up" to the parent.
// `T` is generic, so the parent gets the correct item type automatically.
defineSlots<{
  item(props: { item: T; index: number }): any
  empty?(): any
}>()

/* ======================
      Props / Emits
====================== */

defineProps<{
  items: T[]
}>()
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <ul v-if="items.length > 0" class="divide-y divide-zinc-100">
    <li v-for="(item, index) in items" :key="index" class="py-2">
      <!--
        SCOPED slot: DataList owns the loop and the data,
        the parent decides how each row looks.
        Attributes on <slot> (other than name) become slot props.
      -->
      <slot name="item" :item="item" :index="index">
        <!-- Fallback if the parent doesn't provide #item -->
        {{ item }}
      </slot>
    </li>
  </ul>

  <!-- Shown only when there are no items -->
  <slot v-else name="empty">
    <p class="">Nothing here yet...</p>
  </slot>
</template>
