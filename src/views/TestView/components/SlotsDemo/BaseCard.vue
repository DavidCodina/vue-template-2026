<script setup lang="ts">
/* ======================
        Macros
====================== */

defineSlots<{
  ///////////////////////////////////////////////////////////////////////////
  //
  // Regardless of what one uses, TypeScript doesn't actually
  // end up enforcing it on the consuming side.
  // Vue's docs use any because the return type is mostly irrelevant.
  // What TypeScript checks on the parent side is the slot props (the argument type), not the content.
  //
  // On a related note, removing the ? makes no difference because vue-tsc don't enforce required slots,
  // So... Basically, TypeScript requires that we type this, but there seems to be zero resulting benefit.
  //
  // In theory, one way of enforcing what content gets passed could be instead to pass markup as a prop.
  // Unfortunately, this is not valid in Vue:
  //
  //   <Message :message="<p>Hello</p>" />.
  //
  // In a Vue SFC template, :message="<p>Hello</p>" is invalid. The value of a :prop binding must be a
  // JavaScript expression, and <p>Hello</p> is template markup, not an expression.
  // The template compiler will also choke on the < inside the attribute.
  //
  // Similarly, in an SFC template you can't pass an actual component:
  //
  //    <Message :message="<MyComponent />" />.
  //
  // Technically, you could do this:
  //
  //   <Message  :message="'<p>Hello</p>'" />.
  //
  // This is only a string, then internally <Message /> needs v-html to render it. However,
  // this is untyped as markup and an XSS risk with user content, so it's not recommended.

  //
  // Conversely, in React this is valid: <Message message={<p>Hello</p>} />
  //
  // Ultimately, slots are intended to be the analog of the React pattern of "markup as a prop".
  //
  ///////////////////////////////////////////////////////////////////////////
  header?(): any //Or use VNode[] which is technically more accurate.

  ///////////////////////////////////////////////////////////////////////////
  //
  // Note: While default() looks like just another slot definition, it's actually special.
  // In Vue, default is the reserved name of the unnamed slot. To prove this, if you comment
  // it out, then the unnamed slot below will show a TypeScript error.
  //
  //   ❌ Element implicitly has an 'any' type because expression of type '"default"' can't be
  //      used to index type 'Readonly<__VLS_Slots> & __VLS_Slots'. Property 'default' does
  //      not exist on type 'Readonly<__VLS_Slots> & __VLS_Slots'.
  //
  // In other words, <slot /> is shorthand for <slot name="default" />.
  // In the parent, content that isn't inside a <template #something> is passed to the slot called default.
  // You can also write it explicitly as <template #default>.
  // At runtime, the slot is available as $slots.default, just as the footer was $slots.footer.
  //
  ///////////////////////////////////////////////////////////////////////////
  default?(): any
  footer?(): any
}>()
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div class="bg-card overflow-hidden rounded-lg border">
    <header class="text-primary border-b px-4 py-3 font-semibold">
      <!--
      This is a named slot of name="header".
      If the parent doesn't provide #header, the fallback content is set to "Untitled".
      -->
      <slot name="header">Untitled</slot>
    </header>

    <div class="p-4">
      <!-- The default slot needs no explicit name. 
      When consumed, anything not inside a <template #name> lands here.
      In other words, think of it like React children such that anything
      between the tags outputs into this <slot />:

        <BaseCard>...</BaseCard>
    
      Unlike in React, we must explicitly add <slot /> here. Without it,
      children (i.e., ...) will not be rendered.
      -->
      <slot />
    </div>

    <!--
    Here we're only showing <footer> if $slots.footer is defined (i.e., passed on the consuming side).
    -->
    <footer v-if="$slots.footer" class="flex justify-end gap-2 border-t bg-stone-100 px-4 py-3">
      <slot name="footer" />
    </footer>
  </div>
</template>
