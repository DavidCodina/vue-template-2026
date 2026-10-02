<script setup lang="ts">
/* ======================
        Imports
====================== */

import { FlaskConical, CircleCheck } from '@lucide/vue'
import Button from './index.vue'
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <!-- ====================
          solid
  ===================== -->

  <div>
    <div class="mb-4 flex items-center justify-center gap-2">
      <Button color="primary" square size="xl" title="The Button">
        <CircleCheck class="size-6" data-slot="leading-icon" aria-hidden="true" />
      </Button>

      <Button color="secondary" size="xl">
        <template #leading="{ ui }">
          <CircleCheck data-slot="leading-icon" aria-hidden="true" :class="ui.leadingIcon()" />
        </template>
      </Button>

      <Button color="success" size="xl" :leadingIcon="FlaskConical" />

      <Button color="info">Click Me</Button>
      <Button color="warning">Click Me</Button>
      <Button color="error">Click Me</Button>
      <Button color="neutral">Click Me</Button>
    </div>

    <div class="mb-4 flex justify-center gap-2">
      <Button color="primary" variant="outline">Click Me</Button>
      <Button color="secondary" variant="outline">Click Me</Button>
      <Button color="success" variant="outline">Click Me</Button>
      <Button color="info" variant="outline">Click Me</Button>
      <Button color="warning" variant="outline">Click Me</Button>
      <Button color="error" variant="outline">Click Me</Button>
      <Button color="neutral" variant="outline">Click Me</Button>
    </div>

    <!-- ====================
           soft
    ===================== -->

    <div class="mb-4 flex justify-center gap-2">
      <Button color="primary" variant="soft">Click Me</Button>
      <Button color="secondary" variant="soft">Click Me</Button>
      <Button color="success" variant="soft">Click Me</Button>
      <Button color="info" variant="soft">Click Me</Button>
      <Button color="warning" variant="soft">Click Me</Button>
      <Button color="error" variant="soft">Click Me</Button>
      <Button color="neutral" variant="soft">Click Me</Button>
    </div>

    <!-- ====================
            subtle
    ===================== -->

    <div class="mb-4 flex justify-center gap-2">
      <Button color="primary" variant="subtle">Click Me</Button>
      <Button color="secondary" variant="subtle">Click Me</Button>
      <Button color="success" variant="subtle">Click Me</Button>
      <Button color="info" variant="subtle">Click Me</Button>
      <Button color="warning" variant="subtle">Click Me</Button>
      <Button color="error" variant="subtle">Click Me</Button>
      <Button color="neutral" variant="subtle">Click Me</Button>
    </div>

    <!-- ====================
            ghost
    ===================== -->

    <div class="mb-4 flex justify-center gap-2">
      <Button color="primary" variant="ghost">Click Me</Button>
      <Button color="secondary" variant="ghost">Click Me</Button>
      <Button color="success" variant="ghost">Click Me</Button>
      <Button color="info" variant="ghost">Click Me</Button>
      <Button color="warning" variant="ghost">Click Me</Button>
      <Button color="error" variant="ghost">Click Me</Button>
      <Button color="neutral" variant="ghost">Click Me</Button>
    </div>

    <!-- ====================
             lint
    ===================== -->

    <div class="mb-4 flex justify-center gap-2">
      <Button color="primary" variant="link">Click Me</Button>
      <Button color="secondary" variant="link">Click Me</Button>
      <Button color="success" variant="link">Click Me</Button>
      <Button color="info" variant="link">Click Me</Button>
      <Button color="warning" variant="link">Click Me</Button>
      <Button color="error" variant="link">Click Me</Button>
      <Button color="neutral" variant="link">Click Me</Button>
    </div>

    <!-- ====================
   
    ===================== -->

    <div class="mb-4 flex items-center justify-center gap-2">
      <Button color="primary" size="xs">Click Me</Button>
      <Button color="secondary" size="sm">Click Me</Button>
      <Button color="success" size="md">Click Me</Button>
      <Button color="info" size="lg">Click Me</Button>
      <Button color="warning" size="xl">Click Me</Button>
      <Button
        color="error"
        size="xl"
        :ui="{
          leadingIcon: ''
        }"
        >Click Me</Button
      >

      <Button
        color="neutral"
        size="xl"
        :ui="{
          leadingIcon: ''
        }"
        loading
        trailing
        label="Click Here"
        :trailingIcon="FlaskConical"
      >
        <template #leading="{ ui }">
          <CircleCheck data-slot="leading-icon" aria-hidden="true" :class="ui.leadingIcon()" />
        </template>

        <!-- <template #trailing="{ ui }">
          <CircleCheck data-slot="trailing-icon" aria-hidden="true" :class="ui.trailingIcon()" />
        </template> -->
      </Button>
    </div>

    <!-- ====================
   
    ===================== -->

    <Button to="https://www.google.com/" color="info" class="mx-auto flex w-fit" loading>
      <template #leading="{ ui }">
        <CircleCheck loading aria-hidden="true" :class="ui.leadingIcon()" />
      </template>

      Google Me
    </Button>

    <!-- <a class="text-info outline outline-pink-500 outline-dashed">I'm a Link</a> -->

    <!-- <Button color="success" block class="mx-auto flex max-w-150">
      <template #leading="{ ui }">
        <CircleCheck loading aria-hidden="true" :class="ui.leadingIcon()" />
      </template>

      Click Me

      <template #trailing="{ ui }">
        <CircleCheck loading aria-hidden="true" :class="ui.trailingIcon()" />
      </template>
    </Button> -->

    <!-- <UButton size="md" color="primary" variant="solid">
      <template #leading>
        <CircleCheck loading aria-hidden="true" />
      </template>
      Button
    </UButton> -->
  </div>
</template>
