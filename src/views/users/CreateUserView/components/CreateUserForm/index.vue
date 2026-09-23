<script setup lang="ts">
/* ======================
        Imports
====================== */

import { computed, ref, useId } from 'vue'
import { useRouter } from 'vue-router'
import { TriangleAlert, LoaderCircle, RotateCcw, Send } from '@lucide/vue'
import { createUser } from '../../../api/createUser'
import type { CreateUserInput } from '../../../types'

/* ======================
      Composables
====================== */

// useId() (Vue 3.5+) generates a unique, SSR-safe ID. We use it as a prefix so
// every <label for="..."> is guaranteed to match its input, even if this
// component is rendered multiple times on the same page.
const uid = useId()

const router = useRouter()

const toast = useToast()

/* ======================
      Variables
====================== */

const labelClass = 'text-secondary mb-1 block text-sm font-semibold cursor-pointer select-none'

const FIELD_FOCUS_MIXIN = `
focus-visible:ring-secondary/40
focus-visible:border-secondary
`

// In production, we could also color the label text base on validity state,
// and remove error messaging when the field is disabled. However, that's
// really only practical when you have componentized field controls.
// For this demo, it's just too much extra code.
const FIELD_INVALID_MIXIN = `
not-disabled:border-error
focus-visible:border-error
focus-visible:ring-error/40
`

const FIELD_VALID_MIXIN = `
not-disabled:border-success
focus-visible:border-success
focus-visible:ring-success/40
`

const FIELD_DISABLED_MIXIN = `
disabled:cursor-not-allowed
disabled:border-neutral-400
`

///////////////////////////////////////////////////////////////////////////
//
// ⚠️ outline-hidden vs outline-none:
//
// This one is in inputClasses, so it affects every field. Your focus style is a ring,
// which is a box-shadow. In Windows High Contrast / forced-colors mode, browsers strip box-shadows,
// and in Tailwind v4 outline-none sets outline-style: none, so the field can end up with no visible
// focus at all. Tailwind v4 has outline-hidden for this case. It's invisible normally but falls back
// to a real outline in forced-colors mode
//
///////////////////////////////////////////////////////////////////////////
const inputClasses = `
text-sm
flex bg-card
w-full min-w-0
[&:not([type='file'])]:px-[0.5em]
[&:not([type='file'])]:py-[0.25em]
rounded-[0.375em]
border outline-hidden
placeholder:text-muted-foreground
placeholder:italic
shadow-xs focus-visible:shadow-none
focus-visible:ring-[3px]
${FIELD_DISABLED_MIXIN}
`

const errorClasses = 'mt-1 text-sm text-error'

/* ======================
          Refs
====================== */

const fullName = ref('')
const fullNameTouched = ref(false)
const fullNameError = ref('')

const email = ref('')
const emailTouched = ref(false)
const emailError = ref('')

const userName = ref('')
const userNameTouched = ref(false)
const userNameError = ref('')

const phone = ref('')
const phoneTouched = ref(false)
const phoneError = ref('')

// Note: currently all the inputs are still editable during submission.
// You may want to change this, but I don't think it's necessary.
const isSubmitting = ref(false)

/* ======================
        Computed
====================== */
// Conceptually, this is like derived state in React. However, because Vue doesn't
// rerun the entire component on each render, we need to wrap it in computed, which
// is kind of like a more basic version of watch().

const isErrors = computed(() =>
  [fullNameError, emailError, userNameError, phoneError].some((e) => !!e.value)
)

/* ======================
  Methods / Functions
====================== */

const fieldId = (name: string) => `${uid}-${name}` // e.g., id="v6-email"

const inputValidityClasses = ({ touched, error }: { touched: boolean; error: string }) => {
  if (touched && !error) return FIELD_VALID_MIXIN
  if (touched && error) return FIELD_INVALID_MIXIN
  return FIELD_FOCUS_MIXIN
}

///////////////////////////////////////////////////////////////////////////
//
// Note: Vue refs are mutable containers.
// ref.value = x writes synchronously!
// This means that, unlike in React, once a ref is set, it's set!
// In practice, this means that technically the validators don't need
// to accept a value as an argument or return the error directly.
// In this case, both fullName.value and fullNameError.value will
// never be stale and can function as the single source of truth.
//
// For this SFC, I will leave all the validators as they are to help
// emphasize the point that we are no longer in React world, but in
// other forms, we can be much more concise.
//
///////////////////////////////////////////////////////////////////////////

const validateFullName = (value?: string) => {
  value = typeof value === 'string' ? value : fullName.value
  let error = ''

  if (value.trim() === '') {
    error = 'Full name required'
  }

  fullNameError.value = error
  return error
}

const validateEmail = (value?: string) => {
  value = typeof value === 'string' ? value : email.value
  let error = ''
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/email#basic_validation
  const emailRegex =
    /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i

  if (value.trim() === '') {
    error = 'Email required'
  } else if (!emailRegex.test(value)) {
    error = 'Enter a valid email address'
  }

  emailError.value = error
  return error
}

