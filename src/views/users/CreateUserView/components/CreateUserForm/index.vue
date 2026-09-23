<script setup lang="ts">
/* ======================
        Imports
====================== */

import { computed, ref, useId } from 'vue'
import { RotateCcw, Send } from '@lucide/vue'
import { createUser } from '../../../api/createUser'
import type { CreateUserInput } from '../../../types'

/* ======================
      Composables
====================== */

// useId() (Vue 3.5+) generates a unique, SSR-safe ID. We use it as a prefix so
// every <label for="..."> is guaranteed to match its input, even if this
// component is rendered multiple times on the same page.
const uid = useId()

const toast = useToast()

/* ======================
      Variables
====================== */

const labelClass = 'text-secondary mb-1 block text-sm font-semibold cursor-pointer select-none'

const FIELD_BOX_SHADOW_MIXIN = `shadow-xs`

const FIELD_FOCUS_MIXIN = `
focus-visible:shadow-none
focus-visible:border-secondary
focus-visible:ring-[3px]
focus-visible:ring-secondary/40
`

// const FIELD_VALID_MIXIN = `
// not-group-data-validating/root:data-valid:not-data-disabled:border-success
// not-group-data-validating/root:data-valid:focus-visible:border-success
// not-group-data-validating/root:data-valid:focus-visible:ring-success/40
// `

// const FIELD_INVALID_MIXIN = `
// not-group-data-validating/root:data-invalid:not-data-disabled:border-destructive
// not-group-data-validating/root:data-invalid:focus-visible:border-destructive
// not-group-data-validating/root:data-invalid:focus-visible:ring-destructive/40
// `

// const FIELD_DISABLED_MIXIN = `
// data-disabled:cursor-not-allowed
// data-disabled:border-neutral-400
// `

const inputClass = `
text-sm
flex bg-card
w-full min-w-0
[&:not([type='file'])]:px-[0.5em]
[&:not([type='file'])]:py-[0.25em]
rounded-[0.375em]
border outline-none
placeholder:text-muted-foreground
placeholder:italic
${FIELD_BOX_SHADOW_MIXIN}
${FIELD_FOCUS_MIXIN}
`

const errorClass = 'mt-1 text-sm text-error'

/* ======================
          Refs
====================== */

const fullName = ref<string>('')
const fullNameError = ref<string>('')
// fullNameTouched = ref<boolean>(false)
const email = ref<string>('')
const emailError = ref<string>('')
// emailTouched = ref<boolean>(false)
const userName = ref<string>('')
const userNameError = ref<string>('')
// userNameTouched = ref<boolean>(false)
const phone = ref<string>('')
const phoneError = ref<string>('')
// phoneTouched = ref<boolean>(false)

const isSubmitting = ref<boolean>(false)

/* ======================
        Compute
====================== */
// Conceptually, this is like derived state in React. However, because Vue doesn't
// rerun the entire component on each render, we need to wrap it in computed, which
// is kind of like a more basic version of watch().

const isErrors = computed((): boolean => {
  return !!fullNameError.value && !!emailError.value && !!userNameError.value && !!phoneError.value
})

/* ======================
  Methods / Functions
====================== */

const fieldId = (name: string) => `${uid}-${name}` // e.g., id="v6-email"

const validateFullName = () => {
  fullNameError.value = fullName.value ? '' : 'Required'
}

const validateEmail = () => {
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/email#basic_validation
  const emailRegex =
    /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i

  if (!email.value) {
    emailError.value = 'Email required'
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Invalid email'
  } else {
    emailError.value = ''
  }
}

const validateUserName = () => {
  userNameError.value = userName.value ? '' : 'Required'
}

const validatePhone = () => {
  phoneError.value = phone.value ? '' : 'Required'
}

// ❎ Switch to Zod.
const validate = (): boolean => {
  validateFullName()
  validateEmail()
  validateUserName()
  validatePhone()

  console.log('validate internal isErrors.value', isErrors.value)
  return !isErrors.value
}

const resetForm = () => {
  fullName.value = ''
  fullNameError.value = ''
  email.value = ''
  emailError.value = ''
  phone.value = ''
  phoneError.value = ''
  userName.value = ''
  userNameError.value = ''
}

