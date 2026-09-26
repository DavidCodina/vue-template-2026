<script setup lang="ts">
/* ======================
        Imports
====================== */

import { computed, ref, onMounted } from 'vue'
import type { Component } from 'vue'
import { useRouter } from 'vue-router'

import {
  Activity,
  Workflow,
  Building2,
  Globe2,
  LoaderCircle,
  Mail,
  MapPin,
  Phone,
  Trash,
  Pencil
} from '@lucide/vue'
import { getUser } from '../../../api/getUser'
import { deleteUser } from '../../../api/deleteUser'
import { sleep } from '@/utils'

import FakeProgressBar from '../FakeProgressBar.vue'

import type { User } from '../../../types'

/* ======================
       Types
====================== */

type Detail = {
  icon: Component
  label: string
  value: string
}

/* ======================
       Composables
====================== */

const router = useRouter()
const toast = useToast()

/* ======================
      Variables
====================== */

const backgroundImage =
  'bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[36px_36px]'

/* ======================
       Variables
====================== */

const sleepTime = 1000

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
const isDeleting = ref(false)

/* ======================
       Computed
====================== */

const details = computed<Detail[]>(() => {
  if (!user.value) return []

  return [
    { icon: Mail, label: 'Email', value: user.value.email },
    { icon: Phone, label: 'Phone', value: user.value.phone },
    { icon: Building2, label: 'Organization', value: user.value.company?.name },
    {
      icon: MapPin,
      label: 'Location',
      value: `${user.value.address?.street}, ${user.value.address?.city}`
    },
    { icon: Globe2, label: 'Web Presence', value: user.value?.website }
  ]
})

/* ======================
  Methods / Functions
====================== */

const handleGetUser = async () => {
  isLoading.value = true
  error.value = ''

  try {
    // Technically, getUser() always handles errors internally, but
    // having a try/catch on the consuming side is still a good practice.
    const result = await getUser(props.id)
    const { code: _code, data, message: _message, success } = result

    if (success !== true) {
      error.value = 'Unable to get resource'
      return
    }

    if (typeof data !== 'object') {
      error.value = 'Invalid response data.'
      return
    }

    user.value = data
  } catch (_err) {
    error.value = 'Unable to get resource'
  } finally {
    // Wait one second for the FakeProgresBar to finish
    await sleep(sleepTime + 200)
    isLoading.value = false
  }
}

const handleDeleteUser = async () => {
  if (isDeleting.value === true) return

  // In production have an actual confirmation dialog component.
  if (!confirm('Are you sure you want to delete this user?')) return

  isDeleting.value = true

  try {
    // Technically, deleteUser() always handles errors internally, but
    // having a try/catch on the consuming side is still a good practice.
    const result = await deleteUser(props.id)
    const { code: _code, data: _data, message: _message, success } = result

    if (success !== true) {
      toast.add({
        title: 'Error!',
        description: 'Unable to delete resource',
        color: 'error',
        ///////////////////////////////////////////////////////////////////////////
        //
        // Nuxt UI uses Iconify, which serves individual SVG icons, and it bundles the
        // Lucide collection by default: https://ui.nuxt.com/docs/getting-started/integrations/icons/nuxt
        //
        // The naming format is i-{collection}-{icon-name}:
        //
        //   - i-lucide-triangle-alert is the triangle-alert icon from the Lucide set
        //   - i-heroicons-bell would be the bell icon from Heroicons
        //   - i-simple-icons-github would be a brand icon from Simple Icons
        //
        // Nuxt UI ships with @iconify-json/lucide (and simple-icons) as dependencies, so Lucide
        // icons work out of the box and are resolved locally with no network request. You can use
        // them anywhere a component takes an icon prop (UButton, UAlert, toasts, etc.) or with the UIcon component directly:
        //
        //   <p>
        //     <UIcon name="i-lucide-triangle-alert" class="inline size-[1em]" /> Warning. Danger zone!
        //   </p>
        //
        // UIcon compiles to an <svg>, so it's not a pure CSS solution like Font Awesome where
        // you can do <i class="my-icon" />.
        //
        ///////////////////////////////////////////////////////////////////////////
        icon: 'i-lucide-triangle-alert',
        duration: 3000,
        class: '[&_[data-slot=title]]:text-red-500'
      })
      return
    }

    // You could do this if you're always expecting the API to return
    // the deleted resource, but in many cases APIs generally return
    // null data on a delete request.
    // if (typeof data !== 'object') { }

    // Redundant since we're redirecting.
    // user.value = null
    router.push('/users')
  } catch (_err) {
    toast.add({
      title: 'Error!',
      description: 'Unable to delete resource',
      color: 'error',
      icon: 'i-lucide-triangle-alert',
      duration: 3000,
      class: '[&_[data-slot=title]]:text-red-500'
    })
  } finally {
    isDeleting.value = false
  }
}