const validateUserName = (value?: string) => {
  value = typeof value === 'string' ? value : userName.value
  let error = ''

  if (value.trim() === '') {
    error = 'User name required'
  }

  userNameError.value = error
  return error
}

const validatePhone = (value?: string) => {
  value = typeof value === 'string' ? value : phone.value
  let error = ''

  if (value.trim() === '') {
    error = 'Phone required'
  }

  phoneError.value = error
  return error
}

// ❎ Switch to Zod.
const validate = (): boolean => {
  // ❌ const errors: string[] = []

  // Set true on all toucher refs.
  const touchers = [fullNameTouched, emailTouched, userNameTouched, phoneTouched]

  touchers.forEach((toucher) => {
    toucher.value = true
  })

  const validators: (() => string)[] = [
    validateFullName,
    validateEmail,
    validateUserName,
    validatePhone
  ]

  validators.forEach((validator) => {
    ///////////////////////////////////////////////////////////////////////////
    //
    // Unlike in React, when a ref is set in Vue, it's synchronous!
    // This means we don't have to worry about stale values and batched updates.
    // Consequently, we don't need to rely on calculating if there are errors
    // directly. This is a big shift in the mental model when going from React to Vue.
    //
    //   ❌ const error = validator()
    //   ❌ if (error) { errors.push(error) }
    //
    ///////////////////////////////////////////////////////////////////////////
    validator()
  })

  // ❌ if (errors.length >= 1) {  return false  }
  // ❌ return true

  return !isErrors.value // ✅
}

const resetForm = () => {
  fullName.value = ''
  fullNameTouched.value = false
  fullNameError.value = ''

  email.value = ''
  emailTouched.value = false
  emailError.value = ''

  phone.value = ''
  phoneTouched.value = false
  phoneError.value = ''

  userName.value = ''
  userNameTouched.value = false
  userNameError.value = ''
}

