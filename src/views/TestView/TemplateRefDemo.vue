<script setup lang="ts">
/* ======================
        Imports
====================== */

import { ref, useId, useTemplateRef } from 'vue'
import { cn } from '@/utils/cn'

const inputId = useId()

/* ======================
    Refs (i.e., State)
====================== */

const inputValue = ref('')

/* ======================
     Template Refs
====================== */
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ In Udemy/Academind tutorial 5.66 he goes into refs.
// However, he was using a legacy (Options API approach).
// Where he named the HTML element with ref="someRef", then
// accessed it with this.$refs.someRef.
//
// $refs belongs to the Options API, where this is the component instance.
// Inside <script setup> there is no this, so this.$refs.someRef has no equivalent here.
//
// Note: Vue 3.5+ added useTemplateRef. It's the newer, more explicit way to do this,
// rather than using the standard ref() approach.  With the standard approach, Vue matches
// the string "inputRef" in the template to a variable with the same name in your script.
//
//   const inputRef = ref<HTMLInputElement | null>(null)
//
// That match is implicit and easy to miss. If you renamed the variable and forgot the template,
// nothing would error. The ref would just quietly stay null. Conversely, with useTemplateRef()
// the link is explicit: you're saying "give me the element whose ref is 'inputRef'."
// The variable name no longer has to match, so you could write:
//
//    const myInput = useTemplateRef('inputRef').
//
// It also makes the code clearer about which refs are state and which are DOM elements,
// since ref() would no longer be doing both jobs.
//
// Which should you use?
// Since 3.5, the Vue docs recommend useTemplateRef for template refs. Your existing ref(null)
// code keeps working and isn't going away, and you'll see it in a huge amount of tutorial and
// legacy code. Both are correct. For new code, I'd use useTemplateRef since you're on a version
// that supports it.
//
///////////////////////////////////////////////////////////////////////////

const myInput = useTemplateRef<HTMLInputElement>('inputRef')

/* ======================
Event Handlers / Functions
====================== */

function handleSubmit() {
  // Rather, than using inputValue, we can also use myInput template ref.
  const value = myInput.value
  alert(`The value is: ${value?.value}`)
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section class="mx-auto max-w-80">
    <!-- ====================
          Form
  ===================== -->

    <form
      @submit.prevent="handleSubmit"
      class="bg-card mb-1 space-y-4 rounded-xl border p-4 shadow"
    >
      <div>
        <label :for="inputId" class="text-primary mb-1 block cursor-pointer text-sm font-medium"
          >Some Value:</label
        >
        <input
          :id="inputId"
          class="bg-card block w-full rounded-lg border px-2 py-1 text-sm"
          placeholder="Input a value..."
          ref="inputRef"
          type="text"
          v-model="inputValue"
        />
        <div class="text-xs">
          <span class="text-muted-foreground font-medium">Value:</span>&nbsp;
          <span class="font-mono text-pink-500"> {{ inputValue }}</span>
        </div>
      </div>

      <button
        :class="
          cn(
            'bg-secondary hover:bg-primary block w-full rounded-lg border border-[rgba(0,0,0,0.35)] px-2 py-1 text-sm font-medium text-white uppercase'
          )
        "
        type="submit"
      >
        Submit
      </button>
    </form>
    <div class="text-secondary text-center text-xs">
      (<span class="text-primary font-mono">TemplateRefDemo.vue</span>)
    </div>
  </section>
</template>
