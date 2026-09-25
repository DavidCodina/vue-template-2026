<script setup lang="ts">
///////////////////////////////////////////////////////////////////////////
//
// ⚠️ Disclaimer:
//
// Obviously, this form is stupid long. In production, one should use Zod +
// TanStack Form. However, here I've done everything manually as an exercise.
//
///////////////////////////////////////////////////////////////////////////
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
flex bg-card dark:bg-default/15
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

const website = ref('')
const websiteTouched = ref(false)
const websiteError = ref('')

const street = ref('')
const streetTouched = ref(false)
const streetError = ref('')

const city = ref('')
const cityTouched = ref(false)
const cityError = ref('')

const companyName = ref('')
const companyNameTouched = ref(false)
const companyNameError = ref('')

const catchPhrase = ref('')
const catchPhraseTouched = ref(false)
const catchPhraseError = ref('')

// i.e., "business speak:
const bs = ref('')
const bsTouched = ref(false)
const bsError = ref('')

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
  [
    fullNameError,
    emailError,
    userNameError,
    phoneError,
    websiteError,
    streetError,
    cityError,
    companyNameError,
    catchPhraseError,
    bsError
  ].some((e) => !!e.value)
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

  if (typeof value !== 'string') {
    error = 'Invalid type'
  } else if (value.trim() === '') {
    error = 'Full name required'
  }

  fullNameError.value = error
  return error
}

/* =================== */

const validateEmail = (value?: string) => {
  value = typeof value === 'string' ? value : email.value
  let error = ''
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/email#basic_validation
  const emailRegex =
    /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*$/i

  if (typeof value !== 'string') {
    error = 'Invalid type'
  } else if (value.trim() === '') {
    error = 'Email required'
  } else if (!emailRegex.test(value)) {
    error = 'Enter a valid email address'
  }

  emailError.value = error
  return error
}

/* =================== */

const validateUserName = (value?: string) => {
  value = typeof value === 'string' ? value : userName.value
  let error = ''

  if (typeof value !== 'string') {
    error = 'Invalid type'
  } else if (value.trim() === '') {
    error = 'User name required'
  }

  userNameError.value = error
  return error
}

const validatePhone = (value?: string) => {
  value = typeof value === 'string' ? value : phone.value
  let error = ''

  if (typeof value !== 'string') {
    error = 'Invalid type'
  } else if (value.trim() === '') {
    error = 'Phone required'
  }

  phoneError.value = error
  return error
}

/* =================== */

const validateWebsite = (value?: string) => {
  value = typeof value === 'string' ? value : website.value
  let error = ''

  if (typeof value !== 'string') {
    error = 'Invalid type'
  } else if (value.trim() === '') {
    error = 'Website required'
  }

  ///////////////////////////////////////////////////////////////////////////
  //
  // If you wanted to ensure that it was a full URL:
  //
  //   ❌ example.com         : bare domain / hostname (not a URL at all in the formal sense)
  //   ✅ https://example.com : Absolute URL
  //
  // You could validate against new URL(). However, in this case it's just a demo.
  // The domain name (second-level-domain.top-level-domain) pattern is fine and
  // consistent with what jsonplaceholder.typicode.com returns.
  //
  // new URL(value.trim()) is being used purely for its side effect of
  // throwing when the string isn't a parseable absolute URL.
  // It's a validation-by-exception trick: construct a URL object, ignore the result,
  // and let catch set the error message if construction fails.
  //
  // How the URL constructor works: new URL(input, base?)
  //
  //   - input must be a string (or something coercible to one via toString()).
  //
  //   - If input is not an absolute URL (i.e. it has no recognized scheme like
  //     https://, mailto:, ftp://, etc.) and no base argument is given, the
  //     constructor throws a TypeError.
  //
  //   - If parsing succeeds, it returns a URL object with parsed components
  //     (.protocol, .hostname, .pathname, etc.) — none of which this code uses,
  //     since it only cares whether the call threw.
  //
  ///////////////////////////////////////////////////////////////////////////

  // else {
  //   try {
  //     new URL(value.trim())
  //   } catch {
  //     error = 'Enter a valid URL (e.g. https://example.com)'
  //   }
  // }

  websiteError.value = error
  return error
}

/* =================== */

const validateStreet = (value?: string) => {
  value = typeof value === 'string' ? value : street.value
  let error = ''

  if (typeof value !== 'string') {
    error = 'Invalid type'
  } else if (value.trim() === '') {
    error = 'Street required'
  }

  streetError.value = error
  return error
}