const handleCreateUser = async () => {
  isSubmitting.value = true

  const createUserInput: CreateUserInput = {
    name: fullName.value.trim(),
    email: email.value.trim(),
    username: userName.value.trim(),
    phone: phone.value.trim()
  }

  try {
    // Technically, createUser() always handles errors internally, but having
    // a try/catch on the consuming side is still a good practice.
    const result = await createUser(createUserInput)
    const { code: _code, data: _data, message: _message, success } = result

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

    // Not needed if we're route switching.
    // resetForm()

    // Why bother uaing await here? It's a minor detail, but it means that the finally
    // block won't run until the router.push() is done, which forestalls setting
    // isSubmitting back to false until navigation settles.
    await router.push({ path: '/users' })

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
  if (isSubmitting.value) return

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
  <form
    class="bg-card mx-auto max-w-150 space-y-4 rounded-lg border p-4 shadow"
    @submit.prevent="handleSubmit"
    novalidate
  >
    <!-- ====================
            Full Name
    ====================== -->
    <!--
    Dropping down from  v-model.trim="fullName" to explicit :value/@input is the
    best approach when you need custom inline logic. It's not hacky. It's 
    not fighting the framework.

    The idiomatic Vue alternative, for comparison. The computed-setter pattern from 
    earlier is the "Vue way" of keeping v-model syntax while injecting logic:

      const fullNameModel = computed({
        get: () => fullName.value,
        set: (v) => {
          fullName.value = v.trim()
         if (fullNameTouched.value) validateFullName(fullName.value)
        }
      })
      <input v-model="fullNameModel" ... />

    Some teams prefer this because the template stays declarative-looking and the 
    logic lives in <script setup> where type inference is a bit smoother. But it 
    requires defining that computed outside the template, which I don't like.


    Why autocomplete="name"? If this is an admin creating other users, that's correct. 
    If it's self-signup, adding it back satisfies WCAG 1.3.5 (Identify Input Purpose).


    Why required if the form has novaliate? novalidate and required do different jobs:

      - novalidate turns off the browser's blocking behavior: the submit interception 
        and the "Please fill out this field" popup.

      - required still exposes the field's semantics to the accessibility tree, so screen 
        readers announce "required" when the field is focused.

    aria-required="true" is the alternative. It does the same semantic job with zero native-validation 
    side effects. But native attributes are preferred over ARIA when both work, so I'd use required.

    The asterisk has aria-hidden="true", which is correct because you don't want "star" read aloud. 
    But it also means screen reader users currently get no required indication at all. 
    required fills that gap without changing any behavior for sighted users.
    -->

    <div>
      <label :class="labelClass" :for="fieldId('fullName')"
        >Full name<sup aria-hidden="true" class="text-error">*</sup></label
      >
      <input
        :aria-invalid="!!fullNameError"
        :aria-describedby="fullNameError ? fieldId('fullName-error') : undefined"
        autocomplete="name"
        required
        :id="fieldId('fullName')"
        :class="[
          inputClasses,
          inputValidityClasses({ touched: fullNameTouched, error: fullNameError })
        ]"
        placeholder="Full Name..."
        type="text"
        @blur="
          (e: Event) => {
            // const target = e.target as HTMLInputElement
            fullNameTouched = true
            validateFullName(/* target.value */)
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            fullName = target.value // This is immediate!

            if (fullNameTouched) {
              ///////////////////////////////////////////////////////////////////////////
              //
              // Here we can acutally comment out passing in the value directly.
              // Why? Because we just set it above, and it happens synchronously,
              // unlike in React where there's an indeterminate about of time befor
              // the state updates.
              //
              ///////////////////////////////////////////////////////////////////////////
              validateFullName(/* target.value */)
            }
          }
        "
        :value="fullName"
      />
      <p v-if="fullNameError" :id="fieldId('fullName-error')" :class="errorClasses">
        {{ fullNameError }}
      </p>
    </div>

    <!-- ====================
              Email
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('email')"
        >Email<sup aria-hidden="true" class="text-error">*</sup></label
      >
      <input
        :aria-invalid="!!emailError"
        :aria-describedby="emailError ? fieldId('email-error') : undefined"
        autocomplete="email"
        required
        :id="fieldId('email')"
        :class="[inputClasses, inputValidityClasses({ touched: emailTouched, error: emailError })]"
        placeholder="name@example.com"
        type="email"
        @blur="
          (e: Event) => {
            // const target = e.target as HTMLInputElement
            emailTouched = true
            validateEmail(/* target.value */)
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            email = target.value

            if (emailTouched) {
              validateEmail(/* target.value */)
            }
          }
        "
        :value="email"
      />
      <p v-if="emailError" :id="fieldId('email-error')" :class="errorClasses">{{ emailError }}</p>
    </div>

    <!-- ====================
            User Name
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('userName')"
        >User Name<sup aria-hidden="true" class="text-error">*</sup></label
      >
      <input
        :aria-invalid="!!userNameError"
        :aria-describedby="userNameError ? fieldId('userName-error') : undefined"
        autocomplete="username"
        required
        :id="fieldId('userName')"
        :class="[
          inputClasses,
          inputValidityClasses({ touched: userNameTouched, error: userNameError })
        ]"
        placeholder="User Name..."
        type="text"
        @blur="
          (e: Event) => {
            // const target = e.target as HTMLInputElement
            userNameTouched = true
            validateUserName(/* target.value*/)
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            userName = target.value

            if (userNameTouched) {
              validateUserName(/* target.value */)
            }
          }
        "
        :value="userName"
      />

      <p v-if="userNameError" :id="fieldId('userName-error')" :class="errorClasses">
        {{ userNameError }}
      </p>
    </div>

    <!-- ====================
              Phone
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('phone')"
        >Phone<sup aria-hidden="true" class="text-error">*</sup></label
      >
      <input
        :aria-invalid="!!phoneError"
        :aria-describedby="phoneError ? fieldId('phone-error') : undefined"
        autocomplete="tel"
        required
        :id="fieldId('phone')"
        :class="[inputClasses, inputValidityClasses({ touched: phoneTouched, error: phoneError })]"
        placeholder="(555) 123-4567"
        type="tel"
        @blur="
          (e: Event) => {
            // const target = e.target as HTMLInputElement
            phoneTouched = true
            validatePhone(/* target.value */)
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            phone = target.value

            if (phoneTouched) {
              validatePhone(/* target.value */)
            }
          }
        "
        :value="phone"
      />

      <p v-if="phoneError" :id="fieldId('phone-error')" :class="errorClasses">{{ phoneError }}</p>
    </div>

    <!-- ====================
            Actions
    ====================== -->

    <div class="flex gap-2">
      <button
        :disabled="isErrors || isSubmitting"
        class="flex flex-1 items-center justify-center gap-2 rounded px-2 py-1 text-sm font-semibold text-white select-none"
        :class="
          isErrors ? 'bg-error pointer-events-none opacity-70' : 'bg-secondary hover:bg-primary'
        "
        type="submit"
      >
        <span v-if="isSubmitting" class="flex items-center justify-center gap-2"
          ><LoaderCircle class="size-[1.25em] animate-spin" /> Creating User…</span
        >

        <span v-else-if="isErrors" class="flex items-center justify-center gap-2"
          ><TriangleAlert class="size-[1.25em]" /> Please fix the errors.</span
        >

        <span v-else class="flex items-center justify-center gap-2"
          ><Send class="size-[1.25em]" /> Create User</span
        >
      </button>

      <button
        :disabled="isSubmitting"
        class="bg-secondary hover:bg-warning flex min-w-25 items-center justify-center gap-1 rounded px-2 py-1 text-sm font-semibold text-white select-none"
        type="button"
        @click="resetForm"
      >
        <RotateCcw class="size-[1.25em]" />
        Reset
      </button>
    </div>
  </form>
</template>
