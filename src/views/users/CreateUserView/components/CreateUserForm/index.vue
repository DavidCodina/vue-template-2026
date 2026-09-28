<script setup lang="ts">
/* ======================
        Imports
====================== */

import { computed, reactive, ref, useId } from 'vue'
import { useRouter } from 'vue-router'
import { TriangleAlert, LoaderCircle, RotateCcw, Send } from '@lucide/vue'
import { z } from 'zod'

import { formatZodErrors } from '@/utils/zod'
import { createUser } from '../../../api/createUser'
import Input from '@/components/Input.vue'
import type { CreateUserInput } from '../../../types'

/* ======================
      Zod Schema
====================== */

const getStringSchema = (input?: { requiredMesssage?: string; trimMessage?: string }) => {
  const StringSchema = z
    .string()
    .min(1, { message: input?.requiredMesssage ?? 'Required' })

    .refine((val) => val === val.trim(), {
      message: input?.trimMessage ?? 'No leading or trailing spaces'
    })
  return StringSchema
}

const FormSchema = z.object({
  fullName: getStringSchema({
    requiredMesssage: 'Full name required',
    trimMessage: 'Full name should have no leading or trailing spaces'
  }),
  email: z.email(),
  userName: getStringSchema({
    requiredMesssage: 'User name required',
    trimMessage: 'User name should have no leading or trailing spaces'
  }),
  phone: getStringSchema({
    requiredMesssage: 'Phone required',
    trimMessage: 'Phone should have no leading or trailing spaces'
  }),
  website: getStringSchema({
    requiredMesssage: 'Website required',
    trimMessage: 'Website should have no leading or trailing spaces'
  }),
  street: getStringSchema({
    requiredMesssage: 'Street required',
    trimMessage: 'Street should have no leading or trailing spaces'
  }),
  city: getStringSchema({
    requiredMesssage: 'City required',
    trimMessage: 'City should have no leading or trailing spaces'
  }),
  company: getStringSchema({
    requiredMesssage: 'Company required',
    trimMessage: 'Company should have no leading or trailing spaces'
  }),
  phrase: getStringSchema({
    requiredMesssage: 'Catch phrase required',
    trimMessage: 'Catch phrase sshould have no leading or trailing spaces'
  }),
  bs: getStringSchema({
    requiredMesssage: 'Business speak required',
    trimMessage: 'Business speak should have no leading or trailing spaces'
  })
})

type ZodData = z.infer<typeof FormSchema>
type FormErrors = Partial<Record<keyof ZodData, string>>

/* ======================
      Composables
====================== */

const uid = useId()
const router = useRouter()
const toast = useToast()

/* ======================
      ref / reactive
====================== */

// Originally, I had each error as part of the field's reactive object.
// However, with Zod it's easier for errors to be its own reactive object.
const errors = reactive<FormErrors>({})

const fullName = reactive<{ value: string; touched: boolean }>({
  value: '',
  touched: false
})

const email = reactive<{ value: string; touched: boolean }>({
  value: '',
  touched: false
})

const userName = reactive<{ value: string; touched: boolean }>({
  value: '',
  touched: false
})

const phone = reactive<{ value: string; touched: boolean }>({
  value: '',
  touched: false
})

const website = reactive<{ value: string; touched: boolean }>({
  value: '',
  touched: false
})

const street = reactive<{ value: string; touched: boolean }>({
  value: '',
  touched: false
})

const city = reactive<{ value: string; touched: boolean }>({
  value: '',
  touched: false
})

const company = reactive<{ value: string; touched: boolean }>({
  value: '',
  touched: false
})

const phrase = reactive<{ value: string; touched: boolean }>({
  value: '',
  touched: false
})

// i.e., "business speak:
const bs = reactive<{ value: string; touched: boolean }>({
  value: '',
  touched: false
})

// Note: currently all the inputs are still editable during submission.
// You may want to change this, but I don't think it's necessary.
const isSubmitting = ref(false)

/* ======================
      Variables
====================== */

const labelClass = 'text-secondary mb-1 block text-sm font-semibold cursor-pointer select-none'

const errorClasses = 'mt-1 text-sm text-error'

const fields = [fullName, email, userName, phone, website, street, city, company, phrase, bs]

/* ======================
        Computed
====================== */

const isErrors = computed(() => Object.values(errors).some((value) => !!value))

/* ======================
  Methods / Functions
====================== */

const fieldId = (name: string) => `${uid}-${name}` // e.g., id="v6-email"

/* =================== */

function clearErrors() {
  Object.keys(errors).forEach((key) => delete errors[key as keyof typeof errors])
}

/* =================== */

const isInvalid = ({ touched, error }: { touched: boolean; error: string | undefined }) => {
  if (touched && !error) return false
  if (touched && error) return true
  return undefined
}

/* =================== */

const validateFullName = () => {
  const validationResult = FormSchema.shape.fullName.safeParse(fullName.value)

  if (validationResult.success === false) {
    const error = validationResult.error.issues[0]?.message
    if (typeof error === 'string') {
      errors.fullName = error
      return
    }
  }
  errors.fullName = ''
}

