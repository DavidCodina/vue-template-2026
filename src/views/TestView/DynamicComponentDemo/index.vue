<!-- https://vuejs.org/guide/essentials/component-basics.html#dynamic-components -->

<script setup lang="ts">
/* ======================
        Imports
====================== */

import { shallowRef } from 'vue'
import type { Component } from 'vue'
import Component1 from './Component1.vue'
import Component2 from './Component2.vue'
import Component3 from './Component3.vue'

/* ======================
        Types
====================== */

type ComponentOption = {
  label: string
  component: Component
}

/* ======================
    Refs (i.e., State)
====================== */

const options: ComponentOption[] = [
  { label: 'Component 1', component: Component1 },
  { label: 'Component 2', component: Component2 },
  { label: 'Component 3', component: Component3 }
]

// https://vuejs.org/api/reactivity-advanced.html#shallowref
// shallowRef (not ref) because a component definition should not be made deeply reactive.
// Vue warns if you put a component object in a regular ref().
const selectedComponent = shallowRef<Component>(Component1)

/* ======================
Event Handlers / Functions
====================== */

const selectComponent = (component: Component) => {
  selectedComponent.value = component
}
</script>

<!-- ======================================================================

======================================================================= -->
<!-- What's the value proposition here? The main benefit is that it makes things 
less verbose. Without it, or in place of it, we would otherwise need to do
something like this:

  <Component1 v-if="selected === 'one'" />
  <Component2 v-else-if="selected === 'two'" />
  <Component3 v-else-if="selected === 'three'" />

Beyond being shorter, the dynamic version has these advantages:

  1. The template doesn't change when the list does. With v-if, every new option means 
     another branch in the template. With :is, you add an entry to your data (like the 
     options array in the demo) and the template stays the same.

  2. The choice becomes data. The thing you render is just a value, so it can come from a prop, 
     a route, an API response, or a config object. That makes patterns like tab systems, wizard 
     steps, widget dashboards, and CMS-driven layouts much easier. You can't easily build these 
     with hardcoded v-if branches.

  3. It works with more than components. :is also accepts a plain HTML tag name as a string, 
     e.g. <component :is="level > 1 ? 'h2' : 'h1'">. That's handy for things like a button that 
    sometimes renders as a link.

  4. rops and events work as usual. You can write <component :is="selectedComponent" :title="title" @save="onSave" />,
     and Vue passes them to whichever component is active. The catch is that all the swappable components 
     should accept the same props and emit the same events.

  5. <KeepAlive> wraps around it cleanly. That's the state-preserving trick I mentioned earlier.


v-if is still the better choice in some cases:

  - You have only two or three fixed cases. An explicit v-if is easier to read at a glance.

  - The branches need different props. With v-if, each branch can pass its own props and 
    TypeScript checks them. With <component :is>, the props are checked against a generic 
    component type, so you get less type safety.

  - The condition isn't "which component" but "should this render at all," or it depends on 
    several unrelated conditions.

Use <component :is> when the question is "which of these interchangeable components should show here?", 
and v-if when the question is "should this show at all?"
-->
<template>
  <div class="mx-auto max-w-md space-y-4 p-6">
    <div class="flex gap-2">
      <button
        v-for="option in options"
        :key="option.label"
        type="button"
        class="flex-1 rounded-md border px-2 py-1 text-sm font-medium shadow transition-colors"
        :class="
          selectedComponent === option.component
            ? 'border-primary bg-primary text-white'
            : 'bg-card border'
        "
        @click="selectComponent(option.component)"
      >
        {{ option.label }}
      </button>
    </div>

    <!-- Dynamic component: whatever selectedComponent points to gets rendered here -->
    <component :is="selectedComponent" />
    <div class="text-center font-mono text-sm">DynamicComponentDemo</div>
  </div>
</template>