const initials = (name: string) => {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/* ======================
     Lifecycle Hooks
====================== */

onMounted(() => {
  handleGetUser()
})
</script>

<!-- ======================================================================

======================================================================= -->

<template>
  <!--^ Use max-w-250 -->
  <div class="mx-auto max-w-250">
    <!-- Error UI 
    ❎ Create an alert here and have a Try Again button.
    -->
    <div
      v-if="error"
      class="rounded-lg border border-red-700 bg-red-50 p-4 text-sm text-red-700 shadow"
    >
      <p class="font-semibold">Error!</p>
      <p>{{ error }}</p>
    </div>

    <!-- Loading 
     ❎ Swap to a Spinner.
     -->
    <!-- <div v-else-if="isLoading" class="text-primary text-center text-2xl font-semibold">
      Loading...
    </div> -->

    <div class="mx-auto mt-30 max-w-100" v-else-if="isLoading">
      <FakeProgressBar :duration="sleepTime" />
    </div>

    <!-- Empty / Not Found State 
     ❎ Create an alert here. 
     -->
    <div
      v-else-if="!user"
      class="rounded-lg border border-blue-700 bg-blue-50 p-4 text-sm text-blue-700 shadow"
    >
      <p class="font-semibold">Whoops!</p>
      <p>User not found.</p>
    </div>

    <!-- =============================================
                        Content
    ============================================== -->

    <div v-else class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <!-- ====================
            Left Section
      ===================== -->

      <section
        class="bg-card dark:bg-card/60 relative flex flex-col overflow-hidden rounded-3xl border p-6"
      >
        <div class="bg-primary-500/10 absolute -top-20 -right-20 size-100 rounded-full blur-3xl" />

        <!-- ====================
            Background Grid
        ===================== -->

        <div
          aria-hidden="true"
          class="text-secondary/10 dark:text-secondary/15 pointer-events-none absolute inset-0 -mx-px -mt-px"
          :class="backgroundImage"
          :style="{
            WebkitMaskImage: 'linear-gradient(to bottom, #000, transparent)',
            maskImage: 'linear-gradient(to bottom, #000, transparent)'
          }"
        />

        <!-- ====================

        ===================== -->

        <div class="relative flex flex-1 flex-col">
          <div class="mb-8 flex w-fit items-center justify-between">
            <span class="text-primary-500 font-mono text-xs tracking-[0.2em] uppercase">
              Profile <span class="text-secondary">/</span> {{ String(user.id).padStart(2, '0') }}
            </span>
          </div>

          <div
            class="border-primary-500 bg-primary-100 dark:bg-primary-900/50 text-primary-500 grid size-24 place-items-center rounded-3xl border font-mono text-2xl font-bold"
          >
            {{ initials(user.name) }}
          </div>
          <h1
            class="bracket-heading not-dark:text-secondary/85 mt-7 w-fit font-[Chakra_Petch] text-4xl font-light tracking-tight uppercase sm:text-6xl"
          >
            <span>{{ user.name }}</span>
          </h1>
          <p class="text-secondary mb-6 font-mono text-lg">@{{ user.username.toLowerCase() }}</p>
          <p class="text-secondary mb-6 text-lg italic">
            {{ user.company.catchPhrase }}
          </p>

          <!-- ================ -->

          <div class="mt-auto flex flex-wrap items-center gap-2">
            <span
              class="bg-secondary-200 dark:bg-secondary-600 text-secondary-400 dark:border-secondary rounded-full border border-dashed border-transparent px-3 py-1.5 font-mono text-xs"
            >
              <Activity class="inline-block size-[1.25em]" /> ACTIVE PROFILE
            </span>

            <span
              class="bg-primary-200 dark:bg-primary-900/50 text-primary-500 dark:border-primary-500 rounded-full border border-transparent px-3 py-1.5 font-mono text-xs"
            >
              <Workflow class="inline-block size-[1.25em]" /> VERIFIED NODE
            </span>
          </div>
        </div>

        <!-- ====================
                Controls
        ===================== -->

        <div class="absolute top-6 right-6 space-x-2">
          <button
            @click="router.push(`/users/${props.id}/update`)"
            class="text-muted/65 hover:bg-primary-100 hover:border-primary-500 dark:hover:bg-primary-900/50 hover:text-primary-500 rounded border border-transparent p-1 select-none"
          >
            <Pencil class="inline-block size-[1.25em]" />
          </button>

          <button
            class="text-muted/65 hover:bg-error-100 hover:border-error-500 dark:hover:bg-error-900/50 hover:text-error-500 rounded border border-transparent p-1 select-none"
            :class="{ 'pointer-events-none': isDeleting }"
            @click="handleDeleteUser"
            :disabled="isDeleting"
          >
            <Trash v-if="!isDeleting" class="inline-block size-[1.25em]" />
            <LoaderCircle v-else class="inline-block size-[1.25em] animate-spin" />
          </button>
        </div>
      </section>

      <!-- ====================
            Right Section
      ===================== -->

      <section class="bg-card dark:bg-card/60 relative overflow-hidden rounded-3xl border p-6">
        <p class="text-secondary mb-8 font-mono text-xs tracking-[0.2em] uppercase">
          Connection data
        </p>

        <div class="flex flex-col gap-6">
          <div
            v-for="detail in details"
            :key="detail.label"
            class="flex gap-4 border-(--ui-text)/30 pb-4 not-last:border-b"
          >
            <div
              class="border-primary-500 bg-primary-100 dark:bg-primary-900/50 text-primary-500 grid size-10 shrink-0 place-items-center rounded-xl border"
            >
              <component :is="detail.icon" class="size-4" />
            </div>

            <div class="min-w-0">
              <p class="text-secondary mb-1 font-mono text-sm tracking-wider uppercase">
                {{ detail.label }}
              </p>
              <p class="truncate text-sm">
                {{ detail.value }}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<!-- ======================================================================