const handleCreateUser = async () => {
  isSubmitting.value = true

  const createUserInput: CreateUserInput = {
    name: fullName.value,
    email: email.value,
    username: userName.value,
    phone: phone.value
  }

  try {
    // Technically, createUser() always handles errors internally, but having
    // a try/catch on the consuming side is still a good practice.
    const result = await createUser(createUserInput)
    const { code: _code, data, message: _message, success } = result

    if (success !== true) {
      toast.add({
        title: 'Error!',
        description: 'Unable to create the user.',
        color: 'error',
        icon: 'i-lucide-triangle-alert',
        duration: 5000,
        class: `
      border border-error
      [&_[data-slot=base]]:bg-card
      [&_[data-slot=icon]]:size-8
      [&_[data-slot=title]]:text-lg
      [&_[data-slot=title]]:text-error
      [&_[data-slot=description]]:text-error
      [&_[data-slot=close]]:text-error/80
      [&_[data-slot=close]]:hover:text-error
      [&_[data-slot=leadingIcon]]:size-6
      `
      })
      return
    }

    toast.add({
      title: 'Success!',
      description: 'The user was created successfully!',
      color: 'success',
      icon: 'i-lucide-circle-check',
      duration: 5000,
      class: `
      border border-success
      [&_[data-slot=base]]:bg-card
      [&_[data-slot=icon]]:size-8
      [&_[data-slot=title]]:text-lg
      [&_[data-slot=title]]:text-success
      [&_[data-slot=description]]:text-success
      [&_[data-slot=close]]:text-success/80
      [&_[data-slot=close]]:hover:text-success
      [&_[data-slot=leadingIcon]]:size-6
      `
    })

    resetForm()
    console.log(data) // ❌ Temporary

    // ❎ Redirect back to UsersView.
  } catch (_err) {
    toast.add({
      title: 'Error!',
      description: 'Unable to create resource.',
      color: 'error',
      icon: 'i-lucide-triangle-alert',
      duration: 5000,
      class: `
      border border-error
      [&_[data-slot=base]]:bg-card
      [&_[data-slot=icon]]:size-8
      [&_[data-slot=title]]:text-lg
      [&_[data-slot=title]]:text-error
      [&_[data-slot=description]]:text-error
      [&_[data-slot=close]]:text-error/80
      [&_[data-slot=close]]:hover:text-error
      [&_[data-slot=leadingIcon]]:size-6
      `
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleSubmit = () => {
  if (!validate()) {
    toast.add({
      title: 'Error!',
      description: 'The form has errors. Please fix them and try again.',
      color: 'error',
      icon: 'i-lucide-triangle-alert',
      duration: 5000,

      // This targets the top-level <li>, but also parts within the progress bar.
      // [&_[data-slot=base]]: ...
      class: `
      border border-error
      [&_[data-slot=base]]:bg-card
      [&_[data-slot=icon]]:size-8
      [&_[data-slot=title]]:text-lg
      [&_[data-slot=title]]:text-error
      [&_[data-slot=description]]:text-error
      [&_[data-slot=close]]:text-error/80
      [&_[data-slot=close]]:hover:text-error
      [&_[data-slot=leadingIcon]]:size-6
      `
    })
    return
  }

  handleCreateUser()
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <section class="mb-6 flex justify-center">
    <div class="size-20 bg-slate-50"></div>
    <div class="size-20 bg-slate-100"></div>
    <div class="size-20 bg-slate-200"></div>
    <div class="size-20 bg-slate-300"></div>
    <div class="size-20 bg-slate-400"></div>
    <div class="size-20 bg-slate-500"></div>
    <div class="size-20 bg-slate-600"></div>
    <div class="size-20 bg-slate-700"></div>
    <div class="size-20 bg-slate-800"></div>
    <div class="size-20 bg-slate-900"></div>
    <div class="size-20 bg-slate-950"></div>
  </section>
  <section class="mb-12 flex justify-center">
    <div class="size-20 bg-neutral-50"></div>
    <div class="size-20 bg-neutral-100"></div>
    <div class="size-20 bg-neutral-200"></div>
    <div class="size-20 bg-neutral-300"></div>
    <div class="size-20 bg-neutral-400"></div>
    <div class="size-20 bg-neutral-500"></div>
    <div class="size-20 bg-neutral-600"></div>
    <div class="size-20 bg-neutral-700"></div>
    <div class="size-20 bg-neutral-800"></div>
    <div class="size-20 bg-neutral-900"></div>
    <div class="size-20 bg-neutral-950"></div>
  </section>

  <form
    class="bg-card mx-auto max-w-150 space-y-4 rounded-lg border p-4 shadow"
    @submit.prevent="handleSubmit"
    novalidate
  >
    <!-- ====================
            Full Name
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('fullName')">Full name</label>
      <input
        :id="fieldId('fullName')"
        :class="inputClass"
        :aria-invalid="!!fullNameError"
        autocomplete="name"
        placeholder="Full Name..."
        type="text"
        v-model.trim="fullName"
      />
      <p v-if="fullNameError" :class="errorClass">{{ fullNameError }}</p>
    </div>

    <!-- ====================
              Email
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('email')">Email</label>
      <input
        :id="fieldId('email')"
        :class="inputClass"
        :aria-invalid="!!emailError"
        autocomplete="email"
        placeholder="name@example.com"
        type="email"
        v-model.trim="email"
      />
      <p v-if="emailError" :class="errorClass">{{ emailError }}</p>
    </div>

    <!-- ====================
            User Name
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('userName')">User Name</label>
      <input
        :id="fieldId('userName')"
        :class="inputClass"
        placeholder="User Name..."
        type="text"
        v-model.trim="userName"
      />

      <p v-if="userNameError" :class="errorClass">{{ userNameError }}</p>
    </div>

    <!-- ====================
              Phone
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('phone')">Phone</label>
      <input
        :id="fieldId('phone')"
        :class="inputClass"
        autocomplete="tel"
        placeholder="(555) 123-4567"
        type="tel"
        v-model.trim="phone"
      />

      <p v-if="phoneError" :class="errorClass">{{ phoneError }}</p>
    </div>

    <!-- ====================
            Actions
    ====================== -->

    <div class="flex gap-2">
      <button
        :disabled="isErrors"
        class="bg-secondary hover:bg-primary disabled:bg-error flex flex-1 items-center justify-center gap-1 rounded px-2 py-1 text-sm font-semibold text-white disabled:pointer-events-none"
        type="submit"
      >
        <Send :size="14" />

        {{ isErrors ? 'Please fix the errors.' : 'Create User' }}
      </button>

      <button
        class="bg-secondary hover:bg-error flex min-w-25 items-center justify-center gap-1 rounded px-2 py-1 text-sm font-semibold text-white"
        type="button"
        @click="resetForm"
      >
        <RotateCcw :size="14" />
        Reset
      </button>
    </div>
  </form>
</template>