/* =================== */

const validateEmail = () => {
  const validationResult = FormSchema.shape.email.safeParse(email.value)

  if (validationResult.success === false) {
    const error = validationResult.error.issues[0]?.message
    if (typeof error === 'string') {
      errors.email = error
      return
    }
  }
  errors.email = ''
}

/* =================== */

const validateUserName = () => {
  const validationResult = FormSchema.shape.userName.safeParse(userName.value)

  if (validationResult.success === false) {
    const error = validationResult.error.issues[0]?.message
    if (typeof error === 'string') {
      errors.userName = error
      return
    }
  }
  errors.userName = ''
}

/* =================== */

const validatePhone = () => {
  const validationResult = FormSchema.shape.phone.safeParse(phone.value)

  if (validationResult.success === false) {
    const error = validationResult.error.issues[0]?.message
    if (typeof error === 'string') {
      errors.phone = error
      return
    }
  }
  errors.phone = ''
}

/* =================== */

const validateWebsite = () => {
  const validationResult = FormSchema.shape.website.safeParse(website.value)

  if (validationResult.success === false) {
    const error = validationResult.error.issues[0]?.message
    if (typeof error === 'string') {
      errors.website = error
      return
    }
  }
  errors.website = ''
}

/* =================== */

const validateStreet = () => {
  const validationResult = FormSchema.shape.street.safeParse(street.value)

  if (validationResult.success === false) {
    const error = validationResult.error.issues[0]?.message
    if (typeof error === 'string') {
      errors.street = error
      return
    }
  }
  errors.street = ''
}

/* =================== */

const validateCity = () => {
  const validationResult = FormSchema.shape.city.safeParse(city.value)

  if (validationResult.success === false) {
    const error = validationResult.error.issues[0]?.message
    if (typeof error === 'string') {
      errors.city = error
      return
    }
  }
  errors.city = ''
}

/* =================== */

const validateCompany = () => {
  const validationResult = FormSchema.shape.company.safeParse(company.value)

  if (validationResult.success === false) {
    const error = validationResult.error.issues[0]?.message
    if (typeof error === 'string') {
      errors.company = error
      return
    }
  }
  errors.company = ''
}

/* =================== */

const validatePhrase = () => {
  const validationResult = FormSchema.shape.phrase.safeParse(phrase.value)

  if (validationResult.success === false) {
    const error = validationResult.error.issues[0]?.message
    if (typeof error === 'string') {
      errors.phrase = error
      return
    }
  }
  errors.phrase = ''
}

/* =================== */

const validateBS = () => {
  const validationResult = FormSchema.shape.bs.safeParse(bs.value)

  if (validationResult.success === false) {
    const error = validationResult.error.issues[0]?.message
    if (typeof error === 'string') {
      errors.bs = error
      return
    }
  }
  errors.bs = ''
}

/* =================== */

const resetForm = () => {
  clearErrors()
  fields.forEach((field) => {
    field.value = ''
    field.touched = false
  })
}

/* =================== */

