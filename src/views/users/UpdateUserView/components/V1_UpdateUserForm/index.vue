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

import { computed, onMounted, reactive, ref, useId } from 'vue'
import { TriangleAlert, LoaderCircle, RotateCcw, Send } from '@lucide/vue'
import { getUser } from '../../../api/getUser'
import { updateUser } from '../../../api/updateUser'
import Input from '@/components/Input.vue'
import type { User, UpdateUserInput } from '../../../types'

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

const errorClasses = 'mt-1 text-sm text-error'

/* ======================
      Props / Emits
====================== */

const props = defineProps<{
  id: string
}>()

/* ======================
          Refs
====================== */

const user = ref<User | null>(null)
// Set to true because handleGetUser() is called immediately in onMounted hook.
const isLoading = ref(true)
const error = ref('')

const fullName = reactive<{ value: string; touched: boolean; error: string }>({
  value: '',
  touched: false,
  error: ''
})

const email = reactive<{ value: string; touched: boolean; error: string }>({
  value: '',
  touched: false,
  error: ''
})

const userName = reactive<{ value: string; touched: boolean; error: string }>({
  value: '',
  touched: false,
  error: ''
})

const phone = reactive<{ value: string; touched: boolean; error: string }>({
  value: '',
  touched: false,
  error: ''
})

const website = reactive<{ value: string; touched: boolean; error: string }>({
  value: '',
  touched: false,
  error: ''
})

const street = reactive<{ value: string; touched: boolean; error: string }>({
  value: '',
  touched: false,
  error: ''
})

const city = reactive<{ value: string; touched: boolean; error: string }>({
  value: '',
  touched: false,
  error: ''
})

const company = reactive<{ value: string; touched: boolean; error: string }>({
  value: '',
  touched: false,
  error: ''
})

const phrase = reactive<{ value: string; touched: boolean; error: string }>({
  value: '',
  touched: false,
  error: ''
})

// i.e., "business speak:
const bs = reactive<{ value: string; touched: boolean; error: string }>({
  value: '',
  touched: false,
  error: ''
})

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
  [fullName, email, userName, phone, website, street, city, company, phrase, bs].some(
    (field) => !!field.error
  )
)

/* ======================
  Methods / Functions
====================== */

const fieldId = (name: string) => `${uid}-${name}` // e.g., id="v6-email"

const isInvalid = ({ touched, error }: { touched: boolean; error: string }) => {
  if (touched && !error) return false
  if (touched && error) return true
  return undefined
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

  fullName.error = error
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

  email.error = error
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

  userName.error = error
  return error
}

/* =================== */

const validatePhone = (value?: string) => {
  value = typeof value === 'string' ? value : phone.value
  let error = ''

  if (typeof value !== 'string') {
    error = 'Invalid type'
  } else if (value.trim() === '') {
    error = 'Phone required'
  }

  phone.error = error
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

  website.error = error
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

  street.error = error
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

  city.error = error
  return error
}

/* =================== */

const validateCompany = (value?: string) => {
  value = typeof value === 'string' ? value : company.value
  let error = ''

  if (typeof value !== 'string') {
    error = 'Invalid type'
  } else if (value.trim() === '') {
    error = 'Company required'
  }
  company.error = error
  return error
}

/* =================== */

const validatePhrase = (value?: string) => {
  value = typeof value === 'string' ? value : phrase.value
  let error = ''

  if (typeof value !== 'string') {
    error = 'Invalid type'
  } else if (value.trim() === '') {
    error = 'Catch phrase required'
  }

  phrase.error = error
  return error
}

/* =================== */

const validateBS = (value?: string) => {
  value = typeof value === 'string' ? value : bs.value
  let error = ''

  if (typeof value !== 'string') {
    error = 'Invalid type'
  } else if (value.trim() === '') {
    error = 'Business speak required'
  }

  bs.error = error
  return error
}

/* =================== */

