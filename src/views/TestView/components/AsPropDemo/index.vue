<script setup lang="ts">
import type { Component } from 'vue'

type AsProp = string | Component

withDefaults(
  defineProps<{
    as?: AsProp
  }>(),
  {
    as: 'div'
  }
)
</script>

<!-- ======================================================================

======================================================================= -->
<!-- 

Usage:


  <div class="flex justify-center gap-4">
    <AsPropDemo as="section" />
    <AsPropDemo as="article" />
    <AsPropDemo as="span" />
    <AsPropDemo :as="RouterLink" to="/about" />
  </div>


This is the basic idea for a polymorphic component in Vue, but can we make 
it better? How can we get improved tyep safety?

AI: 

  This is one of the biggest limitations of Vue polymorphic components compared to 
  React's more advanced generic component patterns. Given this: type AsProp = string | Component,
  Vue knows that "as can be some element or component", but it does not know "if as='a', then href is allowed".
  or "if as=RouterLink, then to is required".

  What you'd ideally want is something like:

    <AsPropDemo as="a" href="/foo" /> ✅
    <AsPropDemo<AsPropDemo as="div" href="/foo" /> ❌
    <AsPropDemo :as="RouterLink" to="/" /> ✅
 
  To achieve that, the component's props would have to be dependent on the value of another prop (as).
  TypeScript can model this. Vue SFCs mostly cannot. Nuxt UI, Reka UI, Radix Vue, etc. don't usually 
  get perfect type safety here. Instead they have types that look something like:

    as?: string | Component

  The closest thing to strong typing:

    <script setup lang="ts" generic="T extends Component | keyof HTMLElementTagNameMap">

  and then do a bunch of conditional typing:

    type Props<T> = {
      as?: T
    }

  But then you quickly run into problems because Vue templates don't fully propagate the generic into $attrs.
  Something like: <AsPropDemo<'a'> href="/foo" /> can be typed, but <AsPropDemo as="a" href="/foo" />
  typically cannot get all the way to:

    href allowed
    to forbidden
    target allowed

  through template inference alone. The ecosystem support just isn't there yet.
-->

<template>
  <component
    :is="as"
    class="bg-primary flex size-40 items-center justify-center rounded-xl text-sm font-medium text-white shadow"
  >
    <slot> </slot>
  </component>
</template>