const handleCreateUser = async (zodData: ZodData) => {
  isSubmitting.value = true

  const createUserInput: CreateUserInput = {
    name: zodData.fullName,
    email: zodData.email,
    username: zodData.userName,
    phone: zodData.phone,
    website: zodData.website,
    address: {
      street: zodData.street,
      city: zodData.city
    },
    company: {
      name: zodData.company,
      catchPhrase: zodData.phrase,
      bs: zodData.bs
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

  fields.forEach((field) => (field.touched = true))

  // Validation...
  const {
    data: zodData,
    error: zodError,
    success: zodSuccess
  } = FormSchema.safeParse({
    fullName: fullName.value,
    email: email.value,
    userName: userName.value,
    phone: phone.value,
    website: website.value,
    street: street.value,
    city: city.value,
    company: company.value,
    phrase: phrase.value,
    bs: bs.value
  })

  if (!zodSuccess) {
    const formattedZodErrors = formatZodErrors(zodError)

    Object.entries(formattedZodErrors).forEach(([key, value]) => {
      errors[key as keyof FormErrors] = value
    })

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

  handleCreateUser(zodData)
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <form
    class="bg-card mx-auto max-w-150 space-y-6 rounded-lg border p-6 shadow"
    @submit.prevent="handleSubmit"
    novalidate
  >
    <!-- ====================
            Full Name
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('fullName')"
        >Full name<sup aria-hidden="true" class="text-error">*</sup></label
      >
      <Input
        :invalid="isInvalid({ touched: fullName.touched, error: errors.fullName })"
        :aria-invalid="!!errors.fullName"
        :aria-describedby="errors.fullName ? fieldId('fullName-error') : undefined"
        autocomplete="name"
        required
        :id="fieldId('fullName')"
        placeholder="Full Name..."
        type="text"
        @blur="
          (e: Event) => {
            fullName.touched = true
            validateFullName()
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            fullName.value = target.value

            if (fullName.touched) {
              validateFullName()
            }
          }
        "
        :value="fullName.value"
      />
      <p v-if="errors.fullName" :id="fieldId('fullName-error')" :class="errorClasses">
        {{ errors.fullName }}
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
        :invalid="isInvalid({ touched: email.touched, error: errors.email })"
        :aria-invalid="!!errors.email"
        :aria-describedby="errors.email ? fieldId('email-error') : undefined"
        autocomplete="email"
        required
        :id="fieldId('email')"
        placeholder="name@example.com"
        type="email"
        @blur="
          (e: Event) => {
            email.touched = true
            validateEmail()
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            email.value = target.value

            if (email.touched) {
              validateEmail()
            }
          }
        "
        :value="email.value"
      />
      <p v-if="errors.email" :id="fieldId('email-error')" :class="errorClasses">
        {{ errors.email }}
      </p>
    </div>

    <!-- ====================
            User Name
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('userName')"
        >User Name<sup aria-hidden="true" class="text-error">*</sup></label
      >
      <Input
        :invalid="isInvalid({ touched: userName.touched, error: errors.userName })"
        :aria-invalid="!!errors.userName"
        :aria-describedby="errors.userName ? fieldId('userName-error') : undefined"
        autocomplete="username"
        required
        :id="fieldId('userName')"
        placeholder="User Name..."
        type="text"
        @blur="
          (e: Event) => {
            userName.touched = true
            validateUserName()
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            userName.value = target.value

            if (userName.touched) {
              validateUserName()
            }
          }
        "
        :value="userName.value"
      />

      <p v-if="errors.userName" :id="fieldId('userName-error')" :class="errorClasses">
        {{ errors.userName }}
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
        :invalid="isInvalid({ touched: phone.touched, error: errors.phone })"
        :aria-invalid="!!errors.phone"
        :aria-describedby="errors.phone ? fieldId('phone-error') : undefined"
        autocomplete="tel"
        required
        :id="fieldId('phone')"
        placeholder="(555) 123-4567"
        type="tel"
        @blur="
          (e: Event) => {
            phone.touched = true
            validatePhone()
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            phone.value = target.value

            if (phone.touched) {
              validatePhone()
            }
          }
        "
        :value="phone.value"
      />

      <p v-if="errors.phone" :id="fieldId('phone-error')" :class="errorClasses">
        {{ errors.phone }}
      </p>
    </div>

    <!-- ====================
            website
    ====================== -->

    <div>
      <label :class="labelClass" :for="fieldId('website')"
        >Website<sup aria-hidden="true" class="text-error">*</sup></label
      >
      <Input
        :invalid="isInvalid({ touched: website.touched, error: errors.website })"
        :aria-invalid="!!errors.website"
        :aria-describedby="errors.website ? fieldId('website-error') : undefined"
        autocomplete="url"
        required
        :id="fieldId('website')"
        placeholder="google.com"
        type="url"
        @blur="
          (e: Event) => {
            website.touched = true
            validateWebsite()
          }
        "
        @input="
          (e: Event) => {
            const target = e.target as HTMLInputElement
            website.value = target.value

            if (website.touched) {
              validateWebsite()
            }
          }
        "
        :value="website.value"
      />

      <p v-if="errors.website" :id="fieldId('website-error')" :class="errorClasses">
        {{ errors.website }}
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
        :invalid="isInvalid({ touched: street.touched, error: errors.street })"
        :aria-invalid="!!errors.street"
        :aria-describedby="errors.street ? fieldId('street-error') : undefined"
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

      <p v-if="errors.street" :id="fieldId('street-error')" :class="errorClasses">
        {{ errors.street }}
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
        :invalid="isInvalid({ touched: city.touched, error: errors.city })"
        :aria-invalid="!!errors.city"
        :aria-describedby="errors.city ? fieldId('city-error') : undefined"
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

      <p v-if="errors.city" :id="fieldId('city-error')" :class="errorClasses">
        {{ errors.city }}
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
        :invalid="isInvalid({ touched: company.touched, error: errors.company })"
        :aria-invalid="!!errors.company"
        :aria-describedby="errors.company ? fieldId('company-error') : undefined"
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

      <p v-if="errors.company" :id="fieldId('company-error')" :class="errorClasses">
        {{ errors.company }}
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
        :invalid="isInvalid({ touched: phrase.touched, error: errors.phrase })"
        :aria-invalid="!!errors.phrase"
        :aria-describedby="errors.phrase ? fieldId('phrase-error') : undefined"
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

      <p v-if="errors.phrase" :id="fieldId('phrase-error')" :class="errorClasses">
        {{ errors.phrase }}
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
        :invalid="isInvalid({ touched: bs.touched, error: errors.bs })"
        :aria-invalid="!!errors.bs"
        :aria-describedby="errors.bs ? fieldId('bs-error') : undefined"
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

      <p v-if="errors.bs" :id="fieldId('bs-error')" :class="errorClasses">
        {{ errors.bs }}
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