======================================================================= -->

<style scoped>
.bracket-heading {
  position: relative;
  padding: 12px 24px;
  margin-bottom: 18px;
  transition: padding 0.2s linear;
}

.bracket-heading:hover {
  color: var(--color-primary-500);
}

.bracket-heading::before,
.bracket-heading::after,
.bracket-heading span::before,
.bracket-heading span::after {
  content: '';
  position: absolute;
  width: 1.5rem;
  height: 1.5rem;
  border: 0.5px solid var(--color-primary-500);
  opacity: 60%;
  transition: all 0.2s linear;
}

.bracket-heading:hover::before,
.bracket-heading:hover::after,
.bracket-heading:hover span::before,
.bracket-heading:hover span::after {
  border-width: 1px;
  opacity: 100%;
}

/* top-left */
.bracket-heading::before {
  top: 0;
  left: 0;
  border-right: none;
  border-bottom: none;
}
/* top-right */
.bracket-heading::after {
  top: 0;
  right: 0;
  border-left: none;
  border-bottom: none;
}
/* bottom-left */
.bracket-heading span::before {
  bottom: 0;
  left: 0;
  border-right: none;
  border-top: none;
}
/* bottom-right */
.bracket-heading span::after {
  bottom: 0;
  right: 0;
  border-left: none;
  border-top: none;
}

/* Hover: pull each bracket inward by 10px */
.bracket-heading:hover::before {
  transform: translate(20px, 10px);
}
.bracket-heading:hover::after {
  transform: translate(-16px, 10px);
}
.bracket-heading:hover span::before {
  transform: translate(20px, -10px);
}
.bracket-heading:hover span::after {
  transform: translate(-16px, -10px);
}
</style>
