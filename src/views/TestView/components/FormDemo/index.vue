<script setup lang="ts">
/* ========================================================================
                              Imports
======================================================================== */

import { ref, computed, useId, useTemplateRef } from 'vue'

// https://lucide.dev/guide/vue/getting-started
import { Eye, EyeOff, RotateCcw, Send } from '@lucide/vue'

const toast = useToast()

/* ========================================================================
                              Composables 
======================================================================== */

// useId() (Vue 3.5+) generates a unique, SSR-safe ID. We use it as a prefix so
// every <label for="..."> is guaranteed to match its input, even if this
// component is rendered multiple times on the same page.
const uid = useId()
const fieldId = (name: string) => `${uid}-${name}` // e.g., id="v6-email"

/* ========================================================================
                             Types
======================================================================== */

type ContactMethod = 'email' | 'phone' | 'text'

/* ========================================================================
                               Refs
======================================================================== */

const fullName = ref<string>('')
const fullNameError = ref<string>('')

const email = ref<string>('')
const emailError = ref<string>('')

const password = ref<string>('')
const phone = ref<string>('')
const website = ref<string>('')

// A number input is an empty string until the user types something.
// As noted in the age <input type="number"/>, Vue automatically will
// treat the value as a number even without the .number modifier.
const age = ref<number | ''>('')
const experience = ref<number>(3) // range slider

// File input (can't use v-model, so we store the File ourselves)
const avatar = ref<File | null>(null)

// Date / time inputs (all of these hold strings)
const birthday = ref<string>('') // "YYYY-MM-DD"
const birthMonth = ref<string>('') // "YYYY-MM"
const preferredTime = ref<string>('09:00') // "HH:MM"
const appointment = ref<string>('') // "YYYY-MM-DDTHH:MM"

// Color input
const favoriteColor = ref<string>('#42b883')

// Choice inputs
const country = ref<string>('') // <input list> + <datalist>
const timezone = ref<string>('') // <select>
const languages = ref<string[]>([]) // <select multiple>
const contactMethod = ref<ContactMethod>('email') // radio group
const interests = ref<string[]>([]) // checkbox group

// Long text
const bio = ref<string>('') // <textarea>
const terms = ref<boolean>(false) // single checkbox
const termsError = ref<string>('')

// UI state
const showPassword = ref<boolean>(false)
const submitted = ref<boolean>(false)

/* ========================================================================
                            Template Refs
======================================================================== */

// useTemplateRef() (Vue 3.5+) — the string must match the `ref="..."`
// attribute in the template. We need it to clear the file input on reset.
const fileInput = useTemplateRef<HTMLInputElement>('fileInput')

const ageInput = useTemplateRef<HTMLInputElement>('ageInput')

/* ========================================================================
                              Computed
======================================================================== */

const experienceLabel = computed<string>(() => {
  return experience.value === 1 ? '1 year' : `${experience.value} years`
})

/* ========================================================================
                            Variables
======================================================================== */

// Tailwind only detects complete class strings, so these are fine to keep in
// the script and reuse in the template with :class="...".
const labelClass = 'text-secondary mb-1 block text-sm font-semibold cursor-pointer select-none'

const inputClass =
  'block w-full rounded border px-2 py-1 text-sm placeholder:italic focus-visible:outline-2 focus-visible:outline-secondary'
const errorClass = 'mt-1 text-xs text-red-600'

const sectionClass = 'mb-6 space-y-4'

const legendClass = 'mb-2 w-full text-primary text-lg font-bold'

const timezones = [
  { group: 'North America', options: ['Eastern', 'Central', 'Mountain', 'Pacific'] },
  { group: 'Europe', options: ['London', 'Paris', 'Berlin'] },
  { group: 'Asia / Pacific', options: ['Tokyo', 'Sydney', 'Mumbai'] }
]

const languageOptions = ['English', 'Spanish', 'French', 'German', 'Japanese']

const countries = [
  'Canada',
  'France',
  'Germany',
  'Japan',
  'Mexico',
  'United Kingdom',
  'United States'
]

const contactMethods: { value: ContactMethod; label: string }[] = [
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone call' },
  { value: 'text', label: 'Text message' }
]

const interestOptions = ['Design', 'Development', 'Marketing', 'Data', 'Writing']

/* ========================================================================
                          Event Handlers / Functions
======================================================================== */

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  avatar.value = input.files?.[0] ?? null
}

/* ======================
      validate()
====================== */
// Returns true when the form is valid

const validate = (): boolean => {
  fullNameError.value = fullName.value ? '' : 'Enter your full name.'

  if (!email.value) {
    emailError.value = 'Enter your email address.'
  } else if (!/^\S+@\S+\.\S+$/.test(email.value)) {
    emailError.value = 'Enter a valid email address, like name@example.com.'
  } else {
    emailError.value = ''
  }

  termsError.value = terms.value ? '' : 'Accept the terms to continue.'

  return !fullNameError.value && !emailError.value && !termsError.value
}

