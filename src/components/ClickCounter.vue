<script setup lang="ts">
import { computed, ref, useAttrs } from 'vue'
// import type { Attrs } from 'vue'
import { cn } from '@/utils/cn'

const props = defineProps<{
  class?: string
}>()

defineOptions({
  // Unbind Attrs, then rebind below with filteredAttrs.
  inheritAttrs: false
})

// attrs in inferred as type Attrs which is loosely typed as
// type Attrs = Data & AllowedAttrs
// and Data is type Data = { [x: string]: unknown }
const attrs = useAttrs()

const filteredAttrs = computed(() => {
  // onClick genuinely is the key, despite the naming mismatch
  // feeling weird  coming from the attribute name of @click.
  // Note: attrs type hinting only shows class and style/
  // TypeScript simply doesn't know what keys exist at compile time.
  const { onClick: _onClick, ...rest } = attrs
  return rest
})

///////////////////////////////////////////////////////////////////////////
//
// ref(0) creates a reactive object with a .value property.
// read/write it as count.value. Vue's reactivity system tracks
// that access and re-renders whenever it changes — there's no
// separate "setter function" like React's setCount.
//
// No .value needed in the template.
// Vue automatically "unwraps" refs, so you just write {{ count }} instead of {{ count.value }}.
// This is a Vue-specific magic trick (compiler-assisted) — it only applies in <template>, not inside <script>.
//
///////////////////////////////////////////////////////////////////////////
const count = ref(0)

// Or inline it below with @click="count++"
function increment() {
  count.value++
}
</script>

<!-- ======================================================================

======================================================================= -->
<!-- Regarding @click="increment". By default, Vue merges listeners of the same name rather than overwriting.
 Thus, if the consumer also passes in an @click="handleClick" listener, it will also be called. That said,
 we don't want the user to be able to pass in their own @click.

 Solution: filter out onClick.
 For TypeScript support, look into doing this in tsconfig.json:

  "vueCompilerOptions": { "strictTemplates": true }


Usage:

<ClickCounter
  class="mx-auto my-4 flex bg-[#42B883] font-bold"
  type="submit"
  v-on:click="handleClick"
/>
-->
<template>
  <button
    @click="increment"
    :class="
      cn(
        'inline-flex cursor-pointer justify-center rounded bg-stone-500 px-2 py-1 text-center text-sm text-white',
        props.class
      )
    "
    type="button"
    v-bind="filteredAttrs"
  >
    Count: {{ count }}
  </button>
</template>

<!-- <style scoped></style> -->