// ❎ Switch to Zod.
const validate = (): boolean => {
  // ❌ const errors: string[] = []

  // Set all fields to touched.
  const fields = [fullName, email, userName, phone, website, street, city, company, phrase, bs]

  fields.forEach((field) => {
    field.touched = true
  })

  const validators: (() => string)[] = [
    validateFullName,
    validateEmail,
    validateUserName,
    validatePhone,
    validateWebsite,
    validateStreet,
    validateCity,
    validateCompany,
    validatePhrase,
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

// ⚠️ In this case, it may make more sense for reset to reset back
// to the original user data if available, rather than clearing the form.

const resetForm = () => {
  fullName.value = ''
  fullName.touched = false
  fullName.error = ''

  email.value = ''
  email.touched = false
  email.error = ''

  phone.value = ''
  phone.touched = false
  phone.error = ''

  userName.value = ''
  userName.touched = false
  userName.error = ''

  website.value = ''
  website.touched = false
  website.error = ''

  street.value = ''
  street.touched = false
  street.error = ''

  city.value = ''
  city.touched = false
  city.error = ''

  company.value = ''
  company.touched = false
  company.error = ''

  phrase.value = ''
  phrase.touched = false
  phrase.error = ''

  bs.value = ''
  bs.touched = false
  bs.error = ''
}

/* =================== */

const handleGetUser = async () => {
  isLoading.value = true
  error.value = ''

  try {
    const result = await getUser(props.id)
    const { code: _code, data, message: _message, success } = result

    if (success !== true) {
      error.value = 'Unable to get resource'
      return
    }

    if (!data || typeof data !== 'object') {
      error.value = 'Invalid response data.'
      return
    }

    user.value = data

    // Update form fields.
    fullName.value = data.name
    email.value = data.email
    userName.value = data.username
    phone.value = data.phone
    website.value = data.website
    street.value = data.address?.street
    city.value = data.address?.city
    company.value = data.company?.name
    phrase.value = data.company?.catchPhrase
    bs.value = data.company?.bs
  } catch (_err) {
    error.value = 'Unable to get resource'
  } finally {
    isLoading.value = false
  }
}

/* =================== */

const handleUpdateUser = async () => {
  isSubmitting.value = true

  const updateUserInput: UpdateUserInput = {
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
      name: company.value.trim(),
      catchPhrase: phrase.value.trim(),
      bs: bs.value.trim()
    }
  }

  try {
    const result = await updateUser(props.id, updateUserInput)
    const { code: _code, data: data, message: _message, success } = result

    if (success !== true) {
      toast.add({
        title: 'Error!',
        description: 'Unable to update resource.',
        color: 'error',
        icon: 'i-lucide-triangle-alert',
        duration: 5000
        // class: ``
      })
      return
    }

    ///////////////////////////////////////////////////////////////////////////
    //
    // At this point we either want to refresh the current page,
    // or manually refire handleGetUser(). What is the typical pattern?
    // router.push({ path: '/users', query: { t: Date.now() } })
    //
    // In something like TanStack Start, we have router.invalidate().
    // However, here we really only have two options:
    //
    //   1. If updateUser() returns the new user, then update local state with that.
    //   2. Manually refire handleGetUser().
    //
    // The third option of window.location.reload() is VERY BAD, and not really
    // an option at all. That said, there's a real (non-sledgehammer) way to
    // force a remount that's actually documented as the idiomatic pattern for
    // this exact situation — keying <RouterView> in App.vue:
    //
    //   <RouterView v-slot="{ Component }">
    //     <component :is="Component" :key="`${appState.routerKey}`" />
    //   </RouterView>
    //
    // Then we could reload this page merely by injecting appState here and calling: appState.routerKey++
    // However, none of this is necessary because updateUser() does actually return the updated user.
    //
    ///////////////////////////////////////////////////////////////////////////

    if (data && typeof data === 'object') {
      user.value = data
    }

    toast.add({
      title: 'Success!',
      description: 'The user was updated successfully!',
      color: 'success',
      icon: 'i-lucide-circle-check',
      duration: 5000
      // class: ``
    })
  } catch (_err) {
    toast.add({
      title: 'Error!',
      description: 'Unable to update resource.',
      color: 'error',
      icon: 'i-lucide-triangle-alert',
      duration: 5000
      // class: ``
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
      duration: 5000
      // class: ``
    })
    return
  }

  handleUpdateUser()
}

/* ======================
     Lifecycle Hooks
====================== */

onMounted(async () => {
  await handleGetUser()
  console.log('user:', user.value)
})
</script>

<!-- ======================================================================

======================================================================= -->
<!--# Here we probably don't want to show the form until 
we've succesfully fetch the user and populated the form fields. -->

<template>
  <form
    class="bg-card mx-auto max-w-150 space-y-6 rounded-lg border p-6 shadow"
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
      <Input
        :invalid="isInvalid({ touched: fullName.touched, error: fullName.error })"
        :aria-invalid="!!fullName.error"
        :aria-describedby="fullName.error ? fieldId('fullName-error') : undefined"
        autocomplete="name"
        required
        :id="fieldId('fullName')"
        placeholder="Full Name..."
        type="text"
        @blur="
          (e: Event) => {
            // const target = e.target as HTMLInputElement
            fullName.touched = true
            validateFullName(/* target.value */)
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            fullName.value = target.value // This is immediate!

            if (fullName.touched) {
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
        :value="fullName.value"
      />
      <p v-if="fullName.error" :id="fieldId('fullName-error')" :class="errorClasses">
        {{ fullName.error }}
      </p>
    </div>

    <!-- ====================
              Email
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('email')"
        >Email<sup aria-hidden="true" class="text-error">*</sup></label
      >
      <Input
        :invalid="isInvalid({ touched: email.touched, error: email.error })"
        :aria-invalid="!!email.error"
        :aria-describedby="email.error ? fieldId('email-error') : undefined"
        autocomplete="email"
        required
        :id="fieldId('email')"
        placeholder="name@example.com"
        type="email"
        @blur="
          (e: Event) => {
            // const target = e.target as HTMLInputElement
            email.touched = true
            validateEmail(/* target.value */)
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            email.value = target.value

            if (email.touched) {
              validateEmail(/* target.value */)
            }
          }
        "
        :value="email.value"
      />
      <p v-if="email.error" :id="fieldId('email-error')" :class="errorClasses">{{ email.error }}</p>
    </div>

    <!-- ====================
            User Name
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('userName')"
        >User Name<sup aria-hidden="true" class="text-error">*</sup></label
      >
      <Input
        :invalid="isInvalid({ touched: userName.touched, error: userName.error })"
        :aria-invalid="!!userName.error"
        :aria-describedby="userName.error ? fieldId('userName-error') : undefined"
        autocomplete="username"
        required
        :id="fieldId('userName')"
        placeholder="User Name..."
        type="text"
        @blur="
          (e: Event) => {
            // const target = e.target as HTMLInputElement
            userName.touched = true
            validateUserName(/* target.value*/)
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            userName.value = target.value

            if (userName.touched) {
              validateUserName(/* target.value */)
            }
          }
        "
        :value="userName.value"
      />

      <p v-if="userName.error" :id="fieldId('userName-error')" :class="errorClasses">
        {{ userName.error }}
      </p>
    </div>

    <!-- ====================
              Phone
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('phone')"
        >Phone<sup aria-hidden="true" class="text-error">*</sup></label
      >
      <Input
        :invalid="isInvalid({ touched: phone.touched, error: phone.error })"
        :aria-invalid="!!phone.error"
        :aria-describedby="phone.error ? fieldId('phone-error') : undefined"
        autocomplete="tel"
        required
        :id="fieldId('phone')"
        placeholder="(555) 123-4567"
        type="tel"
        @blur="
          (e: Event) => {
            // const target = e.target as HTMLInputElement
            phone.touched = true
            validatePhone(/* target.value */)
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            phone.value = target.value

            if (phone.touched) {
              validatePhone(/* target.value */)
            }
          }
        "
        :value="phone.value"
      />

      <p v-if="phone.error" :id="fieldId('phone-error')" :class="errorClasses">{{ phone.error }}</p>
    </div>

    <!-- ====================
            website
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('website')"
        >Website<sup aria-hidden="true" class="text-error">*</sup></label
      >
      <Input
        :invalid="isInvalid({ touched: website.touched, error: website.error })"
        :aria-invalid="!!website.error"
        :aria-describedby="website.error ? fieldId('website-error') : undefined"
        autocomplete="url"
        required
        :id="fieldId('website')"
        placeholder="google.com"
        type="url"
        @blur="
          (e: Event) => {
            // const target = e.target as HTMLInputElement
            website.touched = true
            validateWebsite(/* target.value */)
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            website.value = target.value

            if (website.touched) {
              validateWebsite(/* target.value */)
            }
          }
        "
        :value="website.value"
      />

      <p v-if="website.error" :id="fieldId('website-error')" :class="errorClasses">
        {{ website.error }}
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

      <Input
        :invalid="isInvalid({ touched: street.touched, error: street.error })"
        :aria-invalid="!!street.error"
        :aria-describedby="street.error ? fieldId('street-error') : undefined"
        autocomplete="street-address"
        required
        :id="fieldId('street')"
        placeholder="123 Main St"
        type="text"
        @blur="
          (e: Event) => {
            street.touched = true
            validateStreet()
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            street.value = target.value

            if (street.touched) {
              validateStreet()
            }
          }
        "
        :value="street.value"
      />

      <p v-if="street.error" :id="fieldId('street-error')" :class="errorClasses">
        {{ street.error }}
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

      <Input
        :invalid="isInvalid({ touched: city.touched, error: city.error })"
        :aria-invalid="!!city.error"
        :aria-describedby="city.error ? fieldId('city-error') : undefined"
        autocomplete="address-level2"
        required
        :id="fieldId('city')"
        placeholder="e.g., Metropolis"
        type="text"
        @blur="
          (e: Event) => {
            city.touched = true
            validateCity()
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            city.value = target.value

            if (city.touched) {
              validateCity()
            }
          }
        "
        :value="city.value"
      />

      <p v-if="city.error" :id="fieldId('city-error')" :class="errorClasses">
        {{ city.error }}
      </p>
    </div>

    <!-- ====================
            Company
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('company')">
        Company<sup aria-hidden="true" class="text-error">*</sup>
      </label>

      <Input
        :invalid="isInvalid({ touched: company.touched, error: company.error })"
        :aria-invalid="!!company.error"
        :aria-describedby="company.error ? fieldId('company-error') : undefined"
        autocomplete="organization"
        required
        :id="fieldId('company')"
        placeholder="ACME Inc."
        type="text"
        @blur="
          (e: Event) => {
            company.touched = true
            validateCompany()
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            company.value = target.value

            if (company.touched) {
              validateCompany()
            }
          }
        "
        :value="company.value"
      />

      <p v-if="company.error" :id="fieldId('company-error')" :class="errorClasses">
        {{ company.error }}
      </p>
    </div>

    <!-- ====================
          Catch Phrase
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('phrase')">
        Catch Phrase<sup aria-hidden="true" class="text-error">*</sup>
      </label>

      <Input
        :invalid="isInvalid({ touched: phrase.touched, error: phrase.error })"
        :aria-invalid="!!phrase.error"
        :aria-describedby="phrase.error ? fieldId('phrase-error') : undefined"
        autocomplete="off"
        required
        :id="fieldId('phrase')"
        placeholder="Innovate. Elevate. Dominate..."
        type="text"
        @blur="
          (e: Event) => {
            phrase.touched = true
            validatePhrase()
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            phrase.value = target.value

            if (phrase.touched) {
              validatePhrase()
            }
          }
        "
        :value="phrase.value"
      />

      <p v-if="phrase.error" :id="fieldId('phrase-error')" :class="errorClasses">
        {{ phrase.error }}
      </p>
    </div>

    <!-- ====================
              BS
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('bs')">
        Business Speak<sup aria-hidden="true" class="text-error">*</sup>
      </label>

      <Input
        :invalid="isInvalid({ touched: bs.touched, error: bs.error })"
        :aria-invalid="!!bs.error"
        :aria-describedby="bs.error ? fieldId('bs-error') : undefined"
        autocomplete="off"
        required
        :id="fieldId('bs')"
        placeholder="synergize scalable paradigms"
        type="text"
        @blur="
          (e: Event) => {
            bs.touched = true
            validateBS()
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            bs.value = target.value

            if (bs.touched) {
              validateBS()
            }
          }
        "
        :value="bs.value"
      />

      <p v-if="bs.error" :id="fieldId('bs-error')" :class="errorClasses">
        {{ bs.error }}
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
          isErrors
            ? 'bg-error pointer-events-none opacity-70'
            : 'bg-secondary-500 hover:bg-primary-500'
        "
        type="submit"
      >
        <span v-if="isSubmitting" class="flex items-center justify-center gap-2"
          ><LoaderCircle class="size-[1.25em] animate-spin" /> Updating User…</span
        >

        <span v-else-if="isErrors" class="flex items-center justify-center gap-2"
          ><TriangleAlert class="size-[1.25em]" /> Please fix the errors.</span
        >

        <span v-else class="flex items-center justify-center gap-2"
          ><Send class="size-[1.25em]" /> Update User</span
        >
      </button>

      <button
        :disabled="isSubmitting"
        class="bg-secondary-500 hover:bg-warning-500 flex min-w-25 items-center justify-center gap-1 rounded px-2 py-1 text-sm font-semibold text-white select-none"
        type="button"
        @click="resetForm"
      >
        <RotateCcw class="size-[1.25em]" />
        Reset
      </button>
    </div>
  </form>
</template>