/* ======================
      resetForm()
====================== */

const resetForm = () => {
  fullName.value = ''
  email.value = ''
  password.value = ''
  phone.value = ''
  website.value = ''
  age.value = ''
  experience.value = 3
  avatar.value = null
  birthday.value = ''
  birthMonth.value = ''
  preferredTime.value = '09:00'
  appointment.value = ''
  favoriteColor.value = '#42b883'
  country.value = ''
  timezone.value = ''
  languages.value = []
  contactMethod.value = 'email'
  interests.value = []
  bio.value = ''
  terms.value = false

  showPassword.value = false
  fullNameError.value = ''
  emailError.value = ''
  termsError.value = ''

  // Clear the native file input, which Vue doesn't control
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

/* ======================
        onSubmit()
====================== */

const onSubmit = () => {
  submitted.value = false

  console.log({
    age: age.value, // 48
    ageType: typeof age.value, // 'number'
    ageFromRef: ageInput.value?.value, // '48'
    ageFromRefType: typeof ageInput.value?.value // 'string'
  })

  if (!validate()) {
    toast.add({
      title: 'Error!',
      description: 'The form has errors. Please fix them and try again.',
      color: 'error',
      icon: 'i-lucide-triangle-alert',
      duration: 3000,
      class: '[&_[data-slot=title]]:text-red-500'
    })
    return
  }

  // Gather the refs into one object only at the moment we need to send them.
  // File objects don't serialize to JSON, so we send the file's name instead.
  console.log({
    fullName: fullName.value,
    email: email.value,
    password: password.value,
    phone: phone.value,
    website: website.value,
    age: age.value,
    experience: experience.value,
    avatar: avatar.value?.name ?? null,
    birthday: birthday.value,
    birthMonth: birthMonth.value,
    preferredTime: preferredTime.value,
    appointment: appointment.value,
    favoriteColor: favoriteColor.value,
    country: country.value,
    timezone: timezone.value,
    languages: languages.value,
    contactMethod: contactMethod.value,
    interests: interests.value,
    bio: bio.value,
    terms: terms.value
  })

  resetForm()
  submitted.value = true
}
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <div>
    <form
      class="bg-card mx-auto max-w-150 rounded-lg border p-4 shadow"
      @submit.prevent="onSubmit"
      novalidate
    >
      <p
        v-if="submitted"
        class="mb-4 rounded border border-green-600 bg-green-50 px-2 py-1 text-sm text-green-800"
        role="status"
      >
        Profile saved. Check the console for the submitted values.
      </p>

      <!-- =============================================
                          About You
      ============================================== -->

      <fieldset :class="sectionClass">
        <legend :class="legendClass">About You</legend>

        <!-- ====================
                Full Name
         ====================== -->
        <!-- type="text" + .trim modifier strips leading/trailing spaces -->

        <div>
          <label :class="labelClass" :for="fieldId('name')">Full name</label>
          <input
            :id="fieldId('name')"
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
        <!-- type="email" gives mobile users an email keyboard -->

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
                Password
         ====================== -->
        <!-- type toggles between "password" and "text" with a bound attribute -->

        <div>
          <label :class="labelClass" :for="fieldId('password')">Password</label>
          <div class="relative">
            <input
              :id="fieldId('password')"
              :class="inputClass"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              class="pr-8"
              placeholder="Choose a password..."
              v-model="password"
            />
            <button
              class="absolute inset-y-0 right-0 flex items-center px-2"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              type="button"
              @click="showPassword = !showPassword"
            >
              <EyeOff v-if="showPassword" :size="16" />
              <Eye v-else :size="16" />
            </button>
          </div>
        </div>

        <!-- ====================
                  Phone
        ====================== -->

        <div class="grid gap-4 sm:grid-cols-2">
          <!-- type="tel" -->
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
          </div>

          <!-- ====================
                  Website 
         ====================== -->
          <!-- type="url" -->

          <div>
            <label :class="labelClass" :for="fieldId('website')">Website</label>
            <input
              :id="fieldId('website')"
              :class="inputClass"
              autocomplete="url"
              placeholder="https://example.com"
              type="url"
              v-model.trim="website"
            />
          </div>
        </div>

        <!-- ====================
                  Age
         ====================== -->
        <!-- 
        type="number" + v-model.number="age" modifier gives you a real number, not a string.
        That said, it seems that it's actually STILL a number even without the .number modifier.
        This feature results specifically from the use of v-model. On the other hand, if one accesses
        the value more directly via a template ref, then the value will NOT be coerced to a number, 
        and will still be a string.

          console.log({
            age: age.value,                              // 48
            ageType: typeof age.value,                   // 'number'
            ageFromRef: ageInput.value?.value,           // '48'
            ageFromRefType: typeof ageInput.value?.value // 'string'
          })

        This is something to be aware of with Vue because in normal Javascript, <input type="number">
        will store the value as a string.
        -->

        <div>
          <label :class="labelClass" :for="fieldId('age')">Age</label>
          <input
            ref="ageInput"
            :id="fieldId('age')"
            :class="inputClass"
            max="120"
            min="0"
            placeholder="Age..."
            step="1"
            type="number"
            v-model="age"
          />
        </div>

        <!-- ====================
                Avatar
        ====================== -->
        <!-- type="file" can't use v-model, so we listen for the change event -->

        <div>
          <label :class="labelClass" :for="fieldId('avatar')">Profile photo</label>
          <input
            :id="fieldId('avatar')"
            ref="fileInput"
            :class="inputClass"
            accept="image/*"
            type="file"
            @change="onFileChange"
          />
          <p v-if="avatar" class="mt-1 text-xs">
            Selected: {{ avatar.name }} ({{ (avatar.size / 1024).toFixed(1) }} KB)
          </p>
        </div>
      </fieldset>

      <!-- =============================================
                      Dates and Times
      ============================================== -->

      <fieldset :class="sectionClass">
        <legend :class="legendClass">Dates And Times</legend>

        <div class="grid gap-4 sm:grid-cols-2">
          <!-- ====================
                  Birthday
          ====================== -->
          <!-- type="date" -->

          <div>
            <label :class="labelClass" :for="fieldId('birthday')">Birthday</label>
            <input :id="fieldId('birthday')" :class="inputClass" type="date" v-model="birthday" />
          </div>

          <!-- ====================
                Birth Month
          ====================== -->
          <!-- type="month" -->

          <div>
            <label :class="labelClass" :for="fieldId('month')">Birth month</label>
            <input :id="fieldId('month')" :class="inputClass" type="month" v-model="birthMonth" />
          </div>

          <!-- ====================
                Preferred Time
          ====================== -->
          <!-- type="time" -->

          <div>
            <label :class="labelClass" :for="fieldId('time')">Best time to reach you</label>
            <input :id="fieldId('time')" :class="inputClass" type="time" v-model="preferredTime" />
          </div>

          <!-- ====================
                  Appointment
          ====================== -->
          <!-- type="datetime-local" -->

          <div>
            <label :class="labelClass" :for="fieldId('appointment')">Appointment</label>
            <input
              :id="fieldId('appointment')"
              :class="inputClass"
              type="datetime-local"
              v-model="appointment"
            />
          </div>
        </div>
      </fieldset>

      <!-- =============================================
                          Preferences
      ============================================== -->

      <fieldset :class="sectionClass">
        <legend :class="legendClass">Preferences</legend>

        <!-- ====================
                Country
        ====================== -->
        <!-- <input list> + <datalist>: type freely OR pick a suggestion -->

        <div>
          <label :class="labelClass" :for="fieldId('country')">Country</label>
          <input
            :id="fieldId('country')"
            :class="inputClass"
            :list="fieldId('countries')"
            autocomplete="country-name"
            placeholder="Start typing..."
            type="text"
            v-model="country"
          />
          <datalist :id="fieldId('countries')">
            <option v-for="name in countries" :key="name" :value="name" />
          </datalist>
        </div>

        <!-- ====================
                Time Zone
        ====================== -->
        <!-- <select> with <optgroup>; the disabled empty option acts as a placeholder -->

        <div>
          <label :class="labelClass" :for="fieldId('timezone')">Time Zone</label>

          <select :id="fieldId('timezone')" :class="inputClass" v-model="timezone">
            <option disabled value="">Select A Time Zone...</option>

            <optgroup v-for="zone in timezones" :key="zone.group" :label="zone.group">
              <option v-for="option in zone.options" :key="option" :value="option">
                {{ option }}
              </option>
            </optgroup>
          </select>
        </div>

        <!-- ====================
                Languages
        ====================== -->
        <!-- <select multiple> binds to an array. Hold Ctrl/Cmd to pick several. -->

        <div>
          <label :class="labelClass" :for="fieldId('languages')">Languages You Speak</label>
          <select
            :id="fieldId('languages')"
            :class="inputClass"
            multiple
            size="5"
            v-model="languages"
          >
            <option v-for="language in languageOptions" :key="language" :value="language">
              {{ language }}
            </option>
          </select>
          <p class="mt-1 text-xs">Hold Ctrl (Windows) or Cmd (Mac) to select more than one.</p>
        </div>

        <!-- ====================
              Contact Method
        ====================== -->
        <!-- Radio group: every radio shares the same v-model, so only one can win -->

        <div role="radiogroup" aria-labelledby="contact-legend">
          <p id="contact-legend" class="text-secondary mb-1 text-sm font-semibold">
            Preferred Contact Method
          </p>
          <div class="flex flex-wrap gap-x-4 gap-y-1">
            <label
              v-for="method in contactMethods"
              :key="method.value"
              class="flex items-center gap-1 text-sm"
            >
              <!-- ⚠️ Gotcha: Primary is #42b883: class="accent-primary"
               
              When Chrome sees this color, pick the 
              colors for the inner parts of the control based on how light or dark your accent is. 
              The #42b883 is light enough that the browser chooses black instead of white for the ring and dot.
              The solution is to set appearance-none and create a custom radio.

              This is going to be the same issue with the checkboxes, but right now I'm not going to go through
              the trouble of creating a custom checkbox. Similar issues arise with the text="range" slider trac.
              This is why it's always better to have custom field controls (e.g., Radix UI, Base UI, etc.)
              -->
              <input
                class="checked:border-primary checked:bg-primary size-4 appearance-none rounded-full border bg-clip-content p-0.5"
                name="contactMethod"
                type="radio"
                :value="method.value"
                v-model="contactMethod"
              />
              {{ method.label }}
            </label>
          </div>
        </div>

        <!-- ====================
              Interests
        ====================== -->
        <!-- Checkbox group: v-model on an array collects every checked value -->

        <div role="group" aria-labelledby="interests-legend">
          <p id="interests-legend" class="text-secondary mb-1 text-sm font-semibold">Interests</p>
          <div class="flex flex-wrap gap-x-4 gap-y-1">
            <label
              v-for="interest in interestOptions"
              :key="interest"
              class="flex items-center gap-1 text-sm"
            >
              <input
                class="accent-secondary"
                type="checkbox"
                :value="interest"
                v-model="interests"
              />
              {{ interest }}
            </label>
          </div>
        </div>

        <!-- ====================
              Experience
        ====================== -->
        <!-- type="range" — v-model.number keeps the value numeric -->

        <div>
          <label :class="labelClass" :for="fieldId('experience')">
            Years Of Experience:
            <span class="font-normal">{{ experienceLabel }}</span>
          </label>
          <input
            :id="fieldId('experience')"
            class="accent-primary w-full"
            max="20"
            min="0"
            step="1"
            type="range"
            v-model.number="experience"
          />
          <div class="flex justify-between text-xs">
            <span>0</span>
            <span>20</span>
          </div>
        </div>

        <!-- ====================
            Favorite Color
        ====================== -->
        <!-- type="color" -->

        <div>
          <label :class="labelClass" :for="fieldId('color')">Favorite Color</label>
          <div class="flex items-center gap-2">
            <input
              :id="fieldId('color')"
              class="h-8 w-12 cursor-pointer rounded border"
              type="color"
              v-model="favoriteColor"
            />
            <code class="text-sm">{{ favoriteColor }}</code>
          </div>
        </div>
      </fieldset>

      <!-- =============================================
                        More About You
      ============================================== -->

      <fieldset :class="sectionClass">
        <legend :class="legendClass">More About You</legend>

        <!-- ====================
                  Bio
        ====================== -->
        <!-- <textarea> uses v-model just like an input. Don't put {{ }} between the tags. -->

        <div>
          <label :class="labelClass" :for="fieldId('bio')">Bio</label>
          <textarea
            :id="fieldId('bio')"
            :class="inputClass"
            maxlength="280"
            placeholder="Tell us a bit about yourself..."
            rows="4"
            v-model="bio"
          ></textarea>
          <p class="mt-1 text-right text-xs">{{ bio.length }} / 280</p>
        </div>

        <!-- ====================
                Terms
        ====================== -->
        <!-- A single checkbox with a boolean v-model -->

        <div>
          <label class="flex items-center gap-2 text-sm">
            <input class="accent-secondary" type="checkbox" v-model="terms" />
            I agree to the terms and conditions
          </label>
          <p v-if="termsError" :class="errorClass">{{ termsError }}</p>
        </div>
      </fieldset>

      <!-- =============================================
                           Actions
      ============================================== -->

      <div class="flex gap-2">
        <button
          class="bg-secondary hover:bg-primary flex flex-1 items-center justify-center gap-1 rounded px-2 py-1 text-sm font-semibold text-white"
          type="submit"
        >
          <Send :size="14" />
          Save profile
        </button>

        <button
          class="bg-secondary flex min-w-25 items-center justify-center gap-1 rounded px-2 py-1 text-sm font-semibold text-white hover:bg-rose-500"
          type="button"
          @click="resetForm"
        >
          <RotateCcw :size="14" />
          Reset
        </button>
      </div>
    </form>
  </div>
</template>