/* =================== */

const validateCity = (value?: string) => {
  value = typeof value === 'string' ? value : city.value
  let error = ''

  if (typeof value !== 'string') {
    error = 'Invalid type'
  } else if (value.trim() === '') {
    error = 'City required'
  }

  cityError.value = error
  return error
}

/* =================== */

const validateCompanyName = (value?: string) => {
  value = typeof value === 'string' ? value : companyName.value
  let error = ''

  if (typeof value !== 'string') {
    error = 'Invalid type'
  } else if (value.trim() === '') {
    error = 'Company required'
  }
  companyNameError.value = error
  return error
}

/* =================== */

const validateCatchPhrase = (value?: string) => {
  value = typeof value === 'string' ? value : catchPhrase.value
  let error = ''

  if (typeof value !== 'string') {
    error = 'Invalid type'
  } else if (value.trim() === '') {
    error = 'Catch phrase required'
  }

  catchPhraseError.value = error
  return error
}

/* =================== */

const validateBS = (value?: string) => {
  value = typeof value === 'string' ? value : bs.value
  let error = ''

  if (typeof value !== 'string') {
    error = 'Invalid type'
  } else if (value.trim() === '') {
    error = 'BS required'
  }

  bsError.value = error
  return error
}

/* =================== */

// ❎ Switch to Zod.
const validate = (): boolean => {
  // ❌ const errors: string[] = []

  // Set true on all toucher refs.
  const touchers = [
    fullNameTouched,
    emailTouched,
    userNameTouched,
    phoneTouched,
    websiteTouched,
    streetTouched,
    cityTouched,
    companyNameTouched,
    catchPhraseTouched,
    bsTouched
  ]

  touchers.forEach((toucher) => {
    toucher.value = true
  })

  const validators: (() => string)[] = [
    validateFullName,
    validateEmail,
    validateUserName,
    validatePhone,
    validateWebsite,
    validateStreet,
    validateCity,
    validateCompanyName,
    validateCatchPhrase,
    validateBS
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

/* =================== */

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

  website.value = ''
  websiteTouched.value = false
  websiteError.value = ''

  street.value = ''
  streetTouched.value = false
  streetError.value = ''

  city.value = ''
  cityTouched.value = false
  cityError.value = ''

  companyName.value = ''
  companyNameTouched.value = false
  companyNameError.value = ''

  catchPhrase.value = ''
  catchPhraseTouched.value = false
  catchPhraseError.value = ''

  bs.value = ''
  bsTouched.value = false
  bsError.value = ''
}

/* =================== */

const handleCreateUser = async () => {
  isSubmitting.value = true

  const createUserInput: CreateUserInput = {
    name: fullName.value.trim(),
    email: email.value.trim(),
    username: userName.value.trim(),
    phone: phone.value.trim(),
    website: website.value.trim(),

    address: {
      street: street.value.trim(),
      city: city.value.trim()
    },

    company: {
      name: companyName.value.trim(),
      catchPhrase: catchPhrase.value.trim(),
      bs: bs.value.trim()
    }
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

/* =================== */

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
            website
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('website')"
        >Website<sup aria-hidden="true" class="text-error">*</sup></label
      >
      <input
        :aria-invalid="!!websiteError"
        :aria-describedby="websiteError ? fieldId('website-error') : undefined"
        autocomplete="url"
        required
        :id="fieldId('website')"
        :class="[
          inputClasses,
          inputValidityClasses({ touched: websiteTouched, error: websiteError })
        ]"
        placeholder="google.com"
        type="url"
        @blur="
          (e: Event) => {
            // const target = e.target as HTMLInputElement
            websiteTouched = true
            validateWebsite(/* target.value */)
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            website = target.value

            if (websiteTouched) {
              validateWebsite(/* target.value */)
            }
          }
        "
        :value="website"
      />

      <p v-if="websiteError" :id="fieldId('website-error')" :class="errorClasses">
        {{ websiteError }}
      </p>
    </div>

    <!-- ====================
            street
    ====================== -->
    <!--  
    autocomplete="street-address" - this is non-arbitrary. 
    Standard HTML expects autocomplete="street-address" or address-line1.
    -->

    <div>
      <label :class="labelClass" :for="fieldId('street')">
        Street<sup aria-hidden="true" class="text-error">*</sup>
      </label>

      <input
        :aria-invalid="!!streetError"
        :aria-describedby="streetError ? fieldId('street-error') : undefined"
        autocomplete="street-address"
        required
        :id="fieldId('street')"
        :class="[
          inputClasses,
          inputValidityClasses({ touched: streetTouched, error: streetError })
        ]"
        placeholder="123 Main St"
        type="text"
        @blur="
          (e: Event) => {
            streetTouched = true
            validateStreet()
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            street = target.value

            if (streetTouched) {
              validateStreet()
            }
          }
        "
        :value="street"
      />

      <p v-if="streetError" :id="fieldId('street-error')" :class="errorClasses">
        {{ streetError }}
      </p>
    </div>

    <!-- ====================
              City
    ====================== -->
    <!-- Standard HTML expects autocomplete="address-level2". -->

    <div>
      <label :class="labelClass" :for="fieldId('city')">
        City<sup aria-hidden="true" class="text-error">*</sup>
      </label>

      <input
        :aria-invalid="!!cityError"
        :aria-describedby="cityError ? fieldId('city-error') : undefined"
        autocomplete="address-level2"
        required
        :id="fieldId('city')"
        :class="[inputClasses, inputValidityClasses({ touched: cityTouched, error: cityError })]"
        placeholder="e.g., Metropolis"
        type="text"
        @blur="
          (e: Event) => {
            cityTouched = true
            validateCity()
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            city = target.value

            if (cityTouched) {
              validateCity()
            }
          }
        "
        :value="city"
      />

      <p v-if="cityError" :id="fieldId('city-error')" :class="errorClasses">
        {{ cityError }}
      </p>
    </div>

    <!-- ====================
          Company Name
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('companyName')">
        Company Name<sup aria-hidden="true" class="text-error">*</sup>
      </label>

      <input
        :aria-invalid="!!companyNameError"
        :aria-describedby="companyNameError ? fieldId('companyName-error') : undefined"
        autocomplete="organization"
        required
        :id="fieldId('companyName')"
        :class="[
          inputClasses,
          inputValidityClasses({ touched: companyNameTouched, error: companyNameError })
        ]"
        placeholder="ACME Inc."
        type="text"
        @blur="
          (e: Event) => {
            companyNameTouched = true
            validateCompanyName()
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            companyName = target.value

            if (companyNameTouched) {
              validateCompanyName()
            }
          }
        "
        :value="companyName"
      />

      <p v-if="companyNameError" :id="fieldId('companyName-error')" :class="errorClasses">
        {{ companyNameError }}
      </p>
    </div>

    <!-- ====================
          Catch Phrase
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('catchPhrase')">
        Catch Phrase<sup aria-hidden="true" class="text-error">*</sup>
      </label>

      <input
        :aria-invalid="!!catchPhraseError"
        :aria-describedby="catchPhraseError ? fieldId('catchPhrase-error') : undefined"
        autocomplete="off"
        required
        :id="fieldId('catchPhrase')"
        :class="[
          inputClasses,
          inputValidityClasses({ touched: catchPhraseTouched, error: catchPhraseError })
        ]"
        placeholder="Innovate. Elevate. Dominate..."
        type="text"
        @blur="
          (e: Event) => {
            catchPhraseTouched = true
            validateCatchPhrase()
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            catchPhrase = target.value

            if (catchPhraseTouched) {
              validateCatchPhrase()
            }
          }
        "
        :value="catchPhrase"
      />

      <p v-if="catchPhraseError" :id="fieldId('catchPhrase-error')" :class="errorClasses">
        {{ catchPhraseError }}
      </p>
    </div>

    <!-- ====================
              BS
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('bs')">
        BS<sup aria-hidden="true" class="text-error">*</sup>
      </label>

      <input
        :aria-invalid="!!bsError"
        :aria-describedby="bsError ? fieldId('bs-error') : undefined"
        autocomplete="off"
        required
        :id="fieldId('bs')"
        :class="[inputClasses, inputValidityClasses({ touched: bsTouched, error: bsError })]"
        placeholder="synergize scalable paradigms"
        type="text"
        @blur="
          (e: Event) => {
            bsTouched = true
            validateBS()
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            bs = target.value

            if (bsTouched) {
              validateBS()
            }
          }
        "
        :value="bs"
      />

      <p v-if="bsError" :id="fieldId('bs-error')" :class="errorClasses">
        {{ bsError }}
      </p>
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
